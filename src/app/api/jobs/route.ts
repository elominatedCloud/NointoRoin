import { NextResponse } from "next/server";
import { listJobs } from "@/lib/db";

export async function GET() {
  return NextResponse.json({
    ok: true,
    jobs: await listJobs(),
  });
}
