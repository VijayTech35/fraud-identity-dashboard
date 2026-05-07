"use client";

import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { downloadCsv, downloadPdf } from "@/lib/export";
import { AlertTriangle, BarChart3, Calendar, ChevronDown, ChevronUp, FileUp, Filter, Globe, MoreHorizontal, Search, Shield, Tag, TrendingDown, TrendingUp, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FadeIn } from "@/components/ui/fade-in";
import { Sparkline } from "@/components/ui/sparkline";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { confirm } from "@/components/ui/confirm-dialog";
import { toast } from "@/components/ui/toast";

type Incident = {
  id: string;
  campaign: string;
  source: string;
  dsp: string;
  risk: "High" | "Medium" | "Low";
  status: "New" | "Flagged" | "Blocked" | "Investigating";
  date: string;
};

const sparklineData = {
  fraudRate: [5.2, 4.8, 4.5, 4.9, 4.1, 3.9, 4.3],
  invalidTraffic: [980, 1050, 1120, 1080, 1150, 1200, 1200],
  revenueSaved: [120, 135, 148, 155, 168, 175, 184],
  incidents: [180, 210, 195, 240, 220, 200, 236],
};

const metrics = [
  { label: "Fraud Rate", value: 4.3, delta: "-0.8%", positive: true, sparkline: sparklineData.fraudRate, color: "#ef4444", type: "percent" as const, icon: AlertTriangle },
  { label: "Invalid Traffic", value: 1.2, delta: "+4.2%", positive: false, sparkline: sparklineData.invalidTraffic, color: "#7da0fa", type: "traffic" as const, icon: BarChart3 },
  { label: "Revenue Saved", value: 184, delta: "+12.1%", positive: true, sparkline: sparklineData.revenueSaved, color: "#10b981", type: "currency" as const, icon: Shield },
  { label: "Incidents Today", value: 236, delta: "18 critical", positive: false, sparkline: sparklineData.incidents, color: "#f59e0b", type: "number" as const, icon: Zap },
];
const trend = [
  { date: "Mon", fraudRate: 5.1, blocked: 1300 },
  { date: "Tue", fraudRate: 4.7, blocked: 1240 },
  { date: "Wed", fraudRate: 4.1, blocked: 1210 },
  { date: "Thu", fraudRate: 4.4, blocked: 1290 },
  { date: "Fri", fraudRate: 4.0, blocked: 1180 },
  { date: "Sat", fraudRate: 3.8, blocked: 1110 },
  { date: "Sun", fraudRate: 4.3, blocked: 1200 },
];
const distribution = [
  { name: "Bot Traffic", value: 38 },
  { name: "Click Injection", value: 22 },
  { name: "SDK Spoofing", value: 17 },
  { name: "Device Farms", value: 13 },
  { name: "Other", value: 10 },
];
const traffic = [
  { source: "Programmatic", clean: 8200, suspicious: 1100 },
  { source: "Affiliates", clean: 5300, suspicious: 1300 },
  { source: "Social", clean: 6100, suspicious: 700 },
  { source: "Search", clean: 7400, suspicious: 400 },
];
const colors = ["#1e293b", "#475569", "#64748b", "#94a3b8", "#cbd5e1"];
const hotspots = [
  { city: "New York", x: "38%", y: "40%", risk: "High" },
  { city: "London", x: "48%", y: "28%", risk: "Medium" },
  { city: "Mumbai", x: "62%", y: "52%", risk: "High" },
  { city: "Singapore", x: "72%", y: "58%", risk: "Low" },
];
const seed: Incident[] = [
  { id: "INC-3021", campaign: "Summer Install", source: "Affiliates", dsp: "TradeDesk", risk: "High", status: "New", date: "2024-01-15" },
  { id: "INC-3017", campaign: "Retargeting v5", source: "Programmatic", dsp: "DV360", risk: "Medium", status: "Investigating", date: "2024-01-15" },
  { id: "INC-2998", campaign: "Web Conversion", source: "Social", dsp: "Meta", risk: "Low", status: "Flagged", date: "2024-01-14" },
  { id: "INC-2982", campaign: "Gaming Push", source: "Affiliates", dsp: "Moloco", risk: "High", status: "Blocked", date: "2024-01-14" },
];

const riskColors: Record<Incident["risk"], string> = {
  High: "bg-red-500/10 text-red-600 dark:text-red-400",
  Medium: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  Low: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
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
          <span className="font-medium">{entry.value}</span>
        </p>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-lg border bg-background/95 px-3 py-2 text-[11px] shadow-lg backdrop-blur-sm">
      <span className="font-semibold text-foreground">{payload[0].name}:</span> {payload[0].value}%
    </div>
  );
};

const BarTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number; color: string; payload: { source: string } }[] }) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-lg border bg-background/95 px-3 py-2 text-[11px] shadow-lg backdrop-blur-sm">
      <p className="font-semibold text-foreground mb-1">{payload[0]?.payload?.source}</p>
      {payload.map((entry, i) => (
        <p key={i} className="flex items-center gap-2 py-0.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium">{entry.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

export default function FraudPage() {
  const [dateRange, setDateRange] = useState("7d");
  const [campaign, setCampaign] = useState("");
  const [source, setSource] = useState("");
  const [fraudType, setFraudType] = useState("");
  const [region, setRegion] = useState("");
  const [dsp, setDsp] = useState("");
  const [incidents, setIncidents] = useState(seed);
  const [lastUpdated, setLastUpdated] = useState(0);
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdated(prev => prev + 1);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const filtered = useMemo(
    () =>
      incidents.filter(
        (item) =>
          item.campaign.toLowerCase().includes(campaign.toLowerCase()) &&
          item.source.toLowerCase().includes(source.toLowerCase()) &&
          item.dsp.toLowerCase().includes(dsp.toLowerCase()),
      ),
    [incidents, campaign, source, dsp],
  );

  const mutate = async (id: string, status: Incident["status"]) => {
    const confirmed = await confirm({
      title: `${status} Incident`,
      message: `Are you sure you want to ${status.toLowerCase()} incident ${id}?`,
      confirmLabel: status,
      variant: status === "Blocked" ? "danger" : "default",
    });
    if (confirmed) {
      setIncidents((prev) => prev.map((row) => (row.id === id ? { ...row, status } : row)));
      toast(`Incident ${id} ${status.toLowerCase()} successfully`, status === "Blocked" ? "error" : "info");
    }
  };

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
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 pt-2">
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
                  <label className="text-[10px] font-medium text-muted-foreground mb-0.5 block">Campaign</label>
                  <Input placeholder="Search campaign" className="h-8 text-xs rounded-lg bg-muted/20" value={campaign} onChange={(e) => setCampaign(e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground mb-0.5 block">Traffic Source</label>
                  <Input placeholder="Search source" className="h-8 text-xs rounded-lg bg-muted/20" value={source} onChange={(e) => setSource(e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground mb-0.5 block">Fraud Type</label>
                  <Input placeholder="Bot, Injection..." className="h-8 text-xs rounded-lg bg-muted/20" value={fraudType} onChange={(e) => setFraudType(e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground mb-0.5 block">Region</label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger className="h-8 text-xs rounded-lg bg-muted/20">
                      <Globe size={12} className="mr-1.5 text-muted-foreground" />
                      <SelectValue placeholder="All regions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="in">India</SelectItem>
                      <SelectItem value="sg">Singapore</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground mb-0.5 block">DSP</label>
                  <Input placeholder="Filter DSP" className="h-8 text-xs rounded-lg bg-muted/20" value={dsp} onChange={(e) => setDsp(e.target.value)} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* KPI Cards */}
      <FadeIn delay={50}>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.label} className="rounded-xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="rounded-lg p-2" style={{ backgroundColor: `${metric.color}15` }}>
                        <Icon size={16} style={{ color: metric.color }} />
                      </div>
                      <p className="text-[13px] font-medium text-muted-foreground">{metric.label}</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold tracking-tight mb-1">
                    {metric.type === "percent" ? (
                      <AnimatedCounter target={metric.value} decimals={1} suffix="%" />
                    ) : metric.type === "currency" ? (
                      <AnimatedCounter target={metric.value} prefix="$" suffix="K" />
                    ) : metric.type === "traffic" ? (
                      <AnimatedCounter target={metric.value} suffix="M" decimals={1} />
                    ) : (
                      <AnimatedCounter target={metric.value} />
                    )}
                  </p>
                  <div className="flex items-center gap-1">
                    {metric.delta.startsWith("-") && !metric.delta.includes("critical") ? (
                      <>
                        <TrendingDown size={12} className="text-emerald-500" />
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{metric.delta}</span>
                      </>
                    ) : metric.delta.includes("critical") ? (
                      <>
                        <AlertTriangle size={12} className="text-amber-500" />
                        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">{metric.delta}</span>
                      </>
                    ) : (
                      <>
                        <TrendingUp size={12} className="text-red-500" />
                        <span className="text-xs font-semibold text-red-600 dark:text-red-400">{metric.delta}</span>
                      </>
                    )}
                    <span className="text-[10px] text-muted-foreground">vs last week</span>
                  </div>
                  <div className="mt-3 h-8 -mx-1">
                    <Sparkline data={metric.sparkline} color={metric.color} height={32} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </FadeIn>

      {/* Charts Grid */}
      <FadeIn delay={100}>
        <div className="grid gap-3 lg:grid-cols-2">
          {/* Fraud Trend */}
          <Card className="rounded-xl border border-border/60 bg-card transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-2 pt-4 px-5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold tracking-tight">Fraud Trend</CardTitle>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Updated {lastUpdated === 0 ? "2 mins" : `${lastUpdated} min${lastUpdated > 1 ? "s" : ""}`} ago</p>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="text-muted-foreground">Fraud Rate</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#7da0fa" }} />
                    <span className="text-muted-foreground">Blocked</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-4">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend}>
                    <defs>
                      <linearGradient id="fraudGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="blockedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7da0fa" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#7da0fa" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="currentColor" strokeOpacity={0.2} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="currentColor" strokeOpacity={0.2} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="currentColor" strokeOpacity={0.2} />
                    <Tooltip content={<LineTooltip />} />
                    <Area yAxisId="left" type="monotone" dataKey="fraudRate" stroke="#ef4444" strokeWidth={2.5} fill="url(#fraudGrad)" dot={false} activeDot={{ r: 5, strokeWidth: 2, fill: "#ef4444" }} />
                    <Area yAxisId="right" type="monotone" dataKey="blocked" stroke="#7da0fa" strokeWidth={2.5} fill="url(#blockedGrad)" dot={false} activeDot={{ r: 5, strokeWidth: 2, fill: "#7da0fa" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Fraud Distribution */}
          <Card className="rounded-xl border border-border/60 bg-card transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-sm font-semibold tracking-tight">Fraud Distribution</CardTitle>
              <p className="text-[11px] text-muted-foreground mt-0.5">By fraud type</p>
            </CardHeader>
            <CardContent className="px-5 pb-4">
              <div className="flex items-center gap-6">
                <div className="h-48 flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={distribution} dataKey="value" nameKey="name" outerRadius={70} innerRadius={40}>
                        {distribution.map((entry, index) => (
                          <Cell key={entry.name} fill={colors[index % colors.length]} strokeWidth={3} stroke="var(--card)" />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 text-xs">
                  {distribution.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                      <span className="text-muted-foreground">{entry.name}</span>
                      <span className="font-semibold ml-auto">{entry.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card className="rounded-xl border border-border/60 bg-card transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-sm font-semibold tracking-tight">Traffic Sources</CardTitle>
              <p className="text-[11px] text-muted-foreground mt-0.5">Clean vs suspicious traffic</p>
            </CardHeader>
            <CardContent className="px-5 pb-4">
              <div className="flex items-center gap-3 mb-3 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#7da0fa" }} />
                  <span className="text-muted-foreground">Clean</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-muted-foreground">Suspicious</span>
                </div>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={traffic} barGap={6}>
                    <XAxis dataKey="source" tick={{ fontSize: 11 }} stroke="currentColor" strokeOpacity={0.2} />
                    <YAxis tick={{ fontSize: 11 }} stroke="currentColor" strokeOpacity={0.2} />
                    <Tooltip content={<BarTooltip />} />
                    <Bar dataKey="clean" fill="#7da0fa" radius={[6, 6, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="suspicious" fill="#ef4444" radius={[6, 6, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Fraud Hotspots */}
          <Card className="rounded-xl border border-border/60 bg-card transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-sm font-semibold tracking-tight">Fraud Hotspots</CardTitle>
              <p className="text-[11px] text-muted-foreground mt-0.5">Geographic risk distribution</p>
            </CardHeader>
            <CardContent className="pt-0 px-5 pb-4">
              <div className="relative h-48 overflow-hidden rounded-lg border border-border/40 bg-slate-900/80">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_42%,#a3b3c8,transparent_26%),radial-gradient(circle_at_48%_30%,#71839d,transparent_22%),radial-gradient(circle_at_72%_45%,#9fb0c6,transparent_26%)] opacity-60" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
                {hotspots.map((spot) => (
                  <div key={spot.city} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: spot.x, top: spot.y }}>
                    <div className="relative group cursor-pointer">
                      <div className={`h-3 w-3 rounded-full ring-2 ${spot.risk === "High" ? "bg-rose-500 ring-rose-500/30" : spot.risk === "Medium" ? "bg-amber-500 ring-amber-500/30" : "bg-blue-500 ring-blue-500/30"}`} />
                      {spot.risk === "High" && <div className="absolute inset-0 h-3 w-3 rounded-full bg-rose-500 animate-ping opacity-30" />}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-md bg-black/80 text-[10px] font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        {spot.city} - {spot.risk} Risk
                      </div>
                    </div>
                    <p className="mt-1.5 text-[10px] font-medium text-slate-300 drop-shadow">{spot.city}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      {/* Incidents Table */}
      <FadeIn delay={200}>
        <Card className="rounded-xl border border-border/60 bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border/50 pb-3 pt-4 px-5">
            <div>
              <CardTitle className="text-sm font-semibold tracking-tight">Recent Fraud Incidents</CardTitle>
              <p className="text-[11px] text-muted-foreground mt-0.5">{filtered.length} incidents found</p>
            </div>
            <div className="flex gap-1.5">
              <Button variant="outline" size="sm" className="h-8 px-3 text-xs rounded-lg transition-all duration-200 hover:bg-primary/5 hover:border-primary/30" onClick={() => { downloadCsv(filtered, "fraud.csv"); toast("Fraud data exported as CSV", "success"); }}>
                <FileUp size={13} className="mr-1.5" /> Export CSV
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-lg transition-all duration-200 hover:bg-primary/5 hover:border-primary/30" onClick={() => { downloadPdf("Fraud Incidents", ["ID", "Campaign", "Source", "DSP", "Risk", "Status"], filtered.map((r) => [r.id, r.campaign, r.source, r.dsp, r.risk, r.status]), "fraud.pdf"); toast("Fraud report exported as PDF", "success"); }}>
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
                    <TableHead className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Incident</TableHead>
                    <TableHead className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Campaign</TableHead>
                    <TableHead className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Source</TableHead>
                    <TableHead className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">DSP</TableHead>
                    <TableHead className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Risk</TableHead>
                    <TableHead className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Status</TableHead>
                    <TableHead className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Search size={32} className="text-muted-foreground/30" />
                          <p className="text-sm font-medium text-muted-foreground">No incidents match your filters</p>
                          <p className="text-xs text-muted-foreground">Try adjusting your filter criteria</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((item, index) => (
                      <TableRow key={item.id} className="transition-all duration-200 hover:bg-muted/20 cursor-pointer animate-[fadeInUp_0.4s_ease-out_both]" style={{ animationDelay: `${index * 60}ms` }}>
                        <TableCell className="px-4 py-3 text-sm text-muted-foreground">{item.date}</TableCell>
                        <TableCell className="px-4 py-3 font-mono text-sm font-semibold">{item.id}</TableCell>
                        <TableCell className="px-4 py-3 text-sm">{item.campaign}</TableCell>
                        <TableCell className="px-4 py-3 text-sm hidden md:table-cell">{item.source}</TableCell>
                        <TableCell className="px-4 py-3 text-sm hidden lg:table-cell">{item.dsp}</TableCell>
                        <TableCell className="px-4 py-3">
                          <Badge variant="outline" className={riskColors[item.risk] + " text-[11px] h-6 px-2 rounded-md font-semibold"}>
                            <span className={`mr-1.5 h-1.5 w-1.5 rounded-full inline-block ${item.risk === "High" ? "bg-red-500 animate-pulse" : item.risk === "Medium" ? "bg-amber-500" : "bg-blue-500"}`} />
                            {item.risk}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm hidden sm:table-cell">{item.status}</TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="flex gap-1.5">
                            <Button variant="outline" size="sm" className="h-7 px-2.5 text-[11px] rounded-md text-primary hover:bg-primary/10 transition-all duration-200 font-semibold">View</Button>
                            <Button variant="outline" size="sm" className="h-7 px-2.5 text-[11px] rounded-md text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50 hover:bg-red-500/10 hover:border-red-300 dark:hover:border-red-800 transition-all duration-200 font-semibold" onClick={() => mutate(item.id, "Blocked")}>Block</Button>
                            <Button variant="outline" size="sm" className="h-7 px-2.5 text-[11px] rounded-md text-primary hover:bg-primary/10 transition-all duration-200 font-semibold" onClick={() => mutate(item.id, "Flagged")}>Flag</Button>
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
    </section>
  );
}
