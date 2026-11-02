"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, LogOut, VideoOff } from "lucide-react";
import { signOutFromStudio } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { CameraPreview } from "@/components/studio/camera-preview";
import { Teleprompter } from "@/components/studio/teleprompter";
import { RecordingControls } from "@/components/studio/recording-controls";
import { useCamera } from "@/hooks/use-camera";
import { useVoiceTracking } from "@/hooks/use-voice-tracking";
import { useMediaRecording } from "@/hooks/use-media-recording";
import { useEyeTracking } from "@/hooks/use-eye-tracking";
import { DEFAULT_SCRIPT } from "@/lib/prompter-script";

const SCRIPT_STORAGE_KEY = "promptvision:script";

/**
 * The recording studio — orchestrates all four engines:
 *   1. Camera (getUserMedia) + live mirrored preview
 *   2. Voice-tracked teleprompter (Web Speech → word-sync)
 *   3. MediaPipe eye-contact meter (HUD on the preview)
 *   4. MediaRecorder transport with preview & download
 */
export function StudioClient() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const camera = useCamera();
  const voice = useVoiceTracking();
  const recording = useMediaRecording(camera.stream);
  const eye = useEyeTracking(videoRef);

  // Script state, persisted locally so a refresh mid-session doesn't lose it.
  // Lazy initializer: reads localStorage during the first render (client only),
  // avoiding a cascading setState-in-effect render.
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

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(SCRIPT_STORAGE_KEY, script);
    } catch {
      /* ignore quota errors */
    }
  }, [script, hydrated]);

  // Auto-start voice tracking while recording so the prompter follows speech.
  const wasRecording = useRef(false);
  useEffect(() => {
    const nowRecording = recording.status === "recording";
    if (nowRecording && !wasRecording.current && voice.supported && !voice.listening) {
      voice.start();
    }
    wasRecording.current = nowRecording;
  }, [recording.status, voice]);

  const handleStartRecording = () => {
    // Fresh take: reset word-sync + scroll position.
    voice.reset();
    setResetSignal((n) => n + 1);
    recording.start();
  };

  const handleToggleVoice = () => {
    if (voice.listening) voice.stop();
    else voice.start();
  };

  const handleToggleEye = () => {
    if (eye.status === "off") eye.enable();
    else eye.disable();
  };

  const handleRedo = () => {
    recording.discard();
    voice.reset();
    setResetSignal((n) => n + 1);
  };

  const statusLabel = useMemo(() => {
    switch (recording.status) {
      case "recording":
        return "Recording…";
      case "paused":
        return "Paused";
      case "stopped":
        return "Take ready — preview & download below";
      default:
        return camera.active ? "Ready" : "Camera off";
    }
  }, [recording.status, camera.active]);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col gap-5 px-4 py-6 md:px-8">
      {/* Top bar */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold tracking-tight text-white">
            PromptVision <span className="text-zinc-500">Studio</span>
          </span>
          <span className="hidden rounded-full border border-zinc-700/60 bg-white/5 px-3 py-1 text-xs text-zinc-300 sm:inline">
            {statusLabel}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!camera.active ? (
            <Button variant="secondary" size="md" onClick={camera.start} disabled={camera.starting}>
              <Camera className="h-4 w-4" />
              {camera.starting ? "Enabling…" : "Enable camera"}
            </Button>
          ) : (
            <Button variant="outline" size="md" onClick={camera.stop} disabled={recording.status === "recording"}>
              <VideoOff className="h-4 w-4" />
              Turn off camera
            </Button>
          )}
          <form action={signOutFromStudio}>
            <Button variant="ghost" size="md" type="submit">
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </form>
        </div>
      </header>

      {(camera.error || voice.error || eye.error) && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {camera.error ?? voice.error ?? eye.error}
        </div>
      )}

      {/* Main grid: camera + controls left, teleprompter right */}
      <main className="grid flex-1 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <section className="flex flex-col gap-4">
          <CameraPreview
            videoRef={videoRef}
            stream={camera.stream}
            recording={recording.status === "recording"}
            eyeStatus={eye.status}
            eyeScore={eye.score}
          />
          <RecordingControls
            status={recording.status}
            elapsedSeconds={recording.elapsedSeconds}
            cameraActive={camera.active}
            eyeEnabled={eye.status !== "off"}
            recordingUrl={recording.recordingUrl}
            onStart={handleStartRecording}
            onPause={recording.pause}
            onResume={recording.resume}
            onStop={recording.stop}
            onRedo={handleRedo}
            onToggleEye={handleToggleEye}
          />
          {recording.recordingUrl && (
            <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-black">
              <video src={recording.recordingUrl} controls className="w-full" />
            </div>
          )}
        </section>

        <section className="min-h-[420px]">
          <Teleprompter
            script={script}
            onScriptChange={setScript}
            heardWords={voice.heardWords}
            listening={voice.listening}
            voiceSupported={voice.supported}
            interimTranscript={voice.interimTranscript}
            onToggleVoice={handleToggleVoice}
            resetSignal={resetSignal}
          />
        </section>
      </main>
    </div>
  );
}
