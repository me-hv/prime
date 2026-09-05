"use client";

import * as React from "react";
import {
  Clock,
  PenTool,
  Disc3,
  Compass,
  Flame,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
} from "lucide-react";
import { ProgressOverviewData, TIME_RANGE_CONFIGS } from "@/lib/types";
import { formatMinutes } from "@/lib/utils";

interface ArtistGrowthOverviewProps {
  overview: ProgressOverviewData;
}

export function ArtistGrowthOverview({ overview }: ArtistGrowthOverviewProps) {
  const periodConfig =
    TIME_RANGE_CONFIGS[overview.period] || TIME_RANGE_CONFIGS["30D"];

  const renderDelta = (delta: number | null) => {
    if (delta === null) return null;
    if (delta > 0) {
      return (
        <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
          <TrendingUp className="h-2.5 w-2.5" />+{delta}%
        </span>
      );
    }
    if (delta < 0) {
      return (
        <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.2 rounded border border-rose-500/20">
          <TrendingDown className="h-2.5 w-2.5" />
          {delta}%
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold text-zinc-400 bg-zinc-500/10 px-1.5 py-0.2 rounded border border-zinc-500/20">
        <Minus className="h-2.5 w-2.5" />
        0%
      </span>
    );
  };

  const getMomentumBadge = () => {
    switch (overview.creativeMomentum) {
      case "HIGH":
        return {
          label: "High Momentum",
          class:
            "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
          icon: Zap,
        };
      case "STEADY":
        return {
          label: "Steady Discipline",
          class: "bg-sky-500/15 text-sky-300 border-sky-500/30",
          icon: Sparkles,
        };
      case "REBUILDING":
        return {
          label: "Rebuilding Rhythm",
          class: "bg-amber-500/15 text-amber-300 border-amber-500/30",
          icon: Clock,
        };
      default:
        return {
          label: "Baseline Forming",
          class: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
          icon: Minus,
        };
    }
  };

  const momentum = getMomentumBadge();
  const MomentumIcon = momentum.icon;

  return (
    <div className="space-y-4">
      {/* Overview Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-prime-surface/60 border border-prime-borderSubtle rounded-xl p-3.5 px-4.5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-prime-textMuted">
              Growth Trajectory ({periodConfig.label})
            </span>
            <p className="text-xs text-prime-text font-medium">
              Studio activity observed across practice, writing, and analytical study.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase border ${momentum.class}`}
          >
            <MomentumIcon className="h-3 w-3" />
            {momentum.label}
          </span>
        </div>
      </div>

      {/* 6 High-Level Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Practice Volume */}
        <div className="rounded-xl border border-prime-borderSubtle bg-prime-card/85 p-3.5 space-y-1.5 shadow-prime-xs hover:border-orange-500/30 transition-all">
          <div className="flex items-center justify-between text-[11px] font-mono text-prime-textMuted uppercase">
            <span className="flex items-center gap-1.5 text-orange-400">
              <Clock className="h-3.5 w-3.5" />
              Practice
            </span>
            {renderDelta(overview.practiceMinutesDeltaPct)}
          </div>
          <p className="text-xl sm:text-2xl font-black text-prime-text font-mono tracking-tight">
            {formatMinutes(overview.practiceMinutes)}
          </p>
          <p className="text-[11px] text-prime-textMuted">
            {overview.practiceSessionsCount} drills logged
          </p>
        </div>

        {/* 2. Lyrical Output */}
        <div className="rounded-xl border border-prime-borderSubtle bg-prime-card/85 p-3.5 space-y-1.5 shadow-prime-xs hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-[11px] font-mono text-prime-textMuted uppercase">
            <span className="flex items-center gap-1.5 text-amber-400">
              <PenTool className="h-3.5 w-3.5" />
              Writing
            </span>
            {renderDelta(overview.wordsWrittenDeltaPct)}
          </div>
          <p className="text-xl sm:text-2xl font-black text-prime-text font-mono tracking-tight">
            {overview.wordsWritten.toLocaleString()}{" "}
            <span className="text-xs text-prime-textMuted">w</span>
          </p>
          <p className="text-[11px] text-prime-textMuted">
            {overview.writingSessionsCount} draft documents
          </p>
        </div>

        {/* 3. Catalog & Songs */}
        <div className="rounded-xl border border-prime-borderSubtle bg-prime-card/85 p-3.5 space-y-1.5 shadow-prime-xs hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-[11px] font-mono text-prime-textMuted uppercase">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Disc3 className="h-3.5 w-3.5" />
              Finished
            </span>
            <span className="text-[10px] text-emerald-400 font-bold font-mono">
              {overview.songsStartedCount > 0
                ? `${Math.round(
                    (overview.songsFinishedCount / overview.songsStartedCount) *
                      100
                  )}%`
                : "—"}
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-prime-text font-mono tracking-tight">
            {overview.songsFinishedCount}{" "}
            <span className="text-xs text-prime-textMuted font-normal">
              / {overview.songsStartedCount} started
            </span>
          </p>
          <p className="text-[11px] text-prime-textMuted">
            {overview.songsProgressedCount} active updates
          </p>
        </div>

        {/* 4. Study Dissections */}
        <div className="rounded-xl border border-prime-borderSubtle bg-prime-card/85 p-3.5 space-y-1.5 shadow-prime-xs hover:border-sky-500/30 transition-all">
          <div className="flex items-center justify-between text-[11px] font-mono text-prime-textMuted uppercase">
            <span className="flex items-center gap-1.5 text-sky-400">
              <Compass className="h-3.5 w-3.5" />
              Study
            </span>
            {renderDelta(overview.studiesDeltaPct)}
          </div>
          <p className="text-xl sm:text-2xl font-black text-prime-text font-mono tracking-tight">
            {overview.studiesCompletedCount}
          </p>
          <p className="text-[11px] text-prime-textMuted">Track dissections</p>
        </div>

        {/* 5. Studio Consistency */}
        <div className="rounded-xl border border-prime-borderSubtle bg-prime-card/85 p-3.5 space-y-1.5 shadow-prime-xs hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between text-[11px] font-mono text-prime-textMuted uppercase">
            <span className="flex items-center gap-1.5 text-indigo-400">
              <Flame className="h-3.5 w-3.5" />
              Consistency
            </span>
            <span className="text-[10px] text-indigo-300 font-bold font-mono">
              {overview.currentStreak}d streak
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-prime-text font-mono tracking-tight">
            {overview.activeCreativeDays}{" "}
            <span className="text-xs text-prime-textMuted font-normal">
              / {overview.totalPeriodDays}d
            </span>
          </p>
          <p className="text-[11px] text-prime-textMuted">Active studio days</p>
        </div>

        {/* 6. Breakthroughs */}
        <div className="rounded-xl border border-prime-borderSubtle bg-prime-card/85 p-3.5 space-y-1.5 shadow-prime-xs hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between text-[11px] font-mono text-prime-textMuted uppercase">
            <span className="flex items-center gap-1.5 text-purple-400">
              <Sparkles className="h-3.5 w-3.5" />
              Epiphanies
            </span>
            <span className="text-[10px] text-purple-300 font-bold font-mono">
              Vault
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-prime-text font-mono tracking-tight">
            {overview.breakthroughsCount}
          </p>
          <p className="text-[11px] text-prime-textMuted">
            Recorded breakthroughs
          </p>
        </div>
      </div>
    </div>
  );
}
