import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ensureSummary, listPublicJobs } from "@/lib/db";
import { SeniorLayout } from "@/components/senior/SeniorLayout";
import { PublicJobsClient } from "@/components/senior/PublicJobsClient";

export const dynamic = "force-dynamic";

export default async function SeniorPublicJobsPage() {
    const jobs = (await listPublicJobs()).slice(0, 5);

    const rows = await Promise.all(
        jobs.map(async (job) => ({
            job,
            summary: await ensureSummary(job),
        })),
    );

    return (
        <SeniorLayout>
            <header className="flex items-center justify-between gap-4">
                <Link
                    href="/senior"
                    className="flex min-h-[52px] items-center gap-2 rounded-xl border-2 border-[#17211b] bg-white px-4 text-[20px] font-black"
                >
                    <ArrowLeft size={24} strokeWidth={3} />
                    뒤로가기
                </Link>

                <h1 className="text-[31px] font-black">공고보기</h1>
            </header>

            <PublicJobsClient rows={rows} />
        </SeniorLayout>
    );
}