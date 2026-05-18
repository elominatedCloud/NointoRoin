import type { EasyJobSummary, JobRecommendation, RecommendationResponse, VoiceMode } from "@/types/ai";
import type { Job } from "@/types/job";

const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_GEMINI_MODEL = "gemini-2.0-flash";

type VoiceAnswerInput = {
  mode: VoiceMode;
  transcript: string;
  previousWork?: string;
  healthLimit?: string;
  preferredTime?: string;
  candidateJobs?: Job[];
  fallback: EasyJobSummary;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

const easySummarySchema = {
  type: "OBJECT",
  properties: {
    jobId: { type: "STRING" },
    title: { type: "STRING" },
    organization: { type: "STRING" },
    workLocation: { type: "STRING" },
    contactPhone: { type: "STRING" },
    summary: { type: "STRING" },
    eligibility: { type: "STRING" },
    workCondition: { type: "STRING" },
    applicationGuide: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
    caution: { type: "STRING" },
  },
  required: ["title", "summary", "eligibility", "workCondition", "applicationGuide", "caution"],
};

const recommendationSchema = {
  type: "OBJECT",
  properties: {
    recommendations: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          jobId: { type: "STRING" },
          title: { type: "STRING" },
          reason: { type: "STRING" },
          caution: { type: "STRING" },
        },
        required: ["jobId", "title", "reason", "caution"],
      },
    },
  },
  required: ["recommendations"],
};

export async function generateEasyExplanationWithGemini(job: Job, fallback: EasyJobSummary) {
  const prompt = [
    "너는 한국의 65세 이상 구직자를 돕는 일자리 안내 도우미다.",
    "아래 공고를 읽고 어르신이 바로 이해할 수 있는 쉬운 한국어로 설명하라.",
    "신청 가능 여부를 단정하지 말고, 이 공고에 적힌 조건 기준으로 확인해야 할 점을 말하라.",
    "전화번호는 공고에 있는 경우에만 쓰고, 없는 정보는 만들지 말라.",
    "반드시 JSON만 반환하라.",
    "",
    "공고:",
    JSON.stringify(toGeminiJob(job), null, 2),
    "",
    "기본 답변:",
    JSON.stringify(fallback, null, 2),
  ].join("\n");

  const generated = await generateStructuredJson<EasyJobSummary>(prompt, easySummarySchema);
  return generated ? normalizeEasySummary(generated, fallback, { jobId: job.id }) : null;
}

export async function generateVoiceAnswerWithGemini(input: VoiceAnswerInput) {
  const prompt = [
    "너는 한국의 중장년·고령층 구직자를 돕는 일자리 상담 도우미다.",
    "사용자가 말하거나 선택한 내용을 바탕으로 쉬운 한국어 답변을 만든다.",
    "현재 공고나 후보 공고에 기반해 안내하고, 신청 가능 여부를 단정하지 않는다.",
    "아픈 곳이나 피해야 할 일이 있으면 주의사항에 반영한다.",
    "전화번호는 공고에 있는 경우에만 쓰고, 없는 정보는 만들지 말라.",
    "반드시 JSON만 반환하라.",
    "",
    "상담 정보:",
    JSON.stringify(
      {
        mode: input.mode,
        transcript: input.transcript,
        previousWork: input.previousWork,
        healthLimit: input.healthLimit,
        preferredTime: input.preferredTime,
      },
      null,
      2,
    ),
    "",
    "후보 공고:",
    JSON.stringify((input.candidateJobs ?? []).slice(0, 6).map(toGeminiJob), null, 2),
    "",
    "기본 답변:",
    JSON.stringify(input.fallback, null, 2),
  ].join("\n");

  const generated = await generateStructuredJson<EasyJobSummary>(prompt, easySummarySchema);
  return generated ? normalizeEasySummary(generated, input.fallback) : null;
}

