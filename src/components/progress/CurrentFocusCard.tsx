"use client";

import * as React from "react";
import Link from "next/link";
import { Target, ArrowRight, ShieldAlert, Sparkles, Layers, Award } from "lucide-react";
import { CurrentArtistFocusData } from "@/lib/types";

interface CurrentFocusCardProps {
  focus: CurrentArtistFocusData;
}

export function CurrentFocusCard({ focus }: CurrentFocusCardProps) {
  const getSourceBadge = () => {
    switch (focus.source) {
      case "MANUAL_OVERRIDE":
        return {
          label: "User Defined Priority",
          class: "bg-purple-500/15 text-purple-300 border-purple-500/30",
          icon: Sparkles,
        };
      case "BOTTLENECK":
        return {
          label: "Critical Bottleneck",
          class: "bg-rose-500/15 text-rose-300 border-rose-500/30",
          icon: ShieldAlert,
        };
      case "ACTIVE_GOAL":
        return {
          label: "Active Goal Target",
          class: "bg-amber-500/15 text-amber-300 border-amber-500/30",
          icon: Award,
        };
      case "PROJECT":
        return {
          label: "Pipeline Priority",
          class: "bg-sky-500/15 text-sky-300 border-sky-500/30",
          icon: Layers,
        };
      default:
        return {
          label: "Foundational Focus",
          class: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
          icon: Target,
        };
    }
  };

  const badge = getSourceBadge();
  const BadgeIcon = badge.icon;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-r from-emerald-950/40 via-prime-surface to-prime-surface/80 p-5 sm:p-6 shadow-prime-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Target className="h-3 w-3" />
              Current Artist Focus
            </span>
            <span
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${badge.class}`}
            >
              <BadgeIcon className="h-3 w-3" />
              {badge.label}
            </span>
            {focus.supportingSkill && (
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-prime-surface border border-prime-borderSubtle text-prime-textSecondary">
                Skill: {focus.supportingSkill}
              </span>
            )}
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-prime-text tracking-tight">
              {focus.title}
            </h2>
            <p className="text-xs sm:text-sm text-prime-textSecondary mt-1 leading-relaxed">
              {focus.rationale}
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <Link
            href={focus.recommendedActionHref}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs font-mono transition-all shadow-prime-md"
          >
            <span>{focus.recommendedActionLabel}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
