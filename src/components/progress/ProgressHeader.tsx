"use client";

import * as React from "react";
import Link from "next/link";
import {
  TrendingUp,
  Dna,
  LayoutGrid,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { TimeRangePeriod, TIME_RANGE_CONFIGS } from "@/lib/types";

interface ProgressHeaderProps {
  activeTab: "overview" | "skills" | "finishing" | "signals";
  onTabChange: (tab: "overview" | "skills" | "finishing" | "signals") => void;
  timeRange: TimeRangePeriod;
  onTimeRangeChange: (range: TimeRangePeriod) => void;
}

export function ProgressHeader({
  activeTab,
  onTabChange,
  timeRange,
  onTimeRangeChange,
}: ProgressHeaderProps) {
  const tabs = [
    { id: "overview" as const, label: "Overview & Output", icon: LayoutGrid },
    { id: "skills" as const, label: "Skill Matrix", icon: BarChart3 },
    { id: "finishing" as const, label: "Finishing Health", icon: CheckCircle2 },
    { id: "signals" as const, label: "Signals & Gaps", icon: AlertCircle },
  ];

  const timeRanges: TimeRangePeriod[] = ["7D", "30D", "90D", "6M", "1Y", "ALL"];

  return (
    <div className="space-y-4 pb-4 border-b border-prime-borderSubtle">
      {/* Top row: Title, Artist DNA button, Time range selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
              Artist Development System
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-prime-text">
            PROGRESS & ARTIST EVOLUTION
          </h1>
          <p className="text-xs sm:text-sm text-prime-textMuted mt-0.5">
            Evidence-based analytics tracing what you practice, create, finish, and study.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Time Range Selector */}
          <div className="flex items-center bg-prime-surface border border-prime-borderSubtle rounded-xl p-1 shadow-prime-xs">
            <span className="text-[10px] font-mono uppercase text-prime-textMuted px-2 flex items-center gap-1 hidden sm:flex">
              <Calendar className="h-3 w-3" />
              Window:
            </span>
            {timeRanges.map((period) => {
              const active = timeRange === period;
              return (
                <button
                  key={period}
                  onClick={() => onTimeRangeChange(period)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    active
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm"
                      : "text-prime-textMuted hover:text-prime-text hover:bg-prime-card/50"
                  }`}
                  title={TIME_RANGE_CONFIGS[period].label}
                >
                  {TIME_RANGE_CONFIGS[period].shortLabel}
                </button>
              );
            })}
          </div>

          {/* Artist DNA Link Button */}
          <Link
            href="/progress/artist-dna"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 via-purple-600/20 to-indigo-500/20 hover:from-purple-500/30 hover:to-indigo-500/30 border border-purple-500/30 text-purple-300 text-xs font-bold font-mono transition-all shadow-prime-sm"
          >
            <Dna className="h-4 w-4 text-purple-400 animate-pulse" />
            <span>ARTIST DNA</span>
            <span className="px-1.5 py-0.2 rounded bg-purple-500/30 text-[9px] text-purple-200">
              PROFILE
            </span>
          </Link>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                active
                  ? "bg-prime-card border border-prime-border text-prime-text shadow-prime-sm"
                  : "text-prime-textMuted hover:text-prime-text hover:bg-prime-card/40"
              }`}
            >
              <Icon
                className={`h-3.5 w-3.5 ${
                  active ? "text-emerald-400" : "text-prime-textMuted"
                }`}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
