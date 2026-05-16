import Link from "next/link";
import { EmployerLayout } from "@/components/employer/EmployerLayout";

const actions = [
  { href: "/employer/profile", label: "기업 정보 입력", description: "채용 담당 기업 정보를 저장합니다." },
  { href: "/employer/jobs/new", label: "공고 등록하기", description: "시니어가 이해하기 쉬운 공고를 만듭니다." },
  { href: "/employer/jobs", label: "내가 올린 공고 보기", description: "등록한 공고와 AI 설명 상태를 확인합니다." },
];

export default function EmployerHomePage() {
  return (
    <EmployerLayout
      title="기업용 일자리 관리"
      description="시니어 채용 공고를 쉽고 간단하게 올려보세요."
    >
      <div className="grid gap-4 md:grid-cols-3">
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
      </div>
    </EmployerLayout>
  );
}
