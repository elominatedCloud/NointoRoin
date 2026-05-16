import { NextResponse } from "next/server";
import { ensureSummary, getJobById } from "@/lib/db";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const job = await getJobById(decodeURIComponent(id));

  if (!job) {
    return NextResponse.json({ ok: false, error: "공고를 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    job,
    summary: await ensureSummary(job),
  });
}
