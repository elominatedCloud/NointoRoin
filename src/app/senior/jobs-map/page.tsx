import Link from "next/link";
import { SeniorLayout } from "@/components/senior/SeniorLayout";
import { listPublicJobs } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SeniorJobsMapPage() {
  const jobs = (await listPublicJobs()).slice(0, 8);

  return (
    <SeniorLayout showHomeLink>
      <header>
        <h1 className="text-[34px] font-black leading-tight">
          우리 동네
          <br />
          일자리 지도
        </h1>
        <p className="mt-4 text-[21px] font-bold leading-relaxed">
          지도 연동 전 데모에서는 지역별 공고를 가까운 순서처럼 묶어 보여드립니다.
        </p>
      </header>

      <div className="mt-7 grid gap-3">
        {jobs.map((job) => (
          <Link
            className="rounded-[22px] bg-white p-5 shadow-md shadow-emerald-950/10"
            href={`/senior/public-jobs/${encodeURIComponent(job.id)}`}
            key={job.id}
          >
            <p className="text-[18px] font-black text-[#1f6f4a]">
              {job.region || job.workLocation || "지역 확인 필요"}
            </p>
            <h2 className="mt-2 text-[23px] font-black leading-tight">{job.title}</h2>
            <p className="mt-2 text-[18px] font-bold leading-snug text-[#526157]">
              {job.organization || "담당 기관 확인 필요"}
            </p>
          </Link>
        ))}
      </div>
    </SeniorLayout>
  );
}
