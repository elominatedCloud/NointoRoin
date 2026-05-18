import Link from "next/link";
import { SeniorLayout } from "@/components/senior/SeniorLayout";

const days = [
  { day: "5월 6일", status: "출근 완료", pay: "38,000원" },
  { day: "5월 8일", status: "출근 완료", pay: "38,000원" },
  { day: "5월 13일", status: "출근 예정", pay: "확인 중" },
];

export default function SeniorAttendancePage() {
  return (
    <SeniorLayout showHomeLink>
      <header>
        <h1 className="text-[34px] font-black leading-tight">
          출근 달력
          <br />
          쉽게 확인
        </h1>
        <p className="mt-4 text-[21px] font-bold leading-relaxed">
          이번 달 출근한 날과 받을 수 있는 금액을 한눈에 보여드립니다.
        </p>
      </header>

      <section className="mt-7 rounded-[24px] bg-white p-5 shadow-lg shadow-emerald-950/10">
        <p className="text-[19px] font-black text-[#238B73]">2026년 5월</p>
        <p className="mt-2 text-[30px] font-black">2일 출근 완료</p>
        <p className="mt-2 text-[21px] font-bold leading-relaxed">예상 일급 합계 76,000원</p>
      </section>

      <div className="mt-4 grid gap-3">
        {days.map((item) => (
          <article className="rounded-[22px] bg-white p-5 shadow-md shadow-emerald-950/10" key={item.day}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[23px] font-black">{item.day}</h2>
                <p className="mt-1 text-[19px] font-bold text-[#526157]">{item.status}</p>
              </div>
              <p className="text-right text-[20px] font-black text-[#238B73]">{item.pay}</p>
            </div>
          </article>
        ))}
      </div>

      <Link
        className="mt-6 flex min-h-[68px] w-full items-center justify-center rounded-2xl bg-[#238B73] px-6 text-center text-[22px] font-black text-white"
        href="/senior/voice?mode=ask"
      >
        출근 관련 질문하기
      </Link>
    </SeniorLayout>
  );
}
