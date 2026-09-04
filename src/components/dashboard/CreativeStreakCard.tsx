"use client";

import * as React from "react";
import { Flame, CheckCircle2 } from "lucide-react";
import { DashboardStats } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CreativeStreakCardProps {
  stats: DashboardStats;
  matrix: { date: string; hasActivity: boolean; dayName: string; isToday: boolean }[];
}

export function CreativeStreakCard({ stats, matrix = [] }: CreativeStreakCardProps) {
  return (
    <div className="rounded-xl border border-prime-borderSubtle bg-prime-card/85 p-5 shadow-prime-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-prime-gold/15 text-prime-gold">
              <Flame className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-prime-gold font-mono">
              Creative Consistency
            </span>
          </div>

          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-mono border",
              stats.streakActiveToday
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-amber-500/30 bg-amber-500/10 text-amber-300"
            )}
          >
            {stats.streakActiveToday ? "Logged Today" : "Pending Today"}
          </span>
        </div>

        {/* Big Streak Number */}
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-prime-text font-mono tracking-tight">
              {stats.currentStreakDays}
            </span>
            <span className="text-sm font-bold uppercase tracking-wider text-prime-gold font-mono">
              {stats.currentStreakDays === 1 ? "Creative Day" : "Creative Days"}
            </span>
          </div>
          <p className="text-xs text-prime-textSecondary mt-1 leading-relaxed">
            Streaks represent verified days where you wrote, produced, studied, or practiced. No superficial check-ins.
          </p>
        </div>
      </div>

      {/* 14-Day Activity Matrix Visualization */}
      <div className="mt-5 pt-4 border-t border-prime-borderSubtle">
        <div className="flex items-center justify-between mb-2.5 text-[10px] font-mono text-prime-textMuted uppercase">
          <span>Past 14 Days</span>
          <span>{matrix.filter((m) => m.hasActivity).length} / 14 active</span>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5">
          {matrix.map((item) => (
            <div
              key={item.date}
              className="flex flex-col items-center gap-1 group relative"
            >
              <div
                className={cn(
                  "h-6 w-full rounded transition-all duration-200 flex items-center justify-center",
                  item.hasActivity
                    ? item.isToday
                      ? "bg-prime-gold text-prime-bg shadow-prime-glow-gold"
                      : "bg-prime-gold/70 text-prime-bg"
                    : "bg-prime-surface border border-prime-borderSubtle"
                )}
              >
                {item.hasActivity && (
                  <CheckCircle2 className="h-3 w-3 stroke-[3]" />
                )}
              </div>
              <span className="text-[9px] font-mono text-prime-textMuted/70">
                {item.dayName.slice(0, 2)}
              </span>

              {/* Tooltip */}
              <div className="absolute -top-7 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-prime-surface border border-prime-border px-1.5 py-0.5 rounded text-[9px] font-mono text-prime-text whitespace-nowrap">
                {item.date}: {item.hasActivity ? "Active" : "Rest"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
