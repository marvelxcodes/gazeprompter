"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AudioLines,
  Maximize2,
  MicOff,
  Minimize2,
  PencilLine,
  RotateCcw,
  Type,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  countWords,
  findCurrentWord,
  flattenWords,
  normalizeWord,
  parseScript,
} from "@/lib/prompter-script";

interface TeleprompterPanelProps {
  script: string;
  onScriptChange: (value: string) => void;
  /** Finalized words heard so far from the speech recognizer. */
  heardWords: string[];
  /** In-flight interim words — makes scrolling react mid-sentence. */
  liveWords: string[];
  listening: boolean;
  voiceSupported: boolean;
  interimTranscript: string;
  onToggleVoice: () => void;
  /** Increment to snap back to the top (new take). */
  resetSignal: number;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
}

type Mode = "prompter" | "edit";

/**
 * Voice-tracked teleprompter styled after the landing-page mock: white card,
 * blue accents, active line highlighted with a left rule and lifted into a
 * focal band just under the camera tile.
 *
 * Auto-scroll engine:
 *   1. Fuzzy word-sync maps the recognized stream (finals + interim) onto the
 *      script's flattened word list → current word index.
 *   2. The current word is resolved to its line and pixel offset.
 *   3. A rAF loop eases `scrollTop` toward the target (spring-like lerp),
 *      which reads far smoother than discrete scrollTo jumps and keeps up
 *      with fast or halting speech. Manual wheel/touch input pauses
 *      auto-follow for a few seconds, then it re-engages.
 */
