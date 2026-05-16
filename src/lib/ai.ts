import type { EasyJobSummary, RecommendationResponse, VoiceMode } from "@/types/ai";
import type { Job } from "@/types/job";

const fallbackGuide = [
  "가까운 주민센터나 기관에 전화합니다.",
  "모집 기간이 남아 있는지 물어봅니다.",
  "신분증을 준비합니다.",
  "방문해서 신청서를 작성합니다.",
];

export function generateEasyExplanation(job: Job): EasyJobSummary {
  return {
    title: job.title || "일자리 안내",
    summary:
      job.description ||
      "기관에서 필요한 일을 돕는 일자리입니다. 자세한 내용은 담당 기관에 확인해야 합니다.",
    eligibility:
      job.eligibility ||
      "나이, 사는 지역, 건강 상태에 따라 신청 가능 여부가 달라집니다. 담당 기관에 확인이 필요합니다.",
    workCondition:
      [job.workTime, job.workLocation, job.pay].filter(Boolean).join(" / ") ||
      "근무 시간과 급여는 공고마다 다릅니다. 전화로 확인하는 것이 좋습니다.",
    applicationGuide: job.applicationMethod
      ? [
          "공고의 연락처나 담당 기관에 전화합니다.",
          job.applicationMethod,
          "신분증과 필요한 서류를 준비합니다.",
          "방문 전에 모집이 끝났는지 확인합니다.",
        ]
      : fallbackGuide,
    caution: "모집 기간과 실제 근무 강도는 바뀔 수 있으니 신청 전에 꼭 확인하세요.",
  };
}

type VoiceAnswerContext = {
  previousWork?: string;
  healthLimit?: string;
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

  if (isRecommend) {
    return {
      title: "내 조건에 맞는 일자리 추천",
      summary: previousWork
        ? `말씀하신 경험을 보면, ${previousWork} 같은 일을 해보셨습니다. 사람을 안내하거나 가볍게 정리하는 일부터 확인해보시면 좋겠습니다.`
        : "해보신 일을 더 알려주시면 더 잘 맞는 일을 찾을 수 있습니다. 우선 안내 도우미나 가벼운 정리 보조 일자리부터 확인해보시면 좋겠습니다.",
      eligibility:
        "나이와 사는 지역에 따라 다릅니다. 주민센터나 시니어클럽에서 현재 모집 중인지 확인해야 합니다.",
      workCondition:
        "공공 일자리는 보통 하루 3시간 정도, 주 2일에서 4일 정도 일하는 경우가 많습니다.",
      applicationGuide: [
        "사는 곳 주민센터에 전화합니다.",
        "노인 일자리 또는 공공 일자리 담당자를 찾습니다.",
        "나이, 사는 동네, 원하는 근무 시간을 말합니다.",
        "신분증을 가지고 방문해 신청서를 작성합니다.",
      ],
      caution: healthLimit
        ? `말씀하신 건강 상태는 ${healthLimit}입니다. 이 부분에 무리가 가지 않는지 꼭 확인하세요. 오래 서 있거나 무거운 물건을 드는 일은 피하는 것이 좋습니다.`
        : "아픈 곳이나 피하고 싶은 일이 있으면 먼저 말해야 합니다. 무거운 물건을 들거나 오래 서 있는 일은 건강 상태를 확인하세요.",
    };
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
