import { NextResponse } from "next/server";
import { createVoiceAnswerWithAi } from "@/lib/ai";
import { listJobs } from "@/lib/db";
import type { VoiceMode } from "@/types/ai";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const mode: VoiceMode = body?.mode === "recommend" ? "recommend" : "ask";
  const transcript = typeof body?.transcript === "string" ? body.transcript : "";
  const previousWork = typeof body?.previousWork === "string" ? body.previousWork : "";
  const healthLimit = typeof body?.healthLimit === "string" ? body.healthLimit : "";
  const preferredTime = typeof body?.preferredTime === "string" ? body.preferredTime : "";
  const candidateJobs = mode === "recommend" ? await listJobs() : [];

  return NextResponse.json({
    ok: true,
    result: await createVoiceAnswerWithAi(mode, transcript, {
      previousWork,
      healthLimit,
      preferredTime,
      candidateJobs,
    }),
  });
}
