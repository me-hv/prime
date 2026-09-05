"use client";

import * as React from "react";
import {
  Compass,
  Headphones,
  Disc3,
  Users,
  Library,
  Clock,
  Plus,
  Sparkles,
  BookMarked,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DiscoveryStatsData } from "@/lib/types";

interface DiscoverHubHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  stats: DiscoveryStatsData;
  onNewReference: () => void;
  onNewArtist: () => void;
  onNewListening: () => void;
  onStartStudy: () => void;
}

const TABS = [
  { id: "overview", label: "Overview", icon: Compass },
  { id: "vault", label: "Study Vault", icon: Headphones },
  { id: "albums", label: "Album Studies", icon: Disc3 },
  { id: "references", label: "Reference Library", icon: Library },
  { id: "artists", label: "Artist Library", icon: Users },
  { id: "listening", label: "Listening Diary", icon: BookMarked },
];

export function DiscoverHubHeader({
  activeTab,
  onTabChange,
  stats,
  onNewReference,
  onNewArtist,
  onNewListening,
  onStartStudy,
}: DiscoverHubHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Top Banner & Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-prime-borderSubtle">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="h-4 w-4 text-sky-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-sky-400">
              Artist Study Vault & Laboratory
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-prime-text">
            DISCOVER
          </h1>
          <p className="text-xs sm:text-sm text-prime-textMuted mt-0.5">
            Study the masters, dissect track anatomy, analyze album architecture, and turn observations into practice.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onNewListening}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-prime-surface border border-prime-borderSubtle text-xs font-semibold text-prime-text hover:bg-prime-surfaceHover hover:border-prime-border transition-all"
          >
            <Headphones className="h-3.5 w-3.5 text-sky-400" />
            <span>Log Listening</span>
          </button>
          <button
            onClick={onNewArtist}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-prime-surface border border-prime-borderSubtle text-xs font-semibold text-prime-text hover:bg-prime-surfaceHover hover:border-prime-border transition-all"
          >
            <Users className="h-3.5 w-3.5 text-amber-400" />
            <span>Add Artist</span>
          </button>
          <button
            onClick={onNewReference}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-prime-surface border border-prime-borderSubtle text-xs font-semibold text-prime-text hover:bg-prime-surfaceHover hover:border-prime-border transition-all"
          >
            <Plus className="h-3.5 w-3.5 text-emerald-400" />
            <span>Add Reference</span>
          </button>
          <button
            onClick={onStartStudy}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-sky-500 text-white text-xs font-bold hover:bg-sky-400 shadow-prime-sm transition-all"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Start Study</span>
          </button>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-prime-surface/70 border border-prime-borderSubtle rounded-xl p-3">
          <div className="flex items-center gap-2 text-prime-textMuted text-xs mb-1">
            <Library className="h-3.5 w-3.5 text-sky-400" />
            <span>Saved References</span>
          </div>
          <div className="text-xl font-extrabold text-prime-text">
            {stats.totalReferences}
          </div>
          <p className="text-[11px] text-prime-textMuted mt-0.5">
            across {stats.totalArtistsStudied} artists & authors
          </p>
        </div>

        <div className="bg-prime-surface/70 border border-prime-borderSubtle rounded-xl p-3">
          <div className="flex items-center gap-2 text-prime-textMuted text-xs mb-1">
            <Headphones className="h-3.5 w-3.5 text-amber-400" />
            <span>Track Dissections</span>
          </div>
          <div className="text-xl font-extrabold text-prime-text">
            {stats.totalStudySessions}
          </div>
          <p className="text-[11px] text-prime-textMuted mt-0.5">
            deep song anatomy studies
          </p>
        </div>

        <div className="bg-prime-surface/70 border border-prime-borderSubtle rounded-xl p-3">
          <div className="flex items-center gap-2 text-prime-textMuted text-xs mb-1">
            <Clock className="h-3.5 w-3.5 text-emerald-400" />
            <span>Study Volume</span>
          </div>
          <div className="text-xl font-extrabold text-prime-text">
            {stats.totalStudyMinutes} <span className="text-xs font-normal text-prime-textMuted">min</span>
          </div>
          <p className="text-[11px] text-prime-textMuted mt-0.5">
            total critical listening time
          </p>
        </div>

        <div className="bg-prime-surface/70 border border-prime-borderSubtle rounded-xl p-3">
          <div className="flex items-center gap-2 text-prime-textMuted text-xs mb-1">
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            <span>Active Study Focus</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {stats.activeStudyFocus.slice(0, 3).map((f) => (
              <span
                key={f}
                className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-sky-500/10 text-sky-300 border border-sky-500/20"
              >
                #{f}
              </span>
            ))}
          </div>
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
                  ? "bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-prime-sm"
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
