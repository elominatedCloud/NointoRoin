import { notFound } from "next/navigation";
import { ResultClient } from "@/components/senior/ResultClient";
import { ensureSummary, getJobById } from "@/lib/db";

export const dynamic = "force-dynamic";

type SeniorPublicJobDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SeniorPublicJobDetailPage({
  params,
}: SeniorPublicJobDetailPageProps) {
  const { id } = await params;
  const job = await getJobById(decodeURIComponent(id));

  if (!job || (job.source !== "public_api" && job.source !== "mock")) {
    notFound();
  }

  const summary = await ensureSummary(job, { useAi: true });

  return <ResultClient initialResult={summary} />;
}
