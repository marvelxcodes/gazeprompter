"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Mic, MicOff, PencilLine, RotateCcw, Type } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  countWords,
  findCurrentLine,
  flattenWords,
  parseScript,
} from "@/lib/prompter-script";

interface TeleprompterProps {
  script: string;
  onScriptChange: (value: string) => void;
  /** Normalized words heard so far from the speech recognizer. */
  heardWords: string[];
  listening: boolean;
  voiceSupported: boolean;
  interimTranscript: string;
  onToggleVoice: () => void;
  /** Reset word-sync progress (call when a new take starts). */
  resetSignal: number;
}

type Mode = "prompter" | "edit";

/**
 * Voice-tracked teleprompter. The script is rendered as large centered lines;
 * a tolerant word-sync algorithm maps the speech-recognizer stream onto the
 * script and keeps the active line in the sweet-spot near the top of the view
 * (right under the camera), so the speaker's eyes stay near the lens.
 */
export function Teleprompter({
  script,
  onScriptChange,
  heardWords,
  listening,
  voiceSupported,
  interimTranscript,
  onToggleVoice,
  resetSignal,
}: TeleprompterProps) {
  const [mode, setMode] = useState<Mode>("prompter");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<HTMLParagraphElement | null>(null);

  const lines = useMemo(() => parseScript(script), [script]);
  const words = useMemo(() => flattenWords(lines), [lines]);
  const totalWords = useMemo(() => countWords(lines), [lines]);

  // Word-sync: furthest script line reached given what we've heard.
  const currentLine = useMemo(
    () => (heardWords.length > 0 ? findCurrentLine(words, heardWords) : 0),
    [words, heardWords]
  );

  // Smooth-scroll the active line to the focal band near the top.
  useEffect(() => {
    if (mode !== "prompter") return;
    const container = scrollRef.current;
    const el = activeRef.current;
    if (!container || !el) return;
    const target = el.offsetTop - container.clientHeight * 0.18;
    container.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
  }, [currentLine, mode]);

  // New take → snap back to the top.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [resetSignal]);

  const progress =
    lines.length > 1 ? Math.min(1, currentLine / (lines.length - 1)) : 0;

  return (
    <div className="relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-zinc-800/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <Badge className={cn(listening && "border-emerald-500/40 text-emerald-300")}>
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                listening ? "animate-pulse bg-emerald-400" : "bg-zinc-500"
              )}
            />
            {listening ? "Listening — voice tracking" : "Voice tracking idle"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={listening ? "secondary" : "primary"}
            onClick={onToggleVoice}
            disabled={!voiceSupported}
            title={
              voiceSupported
                ? "Toggle voice-tracked scrolling"
                : "Speech recognition requires Chrome or Edge"
            }
          >
            {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {listening ? "Stop mic" : "Start mic"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setMode(mode === "prompter" ? "edit" : "prompter")}
          >
            {mode === "prompter" ? (
              <PencilLine className="h-4 w-4" />
            ) : (
              <Type className="h-4 w-4" />
            )}
            {mode === "prompter" ? "Edit script" : "Show prompter"}
          </Button>
        </div>
      </div>

      {!voiceSupported && (
        <p className="border-b border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs text-amber-300">
          Your browser doesn&apos;t support speech recognition — use Chrome or
          Edge for voice-tracked scrolling. Manual scrolling still works here.
        </p>
      )}

      {/* Body */}
      {mode === "edit" ? (
        <div className="flex flex-1 flex-col gap-3 p-4">
          <textarea
            value={script}
            onChange={(e) => onScriptChange(e.target.value)}
            spellCheck={false}
            className="min-h-0 flex-1 resize-none rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 font-mono text-sm leading-relaxed text-zinc-200 outline-none focus:border-zinc-600"
            placeholder="Paste or write your script here…"
          />
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>{totalWords} words · ~{Math.max(1, Math.round(totalWords / 140))} min at natural pace</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setMode("prompter")}
            >
              <RotateCcw className="h-3.5 w-3.5" /> Done editing
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div
            ref={scrollRef}
            className="prompter-scroll relative flex-1 overflow-y-auto px-6 py-10"
          >
            {/* focal gradient masks */}
            <div className="pointer-events-none sticky top-0 z-10 -mt-10 h-10 bg-gradient-to-b from-zinc-950 to-transparent" />
            {lines.map((line, i) => (
              <p
                key={line.id}
                ref={i === currentLine ? activeRef : undefined}
                className={cn(
                  "mx-auto max-w-3xl py-3 text-center text-2xl leading-snug tracking-tight transition-all duration-500 md:text-3xl",
                  i === currentLine
                    ? "text-white"
                    : i < currentLine
                      ? "text-zinc-600"
                      : "text-zinc-400"
                )}
              >
                {line.text}
              </p>
            ))}
            <div className="pointer-events-none sticky bottom-0 h-16 bg-gradient-to-t from-zinc-950 to-transparent" />
          </div>

          {/* Live transcript strip */}
          <div className="flex items-center justify-between gap-4 border-t border-zinc-800/80 px-4 py-2">
            <p className="truncate text-xs italic text-zinc-500">
              {interimTranscript ? `“${interimTranscript}”` : "Speak and the script follows you…"}
            </p>
            <span className="shrink-0 text-xs tabular-nums text-zinc-500">
              {Math.round(progress * 100)}%
            </span>
          </div>
          {/* progress bar */}
          <div className="h-0.5 w-full bg-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-400 transition-all duration-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
}
