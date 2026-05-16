import Link from "next/link";
import { SeniorLayout } from "@/components/senior/SeniorLayout";
import { listSeniorProfiles } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SeniorResumePage() {
  const profiles = await listSeniorProfiles();
  const profile = profiles[0];

  return (
    <SeniorLayout showHomeLink>
      <header>
        <h1 className="text-[34px] font-black leading-tight">
          내 이력서
          <br />
          쉽게 보기
        </h1>
        <p className="mt-4 text-[21px] font-bold leading-relaxed">
          말로 답한 내용을 일자리 지원에 쓸 수 있는 문장으로 정리합니다.
        </p>
      </header>

      <section className="mt-7 rounded-[24px] bg-white p-5 shadow-lg shadow-emerald-950/10">
        <p className="text-[19px] font-black text-[#1f6f4a]">AI 변환 이력</p>
        <h2 className="mt-2 text-[27px] font-black">{profile?.name ?? "김영자"} 님</h2>
        <dl className="mt-5 grid gap-4 text-[20px] font-bold leading-relaxed">
          <div>
            <dt className="text-[17px] font-black text-[#526157]">경력</dt>
            <dd>{profile?.previousWork ?? "사람을 안내하거나 손님을 응대한 경험"}</dd>
          </div>
          <div>
            <dt className="text-[17px] font-black text-[#526157]">희망 직종</dt>
            <dd>{profile?.preferredJobType ?? "안내 도우미"}</dd>
          </div>
          <div>
            <dt className="text-[17px] font-black text-[#526157]">희망 지역</dt>
            <dd>{profile?.region ?? "서울 중구"}</dd>
          </div>
          <div>
            <dt className="text-[17px] font-black text-[#526157]">건강 확인</dt>
            <dd>{profile?.healthLimit ?? "허리나 무릎이 불편함"}</dd>
          </div>
        </dl>
      </section>

      <Link
        className="mt-6 flex min-h-[68px] w-full items-center justify-center rounded-2xl bg-[#1f6f4a] px-6 text-center text-[22px] font-black text-white"
        href="/senior/voice?mode=recommend"
      >
        내 정보 다시 말하기
      </Link>
    </SeniorLayout>
  );
}
