"use client";

import * as React from "react";
import {
  Dumbbell,
  Flame,
  Clock,
  CheckCircle2,
  Target,
  Music,
  Sparkles,
  BookOpen,
  History,
  ListFilter,
} from "lucide-react";
import { TrainingStatsData } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TrainingHubHeaderProps {
  stats: TrainingStatsData;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenPocketGym: () => void;
}

export function TrainingHubHeader({
  stats,
  activeTab,
  onTabChange,
  onOpenPocketGym,
}: TrainingHubHeaderProps) {
  const tabs = [
    { id: "drills", label: "Drill Library", icon: ListFilter },
    { id: "pocket-gym", label: "Pocket Gym & Metronome", icon: Music },
    { id: "rhymes", label: "Rhyme Chains", icon: Sparkles },
    { id: "vocab", label: "Vocabulary Gym", icon: BookOpen },
    { id: "history", label: "Training History", icon: History },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Dumbbell className="h-4 w-4 text-orange-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-orange-400 font-bold">
              Artist Gym & Deliberate Practice
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-prime-text">
            TRAIN
          </h1>
          <p className="text-xs sm:text-sm text-prime-textMuted mt-0.5">
            Sample-accurate metronome, timed 16-bar writing sprints, and flow pocket drills.
          </p>
        </div>

        {/* Quick Launch Pocket Gym */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPocketGym}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500/15 hover:bg-orange-500 text-orange-400 hover:text-black border border-orange-500/30 hover:border-orange-500 font-extrabold text-xs tracking-wider transition-all active:scale-[0.98] shadow-prime-sm"
          >
            <Music className="h-4 w-4" />
            <span>Launch Pocket Gym</span>
          </button>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Streak */}
        <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface p-4 flex items-center gap-3.5">
          <div
            className={cn(
              "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border",
              stats.streakDays > 0
                ? "bg-orange-500/15 border-orange-500/30 text-orange-400"
                : "bg-prime-surfaceSubtle border-prime-borderSubtle text-prime-textMuted"
            )}
          >
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold font-mono text-prime-text">
                {stats.streakDays}
              </span>
              <span className="text-[10px] font-mono text-prime-textMuted uppercase">
                days
              </span>
            </div>
            <p className="text-[11px] text-prime-textMuted font-medium">
              {stats.streakActiveToday ? "Trained Today" : "Training Streak"}
            </p>
          </div>
        </div>

        {/* Weekly Minutes */}
        <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface p-4 flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold font-mono text-prime-text">
                {stats.weeklyPracticeMinutes}m
              </span>
            </div>
            <p className="text-[11px] text-prime-textMuted font-medium">
              This Week
            </p>
          </div>
        </div>

        {/* Sessions Completed */}
        <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface p-4 flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold font-mono text-prime-text">
                {stats.totalSessionsCompleted}
              </span>
            </div>
            <p className="text-[11px] text-prime-textMuted font-medium">
              Drills Logged
            </p>
          </div>
        </div>

        {/* Skills Covered */}
        <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface p-4 flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold font-mono text-prime-text">
                {stats.skillsTrainedCount}
              </span>
            </div>
            <p className="text-[11px] text-prime-textMuted font-medium">
              Skills Sharpened
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-prime-borderSubtle scrollbar-none">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const isSelected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap",
                isSelected
                  ? "bg-orange-500 text-black shadow-prime-sm font-extrabold"
                  : "bg-prime-surface text-prime-textSecondary hover:text-prime-text hover:bg-prime-surfaceSubtle border border-prime-borderSubtle"
              )}
            >
              <TabIcon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
