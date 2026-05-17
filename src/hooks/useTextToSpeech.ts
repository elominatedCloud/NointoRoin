"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SpeakOptions = {
  auto?: boolean;
};

const TTS_ENABLED_KEY = "senior-tts-enabled";

export function useTextToSpeech() {
  const [isSupported, setIsSupported] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    return "speechSynthesis" in window;
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEnabled, setIsEnabled] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return localStorage.getItem(TTS_ENABLED_KEY) === "1";
  });
  const [error, setError] = useState("");
  const isEnabledRef = useRef(isEnabled);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const queueRef = useRef<string[]>([]);
  const indexRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const speakNextRef = useRef<() => void>(() => {});

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (resumeIntervalRef.current) {
      clearInterval(resumeIntervalRef.current);
      resumeIntervalRef.current = null;
    }
  }, []);

  const refreshVoices = useCallback(() => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    voicesRef.current = window.speechSynthesis.getVoices();
  }, []);

  const getKoreanVoice = useCallback(() => {
    const voices = voicesRef.current;
    return (
      voices.find((voice) => voice.lang === "ko-KR" && /Google|Yuna|한국|Korean/i.test(voice.name)) ??
      voices.find((voice) => voice.lang === "ko-KR") ??
      voices.find((voice) => voice.lang.toLowerCase().startsWith("ko")) ??
      null
    );
  }, []);

  const cancel = useCallback(() => {
    clearTimers();
    queueRef.current = [];
    indexRef.current = 0;

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);
  }, [clearTimers]);

  const enable = useCallback(() => {
    isEnabledRef.current = true;
    setIsEnabled(true);
    setError("");

    if (typeof window !== "undefined") {
      localStorage.setItem(TTS_ENABLED_KEY, "1");
      refreshVoices();
    }
  }, [refreshVoices]);

  const speakNext = useCallback(() => {
    if (!("speechSynthesis" in window)) {
      setIsSupported(false);
      setIsSpeaking(false);
      setError("이 브라우저는 음성 안내를 지원하지 않습니다.");
      return;
    }

    const currentText = queueRef.current[indexRef.current];
    if (!currentText) {
      clearTimers();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(currentText);
    const voice = getKoreanVoice();
    utterance.lang = voice?.lang ?? "ko-KR";
    utterance.voice = voice;
    utterance.rate = 0.86;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      indexRef.current += 1;
      timeoutRef.current = setTimeout(() => speakNextRef.current(), 80);
    };

    utterance.onerror = (event) => {
      if (event.error !== "canceled" && event.error !== "interrupted") {
        setError("음성 안내를 시작하지 못했습니다. 음성 안내 시작 버튼을 다시 눌러주세요.");
      }
      indexRef.current += 1;
      timeoutRef.current = setTimeout(() => speakNextRef.current(), 120);
    };

    try {
      window.speechSynthesis.speak(utterance);
      window.speechSynthesis.resume();
    } catch {
      clearTimers();
      setIsSpeaking(false);
      setError("음성 안내를 시작하지 못했습니다. 음성 안내 시작 버튼을 다시 눌러주세요.");
    }
  }, [clearTimers, getKoreanVoice]);

  useEffect(() => {
    speakNextRef.current = speakNext;
  }, [speakNext]);

  const speak = useCallback(
    (text: string, options: SpeakOptions = {}) => {
      const trimmedText = text.trim();

      if (typeof window === "undefined" || !trimmedText) {
        return false;
      }

      if (!("speechSynthesis" in window)) {
        setIsSupported(false);
        setError("이 브라우저는 음성 안내를 지원하지 않습니다.");
        return false;
      }

      if (options.auto && !isEnabledRef.current) {
        return false;
      }

      if (!options.auto) {
        enable();
      }

      clearTimers();
      window.speechSynthesis.cancel();
      refreshVoices();
      queueRef.current = splitSpeechText(trimmedText);
      indexRef.current = 0;
      setIsSpeaking(true);
      setError("");

      timeoutRef.current = setTimeout(() => speakNextRef.current(), 120);
      resumeIntervalRef.current = setInterval(() => {
        if (window.speechSynthesis.speaking && window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      }, 5000);

      return true;
    },
    [clearTimers, enable, refreshVoices],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!("speechSynthesis" in window)) {
      return;
    }

    refreshVoices();

    window.speechSynthesis.addEventListener("voiceschanged", refreshVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", refreshVoices);
      cancel();
    };
  }, [cancel, refreshVoices]);

  useEffect(() => {
    isEnabledRef.current = isEnabled;
  }, [isEnabled]);

  return {
    isSupported,
    isSpeaking,
    isEnabled,
    error,
    speak,
    cancel,
    enable,
  };
}

function splitSpeechText(text: string) {
  const sentences = text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?。！？]|[다요죠까니다]\.)\s+|(?<=\.)\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
  const chunks: string[] = [];

  for (const sentence of sentences.length > 0 ? sentences : [text]) {
    if (sentence.length <= 120) {
      chunks.push(sentence);
      continue;
    }

    let remaining = sentence;
    while (remaining.length > 120) {
      const splitAt = Math.max(
        remaining.lastIndexOf(" ", 120),
        remaining.lastIndexOf(",", 120),
        remaining.lastIndexOf("，", 120),
      );
      const index = splitAt > 40 ? splitAt : 120;
      chunks.push(remaining.slice(0, index).trim());
      remaining = remaining.slice(index).trim();
    }

    if (remaining) {
      chunks.push(remaining);
    }
  }

  return chunks;
}
