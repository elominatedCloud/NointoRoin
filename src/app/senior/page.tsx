import { BigButton } from "@/components/senior/BigButton";
import { SeniorLayout } from "@/components/senior/SeniorLayout";
import { Bot, BriefcaseBusiness, CalendarDays, FileText, MapPinned, UserRound } from "lucide-react";
import Link from "next/link";

const menuItems = [
  {
    href: "/senior/public-jobs",
    title: "우리동네 일자리",
    description: "인기 공고와 신규 공고를 쉽게 봅니다.",
    icon: MapPinned,
  },
  {
    href: "/senior/voice?mode=recommend",
    title: "나에게 맞는 추천",
    description: "경력과 아픈 곳을 말하고 추천받습니다.",
    icon: BriefcaseBusiness,
  },
  {
    href: "/senior/attendance",
    title: "출근 달력",
    description: "출근일과 예상 일급을 확인합니다.",
    icon: CalendarDays,
  },
  {
    href: "/senior/resume",
    title: "내 이력서",
    description: "AI와 함께 만든 내 경력을 봅니다.",
    icon: FileText,
  },
  {
    href: "/senior/help",
    title: "AI 도움",
    description: "말로 묻고 음성으로 안내받습니다.",
    icon: Bot,
  },
  {
    href: "/senior/my",
    title: "마이",
    description: "계정, 문의, 개인정보 설정입니다.",
    icon: UserRound,
  },
];

export default function SeniorHomePage() {
  return (
    <SeniorLayout>
      <header>
        <h1 className="text-[35px] font-black leading-tight">
          안녕하세요
          <br />
          일자리 찾기를
          <br />
          도와드릴게요
        </h1>
        <p className="mt-4 text-[22px] font-bold leading-relaxed">
          공고를 보고, 내 조건을 말하고, 신청 방법까지 바로 확인하세요.
        </p>
      </header>

      <div className="mt-7 grid gap-3">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              className="flex min-h-[98px] items-center gap-4 rounded-[24px] bg-white p-5 shadow-lg shadow-emerald-950/10"
              href={item.href}
              key={item.href}
            >
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#1f6f4a] text-white">
                <Icon aria-hidden="true" size={30} strokeWidth={2.5} />
              </span>
              <span>
                <span className="block text-[23px] font-black leading-tight">{item.title}</span>
                <span className="mt-1 block text-[17px] font-bold leading-snug text-[#526157]">
                  {item.description}
                </span>
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4">
        <BigButton href="/senior/voice?mode=ask">말로 물어보기</BigButton>
        <BigButton href="/senior/voice?mode=recommend" variant="secondary">
          내 조건으로 추천받기
        </BigButton>
      </div>
    </SeniorLayout>
  );
}
