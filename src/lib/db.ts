import { generateEasyExplanation } from "@/lib/ai";
import { mockApplications, mockJobs, mockSummaries } from "@/lib/mockJobs";
import type {
  Application,
  EmployerJobInput,
  EmployerProfile,
  Job,
  JobAISummary,
} from "@/types/job";
import { makeId, nowIso } from "@/lib/utils";

type Store = {
  jobs: Job[];
  summaries: JobAISummary[];
  employerProfiles: EmployerProfile[];
  applications: Application[];
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
    };
  }

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
