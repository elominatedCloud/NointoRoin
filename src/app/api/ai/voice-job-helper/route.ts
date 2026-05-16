import { NextResponse } from "next/server";
import { createVoiceAnswer } from "@/lib/ai";
import type { VoiceMode } from "@/types/ai";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const mode: VoiceMode = body?.mode === "recommend" ? "recommend" : "ask";
  const transcript = typeof body?.transcript === "string" ? body.transcript : "";
  const previousWork = typeof body?.previousWork === "string" ? body.previousWork : "";
  const healthLimit = typeof body?.healthLimit === "string" ? body.healthLimit : "";
  const preferredTime = typeof body?.preferredTime === "string" ? body.preferredTime : "";

  return NextResponse.json({
    ok: true,
    result: createVoiceAnswer(mode, transcript, {
      previousWork,
      healthLimit,
      preferredTime,
    }),
  });
}
