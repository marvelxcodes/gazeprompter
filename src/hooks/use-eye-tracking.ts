"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ---- Public types -------------------------------------------------------

export type EyeContactStatus = "off" | "loading" | "idle" | "good" | "ok" | "poor";

export interface EyeTrackingState {
  status: EyeContactStatus;
  /** 0..1 — how centered the gaze is on the camera lens. */
  score: number;
  /** Horizontal gaze offset in degrees (negative = looking left). */
  yawDeg: number;
  error: string | null;
  enable: () => void;
  disable: () => void;
}

// ---- Tuning constants ---------------------------------------------------

const SAMPLE_INTERVAL_MS = 250; // analyse ~4 frames per second
const GOOD_THRESHOLD = 0.72;
const OK_THRESHOLD = 0.45;

/**
 * Maps normalized iris offsets (per eye, relative to eye-corner span) to a
 * 0..1 eye-contact score. Offsets beyond EDGE_LIMIT look clearly off-camera.
 */
const EDGE_LIMIT = 0.62;

interface IrisBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

function irisCenter(box: IrisBox) {
  return { x: (box.minX + box.maxX) / 2, y: (box.minY + box.maxY) / 2 };
}

function scoreFromOffsets(dx: number, dy: number): number {
  const mag = Math.hypot(dx, dy);
  return Math.max(0, Math.min(1, 1 - mag / EDGE_LIMIT));
}

// ---- Hook ----------------------------------------------------------------

/**
 * Real-time eye-contact meter built on MediaPipe Face Landmarker
 * (@mediapipe/tasks-vision). Runs a reference-counted detection loop over the
 * live <video> element: multiple consumers (meter UI, correction engine) share
 * one model instance and one rAF loop.
 *
 * Gaze math: for each eye we take the iris center (landmarks 468-472 /
 * 473-477) relative to the eye corners (33/133, 362/263), producing a
 * normalized horizontal+vertical offset. Small offsets ⇒ looking at the lens.
 */
export function useEyeTracking(videoRef: React.RefObject<HTMLVideoElement | null>): EyeTrackingState {
  const [status, setStatus] = useState<EyeContactStatus>("off");
  const [score, setScore] = useState(0);
  const [yawDeg, setYawDeg] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const enabledRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastSampleRef = useRef(0);
  // Holds the loop so `loop` can re-schedule itself without a
  // self-reference (satisfies react-hooks lint rules).
  const loopRef = useRef<() => void>(() => {});
  const landmarkerRef = useRef<Awaited<
    ReturnType<typeof import("@mediapipe/tasks-vision").FaceLandmarker.createFromOptions>
  > | null>(null);
  const runningRef = useRef(false);

  const ensureModel = useCallback(async () => {
    if (landmarkerRef.current || runningRef.current) return;
    runningRef.current = true;
    setStatus("loading");
    try {
      const { FilesetResolver, FaceLandmarker } = await import(
        "@mediapipe/tasks-vision"
      );
      const fileset = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      landmarkerRef.current = await FaceLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numFaces: 1,
        outputFaceBlendshapes: false,
        outputFacialTransformationMatrixes: false,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? `Could not load the eye-tracking model: ${err.message}`
          : "Could not load the eye-tracking model."
      );
      setStatus(enabledRef.current ? "idle" : "off");
    } finally {
      runningRef.current = false;
    }
  }, []);

  const loop = useCallback(() => {
    const video = videoRef.current;
    const lm = landmarkerRef.current;

    if (!enabledRef.current) {
      rafRef.current = null;
      return;
    }
    if (video && lm && video.readyState >= 2 && !runningRef.current) {
      const now = performance.now();
      if (now - lastSampleRef.current >= SAMPLE_INTERVAL_MS) {
        lastSampleRef.current = now;
        try {
          const result = lm.detectForVideo(video, now);
          const face = result.faceLandmarks?.[0];
          if (face && face.length > 477) {
            // Left eye (image-left): corners 33 (outer) & 133 (inner)
            const leftCorners = [face[33], face[133]];
            const leftIris = face.slice(468, 473);
            // Right eye: corners 362 (inner) & 263 (outer)
            const rightCorners = [face[362], face[263]];
            const rightIris = face.slice(473, 478);

            const boxOf = (pts: { x: number; y: number }[]): IrisBox => ({
              minX: Math.min(...pts.map((p) => p.x)),
              maxX: Math.max(...pts.map((p) => p.x)),
              minY: Math.min(...pts.map((p) => p.y)),
              maxY: Math.max(...pts.map((p) => p.y)),
            });

            const normOffset = (iris: typeof leftIris, corners: typeof leftCorners) => {
              const ib = boxOf(iris);
              const cb = boxOf(corners);
              const c = irisCenter(ib);
              const width = Math.max(cb.maxX - cb.minX, 1e-6);
              const height = Math.max(cb.maxY - cb.minY, 1e-6);
              const eyeMidX = (cb.minX + cb.maxX) / 2;
              const eyeMidY = (cb.minY + cb.maxY) / 2;
              return { dx: (c.x - eyeMidX) / width, dy: (c.y - eyeMidY) / height };
            };

            const l = normOffset(leftIris, leftCorners);
            const r = normOffset(rightIris, rightCorners);
            const dx = (l.dx + r.dx) / 2;
            const dy = (l.dy + r.dy) / 2;
            const s = scoreFromOffsets(dx, dy);
            // Rough horizontal angle: iris offset across half the eye span.
            const approxYaw = Math.max(-40, Math.min(40, dx * 60));

            setScore(s);
            setYawDeg(approxYaw);
            setStatus(s >= GOOD_THRESHOLD ? "good" : s >= OK_THRESHOLD ? "ok" : "poor");
          } else {
            setStatus("idle"); // no face in frame
          }
        } catch {
          /* transient detect errors — skip this sample */
        }
      }
    }
    rafRef.current = requestAnimationFrame(() => loopRef.current());
  }, [videoRef]);

  loopRef.current = loop;

  const enable = useCallback(() => {
    if (enabledRef.current) return;
    enabledRef.current = true;
    setError(null);
    void ensureModel().then(() => {
      if (enabledRef.current && landmarkerRef.current) setStatus("idle");
      if (enabledRef.current && rafRef.current === null) {
        rafRef.current = requestAnimationFrame(loop);
      }
    });
  }, [ensureModel, loop]);

  const disable = useCallback(() => {
    enabledRef.current = false;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setStatus("off");
    setScore(0);
    setYawDeg(0);
  }, []);

  useEffect(() => {
    return () => {
      enabledRef.current = false;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
    };
  }, []);

  return { status, score, yawDeg, error, enable, disable };
}
