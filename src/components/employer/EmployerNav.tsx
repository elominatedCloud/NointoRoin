import Link from "next/link";

const links = [
  { href: "/employer/profile", label: "기업 정보" },
  { href: "/employer/jobs", label: "공고" },
  { href: "/employer/applications", label: "이력서" },
  { href: "/employer/attendance", label: "출퇴근" },
  { href: "/employer/policies", label: "정책" },
  { href: "/employer/my", label: "마이" },
  { href: "/employer/help", label: "AI 도움" },
];

export function EmployerNav() {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="기업용 메뉴">
      {links.map((link) => (
        <Link
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-emerald-700 hover:text-emerald-800"
          href={link.href}
          key={link.href}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
