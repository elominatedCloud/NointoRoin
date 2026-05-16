import { generateEasyExplanation } from "@/lib/ai";
import { mockApplications, mockJobs, mockSeniorProfiles, mockSummaries } from "@/lib/mockJobs";
import type {
  Application,
  EmployerJobInput,
  EmployerProfile,
  Job,
  JobAISummary,
  MatchCandidate,
} from "@/types/job";
import type { DemoSeniorProfile } from "@/types/user";
import { makeId, nowIso } from "@/lib/utils";

type Store = {
  jobs: Job[];
  summaries: JobAISummary[];
  employerProfiles: EmployerProfile[];
  applications: Application[];
  seniorProfiles: DemoSeniorProfile[];
};

type StoreGlobal = typeof globalThis & {
  __seniorJobHelperStore?: Store;
};

const globalStore = globalThis as StoreGlobal;

function getStore() {
  if (!globalStore.__seniorJobHelperStore) {
    globalStore.__seniorJobHelperStore = {
      jobs: [...mockJobs],
      summaries: [...mockSummaries],
      employerProfiles: [],
      applications: [...mockApplications],
      seniorProfiles: [...mockSeniorProfiles],
    };
  }

  globalStore.__seniorJobHelperStore.seniorProfiles ??= [...mockSeniorProfiles];
  globalStore.__seniorJobHelperStore.applications ??= [...mockApplications];
  globalStore.__seniorJobHelperStore.employerProfiles ??= [];
  globalStore.__seniorJobHelperStore.summaries ??= [...mockSummaries];
  globalStore.__seniorJobHelperStore.jobs ??= [...mockJobs];

  return globalStore.__seniorJobHelperStore;
}

export function isMockDbMode() {
  return !process.env.DATABASE_URL;
}

export async function listJobs() {
  return getStore().jobs.filter((job) => job.status !== "draft");
}

export async function getJobById(id: string) {
  return getStore().jobs.find((job) => job.id === id || job.externalId === id) ?? null;
}

export async function getSummaryByJobId(jobId: string) {
  return getStore().summaries.find((summary) => summary.jobId === jobId) ?? null;
}

export async function ensureSummary(job: Job) {
  const existing = await getSummaryByJobId(job.id);
  if (existing) {
    return existing;
  }

  const generated = generateEasyExplanation(job);
  const now = nowIso();
  const summary: JobAISummary = {
    id: makeId("summary"),
    jobId: job.id,
    ...generated,
    createdAt: now,
    updatedAt: now,
  };

  getStore().summaries.unshift(summary);
  return summary;
}

export async function listApplications() {
  return getStore().applications;
}

export async function listSeniorProfiles() {
  return getStore().seniorProfiles;
}

export async function saveSeniorProfile(
  input: Omit<DemoSeniorProfile, "id" | "userId" | "createdAt" | "updatedAt">,
) {
  const store = getStore();
  const now = nowIso();
  const existingIndex = store.seniorProfiles.findIndex((profile) => profile.name === input.name);
  const previous = existingIndex >= 0 ? store.seniorProfiles[existingIndex] : null;
  const profile: DemoSeniorProfile = {
    ...input,
    id: previous?.id ?? makeId("senior"),
    userId: previous?.userId ?? makeId("user"),
    createdAt: previous?.createdAt ?? now,
    updatedAt: now,
  };

  if (existingIndex >= 0) {
    store.seniorProfiles[existingIndex] = profile;
  } else {
    store.seniorProfiles.unshift(profile);
  }

  return profile;
}

export async function saveEmployerProfile(input: Omit<EmployerProfile, "id" | "userId" | "createdAt" | "updatedAt">) {
  const store = getStore();
  const now = nowIso();
  const profile: EmployerProfile = {
    ...input,
    id: store.employerProfiles[0]?.id ?? makeId("employer"),
    userId: "local_employer",
    createdAt: store.employerProfiles[0]?.createdAt ?? now,
    updatedAt: now,
  };

  store.employerProfiles = [profile];
  return profile;
}

export async function getEmployerProfile() {
  return getStore().employerProfiles[0] ?? null;
}

export async function createEmployerJob(input: EmployerJobInput) {
  const now = nowIso();
  const job: Job = {
    id: makeId("job"),
    source: "employer",
    sourceName: "기업 등록 공고",
    externalId: null,
    employerId: "local_employer",
    title: input.title,
    organization: null,
    region: null,
    workLocation: input.workLocation,
    workTime: input.workTime,
    pay: input.pay,
    eligibility: input.eligibility,
    description: `${input.description}\n\n우대 조건: ${input.preferredConditions || "없음"}`,
    applicationMethod: `${input.applicationMethod}\n연락처: ${input.phone}`,
    requiredDocuments: null,
    startDate: null,
    endDate: null,
    rawData: { input },
    status: "active",
    createdAt: now,
    updatedAt: now,
  };

  getStore().jobs.unshift(job);
  await ensureSummary(job);
  return job;
}

export async function listEmployerJobs() {
  return getStore().jobs.filter((job) => job.source === "employer");
}

