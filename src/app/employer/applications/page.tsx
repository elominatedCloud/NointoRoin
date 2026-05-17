import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { EmployerApplicationsClient } from "@/components/employer/EmployerApplicationsClient";
import { listEmployerMatchCandidates } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EmployerApplicationsPage() {
  const matches = await listEmployerMatchCandidates();

  return (
    <EmployerLayout
      title="추천 이력서 검토"
      description="적합도, 연락 가능 여부, 면담 때 확인할 점을 한 번에 비교합니다."
    >
      <EmployerApplicationsClient matches={matches} />
    </EmployerLayout>
  );
}
