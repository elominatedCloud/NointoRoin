import type { EasyJobSummary, RecommendationResponse, VoiceMode } from "@/types/ai";
import type { Job } from "@/types/job";
import {
  generateEasyExplanationWithGemini,
  generateRecommendationsWithGemini,
  generateVoiceAnswerWithGemini,
} from "@/lib/gemini";

const fallbackGuide = [
  "가까운 주민센터나 기관에 전화합니다.",
  "모집 기간이 남아 있는지 물어봅니다.",
  "신분증을 준비합니다.",
  "방문해서 신청서를 작성합니다.",
];

export function generateEasyExplanation(job: Job): EasyJobSummary {
  const contactPhone = extractPhone(job.applicationMethod);
  const applicationGuide = buildApplicationGuide(job, contactPhone);

  return {
    jobId: job.id,
    title: job.title || "일자리 안내",
    organization: job.organization,
    workLocation: job.workLocation,
    contactPhone,
    summary:
      job.description ||
      "기관에서 필요한 일을 돕는 일자리입니다. 자세한 내용은 담당 기관에 확인해야 합니다.",
    eligibility:
      job.eligibility ||
      "나이, 사는 지역, 건강 상태에 따라 신청 가능 여부가 달라집니다. 담당 기관에 확인이 필요합니다.",
    workCondition:
      [job.workTime, job.workLocation, job.pay].filter(Boolean).join(" / ") ||
      "근무 시간과 급여는 공고마다 다릅니다. 전화로 확인하는 것이 좋습니다.",
    applicationGuide,
    caution: "모집 기간과 실제 근무 강도는 바뀔 수 있으니 신청 전에 꼭 확인하세요.",
  };
}

export async function generateEasyExplanationWithAi(job: Job): Promise<EasyJobSummary> {
  const fallback = generateEasyExplanation(job);
  return (await generateEasyExplanationWithGemini(job, fallback)) ?? fallback;
}

type VoiceAnswerContext = {
  previousWork?: string;
  healthLimit?: string;
  preferredTime?: string;
  candidateJobs?: Job[];
};

export function createVoiceAnswer(
  mode: VoiceMode,
  transcript: string,
  context: VoiceAnswerContext = {},
): EasyJobSummary {
  const isRecommend = mode === "recommend";
  const normalized = transcript.trim();
  const previousWork = context.previousWork?.trim();
  const healthLimit = context.healthLimit?.trim();
  const preferredTime = context.preferredTime?.trim();

  if (isRecommend) {
    const job = pickRecommendedJob(context.candidateJobs ?? [], {
      previousWork,
      healthLimit,
      preferredTime,
    });

    if (job) {
      return createJobSpecificRecommendation(job, {
        previousWork,
        healthLimit,
        preferredTime,
      });
    }

    return createFallbackRecommendation({
      previousWork,
      healthLimit,
      preferredTime,
    });
  }

  return {
    title: "신청 가능한 일자리 안내",
    summary: normalized
      ? `"${normalized}"라고 물어보셨습니다. 가까운 주민센터나 시니어클럽에서 신청 가능한 공공 일자리가 있을 수 있습니다.`
      : "가까운 주민센터나 시니어클럽에서 신청 가능한 공공 일자리가 있을 수 있습니다.",
    eligibility: "정확한 조건은 나이, 사는 지역, 소득 기준에 따라 다릅니다.",
    workCondition: "보통 하루 3시간 정도 일하는 일자리가 많고, 기관마다 시간은 다릅니다.",
    applicationGuide: [
      "사는 지역의 주민센터에 전화합니다.",
      "노인 일자리 신청 기간을 물어봅니다.",
      "신분증을 가지고 방문합니다.",
      "원하는 근무 시간과 건강 상태를 담당자에게 말합니다.",
    ],
    caution: "지역마다 모집 기간이 다르므로 방문 전에 전화로 확인하는 것이 좋습니다.",
  };
}

export async function createVoiceAnswerWithAi(
  mode: VoiceMode,
  transcript: string,
  context: VoiceAnswerContext = {},
): Promise<EasyJobSummary> {
  const fallback = createVoiceAnswer(mode, transcript, context);
  return (
    (await generateVoiceAnswerWithGemini({
      mode,
      transcript,
      previousWork: context.previousWork,
      healthLimit: context.healthLimit,
      preferredTime: context.preferredTime,
      candidateJobs: context.candidateJobs,
      fallback,
    })) ?? fallback
  );
}

