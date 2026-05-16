"use client";

import type { EasyJobSummary } from "@/types/ai";

type ReadAloudTextProps = {
  result: EasyJobSummary;
};

export function makeReadableText(result: EasyJobSummary) {
  return [
    result.title,
    result.summary,
    result.eligibility,
    result.workCondition,
    result.caution,
    "신청 방법입니다.",
    ...result.applicationGuide,
  ].join(" ");
}

export function makeApplicationGuideText(result: EasyJobSummary) {
  return ["신청 방법을 알려드릴게요.", ...result.applicationGuide].join(" ");
}

export function ReadAloudText({ result }: ReadAloudTextProps) {
  return (
    <div className="sr-only" aria-live="polite">
      {makeReadableText(result)}
    </div>
  );
}
