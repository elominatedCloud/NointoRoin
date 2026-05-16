import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { ProfileForm } from "@/components/employer/ProfileForm";

export default function EmployerProfilePage() {
  return (
    <EmployerLayout
      title="기업 정보 입력"
      description="공고에 함께 보여줄 기본 정보를 입력합니다."
    >
      <ProfileForm />
    </EmployerLayout>
  );
}
