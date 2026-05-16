"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Home, Mic, Volume2 } from "lucide-react";
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

const recommendStepOrder: RecommendStepId[] = ["work", "health", "healthDetail", "time"];

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
  const visibleStepOrder = healthLimit === "특별히 아픈 곳 없음" ? ["work", "health", "time"] : recommendStepOrder;
  const currentStepNumber = Math.max(1, visibleStepOrder.indexOf(stepId) + 1);
  const totalStepCount = visibleStepOrder.length;
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
    const savedProfileResponse = await fetch("/api/senior/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        previousWork: nextAnswers.previousWork,
        healthLimit: nextAnswers.healthLimit,
        preferredTime: nextAnswers.preferredTime,
        preferredJobType: currentStep.id === "time" ? "추천 일자리" : null,
        consentToEmployerMatching: true,
      }),
    });

    if (savedProfileResponse.ok) {
      const profilePayload = (await savedProfileResponse.json()) as {
        profile?: {
          id: string;
          name: string;
        };
      };
      if (profilePayload.profile) {
        sessionStorage.setItem("senior-profile", JSON.stringify(profilePayload.profile));
      }
    }

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
        <Link className="inline-flex items-center gap-2 text-[19px] font-black text-[#1f6f4a]" href="/senior">
          <ArrowLeft aria-hidden="true" size={24} strokeWidth={3} />
          처음으로
        </Link>

        <section className="mt-5 rounded-[32px] bg-white px-6 py-7 shadow-xl shadow-emerald-950/10">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[20px] font-black text-[#1f6f4a]">내 조건 상담</p>
            <p className="rounded-full bg-[#eaf4ea] px-4 py-2 text-[18px] font-black text-[#1f6f4a]">
              {currentStepNumber}/{totalStepCount}
            </p>
          </div>
          <div className="mt-5 h-3 rounded-full bg-[#e3ede4]">
            <div
              className="h-3 rounded-full bg-[#1f6f4a] transition-all"
              style={{ width: `${Math.round((currentStepNumber / totalStepCount) * 100)}%` }}
            />
          </div>

          <h1 className="mt-8 text-[34px] font-black leading-tight">{currentStep.title}</h1>
          <p className="mt-5 text-[24px] font-black leading-relaxed">{currentStep.question}</p>
          <p className="mt-3 text-[19px] font-bold leading-relaxed text-[#526157]">
            버튼을 누르거나 키보드 숫자 1, 2를 눌러도 됩니다.
          </p>

          <div className="mt-7 grid gap-4">
            {currentStep.choices.map((choice) => (
              <button
                className="grid min-h-[92px] grid-cols-[56px_1fr] items-center gap-4 rounded-[24px] border-2 border-[#dbe8dc] bg-white p-4 text-left shadow-md shadow-emerald-950/5 transition active:scale-[0.99] disabled:opacity-60"
                disabled={isSubmittingRecommendation}
                key={choice.label}
                onClick={() => void handleRecommendChoice(choice)}
                type="button"
              >
                <span className="flex size-14 items-center justify-center rounded-2xl bg-[#1f6f4a] text-[25px] font-black text-white">
                  {choice.label.slice(0, 2).replace("번", "")}
                </span>
                <span className="text-[24px] font-black leading-tight">
                  {choice.label.replace(/^\d번\s*/, "")}
                </span>
              </button>
            ))}
          </div>
          <button
            className="mt-6 flex min-h-[64px] w-full items-center justify-center gap-2 rounded-[20px] bg-[#eaf4ea] text-[21px] font-black text-[#1f6f4a]"
            onClick={() => speak(stepSpeech)}
            type="button"
          >
            <Volume2 aria-hidden="true" size={26} strokeWidth={3} />
            질문 다시 듣기
          </button>
          {isSubmittingRecommendation ? (
            <p className="mt-5 flex items-center justify-center gap-2 text-[20px] font-black text-[#1f6f4a]">
              <CheckCircle2 aria-hidden="true" size={24} strokeWidth={3} />
              맞는 공고를 찾고 있습니다
            </p>
          ) : null}
        </section>
      </SeniorLayout>
    );
  }

  return (
      <SeniorLayout>
      <Link className="inline-flex items-center gap-2 text-[19px] font-black text-[#1f6f4a]" href="/senior">
        <ArrowLeft aria-hidden="true" size={24} strokeWidth={3} />
        처음으로
      </Link>

      <div className="mt-5 rounded-[32px] bg-white px-6 py-8 shadow-xl shadow-emerald-950/10">
        <h1 className="text-[34px] font-black leading-tight">
          어려운 공고는
          <br />
          말로 물어보세요
        </h1>
        <p className="mt-5 text-[22px] font-bold leading-relaxed text-[#526157]">
          신청 조건, 몸에 무리가 되는 일, 전화해야 할 곳을 쉽게 설명해드립니다.
        </p>

        <div className="my-8 flex justify-center">
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[#fff3df] text-[#f36b21]">
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
