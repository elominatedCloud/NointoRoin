import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { ensureSummary, listPublicJobs } from "@/lib/db";
import { formatKoreanDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PublicJobsPage() {
  const jobs = await listPublicJobs();
  const rows = await Promise.all(
    jobs.slice(0, 30).map(async (job) => ({
      job,
      summary: await ensureSummary(job),
    })),
  );
  const publicApiCount = jobs.filter((job) => job.source === "public_api").length;

  return (
    <EmployerLayout
      title="공공 일자리 정보"
      description="공공 API 또는 데모 공공 데이터를 내부 저장소에 정규화한 뒤 쉬운 설명과 함께 보여줍니다."
    >
      <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="text-base font-black text-emerald-950">
          현재 표시: {rows.length}건 · 실제 공공 API 데이터 {publicApiCount}건
        </p>
        <p className="mt-2 text-sm font-bold leading-relaxed text-emerald-900">
          로컬에서는 `/api/cron/sync-public-jobs`를 실행하면 공공데이터포털 구인정보가 내부 store에 들어옵니다. DB를 붙이면 이 목록이 영구 저장됩니다.
        </p>
      </div>

      <div className="grid gap-4">
        {rows.map(({ job, summary }) => (
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={job.id}>
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-black text-emerald-800">
                  {job.source === "public_api" ? "공공 API" : "데모 공공 데이터"}
                </p>
                <h2 className="mt-1 text-xl font-black">{job.title}</h2>
                <p className="mt-2 font-bold text-slate-700">
                  {[job.organization, job.workLocation, job.workTime].filter(Boolean).join(" · ")}
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-black text-slate-700">
                {formatKoreanDate(job.createdAt)}
              </span>
            </div>

            <dl className="mt-5 grid gap-4 md:grid-cols-3">
              <div>
                <dt className="text-sm font-black text-slate-600">쉬운 설명</dt>
                <dd className="mt-1 font-bold leading-relaxed">{summary.summary}</dd>
              </div>
              <div>
                <dt className="text-sm font-black text-slate-600">신청 조건</dt>
                <dd className="mt-1 font-bold leading-relaxed">{summary.eligibility}</dd>
              </div>
              <div>
                <dt className="text-sm font-black text-slate-600">신청 방법</dt>
                <dd className="mt-1 font-bold leading-relaxed">{summary.applicationGuide[0]}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </EmployerLayout>
  );
}
