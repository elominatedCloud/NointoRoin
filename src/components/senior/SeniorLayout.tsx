"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, BriefcaseBusiness, Home, UserRound } from "lucide-react";

type SeniorLayoutProps = {
  children: React.ReactNode;
  showHomeLink?: boolean;
  hideBottomNav?: boolean;
};

const navItems = [
  { href: "/senior", label: "홈", icon: Home },
  { href: "/senior/public-jobs", label: "일자리", icon: BriefcaseBusiness },
  { href: "/senior/help", label: "상담", icon: Bot },
  { href: "/senior/my", label: "마이", icon: UserRound },
];

export function SeniorLayout({
  children,
  showHomeLink = false,
  hideBottomNav = false,
}: SeniorLayoutProps) {
  const pathname = usePathname();
  const bottomPadding = hideBottomNav
    ? "pb-8"
    : "pb-[calc(112px+env(safe-area-inset-bottom))]";

  return (
    <main className="h-dvh overflow-hidden bg-[#f3f8f1] text-[#17211b]">
      <div className={`h-full overflow-y-auto px-5 pt-6 ${bottomPadding}`}>
        <section className="mx-auto w-full max-w-[430px]">
          {children}
          {showHomeLink ? (
            <Link className="mt-8 block text-center text-[21px] font-black text-[#1f6f4a]" href="/senior">
              처음으로 돌아가기
            </Link>
          ) : null}
        </section>
      </div>
      {hideBottomNav ? null : (
        <nav
          aria-label="어르신용 하단 메뉴"
          className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[430px] border-t border-[#dbe8dc] bg-white/95 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_30px_rgba(23,33,27,0.08)] backdrop-blur"
        >
          <div className="grid grid-cols-4 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/senior" ? pathname === item.href : pathname.startsWith(item.href);

              return (
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={`flex min-h-[62px] flex-col items-center justify-center gap-1 rounded-2xl text-[15px] font-black ${
                    isActive ? "bg-[#1f6f4a] text-white" : "text-[#526157]"
                  }`}
                  href={item.href}
                  key={item.href}
                >
                  <Icon aria-hidden="true" size={24} strokeWidth={2.7} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </main>
  );
}
