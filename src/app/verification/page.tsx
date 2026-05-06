"use client";

import { useEffect, useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { downloadCsv, downloadPdf } from "@/lib/export";
import { CheckCircle2, ChevronDown, Download, MoreHorizontal, ScanFace, Smartphone, UserCheck, UserRound } from "lucide-react";
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
  { label: "Total Verifications", value: "1,284", delta: "+12 today", positive: true },
  { label: "Success Rate", value: "91.6%", delta: "+1.9%", positive: true },
  { label: "Avg Scan Time", value: "42s", delta: "-8s", positive: true },
  { label: "Pending Queue", value: "83", delta: "12 high-priority" },
];

const seed: VerificationTask[] = [
  { id: "VER-921", user: "Aanya Singh", phoneVerified: true, documentStatus: "Passed", faceMatch: 96, progress: 100, status: "Verified", updatedAt: "Just now" },
  { id: "VER-917", user: "Imran Khan", phoneVerified: true, documentStatus: "Pending", faceMatch: 72, progress: 68, status: "Pending", updatedAt: "3 mins ago" },
  { id: "VER-910", user: "Ritika Shah", phoneVerified: true, documentStatus: "Failed", faceMatch: 49, progress: 100, status: "Failed", updatedAt: "8 mins ago" },
  { id: "VER-901", user: "Nikhil Das", phoneVerified: true, documentStatus: "Passed", faceMatch: 93, progress: 100, status: "Verified", updatedAt: "15 mins ago" },
  { id: "VER-898", user: "Li Wei", phoneVerified: false, documentStatus: "Pending", faceMatch: 0, progress: 22, status: "Pending", updatedAt: "22 mins ago" },
  { id: "VER-895", user: "Priya Patel", phoneVerified: true, documentStatus: "Passed", faceMatch: 98, progress: 100, status: "Verified", updatedAt: "30 mins ago" },
];

const statusDistribution = [
  { name: "Verified", value: 3 },
  { name: "Pending", value: 2 },
  { name: "Failed", value: 1 },
];

const statusColors = ["#10b981", "#f59e0b", "#ef4444"];

const statusVariant = (status: VerificationTask["status"]): "success" | "warning" | "destructive" => {
  switch (status) {
    case "Verified": return "success";
    case "Pending": return "warning";
    case "Failed": return "destructive";
  }
};

const docStatusVariant = (status: VerificationTask["documentStatus"]): "success" | "warning" | "destructive" => {
  switch (status) {
    case "Passed": return "success";
    case "Pending": return "warning";
    case "Failed": return "destructive";
  }
};

const PieTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-md border border-border bg-background p-1.5 shadow-sm">
      <p className="text-[11px] font-medium text-foreground">{payload[0].name}</p>
      <p className="text-[11px] text-muted-foreground">{payload[0].value} users</p>
    </div>
  );
};

