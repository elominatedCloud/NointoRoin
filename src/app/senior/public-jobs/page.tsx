import { ensureSummary, listPublicJobs } from "@/lib/db";
import { SeniorLayout } from "@/components/senior/SeniorLayout";
import { PublicJobsClient } from "@/components/senior/PublicJobsClient";

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
      <PublicJobsClient rows={rows} />
    </SeniorLayout>
  );
}
