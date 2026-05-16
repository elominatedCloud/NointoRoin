import { NextResponse } from "next/server";
import { createEmployerJob, ensureSummary, listEmployerJobs } from "@/lib/db";
import type { EmployerJobInput } from "@/types/job";

const requiredFields: Array<keyof EmployerJobInput> = [
  "title",
  "description",
  "workLocation",
  "workTime",
  "pay",
  "eligibility",
  "applicationMethod",
  "phone",
];

export async function GET() {
  return NextResponse.json({
    ok: true,
    jobs: await listEmployerJobs(),
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Partial<EmployerJobInput> | null;

  if (!body) {
    return NextResponse.json({ ok: false, error: "요청 본문이 필요합니다." }, { status: 400 });
  }

  const missing = requiredFields.find((field) => !String(body[field] ?? "").trim());
  if (missing) {
    return NextResponse.json({ ok: false, error: `${missing} 값이 필요합니다.` }, { status: 400 });
  }

  const job = await createEmployerJob({
    title: String(body.title),
    description: String(body.description),
    workLocation: String(body.workLocation),
    workTime: String(body.workTime),
    pay: String(body.pay),
    eligibility: String(body.eligibility),
    preferredConditions: String(body.preferredConditions ?? ""),
    applicationMethod: String(body.applicationMethod),
    phone: String(body.phone),
  });

  return NextResponse.json({
    ok: true,
    job,
    summary: await ensureSummary(job),
  });
}
