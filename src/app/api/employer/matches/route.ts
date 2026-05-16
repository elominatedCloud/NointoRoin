import { NextResponse } from "next/server";
import { listEmployerMatchCandidates } from "@/lib/db";

export async function GET() {
  return NextResponse.json({
    ok: true,
    matches: await listEmployerMatchCandidates(),
  });
}
