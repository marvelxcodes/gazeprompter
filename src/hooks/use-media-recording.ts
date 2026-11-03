"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type RecordingStatus =
  | "idle"
  | "recording"
  | "paused"
  | "stopped"
  | "error";

export interface RecordingState {
  status: RecordingStatus;
  elapsedSeconds: number;
  recordingUrl: string | null;
  error: string | null;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  discard: () => void;
}

const MIME_CANDIDATES = [
  "video/webm;codecs=vp9,opus",
  "video/webm;codecs=vp8,opus",
  "video/webm;codecs=vp9",
  "video/webm",
];

/**
 * MediaRecorder wrapper. `stream` supplies the audio track (mic). The video
 * track comes from `getCorrectedVideoTrack()` when real-time eye-contact
 * correction is active — that returns a WebGL-composited canvas track whose
 * pixels keep updating during recording, so downloads contain the corrected
 * footage; otherwise we use the camera track directly.
 */
export function useMediaRecording(
  stream: MediaStream | null,
  getCorrectedVideoTrack?: () => MediaStreamTrack | null,
): RecordingState {
  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const startedAtRef = useRef(0);
  const accumulatedRef = useRef(0);
  const urlRef = useRef<string | null>(null);
  const getterRef = useRef(getCorrectedVideoTrack);
  getterRef.current = getCorrectedVideoTrack;

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const tick = useCallback(() => {
    setElapsedSeconds(
      accumulatedRef.current +
        Math.floor((Date.now() - startedAtRef.current) / 1000),
    );
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    startedAtRef.current = Date.now();
    timerRef.current = window.setInterval(tick, 250);
  }, [tick]);

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      accumulatedRef.current += Math.floor(
        (Date.now() - startedAtRef.current) / 1000,
      );
      clearTimer();
    }
  }, []);

  const start = useCallback(() => {
    setError(null);
    if (!stream) {
      setStatus("error");
      setError("Enable your camera before recording.");
      return;
    }
    if (typeof MediaRecorder === "undefined") {
      setStatus("error");
      setError("Recording is not supported in this browser.");
      return;
    }

    // Prefer the live WebGL-composited canvas track when Eye AI is on.
    const corrected = getterRef.current?.() ?? null;
    const videoTrack = corrected ?? stream.getVideoTracks()[0] ?? null;
    const audioTracks = stream.getAudioTracks();

    const outStream = new MediaStream();
    if (videoTrack) outStream.addTrack(videoTrack);
    for (const t of audioTracks) outStream.addTrack(t);

    const mimeType = MIME_CANDIDATES.find((type) =>
      MediaRecorder.isTypeSupported(type),
    );

    try {
      const rec = new MediaRecorder(
        outStream,
        mimeType ? { mimeType, videoBitsPerSecond: 4_000_000 } : undefined,
      );
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onerror = () => {
        setStatus("error");
        setError("The recorder hit an unexpected error.");
        stopTimer();
      };
      rec.start(1000);
      recorderRef.current = rec;
      accumulatedRef.current = 0;
      setElapsedSeconds(0);
      startTimer();
      setStatus("recording");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Could not start recording.");
    }
  }, [stream, startTimer, stopTimer]);

  const pause = useCallback(() => {
    const rec = recorderRef.current;
    if (rec && rec.state === "recording") {
      rec.pause();
      stopTimer();
      setStatus("paused");
    }
  }, [stopTimer]);

  const resume = useCallback(() => {
    const rec = recorderRef.current;
    if (rec && rec.state === "paused") {
      rec.resume();
      startTimer();
      setStatus("recording");
    }
  }, [startTimer]);

  const finalize = useCallback(() => {
    const blob = new Blob(chunksRef.current, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = url;
    setRecordingUrl(url);
    setStatus("stopped");
  }, []);

  const stop = useCallback(() => {
    const rec = recorderRef.current;
    stopTimer();
    if (rec && (rec.state === "recording" || rec.state === "paused")) {
      rec.onstop = () => finalize();
      rec.stop();
    } else {
      finalize();
    }
    recorderRef.current = null;
  }, [finalize, stopTimer]);

  const discard = useCallback(() => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    setRecordingUrl(null);
    chunksRef.current = [];
    accumulatedRef.current = 0;
    setElapsedSeconds(0);
    setStatus("idle");
  }, []);

  useEffect(() => {
    return () => {
      clearTimer();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      const rec = recorderRef.current;
      if (rec && rec.state !== "inactive") rec.stop();
    };
  }, []);

  return {
    status,
    elapsedSeconds,
    recordingUrl,
    error,
    start,
    pause,
    resume,
    stop,
    discard,
  };
}
