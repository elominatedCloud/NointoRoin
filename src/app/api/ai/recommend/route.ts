import { NextResponse } from "next/server";
import { createRecommendationWithAi } from "@/lib/ai";
import { listJobs } from "@/lib/db";

export async function POST() {
  const jobs = await listJobs();
  return NextResponse.json(await createRecommendationWithAi(jobs));
}
