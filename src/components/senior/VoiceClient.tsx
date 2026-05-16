"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Home, Mic } from "lucide-react";
import { BigButton } from "@/components/senior/BigButton";
import { SeniorLayout } from "@/components/senior/SeniorLayout";
import { VoiceButton } from "@/components/senior/VoiceButton";
import { useSpeechInput } from "@/hooks/useSpeechInput";
import type { VoiceMode, VoiceJobHelperResponse } from "@/types/ai";

const statusText = {
  idle: "대기 중",
  listening: "듣는 중",
  processing: "답변 준비 중",
};

export function VoiceClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = (searchParams.get("mode") === "recommend" ? "recommend" : "ask") satisfies VoiceMode;
  const { status, transcript, startListening } = useSpeechInput();
  const [previousWork, setPreviousWork] = useState("");
  const [healthLimit, setHealthLimit] = useState("");
  const isRecommendMode = mode === "recommend";

  async function requestAnswer(spokenText: string) {
    const response = await fetch("/api/ai/voice-job-helper", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode,
        transcript: spokenText,
        previousWork,
        healthLimit,
      }),
    });
    const payload = (await response.json()) as VoiceJobHelperResponse;

    if (payload.ok) {
      sessionStorage.setItem("senior-ai-result", JSON.stringify(payload.result));
      router.push("/senior/result");
    }
  }

  async function handleStart() {
    const spokenText = await startListening();
    await requestAnswer(spokenText);
  }

  async function handleRecommendSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await requestAnswer("내 조건에 맞는 일자리를 추천해주세요.");
  }

  if (isRecommendMode) {
    return (
      <SeniorLayout>
        <form
          className="rounded-[32px] bg-white px-7 py-8 shadow-xl shadow-emerald-950/10"
          onSubmit={handleRecommendSubmit}
        >
          <h1 className="text-[32px] font-black leading-tight">
            먼저 몸에 맞는지
            <br />
            여쭤볼게요
          </h1>
          <div className="mt-8 grid gap-6">
            <label className="grid gap-3">
              <span className="text-[24px] font-black leading-tight">전에 어떤 일을 해보셨어요?</span>
              <textarea
                className="min-h-28 rounded-2xl border-2 border-[#1f6f4a] bg-[#f7fbf4] px-4 py-4 text-[22px] font-bold leading-relaxed outline-none focus:ring-4 focus:ring-[#d8eadf]"
                onChange={(event) => setPreviousWork(event.target.value)}
                placeholder="예: 식당, 청소, 안내"
                value={previousWork}
              />
            </label>
            <label className="grid gap-3">
              <span className="text-[24px] font-black leading-tight">아픈 곳이나 피하고 싶은 일이 있으세요?</span>
              <textarea
                className="min-h-28 rounded-2xl border-2 border-[#1f6f4a] bg-[#f7fbf4] px-4 py-4 text-[22px] font-bold leading-relaxed outline-none focus:ring-4 focus:ring-[#d8eadf]"
                onChange={(event) => setHealthLimit(event.target.value)}
                placeholder="예: 허리, 무릎, 무거운 물건"
                value={healthLimit}
              />
            </label>
          </div>
          <div className="mt-8 grid gap-5">
            <BigButton type="submit">추천 결과 듣기</BigButton>
            <BigButton href="/senior" variant="secondary">
              <span className="flex items-center gap-3">
                <Home aria-hidden="true" size={28} strokeWidth={3} />
                처음으로
              </span>
            </BigButton>
          </div>
        </form>
      </SeniorLayout>
    );
  }

  return (
    <SeniorLayout>
      <div className="rounded-[32px] bg-white px-7 py-9 shadow-xl shadow-emerald-950/10">
        <h1 className="text-[34px] font-black leading-tight">편하게 말씀하세요</h1>
        <p className="mt-9 text-[24px] font-black leading-relaxed">
          예:
          <br />
          &quot;내가 신청할 수 있는
          <br />
          일자리가 있나요?&quot;
        </p>
        <div className="my-9 flex justify-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#fff1c2] text-[#17211b]">
            <Mic aria-hidden="true" size={56} strokeWidth={3} />
          </div>
        </div>
        <p className="text-center text-[24px] font-black">현재 상태: {statusText[status]}</p>
        {transcript ? (
          <p className="mt-4 rounded-2xl bg-[#eef8ed] p-4 text-[22px] font-bold leading-relaxed">
            {transcript}
          </p>
        ) : null}
        <div className="mt-8 grid gap-5">
          <VoiceButton disabled={status !== "idle"} label={status === "idle" ? "말하기 시작" : statusText[status]} onClick={handleStart} />
          <BigButton href="/senior" variant="secondary">
            <span className="flex items-center gap-3">
              <Home aria-hidden="true" size={28} strokeWidth={3} />
              처음으로
            </span>
          </BigButton>
        </div>
      </div>
    </SeniorLayout>
  );
}
