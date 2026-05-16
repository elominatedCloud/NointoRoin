import type { Job } from "@/types/job";
import { firstText, makeId, nowIso, safeJsonObject } from "@/lib/utils";

export function normalizePublicJob(raw: unknown): Job {
  const row = safeJsonObject(raw);
  const now = nowIso();
  const externalId = firstText(row.jobId, row.wantedAuthNo, row.id) || makeId("external");
  const startDate = firstText(row.frDd, row.frAcptDd, row.startDate);
  const endDate = firstText(row.toDd, row.toAcptDd, row.endDate);
  const title = firstText(row.recrtTitle, row.wantedTitle, row.title, "공공 일자리 공고");
  const organization = firstText(row.oranNm, row.plbizNm, row.organization, row.company);
  const sourceName = firstText(row.stmNm, "한국노인인력개발원 100세누리 구인정보");
  const applicationMethod = firstText(row.acptMthd, row.acptMthdCd, row.applicationMethod, row.clerkContt);

  return {
    id: `public_${externalId.replace(/[^a-zA-Z0-9_-]/g, "_")}`,
    source: "public_api",
    sourceName,
    externalId,
    employerId: null,
    title,
    organization: organization || null,
    region: firstText(row.workPlcNm, row.region, row.plDetAddr) || null,
    workLocation: firstText(row.workPlcNm, row.plDetAddr) || null,
    workTime: formatRecruitPeriod(startDate, endDate),
    pay: firstText(row.pay, row.salary) || null,
    eligibility: firstText(row.ageLim, row.eligibility, row.age) || null,
    description:
      firstText(row.detCnts, row.description) ||
      `${title} 공고입니다. 접수 상태는 ${firstText(row.deadline, "확인 필요")}입니다.`,
    applicationMethod: applicationMethod || "담당 기관에 문의",
    requiredDocuments: firstText(row.requiredDocuments) || null,
    startDate: startDate || null,
    endDate: endDate || null,
    rawData: row,
    status: "active",
    createdAt: now,
    updatedAt: now,
  };
}

function formatRecruitPeriod(startDate: string, endDate: string) {
  if (!startDate && !endDate) {
    return null;
  }

  return `접수 ${formatCompactDate(startDate)}부터 ${formatCompactDate(endDate)}까지`;
}

function formatCompactDate(value: string) {
  const compact = value.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (!compact) {
    return value || "확인 필요";
  }

  return `${compact[1]}.${compact[2]}.${compact[3]}`;
}
