"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ErrorMessage } from "@/components/common/ErrorMessage";

type ProfileFormState = {
  companyName: string;
  ownerName: string;
  phone: string;
  address: string;
  industry: string;
  description: string;
};

const emptyProfile: ProfileFormState = {
  companyName: "",
  ownerName: "",
  phone: "",
  address: "",
  industry: "",
  description: "",
};

export function ProfileForm() {
  const router = useRouter();
  const [form, setForm] = useState<ProfileFormState>(() => {
    if (typeof window === "undefined") {
      return emptyProfile;
    }

    const stored = localStorage.getItem("employer-profile");
    return stored ? (JSON.parse(stored) as ProfileFormState) : emptyProfile;
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField(name: keyof ProfileFormState, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!form.companyName.trim() || !form.phone.trim() || !form.address.trim()) {
      setError("기업명, 연락처, 주소는 꼭 입력해주세요.");
      return;
    }

    setSaving(true);

    const response = await fetch("/api/employer/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      setError("저장하지 못했습니다. 다시 시도해주세요.");
      setSaving(false);
      return;
    }

    localStorage.setItem("employer-profile", JSON.stringify(form));
    router.push("/employer/jobs/new");
  }

  return (
    <form className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
      <ErrorMessage message={error} />
      <Field label="기업명" name="companyName" onChange={updateField} required value={form.companyName} />
      <Field label="대표자명" name="ownerName" onChange={updateField} value={form.ownerName} />
      <Field label="연락처" name="phone" onChange={updateField} required value={form.phone} />
      <Field label="주소" name="address" onChange={updateField} required value={form.address} />
      <Field label="업종" name="industry" onChange={updateField} value={form.industry} />
      <label className="grid gap-2">
        <span className="text-sm font-black text-slate-700">기업 소개</span>
        <textarea
          className="min-h-32 rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
          onChange={(event) => updateField("description", event.target.value)}
          value={form.description}
        />
      </label>
      <button
        className="min-h-14 rounded-xl bg-emerald-800 px-5 text-lg font-black text-white disabled:opacity-60"
        disabled={saving}
        type="submit"
      >
        {saving ? "저장 중" : "저장하고 공고 등록하기"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  value,
  required = false,
  onChange,
}: {
  label: string;
  name: keyof ProfileFormState;
  value: string;
  required?: boolean;
  onChange: (name: keyof ProfileFormState, value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-slate-700">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        className="h-12 rounded-xl border border-slate-300 px-4 text-base outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
        onChange={(event) => onChange(name, event.target.value)}
        required={required}
        value={value}
      />
    </label>
  );
}
