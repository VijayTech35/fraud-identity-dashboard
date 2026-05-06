"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, FileText, LayoutDashboard, Menu, Moon, ScanFace, Settings, Shield, Sun, UserRound, UserRoundCheck } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const dark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      className="h-7 w-7 text-muted-foreground hover:bg-muted"
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      {dark ? <Sun size={14} /> : <Moon size={14} />}
    </Button>
  );
}

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/", label: "Users", icon: UserRound },
  { href: "/verification", label: "Verification", icon: ScanFace },
  { href: "/", label: "Activity Logs", icon: FileText },
  { href: "/", label: "Settings", icon: Settings },
];

function SidebarContent({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="mb-5 flex items-center gap-2 px-2 pt-1">
        <Shield className="h-5 w-5 text-primary" />
        <h1 className="text-sm font-bold tracking-tight">TrustGuard</h1>
      </div>
      <nav className="flex-1 space-y-0.5 px-2" aria-label="Main Navigation">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            (href === "/" && pathname === "/") ||
            (href !== "/" && pathname.startsWith(href));

          return (
            <Link
              key={href + label}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon size={14} />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pageName = pathname.startsWith("/verification")
    ? "Verification"
    : pathname === "/"
      ? "Dashboard"
      : "Ad Fraud";

  return (
    <div className="flex min-h-screen bg-muted/40 text-foreground">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-56 flex-col border-r border-border bg-card lg:flex">
        <SidebarContent />
      </aside>

      <div className="flex min-h-screen flex-1 flex-col lg:ml-56">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-12 items-center justify-between border-b border-border bg-background px-3 lg:px-4">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 lg:hidden">
                  <Menu size={15} />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-56 p-0">
                <SidebarContent className="p-4" />
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-1 text-xs">
              <span className="font-semibold text-muted-foreground">TrustGuard</span>
              <span className="text-muted-foreground">/</span>
              <span className="font-medium">{pageName}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" aria-label="Alerts" className="h-7 w-7 text-muted-foreground hover:bg-muted">
              <Bell size={14} />
            </Button>
            <ThemeToggle />
            <div className="ml-1 hidden items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1 sm:flex">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                <span className="text-[10px] font-semibold text-primary">A</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium">Admin</span>
                <ChevronDown size={12} className="text-muted-foreground" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-3 lg:p-4">{children}</main>
      </div>
    </div>
  );
}
