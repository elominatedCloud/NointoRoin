export type EasyJobSummary = {
  jobId?: string;
  title: string;
  organization?: string | null;
  workLocation?: string | null;
  summary: string;
  eligibility: string;
  workCondition: string;
  applicationGuide: string[];
  caution: string;
};

export type VoiceMode = "ask" | "recommend";

export type VoiceJobHelperRequest = {
  mode: VoiceMode;
  transcript: string;
  previousWork?: string;
  healthLimit?: string;
  preferredTime?: string;
};

export type VoiceJobHelperResponse = {
  ok: true;
  result: EasyJobSummary;
};

export type JobRecommendation = {
  jobId: string;
  title: string;
  reason: string;
  caution: string;
};

export type RecommendationResponse = {
  recommendations: JobRecommendation[];
};
