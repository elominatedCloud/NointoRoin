"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Bot,
    BriefcaseBusiness,
    Building2,
    CalendarClock,
    FileText,
    Landmark,
    UserRound,
} from "lucide-react";

const links = [
    { href: "/employer/jobs", label: "공고", icon: BriefcaseBusiness },
    { href: "/employer/applications", label: "이력서", icon: FileText },
    { href: "/employer/attendance", label: "출퇴근", icon: CalendarClock },
    { href: "/employer/policies", label: "정책", icon: Landmark },
    { href: "/employer/profile", label: "기업", icon: Building2 },
    { href: "/employer/my", label: "마이", icon: UserRound },
    { href: "/employer/help", label: "AI", icon: Bot },
];

export function EmployerNav() {
    const pathname = usePathname();

    return (
        <>
            <nav className="hidden flex-wrap gap-2 md:flex" aria-label="기업용 메뉴">
                {links.map((link) => {
                    const isActive = pathname.startsWith(link.href);

                    return (
                        <Link
                            className={`rounded-lg border px-4 py-2 text-sm font-bold ${
                                isActive
                                    ? "border-[#3ACBA7] bg-[#3ACBA7] text-white"
                                    : "border-[#BDEFE4] bg-white text-slate-700 hover:border-[#3ACBA7] hover:text-[#3ACBA7]"
                            }`}
                            href={link.href}
                            key={link.href}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            <nav
                aria-label="기업용 하단 메뉴"
                className="fixed inset-x-0 bottom-0 z-20 border-t border-[#BDEFE4] bg-white/95 px-3 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2 shadow-[0_-12px_30px_rgba(58,203,167,0.12)] backdrop-blur md:hidden"
            >
                <div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname.startsWith(link.href);

                        return (
                            <Link
                                aria-current={isActive ? "page" : undefined}
                                className={`flex min-h-[64px] min-w-[72px] flex-col items-center justify-center gap-1 rounded-2xl text-xs font-black ${
                                    isActive ? "bg-[#3ACBA7] text-white" : "text-slate-600"
                                }`}
                                href={link.href}
                                key={link.href}
                            >
                                <Icon aria-hidden="true" size={22} strokeWidth={2.5} />
                                {link.label}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}