"use client";

import * as React from "react";
import { WeeklyDayStat, ACTIVITY_CONFIGS } from "@/lib/types";
import { formatMinutes } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeeklyOverviewChartProps {
  stats: WeeklyDayStat[];
}

export function WeeklyOverviewChart({ stats }: WeeklyOverviewChartProps) {
  const days: WeeklyDayStat[] = Array.isArray(stats) ? stats : [];
  const maxMinutes = Math.max(60, ...days.map((d) => d.totalMinutes));
  const totalWeekMinutes = days.reduce((sum, d) => sum + d.totalMinutes, 0);
  const activeDaysCount = days.filter((d) => d.totalMinutes > 0).length;

  return (
    <div className="rounded-xl border border-prime-borderSubtle bg-prime-card/85 p-5 shadow-prime-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-prime-borderSubtle">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-prime-gold" />
            <h3 className="text-sm font-bold tracking-tight text-prime-text uppercase">
              Weekly Creative Cadence
            </h3>
          </div>
          <p className="text-xs text-prime-textSecondary mt-0.5">
            Actual time spent writing, producing, and developing the craft this week.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto font-mono text-xs">
          <span className="text-prime-textMuted">
            Active: <strong className="text-prime-text">{activeDaysCount}/7 days</strong>
          </span>
          <span className="text-prime-border">•</span>
          <span className="text-prime-gold font-bold">
            {formatMinutes(totalWeekMinutes)} total
          </span>
        </div>
      </div>

      {/* 7-Day Visual Bar Grid */}
      <div className="mt-5 grid grid-cols-7 gap-2 sm:gap-3 items-end h-44 pb-2">
        {days.map((day) => {
          const heightPercent = day.totalMinutes > 0
            ? Math.max(12, Math.round((day.totalMinutes / maxMinutes) * 100))
            : 4;

          const primaryConfig = day.primaryDiscipline
            ? ACTIVITY_CONFIGS[day.primaryDiscipline]
            : null;

          return (
            <div
              key={day.date}
              className="flex flex-col items-center justify-end h-full group relative"
            >
              {/* Tooltip on hover */}
              <div className="absolute -top-12 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-prime-surface border border-prime-border px-2.5 py-1.5 rounded-lg shadow-prime-md text-[10px] font-mono whitespace-nowrap">
                <p className="text-prime-text font-bold">{day.fullDayName}</p>
                <p className="text-prime-gold">{formatMinutes(day.totalMinutes)}</p>
                {primaryConfig && (
                  <p className="text-prime-textMuted">{primaryConfig.label}</p>
                )}
              </div>

              {/* Bar */}
              <div className="w-full flex items-end justify-center h-28">
                <div
                  className={cn(
                    "w-full max-w-[36px] rounded-t-md transition-all duration-500 relative",
                    day.totalMinutes > 0
                      ? day.isToday
                        ? "bg-gradient-to-t from-prime-goldDark to-prime-gold shadow-prime-glow-gold"
                        : "bg-prime-borderHighlight group-hover:bg-prime-gold/70"
                      : "bg-prime-surface border-t border-prime-borderSubtle"
                  )}
                  style={{ height: `${heightPercent}%` }}
                >
                  {day.isToday && (
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-prime-gold" />
                  )}
                </div>
              </div>

              {/* Day Label & Duration */}
              <div className="mt-2 text-center">
                <p
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wider font-mono",
                    day.isToday
                      ? "text-prime-gold"
                      : "text-prime-textSecondary group-hover:text-prime-text"
                  )}
                >
                  {day.dayLabel}
                </p>
                <p className="text-[10px] font-mono text-prime-textMuted mt-0.5">
                  {day.totalMinutes > 0 ? `${day.totalMinutes}m` : "—"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
