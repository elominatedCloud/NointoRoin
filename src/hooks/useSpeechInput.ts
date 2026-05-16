"use client";

import { useCallback, useState } from "react";

type SpeechStatus = "idle" | "listening" | "processing";

type SpeechRecognitionResultLike = {
  readonly 0: {
    readonly transcript: string;
  };
};

type SpeechRecognitionEventLike = Event & {
  results: ArrayLike<SpeechRecognitionResultLike>;
};

type SpeechRecognitionLike = EventTarget & {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type SpeechWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

const mockQuestion = "내가 신청할 수 있는 일자리가 있나요?";

export function useSpeechInput() {
  const [status, setStatus] = useState<SpeechStatus>("idle");
  const [transcript, setTranscript] = useState("");

  const startListening = useCallback(() => {
    setStatus("listening");
    setTranscript("");

    return new Promise<string>((resolve) => {
      const speechWindow = window as SpeechWindow;
      const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

      if (!Recognition) {
        window.setTimeout(() => {
          setTranscript(mockQuestion);
          setStatus("processing");
          resolve(mockQuestion);
        }, 700);
        return;
      }

      const recognition = new Recognition();
      let resolved = false;

      recognition.lang = "ko-KR";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const spokenText = event.results[0]?.[0]?.transcript?.trim() || mockQuestion;
        resolved = true;
        setTranscript(spokenText);
        setStatus("processing");
        resolve(spokenText);
      };

      recognition.onerror = () => {
        if (!resolved) {
          resolved = true;
          setTranscript(mockQuestion);
          setStatus("processing");
          resolve(mockQuestion);
        }
      };

      recognition.onend = () => {
        if (!resolved) {
          resolved = true;
          setTranscript(mockQuestion);
          setStatus("processing");
          resolve(mockQuestion);
        }
      };

      recognition.start();
    });
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setTranscript("");
  }, []);

  return {
    status,
    transcript,
    startListening,
    reset,
  };
}
