"use client";

import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { downloadCsv, downloadPdf } from "@/lib/export";
import { Calendar, CheckCircle, ChevronDown, ChevronUp, Clock, FileUp, Filter, Globe, MoreHorizontal, Search, Shield, Tag, TrendingDown, TrendingUp, UserCheck, UserRound, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FadeIn } from "@/components/ui/fade-in";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { toast } from "@/components/ui/toast";
import { Sparkline } from "@/components/ui/sparkline";

type VerificationTask = {
  id: string;
  user: string;
  phone: string;
  phoneVerified: boolean;
  documentStatus: "Pending" | "Passed" | "Failed";
  faceMatch: number;
  progress: number;
  status: "Verified" | "Pending" | "Failed";
  date: string;
  type: string;
};

const seed: VerificationTask[] = [
  { id: "VER-921", user: "Aanya Singh", phone: "+91 **** 4521", phoneVerified: true, documentStatus: "Passed", faceMatch: 96, progress: 100, status: "Verified", date: "2024-01-15", type: "Biometric" },
  { id: "VER-917", user: "Imran Khan", phone: "+91 **** 7832", phoneVerified: true, documentStatus: "Pending", faceMatch: 72, progress: 68, status: "Pending", date: "2024-01-15", type: "Document" },
  { id: "VER-910", user: "Ritika Shah", phone: "+91 **** 2190", phoneVerified: true, documentStatus: "Failed", faceMatch: 49, progress: 100, status: "Failed", date: "2024-01-14", type: "Biometric" },
  { id: "VER-901", user: "Nikhil Das", phone: "+91 **** 6543", phoneVerified: true, documentStatus: "Passed", faceMatch: 93, progress: 100, status: "Verified", date: "2024-01-14", type: "Phone" },
  { id: "VER-898", user: "Li Wei", phone: "+86 **** 1029", phoneVerified: false, documentStatus: "Pending", faceMatch: 0, progress: 22, status: "Pending", date: "2024-01-14", type: "Document" },
  { id: "VER-895", user: "Priya Patel", phone: "+91 **** 8876", phoneVerified: true, documentStatus: "Passed", faceMatch: 98, progress: 100, status: "Verified", date: "2024-01-13", type: "Biometric" },
];

const profile = {
  fullName: "Imran Khan",
  dob: "1996-04-12",
  address: "Mumbai, Maharashtra",
  nationalId: "IN-AX4-19F-72",
};

const statusDistribution = [
  { name: "Verified", value: 3 },
  { name: "Pending", value: 2 },
  { name: "Failed", value: 1 },
];

const statusColors = ["#10b981", "#f59e0b", "#ef4444"];

const successTrend = [
  { date: "Mon", rate: 68 },
  { date: "Tue", rate: 72 },
  { date: "Wed", rate: 65 },
  { date: "Thu", rate: 78 },
  { date: "Fri", rate: 82 },
  { date: "Sat", rate: 80 },
  { date: "Sun", rate: 85 },
];

const verificationKpis = [
  { label: "Success Rate", value: 67, suffix: "%", delta: "+5.2%", positive: true, color: "#10b981", icon: CheckCircle, sparkline: [62, 65, 68, 72, 65, 78, 67] },
  { label: "Total Verifications", value: 1247, delta: "+12.8%", positive: true, color: "#7da0fa", icon: UserCheck, sparkline: [980, 1050, 1120, 1080, 1150, 1200, 1247] },
  { label: "Avg Processing Time", value: 3.2, suffix: "min", delta: "-0.8min", positive: true, color: "#f59e0b", icon: Clock, sparkline: [4.1, 3.8, 3.5, 3.4, 3.3, 3.3, 3.2] },
  { label: "Failed Attempts", value: 42, delta: "-15%", positive: true, color: "#ef4444", icon: XCircle, sparkline: [58, 52, 48, 45, 44, 43, 42] },
];

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
    <div className="rounded-lg border bg-background/95 px-3 py-2 text-[11px] shadow-lg backdrop-blur-sm">
      <span className="font-semibold text-foreground">{payload[0].name}:</span> {payload[0].value}
    </div>
  );
};

const LineTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number; color: string; payload: { date: string } }[] }) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-lg border bg-background/95 px-3 py-2 text-[11px] shadow-lg backdrop-blur-sm">
      <p className="font-semibold text-foreground mb-1">{payload[0]?.payload?.date}</p>
      {payload.map((entry, i) => (
        <p key={i} className="flex items-center gap-2 py-0.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium">{entry.value}%</span>
        </p>
      ))}
    </div>
  );
};

