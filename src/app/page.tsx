import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f7fbf4] px-6 py-10 text-[#17211b]">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-4xl flex-col justify-center gap-8">
        <div>
          <h1 className="text-4xl font-black leading-tight md:text-6xl">
            시니어 AI
            <br />
            일자리 도우미
          </h1>
          <p className="mt-5 max-w-2xl text-2xl leading-relaxed">
            말로 물어보고, 쉬운 말로 듣는 일자리 안내 서비스입니다.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            className="rounded-2xl bg-[#1f6f4a] px-8 py-7 text-center text-2xl font-black text-white shadow-lg shadow-emerald-900/10"
            href="/senior"
          >
            구직자용 시작
          </Link>
          <Link
            className="rounded-2xl border-2 border-[#1f6f4a] bg-white px-8 py-7 text-center text-2xl font-black text-[#1f6f4a]"
            href="/employer"
          >
            기업용 관리
          </Link>
        </div>
      </div>
    </main>
  );
}
