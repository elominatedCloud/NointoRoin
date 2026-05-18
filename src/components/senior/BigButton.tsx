"use client";

import Link from "next/link";

type BigButtonProps = {
    children: React.ReactNode;
    href?: string;
    onClick?: () => void;
    type?: "button" | "submit";
    variant?: "primary" | "secondary" | "action" | "quiet";
    disabled?: boolean;
};

const variants = {
    primary:
        "bg-[#3ACBA7] text-white shadow-lg shadow-[#3ACBA7]/20 hover:bg-[#2FB894] hover:shadow-xl hover:shadow-[#3ACBA7]/30",
    secondary:
        "border-2 border-[#3ACBA7] bg-white text-[#3ACBA7] hover:border-[#2FB894] hover:bg-[#E8FBF6] hover:text-[#3ACBA7]",
    action:
        "bg-[#2DC8CA] text-white shadow-lg shadow-orange-900/15 hover:bg-[#38A2B8] hover:shadow-xl hover:shadow-orange-900/20",
    quiet:
        "bg-[#E8FBF6] text-[#17211b] hover:bg-[#D9F8F1] hover:text-[#3ACBA7]",
};

const baseClass =
    "flex min-h-[72px] w-full items-center justify-center rounded-[22px] px-6 text-center text-[22px] font-black leading-tight transition duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#ff8a3d]";

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
        if (/^(tel:|mailto:|https?:\/\/)/.test(href)) {
            return (
                <a className={className} href={href}>
                    {children}
                </a>
            );
        }

        return (
            <Link className={className} href={href}>
                {children}
            </Link>
        );
    }

    return (
        <button
            className={className}
            disabled={disabled}
            onClick={onClick}
            type={type}
        >
            {children}
        </button>
    );
}