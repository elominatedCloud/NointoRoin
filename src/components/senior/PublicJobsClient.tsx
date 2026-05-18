"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import type { EasyJobSummary } from "@/types/ai";
import type { Job } from "@/types/job";

type PublicJobRow = {
    job: Job;
    summary: EasyJobSummary;
};

export function PublicJobsClient({ rows }: { rows: PublicJobRow[] }) {
    const [region, setRegion] = useState("전체");
    const [period, setPeriod] = useState("전체");

    const filteredRows = useMemo(() => {
        return rows.filter(({ job }) => {
            const regionText = [job.region, job.workLocation, job.organization]
                .filter(Boolean)
                .join(" ");

            const periodText = [job.workTime, job.description]
                .filter(Boolean)
                .join(" ");

            const regionMatched =
                region === "전체" || regionText.includes(region);

            const periodMatched =
                period === "전체" ||
                (period === "단기" && /단기|1개월|2개월|3개월|짧/.test(periodText)) ||
                (period === "장기" && /장기|6개월|1년|계속/.test(periodText));

            return regionMatched && periodMatched;
        });
    }, [rows, region, period]);

    return (
        <>
            <section className="mt-5 grid grid-cols-2 gap-3">
                <select
                    value={region}
                    onChange={(event) => setRegion(event.target.value)}
                    className="min-h-[52px] rounded-xl border-2 border-[#3ACBA7] bg-white px-3 text-[20px] font-black text-[#17211b] outline-none transition duration-200 hover:bg-[#E8FBF6] focus:border-[#2FB894] focus:ring-4 focus:ring-[#3ACBA7]/20"
                >
                    <option value="전체">희망지역</option>
                    <option value="서울">서울</option>
                    <option value="경기">경기</option>
                    <option value="인천">인천</option>
                </select>

                <select
                    value={period}
                    onChange={(event) => setPeriod(event.target.value)}
                    className="min-h-[52px] rounded-xl border-2 border-[#3ACBA7] bg-white px-3 text-[20px] font-black text-[#17211b] outline-none transition duration-200 hover:bg-[#E8FBF6] focus:border-[#2FB894] focus:ring-4 focus:ring-[#3ACBA7]/20"
                >
                    <option value="전체">근속</option>
                    <option value="단기">단기</option>
                    <option value="장기">장기</option>
                </select>
            </section>

            <section className="mt-5 grid gap-3">
                {filteredRows.map(({ job, summary }) => (
                    <Link
                        key={job.id}
                        href={`/senior/public-jobs/${encodeURIComponent(job.id)}`}
                        className="group grid min-h-[82px] grid-cols-[1fr_58px] gap-3 rounded-xl border border-[#BDEFE4] bg-white p-3 shadow-sm shadow-[#3ACBA7]/10 transition duration-200 hover:-translate-y-0.5 hover:border-[#3ACBA7] hover:bg-[#f8ffff] hover:shadow-md hover:shadow-[#3ACBA7]/20 active:scale-[0.99]"
                    >
                        <div>
                            <h2 className="line-clamp-1 text-[19px] font-black text-[#17211b]">
                                {job.title}
                            </h2>

                            <p className="mt-2 line-clamp-2 text-[16px] font-bold leading-snug text-[#526157]">
                                {summary.summary}
                            </p>
                        </div>

                        <div className="flex items-center justify-center rounded-lg bg-[#2DC8CA] text-[16px] font-black text-white transition duration-200 group-hover:bg-[#38A2B8]">
                            지원
                        </div>
                    </Link>
                ))}

                {filteredRows.length === 0 && (
                    <div className="rounded-xl border border-[#BDEFE4] bg-white p-5 text-center shadow-sm shadow-[#3ACBA7]/10">
                        <p className="text-[20px] font-black text-[#17211b]">
                            조건에 맞는 공고가 없습니다
                        </p>
                        <p className="mt-2 text-[16px] font-bold text-[#526157]">
                            다른 지역이나 근속 조건을 선택해보세요.
                        </p>
                    </div>
                )}
            </section>

            <Link
                href="/senior/help"
                className="mt-6 flex min-h-[74px] items-center justify-center gap-3 rounded-xl bg-[#3ACBA7] px-5 text-[23px] font-black text-white shadow-lg shadow-[#3ACBA7]/20 transition duration-200 hover:bg-[#2FB894] hover:shadow-xl hover:shadow-[#3ACBA7]/30 active:scale-[0.98]"
            >
                대화로 도움 받기
                <MessageCircle size={28} strokeWidth={3} />
            </Link>
        </>
    );
}