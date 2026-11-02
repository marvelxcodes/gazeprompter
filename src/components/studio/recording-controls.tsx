"use client";

import { Download, Eye, Pause, Play, RotateCcw, Square, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RecorderStatus } from "@/hooks/use-media-recording";

interface RecordingControlsProps {
  status: RecorderStatus;
  elapsedSeconds: number;
  cameraActive: boolean;
  eyeEnabled: boolean;
  recordingUrl: string | null;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onRedo: () => void;
  onToggleEye: () => void;
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Transport bar for the studio: record / pause / stop, a live timer, the
 * eye-contact toggle, and preview + download once a take is finished.
 */
export function RecordingControls({
  status,
  elapsedSeconds,
  cameraActive,
  eyeEnabled,
  recordingUrl,
  onStart,
  onPause,
  onResume,
  onStop,
  onRedo,
  onToggleEye,
}: RecordingControlsProps) {
  const canRecord = cameraActive && (status === "idle" || status === "stopped");

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 px-4 py-3 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {/* Primary transport */}
        {status === "recording" ? (
          <>
            <Button variant="secondary" size="md" onClick={onPause}>
              <Pause className="h-4 w-4" /> Pause
            </Button>
            <Button variant="primary" size="md" onClick={onStop}>
              <Square className="h-4 w-4 fill-current" /> Stop
            </Button>
          </>
        ) : status === "paused" ? (
          <Button variant="primary" size="md" onClick={onResume}>
            <Play className="h-4 w-4" /> Resume
          </Button>
        ) : (
          <Button variant="primary" size="md" onClick={onStart} disabled={!canRecord}>
            <Video className="h-4 w-4" />
            {status === "stopped" ? "Record again" : "Start recording"}
          </Button>
        )}

        {/* Timer */}
        <span
          className={
            status === "recording"
              ? "font-mono text-sm tabular-nums text-red-400"
              : "font-mono text-sm tabular-nums text-zinc-500"
          }
        >
          {formatTime(elapsedSeconds)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={eyeEnabled ? "secondary" : "outline"}
          size="md"
          onClick={onToggleEye}
        >
          <Eye className="h-4 w-4" />
          Eye contact AI {eyeEnabled ? "on" : "off"}
        </Button>

        {recordingUrl && (
          <>
            <a href={recordingUrl} download="promptvision-take.webm">
              <Button variant="ghost" size="md">
                <Download className="h-4 w-4" /> Download
              </Button>
            </a>
            <Button variant="ghost" size="md" onClick={onRedo}>
              <RotateCcw className="h-4 w-4" /> Redo take
            </Button>
          </>
        )}
      </div>

      {!cameraActive && (
        <p className="w-full text-right text-xs text-zinc-500">
          Enable the camera above to start recording.
        </p>
      )}
    </div>
  );
}
