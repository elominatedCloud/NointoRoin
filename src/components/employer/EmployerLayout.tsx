import Link from "next/link";
import { EmployerNav } from "@/components/employer/EmployerNav";

type EmployerLayoutProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function EmployerLayout({ title, description, children }: EmployerLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col gap-5 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Link className="text-sm font-black text-emerald-800" href="/employer">
              기업용 일자리 관리
            </Link>
            <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">{title}</h1>
            {description ? <p className="mt-3 max-w-2xl text-lg leading-relaxed text-slate-700">{description}</p> : null}
          </div>
          <EmployerNav />
        </header>
        {children}
      </div>
    </main>
  );
}
