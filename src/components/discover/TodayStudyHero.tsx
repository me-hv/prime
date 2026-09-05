"use client";

import * as React from "react";
import {
  Sparkles,
  Headphones,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { TodayStudyRecommendation, STUDY_FOCUS_CONFIGS } from "@/lib/types";

interface TodayStudyHeroProps {
  recommendation: TodayStudyRecommendation;
  onStartStudy: (referenceId?: string, focus?: string) => void;
}

export function TodayStudyHero({
  recommendation,
  onStartStudy,
}: TodayStudyHeroProps) {
  const { reference, focus, reason, suggestedAction } = recommendation;
  const focusConfig = STUDY_FOCUS_CONFIGS[focus] || STUDY_FOCUS_CONFIGS.FLOW;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-sky-500/25 bg-gradient-to-r from-sky-950/40 via-prime-surface to-prime-surface/80 p-5 sm:p-6 shadow-prime-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono tracking-wider uppercase bg-sky-500/20 text-sky-300 border border-sky-500/30">
              <Sparkles className="h-3 w-3" />
              Today&apos;s Recommended Study
            </span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${focusConfig.badgeClass}`}>
              Focus: {focusConfig.label}
            </span>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-prime-text tracking-tight flex items-center gap-2">
              <Headphones className="h-5 w-5 text-sky-400 shrink-0" />
              <span>
                {reference ? `"${reference.title}" — ${reference.creator}` : "Classic Song Anatomy Dissection"}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-prime-textSecondary mt-1 leading-relaxed">
              {reason}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-prime-textMuted pt-1">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-sky-400" />
              <span>{suggestedAction}</span>
            </span>
            {reference?.url && (
              <a
                href={reference.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sky-400 hover:text-sky-300 transition-colors"
              >
                <span>Reference Link</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>

        {/* Start Button */}
        <div className="shrink-0 flex items-center">
          <button
            onClick={() => onStartStudy(reference?.id, focus)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-500 text-white font-bold text-xs sm:text-sm hover:bg-sky-400 shadow-prime-md transition-all active:scale-[0.98]"
          >
            <span>Launch Study Workbench</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
