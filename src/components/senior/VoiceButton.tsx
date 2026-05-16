"use client";

import { Mic } from "lucide-react";
import { BigButton } from "@/components/senior/BigButton";

type VoiceButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
};

export function VoiceButton({ onClick, disabled = false, label = "말하기 시작" }: VoiceButtonProps) {
  return (
    <BigButton disabled={disabled} onClick={onClick}>
      <span className="flex items-center gap-3">
        <Mic aria-hidden="true" size={30} strokeWidth={3} />
        {label}
      </span>
    </BigButton>
  );
}
