import { NextResponse } from "next/server";
import { ensureSummary, getJobById } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const jobId = typeof body?.jobId === "string" ? body.jobId : "";

  if (!jobId) {
    return NextResponse.json({ ok: false, error: "jobId가 필요합니다." }, { status: 400 });
  }

  const job = await getJobById(jobId);
  if (!job) {
    return NextResponse.json({ ok: false, error: "공고를 찾을 수 없습니다." }, { status: 404 });
  }

  const summary = await ensureSummary(job, { useAi: true });

  return NextResponse.json({
    ok: true,
    summary: {
      title: summary.title,
      summary: summary.summary,
      eligibility: summary.eligibility,
      workCondition: summary.workCondition,
      applicationGuide: summary.applicationGuide,
      caution: summary.caution,
    },
  });
}
