"use client";

import { useEffect, useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { downloadCsv, downloadPdf } from "@/lib/export";
import { CheckCircle2, Download, FileText, ScanFace, Smartphone, Sparkles, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  { label: "Verification Success", value: "91.6%", delta: "+1.9%", positive: true },
  { label: "Avg Scan Time", value: "42s", delta: "-8s", positive: true },
  { label: "Pending Queue", value: "83", delta: "12 high-priority" },
  { label: "Face Match Failures", value: "3.1%", delta: "-0.4%", positive: true },
];

const seed: VerificationTask[] = [
  { id: "VER-921", user: "Aanya Singh", phoneVerified: true, documentStatus: "Passed", faceMatch: 96, progress: 100, status: "Verified", updatedAt: "Just now" },
  { id: "VER-917", user: "Imran Khan", phoneVerified: true, documentStatus: "Pending", faceMatch: 72, progress: 68, status: "Pending", updatedAt: "3 mins ago" },
  { id: "VER-910", user: "Ritika Shah", phoneVerified: true, documentStatus: "Failed", faceMatch: 49, progress: 100, status: "Failed", updatedAt: "8 mins ago" },
  { id: "VER-901", user: "Nikhil Das", phoneVerified: true, documentStatus: "Passed", faceMatch: 93, progress: 100, status: "Verified", updatedAt: "15 mins ago" },
  { id: "VER-898", user: "Li Wei", phoneVerified: false, documentStatus: "Pending", faceMatch: 0, progress: 22, status: "Pending", updatedAt: "22 mins ago" },
];

const profile = {
  fullName: "Imran Khan",
  dob: "1996-04-12",
  country: "India",
  documentId: "IN-AX4-19F-72",
  confidence: 94,
};

const statusDistribution = [
  { name: "Verified", value: 2 },
  { name: "Pending", value: 2 },
  { name: "Failed", value: 1 },
];

const statusColors = ["#10b981", "#f59e0b", "#ef4444"];

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

const docStatusVariant = (status: VerificationTask["documentStatus"]): "success" | "warning" | "destructive" => {
  switch (status) {
    case "Passed":
      return "success";
    case "Pending":
      return "warning";
    case "Failed":
      return "destructive";
  }
};

const ChartTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number; payload: { name: string } }[] }) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-md border border-border bg-background p-2 shadow-md">
      <p className="text-xs font-medium text-foreground">{payload[0].name}</p>
      <p className="text-xs text-muted-foreground">Count: <span className="font-medium text-foreground">{payload[0].value}</span></p>
    </div>
  );
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
    <section className="space-y-4 text-foreground">
      {/* Compact Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <ScanFace size={20} className="text-primary" />
          <div>
            <h2 className="text-base font-semibold tracking-tight">Identity Verification</h2>
            <p className="text-xs text-muted-foreground">Biometric scanning & document verification</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="text-xs">
            <CheckCircle2 size={12} className="mr-1" />
            SLA healthy
          </Badge>
          <span className="text-xs text-muted-foreground">{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border-border shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{metric.label}</p>
              </div>
              <p className="mt-1 text-xl font-semibold text-foreground">{metric.value}</p>
              <p className={`mt-0.5 text-[11px] ${metric.positive ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>{metric.delta}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Scan Panels + Profile Row */}
      <div className="grid gap-3 xl:grid-cols-3">
        {/* Phone + Doc Verification */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Smartphone size={14} /> Identity Scanning
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Phone Verification</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">Active</span>
                </div>
                <Progress value={87} className="h-1.5" />
                <p className="mt-0.5 text-[11px] text-muted-foreground">87% completion rate</p>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Document Scan</span>
                  <span className="font-medium text-amber-600 dark:text-amber-400">Processing</span>
                </div>
                <Progress value={62} className="h-1.5" />
                <p className="mt-0.5 text-[11px] text-muted-foreground">62% OCR match rate</p>
              </div>
              <div className="rounded-md border border-border bg-muted/30 p-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Upload Document</span>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    <Download size={12} className="mr-1" /> Upload
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scan Results */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <UserCheck size={14} /> Scan Results
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between rounded-md bg-muted/30 px-2.5 py-2">
                <div>
                  <p className="text-xs text-muted-foreground">Phone Scan</p>
                  <p className="text-xs font-medium text-foreground">Verified</p>
                </div>
                <Badge variant="success" className="text-[10px] h-5">Passed</Badge>
              </div>
              <div className="flex items-center justify-between rounded-md bg-muted/30 px-2.5 py-2">
                <div>
                  <p className="text-xs text-muted-foreground">ID Document</p>
                  <p className="text-xs font-medium text-foreground">IN-AX4-19F-72</p>
                </div>
                <Badge variant="warning" className="text-[10px] h-5">Pending</Badge>
              </div>
              <div className="flex items-center justify-between rounded-md bg-muted/30 px-2.5 py-2">
                <div>
                  <p className="text-xs text-muted-foreground">Face Match</p>
                  <p className="text-xs font-medium text-foreground">72% confidence</p>
                </div>
                <Badge variant="warning" className="text-[10px] h-5">Review</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile + Success Rate */}
        <div className="space-y-3">
          <Card className="border-border shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Real-time Success Rate</p>
                  <p className="mt-0.5 text-2xl font-bold text-foreground">{success}%</p>
                </div>
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10">
                  <Sparkles size={20} className="text-primary" />
                </div>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">Updated every 3.5s</p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader className="pb-1.5 pt-2.5 px-3">
              <CardTitle className="text-xs font-semibold text-foreground">Extracted Profile</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <dl className="space-y-1 text-xs">
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

      {/* Verification History Table + Status Distribution */}
      <div className="grid gap-3 xl:grid-cols-[3fr_1fr]">
        {/* Verification History Table */}
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border pb-2 pt-2.5 px-3">
            <CardTitle className="text-xs font-semibold text-foreground">Verification History</CardTitle>
            <div className="flex gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => downloadCsv(tasks, "verification-history.csv")}
              >
                <FileText size={12} className="mr-1" /> CSV
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={() =>
                  downloadPdf(
                    "Verification Logs",
                    ["ID", "User", "Doc", "Face", "Progress", "Status"],
                    tasks.map((r) => [r.id, r.user, r.documentStatus, `${r.faceMatch}%`, `${r.progress}%`, r.status]),
                    "verification-history.pdf",
                  )
                }
              >
                <FileText size={12} className="mr-1" /> PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="px-3 py-2 text-xs font-medium">ID</TableHead>
                    <TableHead className="px-3 py-2 text-xs font-medium">User</TableHead>
                    <TableHead className="px-3 py-2 text-xs font-medium hidden sm:table-cell">Phone</TableHead>
                    <TableHead className="px-3 py-2 text-xs font-medium hidden md:table-cell">Document</TableHead>
                    <TableHead className="px-3 py-2 text-xs font-medium hidden lg:table-cell">Face</TableHead>
                    <TableHead className="px-3 py-2 text-xs font-medium">Status</TableHead>
                    <TableHead className="px-3 py-2 text-xs font-medium hidden sm:table-cell">Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id} className="transition-colors hover:bg-muted/40 cursor-pointer">
                      <TableCell className="px-3 py-2 font-mono text-xs font-medium">{task.id}</TableCell>
                      <TableCell className="px-3 py-2 text-xs font-medium">{task.user}</TableCell>
                      <TableCell className="px-3 py-2 text-xs hidden sm:table-cell">
                        {task.phoneVerified ? (
                          <span className="text-emerald-600 dark:text-emerald-400">Verified</span>
                        ) : (
                          <span className="text-muted-foreground">Pending</span>
                        )}
                      </TableCell>
                      <TableCell className="px-3 py-2 text-xs hidden md:table-cell">
                        <Badge variant={docStatusVariant(task.documentStatus)} className="text-[10px] h-5 px-1.5">{task.documentStatus}</Badge>
                      </TableCell>
                      <TableCell className="px-3 py-2 text-xs hidden lg:table-cell">
                        <span className={`${task.faceMatch >= 80 ? "text-emerald-600 dark:text-emerald-400" : task.faceMatch >= 50 ? "text-amber-600 dark:text-amber-400" : "text-destructive"} font-medium`}>
                          {task.faceMatch}%
                        </span>
                      </TableCell>
                      <TableCell className="px-3 py-2 text-xs">
                        <Badge variant={statusVariant(task.status)} className="text-[10px] h-5 px-1.5">{task.status}</Badge>
                      </TableCell>
                      <TableCell className="px-3 py-2 text-xs text-muted-foreground hidden sm:table-cell">{task.updatedAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution Pie Chart */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-1.5 pt-2.5 px-3">
            <CardTitle className="text-xs font-semibold text-foreground">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={55}
                    innerRadius={30}
                    label={false}
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={entry.name} fill={statusColors[index % statusColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-1 space-y-1">
              {statusDistribution.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: statusColors[index] }} />
                    <span className="text-muted-foreground">{entry.name}</span>
                  </div>
                  <span className="font-medium text-foreground">{entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
