import Link from "next/link";

export default function HomePage() {
  return (
      <main className="min-h-screen bg-[#F4FFFC] px-6 py-10 text-[#17211b]">
        <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-[430px] flex-col justify-center">
          <header>
            <h1 className="text-[36px] font-black leading-tight text-[#3ACBA7]">
              로인
            </h1>
            <p className="mt-2 text-[22px] font-bold text-[#17211b]">
              노인(老人)을 로인(勞人)으로
            </p>
          </header>

          <div className="mt-12 grid grid-cols-2 gap-5">
            <div>
              <Link
                  href="/senior"
                  className="flex aspect-square items-center justify-center rounded-[24px] border border-[#BDEFE4] bg-white p-5 text-center text-[31px] font-black leading-tight shadow-lg shadow-[#3ACBA7]/10 transition duration-200 hover:-translate-y-1 hover:border-[#3ACBA7] hover:bg-[#E8FBF6] hover:shadow-xl hover:shadow-[#3ACBA7]/20 active:translate-y-0 active:scale-[0.98]"
              >
                근로자
                <br />
                로그인
              </Link>

              <div className="mt-4 text-[15px] font-bold leading-relaxed text-[#526157]">
                <p>① 쉬운 맞춤 공고 보기</p>
                <p>② 일자리 추천받기</p>
              </div>
            </div>

            <div>
              <Link
                  href="/employer"
                  className="flex aspect-square items-center justify-center rounded-[24px] border border-[#BDEFE4] bg-white p-5 text-center text-[31px] font-black leading-tight shadow-lg shadow-[#3ACBA7]/10 transition duration-200 hover:-translate-y-1 hover:border-[#3ACBA7] hover:bg-[#E8FBF6] hover:shadow-xl hover:shadow-[#3ACBA7]/20 active:translate-y-0 active:scale-[0.98]"
              >
                기업
                <br />
                로그인
              </Link>

              <div className="mt-4 text-[15px] font-bold leading-relaxed text-[#526157]">
                <p>기업 전용 로그인</p>
              </div>
            </div>
          </div>
        </section>
      </main>
  );
}