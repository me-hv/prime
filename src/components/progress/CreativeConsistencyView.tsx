"use client";

import * as React from "react";
import { Flame, CheckCircle2 } from "lucide-react";
import { ProgressOverviewData } from "@/lib/types";

interface CreativeConsistencyViewProps {
  overview: ProgressOverviewData;
}

export function CreativeConsistencyView({
  overview,
}: CreativeConsistencyViewProps) {
  const activePct =
    overview.totalPeriodDays > 0
      ? Math.round(
          (overview.activeCreativeDays / overview.totalPeriodDays) * 100
        )
      : 0;

  return (
    <div className="rounded-2xl border border-prime-borderSubtle bg-prime-card/90 p-5 sm:p-6 shadow-prime-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-prime-borderSubtle">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-prime-text uppercase flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-400" />
            Studio Consistency & Rhythm
          </h3>
          <p className="text-xs text-prime-textMuted mt-0.5">
            Grounded record of active days with verified creative sessions.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-prime-text font-bold">
            {overview.activeCreativeDays} of {overview.totalPeriodDays} Days
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20">
            {activePct}% Active
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-prime-surface/70 border border-prime-borderSubtle rounded-xl p-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-prime-text flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>
              Creative activity recorded on {overview.activeCreativeDays} days in this window.
            </span>
          </p>
          <p className="text-[11px] text-prime-textMuted">
            Current consecutive studio streak:{" "}
            <span className="text-orange-400 font-mono font-bold">
              {overview.currentStreak} days
            </span>
            .
          </p>
        </div>

        <div className="h-2 w-full sm:w-48 rounded-full bg-prime-surface overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-400 to-emerald-400 transition-all duration-500"
            style={{ width: `${Math.max(4, activePct)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
