import { BigButton } from "@/components/senior/BigButton";
import { SeniorLayout } from "@/components/senior/SeniorLayout";

export default function SeniorHomePage() {
  return (
    <SeniorLayout>
      <div className="rounded-[32px] bg-white px-7 py-9 shadow-xl shadow-emerald-950/10">
        <h1 className="text-[36px] font-black leading-tight">
          안녕하세요
          <br />
          일자리 찾기를
          <br />
          도와드릴게요
        </h1>
        <p className="mt-10 text-[28px] font-black leading-snug">
          궁금한 것을
          <br />
          말로 물어보세요
        </p>
        <div className="mt-11 grid gap-5">
          <BigButton href="/senior/voice?mode=ask">말로 물어보기</BigButton>
          <BigButton href="/senior/voice?mode=recommend" variant="secondary">
            내 조건으로 추천받기
          </BigButton>
        </div>
      </div>
    </SeniorLayout>
  );
}
