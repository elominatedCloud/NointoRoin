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
import { Phone, Volume2 } from "lucide-react";

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

type ResultClientProps = {
  initialResult?: EasyJobSummary;
};

export function ResultClient({ initialResult }: ResultClientProps) {
  const [isApplying, setIsApplying] = useState(false);
  const [result] = useState<EasyJobSummary>(() => {
    if (initialResult) {
      return initialResult;
    }

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
  const phoneHref = result.contactPhone ? `tel:${result.contactPhone.replace(/-/g, "")}` : "";

  useEffect(() => {
    speak(fullText);
  }, [fullText, speak]);

  return (
    <SeniorLayout showHomeLink>
      <ReadAloudText result={result} />
      <section className="rounded-[28px] bg-white p-5 shadow-lg shadow-emerald-950/10">
        <p className="text-[20px] font-black text-[#1f6f4a]">현재 공고</p>
        <h1 className="mt-2 text-[28px] font-black leading-tight">{result.title}</h1>
        {result.organization || result.workLocation ? (
          <p className="mt-3 text-[20px] font-bold leading-snug text-[#526157]">
            {[result.organization, result.workLocation].filter(Boolean).join(" · ")}
          </p>
        ) : null}
      </section>
      {isApplying ? (
        <section className="mt-5 rounded-[28px] bg-white px-6 py-6 shadow-xl shadow-emerald-950/10">
          <h2 className="text-[28px] font-black leading-tight">신청하려면</h2>
          <ol className="mt-5 grid gap-4">
            {result.applicationGuide.map((step, index) => (
              <li className="grid grid-cols-[42px_1fr] gap-3 text-[21px] font-bold leading-relaxed" key={step}>
                <span className="flex size-[42px] items-center justify-center rounded-full bg-[#1f6f4a] text-[18px] font-black text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-6 grid gap-5">
            {phoneHref ? (
              <BigButton href={phoneHref} variant="action">
                <span className="flex items-center gap-3">
                  <Phone aria-hidden="true" size={28} strokeWidth={3} />
                  전화하기
                </span>
              </BigButton>
            ) : (
              <BigButton disabled>전화번호 확인 필요</BigButton>
            )}
            <BigButton onClick={() => speak(guideText)} variant="secondary">
              <span className="flex items-center gap-3">
                <Volume2 aria-hidden="true" size={28} strokeWidth={3} />
                안내 다시 듣기
              </span>
            </BigButton>
          </div>
        </section>
      ) : (
        <div className="mt-5 grid gap-5">
          <BigButton onClick={() => speak(fullText)} variant="quiet">
            <span className="flex items-center gap-3">
              <Volume2 aria-hidden="true" size={28} strokeWidth={3} />
              {isSpeaking ? "읽는 중입니다" : "설명 다시 듣기"}
            </span>
          </BigButton>
          <BigButton
            onClick={() => {
              setIsApplying(true);
              speak(guideText);
            }}
            variant="action"
          >
            신청하기
          </BigButton>
        </div>
      )}
      <div className="mt-6">
        <ResultCard result={result} />
      </div>
    </SeniorLayout>
  );
}
