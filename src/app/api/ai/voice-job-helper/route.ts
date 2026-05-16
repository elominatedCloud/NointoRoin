import { NextResponse } from "next/server";
import { createVoiceAnswer } from "@/lib/ai";
import type { VoiceMode } from "@/types/ai";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const mode: VoiceMode = body?.mode === "recommend" ? "recommend" : "ask";
  const transcript = typeof body?.transcript === "string" ? body.transcript : "";

  return NextResponse.json({
    ok: true,
    result: createVoiceAnswer(mode, transcript),
  });
}
