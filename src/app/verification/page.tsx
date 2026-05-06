"use client";

import { useEffect, useMemo, useState } from "react";
import { downloadCsv, downloadPdf } from "@/lib/export";
import { CheckCircle2, ScanFace, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

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

const statusVariant = (status: VerificationTask["status"]): "success" | "warning" | "destructive" => {
  switch (status) {
    case "Verified":
      return "success";
    case "Pending":
      return "warning";
    case "Failed":
      return "destructive";
  }
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
    <section className="space-y-5 text-foreground">
      {/* Hero Section */}
      <div className="glass-card relative overflow-hidden rounded-3xl p-4 sm:p-6">
        <div className="absolute -left-10 top-0 h-28 w-28 rounded-full bg-fuchsia-400/20 blur-2xl" />
        <div className="absolute right-0 top-1/2 h-28 w-28 rounded-full bg-violet-500/20 blur-2xl" />
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#98BDFF]/30 px-3 py-1 text-xs font-medium text-[#4B49AC] dark:bg-[#7DA0FA]/20 dark:text-[#98BDFF]">
          <ScanFace size={14} /> Biometric Workflow
        </div>
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">User Identity Verification Dashboard</h2>
            <p className="mt-1 text-sm text-muted-foreground">Track phone checks, document OCR, and face matching confidence in real time.</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#7DA0FA]/25 px-3 py-1 text-xs font-medium text-[#4B49AC] dark:bg-[#7DA0FA]/20 dark:text-[#98BDFF]">
            <CheckCircle2 size={14} /> SLA healthy
          </span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="glass-card border-border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{metric.value}</p>
              <p className={`mt-2 text-xs ${metric.positive ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>{metric.delta}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        {/* Verification History */}
        <Card className="glass-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border p-4">
            <CardTitle className="text-foreground">Verification History</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-[#7978E9]/50 bg-[#7978E9]/15 text-[#4B49AC] hover:bg-[#7978E9]/25 dark:text-[#98BDFF]"
                onClick={() => downloadCsv(tasks, "verification-history.csv")}
              >
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-[#98BDFF]/60 bg-[#98BDFF]/20 text-[#4B49AC] hover:bg-[#98BDFF]/30 dark:text-[#98BDFF]"
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
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 p-4">
            {tasks.map((task) => (
              <Card
                key={task.id}
                className="border-border bg-card/95 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <CardContent className="p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{task.user}</p>
                      <p className="text-xs text-muted-foreground">{task.id} &bull; {task.updatedAt}</p>
                    </div>
                    <Badge variant={statusVariant(task.status)}>{task.status}</Badge>
                  </div>
                  <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
                    <p className="text-muted-foreground">
                      Phone: <strong className="font-semibold text-foreground">{task.phoneVerified ? "Verified" : "Pending"}</strong>
                    </p>
                    <p className="text-muted-foreground">
                      Document: <strong className="font-semibold text-foreground">{task.documentStatus}</strong>
                    </p>
                    <p className="text-muted-foreground">
                      Face Match: <strong className="font-semibold text-foreground">{task.faceMatch}%</strong>
                    </p>
                  </div>
                  <div className="mt-3">
                    <Progress value={task.progress} className="h-2.5" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="glass-card border-border shadow-sm">
            <CardContent className="p-4">
              <CardTitle className="text-foreground">Real-time Success Rate</CardTitle>
              <p className="mt-3 inline-flex items-center gap-2 text-4xl font-bold text-foreground">
                <Sparkles size={28} className="text-[#7978E9]" />
                {success}%
              </p>
              <CardDescription className="mt-2">Updated every 3.5s from simulated scan pipeline.</CardDescription>
            </CardContent>
          </Card>

          <Card className="glass-card border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-foreground">Extracted Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Name</dt>
                  <dd className="font-medium text-foreground">{profile.fullName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">DOB</dt>
                  <dd className="font-medium text-foreground">{profile.dob}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Country</dt>
                  <dd className="font-medium text-foreground">{profile.country}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Doc ID</dt>
                  <dd className="font-medium text-foreground">{profile.documentId}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Confidence</dt>
                  <dd className="font-medium text-foreground">{profile.confidence}%</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
