import type { EasyJobSummary } from "./ai";

export type JobSource = "public_api" | "employer" | "mock";
export type JobStatus = "active" | "closed" | "draft";

export type Job = {
  id: string;
  source: JobSource;
  sourceName: string | null;
  externalId: string | null;
  employerId: string | null;
  title: string;
  organization: string | null;
  region: string | null;
  workLocation: string | null;
  workTime: string | null;
  pay: string | null;
  eligibility: string | null;
  description: string | null;
  applicationMethod: string | null;
  requiredDocuments: string | null;
  startDate: string | null;
  endDate: string | null;
  rawData: Record<string, unknown> | null;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
};

export type JobAISummary = EasyJobSummary & {
  id: string;
  jobId: string;
  createdAt: string;
  updatedAt: string;
};

export type EmployerProfile = {
  id: string;
  userId: string;
  companyName: string;
  ownerName: string | null;
  phone: string;
  address: string;
  industry: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type EmployerJobInput = {
  title: string;
  description: string;
  workLocation: string;
  workTime: string;
  pay: string;
  eligibility: string;
  preferredConditions: string;
  applicationMethod: string;
  phone: string;
};

export type Application = {
  id: string;
  jobId: string;
  userId: string;
  applicantName: string | null;
  phone: string | null;
  resumeSummary: string | null;
  status: "submitted" | "reviewed" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
};

export type JobAlertCandidate = {
  id: string;
  userId: string;
  jobId: string;
  reason: string;
  status: "pending" | "shown" | "dismissed";
  createdAt: string;
  updatedAt: string;
};

export type SyncStats = {
  ok: true;
  fetched: number;
  inserted: number;
  updated: number;
  skipped: number;
};
