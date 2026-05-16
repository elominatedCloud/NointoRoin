"use client";

import Link from "next/link";

type BigButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary";
  disabled?: boolean;
};

const variants = {
  primary: "bg-[#1f6f4a] text-white shadow-lg shadow-emerald-900/15",
  secondary: "border-2 border-[#1f6f4a] bg-white text-[#1f6f4a]",
};

const baseClass =
  "flex min-h-[72px] w-full items-center justify-center rounded-2xl px-6 text-center text-[22px] font-black leading-tight transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60";

export function BigButton({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
}: BigButtonProps) {
  const className = `${baseClass} ${variants[variant]}`;

  if (href) {
    return (
      <Link className={className} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className} disabled={disabled} onClick={onClick} type={type}>
      {children}
    </button>
  );
}
