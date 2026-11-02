"use client";

import { useCallback } from "react";
import { cn } from "@/lib/utils";
import type { EyeContactStatus } from "@/hooks/use-eye-tracking";

interface CameraPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  /** Pass a stream that changes identity only when it actually changes. */
  srcStream?: MediaStream | null;
  stream?: MediaStream | null;
  mirrored?: boolean;
  recording?: boolean;
  eyeStatus?: EyeContactStatus;
  eyeScore?: number; // 0..1
}

const statusStyles: Record<EyeContactStatus, { dot: string; label: string }> = {
  off: { dot: "bg-zinc-600", label: "Eye AI off" },
  loading: { dot: "bg-amber-400 animate-pulse", label: "Loading model…" },
  idle: { dot: "bg-zinc-400", label: "Searching for face" },
  good: { dot: "bg-emerald-400", label: "Great eye contact" },
  ok: { dot: "bg-yellow-400", label: "Nearly there" },
  poor: { dot: "bg-red-500", label: "Look at the lens" },
};

/**
 * The live webcam tile with a REC indicator and the real-time eye-contact
 * HUD (dot + score bar). The parent's `videoRef` is attached directly to the
 * <video> element so the eye-tracking hook can run MediaPipe detection on it.
 */
export function CameraPreview({
  videoRef,
  srcStream,
  stream,
  mirrored = true,
  recording = false,
  eyeStatus = "off",
  eyeScore = 0,
}: CameraPreviewProps) {
  // Attach the stream imperatively via a callback ref — no state needed, and
  // it re-runs whenever the parent passes a new `srcStream` identity.
  const attachVideo = useCallback(
    (node: HTMLVideoElement | null) => {
      videoRef.current = node;
      const s = srcStream ?? stream;
      if (node && s && node.srcObject !== s) {
        node.srcObject = s;
        node.play().catch(() => undefined);
      }
    },
    [srcStream, stream, videoRef]
  );

  const s = statusStyles[eyeStatus];

  return (
    <div className="gpu-layer relative aspect-video w-full overflow-hidden rounded-2xl border border-zinc-800/80 bg-black shadow-[0_0_60px_rgba(0,0,0,0.6)]">
      <video
        ref={attachVideo}
        autoPlay
        playsInline
        muted
        className={cn(
          "h-full w-full object-cover",
          mirrored && "-scale-x-100"
        )}
      />

      {/* REC badge */}
      {recording && (
        <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 backdrop-blur-sm">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
          <span className="text-xs font-semibold tracking-wider text-white">REC</span>
        </div>
      )}

      {/* Eye-contact HUD */}
      <div className="absolute right-3 top-3 flex items-center gap-2.5 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-sm">
        <span className={cn("h-2.5 w-2.5 rounded-full", s.dot)} />
        <span className="text-xs font-medium text-zinc-200">{s.label}</span>
        {eyeStatus !== "off" && (
          <span className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-zinc-700 sm:block">
            <span
              className="block h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 transition-all duration-300"
              style={{ width: `${Math.round(eyeScore * 100)}%` }}
            />
          </span>
        )}
      </div>

      {!stream && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm text-zinc-500">Camera preview will appear here</p>
        </div>
      )}
    </div>
  );
}
