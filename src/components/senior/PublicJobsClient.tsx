"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Clock, MapPinned, ShieldCheck, SlidersHorizontal } from "lucide-react";
import type { EasyJobSummary } from "@/types/ai";
import type { Job } from "@/types/job";

type PublicJobRow = {
  job: Job;
  summary: EasyJobSummary;
};

type FilterKey = "all" | "near" | "short" | "light" | "contact";

const filters: Array<{ key: FilterKey; label: string }> = [
  { key: "all", label: "전체" },
  { key: "near", label: "가까운 곳" },
  { key: "short", label: "짧은 시간" },
  { key: "light", label: "가벼운 일" },
  { key: "contact", label: "신청 확인" },
];

export function PublicJobsClient({ rows }: { rows: PublicJobRow[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const filteredRows = useMemo(
    () => rows.filter(({ job }) => matchesFilter(job, activeFilter)),
    [activeFilter, rows],
  );

  return (
    <>
      <section className="mt-6 grid grid-cols-[1fr_auto] gap-3">
        <Link
          className="flex min-h-[66px] items-center justify-center gap-2 rounded-[22px] bg-white px-5 text-[20px] font-black text-[#1f6f4a] shadow-md shadow-emerald-950/10"
          href="/senior/jobs-map"
        >
          <MapPinned aria-hidden="true" size={26} strokeWidth={2.7} />
          지도처럼 보기
        </Link>
        <Link
          aria-label="내 조건으로 공고 거르기"
          className="flex size-[66px] items-center justify-center rounded-[22px] bg-white text-[#1f6f4a] shadow-md shadow-emerald-950/10"
          href="/senior/voice?mode=recommend"
        >
          <SlidersHorizontal aria-hidden="true" size={28} strokeWidth={2.7} />
        </Link>
      </section>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1" aria-label="공고 필터">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.key;

          return (
            <button
              className={`shrink-0 rounded-full px-5 py-3 text-[18px] font-black ${
                isActive ? "bg-[#1f6f4a] text-white" : "bg-white text-[#526157]"
              }`}
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              type="button"
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-[18px] font-black text-[#526157]">
        {filteredRows.length}개 공고를 보여드립니다.
      </p>

      <div className="mt-5 grid gap-4">
        {filteredRows.map(({ job, summary }) => (
          <PublicJobCard job={job} key={job.id} summary={summary} />
        ))}
        {filteredRows.length === 0 ? (
          <div className="rounded-[28px] bg-white p-6 text-center shadow-lg shadow-emerald-950/10">
            <p className="text-[23px] font-black">조건에 맞는 공고가 없습니다</p>
            <p className="mt-3 text-[19px] font-bold leading-relaxed text-[#526157]">
              다른 조건을 누르거나 내 조건으로 추천받기를 시작해보세요.
            </p>
          </div>
        ) : null}
      </div>
    </>
  );
}

function PublicJobCard({ job, summary }: PublicJobRow) {
  const workLoad = getWorkLoadLabel(job);

  return (
    <article className="rounded-[28px] bg-white p-5 shadow-lg shadow-emerald-950/10">
      <div className="flex items-start justify-between gap-3">
        <p className="flex items-center gap-2 text-[18px] font-black text-[#1f6f4a]">
          <ShieldCheck aria-hidden="true" size={22} strokeWidth={2.7} />
          {job.source === "public_api" ? "실제 공공 API" : "데모 공공 데이터"}
        </p>
        <span className="rounded-full bg-[#fff3df] px-3 py-1 text-[16px] font-black text-[#93430d]">
          {workLoad}
        </span>
      </div>

      <h2 className="mt-3 text-[25px] font-black leading-tight">{job.title}</h2>
      <div className="mt-4 grid gap-2 text-[18px] font-bold leading-snug text-[#526157]">
        <p className="flex gap-2">
          <MapPinned aria-hidden="true" className="mt-0.5 shrink-0 text-[#1f6f4a]" size={22} />
          {[job.organization, job.workLocation].filter(Boolean).join(" · ") || "기관 확인 필요"}
        </p>
        <p className="flex gap-2">
          <Clock aria-hidden="true" className="mt-0.5 shrink-0 text-[#1f6f4a]" size={22} />
          {job.workTime || "접수 기간 확인 필요"}
        </p>
      </div>

      <p className="mt-5 text-[21px] font-bold leading-relaxed">{summary.summary}</p>
      <p className="mt-4 rounded-[20px] bg-[#eef8ed] p-4 text-[20px] font-bold leading-relaxed">
        {summary.eligibility}
      </p>

      <Link
        className="mt-5 flex min-h-[68px] w-full items-center justify-center gap-2 rounded-[22px] bg-[#f36b21] px-5 text-center text-[21px] font-black leading-tight text-white"
        href={`/senior/public-jobs/${encodeURIComponent(job.id)}`}
      >
        설명 듣고 신청하기
        <ChevronRight aria-hidden="true" size={25} strokeWidth={3} />
      </Link>
    </article>
  );
}

function matchesFilter(job: Job, filter: FilterKey) {
  if (filter === "all") {
    return true;
  }

  const text = [
    job.title,
    job.organization,
    job.region,
    job.workLocation,
    job.workTime,
    job.description,
    job.applicationMethod,
  ]
    .filter(Boolean)
    .join(" ");

  if (filter === "near") {
    return /서울|중구|강서구|송파구|성북구|강남구/.test(text);
  }

  if (filter === "short") {
    return /3시간|4시간|짧|시간선택|오전|오후/.test(text);
  }

  if (filter === "light") {
    return getWorkLoadLabel(job) === "가벼운 일";
  }

  return Boolean(job.applicationMethod);
}

function getWorkLoadLabel(job: Job) {
  const text = [job.title, job.description, job.workLocation].filter(Boolean).join(" ");

  if (/경비|미화|청소|환경|지게차|운전/.test(text)) {
    return "강도 확인";
  }

  if (/안내|사무|모니터링|보조/.test(text)) {
    return "가벼운 일";
  }

  return "확인 필요";
}
