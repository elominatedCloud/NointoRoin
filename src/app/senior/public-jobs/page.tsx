import Link from "next/link";
import { ChevronRight, Clock, MapPinned, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { ensureSummary, listPublicJobs } from "@/lib/db";
import { SeniorLayout } from "@/components/senior/SeniorLayout";
import type { Job } from "@/types/job";

export const dynamic = "force-dynamic";

export default async function SeniorPublicJobsPage() {
  const jobs = (await listPublicJobs()).slice(0, 5);
  const rows = await Promise.all(
    jobs.map(async (job) => ({
      job,
      summary: await ensureSummary(job),
    })),
  );

  return (
    <SeniorLayout>
      <header>
        <p className="text-[20px] font-black text-[#1f6f4a]">공공 일자리</p>
        <h1 className="mt-2 text-[35px] font-black leading-tight">
          오늘 볼 수 있는
          <br />
          공고입니다
        </h1>
        <p className="mt-4 text-[21px] font-bold leading-relaxed text-[#425247]">
          제목은 원문 그대로 두고, 신청 전 확인할 점을 쉬운 말로 정리했습니다.
        </p>
      </header>

      <section className="mt-6 grid grid-cols-[1fr_auto] gap-3">
        <Link
          className="flex min-h-[66px] items-center justify-center gap-2 rounded-[22px] bg-white px-5 text-[20px] font-black text-[#1f6f4a] shadow-md shadow-emerald-950/10"
          href="/senior/jobs-map"
        >
          <MapPinned aria-hidden="true" size={26} strokeWidth={2.7} />
          지도처럼 보기
        </Link>
        <Link
          className="flex size-[66px] items-center justify-center rounded-[22px] bg-white text-[#1f6f4a] shadow-md shadow-emerald-950/10"
          href="/senior/voice?mode=recommend"
          aria-label="내 조건으로 공고 거르기"
        >
          <SlidersHorizontal aria-hidden="true" size={28} strokeWidth={2.7} />
        </Link>
      </section>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1" aria-label="공고 필터">
        {["전체", "가까운 곳", "짧은 시간", "전화 확인"].map((label, index) => (
          <span
            className={`shrink-0 rounded-full px-5 py-3 text-[18px] font-black ${
              index === 0 ? "bg-[#1f6f4a] text-white" : "bg-white text-[#526157]"
            }`}
            key={label}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="mt-6 grid gap-4">
        {rows.map(({ job, summary }) => (
          <article className="rounded-[28px] bg-white p-5 shadow-lg shadow-emerald-950/10" key={job.id}>
            <div className="flex items-start justify-between gap-3">
              <p className="flex items-center gap-2 text-[18px] font-black text-[#1f6f4a]">
                <ShieldCheck aria-hidden="true" size={22} strokeWidth={2.7} />
                {job.source === "public_api" ? "공공 API" : "데모 공공 데이터"}
              </p>
              <span className="rounded-full bg-[#fff3df] px-3 py-1 text-[16px] font-black text-[#93430d]">
                {getWorkLoadLabel(job)}
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

            <div className="mt-5 grid gap-3">
              <Link
                className="flex min-h-[68px] w-full items-center justify-center gap-2 rounded-[22px] bg-[#f36b21] px-5 text-center text-[21px] font-black leading-tight text-white"
                href={`/senior/public-jobs/${encodeURIComponent(job.id)}`}
              >
                설명 듣고 신청하기
                <ChevronRight aria-hidden="true" size={25} strokeWidth={3} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </SeniorLayout>
  );
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
