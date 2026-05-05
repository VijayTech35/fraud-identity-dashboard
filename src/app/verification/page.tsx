"use client";

import { useEffect, useMemo, useState } from "react";
import { downloadCsv, downloadPdf } from "@/lib/export";
import { CheckCircle2, ScanFace, Sparkles } from "lucide-react";

type VerificationTask = {
  id: string;
  user: string;
  phoneVerified: boolean;
  documentStatus: "Pending" | "Passed" | "Failed";
  faceMatch: number;
  progress: number;
  status: "Verified" | "Pending" | "Failed";
  updatedAt: string;
};

const metrics = [
  { label: "Verification Success", value: "91.6%", delta: "+1.9% week-over-week", positive: true },
  { label: "Avg Scan Time", value: "42s", delta: "-8s optimization", positive: true },
  { label: "Pending Queue", value: "83", delta: "12 high-priority" },
  { label: "Face Match Failures", value: "3.1%", delta: "-0.4%", positive: true },
];

const seed: VerificationTask[] = [
  { id: "VER-921", user: "Aanya Singh", phoneVerified: true, documentStatus: "Passed", faceMatch: 96, progress: 100, status: "Verified", updatedAt: "Just now" },
  { id: "VER-917", user: "Imran Khan", phoneVerified: true, documentStatus: "Pending", faceMatch: 72, progress: 68, status: "Pending", updatedAt: "3 mins ago" },
  { id: "VER-910", user: "Ritika Shah", phoneVerified: true, documentStatus: "Failed", faceMatch: 49, progress: 100, status: "Failed", updatedAt: "8 mins ago" },
  { id: "VER-901", user: "Nikhil Das", phoneVerified: true, documentStatus: "Passed", faceMatch: 93, progress: 100, status: "Verified", updatedAt: "15 mins ago" },
];

const profile = {
  fullName: "Imran Khan",
  dob: "1996-04-12",
  country: "India",
  documentId: "IN-AX4-19F-72",
  confidence: 94,
};

