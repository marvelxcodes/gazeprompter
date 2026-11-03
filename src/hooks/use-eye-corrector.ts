"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  EyeContactCorrector,
  type CorrectorStatus,
} from "@/lib/eye-corrector";

export interface EyeCorrectorState {
  enabled: boolean;
  status: CorrectorStatus;
  toggle: () => void;
  enable: () => void;
  disable: () => void;
  /** Attach the visible canvas + hidden video nodes to the engine. */
  attach: (canvas: HTMLCanvasElement | null, video: HTMLVideoElement | null) => void;
  /** Canvas stream for MediaRecorder when correction is active. */
  captureStream: (fps?: number) => MediaStream | null;
}

/**
 * React binding for the WebGL2 gaze-redirection engine. The heavy lifting
 * (MediaPipe inference + shader compositing) lives in `EyeContactCorrector`;
 * this hook only manages lifecycle and mirrors status into React state.
 */
export function useEyeCorrector(): EyeCorrectorState {
  const corrector = useMemo(() => new EyeContactCorrector(), []);
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState<CorrectorStatus>({
    ready: false,
    loading: false,
    error: null,
    tracking: false,
  });

  useEffect(() => {
    const off = corrector.onStatus(setStatus);
    return () => {
      off();
      corrector.destroy();
    };
  }, [corrector]);

  const attach = useCallback(
    (canvas: HTMLCanvasElement | null, video: HTMLVideoElement | null) => {
      if (canvas && video) corrector.attach(canvas, video);
    },
    [corrector],
  );

  const enable = useCallback(() => {
    setEnabled(true);
    corrector.enable();
  }, [corrector]);

  const disable = useCallback(() => {
    setEnabled(false);
    corrector.disable();
  }, [corrector]);

  const toggle = useCallback(() => {
    if (corrector.isEnabled) {
      setEnabled(false);
      corrector.disable();
    } else {
      setEnabled(true);
      corrector.enable();
    }
  }, [corrector]);

  const captureStream = useCallback(
    (fps = 60) => (corrector.isEnabled ? corrector.captureStream(fps) : null),
    [corrector],
  );

  return { enabled, status, toggle, enable, disable, attach, captureStream };
}
