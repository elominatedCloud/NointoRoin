import { NextResponse } from "next/server";
import { getEmployerProfile, saveEmployerProfile } from "@/lib/db";

export async function GET() {
  return NextResponse.json({
    ok: true,
    profile: await getEmployerProfile(),
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.companyName || !body?.phone || !body?.address) {
    return NextResponse.json(
      { ok: false, error: "기업명, 연락처, 주소는 필수입니다." },
      { status: 400 },
    );
  }

  const profile = await saveEmployerProfile({
    companyName: String(body.companyName),
    ownerName: body.ownerName ? String(body.ownerName) : null,
    phone: String(body.phone),
    address: String(body.address),
    industry: body.industry ? String(body.industry) : null,
    description: body.description ? String(body.description) : null,
  });

  return NextResponse.json({ ok: true, profile });
}
