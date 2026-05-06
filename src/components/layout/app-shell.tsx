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
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      className="h-8 w-8 text-muted-foreground hover:bg-muted"
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
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
      <div className="mb-4 flex items-center gap-2 px-1">
        <Shield className="h-5 w-5 text-primary" />
        <h1 className="text-sm font-semibold tracking-tight">TrustGuard</h1>
      </div>
      <nav className="space-y-0.5" aria-label="Main Navigation">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
              pathname.startsWith(href)
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon size={15} />
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
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="fixed top-0 left-0 z-50 hidden h-screen w-60 flex-col border-r border-border bg-card p-4 lg:flex">
        <SidebarContent />
      </aside>

      <div className="flex min-h-screen flex-1 flex-col lg:ml-60">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-12 items-center justify-between border-b border-border bg-background px-3 lg:px-5">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 lg:hidden">
                  <Menu size={16} />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-60 p-4">
                <SidebarContent />
              </SheetContent>
            </Sheet>

            <div className="hidden items-center gap-2 lg:flex">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold">TrustGuard</span>
              <span className="text-xs text-muted-foreground">/</span>
              <p className="text-xs font-medium truncate">
                {pathname.startsWith("/fraud") ? "Ad Fraud Detection" : pathname.startsWith("/verification") ? "Identity Verification" : "Dashboard"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" aria-label="Alerts" className="h-8 w-8 text-muted-foreground hover:bg-muted">
              <Bell size={15} />
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 p-3 lg:p-5">{children}</main>
      </div>
    </div>
  );
}
