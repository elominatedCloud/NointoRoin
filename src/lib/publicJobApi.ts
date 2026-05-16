import { XMLParser } from "fast-xml-parser";
import { normalizePublicJob } from "@/lib/jobNormalizer";
import { mockJobs } from "@/lib/mockJobs";
import type { Job } from "@/types/job";
import { isRecord } from "@/lib/utils";

const parser = new XMLParser({
  ignoreAttributes: false,
  trimValues: true,
});

type FetchPublicJobsResult = {
  jobs: Job[];
  fetched: number;
  source: "public_api" | "mock";
  error?: string;
};

export async function fetchPublicJobs(): Promise<FetchPublicJobsResult> {
  const key = getPublicJobApiKey();
  const baseUrl =
    process.env.PUBLIC_JOB_API_BASE_URL || "https://apis.data.go.kr/B552474/SenuriService";

  if (!key) {
    return mockResult("PUBLIC_JOB_API_KEY가 없어 mock 데이터를 사용했습니다.");
  }

  try {
    const url = new URL(`${baseUrl.replace(/\/$/, "")}/getJobList`);
    url.searchParams.set("serviceKey", key);
    url.searchParams.set("pageNo", "1");
    url.searchParams.set("numOfRows", "50");

    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/xml,text/xml,*/*",
      },
    });
    const text = await response.text();

    if (!response.ok || !text.trim().startsWith("<")) {
      return mockResult(text.trim() || `공공 API HTTP ${response.status}`);
    }

    const xml = parser.parse(text);
    const rows = extractItems(xml);
    const jobs = rows.map(normalizePublicJob);

    return {
      jobs,
      fetched: rows.length,
      source: "public_api",
    };
  } catch (error) {
    return mockResult(error instanceof Error ? error.message : "공공 API 호출 실패");
  }
}

function getPublicJobApiKey() {
  const rawKey = process.env.PUBLIC_JOB_API_KEY?.trim();
  if (!rawKey) {
    return "";
  }

  try {
    return decodeURIComponent(rawKey);
  } catch {
    return rawKey;
  }
}

function extractItems(xml: unknown) {
  const root = isRecord(xml) ? xml : {};
  const response = getRecord(root.response ?? root.OpenAPI_ServiceResponse ?? root);
  const body = getRecord(response.body);
  const items = getRecord(body.items).item ?? body.item;

  if (!items) {
    return [];
  }

  return Array.isArray(items) ? items : [items];
}

function getRecord(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

function mockResult(error: string): FetchPublicJobsResult {
  return {
    jobs: mockJobs,
    fetched: mockJobs.length,
    source: "mock",
    error,
  };
}
