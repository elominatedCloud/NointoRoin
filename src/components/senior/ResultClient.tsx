"use client";

import { useEffect, useMemo, useState } from "react";
import { BigButton } from "@/components/senior/BigButton";
import {
  makeApplicationGuideText,
  makeReadableText,
  ReadAloudText,
} from "@/components/senior/ReadAloudText";
import { ResultCard } from "@/components/senior/ResultCard";
import { SeniorLayout } from "@/components/senior/SeniorLayout";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import type { EasyJobSummary } from "@/types/ai";

const fallbackResult: EasyJobSummary = {
  title: "신청 가능한 일자리 안내",
  summary: "가까운 주민센터나 시니어클럽에서 신청 가능한 공공 일자리가 있을 수 있습니다.",
  eligibility: "정확한 조건은 나이와 사는 지역에 따라 다릅니다.",
  workCondition: "보통 하루 3시간 정도 일하는 일자리가 많습니다.",
  applicationGuide: [
    "사는 지역의 주민센터에 전화합니다.",
    "노인 일자리 신청 기간을 물어봅니다.",
    "신분증을 가지고 방문합니다.",
  ],
  caution: "지역마다 모집 기간이 다르므로 확인이 필요합니다.",
};

export function ResultClient() {
  const [result] = useState<EasyJobSummary>(() => {
    if (typeof window === "undefined") {
      return fallbackResult;
    }

    const stored = sessionStorage.getItem("senior-ai-result");
    if (!stored) {
      return fallbackResult;
    }

    try {
      return JSON.parse(stored) as EasyJobSummary;
    } catch {
      return fallbackResult;
    }
  });
  const { speak, isSpeaking } = useTextToSpeech();
  const fullText = useMemo(() => makeReadableText(result), [result]);
  const guideText = useMemo(() => makeApplicationGuideText(result), [result]);

  useEffect(() => {
    speak(fullText);
  }, [fullText, speak]);

  return (
    <SeniorLayout showHomeLink>
      <ReadAloudText result={result} />
      <ResultCard result={result} />
      <div className="mt-6 grid gap-5">
        <BigButton onClick={() => speak(fullText)}>
          {isSpeaking ? "읽는 중입니다" : "다시 듣기"}
        </BigButton>
        <BigButton onClick={() => speak(guideText)} variant="secondary">
          신청 방법 듣기
        </BigButton>
      </div>
    </SeniorLayout>
  );
}
