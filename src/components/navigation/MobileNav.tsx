"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  Dumbbell,
  BookMarked,
  Plus,
  Compass,
  TrendingUp,
  User,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useNavigation } from "./NavigationProvider";

const BOTTOM_ITEMS = [
  { label: "Home", href: "/", icon: LayoutDashboard },
  { label: "Create", href: "/create", icon: Sparkles },
  { label: "Train", href: "/train", icon: Dumbbell },
  { label: "Reflect", href: "/reflect", icon: BookMarked },
  { label: "More", href: "#drawer", icon: Menu },
];

export function MobileNav({ artistName = "HARRY / PRIME" }: { artistName?: string }) {
  const pathname = usePathname();
  const { openQuickCapture, isMobileMenuOpen, setIsMobileMenuOpen } = useNavigation();

  return (
    <>
      {/* Top Mobile Bar */}
      <header className="md:hidden sticky top-0 z-40 flex h-14 items-center justify-between border-b border-prime-borderSubtle bg-prime-surface/95 px-4 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-prime-gold text-prime-bg font-black text-xs shadow-prime-glow-gold">
            P
          </div>
          <span className="font-bold text-sm tracking-wider text-prime-text">
            PRIME
          </span>
          <span className="rounded bg-prime-gold/15 px-1 py-0.2 text-[8px] font-bold text-prime-gold font-mono">
            OS
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="gold"
            size="sm"
            onClick={openQuickCapture}
            className="h-8 px-3 text-xs gap-1 font-semibold"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>CAPTURE</span>
          </Button>
          <Link href="/profile">
            <Button variant="ghost" size="iconSm" className="rounded-full text-prime-textSecondary">
              <User className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Bottom Mobile Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-prime-borderSubtle bg-prime-surface/95 px-2 backdrop-blur-md safe-area-bottom">
        {BOTTOM_ITEMS.map((item) => {
          const isMore = item.href === "#drawer";
          const isActive = !isMore && (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href));
          const Icon = item.icon;

          if (isMore) {
            return (
              <button
                key={item.label}
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex flex-col items-center justify-center py-1 px-2 text-prime-textMuted hover:text-prime-text transition-colors"
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium mt-1">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-2 transition-colors relative",
                isActive
                  ? "text-prime-gold font-semibold"
                  : "text-prime-textMuted hover:text-prime-text"
              )}
            >
              {isActive && (
                <div className="absolute -top-1 w-6 h-0.5 rounded-full bg-prime-gold" />
              )}
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium mt-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Full Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col bg-prime-bg/95 backdrop-blur-xl animate-fade-in p-6">
          <div className="flex items-center justify-between pb-6 border-b border-prime-borderSubtle">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-prime-gold text-prime-bg font-black text-sm">
                P
              </div>
              <div>
                <p className="font-bold text-sm text-prime-text">PRIME OS</p>
                <p className="text-[10px] text-prime-textMuted font-mono">Artist Command Drawer</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-prime-textMuted hover:text-prime-text"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto py-6 space-y-2">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl p-3 text-prime-text hover:bg-prime-card transition-colors"
            >
              <LayoutDashboard className="h-5 w-5 text-prime-gold" />
              <div>
                <p className="font-semibold text-sm">Home</p>
                <p className="text-xs text-prime-textMuted">Command Center</p>
              </div>
            </Link>
            <Link
              href="/create"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl p-3 text-prime-text hover:bg-prime-card transition-colors"
            >
              <Sparkles className="h-5 w-5 text-purple-400" />
              <div>
                <p className="font-semibold text-sm">Create</p>
                <p className="text-xs text-prime-textMuted">Writing, Music, Ideas & Projects</p>
              </div>
            </Link>
            <Link
              href="/train"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl p-3 text-prime-text hover:bg-prime-card transition-colors"
            >
              <Dumbbell className="h-5 w-5 text-orange-400" />
              <div>
                <p className="font-semibold text-sm">Train</p>
                <p className="text-xs text-prime-textMuted">Rap drills, Production & Cadence</p>
              </div>
            </Link>
            <Link
              href="/discover"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl p-3 text-prime-text hover:bg-prime-card transition-colors"
            >
              <Compass className="h-5 w-5 text-sky-400" />
              <div>
                <p className="font-semibold text-sm">Discover</p>
                <p className="text-xs text-prime-textMuted">Song analysis, Albums & Study</p>
              </div>
            </Link>
            <Link
              href="/reflect"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl p-3 text-prime-text hover:bg-prime-card transition-colors"
            >
              <BookMarked className="h-5 w-5 text-indigo-400" />
              <div>
                <p className="font-semibold text-sm">Reflect</p>
                <p className="text-xs text-prime-textMuted">Journal, Review & Letters</p>
              </div>
            </Link>
            <Link
              href="/progress"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl p-3 text-prime-text hover:bg-prime-card transition-colors"
            >
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="font-semibold text-sm">Progress</p>
                <p className="text-xs text-prime-textMuted">Creative Analytics & Stats</p>
              </div>
            </Link>
            <div className="pt-4 border-t border-prime-borderSubtle">
              <Link
                href="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl p-3 text-prime-text hover:bg-prime-card transition-colors"
              >
                <User className="h-5 w-5 text-prime-gold" />
                <div>
                  <p className="font-semibold text-sm">Artist Identity</p>
                  <p className="text-xs text-prime-textMuted">{artistName}</p>
                </div>
              </Link>
              <Link
                href="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl p-3 text-prime-text hover:bg-prime-card transition-colors"
              >
                <Settings className="h-5 w-5 text-prime-textSecondary" />
                <div>
                  <p className="font-semibold text-sm">Settings</p>
                  <p className="text-xs text-prime-textMuted">Preferences & Data Export</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
