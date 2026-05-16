"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatKoreanDate } from "@/lib/utils";
import type { Job } from "@/types/job";

export function JobList() {
  const [jobs, setJobs] = useState<Job[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    return JSON.parse(localStorage.getItem("employer-jobs") || "[]") as Job[];
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("employer-jobs") || "[]") as Job[];
    fetch("/api/employer/jobs")
      .then((response) => response.json())
      .then((payload: { jobs?: Job[] }) => {
        const apiJobs = payload.jobs ?? [];
        const merged = mergeJobs(stored, apiJobs);
        setJobs(merged);
      })
      .catch(() => setJobs(stored));
  }, []);

  if (jobs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <p className="text-lg font-bold text-slate-700">아직 등록한 공고가 없습니다.</p>
        <Link className="mt-5 inline-flex rounded-xl bg-emerald-800 px-5 py-3 font-black text-white" href="/employer/jobs/new">
          공고 등록하기
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="grid grid-cols-[1.5fr_0.6fr_0.8fr_0.7fr_0.8fr] gap-4 border-b border-slate-200 bg-slate-100 px-5 py-3 text-sm font-black text-slate-700 max-md:hidden">
        <span>공고 제목</span>
        <span>모집 상태</span>
        <span>등록일</span>
        <span>지원자 수</span>
        <span>AI 설명</span>
      </div>
      <div className="divide-y divide-slate-200">
        {jobs.map((job) => (
          <div
            className="grid grid-cols-[1.5fr_0.6fr_0.8fr_0.7fr_0.8fr] gap-4 px-5 py-4 text-base max-md:grid-cols-1"
            key={job.id}
          >
            <div>
              <div className="font-black text-slate-950">{job.title}</div>
              <div className="mt-1 text-sm font-semibold text-slate-600">{job.workLocation}</div>
            </div>
            <span className="font-bold text-emerald-800">{job.status === "active" ? "모집 중" : job.status}</span>
            <span>{formatKoreanDate(job.createdAt)}</span>
            <span>0명</span>
            <span className="font-bold text-emerald-800">생성됨</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function mergeJobs(localJobs: Job[], apiJobs: Job[]) {
  const map = new Map<string, Job>();
  [...apiJobs, ...localJobs].forEach((job) => map.set(job.id, job));
  return Array.from(map.values());
}
