export type UserRole = "job_seeker" | "employer" | "admin";

export type User = {
  id: string;
  role: UserRole;
  name: string | null;
  phone: string | null;
  ageRange: string | null;
  region: string | null;
  createdAt: string;
  updatedAt: string;
};

export type JobSeekerProfile = {
  id: string;
  userId: string;
  age: number | null;
  region: string | null;
  previousWork: string | null;
  preferredTime: string | null;
  healthLimit: string | null;
  preferredJobType: string | null;
  createdAt: string;
  updatedAt: string;
};
