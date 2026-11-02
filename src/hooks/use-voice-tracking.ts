"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Minimal typings for the Web Speech API (not in lib.dom).
interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}
interface SpeechRecognitionResult {
  readonly length: number;
  readonly isFinal: boolean;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionEventLike extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}
interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: Event) => void) | null;
  onend: (() => void) | null;
}

type RecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export interface VoiceTrackingState {
  /** All finalized words heard so far, in order. */
  heardWords: string[];
  /** Latest interim transcript (for live UI feedback). */
  interimTranscript: string;
  listening: boolean;
  supported: boolean;
  error: string | null;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

/**
 * Continuous speech recognition that accumulates every finalized word into an
 * ordered list. The teleprompter's word-sync engine consumes `heardWords` to
 * advance the script in lockstep with the speaker's voice.
 *
 * Auto-restarts when the browser ends the session (Chrome stops after long
 * silences), and gracefully degrades when the API is unavailable.
 */
export function useVoiceTracking(): VoiceTrackingState {
  const [heardWords, setHeardWords] = useState<string[]>([]);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const keepAliveRef = useRef(true);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Holds the latest `start` implementation so onend's auto-restart always
  // calls a valid closure (useCallback deps are empty, so this is safe).
  const startRef = useRef<() => void>(() => {});

  const supported = getRecognitionCtor() !== null;

  const stop = useCallback(() => {
    keepAliveRef.current = false;
    const rec = recognitionRef.current;
    try {
      rec?.stop();
    } catch {
      /* already stopped */
    }
    setListening(false);
    setInterimTranscript("");
  }, []);

  const reset = useCallback(() => {
    setHeardWords([]);
    setInterimTranscript("");
  }, []);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setError("Speech recognition isn't supported in this browser. Use Chrome or Edge for voice tracking.");
      return;
    }
    if (recognitionRef.current) return; // already running / restarting

    keepAliveRef.current = true;
    setError(null);

    const rec = new Ctor();
    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onresult = (e) => {
      let interim = "";
      const finals: string[] = [];
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i];
        const transcript = result[0]?.transcript ?? "";
        if (result.isFinal) {
          finals.push(transcript);
        } else {
          interim += transcript;
        }
      }
      if (finals.length > 0) {
        const words = finals
          .join(" ")
          .split(/\s+/)
          .map((w) =>
            w
              .toLowerCase()
              .replace(/[^\p{L}\p{N}]/gu, "")
          )
          .filter(Boolean);
        if (words.length > 0) {
          setHeardWords((prev) => [...prev, ...words]);
        }
      }
      setInterimTranscript(interim);
    };

    rec.onerror = (e) => {
      const type = (e as unknown as { error?: string }).error;
      if (type === "not-allowed" || type === "service-not-allowed") {
        setError("Microphone permission was denied for speech recognition.");
        keepAliveRef.current = false;
        setListening(false);
      } else if (type === "audio-capture") {
        setError("No microphone found for speech recognition.");
        keepAliveRef.current = false;
        setListening(false);
      }
      // "no-speech" / "aborted" are handled by the auto-restart in onend.
    };

    rec.onend = () => {
      recognitionRef.current = null;
      if (keepAliveRef.current) {
        // Chrome frequently ends continuous sessions; restart transparently.
        restartTimerRef.current = setTimeout(() => startRef.current(), 350);
        setListening(true);
      } else {
        setListening(false);
        setInterimTranscript("");
      }
    };

    try {
      rec.start();
      recognitionRef.current = rec;
      setListening(true);
    } catch {
      setListening(false);
    }
  }, []);

  // onend's auto-restart calls startRef.current, which always points at the
  // latest `start` closure (created once since deps are empty).
  useEffect(() => {
    startRef.current = start;
  }, [start]);

  useEffect(() => {
    return () => {
      keepAliveRef.current = false;
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      try {
        recognitionRef.current?.abort();
      } catch {
        /* noop */
      }
      recognitionRef.current = null;
    };
  }, []);

  return {
    heardWords,
    interimTranscript,
    listening,
    supported,
    error,
    start,
    stop,
    reset,
  };
}
