import { NextResponse } from "next/server";
import { createRecommendation } from "@/lib/ai";

export async function POST() {
  return NextResponse.json(createRecommendation());
}