export default function VerificationPage() {
  const [tasks, setTasks] = useState<VerificationTask[]>(seed);
  const [selectedUser, setSelectedUser] = useState<VerificationTask>(seed[1]);
  const [dateRange, setDateRange] = useState("7d");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTasks((prev) =>
        prev.map((task) =>
          task.status === "Pending"
            ? { ...task, progress: Math.min(100, task.progress + 4), status: task.progress >= 96 ? "Verified" : "Pending" }
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

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchesStatus = !statusFilter || t.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesType = !typeFilter || t.type.toLowerCase() === typeFilter.toLowerCase();
      const matchesSearch = !searchQuery || t.user.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesType && matchesSearch;
    });
  }, [tasks, statusFilter, typeFilter, searchQuery]);

  return (
    <section className="space-y-5">
      {/* Global Filter Bar */}
      <FadeIn delay={0}>
        <Card className="rounded-xl border border-border/60 bg-card">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-muted-foreground" />
                <span className="text-sm font-semibold">Global Filters</span>
              </div>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowFilters(!showFilters)}>
                {showFilters ? <ChevronUp size={14} className="transition-transform" /> : <ChevronDown size={14} className="transition-transform" />}
              </Button>
            </div>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? "max-h-24 opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 pt-2">
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground mb-0.5 block">Date Range</label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="h-8 text-xs rounded-lg bg-muted/20">
                      <Calendar size={12} className="mr-1.5 text-muted-foreground" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">Last 24 hours</SelectItem>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground mb-0.5 block">Search User</label>
                  <Input placeholder="Name or ID..." className="h-8 text-xs rounded-lg bg-muted/20" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground mb-0.5 block">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-8 text-xs rounded-lg bg-muted/20">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground mb-0.5 block">Verification Type</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="h-8 text-xs rounded-lg bg-muted/20">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="biometric">Biometric</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* KPI Cards */}
      <FadeIn delay={50}>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {verificationKpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.label} className="rounded-xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="rounded-lg p-2" style={{ backgroundColor: `${kpi.color}15` }}>
                        <Icon size={16} style={{ color: kpi.color }} />
                      </div>
                      <p className="text-[13px] font-medium text-muted-foreground">{kpi.label}</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold tracking-tight mb-1">
                    {kpi.suffix ? (
                      <AnimatedCounter target={kpi.value} decimals={kpi.value < 10 ? 1 : 0} suffix={kpi.suffix} />
                    ) : (
                      <AnimatedCounter target={kpi.value} />
                    )}
                  </p>
                  <div className="flex items-center gap-1">
                    {kpi.positive ? (
                      kpi.delta.startsWith("-") ? (
                        <>
                          <TrendingDown size={12} className="text-emerald-500" />
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{kpi.delta}</span>
                        </>
                      ) : (
                        <>
                          <TrendingUp size={12} className="text-emerald-500" />
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{kpi.delta}</span>
                        </>
                      )
                    ) : (
                      kpi.delta.startsWith("-") ? (
                        <>
                          <TrendingDown size={12} className="text-red-500" />
                          <span className="text-xs font-semibold text-red-600 dark:text-red-400">{kpi.delta}</span>
                        </>
                      ) : (
                        <>
                          <TrendingUp size={12} className="text-red-500" />
                          <span className="text-xs font-semibold text-red-600 dark:text-red-400">{kpi.delta}</span>
                        </>
                      )
                    )}
                    <span className="text-[10px] text-muted-foreground">vs last week</span>
                  </div>
                  <div className="mt-3 h-8 -mx-1">
                    <Sparkline data={kpi.sparkline} color={kpi.color} height={32} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </FadeIn>

      {/* Main Grid */}
      <div className="grid gap-3 xl:grid-cols-[1fr_320px]">
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          {/* Identity Scanning */}
          <FadeIn delay={100}>
            <Card className="rounded-xl border border-border/60 bg-card transition-all duration-300 hover:shadow-md">
              <CardHeader className="pb-2 pt-4 px-5">
                <CardTitle className="text-sm font-semibold tracking-tight">Identity Scanning & Verification</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-muted/30 flex items-center justify-center">
                        <span className="text-sm">📱</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Phone Number Verification</p>
                        <p className="text-[11px] text-muted-foreground">OTP-based validation</p>
                      </div>
                    </div>
                    <Badge variant="success" className="text-[11px] h-6 px-2.5 rounded-md font-semibold">
                      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                      Verified
                    </Badge>
                  </div>
                  <Progress value={87} className="h-2 rounded-full" />
                  <p className="text-[11px] text-muted-foreground -mt-3">87% completion rate</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-muted/30 flex items-center justify-center">
                        <span className="text-sm">📄</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Document Scan</p>
                        <p className="text-[11px] text-muted-foreground">OCR & authenticity check</p>
                      </div>
                    </div>
                    <Badge variant="warning" className="text-[11px] h-6 px-2.5 rounded-md font-semibold">
                      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 inline-block animate-pulse" />
                      Processing
                    </Badge>
                  </div>
                  <Progress value={62} className="h-2 rounded-full" />
                  <p className="text-[11px] text-muted-foreground -mt-3">62% OCR match rate</p>

                  <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-4 py-3">
                    <span className="text-sm text-muted-foreground">Upload ID Document</span>
                    <Button variant="outline" size="sm" className="h-8 px-3 text-xs rounded-lg transition-all duration-200 hover:bg-primary/5 hover:border-primary/30">
                      <FileUp size={13} className="mr-1.5" /> Upload
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Profile + Success Rate */}
          <FadeIn delay={150}>
            <div className="grid gap-3 lg:grid-cols-2">
              <Card className="rounded-xl border border-border/60 bg-card transition-all duration-300 hover:shadow-md">
                <CardHeader className="pb-2 pt-4 px-5">
                  <CardTitle className="text-sm font-semibold tracking-tight flex items-center gap-2">
                    <UserRound size={16} className="text-muted-foreground" />
                    User Profile Information
                    <Badge variant="outline" className="ml-auto text-[11px] h-6 px-2.5 rounded-md font-semibold">
                      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 inline-block animate-pulse" />
                      Verifying
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-4">
                  <dl className="space-y-2.5">
                    {[
                      { label: "Full Name", value: profile.fullName },
                      { label: "Date of Birth", value: profile.dob },
                      { label: "Address", value: profile.address },
                      { label: "National ID", value: profile.nationalId, mono: true },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
                        <dt className="text-[12px] text-muted-foreground">{item.label}</dt>
                        <dd className={`text-sm font-semibold ${item.mono ? "font-mono" : ""}`}>{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>

              <Card className="rounded-xl border border-border/60 bg-card transition-all duration-300 hover:shadow-md">
              <CardHeader className="pb-2 pt-4 px-5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-semibold tracking-tight">Verification Success Rate</CardTitle>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Trend analysis</p>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-muted-foreground">Success Rate</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-4">
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold tracking-tight">
                      <AnimatedCounter target={success} suffix="%" />
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Overall</p>
                  </div>
                  <div className="flex-1 space-y-1.5 text-xs">
                    {[
                      { label: "Verified", count: tasks.filter((t) => t.status === "Verified").length, color: "bg-emerald-500" },
                      { label: "Pending", count: tasks.filter((t) => t.status === "Pending").length, color: "bg-amber-500" },
                      { label: "Failed", count: tasks.filter((t) => t.status === "Failed").length, color: "bg-red-500" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${item.color}`} />
                          <span className="text-muted-foreground">{item.label}</span>
                        </div>
                        <span className="font-semibold">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={successTrend}>
                      <defs>
                        <linearGradient id="successGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="currentColor" strokeOpacity={0.2} />
                      <YAxis tick={{ fontSize: 11 }} stroke="currentColor" strokeOpacity={0.2} domain={[50, 100]} />
                      <Tooltip content={<LineTooltip />} />
                      <Area type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2.5} fill="url(#successGrad)" dot={false} activeDot={{ r: 5, strokeWidth: 2, fill: "#10b981" }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                </CardContent>
              </Card>
            </div>
          </FadeIn>

          {/* Verification History Table */}
          <FadeIn delay={200}>
            <Card className="rounded-xl border border-border/60 bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border/50 pb-3 pt-4 px-5">
                <div>
                  <CardTitle className="text-sm font-semibold tracking-tight">Verification History</CardTitle>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{filteredTasks.length} records found</p>
                </div>
                <div className="flex gap-1.5">
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs rounded-lg transition-all duration-200 hover:bg-primary/5 hover:border-primary/30" onClick={() => { downloadCsv(filteredTasks, "verification.csv"); toast("Verification data exported as CSV", "success"); }}>
                    <FileUp size={13} className="mr-1.5" /> Export CSV
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-lg transition-all duration-200 hover:bg-primary/5 hover:border-primary/30" onClick={() => { downloadPdf("Verification", ["Date", "User", "Type", "Status"], filteredTasks.map((r) => [r.date, r.user, r.type, r.status]), "verification.pdf"); toast("Verification report exported as PDF", "success"); }}>
                    <MoreHorizontal size={14} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/20 hover:bg-muted/20">
                        <TableHead className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Date</TableHead>
                        <TableHead className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">User / Phone</TableHead>
                        <TableHead className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Type</TableHead>
                        <TableHead className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</TableHead>
                        <TableHead className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTasks.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="py-12 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <Search size={32} className="text-muted-foreground/30" />
                              <p className="text-sm font-medium text-muted-foreground">No records match your filters</p>
                              <p className="text-xs text-muted-foreground">Try adjusting your filter criteria</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTasks.map((task, index) => (
                          <TableRow key={task.id} className={`transition-all duration-200 hover:bg-muted/20 cursor-pointer animate-[fadeInUp_0.4s_ease-out_both] ${task.id === selectedUser.id ? "bg-muted/10" : ""}`} style={{ animationDelay: `${index * 60}ms` }} onClick={() => setSelectedUser(task)}>
                            <TableCell className="px-4 py-3 text-sm text-muted-foreground">{task.date}</TableCell>
                            <TableCell className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted/60 ring-1 ring-border/50">
                                  <span className="text-[10px] font-semibold">{task.user.split(" ").map((n) => n[0]).join("")}</span>
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold truncate">{task.user}</p>
                                  <p className="text-[11px] text-muted-foreground">{task.phone}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-sm hidden sm:table-cell">{task.type}</TableCell>
                            <TableCell className="px-4 py-3">
                              <Badge variant={statusVariant(task.status) as "success" | "warning" | "destructive"} className="text-[11px] h-6 px-2.5 rounded-md font-semibold">
                                <span className={`mr-1.5 h-1.5 w-1.5 rounded-full inline-block ${task.status === "Verified" ? "bg-emerald-500" : task.status === "Pending" ? "bg-amber-500 animate-pulse" : "bg-red-500"}`} />
                                {task.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              <div className="flex gap-1.5">
                                <Button variant="outline" size="sm" className="h-7 px-2.5 text-[11px] rounded-md text-primary hover:bg-primary/10 transition-all duration-200 font-semibold">View</Button>
                                <Button variant="outline" size="sm" className="h-7 px-2.5 text-[11px] rounded-md text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50 hover:bg-red-500/10 hover:border-red-300 dark:hover:border-red-800 transition-all duration-200 font-semibold">Block</Button>
                                <Button variant="outline" size="sm" className="h-7 px-2.5 text-[11px] rounded-md text-primary hover:bg-primary/10 transition-all duration-200 font-semibold">Flag</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        {/* RIGHT SIDEBAR */}
        <FadeIn delay={150} direction="right">
          <div className="space-y-4">
            {/* Scan Results */}
            <Card className="rounded-xl border border-border/60 bg-card transition-all duration-300 hover:shadow-md">
              <CardHeader className="pb-2 pt-4 px-5">
                <CardTitle className="text-sm font-semibold tracking-tight flex items-center gap-2">
                  <UserCheck size={16} className="text-muted-foreground" />
                  Scan Results
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-4 space-y-3">
                {[
                  { label: "Phone Number Scan", value: 100, status: "Verified" as const, statusVariant: "success" as const },
                  { label: "ID Document Scan", value: selectedUser.documentStatus === "Passed" ? 100 : selectedUser.documentStatus === "Failed" ? 30 : 62, status: selectedUser.documentStatus, statusVariant: docStatusVariant(selectedUser.documentStatus) },
                  { label: "Face Match", value: selectedUser.faceMatch, status: `${selectedUser.faceMatch}%`, statusVariant: selectedUser.faceMatch >= 80 ? "success" : selectedUser.faceMatch >= 50 ? "warning" : "destructive" },
                ].map((scan) => (
                  <div key={scan.label} className="rounded-lg border border-border/50 bg-muted/15 p-3 transition-all duration-200 hover:bg-muted/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[12px] text-muted-foreground">{scan.label}</span>
                      <Badge variant={scan.statusVariant as "success" | "warning" | "destructive"} className="text-[10px] h-5 px-1.5 rounded-md font-semibold">
                        <span className={`mr-1 h-1.5 w-1.5 rounded-full inline-block ${scan.statusVariant === "success" ? "bg-emerald-500" : scan.statusVariant === "warning" ? "bg-amber-500" : "bg-red-500"}`} />
                        {scan.status}
                      </Badge>
                    </div>
                    <Progress value={scan.value} className="h-1.5 rounded-full" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Status Distribution */}
            <Card className="rounded-xl border border-border/60 bg-card transition-all duration-300 hover:shadow-md">
              <CardHeader className="pb-2 pt-4 px-5">
                <CardTitle className="text-sm font-semibold tracking-tight">User Status Distribution</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-4">
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statusDistribution} dataKey="value" nameKey="name" outerRadius={60} innerRadius={30}>
                        {statusDistribution.map((entry, index) => (
                          <Cell key={entry.name} fill={statusColors[index]} strokeWidth={3} stroke="var(--card)" />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 space-y-2">
                  {statusDistribution.map((entry, index) => (
                    <div key={entry.name} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: statusColors[index] }} />
                        <span className="text-[12px] text-muted-foreground">{entry.name}</span>
                      </div>
                      <span className="text-sm font-semibold">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
