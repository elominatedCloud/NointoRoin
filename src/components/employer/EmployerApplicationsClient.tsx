"use client";

import { useMemo, useState } from "react";
import { CalendarPlus, Phone, ShieldAlert } from "lucide-react";
import type { MatchCandidate } from "@/types/job";

type CandidateStatus = "검토 전" | "전화 예정" | "면담 예정" | "채용 보류" | "채용 확정" | "부적합";

const statuses: CandidateStatus[] = [
  "검토 전",
  "전화 예정",
  "면담 예정",
  "채용 보류",
  "채용 확정",
  "부적합",
];

export function EmployerApplicationsClient({ matches }: { matches: MatchCandidate[] }) {
  const [statusMap, setStatusMap] = useState<Record<string, CandidateStatus>>(() => {
    if (typeof window === "undefined") {
      return {};
    }

    const stored = localStorage.getItem("employer-candidate-status");
    if (stored) {
      return JSON.parse(stored) as Record<string, CandidateStatus>;
    }

    return {};
  });

  const enrichedMatches = useMemo(
    () =>
      matches.map((match) => ({
        ...match,
        reviewStatus: statusMap[match.id] ?? "검토 전",
      })),
    [matches, statusMap],
  );
  const callableCount = matches.filter((match) => match.phone).length;
  const bestScore = matches[0]?.score ?? 0;
  const interviewCount = enrichedMatches.filter((match) => match.reviewStatus === "면담 예정").length;

  function updateStatus(matchId: string, status: CandidateStatus) {
    setStatusMap((current) => {
      const next = { ...current, [matchId]: status };
      localStorage.setItem("employer-candidate-status", JSON.stringify(next));
      return next;
    });
  }

  return (
    <>
      <section className="mb-6 grid gap-4 md:grid-cols-4">
        <SummaryCard label="검토 후보" value={`${matches.length}명`} />
        <SummaryCard label="전화 가능" value={`${callableCount}명`} />
        <SummaryCard label="최고 적합도" value={`${bestScore}점`} />
        <SummaryCard label="면담 예정" value={`${interviewCount}명`} />
      </section>

      <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <p className="font-black text-amber-950">데모 상태 안내</p>
        <p className="mt-1 text-sm font-bold leading-relaxed text-amber-900">
          후보 상태는 이 브라우저에만 저장됩니다. 실제 채용 확정과 알림 발송은 백엔드 연결 후 붙이면 됩니다.
        </p>
      </div>

      <div className="grid gap-4">
        {enrichedMatches.map((match) => (
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={match.id}>
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-black text-emerald-800">{match.jobTitle}</p>
                <h2 className="mt-1 text-xl font-black">{match.seekerName}</h2>
                <p className="mt-1 font-semibold text-slate-700">{match.phone ?? "연락처 비공개"}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-900">
                  적합도 {match.score}점
                </span>
                {match.phone ? (
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-black text-sky-900">
                    전화 가능
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-black text-slate-600">
                    앱 내 연락 필요
                  </span>
                )}
                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-black text-amber-950">
                  {match.reviewStatus}
                </span>
              </div>
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

            <div className="mt-5 grid gap-3 lg:grid-cols-[auto_auto_1fr]">
              {match.phone ? (
                <a
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 text-base font-black text-white"
                  href={`tel:${match.phone.replace(/-/g, "")}`}
                  onClick={() => updateStatus(match.id, "전화 예정")}
                >
                  <Phone aria-hidden="true" size={20} strokeWidth={3} />
                  전화하기
                </a>
              ) : (
                <button
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 text-base font-black text-slate-500"
                  disabled
                  type="button"
                >
                  <ShieldAlert aria-hidden="true" size={20} strokeWidth={3} />
                  연락처 확인 필요
                </button>
              )}
              <button
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-emerald-800 bg-white px-5 text-base font-black text-emerald-900"
                onClick={() => updateStatus(match.id, "면담 예정")}
                type="button"
              >
                <CalendarPlus aria-hidden="true" size={20} strokeWidth={3} />
                면담 대상으로 표시
              </button>
              <label className="grid gap-1 text-sm font-black text-slate-600 lg:justify-self-end">
                상태 변경
                <select
                  className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-base font-bold text-slate-900"
                  onChange={(event) => updateStatus(match.id, event.target.value as CandidateStatus)}
                  value={match.reviewStatus}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </div>
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
    </>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-black text-slate-600">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}
