"use client";

import Link from "next/link";

type SeniorLayoutProps = {
  children: React.ReactNode;
  showHomeLink?: boolean;
};

export function SeniorLayout({ children, showHomeLink = false }: SeniorLayoutProps) {
  return (
    <main className="min-h-screen bg-[#f7fbf4] px-5 py-6 text-[#17211b]">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[430px] flex-col justify-center">
        {children}
        {showHomeLink ? (
          <Link className="mt-7 text-center text-[22px] font-bold text-[#1f6f4a]" href="/senior">
            처음으로 돌아가기
          </Link>
        ) : null}
      </section>
    </main>
  );
}