function createJobSpecificRecommendation(
  job: Job,
  context: Omit<VoiceAnswerContext, "candidateJobs">,
): EasyJobSummary {
  const base = generateEasyExplanation(job);
  const workFacts = [job.workTime, job.workLocation, job.pay].filter(Boolean).join(", ");
  const organizationText = job.organization ? `${job.organization}의 ` : "";
  const healthLimit = context.healthLimit?.trim();
  const preferredTime = context.preferredTime?.trim();
  const summary = cleanText(base.summary);
  const eligibility = cleanText(job.eligibility);

  return {
    ...base,
    jobId: job.id,
    organization: job.organization,
    workLocation: job.workLocation,
    contactPhone: extractPhone(job.applicationMethod),
    title: job.title,
    summary: `현재 추천 공고는 ${organizationText}${job.title}입니다. ${summary}`,
    eligibility: eligibility
      ? `이 공고 기준으로는 ${eligibility}이면 신청 가능성이 있습니다. 다만 실제 가능 여부는 담당 기관에 확인해야 합니다.`
      : "이 공고의 신청 조건은 원문에 자세히 적혀 있지 않습니다. 담당 기관에 나이, 사는 지역, 건강 상태를 말하고 확인해야 합니다.",
    workCondition: workFacts
      ? `이 공고의 근무 조건은 ${workFacts}입니다.${preferredTime ? ` 원하신 ${preferredTime}과 맞는지 전화로 확인하세요.` : ""}`
      : base.workCondition,
    applicationGuide: buildApplicationGuide(job, base.contactPhone),
    caution: buildJobCaution(job, healthLimit),
  };
}

function createFallbackRecommendation(
  context: Omit<VoiceAnswerContext, "candidateJobs">,
): EasyJobSummary {
  const previousWork = context.previousWork?.trim();
  const healthLimit = context.healthLimit?.trim();
  const preferredTime = context.preferredTime?.trim();

  return {
    title: "내 조건에 맞는 일자리 추천",
    summary: previousWork
      ? `말씀하신 경험을 보면, ${previousWork} 같은 일을 해보셨습니다. 사람을 안내하거나 가볍게 정리하는 일부터 확인해보시면 좋겠습니다.`
      : "해보신 일을 더 알려주시면 더 잘 맞는 일을 찾을 수 있습니다. 우선 안내 도우미나 가벼운 정리 보조 일자리부터 확인해보시면 좋겠습니다.",
    eligibility:
      "나이와 사는 지역에 따라 다릅니다. 주민센터나 시니어클럽에서 현재 모집 중인지 확인해야 합니다.",
    workCondition: preferredTime
      ? `${preferredTime}에 맞는 짧은 근무부터 확인해보시면 좋겠습니다. 공공 일자리는 보통 하루 3시간 정도, 주 2일에서 4일 정도 일하는 경우가 많습니다.`
      : "공공 일자리는 보통 하루 3시간 정도, 주 2일에서 4일 정도 일하는 경우가 많습니다.",
    applicationGuide: [
      "사는 곳 주민센터에 전화합니다.",
      "노인 일자리 또는 공공 일자리 담당자를 찾습니다.",
      "나이, 사는 동네, 해보신 일, 조심해야 할 몸 상태를 말합니다.",
      "신분증을 가지고 방문해 신청서를 작성합니다.",
    ],
    caution: healthLimit
      ? `말씀하신 건강 상태는 ${healthLimit}입니다. 이 부분에 무리가 가지 않는지 꼭 확인하세요. 오래 서 있거나 무거운 물건을 드는 일은 피하는 것이 좋습니다.`
      : "아픈 곳이나 피하고 싶은 일이 있으면 먼저 말해야 합니다. 무거운 물건을 들거나 오래 서 있는 일은 건강 상태를 확인하세요.",
  };
}

function pickRecommendedJob(
  jobs: Job[],
  context: Omit<VoiceAnswerContext, "candidateJobs">,
) {
  const activeJobs = jobs.filter((job) => job.status === "active");

  if (activeJobs.length === 0) {
    return null;
  }

  return activeJobs
    .map((job) => ({
      job,
      score: scoreJob(job, context),
    }))
    .sort((a, b) => b.score - a.score)[0]?.job ?? activeJobs[0];
}