export function TeleprompterPanel({
  script,
  onScriptChange,
  heardWords,
  liveWords,
  listening,
  voiceSupported,
  interimTranscript,
  onToggleVoice,
  resetSignal,
  fullscreen,
  onToggleFullscreen,
}: TeleprompterPanelProps) {
  const [mode, setMode] = useState<Mode>("prompter");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const lines = useMemo(() => parseScript(script), [script]);
  const words = useMemo(() => flattenWords(lines), [lines]);
  const totalWords = useMemo(() => countWords(lines), [lines]);

  // Word-sync over finalized + in-flight words.
  const spoken = useMemo(
    () => [...heardWords, ...liveWords.map(normalizeWord).filter(Boolean)],
    [heardWords, liveWords],
  );
  const currentWord = useMemo(
    () => (listening || heardWords.length > 0 ? findCurrentWord(words, spoken) : 0),
    [words, spoken, listening, heardWords.length],
  );
  const currentLine = useMemo(() => {
    if (currentWord === 0) return 0;
    // Look ahead one word: when the speaker finishes a line, pull focus to
    // the *next* line instead of leaving the last word stranded at the top.
    const idx = Math.min(currentWord, words.length - 1);
    return words[idx]?.lineIndex ?? 0;
  }, [currentWord, words]);

  // ---- smooth eased auto-scroll -------------------------------------------
  const followUntilRef = useRef(0); // timestamp: manual override expires here
  const targetTopRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const computeTarget = useCallback(() => {
    const container = scrollRef.current;
    const el = lineRefs.current[currentLine];
    if (!container || !el) return null;
    // Put the active line ~22% down the viewport — right under the camera.
    return Math.max(0, el.offsetTop - container.clientHeight * 0.22);
  }, [currentLine]);

  useEffect(() => {
    if (mode !== "prompter") return;
    targetTopRef.current = computeTarget();
  }, [currentWord, mode, computeTarget, lines.length]);

  useEffect(() => {
    if (mode !== "prompter") return;
    const container = scrollRef.current;
    if (!container) return;

    let last = performance.now();
    const stepFn = (now: number) => {
      const dt = Math.min(48, now - last) / 16.67; // frame-normalized
      last = now;
      const tgt = targetTopRef.current;
      const manual = now < followUntilRef.current;
      if (tgt !== null && !manual) {
        const cur = container.scrollTop;
        const delta = tgt - cur;
        if (Math.abs(delta) > 0.5) {
          // Critically-damped-ish ease: proportional, capped per frame.
          const stepAmt = Math.sign(delta) * Math.min(Math.abs(delta) * 0.16 * dt, 26 * dt);
          container.scrollTop = cur + stepAmt;
        }
      }
      rafRef.current = requestAnimationFrame(stepFn);
    };
    rafRef.current = requestAnimationFrame(stepFn);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [mode]);

  // Pause auto-follow when the user scrolls manually; resume after 4s.
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const onManual = () => {
      followUntilRef.current = performance.now() + 4000;
    };
    container.addEventListener("wheel", onManual, { passive: true });
    container.addEventListener("touchmove", onManual, { passive: true });
    return () => {
      container.removeEventListener("wheel", onManual);
      container.removeEventListener("touchmove", onManual);
    };
  }, []);

  // New take → snap back to the top and clear overrides.
  useEffect(() => {
    followUntilRef.current = 0;
    targetTopRef.current = 0;
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [resetSignal]);

  const progress = words.length > 0 ? currentWord / words.length : 0;

  return (
    <div className="gp-prompter-card">
      {/* Header */}
      <div className="gp-prompter-head">
        <div className="gp-prompter-title">
          <AudioLines size={15} className="text-[#3157d5]" />
          <span>MY SCRIPT</span>
          <span
            className={cn(
              "gp-listen-chip",
              listening && "gp-listen-chip-on",
            )}
            title={listening ? "Following your voice" : "Voice tracking idle"}
          >
            <i />
            {listening ? "Following your voice" : "Voice tracking idle"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            className="gp-icon-btn"
            onClick={onToggleVoice}
            disabled={!voiceSupported}
            title={
              voiceSupported
                ? "Toggle voice-tracked scrolling"
                : "Speech recognition requires Chrome or Edge"
            }
            aria-label="Toggle voice tracking"
          >
            {listening ? <MicOff size={15} /> : <AudioLines size={15} />}
          </button>
          <button
            className="gp-icon-btn"
            onClick={() => setMode(mode === "prompter" ? "edit" : "prompter")}
            title={mode === "prompter" ? "Edit script" : "Show prompter"}
            aria-label={mode === "prompter" ? "Edit script" : "Show prompter"}
          >
            {mode === "prompter" ? <PencilLine size={15} /> : <Type size={15} />}
          </button>
          <button
            className="gp-icon-btn"
            onClick={onToggleFullscreen}
            title={fullscreen ? "Exit fullscreen (Esc)" : "Fullscreen prompter"}
            aria-label="Toggle fullscreen prompter"
          >
            {fullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {!voiceSupported && mode === "prompter" && (
        <p className="gp-prompter-warn">
          Your browser doesn&apos;t support speech recognition — use Chrome or
          Edge for voice-tracked scrolling. Manual scrolling still works.
        </p>
      )}

      {/* Body */}
      {mode === "edit" ? (
        <div className="gp-prompter-edit">
          <textarea
            value={script}
            onChange={(e) => onScriptChange(e.target.value)}
            spellCheck={false}
            className="gp-script-input"
            placeholder="Paste or write your script here…"
          />
          <div className="gp-edit-foot">
            <span>
              {totalWords} words · ~{Math.max(1, Math.round(totalWords / 140))} min at natural pace
            </span>
            <button className="gp-btn-primary gp-btn-sm" onClick={() => setMode("prompter")}>
              <RotateCcw size={13} /> Done editing
            </button>
          </div>
        </div>
      ) : (
        <>
          <div ref={scrollRef} className="gp-prompter-scroll">
            <div className="gp-prompter-pad">
              {lines.map((line, i) => (
                <p
                  key={line.id}
                  ref={(el) => {
                    lineRefs.current[i] = el;
                  }}
                  className={cn(
                    "gp-line",
                    i === currentLine && "gp-line-active",
                    i < currentLine && "gp-line-read",
                  )}
                >
                  {line.text}
                </p>
              ))}
              <div className="h-[35vh]" />
            </div>
          </div>

          {/* Footer: live transcript + progress */}
          <div className="gp-prompter-foot">
            <p className="gp-transcript" aria-live="polite">
              {interimTranscript
                ? `“${interimTranscript}”`
                : listening
                  ? "Speak and the script follows you…"
                  : "Press record — voice tracking starts automatically."}
            </p>
            <span className="gp-progress-num">{Math.round(progress * 100)}%</span>
          </div>
          <div className="gp-progress-track">
            <div
              className="gp-progress-fill"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
}
