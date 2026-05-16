import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { listApplications, listJobs } from "@/lib/db";
import { formatKoreanDate } from "@/lib/utils";

export default async function EmployerApplicationsPage() {
  const [applications, jobs] = await Promise.all([listApplications(), listJobs()]);
  const jobTitle = new Map(jobs.map((job) => [job.id, job.title]));

  return (
    <EmployerLayout
      title="지원자 확인"
      description="MVP에서는 예시 지원자 데이터로 화면을 확인합니다."
    >
      <div className="grid gap-4">
        {applications.map((application) => (
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={application.id}>
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-xl font-black">{application.applicantName}</h2>
                <p className="mt-1 font-semibold text-slate-700">{application.phone}</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-900">
                {application.status === "submitted" ? "신규 지원" : "검토 중"}
              </span>
            </div>
            <dl className="mt-5 grid gap-3 md:grid-cols-3">
              <div>
                <dt className="text-sm font-black text-slate-600">지원 공고</dt>
                <dd className="mt-1 font-bold">{jobTitle.get(application.jobId) ?? application.jobId}</dd>
              </div>
              <div>
                <dt className="text-sm font-black text-slate-600">지원일</dt>
                <dd className="mt-1 font-bold">{formatKoreanDate(application.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-sm font-black text-slate-600">간단한 이력</dt>
                <dd className="mt-1 font-bold">{application.resumeSummary}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </EmployerLayout>
  );
}
