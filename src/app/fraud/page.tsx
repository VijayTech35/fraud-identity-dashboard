"use client";

import { useMemo, useState } from "react";
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from "recharts";
import { downloadCsv, downloadPdf } from "@/lib/export";
import { AlertTriangle, Shield, TrendingUp, Zap } from "lucide-react";

type Incident = {
  id: string;
  campaign: string;
  source: string;
  dsp: string;
  risk: "High" | "Medium" | "Low";
  status: "New" | "Flagged" | "Blocked" | "Investigating";
};

const metrics = [
  { label: "Fraud Rate", value: "4.3%", delta: "-0.8% vs last week", positive: true },
  { label: "Invalid Traffic", value: "1.2M", delta: "+4.2% traffic spike" },
  { label: "Revenue Saved", value: "$184K", delta: "+12.1% this month", positive: true },
  { label: "Incidents Today", value: "236", delta: "18 critical pending" },
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
    <section className="space-y-5 text-slate-900 dark:text-slate-100">
      <div className="glass-card relative overflow-hidden rounded-3xl p-6">
        <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-indigo-500/20 blur-2xl" />
        <div className="absolute -bottom-10 left-1/2 h-32 w-32 rounded-full bg-cyan-400/20 blur-2xl" />
        <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#98BDFF]/30 px-3 py-1 text-xs font-medium text-[#4B49AC] dark:bg-[#7DA0FA]/20 dark:text-[#98BDFF]">
            <Shield size={14} /> Threat Monitoring
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Ad Fraud Detection Dashboard</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">Monitor suspicious traffic, blocked incidents, and campaign risk signals.</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="inline-flex items-center gap-1 rounded-full bg-[#7DA0FA]/25 px-3 py-1 text-xs font-medium text-[#4B49AC] dark:bg-[#7DA0FA]/20 dark:text-[#98BDFF]"><TrendingUp size={14} /> Date range: {dateRange}</p>
          <p className="inline-flex items-center gap-1 rounded-full bg-[#F3797E]/25 px-3 py-1 text-xs font-medium text-[#b4232f] dark:bg-[#F3797E]/20 dark:text-[#F3797E]"><AlertTriangle size={14} /> 18 critical alerts</p>
        </div>
        </div>
      </div>

      <section className="glass-card grid gap-3 rounded-2xl p-4 md:grid-cols-4">
        <select aria-label="Date range" value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
        <input aria-label="Campaign filter" placeholder="Campaign" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" value={campaign} onChange={(e) => setCampaign(e.target.value)} />
        <input aria-label="Traffic source filter" placeholder="Traffic source" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" value={source} onChange={(e) => setSource(e.target.value)} />
        <input aria-label="DSP filter" placeholder="DSP" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" value={dsp} onChange={(e) => setDsp(e.target.value)} />
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.label} className="glass-card rounded-2xl p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-3 inline-flex rounded-lg bg-slate-900 p-2 text-white dark:bg-slate-100 dark:text-slate-900">
              <Zap size={14} />
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300">{metric.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{metric.value}</p>
            <p className={`mt-2 text-xs ${metric.positive ? "text-emerald-600" : "text-slate-500 dark:text-slate-400"}`}>{metric.delta}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="glass-card rounded-2xl p-4 shadow-sm">
          <h3 className="mb-1 text-sm font-semibold text-slate-900 dark:text-slate-100">Fraud Trend</h3>
          <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">Daily risk trend and blocked event volume</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="fraudRate" stroke="#F3797E" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="blocked" stroke="#4B49AC" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>
        <article className="glass-card rounded-2xl p-4 shadow-sm">
          <h3 className="mb-1 text-sm font-semibold text-slate-900 dark:text-slate-100">Fraud Distribution</h3>
          <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">Breakdown by detected fraud type</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distribution} dataKey="value" nameKey="name" outerRadius={100} label>
                  {distribution.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>
        <article className="glass-card rounded-2xl p-4 shadow-sm">
          <h3 className="mb-1 text-sm font-semibold text-slate-900 dark:text-slate-100">Traffic Sources</h3>
          <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">Clean vs suspicious sessions by source</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={traffic}>
                <XAxis dataKey="source" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="clean" fill="#7DA0FA" />
                <Bar dataKey="suspicious" fill="#F3797E" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
        <article className="glass-card rounded-2xl p-4 shadow-sm">
          <h3 className="mb-1 text-sm font-semibold text-slate-900 dark:text-slate-100">Fraud Hotspots</h3>
          <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">Geo signals from suspicious traffic clusters</p>
          <div className="relative h-72 overflow-hidden rounded-xl border border-slate-200 bg-slate-900 dark:border-slate-700">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_42%,#a3b3c8,transparent_26%),radial-gradient(circle_at_48%_30%,#71839d,transparent_22%),radial-gradient(circle_at_72%_45%,#9fb0c6,transparent_26%)] opacity-80" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:32px_32px] opacity-30" />
            {hotspots.map((spot) => (
              <div key={spot.city} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: spot.x, top: spot.y }}>
                <button
                  aria-label={`${spot.city} hotspot ${spot.risk} risk`}
                  title={`${spot.city} • ${spot.risk}`}
                  className="h-3.5 w-3.5 rounded-full bg-rose-500 ring-8 ring-rose-500/25 transition hover:scale-125"
                />
                <p className="mt-1 text-[10px] font-medium text-rose-100">{spot.city}</p>
              </div>
            ))}
          </div>
        </article>
      </div>

      <section className="glass-card overflow-hidden rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4 dark:border-slate-800">
          <h3 className="text-sm font-semibold">Fraud Incidents</h3>
          <div className="flex gap-2">
            <button className="rounded-lg border border-[#7978E9]/50 bg-[#7978E9]/15 px-3 py-1.5 text-sm text-[#4B49AC] transition hover:bg-[#7978E9]/25 dark:text-[#98BDFF]" onClick={() => downloadCsv(filtered, "fraud-incidents.csv")}>Export CSV</button>
            <button
              className="rounded-lg border border-[#98BDFF]/60 bg-[#98BDFF]/20 px-3 py-1.5 text-sm text-[#4B49AC] transition hover:bg-[#98BDFF]/30 dark:text-[#98BDFF]"
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
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3">Incident</th><th className="px-4 py-3">Campaign</th><th className="px-4 py-3">Source</th><th className="px-4 py-3">DSP</th><th className="px-4 py-3">Risk</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-t border-slate-100 transition hover:bg-slate-50/60 dark:border-slate-800 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-3">{item.id}</td><td className="px-4 py-3">{item.campaign}</td><td className="px-4 py-3">{item.source}</td><td className="px-4 py-3">{item.dsp}</td>
                  <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${item.risk === "High" ? "bg-[#F3797E]/25 text-[#b4232f] dark:text-[#F3797E]" : "bg-[#7DA0FA]/25 text-[#4B49AC] dark:text-[#98BDFF]"}`}>{item.risk}</span></td>
                  <td className="px-4 py-3">{item.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="rounded-md border px-2 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => mutate(item.id, "Blocked")}>Block</button>
                      <button className="rounded-md border px-2 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => mutate(item.id, "Flagged")}>Flag</button>
                      <button className="rounded-md border px-2 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => mutate(item.id, "Investigating")}>Investigate</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
