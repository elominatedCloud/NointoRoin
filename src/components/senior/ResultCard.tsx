"use client";

import type { EasyJobSummary } from "@/types/ai";

type ResultCardProps = {
  result: EasyJobSummary;
};

export function ResultCard({ result }: ResultCardProps) {
  return (
    <article className="rounded-[28px] bg-white px-6 py-7 shadow-xl shadow-emerald-950/10">
      <h1 className="text-[31px] font-black leading-tight">쉬운 설명</h1>

      <section className="mt-6">
        <h2 className="border-b-2 border-[#17211b] pb-2 text-[24px] font-black">하는 일</h2>
        <p className="mt-4 text-[22px] font-bold leading-relaxed">{result.summary}</p>
      </section>

      <section className="mt-7">
        <h2 className="border-b-2 border-[#17211b] pb-2 text-[24px] font-black">신청 조건</h2>
        <p className="mt-4 text-[22px] font-bold leading-relaxed">{result.eligibility}</p>
      </section>

      <section className="mt-7 rounded-[20px] bg-[#eef8ed] p-4">
        <h2 className="text-[24px] font-black text-[#1f6f4a]">근무 조건</h2>
        <p className="mt-3 text-[21px] font-bold leading-relaxed">{result.workCondition}</p>
      </section>

      <section className="mt-7">
        <h2 className="border-b-2 border-[#17211b] pb-2 text-[24px] font-black">주의할 점</h2>
        <p className="mt-4 text-[22px] font-bold leading-relaxed">{result.caution}</p>
      </section>
    </article>
  );
}