function scoreJob(job: Job, context: Omit<VoiceAnswerContext, "candidateJobs">) {
  const previousWork = context.previousWork ?? "";
  const healthLimit = context.healthLimit ?? "";
  const preferredTime = context.preferredTime ?? "";
  const searchable = [
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
  let score = 0;

  if (matchesAny(previousWork, ["사람", "안내", "손님", "응대"]) && matchesAny(searchable, ["안내", "복지관", "손님"])) {
    score += 6;
  }

  if (matchesAny(previousWork, ["정리", "청소", "물건", "몸"]) && matchesAny(searchable, ["정리", "환경", "공원", "진열", "물건"])) {
    score += 4;
  }

  if (matchesAny(preferredTime, ["오전"]) && matchesAny(searchable, ["오전"])) {
    score += 3;
  }

  if (matchesAny(preferredTime, ["오후"]) && matchesAny(searchable, ["오후"])) {
    score += 3;
  }

  if (matchesAny(healthLimit, ["허리", "무릎", "무거운", "어깨", "불편"])) {
    if (matchesAny(searchable, ["안내", "복지관"])) {
      score += 3;
    }

    if (matchesAny(searchable, ["진열", "물건", "공원", "환경", "야외"])) {
      score -= 5;
    }
  }

  return score;
}

function buildJobCaution(job: Job, healthLimit?: string) {
  const jobText = [job.title, job.description, job.workLocation].filter(Boolean).join(" ");
  const cautions = ["모집 기간과 실제 근무 강도는 바뀔 수 있으니 신청 전에 꼭 확인하세요."];

  if (healthLimit && healthLimit !== "특별히 아픈 곳 없음") {
    cautions.unshift(
      `말씀하신 건강 상태는 ${healthLimit}입니다. 이 공고를 신청하기 전에 몸에 무리가 없는지 담당자에게 꼭 물어보세요.`,
    );
  }

  if (matchesAny(jobText, ["진열", "물건", "정리", "공원", "환경", "야외"])) {
    cautions.unshift("서 있거나 움직이는 시간이 있을 수 있습니다.");
  }

  return cautions.join(" ");
}

function matchesAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

function cleanText(value: string | null | undefined) {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function buildApplicationGuide(job: Job, contactPhone?: string | null) {
  const method = cleanText(job.applicationMethod);
  const docs = cleanText(job.requiredDocuments);
  const organization = job.organization || job.sourceName || "담당 기관";
  const guide = [
    contactPhone
      ? `${organization}에 전화합니다.`
      : `${organization}의 신청 방법과 접수 장소를 확인합니다.`,
  ];

  if (method) {
    guide.push(`공고에 적힌 신청 방법은 ${method}입니다.`);
  }

  guide.push(docs ? `${docs}을 준비합니다.` : "신분증과 필요한 서류가 있는지 확인합니다.");
  guide.push("모집이 끝났는지 확인한 뒤 신청합니다.");

  return guide.length > 0 ? guide : fallbackGuide;
}

function extractPhone(value: string | null | undefined) {
  const text = value ?? "";
  const match = text.match(/0\d{1,2}[-.\s]?\d{3,4}[-.\s]?\d{4}/);
  return match?.[0].replace(/[.\s]/g, "-") ?? null;
}

export function createRecommendation(): RecommendationResponse {
  return {
    recommendations: [
      {
        jobId: "job_001",
        title: "복지관 안내 도우미",
        reason: "오전 근무이고 사람을 안내하는 일이어서 부담이 비교적 적습니다.",
        caution: "서 있는 시간이 있을 수 있어 의자에 앉을 수 있는지 확인하세요.",
      },
      {
        jobId: "job_003",
        title: "동네 마트 진열 보조",
        reason: "집 근처 짧은 시간 근무를 원하는 분에게 맞을 수 있습니다.",
        caution: "물건을 옮기는 일이 있으니 무게를 먼저 물어보세요.",
      },
    ],
  };
}

export async function createRecommendationWithAi(jobs: Job[] = []): Promise<RecommendationResponse> {
  const fallback = createRecommendation();
  return (await generateRecommendationsWithGemini(jobs, fallback)) ?? fallback;
}