export default function VerificationPage() {
  const [tasks, setTasks] = useState<VerificationTask[]>(seed);

  useEffect(() => {
    const timer = setInterval(() => {
      setTasks((prev) =>
        prev.map((task) =>
          task.status === "Pending"
            ? { ...task, progress: Math.min(100, task.progress + 4), status: task.progress >= 96 ? "Verified" : "Pending", updatedAt: "Just now" }
            : task,
        ),
      );
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const success = useMemo(() => Math.round((tasks.filter((t) => t.status === "Verified").length / tasks.length) * 100), [tasks]);

  return (
    <section className="space-y-5 text-slate-900 dark:text-slate-100">
      <div className="glass-card relative overflow-hidden rounded-3xl p-6">
        <div className="absolute -left-10 top-0 h-28 w-28 rounded-full bg-fuchsia-400/20 blur-2xl" />
        <div className="absolute right-0 top-1/2 h-28 w-28 rounded-full bg-violet-500/20 blur-2xl" />
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#98BDFF]/30 px-3 py-1 text-xs font-medium text-[#4B49AC] dark:bg-[#7DA0FA]/20 dark:text-[#98BDFF]">
          <ScanFace size={14} /> Biometric Workflow
        </div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">User Identity Verification Dashboard</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">Track phone checks, document OCR, and face matching confidence in real time.</p>
          </div>
          <p className="inline-flex items-center gap-1 rounded-full bg-[#7DA0FA]/25 px-3 py-1 text-xs font-medium text-[#4B49AC] dark:bg-[#7DA0FA]/20 dark:text-[#98BDFF]"><CheckCircle2 size={14} /> SLA healthy</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.label} className="glass-card rounded-2xl p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <p className="text-sm text-slate-700 dark:text-slate-300">{metric.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{metric.value}</p>
            <p className={`mt-2 text-xs ${metric.positive ? "text-emerald-600" : "text-slate-500 dark:text-slate-400"}`}>{metric.delta}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <section className="glass-card overflow-hidden rounded-2xl shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Verification History</h3>
            <div className="flex gap-2">
              <button className="rounded-lg border border-[#7978E9]/50 bg-[#7978E9]/15 px-3 py-1.5 text-sm text-[#4B49AC] transition hover:bg-[#7978E9]/25 dark:text-[#98BDFF]" onClick={() => downloadCsv(tasks, "verification-history.csv")}>Export CSV</button>
              <button
                className="rounded-lg border border-[#98BDFF]/60 bg-[#98BDFF]/20 px-3 py-1.5 text-sm text-[#4B49AC] transition hover:bg-[#98BDFF]/30 dark:text-[#98BDFF]"
                onClick={() =>
                  downloadPdf(
                    "Verification Logs",
                    ["ID", "User", "Doc", "Face", "Progress", "Status"],
                    tasks.map((r) => [r.id, r.user, r.documentStatus, `${r.faceMatch}%`, `${r.progress}%`, r.status]),
                    "verification-history.pdf",
                  )
                }
              >
                Export PDF
              </button>
            </div>
          </div>
          <div className="space-y-3 p-4">
            {tasks.map((task) => (
              <article
                key={task.id}
                className="verification-history-card rounded-xl border border-slate-200/80 bg-white/95 p-3 shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md dark:border-0 dark:bg-transparent dark:shadow-none dark:hover:shadow-lg"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="vh-title font-semibold text-slate-900">{task.user}</p>
                    <p className="vh-meta text-xs text-slate-600">{task.id} • {task.updatedAt}</p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      task.status === "Verified"
                        ? "bg-emerald-500/25 text-emerald-300 ring-1 ring-emerald-400/40 dark:bg-green-500/25 dark:text-green-300 dark:ring-green-400/35"
                        : task.status === "Failed"
                          ? "bg-rose-500/25 text-rose-300 ring-1 ring-rose-400/40 dark:bg-red-500/25 dark:text-red-300 dark:ring-red-400/35"
                          : "bg-amber-500/25 text-amber-700 ring-1 ring-amber-400/50 dark:bg-yellow-500/25 dark:text-yellow-300 dark:ring-yellow-400/35"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
                <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
                  <p className="vh-label text-slate-700">
                    Phone: <strong className="vh-value font-semibold text-slate-900">{task.phoneVerified ? "Verified" : "Pending"}</strong>
                  </p>
                  <p className="vh-label text-slate-700">
                    Document: <strong className="vh-value font-semibold text-slate-900">{task.documentStatus}</strong>
                  </p>
                  <p className="vh-label text-slate-700">
                    Face Match: <strong className="vh-value font-semibold text-slate-900">{task.faceMatch}%</strong>
                  </p>
                </div>
                <div className="vh-track mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="vh-progress h-2.5 rounded-full bg-slate-900 transition-[width] duration-300 ease-out dark:bg-gradient-to-r dark:from-cyan-400 dark:to-indigo-400"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="space-y-4">
          <article className="glass-card rounded-2xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Real-time Success Rate</h3>
            <p className="mt-3 inline-flex items-center gap-2 text-4xl font-bold"><Sparkles size={28} className="text-[#7978E9]" />{success}%</p>
            <p className="mt-2 text-xs text-slate-500">Updated every 3.5s from simulated scan pipeline.</p>
          </article>
          <article className="glass-card rounded-2xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Extracted Profile</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><dt>Name</dt><dd>{profile.fullName}</dd></div>
              <div className="flex justify-between"><dt>DOB</dt><dd>{profile.dob}</dd></div>
              <div className="flex justify-between"><dt>Country</dt><dd>{profile.country}</dd></div>
              <div className="flex justify-between"><dt>Doc ID</dt><dd>{profile.documentId}</dd></div>
              <div className="flex justify-between"><dt>Confidence</dt><dd>{profile.confidence}%</dd></div>
            </dl>
          </article>
        </div>
      </div>
    </section>
  );
}
