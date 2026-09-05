"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Disc3,
  Clock,
  AlertTriangle,
  ArrowRight,
  Layers,
} from "lucide-react";
import { FinishingHealthData } from "@/lib/types";

interface FinishingHealthViewProps {
  health: FinishingHealthData;
}

export function FinishingHealthView({ health }: FinishingHealthViewProps) {
  return (
    <div className="space-y-6">
      {/* Overview & Completion Ratio Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="rounded-xl border border-prime-borderSubtle bg-prime-card/85 p-4 space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase text-prime-textMuted">
            <Disc3 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Finished Catalog</span>
          </div>
          <p className="text-2xl font-black text-prime-text font-mono">
            {health.totalFinished}{" "}
            <span className="text-xs text-prime-textMuted font-normal">
              / {health.totalCreated} total
            </span>
          </p>
          <p className="text-[11px] text-prime-textMuted">
            {health.totalActive} active in pipeline
          </p>
        </div>

        <div className="rounded-xl border border-prime-borderSubtle bg-prime-card/85 p-4 space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase text-prime-textMuted">
            <CheckCircle2 className="h-3.5 w-3.5 text-sky-400" />
            <span>Completion Ratio</span>
          </div>
          <p className="text-2xl font-black text-prime-text font-mono">
            {health.completionRatioPct}%
          </p>
          <p className="text-[11px] text-prime-textMuted">
            Creation-to-finish conversion
          </p>
        </div>

        <div className="rounded-xl border border-prime-borderSubtle bg-prime-card/85 p-4 space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase text-prime-textMuted">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            <span>Avg Days to Finish</span>
          </div>
          <p className="text-2xl font-black text-prime-text font-mono">
            {health.avgDaysToFinish !== null ? `${health.avgDaysToFinish}d` : "—"}
          </p>
          <p className="text-[11px] text-prime-textMuted">
            From initial idea to finished master
          </p>
        </div>

        <div className="rounded-xl border border-prime-borderSubtle bg-prime-card/85 p-4 space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase text-prime-textMuted">
            <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
            <span>Stalled Projects</span>
          </div>
          <p className="text-2xl font-black text-prime-text font-mono">
            {health.stalledSongsCount}
          </p>
          <p className="text-[11px] text-rose-400 font-semibold">
            {health.stalledSongsCount > 0 ? "Zero edits in 14+ days" : "Pipeline moving"}
          </p>
        </div>
      </div>

      {/* Visual Finishing Funnel */}
      <div className="rounded-2xl border border-prime-borderSubtle bg-prime-card/90 p-5 sm:p-6 shadow-prime-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold tracking-tight text-prime-text uppercase flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-400" />
              Song Finishing Pipeline Funnel
            </h3>
            <p className="text-xs text-prime-textMuted mt-0.5">
              Current distribution of songs across creative stages.
            </p>
          </div>
        </div>

        {/* Funnel Stage Bars */}
        <div className="space-y-2.5 pt-2">
          {health.funnelDistribution.map((stage) => {
            const isFinished = stage.status === "FINISHED";
            const barColor = isFinished ? "bg-emerald-400" : "bg-sky-500/80";

            return (
              <div key={stage.status} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold text-prime-text">
                    {stage.label}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-prime-text font-bold">
                      {stage.count} {stage.count === 1 ? "track" : "tracks"}
                    </span>
                    <span className="text-prime-textMuted w-10 text-right">
                      {stage.percentage}%
                    </span>
                  </div>
                </div>

                <div className="h-2 w-full rounded-full bg-prime-surface overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${Math.max(2, stage.percentage)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stalled Songs Audit */}
      <div className="rounded-2xl border border-prime-borderSubtle bg-prime-card/90 p-5 sm:p-6 shadow-prime-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold tracking-tight text-prime-text uppercase flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-400" />
              Stalled Song Audit & Action Panel
            </h3>
            <p className="text-xs text-prime-textMuted mt-0.5">
              Active projects requiring attention or decisive archival to maintain momentum.
            </p>
          </div>
          <span className="text-xs font-mono text-prime-textMuted">
            {health.stalledSongs.length} stalled
          </span>
        </div>

        {health.stalledSongs.length === 0 ? (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center space-y-1">
            <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
            <p className="text-xs font-bold text-emerald-300">
              Zero Stalled Songs Detected
            </p>
            <p className="text-[11px] text-prime-textMuted">
              All active song projects have been touched or updated within the last 14 days.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-prime-borderSubtle/50">
            {health.stalledSongs.map((song) => (
              <div
                key={song.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/create/songs/${song.id}`}
                      className="font-bold text-sm text-prime-text hover:text-emerald-400 transition-colors"
                    >
                      {song.title}
                    </Link>
                    <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                      {song.daysInactive} days inactive
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-prime-surface border border-prime-borderSubtle text-prime-textSecondary">
                      Stage: {song.status}
                    </span>
                  </div>
                  <p className="text-xs text-prime-textMuted">
                    {song.nextAction
                      ? `Next Planned Step: ${song.nextAction}`
                      : `${song.genre || "Hip-Hop"} arrangement`}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Link
                    href={`/create/songs/${song.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-xs font-semibold transition-all"
                  >
                    <span>Resume Studio</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
