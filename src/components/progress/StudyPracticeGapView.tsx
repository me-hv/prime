"use client";

import * as React from "react";
import Link from "next/link";
import {
  Layers,
  Dumbbell,
  Compass,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { StudyPracticeGapItem } from "@/lib/types";

interface StudyPracticeGapViewProps {
  gaps: StudyPracticeGapItem[];
}

export function StudyPracticeGapView({ gaps }: StudyPracticeGapViewProps) {
  const getStatusBadge = (status: StudyPracticeGapItem["status"]) => {
    switch (status) {
      case "BALANCED":
        return {
          label: "Balanced Loop",
          class: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
          icon: CheckCircle2,
        };
      case "STUDY_GAP":
        return {
          label: "Study > Practice Gap",
          class: "bg-amber-500/15 text-amber-300 border-amber-500/30",
          icon: AlertCircle,
        };
      case "PRACTICE_GAP":
        return {
          label: "Practice > Study Gap",
          class: "bg-sky-500/15 text-sky-300 border-sky-500/30",
          icon: AlertCircle,
        };
      default:
        return {
          label: "Dormant / Low Data",
          class: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
          icon: HelpCircle,
        };
    }
  };

  return (
    <div className="rounded-2xl border border-prime-borderSubtle bg-prime-card/90 p-5 sm:p-6 shadow-prime-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-prime-borderSubtle">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-prime-text uppercase flex items-center gap-2">
            <Layers className="h-4 w-4 text-emerald-400" />
            Study $\rightarrow$ Practice Cross-Analysis
          </h3>
          <p className="text-xs text-prime-textMuted mt-0.5">
            Deterministic comparison between analytical reference dissections and deliberate gym workouts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gaps.map((item) => {
          const badge = getStatusBadge(item.status);
          const BadgeIcon = badge.icon;

          return (
            <div
              key={item.focus}
              className="rounded-xl border border-prime-borderSubtle bg-prime-surface/70 p-4 space-y-3 shadow-prime-xs hover:border-prime-border transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-sm text-prime-text">
                  {item.focus}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${badge.class}`}
                >
                  <BadgeIcon className="h-3 w-3" />
                  {badge.label}
                </span>
              </div>

              {/* Volume Indicators */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-prime-surface rounded-lg p-2 border border-prime-borderSubtle/50">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-prime-textMuted uppercase flex items-center gap-1">
                    <Compass className="h-3 w-3 text-sky-400" />
                    Study Vol:
                  </span>
                  <p className="font-bold text-sky-300">
                    {item.studyVolume}{" "}
                    <span className="text-prime-textMuted font-normal text-[10px]">
                      ({item.studyCount} sessions)
                    </span>
                  </p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] text-prime-textMuted uppercase flex items-center gap-1">
                    <Dumbbell className="h-3 w-3 text-orange-400" />
                    Practice Vol:
                  </span>
                  <p className="font-bold text-orange-300">
                    {item.practiceVolume}{" "}
                    <span className="text-prime-textMuted font-normal text-[10px]">
                      ({item.practiceCount} drills)
                    </span>
                  </p>
                </div>
              </div>

              <p className="text-xs text-prime-textSecondary leading-relaxed">
                {item.insight}
              </p>

              {item.status === "STUDY_GAP" && (
                <div className="pt-2 border-t border-prime-borderSubtle/40">
                  <Link
                    href={`/train?category=${item.actionTargetCategory || "RAP"}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <span>Turn study into practice drill</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
