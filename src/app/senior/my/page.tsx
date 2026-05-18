import Link from "next/link";
import { SeniorLayout } from "@/components/senior/SeniorLayout";

const settings = ["계정 설정", "구독 페이지", "문의하기", "개인정보 설정"];

export default function SeniorMyPage() {
  return (
    <SeniorLayout showHomeLink>
      <header>
        <h1 className="text-[34px] font-black leading-tight">마이</h1>
        <p className="mt-4 text-[21px] font-bold leading-relaxed">
          계정과 문의, 개인정보 설정을 확인합니다.
        </p>
      </header>

      <div className="mt-7 grid gap-3">
        {settings.map((label) => (
          <button
            className="min-h-[70px] rounded-[22px] bg-white px-5 text-left text-[22px] font-black shadow-md shadow-emerald-950/10"
            key={label}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      <Link
        className="mt-6 flex min-h-[68px] w-full items-center justify-center rounded-2xl border-2 border-[#3ACBA7] bg-white px-6 text-center text-[22px] font-black text-[#3ACBA7] hover:bg-[#3ACBA7] hover:text-[white]"
        href="/"
      >
        시작 화면으로
      </Link>
    </SeniorLayout>
  );
}
