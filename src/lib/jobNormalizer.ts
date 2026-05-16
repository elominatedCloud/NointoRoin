import type { Job } from "@/types/job";
import { firstText, makeId, nowIso, safeJsonObject } from "@/lib/utils";

export function normalizePublicJob(raw: unknown): Job {
  const row = safeJsonObject(raw);
  const now = nowIso();
  const externalId = firstText(row.jobId, row.wantedAuthNo, row.id) || makeId("external");
  const startDate = firstText(row.frAcptDd, row.startDate);
  const endDate = firstText(row.toAcptDd, row.endDate);

  return {
    id: `public_${externalId.replace(/[^a-zA-Z0-9_-]/g, "_")}`,
    source: "public_api",
    sourceName: "한국노인인력개발원 100세누리 구인정보",
    externalId,
    employerId: null,
    title: firstText(row.wantedTitle, row.title, "공공 일자리 공고"),
    organization: firstText(row.plbizNm, row.organization, row.company) || null,
    region: firstText(row.workPlcNm, row.region, row.plDetAddr) || null,
    workLocation: firstText(row.workPlcNm, row.plDetAddr) || null,
    workTime: firstText(row.workTime, row.workTm) || null,
    pay: firstText(row.pay, row.salary) || null,
    eligibility: firstText(row.ageLim, row.eligibility, row.age) || null,
    description: firstText(row.detCnts, row.description, row.wantedTitle) || null,
    applicationMethod: firstText(row.acptMthdCd, row.applicationMethod, row.clerkContt) || null,
    requiredDocuments: firstText(row.requiredDocuments) || null,
    startDate: startDate || null,
    endDate: endDate || null,
    rawData: row,
    status: "active",
    createdAt: now,
    updatedAt: now,
  };
}
