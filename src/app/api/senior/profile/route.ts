import { NextResponse } from "next/server";
import { listSeniorProfiles, saveSeniorProfile } from "@/lib/db";

export async function GET() {
  return NextResponse.json({
    ok: true,
    profiles: await listSeniorProfiles(),
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.previousWork || !body?.preferredTime || !body?.healthLimit) {
    return NextResponse.json(
      { ok: false, error: "경력, 희망 시간, 건강 상태 선택이 필요합니다." },
      { status: 400 },
    );
  }

  const profile = await saveSeniorProfile({
    name: typeof body.name === "string" && body.name.trim() ? body.name.trim() : "방금 등록한 구직자",
    phone: typeof body.phone === "string" && body.phone.trim() ? body.phone.trim() : null,
    ageRange: typeof body.ageRange === "string" && body.ageRange.trim() ? body.ageRange.trim() : "60대",
    region: typeof body.region === "string" && body.region.trim() ? body.region.trim() : "서울 중구",
    previousWork: String(body.previousWork),
    preferredTime: String(body.preferredTime),
    healthLimit: String(body.healthLimit),
    preferredJobType:
      typeof body.preferredJobType === "string" && body.preferredJobType.trim()
        ? body.preferredJobType.trim()
        : null,
    consentToEmployerMatching: body.consentToEmployerMatching !== false,
  });

  return NextResponse.json({ ok: true, profile });
}
