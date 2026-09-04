"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { formatReadableDate, getGreeting } from "@/lib/utils";
import { Flame, Clock } from "lucide-react";
import { DashboardStats } from "@/lib/types";

interface DashboardHeaderProps {
  displayName?: string;
  stats?: DashboardStats;
}

export function DashboardHeader({ displayName = "Artist", stats }: DashboardHeaderProps) {
  const [greeting, setGreeting] = useState("GOOD DAY");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    setGreeting(getGreeting());
    setDateStr(formatReadableDate(new Date()));
  }, []);

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-prime-borderSubtle">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-block h-2 w-2 rounded-full bg-prime-gold animate-pulse-subtle" />
          <p className="text-xs font-mono uppercase tracking-widest text-prime-gold">
            {dateStr || "Today"}
          </p>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-prime-text">
          {greeting}, <span className="text-prime-textSecondary">{displayName}</span>.
        </h1>
        <p className="text-xs sm:text-sm text-prime-textMuted mt-0.5">
          Execute today&apos;s mission. Build the craft. Ship the work.
        </p>
      </div>

      {stats && (
        <div className="flex items-center gap-3 bg-prime-card/60 border border-prime-borderSubtle rounded-xl px-4 py-2 self-start md:self-auto shadow-prime-sm">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-prime-gold" />
            <div>
              <p className="text-[10px] text-prime-textMuted uppercase font-mono">Streak</p>
              <p className="text-xs font-bold text-prime-text font-mono">
                {stats.currentStreakDays} {stats.currentStreakDays === 1 ? "DAY" : "DAYS"}
              </p>
            </div>
          </div>
          <div className="h-6 w-px bg-prime-border" />
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-sky-400" />
            <div>
              <p className="text-[10px] text-prime-textMuted uppercase font-mono">This Week</p>
              <p className="text-xs font-bold text-prime-text font-mono">
                {Math.round(stats.totalCreativeMinutesWeek / 60)}h {stats.totalCreativeMinutesWeek % 60}m
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
