import { EmployerLayout } from "@/components/employer/EmployerLayout";

const rows = [
  { name: "김영자", job: "복지관 안내 도우미", days: "8일", code: "2841", pay: "304,000원" },
  { name: "박성호", job: "동네 마트 진열 보조", days: "5일", code: "7392", pay: "165,000원" },
];

export default function EmployerAttendancePage() {
  return (
    <EmployerLayout
      title="출퇴근 관리"
      description="월간 출근 현황과 일별 출근코드를 확인하는 데모 화면입니다."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <Metric label="이번 달 출근" value="13일" />
        <Metric label="근속수당 확인" value="2명" />
        <Metric label="오늘 출근코드" value="2841" />
      </section>

      <section className="mt-6 grid gap-4">
        {rows.map((row) => (
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={row.name}>
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-black text-emerald-800">{row.job}</p>
                <h2 className="mt-1 text-xl font-black">{row.name}</h2>
                <p className="mt-2 font-bold text-slate-700">월간 출근 {row.days}</p>
              </div>
              <div className="grid gap-2 text-left md:text-right">
                <p className="text-lg font-black">출근코드 {row.code}</p>
                <p className="font-bold text-slate-700">예상 일급 {row.pay}</p>
              </div>
            </div>
          </article>
        ))}
      </section>
    </EmployerLayout>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-black text-slate-600">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
    </div>
  );
}