export default function VerificationPage() {
  const [tasks, setTasks] = useState<VerificationTask[]>(seed);
  const [selectedUser, setSelectedUser] = useState<VerificationTask>(seed[1]);

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

  useEffect(() => {
    const pending = tasks.find((t) => t.status === "Pending");
    if (pending) setSelectedUser(pending);
  }, [tasks]);

  return (
    <section className="space-y-3">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">Identity Verification</h2>
          <Badge variant="success" className="text-[10px] h-4.5">
            <CheckCircle2 size={10} className="mr-0.5" /> Active
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground">
            <Download size={11} className="mr-1" /> Export
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground">
            <MoreHorizontal size={11} />
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border-border">
            <CardContent className="p-2.5">
              <p className="text-[11px] text-muted-foreground">{metric.label}</p>
              <p className="mt-0.5 text-lg font-semibold">{metric.value}</p>
              <p className={`text-[10px] ${metric.positive ? "text-emerald-600" : "text-muted-foreground"}`}>{metric.delta}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-3 xl:grid-cols-[1fr_320px]">
        {/* LEFT MAIN CONTENT */}
        <div className="space-y-3 min-w-0">
          {/* Identity Scanning & Verification */}
          <Card className="border-border">
            <CardHeader className="pb-2 pt-2.5 px-3">
              <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                <ScanFace size={14} className="text-primary" /> Identity Scanning & Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="space-y-2.5">
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-muted-foreground">Phone Verification</span>
                    <span className="font-medium text-emerald-600">Active</span>
                  </div>
                  <Progress value={87} className="h-1.5" />
                  <p className="mt-0.5 text-[10px] text-muted-foreground">87% completion rate</p>
                </div>
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-muted-foreground">Document Scan</span>
                    <span className="font-medium text-amber-600">Processing</span>
                  </div>
                  <Progress value={62} className="h-1.5" />
                  <p className="mt-0.5 text-[10px] text-muted-foreground">62% OCR match rate</p>
                </div>
                <div className="rounded-md border border-border bg-muted/20 p-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Upload Document</span>
                    <Button variant="ghost" size="sm" className="h-5 px-2 text-[10px]">
                      <Download size={10} className="mr-1" /> Upload
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile + Success Rate Row */}
          <div className="grid gap-3 sm:grid-cols-2">
            {/* User Profile Information */}
            <Card className="border-border">
              <CardHeader className="pb-2 pt-2.5 px-3">
                <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                  <UserRound size={14} className="text-primary" /> User Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-xs font-semibold text-primary">
                      {selectedUser.user.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate">{selectedUser.user}</p>
                    <p className="text-[10px] text-muted-foreground">{selectedUser.id} &bull; {selectedUser.updatedAt}</p>
                  </div>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone</span>
                    <span className={`font-medium ${selectedUser.phoneVerified ? "text-emerald-600" : "text-amber-600"}`}>
                      {selectedUser.phoneVerified ? "Verified" : "Pending"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Document</span>
                    <span className="font-medium">{selectedUser.documentStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Face Match</span>
                    <span className={`font-medium ${selectedUser.faceMatch >= 80 ? "text-emerald-600" : selectedUser.faceMatch >= 50 ? "text-amber-600" : "text-destructive"}`}>
                      {selectedUser.faceMatch}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{selectedUser.progress}%</span>
                  </div>
                </div>
                <div className="mt-2">
                  <Progress value={selectedUser.progress} className="h-1" />
                </div>
              </CardContent>
            </Card>

            {/* Verification Success Rate */}
            <Card className="border-border">
              <CardHeader className="pb-2 pt-2.5 px-3">
                <CardTitle className="text-xs font-semibold">Verification Success Rate</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <div className="flex items-center justify-center py-2">
                  <div className="text-center">
                    <p className="text-3xl font-bold">{success}%</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Overall success</p>
                  </div>
                </div>
                <div className="mt-2 space-y-1 text-[11px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="text-muted-foreground">Verified</span>
                    </div>
                    <span className="font-medium">{tasks.filter((t) => t.status === "Verified").length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      <span className="text-muted-foreground">Pending</span>
                    </div>
                    <span className="font-medium">{tasks.filter((t) => t.status === "Pending").length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      <span className="text-muted-foreground">Failed</span>
                    </div>
                    <span className="font-medium">{tasks.filter((t) => t.status === "Failed").length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Verification History Table */}
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border pb-1.5 pt-2 px-3">
              <CardTitle className="text-xs font-semibold">Verification History</CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[10px] text-muted-foreground hover:text-foreground" onClick={() => downloadCsv(tasks, "verification-history.csv")}>
                  CSV
                </Button>
                <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[10px] text-muted-foreground hover:text-foreground" onClick={() => downloadPdf("Verification Logs", ["ID", "User", "Doc", "Face", "Progress", "Status"], tasks.map((r) => [r.id, r.user, r.documentStatus, `${r.faceMatch}%`, `${r.progress}%`, r.status]), "verification-history.pdf")}>
                  PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/20 hover:bg-muted/20">
                      <TableHead className="px-2 py-1.5 text-[11px] font-medium">ID</TableHead>
                      <TableHead className="px-2 py-1.5 text-[11px] font-medium">User</TableHead>
                      <TableHead className="px-2 py-1.5 text-[11px] font-medium hidden sm:table-cell">Phone</TableHead>
                      <TableHead className="px-2 py-1.5 text-[11px] font-medium hidden md:table-cell">Document</TableHead>
                      <TableHead className="px-2 py-1.5 text-[11px] font-medium hidden lg:table-cell">Face</TableHead>
                      <TableHead className="px-2 py-1.5 text-[11px] font-medium">Status</TableHead>
                      <TableHead className="px-2 py-1.5 text-[11px] font-medium">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task) => (
                      <TableRow key={task.id} className={`transition-colors hover:bg-muted/30 cursor-pointer ${task.id === selectedUser.id ? "bg-muted/20" : ""}`} onClick={() => setSelectedUser(task)}>
                        <TableCell className="px-2 py-1.5 font-mono text-[11px] font-medium">{task.id}</TableCell>
                        <TableCell className="px-2 py-1.5">
                          <div className="flex items-center gap-1.5">
                            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted">
                              <span className="text-[8px] font-semibold">{task.user.split(" ").map((n) => n[0]).join("")}</span>
                            </div>
                            <span className="text-[11px] font-medium truncate">{task.user}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-2 py-1.5 text-[11px] hidden sm:table-cell">
                          {task.phoneVerified ? (
                            <span className="text-emerald-600">Verified</span>
                          ) : (
                            <span className="text-muted-foreground">Pending</span>
                          )}
                        </TableCell>
                        <TableCell className="px-2 py-1.5 hidden md:table-cell">
                          <Badge variant={docStatusVariant(task.documentStatus)} className="text-[10px] h-4.5 px-1.5">{task.documentStatus}</Badge>
                        </TableCell>
                        <TableCell className="px-2 py-1.5 text-[11px] hidden lg:table-cell">
                          <span className={`font-medium ${task.faceMatch >= 80 ? "text-emerald-600" : task.faceMatch >= 50 ? "text-amber-600" : "text-destructive"}`}>{task.faceMatch}%</span>
                        </TableCell>
                        <TableCell className="px-2 py-1.5">
                          <Badge variant={statusVariant(task.status)} className="text-[10px] h-4.5 px-1.5">{task.status}</Badge>
                        </TableCell>
                        <TableCell className="px-2 py-1.5">
                          <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[10px] text-muted-foreground hover:text-foreground">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-3 min-w-0">
          {/* Scan Results */}
          <Card className="border-border">
            <CardHeader className="pb-2 pt-2.5 px-3">
              <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                <UserCheck size={14} className="text-primary" /> Scan Results
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md border border-border bg-muted/20 px-2.5 py-1.5">
                  <div className="flex items-center gap-2">
                    <Smartphone size={13} className="text-muted-foreground" />
                    <div>
                      <p className="text-[11px] text-muted-foreground">Phone Scan</p>
                      <p className="text-[11px] font-medium">{selectedUser.phoneVerified ? "Verified" : "Pending"}</p>
                    </div>
                  </div>
                  <Badge variant={selectedUser.phoneVerified ? "success" : "warning"} className="text-[9px] h-4 px-1">{selectedUser.phoneVerified ? "Pass" : "Pending"}</Badge>
                </div>
                <div className="flex items-center justify-between rounded-md border border-border bg-muted/20 px-2.5 py-1.5">
                  <div>
                    <p className="text-[11px] text-muted-foreground">ID Document</p>
                    <p className="text-[11px] font-medium">{selectedUser.documentStatus}</p>
                  </div>
                  <Badge variant={docStatusVariant(selectedUser.documentStatus)} className="text-[9px] h-4 px-1">{selectedUser.documentStatus}</Badge>
                </div>
                <div className="flex items-center justify-between rounded-md border border-border bg-muted/20 px-2.5 py-1.5">
                  <div>
                    <p className="text-[11px] text-muted-foreground">Face Match</p>
                    <p className="text-[11px] font-medium">{selectedUser.faceMatch}%</p>
                  </div>
                  <Badge variant={selectedUser.faceMatch >= 80 ? "success" : selectedUser.faceMatch >= 50 ? "warning" : "destructive"} className="text-[9px] h-4 px-1">
                    {selectedUser.faceMatch >= 80 ? "Match" : selectedUser.faceMatch >= 50 ? "Review" : "Fail"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Status Distribution */}
          <Card className="border-border">
            <CardHeader className="pb-1.5 pt-2.5 px-3">
              <CardTitle className="text-xs font-semibold">User Status Distribution</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={50}
                      innerRadius={25}
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={entry.name} fill={statusColors[index]} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-1 space-y-0.5 text-[11px]">
                {statusDistribution.map((entry, index) => (
                  <div key={entry.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: statusColors[index] }} />
                      <span className="text-muted-foreground">{entry.name}</span>
                    </div>
                    <span className="font-medium">{entry.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-border">
            <CardHeader className="pb-1.5 pt-2.5 px-3">
              <CardTitle className="text-xs font-semibold">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Scans</span>
                  <span className="font-medium">{tasks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Face Match</span>
                  <span className="font-medium">{Math.round(tasks.reduce((a, t) => a + t.faceMatch, 0) / tasks.length)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Progress</span>
                  <span className="font-medium">{Math.round(tasks.reduce((a, t) => a + t.progress, 0) / tasks.length)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Documents Passed</span>
                  <span className="font-medium">{tasks.filter((t) => t.documentStatus === "Passed").length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
