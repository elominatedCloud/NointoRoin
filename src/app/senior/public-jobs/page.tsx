import Link from "next/link";
import { ensureSummary, listPublicJobs } from "@/lib/db";

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
    <main className="min-h-screen bg-[#f7fbf4] px-5 py-6 text-[#17211b]">
      <section className="mx-auto w-full max-w-[430px]">
        <h1 className="text-[34px] font-black leading-tight">
          공공 일자리
          <br />
          쉽게 보기
        </h1>
        <p className="mt-5 text-[22px] font-bold leading-relaxed">
          현재 들어온 공공 일자리 중 일부를 쉬운 말로 보여드립니다.
        </p>
        <Link
          className="mt-6 flex min-h-[64px] w-full items-center justify-center rounded-2xl border-2 border-[#1f6f4a] bg-white px-5 text-center text-[21px] font-black leading-tight text-[#1f6f4a]"
          href="/senior/jobs-map"
        >
          우리 동네 일자리 지도
        </Link>

        <div className="mt-7 grid gap-4">
          {rows.map(({ job, summary }) => (
            <article className="rounded-[24px] bg-white p-5 shadow-lg shadow-emerald-950/10" key={job.id}>
              <p className="text-[18px] font-black text-[#1f6f4a]">
                {job.source === "public_api" ? "공공 API" : "데모 공공 데이터"}
              </p>
              <h2 className="mt-2 text-[25px] font-black leading-tight">{job.title}</h2>
              <p className="mt-3 text-[20px] font-bold leading-snug">
                {[job.organization, job.workLocation].filter(Boolean).join(" · ")}
              </p>
              <p className="mt-4 text-[21px] font-bold leading-relaxed">{summary.summary}</p>
              <p className="mt-4 rounded-2xl bg-[#eef8ed] p-4 text-[20px] font-bold leading-relaxed">
                {summary.eligibility}
              </p>
              <Link
                className="mt-5 flex min-h-[64px] w-full items-center justify-center rounded-2xl bg-[#1f6f4a] px-5 text-center text-[21px] font-black leading-tight text-white"
                href={`/senior/public-jobs/${encodeURIComponent(job.id)}`}
              >
                자세히 듣고 신청하기
              </Link>
            </article>
          ))}
        </div>

        <Link
          className="mt-7 flex min-h-[72px] w-full items-center justify-center rounded-2xl border-2 border-[#1f6f4a] bg-white px-6 text-center text-[22px] font-black text-[#1f6f4a]"
          href="/senior"
        >
          처음으로
        </Link>
      </section>
    </main>
  );
}