export async function generateRecommendationsWithGemini(jobs: Job[], fallback: RecommendationResponse) {
  const prompt = [
    "너는 한국의 중장년·고령층 일자리 추천 도우미다.",
    "아래 공고 목록에서 어르신에게 비교적 이해하기 쉽고 부담이 낮은 공고를 최대 3개 추천하라.",
    "추천 사유와 조심할 점은 짧고 쉬운 한국어로 쓴다.",
    "반드시 JSON만 반환하라.",
    "",
    "공고 목록:",
    JSON.stringify(jobs.slice(0, 8).map(toGeminiJob), null, 2),
    "",
    "기본 추천:",
    JSON.stringify(fallback, null, 2),
  ].join("\n");

  const generated = await generateStructuredJson<RecommendationResponse>(prompt, recommendationSchema);
  if (!generated?.recommendations?.length) {
    return null;
  }

  return {
    recommendations: generated.recommendations
      .map((recommendation) => normalizeRecommendation(recommendation))
      .filter((recommendation): recommendation is JobRecommendation => Boolean(recommendation))
      .slice(0, 3),
  };
}

async function generateStructuredJson<T>(prompt: string, responseSchema: Record<string, unknown>) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  const model = (process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL).trim();
  const modelPath = model.startsWith("models/") ? model : `models/${model}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(
      `${GEMINI_API_BASE_URL}/${modelPath}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            response_mime_type: "application/json",
            response_schema: responseSchema,
            temperature: 0.2,
            maxOutputTokens: 1200,
          },
        }),
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      console.error("Gemini request failed", response.status, await response.text());
      return null;
    }

    const payload = (await response.json()) as GeminiResponse;
    const text =
      payload.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? "")
        .join("")
        .trim() ?? "";

    return parseJson<T>(text);
  } catch (error) {
    console.error("Gemini request error", error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeEasySummary(
  value: Partial<EasyJobSummary>,
  fallback: EasyJobSummary,
  overrides: Partial<EasyJobSummary> = {},
): EasyJobSummary {
  return {
    jobId: stringOrFallback(overrides.jobId ?? value.jobId, fallback.jobId) ?? undefined,
    title: stringOrFallback(overrides.title ?? value.title, fallback.title) ?? fallback.title,
    organization: stringOrFallback(overrides.organization ?? value.organization, fallback.organization),
    workLocation: stringOrFallback(overrides.workLocation ?? value.workLocation, fallback.workLocation),
    contactPhone: stringOrFallback(overrides.contactPhone ?? value.contactPhone, fallback.contactPhone),
    summary: stringOrFallback(value.summary, fallback.summary) ?? fallback.summary,
    eligibility: stringOrFallback(value.eligibility, fallback.eligibility) ?? fallback.eligibility,
    workCondition: stringOrFallback(value.workCondition, fallback.workCondition) ?? fallback.workCondition,
    applicationGuide:
      Array.isArray(value.applicationGuide) && value.applicationGuide.length > 0
        ? value.applicationGuide.map((step) => String(step).trim()).filter(Boolean).slice(0, 5)
        : fallback.applicationGuide,
    caution: stringOrFallback(value.caution, fallback.caution) ?? fallback.caution,
  };
}

function normalizeRecommendation(value: Partial<JobRecommendation>) {
  const jobId = stringOrFallback(value.jobId, "");
  const title = stringOrFallback(value.title, "");
  const reason = stringOrFallback(value.reason, "");
  const caution = stringOrFallback(value.caution, "");

  if (!jobId || !title || !reason || !caution) {
    return null;
  }

  return {
    jobId,
    title,
    reason,
    caution,
  };
}

function stringOrFallback(value: unknown, fallback: string | null | undefined) {
  const text = typeof value === "string" ? value.trim() : "";
  return text || fallback || null;
}

function parseJson<T>(text: string) {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!match) {
      return null;
    }

    try {
      return JSON.parse(match[0]) as T;
    } catch {
      return null;
    }
  }
}

function toGeminiJob(job: Job) {
  return {
    id: job.id,
    title: job.title,
    organization: job.organization,
    region: job.region,
    workLocation: job.workLocation,
    workTime: job.workTime,
    pay: job.pay,
    eligibility: job.eligibility,
    description: job.description,
    applicationMethod: job.applicationMethod,
    requiredDocuments: job.requiredDocuments,
    startDate: job.startDate,
    endDate: job.endDate,
    status: job.status,
    source: job.source,
  };
}
