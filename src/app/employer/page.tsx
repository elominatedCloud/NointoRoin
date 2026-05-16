import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  FileText,
  Phone,
  PlusCircle,
  ShieldCheck,
} from "lucide-react";
import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { getDemoStats, listEmployerMatchCandidates } from "@/lib/db";

const todayTasks = [
  {
    href: "/employer/jobs/new",
    label: "공고 등록하기",
    description: "근무 시간과 하는 일을 입력하면 쉬운 설명을 만듭니다.",
    icon: PlusCircle,
    cta: "새 공고",
  },
  {
    href: "/employer/applications",
    label: "추천 이력서 검토",
    description: "적합도와 주의점을 보고 바로 연락합니다.",
    icon: FileText,
    cta: "후보 보기",
  },
  {
    href: "/employer/attendance",
    label: "출근코드 공유",
    description: "오늘 출근코드와 월간 출근 현황을 확인합니다.",
    icon: CalendarClock,
    cta: "출퇴근",
  },
];

const operationLinks = [
  { href: "/employer/jobs", label: "공고 관리", icon: BriefcaseBusiness },
  { href: "/employer/policies", label: "정책 확인", icon: ShieldCheck },
  { href: "/employer/profile", label: "기업 정보", icon: CheckCircle2 },
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
      title="오늘 채용 업무"
      description="공고 등록, 추천 이력서 검토, 출근코드 확인을 순서대로 처리합니다."
    >
      <section className="grid gap-4 md:grid-cols-4">
        <Metric label="등록 공고" value={`${stats.employerJobCount}건`} note="모집 중" />
        <Metric label="검토할 후보" value={`${stats.matchCount}명`} note="적합도 순" />
        <Metric label="시니어 프로필" value={`${stats.seniorProfileCount}명`} note="동의 완료" />
        <Metric label="공공 API" value={stats.publicApiConnected ? "연결됨" : "데모"} note={`${stats.publicJobCount}건 수집`} />
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {todayTasks.map((task, index) => {
          const Icon = task.icon;

          return (
            <Link
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-700"
              href={task.href}
              key={task.href}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                  <Icon aria-hidden="true" size={24} strokeWidth={2.5} />
                </span>
                <span className="text-sm font-black text-slate-500">STEP {index + 1}</span>
              </div>
              <h2 className="mt-5 text-xl font-black">{task.label}</h2>
              <p className="mt-3 min-h-12 font-bold leading-relaxed text-slate-700">{task.description}</p>
              <p className="mt-5 inline-flex items-center gap-2 font-black text-emerald-800">
                {task.cta}
                <ArrowRight aria-hidden="true" size={18} strokeWidth={3} />
              </p>
            </Link>
          );
        })}
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black">추천 인재 TOP 3</h2>
              <p className="mt-2 font-bold text-slate-600">공고와 맞는 이유와 연락 가능 여부를 같이 봅니다.</p>
            </div>
            <Link className="shrink-0 text-sm font-black text-emerald-800" href="/employer/applications">
              전체 보기
            </Link>
          </div>
          <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
            {topMatches.map((match) => (
              <div className="grid gap-4 border-b border-slate-200 p-4 last:border-b-0 md:grid-cols-[1fr_90px_120px]" key={match.id}>
                <div>
                  <p className="text-sm font-black text-emerald-800">{match.jobTitle}</p>
                  <p className="mt-1 text-lg font-black">{match.seekerName}</p>
                  <p className="mt-2 text-sm font-bold leading-relaxed text-slate-700">{match.fitSummary}</p>
                </div>
                <div>
                  <p className="text-xs font-black text-slate-500">적합도</p>
                  <p className="mt-1 text-2xl font-black text-emerald-900">{match.score}점</p>
                </div>
                <div className="flex items-center md:justify-end">
                  {match.phone ? (
                    <a
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-4 py-3 text-sm font-black text-white"
                      href={`tel:${match.phone.replace(/-/g, "")}`}
                    >
                      <Phone aria-hidden="true" size={18} strokeWidth={3} />
                      전화
                    </a>
                  ) : (
                    <span className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-500">
                      연락처 없음
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">운영 체크</h2>
          <div className="mt-5 grid gap-3">
            {operationLinks.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  className="flex min-h-14 items-center justify-between rounded-xl bg-slate-50 px-4 font-black text-slate-800"
                  href={link.href}
                  key={link.href}
                >
                  <span className="flex items-center gap-3">
                    <Icon aria-hidden="true" className="text-emerald-800" size={20} strokeWidth={2.5} />
                    {link.label}
                  </span>
                  <ArrowRight aria-hidden="true" size={18} strokeWidth={3} />
                </Link>
              );
            })}
          </div>
          <p className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm font-bold leading-relaxed text-emerald-950">
            면담 때는 가능 요일, 이동 거리, 건강상 제한, 서 있는 시간을 먼저 확인하세요.
          </p>
        </aside>
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
