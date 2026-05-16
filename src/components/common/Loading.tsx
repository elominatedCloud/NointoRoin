type LoadingProps = {
  label?: string;
};

export function Loading({ label = "불러오는 중입니다" }: LoadingProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-5 text-center text-base font-semibold text-slate-700">
      {label}
    </div>
  );
}
