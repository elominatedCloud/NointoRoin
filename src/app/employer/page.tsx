import Link from "next/link";
import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { getDemoStats, listEmployerMatchCandidates } from "@/lib/db";

const actions = [
  { href: "/employer/jobs", label: "내가 올린 공고 확인", description: "등록한 공고와 AI 설명 상태를 확인합니다." },
  { href: "/employer/applications", label: "제출된 이력서 확인", description: "추천 근로자와 적합도를 확인합니다." },
  { href: "/employer/attendance", label: "출퇴근 관리", description: "출근코드와 월간 근속수당을 확인합니다." },
  { href: "/employer/policies", label: "고용·정책 알아가기", description: "시니어 채용 지원 정책을 쉽게 봅니다." },
  { href: "/employer/profile", label: "기업 정보 수정하기", description: "기업 이름, 위치, 업종을 관리합니다." },
  { href: "/employer/my", label: "마이", description: "계정, 구독, 문의, 개인정보 설정입니다." },
  { href: "/employer/help", label: "AI 도움챗봇", description: "고용주가 궁금한 내용을 빠르게 확인합니다." },
];

export const dynamic = "force-dynamic";

export default function EmployerHomePage() {
  return <EmployerHome />;
}

async function EmployerHome() {
  const [stats, matches] = await Promise.all([
    getDemoStats(),
    listEmployerMatchCandidates(),
  ]);
  const topMatches = matches.slice(0, 3);

  return (
    <EmployerLayout
      title="기업용 메인 홈"
      description="공고, 제출 이력서, 출퇴근, 정책, 기업 정보를 한 곳에서 관리합니다."
    >
      <section className="grid gap-4 md:grid-cols-4">
        <Metric label="등록 공고" value={`${stats.employerJobCount}건`} />
        <Metric label="추천 후보" value={`${stats.matchCount}명`} />
        <Metric label="시니어 프로필" value={`${stats.seniorProfileCount}명`} />
        <Metric
          label="공공 API"
          value={stats.publicApiConnected ? "연결됨" : "데모"}
          note={`${stats.publicJobCount}건 수집`}
        />
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-black">제출 이력서 미리보기</h2>
            <Link className="text-sm font-black text-emerald-800" href="/employer/applications">
              전체 보기
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {topMatches.map((match) => (
              <div className="rounded-xl bg-slate-50 p-4" key={match.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-emerald-800">{match.jobTitle}</p>
                    <p className="mt-1 text-lg font-black">{match.seekerName}</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-900">
                    {match.score}점
                  </span>
                </div>
                <p className="mt-2 text-sm font-bold leading-relaxed text-slate-700">{match.fitSummary}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">처음 설정</h2>
          <p className="mt-3 leading-relaxed text-slate-700">
            첫 실행에서는 기업 정보를 먼저 입력하고, 이후 메인 홈에서 공고와 이력서를 관리합니다.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link
              className="rounded-xl bg-emerald-800 px-5 py-4 text-center font-black text-white"
              href="/employer/profile"
            >
              기업 정보 입력
            </Link>
            <Link
              className="rounded-xl border border-emerald-800 bg-white px-5 py-4 text-center font-black text-emerald-900"
              href="/employer/jobs/new"
            >
              공고 등록하기
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        {actions.map((action) => (
          <Link
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-emerald-700"
            href={action.href}
            key={action.href}
          >
            <h2 className="text-xl font-black text-slate-950">{action.label}</h2>
            <p className="mt-3 leading-relaxed text-slate-700">{action.description}</p>
          </Link>
        ))}
      </section>
    </EmployerLayout>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-black text-slate-600">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
      {note ? <p className="mt-2 text-sm font-bold text-emerald-800">{note}</p> : null}
    </div>
  );
}
