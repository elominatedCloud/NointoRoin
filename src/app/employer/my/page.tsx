import { EmployerLayout } from "@/components/employer/EmployerLayout";

const settings = ["계정 설정", "구독 페이지", "문의하기", "개인정보 설정"];

export default function EmployerMyPage() {
  return (
    <EmployerLayout title="마이" description="기업 계정과 서비스 이용 설정을 관리합니다.">
      <section className="grid gap-4 md:grid-cols-2">
        {settings.map((label) => (
          <button
            className="rounded-2xl border border-slate-200 bg-white p-6 text-left text-xl font-black shadow-sm"
            key={label}
            type="button"
          >
            {label}
          </button>
        ))}
      </section>
    </EmployerLayout>
  );
}
