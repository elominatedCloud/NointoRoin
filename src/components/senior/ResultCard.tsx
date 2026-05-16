"use client";

import type { EasyJobSummary } from "@/types/ai";

type ResultCardProps = {
  result: EasyJobSummary;
};

export function ResultCard({ result }: ResultCardProps) {
  return (
    <article className="rounded-[28px] bg-white px-6 py-7 shadow-xl shadow-emerald-950/10">
      <h1 className="text-[32px] font-black leading-tight">쉽게 설명드릴게요</h1>
      <div className="mt-5 rounded-2xl bg-[#eef8ed] px-4 py-4">
        <p className="text-[20px] font-black text-[#1f6f4a]">현재 공고</p>
        <p className="mt-1 text-[25px] font-black leading-tight">{result.title}</p>
        {result.organization || result.workLocation ? (
          <p className="mt-2 text-[20px] font-bold leading-snug">
            {[result.organization, result.workLocation].filter(Boolean).join(" · ")}
          </p>
        ) : null}
      </div>

      <section className="mt-7">
        <h2 className="border-b-2 border-[#17211b] pb-2 text-[24px] font-black">
          이 공고는 이런 일입니다
        </h2>
        <p className="mt-4 text-[22px] font-bold leading-relaxed">{result.summary}</p>
      </section>

      <section className="mt-7">
        <h2 className="border-b-2 border-[#17211b] pb-2 text-[24px] font-black">
          이 공고 신청 조건
        </h2>
        <p className="mt-4 text-[22px] font-bold leading-relaxed">{result.eligibility}</p>
      </section>

      <section className="mt-7">
        <h2 className="border-b-2 border-[#17211b] pb-2 text-[24px] font-black">주의할 점</h2>
        <p className="mt-4 text-[22px] font-bold leading-relaxed">{result.caution}</p>
      </section>
    </article>
  );
}
