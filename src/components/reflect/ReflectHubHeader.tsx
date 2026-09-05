"use client";

import * as React from "react";
import {
  BookMarked,
  CalendarCheck,
  AlertTriangle,
  Sparkles,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ReflectionStatsData } from "@/lib/types";

interface ReflectHubHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  stats: ReflectionStatsData;
  onNewBottleneck: () => void;
  onNewBreakthrough: () => void;
  onNewMilestone: () => void;
}

const TABS = [
  { id: "daily", label: "Daily Reflection", icon: BookMarked },
  { id: "weekly", label: "Weekly Review", icon: CalendarCheck },
  { id: "bottlenecks", label: "Bottleneck Audit", icon: AlertTriangle },
  { id: "breakthroughs", label: "Breakthrough Log", icon: Sparkles },
  { id: "milestones", label: "Milestones", icon: Award },
];

export function ReflectHubHeader({
  activeTab,
  onTabChange,
  stats,
  onNewBottleneck,
  onNewBreakthrough,
  onNewMilestone,
}: ReflectHubHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-prime-borderSubtle">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookMarked className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">
              Artist Diagnosis & Reflection War Room
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-prime-text">
            REFLECT
          </h1>
          <p className="text-xs sm:text-sm text-prime-textMuted mt-0.5">
            Daily studio retrospectives, weekly creative reviews with deterministic insights, bottleneck audits, and milestone records.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onNewBottleneck}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-prime-surface border border-prime-borderSubtle text-xs font-semibold text-prime-text hover:bg-prime-surfaceHover hover:border-prime-border transition-all"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
            <span>Audit Bottleneck</span>
          </button>
          <button
            onClick={onNewBreakthrough}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-prime-surface border border-prime-borderSubtle text-xs font-semibold text-prime-text hover:bg-prime-surfaceHover hover:border-prime-border transition-all"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Log Breakthrough</span>
          </button>
          <button
            onClick={onNewMilestone}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-prime-surface border border-prime-borderSubtle text-xs font-semibold text-prime-text hover:bg-prime-surfaceHover hover:border-prime-border transition-all"
          >
            <Award className="h-3.5 w-3.5 text-purple-400" />
            <span>Add Milestone</span>
          </button>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-prime-surface/70 border border-prime-borderSubtle rounded-xl p-3">
          <div className="flex items-center gap-2 text-prime-textMuted text-xs mb-1">
            <BookMarked className="h-3.5 w-3.5 text-indigo-400" />
            <span>Daily Reflections</span>
          </div>
          <div className="text-xl font-extrabold text-prime-text">
            {stats.totalDailyReflections}
          </div>
          <p className="text-[11px] text-prime-textMuted mt-0.5">
            studio daily retrospectives
          </p>
        </div>

        <div className="bg-prime-surface/70 border border-prime-borderSubtle rounded-xl p-3">
          <div className="flex items-center gap-2 text-prime-textMuted text-xs mb-1">
            <CalendarCheck className="h-3.5 w-3.5 text-sky-400" />
            <span>Weekly Audits</span>
          </div>
          <div className="text-xl font-extrabold text-prime-text">
            {stats.totalWeeklyReviews}
          </div>
          <p className="text-[11px] text-prime-textMuted mt-0.5">
            complete weekly reviews
          </p>
        </div>

        <div className="bg-prime-surface/70 border border-prime-borderSubtle rounded-xl p-3">
          <div className="flex items-center gap-2 text-prime-textMuted text-xs mb-1">
            <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
            <span>Active Bottlenecks</span>
          </div>
          <div className="text-xl font-extrabold text-prime-text">
            {stats.activeBottlenecksCount}
          </div>
          <p className="text-[11px] text-prime-textMuted mt-0.5">
            {stats.resolvedBottlenecksCount} resolved blockers
          </p>
        </div>

        <div className="bg-prime-surface/70 border border-prime-borderSubtle rounded-xl p-3">
          <div className="flex items-center gap-2 text-prime-textMuted text-xs mb-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Breakthroughs</span>
          </div>
          <div className="text-xl font-extrabold text-prime-text">
            {stats.breakthroughsCount}
          </div>
          <p className="text-[11px] text-prime-textMuted mt-0.5">
            {stats.milestonesCount} career milestones
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-prime-borderSubtle">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap",
                isSelected
                  ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-prime-sm"
                  : "bg-transparent text-prime-textMuted hover:text-prime-text hover:bg-prime-surface/60"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
