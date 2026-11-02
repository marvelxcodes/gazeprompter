"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type RecorderStatus = "idle" | "recording" | "paused" | "stopped";

function pickMimeType(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
    "video/mp4",
  ];
  return candidates.find((c) => MediaRecorder.isTypeSupported(c)) ?? "";
}

export interface RecordingState {
  status: RecorderStatus;
  /** Seconds elapsed while recording (ticks at ~10Hz). */
  elapsedSeconds: number;
  /** Object URL of the finished recording, null until stopped. */
  recordingUrl: string | null;
  mimeType: string;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  discard: () => void;
}

/**
 * Thin wrapper around MediaRecorder bound to a MediaStream (camera + mic).
 * Produces a Blob-backed object URL on stop so the user can preview and
 * download the take.
 */
export function useMediaRecording(stream: MediaStream | null): RecordingState {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef<number>(0);
  const accumulatedRef = useRef<number>(0); // ms before current segment
  const urlRef = useRef<string | null>(null);

  const cleanupTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    const ms =
      accumulatedRef.current + (Date.now() - startedAtRef.current);
    setElapsedSeconds(Math.floor(ms / 1000));
  }, []);

  const beginTimer = useCallback(() => {
    startedAtRef.current = Date.now();
    cleanupTimer();
    timerRef.current = setInterval(tick, 100);
  }, [cleanupTimer, tick]);

  const start = useCallback(() => {
    if (!stream || recorderRef.current) return;
    const mime = pickMimeType();
    const recorder = new MediaRecorder(stream, {
      mimeType: mime || undefined,
      videoBitsPerSecond: 8_000_000,
    });
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: recorder.mimeType || "video/webm",
      });
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      setRecordingUrl(url);
      setStatus("stopped");
      cleanupTimer();
      recorderRef.current = null;
    };

    recorder.start(1000); // gather chunks every second (crash-resilient)
    recorderRef.current = recorder;
    accumulatedRef.current = 0;
    setElapsedSeconds(0);
    setRecordingUrl(null);
    setStatus("recording");
    beginTimer();
  }, [stream, beginTimer, cleanupTimer]);

  const pause = useCallback(() => {
    const rec = recorderRef.current;
    if (!rec || rec.state !== "recording") return;
    rec.pause();
    accumulatedRef.current += Date.now() - startedAtRef.current;
    cleanupTimer();
    setStatus("paused");
  }, [cleanupTimer]);

  const resume = useCallback(() => {
    const rec = recorderRef.current;
    if (!rec || rec.state !== "paused") return;
    rec.resume();
    setStatus("recording");
    beginTimer();
  }, [beginTimer]);

  const stop = useCallback(() => {
    const rec = recorderRef.current;
    if (!rec || rec.state === "inactive") return;
    rec.stop();
  }, []);

  const discard = useCallback(() => {
    const rec = recorderRef.current;
    if (rec && rec.state !== "inactive") {
      rec.onstop = null; // don't produce a URL
      rec.stop();
    }
    recorderRef.current = null;
    cleanupTimer();
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    setRecordingUrl(null);
    setElapsedSeconds(0);
    accumulatedRef.current = 0;
    setStatus("idle");
  }, [cleanupTimer]);

  // Revoke the object URL on unmount.
  useEffect(() => {
    return () => {
      cleanupTimer();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      const rec = recorderRef.current;
      if (rec && rec.state !== "inactive") rec.stop();
    };
  }, [cleanupTimer]);

  return {
    status,
    elapsedSeconds,
    recordingUrl,
    mimeType: pickMimeType(),
    start,
    pause,
    resume,
    stop,
    discard,
  };
}
