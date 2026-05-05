"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Moon, ShieldAlert, Sun, UserRoundCheck } from "lucide-react";
import { useTheme } from "next-themes";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      aria-label="Toggle theme"
      className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

const navItems = [
  { href: "/fraud", label: "Ad Fraud Detection", icon: ShieldAlert },
  { href: "/verification", label: "Identity Verification", icon: UserRoundCheck },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="dashboard-surface flex min-h-screen text-slate-900 dark:text-slate-100">
      <aside className="glass-card hidden w-72 border-r p-5 lg:block">
        <h1 className="mb-2 text-xl font-bold tracking-tight">TrustGuard Console</h1>
        <p className="mb-8 text-xs text-slate-500 dark:text-slate-400">Security Intelligence</p>
        <nav className="space-y-2" aria-label="Main Navigation">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                pathname.startsWith(href)
                  ? "bg-gradient-to-r from-[#4B49AC] to-[#7DA0FA] text-white shadow-lg shadow-indigo-500/30"
                  : "text-slate-700 hover:bg-white/70 dark:text-slate-300 dark:hover:bg-slate-800/70"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="glass-card sticky top-0 z-40 mx-3 mt-3 flex items-center justify-between rounded-2xl px-4 py-3 lg:mx-8 lg:px-8">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Operations Platform</p>
            <p className="text-lg font-semibold">Fraud & Identity Intelligence</p>
          </div>
          <div className="flex items-center gap-2">
            <button aria-label="Alerts" className="rounded-xl border border-[#98BDFF]/50 bg-[#98BDFF]/15 p-2 text-[#4B49AC] transition hover:-translate-y-0.5 hover:bg-[#98BDFF]/25 dark:border-[#7DA0FA]/40 dark:bg-[#7DA0FA]/15 dark:text-[#98BDFF]">
              <Bell size={17} />
            </button>
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
