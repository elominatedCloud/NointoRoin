"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import type { EmployerJobInput, Job } from "@/types/job";

type JobFormState = EmployerJobInput;

const emptyJob: JobFormState = {
  title: "",
  description: "",
  workLocation: "",
  workTime: "",
  pay: "",
  eligibility: "",
  preferredConditions: "",
  applicationMethod: "",
  phone: "",
};

const fields: Array<{
  name: keyof JobFormState;
  label: string;
  type: "input" | "textarea";
  required?: boolean;
}> = [
  { name: "title", label: "공고 제목", type: "input", required: true },
  { name: "description", label: "하는 일", type: "textarea", required: true },
  { name: "workLocation", label: "근무 장소", type: "input", required: true },
  { name: "workTime", label: "근무 시간", type: "input", required: true },
  { name: "pay", label: "급여", type: "input", required: true },
  { name: "eligibility", label: "지원 자격", type: "textarea", required: true },
  { name: "preferredConditions", label: "우대 조건", type: "textarea" },
  { name: "applicationMethod", label: "신청 방법", type: "textarea", required: true },
  { name: "phone", label: "연락처", type: "input", required: true },
];

export function JobForm() {
  const router = useRouter();
  const [form, setForm] = useState<JobFormState>(emptyJob);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField(name: keyof JobFormState, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const missing = fields.find((field) => field.required && !form[field.name].trim());
    if (missing) {
      setError(`${missing.label}을 입력해주세요.`);
      return;
    }

    setSaving(true);
    const response = await fetch("/api/employer/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      setError("공고를 저장하지 못했습니다. 다시 시도해주세요.");
      setSaving(false);
      return;
    }

    const payload = (await response.json()) as { job: Job };
    const stored = JSON.parse(localStorage.getItem("employer-jobs") || "[]") as Job[];
    localStorage.setItem("employer-jobs", JSON.stringify([payload.job, ...stored]));
    router.push("/employer/jobs");
  }

  return (
    <form className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
      <ErrorMessage message={error} />
      {fields.map((field) => (
        <label className="grid gap-2" key={field.name}>
          <span className="text-sm font-black text-slate-700">
            {field.label}
            {field.required ? " *" : ""}
          </span>
          {field.type === "textarea" ? (
            <textarea
              className="min-h-28 rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
              onChange={(event) => updateField(field.name, event.target.value)}
              required={field.required}
              value={form[field.name]}
            />
          ) : (
            <input
              className="h-12 rounded-xl border border-slate-300 px-4 text-base outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
              onChange={(event) => updateField(field.name, event.target.value)}
              required={field.required}
              value={form[field.name]}
            />
          )}
        </label>
      ))}
      <button
        className="min-h-14 rounded-xl bg-emerald-800 px-5 text-lg font-black text-white disabled:opacity-60"
        disabled={saving}
        type="submit"
      >
        {saving ? "AI 쉬운 설명 생성 중" : "공고 저장"}
      </button>
    </form>
  );
}
