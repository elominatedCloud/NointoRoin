import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { JobForm } from "@/components/employer/JobForm";

export default function NewEmployerJobPage() {
  return (
    <EmployerLayout
      title="공고 등록"
      description="입력한 내용을 바탕으로 시니어가 이해하기 쉬운 설명을 함께 생성합니다."
    >
      <JobForm />
    </EmployerLayout>
  );
}
