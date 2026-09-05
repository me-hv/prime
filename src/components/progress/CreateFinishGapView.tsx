"use client";

import * as React from "react";
import Link from "next/link";
import { Disc3, PenTool, CheckCircle2, ArrowRight } from "lucide-react";
import { FinishingHealthData } from "@/lib/types";

interface CreateFinishGapViewProps {
  health: FinishingHealthData;
}

export function CreateFinishGapView({ health }: CreateFinishGapViewProps) {
  return (
    <div className="rounded-2xl border border-prime-borderSubtle bg-prime-card/90 p-5 sm:p-6 shadow-prime-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-prime-borderSubtle">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-prime-text uppercase flex items-center gap-2">
            <Disc3 className="h-4 w-4 text-emerald-400" />
            Create $\rightarrow$ Finish Conversion Velocity
          </h3>
          <p className="text-xs text-prime-textMuted mt-0.5">
            Ratio of started creative ideas versus fully produced and finished tracks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/70 p-4 space-y-1">
          <span className="text-[11px] font-mono uppercase text-prime-textMuted flex items-center gap-1.5">
            <PenTool className="h-3.5 w-3.5 text-amber-400" />
            Started Works
          </span>
          <p className="text-2xl font-black text-prime-text font-mono">
            {health.totalCreated}
          </p>
          <p className="text-[11px] text-prime-textMuted">
            Song ideas, concepts & demos
          </p>
        </div>

        <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/70 p-4 space-y-1">
          <span className="text-[11px] font-mono uppercase text-prime-textMuted flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            Finished Masters
          </span>
          <p className="text-2xl font-black text-prime-text font-mono">
            {health.totalFinished}
          </p>
          <p className="text-[11px] text-prime-textMuted">
            Completed catalog ready
          </p>
        </div>

        <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/70 p-4 space-y-1">
          <span className="text-[11px] font-mono uppercase text-prime-textMuted">
            Conversion Ratio
          </span>
          <p className="text-2xl font-black text-prime-text font-mono text-emerald-400">
            {health.completionRatioPct}%
          </p>
          <p className="text-[11px] text-prime-textMuted">
            {health.totalActive} tracks currently in progress
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-prime-textSecondary">
          Most active songs currently reside in the Writing and Demo stages.
        </p>
        <Link
          href="/create?tab=songs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
        >
          <span>Open Song Catalog</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
