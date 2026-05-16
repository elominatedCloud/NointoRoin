"use client";

import type { EasyJobSummary } from "@/types/ai";

type ResultCardProps = {
  result: EasyJobSummary;
};

export function ResultCard({ result }: ResultCardProps) {
  return (
    <article className="rounded-[28px] bg-white px-6 py-7 shadow-xl shadow-emerald-950/10">
      <h1 className="text-[32px] font-black leading-tight">쉽게 설명드릴게요</h1>

      <section className="mt-7">
        <h2 className="border-b-2 border-[#17211b] pb-2 text-[24px] font-black">
          이 일은 이런 일입니다
        </h2>
        <p className="mt-4 text-[22px] font-bold leading-relaxed">{result.summary}</p>
      </section>

      <section className="mt-7">
        <h2 className="border-b-2 border-[#17211b] pb-2 text-[24px] font-black">
          신청할 수 있는지
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