export async function listEmployerMatchCandidates(): Promise<MatchCandidate[]> {
  const store = getStore();
  const targetJobs =
    store.jobs.filter((job) => job.source === "employer" && job.status === "active").slice(0, 4);
  const demoJobs = targetJobs.length > 0 ? targetJobs : store.jobs.filter((job) => job.status === "active").slice(0, 3);
  const candidates = store.seniorProfiles.filter((profile) => profile.consentToEmployerMatching);
  const matchedAt = nowIso();

  return demoJobs
    .flatMap((job) =>
      candidates.map((profile) => {
        const score = scoreProfileForJob(profile, job);
        return {
          id: `${job.id}_${profile.id}`,
          jobId: job.id,
          jobTitle: job.title,
          seekerId: profile.id,
          seekerName: profile.name,
          phone: profile.phone,
          score,
          fitSummary: buildFitSummary(profile, job, score),
          caution: buildMatchCaution(profile, job),
          profileSummary: `${profile.ageRange} · ${profile.region} · ${profile.previousWork} · ${profile.preferredTime}`,
          matchedAt,
        };
      }),
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

export async function upsertPublicJobs(incoming: Job[]) {
  const store = getStore();
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const nextJob of incoming) {
    const index = store.jobs.findIndex(
      (job) =>
        Boolean(nextJob.externalId) &&
        job.externalId === nextJob.externalId &&
        job.source === nextJob.source,
    );

    if (index === -1) {
      store.jobs.push(nextJob);
      inserted += 1;
      await ensureSummary(nextJob);
      continue;
    }

    const previous = store.jobs[index];
    const changed =
      previous.title !== nextJob.title ||
      previous.description !== nextJob.description ||
      previous.applicationMethod !== nextJob.applicationMethod ||
      previous.status !== nextJob.status;

    if (changed) {
      store.jobs[index] = {
        ...previous,
        ...nextJob,
        id: previous.id,
        createdAt: previous.createdAt,
        updatedAt: nowIso(),
      };
      updated += 1;
      await ensureSummary(store.jobs[index]);
    } else {
      skipped += 1;
    }
  }

  return { inserted, updated, skipped };
}

function scoreProfileForJob(profile: DemoSeniorProfile, job: Job) {
  const jobText = [
    job.title,
    job.organization,
    job.region,
    job.workLocation,
    job.workTime,
    job.eligibility,
    job.description,
  ]
    .filter(Boolean)
    .join(" ");
  let score = 52;

  if (profile.region && jobText.includes(profile.region.split(" ")[0])) {
    score += 10;
  }

  if (matchesAny(profile.previousWork, ["사람", "안내", "손님", "응대"]) && matchesAny(jobText, ["안내", "복지관", "손님", "방문객"])) {
    score += 22;
  }

  if (matchesAny(profile.previousWork, ["청소", "정리", "물건"]) && matchesAny(jobText, ["청소", "정리", "진열", "공원", "환경", "물건"])) {
    score += 18;
  }

  if (matchesAny(profile.preferredTime, ["오전"]) && matchesAny(jobText, ["오전"])) {
    score += 10;
  }

  if (matchesAny(profile.preferredTime, ["오후"]) && matchesAny(jobText, ["오후"])) {
    score += 10;
  }

  if (profile.healthLimit !== "특별히 아픈 곳 없음") {
    if (matchesAny(jobText, ["진열", "물건", "공원", "환경", "야외", "무거운"])) {
      score -= 18;
    }

    if (matchesAny(jobText, ["안내", "복지관", "방문객"])) {
      score += 8;
    }
  }

  return Math.max(35, Math.min(98, score));
}

function buildFitSummary(profile: DemoSeniorProfile, job: Job, score: number) {
  const strengths = [];
  const jobText = [job.title, job.description].filter(Boolean).join(" ");

  if (matchesAny(profile.previousWork, ["사람", "안내", "손님"]) && matchesAny(jobText, ["안내", "방문객", "복지관"])) {
    strengths.push("응대 경험이 공고 업무와 잘 맞습니다");
  }

  if (matchesAny(profile.previousWork, ["정리", "청소", "물건"]) && matchesAny(jobText, ["정리", "진열", "환경"])) {
    strengths.push("정리 업무 경험이 있습니다");
  }

  if (profile.preferredTime && job.workTime?.includes(profile.preferredTime.slice(0, 2))) {
    strengths.push("희망 근무 시간과 가깝습니다");
  }

  if (strengths.length === 0) {
    strengths.push("기본 조건이 공고와 일부 맞습니다");
  }

  return `${score}점 · ${strengths.join(", ")}`;
}

function buildMatchCaution(profile: DemoSeniorProfile, job: Job) {
  const jobText = [job.title, job.description, job.workLocation].filter(Boolean).join(" ");

  if (profile.healthLimit !== "특별히 아픈 곳 없음" && matchesAny(jobText, ["진열", "물건", "공원", "환경", "야외"])) {
    return "근무 강도와 서 있는 시간을 면담 때 확인하세요.";
  }

  if (!profile.phone) {
    return "연락처 공개 동의가 없어 앱 내 연락 흐름이 필요합니다.";
  }

  return "짧은 면담으로 근무 가능 요일을 확인하세요.";
}

function matchesAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}
