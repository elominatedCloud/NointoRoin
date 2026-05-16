import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { JobList } from "@/components/employer/JobList";

export default function EmployerJobsPage() {
  return (
    <EmployerLayout
      title="내가 올린 공고"
      description="등록한 공고의 모집 상태와 AI 쉬운 설명 생성 여부를 확인합니다."
    >
      <JobList />
    </EmployerLayout>
  );
}
