import { BigButton } from "@/components/senior/BigButton";
import { SeniorLayout } from "@/components/senior/SeniorLayout";
import {
  Bot,
  CalendarDays,
  ChevronRight,
  FileText,
  MapPinned,
  ShieldCheck,
  UserRound,
  Volume2,
} from "lucide-react";
import Link from "next/link";

const primaryActions = [
  {
    href: "/senior/public-jobs",
    title: "우리동네 일자리 보기",
    description: "공공 API에서 들어온 공고를 쉬운 말로 봅니다.",
    helper: "먼저 보기",
    icon: MapPinned,
  },
  {
    href: "/senior/voice?mode=recommend",
    title: "내 조건으로 추천받기",
    description: "해본 일과 아픈 곳을 고르면 맞는 공고를 찾아드립니다.",
    helper: "3분 상담",
    icon: ShieldCheck,
  },
  {
    href: "/senior/help",
    title: "말로 물어보기",
    description: "공고가 어려우면 음성으로 묻고 다시 들을 수 있습니다.",
    helper: "음성 안내",
    icon: Volume2,
  },
];

const secondaryActions = [
  {
    href: "/senior/attendance",
    title: "출근 달력",
    icon: CalendarDays,
  },
  {
    href: "/senior/resume",
    title: "내 이력서",
    icon: FileText,
  },
  {
    href: "/senior/my",
    title: "마이",
    icon: UserRound,
  },
  {
    href: "/senior/help",
    title: "AI 도움",
    icon: Bot,
  },
];

export default function SeniorHomePage() {
  return (
    <SeniorLayout>
      <header>
        <p className="text-[20px] font-black text-[#1f6f4a]">오늘 할 일</p>
        <h1 className="mt-2 text-[36px] font-black leading-tight">
          어떤 일자리를
          <br />
          찾으시나요?
        </h1>
        <p className="mt-4 text-[21px] font-bold leading-relaxed text-[#425247]">
          공고를 먼저 볼 수도 있고, 아픈 곳과 해본 일을 말하고 추천받을 수도 있습니다.
        </p>
      </header>

      <section className="mt-7 grid gap-4" aria-label="주요 행동">
        {primaryActions.map((item, index) => {
          const Icon = item.icon;

          return (
            <Link
              className={`group flex min-h-[136px] items-center gap-4 rounded-[28px] p-5 shadow-lg shadow-emerald-950/10 ${
                index === 0 ? "bg-[#1f6f4a] text-white" : "bg-white text-[#17211b]"
              }`}
              href={item.href}
              key={item.href}
            >
              <span
                className={`flex size-16 shrink-0 items-center justify-center rounded-[22px] ${
                  index === 0 ? "bg-white text-[#1f6f4a]" : "bg-[#eaf4ea] text-[#1f6f4a]"
                }`}
              >
                <Icon aria-hidden="true" size={30} strokeWidth={2.5} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[25px] font-black leading-tight">{item.title}</span>
                <span
                  className={`mt-2 block text-[18px] font-bold leading-snug ${
                    index === 0 ? "text-white/90" : "text-[#526157]"
                  }`}
                >
                  {item.description}
                </span>
              </span>
              <span
                className={`flex min-w-[68px] flex-col items-end gap-2 text-[17px] font-black ${
                  index === 0 ? "text-white" : "text-[#1f6f4a]"
                }`}
              >
                {item.helper}
                <ChevronRight aria-hidden="true" size={26} strokeWidth={3} />
              </span>
            </Link>
          );
        })}
      </section>

      <section className="mt-6 rounded-[28px] bg-white p-5 shadow-lg shadow-emerald-950/10">
        <h2 className="text-[24px] font-black">다음 단계가 걱정되시나요?</h2>
        <p className="mt-3 text-[19px] font-bold leading-relaxed text-[#526157]">
          공고를 고르면 신청 순서와 전화 가능 여부를 바로 보여드립니다.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {secondaryActions.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                className="flex min-h-[86px] flex-col justify-between rounded-[20px] bg-[#f3f8f1] p-4 text-[#17211b]"
                href={item.href}
                key={item.href}
              >
                <Icon aria-hidden="true" className="text-[#1f6f4a]" size={26} strokeWidth={2.7} />
                <span className="text-[19px] font-black">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="mt-6 grid gap-4">
        <BigButton href="/senior/voice?mode=recommend" variant="action">
          바로 추천 시작
        </BigButton>
      </div>
    </SeniorLayout>
  );
}
