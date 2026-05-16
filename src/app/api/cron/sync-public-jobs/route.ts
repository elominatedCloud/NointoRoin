import { NextResponse } from "next/server";
import { fetchPublicJobs } from "@/lib/publicJobApi";
import { upsertPublicJobs } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET || "local-dev-cron-secret";
  const authorization = request.headers.get("authorization");

  if (authorization !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const fetched = await fetchPublicJobs();
  const stats = await upsertPublicJobs(fetched.jobs);

  return NextResponse.json({
    ok: true,
    fetched: fetched.fetched,
    inserted: stats.inserted,
    updated: stats.updated,
    skipped: stats.skipped,
    source: fetched.source,
    warning: fetched.error,
  });
}
