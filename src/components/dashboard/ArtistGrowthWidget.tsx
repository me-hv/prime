"use client";

import * as React from "react";
import Link from "next/link";
import {
  TrendingUp,
  Target,
  ArrowRight,
  Disc3,
  Dna,
  Clock,
  Sparkles,
} from "lucide-react";
import { CurrentArtistFocusData, ProgressInsightItem } from "@/lib/types";

interface ArtistGrowthWidgetProps {
  currentFocus: CurrentArtistFocusData;
  topInsight: ProgressInsightItem | null;
  practiceMinutesThisWeek: number;
  streakDays: number;
  finishedSongsCount: number;
}

export function ArtistGrowthWidget({
  currentFocus,
  topInsight,
  practiceMinutesThisWeek,
  streakDays,
  finishedSongsCount,
}: ArtistGrowthWidgetProps) {
  return (
    <div className="rounded-2xl border border-prime-borderSubtle bg-gradient-to-br from-prime-card via-prime-surface to-prime-surface p-5 sm:p-6 shadow-prime-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-prime-borderSubtle">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-bold tracking-tight text-prime-text uppercase">
            Artist Growth & Focus
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/progress/artist-dna"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 text-[11px] font-mono font-bold transition-all"
          >
            <Dna className="h-3 w-3 text-purple-400" />
            <span>DNA</span>
          </Link>

          <Link
            href="/progress"
            className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>Progress Hub</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Focus Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-prime-surface/70 border border-emerald-500/20 rounded-xl p-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-2 py-0.2 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <Target className="h-2.5 w-2.5" />
              Primary Target
            </span>
            {currentFocus.supportingSkill && (
              <span className="text-[10px] text-prime-textMuted font-mono">
                Skill: {currentFocus.supportingSkill}
              </span>
            )}
          </div>
          <h4 className="font-bold text-sm text-prime-text">
            {currentFocus.title}
          </h4>
          <p className="text-xs text-prime-textSecondary line-clamp-1">
            {currentFocus.rationale}
          </p>
        </div>

        <Link
          href={currentFocus.recommendedActionHref}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs font-mono transition-all self-end sm:self-auto shrink-0 shadow-prime-sm"
        >
          <span>{currentFocus.recommendedActionLabel}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Footer Metrics & Top Insight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
        <div className="flex items-center gap-2.5 rounded-lg border border-prime-borderSubtle bg-prime-surface/50 p-3">
          <Clock className="h-4 w-4 text-orange-400 shrink-0" />
          <div className="font-mono">
            <p className="font-bold text-prime-text">
              {practiceMinutesThisWeek}m Drills
            </p>
            <p className="text-[10px] text-prime-textMuted">
              {streakDays}d streak active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-lg border border-prime-borderSubtle bg-prime-surface/50 p-3">
          <Disc3 className="h-4 w-4 text-emerald-400 shrink-0" />
          <div className="font-mono">
            <p className="font-bold text-prime-text">
              {finishedSongsCount} Finished Masters
            </p>
            <p className="text-[10px] text-prime-textMuted">Shipped catalog</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-lg border border-prime-borderSubtle bg-prime-surface/50 p-3">
          <Sparkles className="h-4 w-4 text-purple-400 shrink-0" />
          <div className="font-mono line-clamp-1">
            <p className="font-bold text-prime-text">
              {topInsight ? topInsight.title : "Pattern Engine Active"}
            </p>
            <p className="text-[10px] text-prime-textMuted line-clamp-1">
              {topInsight ? topInsight.observation : "Evidence tracking"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
