"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Home, Mic } from "lucide-react";
import { BigButton } from "@/components/senior/BigButton";
import { SeniorLayout } from "@/components/senior/SeniorLayout";
import { VoiceButton } from "@/components/senior/VoiceButton";
import { useSpeechInput } from "@/hooks/useSpeechInput";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import type { VoiceMode, VoiceJobHelperResponse } from "@/types/ai";

const statusText = {
  idle: "대기 중",
  listening: "듣는 중",
  processing: "답변 준비 중",
};

type RecommendStepId = "work" | "health" | "healthDetail" | "time";

type RecommendChoice = {
  label: string;
  speakLabel: string;
  value: string;
  next: RecommendStepId | "submit";
};

type RecommendStep = {
  id: RecommendStepId;
  title: string;
  question: string;
  choices: RecommendChoice[];
};

const recommendSteps: Record<RecommendStepId, RecommendStep> = {
  work: {
    id: "work",
    title: "해보신 일을 골라주세요",
    question: "전에 해보신 일과 가까운 것을 골라주세요.",
    choices: [
      {
        label: "1번 사람을 만나는 일",
        speakLabel: "1번, 사람을 만나는 일",
        value: "사람을 안내하거나 손님을 응대한 경험",
        next: "health",
      },
      {
        label: "2번 정리나 몸을 쓰는 일",
        speakLabel: "2번, 정리나 몸을 쓰는 일",
        value: "청소, 정리, 물건 관리 경험",
        next: "health",
      },
    ],
  },
  health: {
    id: "health",
    title: "몸 상태를 알려주세요",
    question: "아픈 곳이나 피하고 싶은 일이 있으세요?",
    choices: [
      {
        label: "1번 크게 없어요",
        speakLabel: "1번, 크게 없어요",
        value: "특별히 아픈 곳 없음",
        next: "time",
      },
      {
        label: "2번 있어요",
        speakLabel: "2번, 있어요",
        value: "",
        next: "healthDetail",
      },
    ],
  },
  healthDetail: {
    id: "healthDetail",
    title: "조심할 곳을 골라주세요",
    question: "가장 조심해야 하는 쪽을 골라주세요.",
    choices: [
      {
        label: "1번 허리나 무릎",
        speakLabel: "1번, 허리나 무릎",
        value: "허리나 무릎이 불편함",
        next: "time",
      },
      {
        label: "2번 손, 어깨, 무거운 물건",
        speakLabel: "2번, 손, 어깨, 무거운 물건",
        value: "손이나 어깨가 불편하거나 무거운 물건을 피해야 함",
        next: "time",
      },
    ],
  },
  time: {
    id: "time",
    title: "편한 시간을 골라주세요",
    question: "언제 일하는 게 편하세요?",
    choices: [
      {
        label: "1번 오전에 짧게",
        speakLabel: "1번, 오전에 짧게",
        value: "오전 짧은 시간",
        next: "submit",
      },
      {
        label: "2번 오후에 천천히",
        speakLabel: "2번, 오후에 천천히",
        value: "오후 짧은 시간",
        next: "submit",
      },
    ],
  },
};

export function VoiceClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = (searchParams.get("mode") === "recommend" ? "recommend" : "ask") satisfies VoiceMode;
  const { status, transcript, startListening } = useSpeechInput();
  const { speak } = useTextToSpeech();
  const [stepId, setStepId] = useState<RecommendStepId>("work");
  const [previousWork, setPreviousWork] = useState("");
  const [healthLimit, setHealthLimit] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [isSubmittingRecommendation, setIsSubmittingRecommendation] = useState(false);
  const isRecommendMode = mode === "recommend";
  const currentStep = recommendSteps[stepId];
  const stepSpeech = useMemo(
    () =>
      `${currentStep.title}. ${currentStep.question} ${currentStep.choices
        .map((choice) => choice.speakLabel)
        .join(". ")}.`,
    [currentStep],
  );

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
        preferredTime,
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

  useEffect(() => {
    if (isRecommendMode) {
      speak(stepSpeech);
    }
  }, [isRecommendMode, speak, stepSpeech]);

  useEffect(() => {
    if (!isRecommendMode) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "1" && event.key !== "2") {
        return;
      }

      const choice = currentStep.choices[Number(event.key) - 1];
      if (choice) {
        void handleRecommendChoice(choice);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  async function handleRecommendChoice(choice: RecommendChoice) {
    if (isSubmittingRecommendation) {
      return;
    }

    const nextAnswers = {
      previousWork,
      healthLimit,
      preferredTime,
    };

    if (currentStep.id === "work") {
      nextAnswers.previousWork = choice.value;
      setPreviousWork(choice.value);
    }

    if (currentStep.id === "health" && choice.value) {
      nextAnswers.healthLimit = choice.value;
      setHealthLimit(choice.value);
    }

    if (currentStep.id === "healthDetail") {
      nextAnswers.healthLimit = choice.value;
      setHealthLimit(choice.value);
    }

    if (currentStep.id === "time") {
      nextAnswers.preferredTime = choice.value;
      setPreferredTime(choice.value);
    }

    if (choice.next !== "submit") {
      setStepId(choice.next);
      return;
    }

    setIsSubmittingRecommendation(true);
    const response = await fetch("/api/ai/voice-job-helper", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode,
        transcript: "내 조건에 맞는 일자리를 추천해주세요.",
        previousWork: nextAnswers.previousWork,
        healthLimit: nextAnswers.healthLimit,
        preferredTime: nextAnswers.preferredTime,
      }),
    });
    const payload = (await response.json()) as VoiceJobHelperResponse;

    if (payload.ok) {
      sessionStorage.setItem("senior-ai-result", JSON.stringify(payload.result));
      router.push("/senior/result");
    } else {
      setIsSubmittingRecommendation(false);
    }
  }

  if (isRecommendMode) {
    return (
      <SeniorLayout>
        <section className="rounded-[32px] bg-white px-7 py-8 shadow-xl shadow-emerald-950/10">
          <h1 className="text-[32px] font-black leading-tight">
            {currentStep.title}
          </h1>
          <p className="mt-8 text-[25px] font-black leading-relaxed">{currentStep.question}</p>
          <div className="mt-8 grid gap-5">
            {currentStep.choices.map((choice) => (
              <BigButton
                disabled={isSubmittingRecommendation}
                key={choice.label}
                onClick={() => void handleRecommendChoice(choice)}
                variant={choice.label.startsWith("1번") ? "primary" : "secondary"}
              >
                {choice.label}
              </BigButton>
            ))}
          </div>
          <button
            className="mt-7 w-full text-center text-[22px] font-black text-[#1f6f4a]"
            onClick={() => speak(stepSpeech)}
            type="button"
          >
            질문 다시 듣기
          </button>
          <a className="mt-5 block text-center text-[22px] font-black text-[#1f6f4a]" href="/senior">
            처음으로
          </a>
        </section>
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
