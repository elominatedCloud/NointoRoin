import { BigButton } from "@/components/senior/BigButton";
import { SeniorLayout } from "@/components/senior/SeniorLayout";

export default function SeniorHelpPage() {
  return (
    <SeniorLayout showHomeLink>
      <header>
        <h1 className="text-[34px] font-black leading-tight">
          AI 도움
          <br />
          말로 받기
        </h1>
        <p className="mt-4 text-[21px] font-bold leading-relaxed">
          궁금한 공고, 신청 방법, 몸에 무리가 되는 일을 음성으로 물어볼 수 있습니다.
        </p>
      </header>

      <div className="mt-8 grid gap-5">
        <BigButton href="/senior/voice?mode=ask">궁금한 것 말하기</BigButton>
        <BigButton href="/senior/voice?mode=recommend" variant="secondary">
          내 조건으로 추천받기
        </BigButton>
      </div>
    </SeniorLayout>
  );
}
