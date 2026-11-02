"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Manages the user's webcam + microphone via getUserMedia. Exposes the raw
 * MediaStream so both the <video> preview and MediaRecorder can share it.
 */
export function useCamera() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const start = useCallback(async () => {
    if (streamRef.current) return;
    setStarting(true);
    setError(null);
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: "user",
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      streamRef.current = media;
      setStream(media);
    } catch (err) {
      const name = err instanceof DOMException ? err.name : "";
      if (name === "NotAllowedError") {
        setError(
          "Camera permission was denied. Allow access in your browser settings and try again."
        );
      } else if (name === "NotFoundError") {
        setError("No camera or microphone was found on this device.");
      } else {
        setError("Could not start the camera. Check that no other app is using it.");
      }
    } finally {
      setStarting(false);
    }
  }, []);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStream(null);
  }, []);

  // Clean up tracks when the component using the hook unmounts.
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return {
    stream,
    error,
    starting,
    active: stream !== null,
    start,
    stop,
  };
}
