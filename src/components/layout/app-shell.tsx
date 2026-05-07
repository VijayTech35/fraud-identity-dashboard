"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, ChevronLeft, ChevronRight, FileText, LayoutDashboard, Mail, Menu, Moon, ScanFace, Settings, Shield, Sun, UserRound } from "lucide-react";
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
      className="h-8 w-8 text-muted-foreground/80 hover:bg-muted hover:text-foreground transition-all duration-200 rounded-lg"
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      {dark ? <Sun size={15} strokeWidth={1.8} /> : <Moon size={15} strokeWidth={1.8} />}
    </Button>
  );
}

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/", label: "Users", icon: UserRound },
  { href: "/verification", label: "Verification", icon: ScanFace },
  { href: "/fraud", label: "Fraud Detection", icon: FileText },
  { href: "/", label: "Settings", icon: Settings },
];

function SidebarNav({ collapsed, className }: { collapsed?: boolean; className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex-1 space-y-1 px-2", className)} aria-label="Main Navigation">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive =
          (href === "/" && pathname === "/") ||
          (href !== "/" && pathname.startsWith(href));

        return (
          <Link
            key={href + label}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
              isActive
                ? "bg-primary/10 text-primary shadow-sm"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            )}
            title={collapsed ? label : undefined}
          >
            <Icon size={18} strokeWidth={1.8} className={cn("shrink-0 transition-colors", isActive ? "text-primary" : "group-hover:text-foreground")} />
            {!collapsed && <span className="truncate">{label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const pageName = pathname.startsWith("/verification")
    ? "Identity Verification"
    : pathname.startsWith("/fraud")
      ? "Ad Fraud Detection"
      : "Dashboard";

  return (
    <div className="flex min-h-screen bg-muted/40 text-foreground">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 hidden flex-col border-r border-border/60 bg-card transition-all duration-300 lg:flex",
          sidebarCollapsed ? "w-16" : "w-56"
        )}
      >
        <div className={cn(
          "flex h-14 items-center border-b border-border/60",
          sidebarCollapsed ? "justify-center px-2" : "justify-between px-4"
        )}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-bold tracking-tight">TrustGuard</span>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-4 w-4 text-primary" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-7 w-7 text-muted-foreground/70 hover:text-foreground transition-all duration-200 rounded-lg", sidebarCollapsed ? "mx-auto" : "")}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </Button>
        </div>
        <div className="pt-3 flex-1 overflow-y-auto">
          <SidebarNav collapsed={sidebarCollapsed} />
        </div>
      </aside>

      <div className={cn("flex min-h-screen flex-1 flex-col transition-all duration-300", sidebarCollapsed ? "lg:ml-16" : "lg:ml-56")}>
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-md px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 lg:hidden rounded-lg">
                  <Menu size={16} strokeWidth={1.8} />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-56 p-0">
                <div className="flex h-14 items-center gap-2.5 px-4 border-b border-border">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-bold tracking-tight">TrustGuard</span>
                </div>
                <SidebarNav className="pt-3 px-2" />
              </SheetContent>
            </Sheet>

            <h1 className="text-sm font-semibold tracking-tight truncate">{pageName}</h1>
          </div>

          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/80 hover:bg-muted hover:text-foreground transition-all duration-200 rounded-lg">
              <Mail size={15} strokeWidth={1.8} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/80 hover:bg-muted hover:text-foreground transition-all duration-200 rounded-lg relative">
              <Bell size={15} strokeWidth={1.8} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
            </Button>
            <ThemeToggle />
            <div className="ml-2 flex items-center gap-2.5 pl-3 border-l border-border/50">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 ring-2 ring-primary/10">
                <span className="text-xs font-semibold text-primary">A</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium leading-none">Admin</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">admin@trustguard.io</p>
              </div>
              <ChevronDown size={13} strokeWidth={1.8} className="text-muted-foreground/60 hidden sm:inline" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-5">{children}</main>
      </div>
    </div>
  );
}
