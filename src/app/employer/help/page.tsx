import Link from "next/link";
import { EmployerLayout } from "@/components/employer/EmployerLayout";

export default function EmployerHelpPage() {
  return (
    <EmployerLayout
      title="AI 도움챗봇"
      description="시니어 채용 공고 작성과 면담 기준을 빠르게 확인하는 데모 도움 화면입니다."
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black">무엇을 도와드릴까요?</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {["공고 문구 다듬기", "적합도 기준 설명", "면담 질문 만들기"].map((label) => (
            <button
              className="rounded-xl bg-slate-50 px-5 py-4 text-left font-black text-slate-800"
              key={label}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
        <Link
          className="mt-6 inline-flex rounded-xl bg-emerald-800 px-5 py-4 font-black text-white"
          href="/employer/jobs/new"
        >
          공고 등록으로 이동
        </Link>
      </section>
    </EmployerLayout>
  );
}
