"use client";

import { useMemo, useState } from "react";
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from "recharts";
import { downloadCsv, downloadPdf } from "@/lib/export";
import { AlertTriangle, Shield, TrendingUp, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Incident = {
  id: string;
  campaign: string;
  source: string;
  dsp: string;
  risk: "High" | "Medium" | "Low";
  status: "New" | "Flagged" | "Blocked" | "Investigating";
};

const metrics = [
  { label: "Fraud Rate", value: "4.3%", delta: "-0.8%", positive: true },
  { label: "Invalid Traffic", value: "1.2M", delta: "+4.2%" },
  { label: "Revenue Saved", value: "$184K", delta: "+12.1%", positive: true },
  { label: "Incidents Today", value: "236", delta: "18 critical" },
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
const colors = ["#0f172a", "#334155", "#64748b", "#94a3b8", "#cbd5e1"];
const hotspots = [
  { city: "New York", x: "38%", y: "40%", risk: "High" },
  { city: "London", x: "48%", y: "28%", risk: "Medium" },
  { city: "Mumbai", x: "62%", y: "52%", risk: "High" },
  { city: "Singapore", x: "72%", y: "58%", risk: "Low" },
];
const seed: Incident[] = [
  { id: "INC-3021", campaign: "Summer Install Boost", source: "Affiliates", dsp: "TradeDesk", risk: "High", status: "New" },
  { id: "INC-3017", campaign: "Retargeting v5", source: "Programmatic", dsp: "DV360", risk: "Medium", status: "Investigating" },
  { id: "INC-2998", campaign: "Web Conversion", source: "Social", dsp: "Meta", risk: "Low", status: "Flagged" },
  { id: "INC-2982", campaign: "Gaming Push", source: "Affiliates", dsp: "Moloco", risk: "High", status: "Blocked" },
];

const riskColors: Record<Incident["risk"], string> = {
  High: "bg-[#F3797E]/25 text-[#b4232f] dark:text-[#F3797E]",
  Medium: "bg-amber-500/25 text-amber-700 dark:text-amber-400",
  Low: "bg-[#7DA0FA]/25 text-[#4B49AC] dark:text-[#98BDFF]",
};

const LineTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number; color: string; payload: { date: string } }[] }) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-md border border-border bg-background p-2 shadow-md">
      <p className="text-xs font-medium text-foreground">{payload[0]?.payload?.date}</p>
      {payload.map((entry, i) => (
        <p key={i} className="flex items-center gap-2 text-xs">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium text-foreground">{entry.value}</span>
        </p>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-md border border-border bg-background p-2 shadow-md">
      <p className="text-xs font-medium text-foreground">{payload[0].name}</p>
      <p className="text-xs text-muted-foreground">Value: <span className="font-medium text-foreground">{payload[0].value}%</span></p>
    </div>
  );
};

const BarTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number; color: string; payload: { source: string } }[] }) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-md border border-border bg-background p-2 shadow-md">
      <p className="text-xs font-medium text-foreground">{payload[0]?.payload?.source}</p>
      {payload.map((entry, i) => (
        <p key={i} className="flex items-center gap-2 text-xs">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium text-foreground">{entry.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

export default function FraudPage() {
  const [dateRange, setDateRange] = useState("7d");
  const [campaign, setCampaign] = useState("");
  const [source, setSource] = useState("");
  const [dsp, setDsp] = useState("");
  const [incidents, setIncidents] = useState(seed);

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

  const mutate = (id: string, status: Incident["status"]) => {
    setIncidents((prev) => prev.map((row) => (row.id === id ? { ...row, status } : row)));
  };

  return (
    <section className="space-y-4 text-foreground">
      {/* Compact Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Shield size={20} className="text-primary" />
          <div>
            <h2 className="text-base font-semibold tracking-tight">Ad Fraud Detection</h2>
            <p className="text-xs text-muted-foreground">Traffic monitoring & campaign risk signals</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <TrendingUp size={12} className="mr-1" /> {dateRange}
          </Badge>
          <Badge variant="destructive" className="text-xs">
            <AlertTriangle size={12} className="mr-1" /> 18 critical
          </Badge>
          <span className="text-xs text-muted-foreground">{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-2.5">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger aria-label="Date range" className="bg-muted/30 h-7 text-xs">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Input aria-label="Campaign filter" placeholder="Campaign" className="bg-muted/30 h-7 text-xs" value={campaign} onChange={(e) => setCampaign(e.target.value)} />
            <Input aria-label="Traffic source filter" placeholder="Traffic source" className="bg-muted/30 h-7 text-xs" value={source} onChange={(e) => setSource(e.target.value)} />
            <Input aria-label="DSP filter" placeholder="DSP" className="bg-muted/30 h-7 text-xs" value={dsp} onChange={(e) => setDsp(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Metrics */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border-border shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{metric.label}</p>
                <div className="rounded-md bg-foreground/10 p-1.5">
                  <Zap size={12} className="text-foreground" />
                </div>
              </div>
              <p className="mt-1 text-xl font-semibold text-foreground">{metric.value}</p>
              <p className={`mt-0.5 text-[11px] ${metric.positive ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>{metric.delta}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-3 xl:grid-cols-2">
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-1 pt-2.5 px-3">
            <CardTitle className="text-xs font-semibold text-foreground">Fraud Trend</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend}>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                  <Tooltip content={<LineTooltip />} />
                  <Line yAxisId="left" type="monotone" dataKey="fraudRate" stroke="#F3797E" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="blocked" stroke="#4B49AC" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-1 pt-2.5 px-3">
            <CardTitle className="text-xs font-semibold text-foreground">Fraud Distribution</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={distribution} dataKey="value" nameKey="name" outerRadius={75} label={{ fontSize: 10 }}>
                    {distribution.map((entry, index) => (
                      <Cell key={entry.name} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-1 pt-2.5 px-3">
            <CardTitle className="text-xs font-semibold text-foreground">Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={traffic}>
                  <XAxis dataKey="source" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip content={<BarTooltip />} />
                  <Bar dataKey="clean" fill="#7DA0FA" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="suspicious" fill="#F3797E" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-1 pt-2.5 px-3">
            <CardTitle className="text-xs font-semibold text-foreground">Fraud Hotspots</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-3 pb-3">
            <div className="relative h-48 overflow-hidden rounded-lg border border-border bg-slate-900">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_42%,#a3b3c8,transparent_26%),radial-gradient(circle_at_48%_30%,#71839d,transparent_22%),radial-gradient(circle_at_72%_45%,#9fb0c6,transparent_26%)] opacity-80" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:32px_32px] opacity-30" />
              {hotspots.map((spot) => (
                <div key={spot.city} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: spot.x, top: spot.y }}>
                  <button
                    aria-label={`${spot.city} hotspot ${spot.risk} risk`}
                    title={`${spot.city} • ${spot.risk}`}
                    className="h-2.5 w-2.5 rounded-full bg-rose-500 ring-6 ring-rose-500/25 transition-all duration-200 hover:scale-125"
                  />
                  <p className="mt-0.5 text-[9px] font-medium text-rose-100">{spot.city}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Incidents Table */}
      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border pb-2 pt-2.5 px-3">
          <CardTitle className="text-xs font-semibold text-foreground">Fraud Incidents</CardTitle>
          <div className="flex gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => downloadCsv(filtered, "fraud-incidents.csv")}
            >
              Export CSV
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={() =>
                downloadPdf(
                  "Fraud Incidents",
                  ["ID", "Campaign", "Source", "DSP", "Risk", "Status"],
                  filtered.map((r) => [r.id, r.campaign, r.source, r.dsp, r.risk, r.status]),
                  "fraud-incidents.pdf",
                )
              }
            >
              Export PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="px-3 py-2 text-xs font-medium">Incident</TableHead>
                  <TableHead className="px-3 py-2 text-xs font-medium">Campaign</TableHead>
                  <TableHead className="px-3 py-2 text-xs font-medium hidden md:table-cell">Source</TableHead>
                  <TableHead className="px-3 py-2 text-xs font-medium hidden lg:table-cell">DSP</TableHead>
                  <TableHead className="px-3 py-2 text-xs font-medium">Risk</TableHead>
                  <TableHead className="px-3 py-2 text-xs font-medium hidden sm:table-cell">Status</TableHead>
                  <TableHead className="px-3 py-2 text-xs font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.id} className="transition-colors hover:bg-muted/40 cursor-pointer">
                    <TableCell className="px-3 py-2 font-mono text-xs font-medium">{item.id}</TableCell>
                    <TableCell className="px-3 py-2 text-xs">{item.campaign}</TableCell>
                    <TableCell className="px-3 py-2 text-xs hidden md:table-cell">{item.source}</TableCell>
                    <TableCell className="px-3 py-2 text-xs hidden lg:table-cell">{item.dsp}</TableCell>
                    <TableCell className="px-3 py-2">
                      <Badge variant="outline" className={riskColors[item.risk] + " text-[10px] h-5 px-1.5"}>
                        {item.risk}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-3 py-2 text-xs hidden sm:table-cell">{item.status}</TableCell>
                    <TableCell className="px-3 py-2">
                      <div className="flex flex-wrap gap-1">
                        <Button variant="outline" size="sm" className="h-6 px-2 text-[10px]" onClick={() => mutate(item.id, "Blocked")}>
                          Block
                        </Button>
                        <Button variant="outline" size="sm" className="h-6 px-2 text-[10px]" onClick={() => mutate(item.id, "Flagged")}>
                          Flag
                        </Button>
                        <Button variant="outline" size="sm" className="h-6 px-2 text-[10px]" onClick={() => mutate(item.id, "Investigating")}>
                          Investigate
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
