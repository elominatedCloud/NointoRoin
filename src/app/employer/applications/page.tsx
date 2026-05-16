import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { listEmployerMatchCandidates } from "@/lib/db";

export default async function EmployerApplicationsPage() {
  const matches = await listEmployerMatchCandidates();

  return (
    <EmployerLayout
      title="추천 근로자"
      description="내부 데모 프로필과 공고를 비교해 적합도가 높은 후보를 보여줍니다."
    >
      <div className="grid gap-4">
        {matches.map((match) => (
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={match.id}>
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-black text-emerald-800">{match.jobTitle}</p>
                <h2 className="mt-1 text-xl font-black">{match.seekerName}</h2>
                <p className="mt-1 font-semibold text-slate-700">
                  {match.phone ?? "연락처 비공개"}
                </p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-900">
                적합도 {match.score}점
              </span>
            </div>
            <dl className="mt-5 grid gap-3 md:grid-cols-3">
              <div>
                <dt className="text-sm font-black text-slate-600">적합한 이유</dt>
                <dd className="mt-1 font-bold">{match.fitSummary}</dd>
              </div>
              <div>
                <dt className="text-sm font-black text-slate-600">프로필 요약</dt>
                <dd className="mt-1 font-bold">{match.profileSummary}</dd>
              </div>
              <div>
                <dt className="text-sm font-black text-slate-600">확인할 점</dt>
                <dd className="mt-1 font-bold">{match.caution}</dd>
              </div>
            </dl>
          </article>
        ))}
        {matches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="text-lg font-bold text-slate-700">
              아직 추천할 구직자 프로필이 없습니다. 노인용 추천 흐름에서 프로필을 먼저 등록하세요.
            </p>
          </div>
        ) : null}
      </div>
    </EmployerLayout>
  );
}
