"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  Dumbbell,
  Compass,
  BookMarked,
  TrendingUp,
  User,
  Settings,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useNavigation } from "./NavigationProvider";

const NAV_ITEMS = [
  {
    label: "Home",
    href: "/",
    icon: LayoutDashboard,
    description: "Command Center",
  },
  {
    label: "Create",
    href: "/create",
    icon: Sparkles,
    description: "Studio Workspace",
  },
  {
    label: "Train",
    href: "/train",
    icon: Dumbbell,
    description: "Exercises & Drills",
  },
  {
    label: "Discover",
    href: "/discover",
    icon: Compass,
    description: "Music & Study",
  },
  {
    label: "Reflect",
    href: "/reflect",
    icon: BookMarked,
    description: "Journal & Retrospective",
  },
  {
    label: "Progress",
    href: "/progress",
    icon: TrendingUp,
    description: "Analytics & Growth",
  },
];

interface SidebarProps {
  artistName?: string;
  currentFocus?: string;
}

export function Sidebar({ artistName = "HARRY / PRIME" }: SidebarProps) {
  const pathname = usePathname();
  const { openQuickCapture } = useNavigation();

  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 flex-col fixed inset-y-0 left-0 z-30 bg-prime-surface border-r border-prime-borderSubtle">
      {/* Brand Header */}
      <div className="p-5 pb-4 flex items-center justify-between border-b border-prime-borderSubtle/60">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-prime-gold to-prime-goldDark text-prime-bg font-black tracking-tighter text-base shadow-prime-glow-gold transition-transform group-hover:scale-105">
            P
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-wider text-base text-prime-text">
                PRIME
              </span>
              <span className="rounded bg-prime-gold/15 px-1.5 py-0.2 text-[9px] font-bold text-prime-gold font-mono tracking-normal">
                OS 1.0
              </span>
            </div>
            <p className="text-[10px] text-prime-textMuted uppercase tracking-widest font-mono">
              Artist Operating System
            </p>
          </div>
        </Link>
      </div>

      {/* Quick Capture Button */}
      <div className="px-4 pt-4 pb-2">
        <Button
          variant="gold"
          onClick={openQuickCapture}
          className="w-full justify-between shadow-prime-glow-gold h-10 font-semibold"
        >
          <span className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>CAPTURE</span>
          </span>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded bg-black/30 px-1.5 py-0.5 text-[10px] font-mono text-prime-bg/90">
            ⌘K
          </kbd>
        </Button>
      </div>

      {/* Primary Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        <div className="px-3 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-widest text-prime-textMuted/70 font-mono">
          System Core
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all group relative",
                isActive
                  ? "bg-prime-card text-prime-gold font-semibold shadow-prime-sm border border-prime-borderSubtle"
                  : "text-prime-textSecondary hover:bg-prime-card/50 hover:text-prime-text"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-prime-gold" />
              )}
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isActive
                      ? "text-prime-gold"
                      : "text-prime-textMuted group-hover:text-prime-text"
                  )}
                />
                <span>{item.label}</span>
              </div>
              <span className="text-[10px] text-prime-textMuted/60 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                {item.description}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Footer Profile & Settings */}
      <div className="p-3 border-t border-prime-borderSubtle space-y-1 bg-prime-surface/50">
        <Link
          href="/profile"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors group",
            pathname === "/profile"
              ? "bg-prime-card text-prime-gold border border-prime-borderSubtle"
              : "text-prime-textSecondary hover:bg-prime-card/50 hover:text-prime-text"
          )}
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-prime-border text-prime-gold font-bold text-xs shrink-0">
            <User className="h-3.5 w-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate font-semibold text-prime-text text-xs">
              {artistName}
            </p>
            <p className="truncate text-[10px] text-prime-textMuted">
              Artist DNA & Identity
            </p>
          </div>
        </Link>

        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors group",
            pathname === "/settings"
              ? "bg-prime-card text-prime-gold border border-prime-borderSubtle"
              : "text-prime-textSecondary hover:bg-prime-card/50 hover:text-prime-text"
          )}
        >
          <Settings className="h-4 w-4 text-prime-textMuted group-hover:text-prime-text shrink-0" />
          <span className="flex-1">Settings & Preferences</span>
        </Link>
      </div>
    </aside>
  );
}
