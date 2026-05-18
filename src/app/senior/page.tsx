"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SeniorLayout } from "@/components/senior/SeniorLayout";
import { MessageCircle } from "lucide-react";

export default function SeniorHomePage() {
    const router = useRouter();

    const handleLogout = () => {
        router.push("/");
    };

    return (
        <SeniorLayout>
            <header className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-[34px] font-black leading-tight text-[#3ACBA7]">
                        로인
                    </h1>
                    <p className="mt-1 text-[18px] font-bold text-[#425247]">
                        노인(老人)을 로인(勞人)으로
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-[16px] font-black text-[#526157]">
                        ○님 반갑습니다
                    </p>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="mt-2 rounded-xl border border-[#BDEFE4] bg-white px-3 py-1 text-[15px] font-black text-[#526157] shadow-sm shadow-[#3ACBA7]/10 transition duration-200 hover:border-[#3ACBA7] hover:bg-[#E8FBF6] hover:text-[#3ACBA7] active:scale-[0.97]"
                    >
                        로그아웃
                    </button>
                </div>
            </header>

            <section className="mt-12 grid grid-cols-2 gap-5">
                <Link
                    href="/senior/public-jobs"
                    className="flex aspect-square items-center justify-center rounded-[24px] border border-[#BDEFE4] bg-white p-5 text-center text-[31px] font-black leading-tight shadow-lg shadow-[#3ACBA7]/10 transition duration-200 hover:-translate-y-1 hover:border-[#3ACBA7] hover:bg-[#E8FBF6] hover:shadow-xl hover:shadow-[#3ACBA7]/20 active:translate-y-0 active:scale-[0.98]"
                >
                    공고 보기
                </Link>

                <Link
                    href="/senior/voice?mode=recommend"
                    className="flex aspect-square items-center justify-center rounded-[24px] border border-[#BDEFE4] bg-white p-5 text-center text-[31px] font-black leading-tight shadow-lg shadow-[#3ACBA7]/10 transition duration-200 hover:-translate-y-1 hover:border-[#3ACBA7] hover:bg-[#E8FBF6] hover:shadow-xl hover:shadow-[#3ACBA7]/20 active:translate-y-0 active:scale-[0.98]"
                >
                    일자리
                    <br />
                    추천 받기
                </Link>
            </section>

            <Link
                href="/senior/help"
                className="mt-7 flex min-h-[74px] items-center justify-center gap-3 rounded-[22px] bg-[#3ACBA7] px-5 text-[24px] font-black text-white shadow-lg shadow-[#3ACBA7]/20 transition duration-200 hover:bg-[#2FB894] hover:shadow-xl hover:shadow-[#3ACBA7]/30 active:scale-[0.98]"
            >
                대화로 도움 받기
                <MessageCircle size={28} strokeWidth={3} />
            </Link>
        </SeniorLayout>
    );
}