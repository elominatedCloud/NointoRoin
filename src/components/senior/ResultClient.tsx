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
import { Bookmark, BookmarkCheck, ClipboardList, Phone, Volume2, VolumeX } from "lucide-react";

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
  const storageKey = `saved-job:${result.jobId ?? result.title}`;
  const [isSaved, setIsSaved] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return localStorage.getItem(storageKey) === "1";
  });
  const { cancel, error, isEnabled, isSpeaking, isSupported, speak } = useTextToSpeech();
  const fullText = useMemo(() => makeReadableText(result), [result]);
  const guideText = useMemo(() => makeApplicationGuideText(result), [result]);
  const phoneHref = result.contactPhone ? `tel:${result.contactPhone.replace(/-/g, "")}` : "";

  useEffect(() => {
    speak(fullText, { auto: true });
  }, [fullText, speak]);

  function toggleSaved() {
    setIsSaved((current) => {
      const next = !current;
      if (typeof window !== "undefined") {
        if (next) {
          localStorage.setItem(storageKey, "1");
          localStorage.setItem(storageKey + ":title", result.title);
        } else {
          localStorage.removeItem(storageKey);
          localStorage.removeItem(storageKey + ":title");
        }
      }

      return next;
    });
  }

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
      {!isEnabled ? (
        <button
          className="mt-5 flex min-h-[72px] w-full items-center justify-center gap-3 rounded-[22px] bg-[#1f6f4a] px-6 text-[22px] font-black text-white shadow-lg shadow-emerald-900/15"
          onClick={() => speak(fullText)}
          type="button"
        >
          <Volume2 aria-hidden="true" size={28} strokeWidth={3} />
          음성 안내 시작
        </button>
      ) : null}
      {isSupported && error ? (
        <p className="mt-3 rounded-2xl bg-[#fff7e8] px-4 py-3 text-[17px] font-bold leading-relaxed text-[#93430d]">
          {error}
        </p>
      ) : null}
      {!isSupported ? (
        <p className="mt-3 rounded-2xl bg-[#fff7e8] px-4 py-3 text-[17px] font-bold leading-relaxed text-[#93430d]">
          이 브라우저에서는 음성 안내를 지원하지 않습니다.
        </p>
      ) : null}
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
          <BigButton
            onClick={() => {
              setIsApplying(true);
              speak(guideText);
            }}
            variant="action"
          >
            신청하기
          </BigButton>
          <BigButton onClick={() => speak(fullText)} variant="quiet">
            <span className="flex items-center gap-3">
              <Volume2 aria-hidden="true" size={28} strokeWidth={3} />
              {isSpeaking ? "읽는 중입니다" : "설명 다시 듣기"}
            </span>
          </BigButton>
          {isSpeaking ? (
            <BigButton onClick={cancel} variant="secondary">
              <span className="flex items-center gap-3">
                <VolumeX aria-hidden="true" size={28} strokeWidth={3} />
                음성 멈추기
              </span>
            </BigButton>
          ) : null}
          <button
            className="flex min-h-[68px] w-full items-center justify-center gap-3 rounded-[22px] bg-white px-6 text-[21px] font-black text-[#1f6f4a] shadow-md shadow-emerald-950/10"
            onClick={toggleSaved}
            type="button"
          >
            {isSaved ? (
              <BookmarkCheck aria-hidden="true" size={28} strokeWidth={3} />
            ) : (
              <Bookmark aria-hidden="true" size={28} strokeWidth={3} />
            )}
            {isSaved ? "저장한 공고입니다" : "이 공고 저장하기"}
          </button>
        </div>
      )}

      <section className="mt-5 rounded-[24px] bg-[#fff7e8] p-5 shadow-md shadow-emerald-950/5">
        <p className="flex items-center gap-2 text-[20px] font-black text-[#93430d]">
          <ClipboardList aria-hidden="true" size={25} strokeWidth={3} />
          신청 전 준비
        </p>
        <ul className="mt-3 grid gap-2 text-[19px] font-bold leading-relaxed text-[#4b3a22]">
          <li>신분증을 준비하세요.</li>
          <li>통장 사본이나 복지카드는 필요할 때만 챙기세요.</li>
          <li>방문 전 모집이 끝났는지 확인하세요.</li>
        </ul>
      </section>
      <p className="mt-3 rounded-2xl bg-white px-4 py-3 text-[17px] font-bold leading-relaxed text-[#526157] shadow-sm shadow-emerald-950/5">
        공고 저장은 이 기기 안에만 남는 데모 기능입니다.
      </p>
      <div className="mt-6">
        <ResultCard result={result} />
      </div>
    </SeniorLayout>
  );
}
