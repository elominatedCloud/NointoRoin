import { EmployerLayout } from "@/components/employer/EmployerLayout";

const policies = [
  {
    title: "고령자 계속고용장려금",
    body: "정년 이후 계속 고용하는 경우 받을 수 있는 지원 제도를 확인합니다.",
  },
  {
    title: "시니어 적합 직무",
    body: "안내, 정리, 돌봄 보조처럼 짧은 시간 근무에 맞는 직무를 정리합니다.",
  },
  {
    title: "면담 체크리스트",
    body: "건강 상태, 근무 가능 시간, 이동 거리, 서 있는 시간을 짧게 확인합니다.",
  },
];

export default function EmployerPoliciesPage() {
  return (
    <EmployerLayout
      title="고용·정책 알아가기"
      description="기업이 시니어를 채용할 때 확인할 정책과 주의점을 쉽게 정리합니다."
    >
      <section className="grid gap-4 md:grid-cols-3">
        {policies.map((policy) => (
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" key={policy.title}>
            <h2 className="text-xl font-black">{policy.title}</h2>
            <p className="mt-4 font-bold leading-relaxed text-slate-700">{policy.body}</p>
          </article>
        ))}
      </section>
    </EmployerLayout>
  );
}
