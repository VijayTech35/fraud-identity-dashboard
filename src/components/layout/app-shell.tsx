"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, Moon, Shield, ShieldAlert, Sun, UserRoundCheck } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const dark = theme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      className="rounded-xl border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
}

const navItems = [
  { href: "/fraud", label: "Ad Fraud Detection", icon: ShieldAlert },
  { href: "/verification", label: "Identity Verification", icon: UserRoundCheck },
];

function SidebarContent() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-lg font-bold tracking-tight">TrustGuard</h1>
      </div>
      <p className="mb-6 text-xs text-muted-foreground">Security Intelligence</p>
      <nav className="space-y-1.5" aria-label="Main Navigation">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              pathname.startsWith(href)
                ? "bg-gradient-to-r from-[#4B49AC] to-[#7DA0FA] text-white shadow-lg shadow-indigo-500/30"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <Icon size={17} />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="dashboard-surface flex min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="glass-card hidden w-72 border-r border-border p-5 lg:block">
        <SidebarContent />
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        {/* Mobile Header + Desktop Header */}
        <header className="glass-card sticky top-0 z-40 mx-3 mt-3 flex items-center justify-between rounded-2xl border border-border px-4 py-3 lg:mx-8 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu size={18} />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-72 p-5">
                <SidebarContent />
              </SheetContent>
            </Sheet>

            {/* Desktop Logo */}
            <div className="hidden items-center gap-2 lg:flex">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold">TrustGuard</span>
            </div>

            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Operations Platform</p>
              <p className="truncate text-sm font-semibold sm:text-base lg:text-lg">Fraud & Identity Intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label="Alerts"
              className="rounded-xl border-[#98BDFF]/50 bg-[#98BDFF]/15 text-[#4B49AC] hover:bg-[#98BDFF]/25 dark:border-[#7DA0FA]/40 dark:bg-[#7DA0FA]/15 dark:text-[#98BDFF] dark:hover:bg-[#7DA0FA]/25"
            >
              <Bell size={17} />
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
