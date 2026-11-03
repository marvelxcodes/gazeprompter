"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, CameraOff, LogOut, ScanEye } from "lucide-react";
import { signOutFromStudio } from "@/app/actions/auth";
import { cn } from "@/lib/utils";
import { TeleprompterPanel } from "@/components/studio/teleprompter-panel";
import { useCamera } from "@/hooks/use-camera";
import { useVoiceTracking } from "@/hooks/use-voice-tracking";
import { useMediaRecording } from "@/hooks/use-media-recording";
import { useEyeCorrector } from "@/hooks/use-eye-corrector";
import { DEFAULT_SCRIPT } from "@/lib/prompter-script";

const SCRIPT_STORAGE_KEY = "gazeprompter:script";

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * The recording studio — one calm screen, styled after the landing-page
 * product mock (light chrome, blue accents, rounded panels):
 *   - live camera tile with WebGL2 eye-contact correction + REC overlay
 *   - voice-tracked teleprompter that scrolls with fuzzy word-sync
 *   - giant record transport with pause / stop / preview / download
 */
export function StudioClient() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const camera = useCamera();
  const voice = useVoiceTracking();
  const eye = useEyeCorrector();
  const captureCorrectedTrack = useCallback(() => {
    if (!eye.enabled) return null;
    return eye.captureStream(60)?.getVideoTracks()[0] ?? null;
  }, [eye]);

  const recording = useMediaRecording(camera.stream, captureCorrectedTrack);

  const [script, setScript] = useState<string>(() => {
    if (typeof window === "undefined") return DEFAULT_SCRIPT;
    try {
      return localStorage.getItem(SCRIPT_STORAGE_KEY) ?? DEFAULT_SCRIPT;
    } catch {
      return DEFAULT_SCRIPT;
    }
  });
  const [hydrated, setHydrated] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const [fullscreenPrompter, setFullscreenPrompter] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(SCRIPT_STORAGE_KEY, script);
    } catch {
      /* ignore quota errors */
    }
  }, [script, hydrated]);

  // Wire the corrector engine to the DOM nodes once the camera is live.
  useEffect(() => {
    if (camera.stream && canvasRef.current && videoRef.current) {
      eye.attach(canvasRef.current, videoRef.current);
    }
  }, [camera.stream, eye.attach]);

  // Auto-start voice tracking while recording so the prompter follows speech.
  const wasRecording = useRef(false);
  useEffect(() => {
    const nowRecording = recording.status === "recording";
    if (nowRecording && !wasRecording.current && voice.supported && !voice.listening) {
      voice.start();
    }
    wasRecording.current = nowRecording;
  }, [recording.status, voice]);

  // Escape leaves fullscreen prompter.
  useEffect(() => {
    if (!fullscreenPrompter) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFullscreenPrompter(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreenPrompter]);

  const handleStartRecording = () => {
    voice.reset();
    setResetSignal((n) => n + 1);
    recording.start();
  };

  const handleToggleVoice = () => {
    if (voice.listening) voice.stop();
    else voice.start();
  };

  const handleRedo = () => {
    recording.discard();
    voice.reset();
    setResetSignal((n) => n + 1);
  };

  const busy = recording.status === "recording" || recording.status === "paused";
  const eyeOn = eye.enabled;
  const statusLabel =
    recording.status === "recording"
      ? "Recording"
      : recording.status === "paused"
        ? "Paused"
        : recording.status === "stopped"
          ? "Take ready"
          : camera.active
            ? "Ready"
            : "Camera off";

  const eyeBadge = !eyeOn
    ? { dot: "bg-zinc-400", label: "Eye AI off" }
    : eye.status.loading
      ? { dot: "bg-amber-500 animate-pulse", label: "Loading model…" }
      : eye.status.error
        ? { dot: "bg-red-500", label: "Model unavailable" }
        : eye.status.tracking
          ? { dot: "bg-emerald-500 shadow-[0_0_8px_#34d399]", label: "Eye contact on" }
          : { dot: "bg-zinc-400 animate-pulse", label: "Searching for face" };

  return (
    <div className="gp-studio">
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header className="gp-studio-topbar">
        <div className="gp-studio-brand">
          <span className="studio-mini-eye"><ScanEye size={14} /></span>
          <b>GazePrompter</b>
          <span className="gp-studio-crumb">/ Studio</span>
          <span className={cn("gp-status-pill", busy && "gp-status-rec")}>
            <i className={busy ? "bg-red-500" : "bg-emerald-500"} />
            {statusLabel}
          </span>
        </div>
        <div className="gp-studio-actions">
          <span className="hidden text-xs tabular-nums text-zinc-500 md:inline">
            {formatTime(recording.elapsedSeconds)}
          </span>
          <form action={signOutFromStudio}>
            <button type="submit" className="gp-btn-ghost">
              <LogOut size={14} /> <span className="hidden sm:inline">Sign out</span>
            </button>
          </form>
        </div>
      </header>

      {(camera.error || voice.error || eye.status.error || recording.error) && (
        <div className="gp-studio-alert" role="alert">
          {camera.error ?? voice.error ?? eye.status.error ?? recording.error}
        </div>
      )}

      {/* ── Workspace ───────────────────────────────────────────── */}
      <main className={cn("gp-workspace", fullscreenPrompter && "gp-fullscreen")}>
        {/* Left column: camera + transport */}
        <section className={cn("gp-left", fullscreenPrompter && "gp-left-hidden")}>
          <div className="gp-camera-card gpu-layer">
            {/* Hidden raw feed — MediaPipe + WebGL read from this element. */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="gpu-layer absolute inset-0 h-full w-full object-cover opacity-0"
            />
            {/* Visible composited output (corrected when Eye AI is on). */}
            <canvas
              ref={canvasRef}
              className={cn(
                "gpu-layer absolute inset-0 h-full w-full object-cover",
                eyeOn ? "opacity-100" : "opacity-0",
              )}
            />
            {/* Raw fallback path when correction is off. */}
            {!eyeOn && camera.stream && (
              <RawFeed stream={camera.stream} className="absolute inset-0 h-full w-full object-cover" />
            )}

            {!camera.stream && (
              <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-zinc-100 to-zinc-200">
                <div className="flex flex-col items-center gap-3 px-6 text-center">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#3157d5] shadow-sm">
                    <Camera size={20} />
                  </span>
                  <p className="text-sm font-medium text-zinc-700">
                    Your camera preview will appear here
                  </p>
                  <button className="gp-btn-primary" onClick={camera.start} disabled={camera.starting}>
                    <Camera size={15} />
                    {camera.starting ? "Enabling…" : "Enable camera"}
                  </button>
                </div>
              </div>
            )}

            {/* Corner brackets, like the landing mock */}
            <span className="camera-corner corner-tl" />
            <span className="camera-corner corner-tr" />
            <span className="camera-corner corner-bl" />
            <span className="camera-corner corner-br" />

            {/* REC badge */}
            {busy && (
              <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/55 px-3 py-1 text-[11px] font-semibold tracking-wider text-white backdrop-blur-sm">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                REC <span className="tabular-nums">{formatTime(recording.elapsedSeconds)}</span>
              </div>
            )}

            {/* Eye-contact HUD */}
            <div className="absolute right-3 top-3 flex items-center gap-2 rounded-full border border-white/25 bg-black/45 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-md">
              <span className={cn("h-2 w-2 rounded-full", eyeBadge.dot)} />
              {eyeBadge.label}
              {eyeOn && eye.status.tracking && (
                <ScanEye size={13} className="text-emerald-300" />
              )}
            </div>

            {/* Bottom caption strip */}
            <div className="absolute inset-x-3 bottom-3 hidden items-center justify-between text-[11px] text-white/90 sm:flex">
              <span className="rounded-full bg-black/45 px-3 py-1 backdrop-blur-sm">
                {camera.stream ? "Private session — processed on this device" : "Camera offline"}
              </span>
              {eyeOn && (
                <span className="rounded-full bg-[#3157d5]/85 px-3 py-1 font-medium backdrop-blur-sm">
                  Gaze locked to lens
                </span>
              )}
            </div>
          </div>

          {/* Transport toolbar */}
          <div className="gp-toolbar">
            <button
              className="gp-tool-chip"
              onClick={camera.active ? camera.stop : camera.start}
              disabled={!camera.active && camera.starting}
              title={camera.active ? "Turn camera off" : "Turn camera on"}
            >
              {camera.active ? <Camera size={15} /> : <CameraOff size={15} />}
              <span>{camera.active ? "Camera on" : "Camera off"}</span>
            </button>

            <button
              className={cn("gp-tool-chip", voice.listening && "gp-tool-chip-live")}
              onClick={handleToggleVoice}
              disabled={!voice.supported}
              title={voice.supported ? "Toggle voice tracking" : "Speech recognition requires Chrome or Edge"}
            >
              <MicIcon listening={voice.listening} />
              <span>{voice.listening ? "Listening" : "Voice sync"}</span>
            </button>

            <button
              className={cn("gp-tool-chip", eyeOn && "gp-tool-chip-on")}
              onClick={eye.toggle}
              title="Toggle real-time eye contact correction"
            >
              <ScanEye size={15} />
              <span>Eye AI {eyeOn ? "on" : "off"}</span>
            </button>

            {/* Giant record button */}
            <button
              className={cn("gp-record", busy && "gp-record-stop")}
              onClick={() => {
                if (recording.status === "recording") recording.pause();
                else if (recording.status === "paused") recording.resume();
                else if (busy) recording.stop();
                else handleStartRecording();
              }}
              disabled={!camera.active && !busy}
              aria-label={
                recording.status === "recording"
                  ? "Pause recording"
                  : recording.status === "paused"
                    ? "Resume recording"
                    : busy
                      ? "Stop recording"
                      : "Start recording"
              }
            >
              {recording.status === "recording" ? (
                <PauseIcon />
              ) : busy ? (
                <SquareIcon />
              ) : (
                <span className="gp-record-dot" />
              )}
            </button>

            {busy && (
              <button className="gp-tool-chip" onClick={recording.stop}>
                <SquareIcon /> <span>Stop &amp; save</span>
              </button>
            )}
          </div>

          {recording.recordingUrl && (
            <div className="gp-result">
              <div className="gp-result-head">
                <b>Take ready — preview &amp; download</b>
                <div className="flex gap-2">
                  <a href={recording.recordingUrl} download="gazeprompter-take.webm" className="gp-btn-primary">
                    Download .webm
                  </a>
                  <button className="gp-btn-ghost-dark" onClick={handleRedo}>
                    <RotateIcon /> Redo
                  </button>
                </div>
              </div>
              <video src={recording.recordingUrl} controls className="gp-result-video" />
            </div>
          )}
        </section>

        {/* Right column: teleprompter */}
        <section className={cn("gp-right", fullscreenPrompter && "gp-right-full")}>
          <TeleprompterPanel
            script={script}
            onScriptChange={setScript}
            heardWords={voice.heardWords}
            liveWords={voice.liveWords}
            listening={voice.listening}
            voiceSupported={voice.supported}
            interimTranscript={voice.interimTranscript}
            onToggleVoice={handleToggleVoice}
            resetSignal={resetSignal}
            fullscreen={fullscreenPrompter}
            onToggleFullscreen={() => setFullscreenPrompter((v) => !v)}
          />
        </section>
      </main>
    </div>
  );
}

/** Small helper: a second <video> bound to the same stream for the raw path. */
function RawFeed({ stream, className }: { stream: MediaStream; className?: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.srcObject = stream;
    el.play().catch(() => undefined);
  }, [stream]);
  return <video ref={ref} autoPlay playsInline muted className={className} />;
}

function MicIcon({ listening }: { listening: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={listening ? "#059669" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" rx="1.5" />
      <rect x="14" y="4" width="4" height="16" rx="1.5" />
    </svg>
  );
}

function SquareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <rect x="5" y="5" width="14" height="14" rx="2.5" />
    </svg>
  );
}

function RotateIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
