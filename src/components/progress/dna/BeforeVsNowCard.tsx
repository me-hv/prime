"use client";

import * as React from "react";
import { History, TrendingUp, Clock, Disc3, PenTool, Compass } from "lucide-react";
import { ArtistDNAData } from "@/lib/types";

interface BeforeVsNowCardProps {
  beforeVsNow: ArtistDNAData["beforeVsNow"];
}

export function BeforeVsNowCard({ beforeVsNow }: BeforeVsNowCardProps) {
  if (!beforeVsNow) return null;

  const { periodA, periodB, summary } = beforeVsNow;

  return (
    <div className="rounded-2xl border border-prime-borderSubtle bg-prime-card/90 p-5 sm:p-6 shadow-prime-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-prime-borderSubtle">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-prime-text uppercase flex items-center gap-2">
            <History className="h-4 w-4 text-emerald-400" />
            Before vs Now: 90-Day Evolution Comparison
          </h3>
          <p className="text-xs text-prime-textMuted mt-0.5">
            Clear comparison showing how your studio habits and creative velocity have changed.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Prior Window */}
        <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/70 p-4.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-prime-textMuted">
              {periodA.label} (Baseline)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="space-y-0.5">
              <span className="text-[10px] text-prime-textMuted uppercase flex items-center gap-1">
                <Clock className="h-3 w-3 text-orange-400" />
                Practice
              </span>
              <p className="font-bold text-prime-text">
                {periodA.practiceHours} hrs
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] text-prime-textMuted uppercase flex items-center gap-1">
                <Disc3 className="h-3 w-3 text-emerald-400" />
                Finished
              </span>
              <p className="font-bold text-prime-text">
                {periodA.finishedSongs} songs
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] text-prime-textMuted uppercase flex items-center gap-1">
                <PenTool className="h-3 w-3 text-amber-400" />
                Drafts
              </span>
              <p className="font-bold text-prime-text">
                {periodA.writingCount} writings
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] text-prime-textMuted uppercase flex items-center gap-1">
                <Compass className="h-3 w-3 text-sky-400" />
                Studies
              </span>
              <p className="font-bold text-prime-text">
                {periodA.studyCount} dissections
              </p>
            </div>
          </div>
        </div>

        {/* Current Window */}
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-950/15 p-4.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-emerald-400 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" />
              {periodB.label} (Current State)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="space-y-0.5">
              <span className="text-[10px] text-prime-textMuted uppercase flex items-center gap-1">
                <Clock className="h-3 w-3 text-orange-400" />
                Practice
              </span>
              <p className="font-bold text-emerald-300 text-sm">
                {periodB.practiceHours} hrs
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] text-prime-textMuted uppercase flex items-center gap-1">
                <Disc3 className="h-3 w-3 text-emerald-400" />
                Finished
              </span>
              <p className="font-bold text-emerald-300 text-sm">
                {periodB.finishedSongs} songs
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] text-prime-textMuted uppercase flex items-center gap-1">
                <PenTool className="h-3 w-3 text-amber-400" />
                Drafts
              </span>
              <p className="font-bold text-emerald-300 text-sm">
                {periodB.writingCount} writings
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] text-prime-textMuted uppercase flex items-center gap-1">
                <Compass className="h-3 w-3 text-sky-400" />
                Studies
              </span>
              <p className="font-bold text-emerald-300 text-sm">
                {periodB.studyCount} dissections
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/50 p-3.5 text-xs text-prime-textSecondary leading-relaxed">
        <span className="font-semibold text-prime-text">Summary: </span>
        {summary}
      </div>
    </div>
  );
}
