"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Search,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Dumbbell,
} from "lucide-react";
import {
  SKILL_CATEGORY_CONFIGS,
  SkillMatrixItem,
  SkillTrendDirection,
} from "@/lib/types";
import { formatMinutes } from "@/lib/utils";

interface SkillMatrixTableProps {
  skills: SkillMatrixItem[];
}

export function SkillMatrixTable({ skills }: SkillMatrixTableProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    { id: "ALL", label: "All Skills" },
    { id: "RAP", label: "Rap & Flow" },
    { id: "WRITING", label: "Lyrical Writing" },
    { id: "PRODUCTION", label: "Production" },
    { id: "EAR_TRAINING", label: "Ear Training" },
    { id: "VOCABULARY", label: "Vocabulary" },
  ];

  const filteredSkills = skills.filter((item) => {
    if (selectedCategory !== "ALL" && item.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const renderTrendIcon = (trend: SkillTrendDirection) => {
    switch (trend) {
      case "UP":
        return (
          <span className="flex items-center gap-0.5 text-xs font-mono font-bold text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Rising</span>
          </span>
        );
      case "DOWN":
        return (
          <span className="flex items-center gap-0.5 text-xs font-mono font-bold text-rose-400">
            <TrendingDown className="h-3.5 w-3.5" />
            <span>Declining</span>
          </span>
        );
      case "STEADY":
        return (
          <span className="flex items-center gap-0.5 text-xs font-mono font-bold text-zinc-400">
            <Minus className="h-3.5 w-3.5" />
            <span>Steady</span>
          </span>
        );
      case "NEW":
        return (
          <span className="flex items-center gap-0.5 text-xs font-mono font-bold text-sky-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>New</span>
          </span>
        );
      default:
        return (
          <span className="text-xs font-mono text-prime-textMuted">
            Inactive
          </span>
        );
    }
  };

  const renderFrequencyBadge = (freq: SkillMatrixItem["practiceFrequency"]) => {
    switch (freq) {
      case "High":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            High Vol
          </span>
        );
      case "Medium":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
            Medium
          </span>
        );
      case "Low":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            Light
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
            None
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-prime-borderSubtle bg-prime-card/90 p-5 sm:p-6 shadow-prime-sm space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-prime-borderSubtle">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold tracking-tight text-prime-text uppercase">
              Skill Development Matrix
            </h3>
          </div>
          <p className="text-xs text-prime-textMuted mt-0.5">
            Cross-sectional analysis of practice volume, confidence ratings, and training trends.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-prime-textMuted" />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-prime-surface border border-prime-borderSubtle text-xs text-prime-text focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => {
          const active = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                active
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-prime-surface/70 text-prime-textMuted hover:text-prime-text hover:bg-prime-surface"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto -mx-5 sm:mx-0">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-prime-borderSubtle text-[11px] font-mono uppercase text-prime-textMuted bg-prime-surface/40">
              <th className="py-3 px-4 font-semibold">Skill & Category</th>
              <th className="py-3 px-4 font-semibold">Practice Volume</th>
              <th className="py-3 px-4 font-semibold">Confidence</th>
              <th className="py-3 px-4 font-semibold">Difficulty</th>
              <th className="py-3 px-4 font-semibold">Trend</th>
              <th className="py-3 px-4 font-semibold">Last Practiced</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-prime-borderSubtle/50">
            {filteredSkills.map((item) => {
              const catConfig = SKILL_CATEGORY_CONFIGS[item.category];

              return (
                <tr
                  key={item.id}
                  className="hover:bg-prime-surface/40 transition-colors group"
                >
                  {/* Skill Name */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/progress/skills/${item.slug}`}
                          className="font-bold text-prime-text hover:text-emerald-400 transition-colors"
                        >
                          {item.name}
                        </Link>
                        {item.isUndertrained && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Undertrained
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${catConfig.badgeClass}`}
                        >
                          {catConfig.label}
                        </span>
                        <span className="text-[10px] text-prime-textMuted">
                          {item.exerciseCount} drills in catalog
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Practice Volume */}
                  <td className="py-3.5 px-4 font-mono">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-prime-text">
                          {formatMinutes(item.totalPracticeMinutes)}
                        </span>
                        {renderFrequencyBadge(item.practiceFrequency)}
                      </div>
                      <p className="text-[10px] text-prime-textMuted">
                        {item.completedSessions} sessions
                      </p>
                    </div>
                  </td>

                  {/* Confidence Rating */}
                  <td className="py-3.5 px-4 font-mono">
                    {item.avgConfidence !== null ? (
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-prime-text">
                          {item.avgConfidence}
                        </span>
                        <span className="text-prime-textMuted text-[10px]">
                          /5
                        </span>
                      </div>
                    ) : (
                      <span className="text-prime-textMuted text-[11px]">
                        Unrated
                      </span>
                    )}
                  </td>

                  {/* Difficulty Rating */}
                  <td className="py-3.5 px-4 font-mono">
                    {item.avgDifficulty !== null ? (
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-prime-text">
                          {item.avgDifficulty}
                        </span>
                        <span className="text-prime-textMuted text-[10px]">
                          /5
                        </span>
                      </div>
                    ) : (
                      <span className="text-prime-textMuted text-[11px]">
                        —
                      </span>
                    )}
                  </td>

                  {/* Trend */}
                  <td className="py-3.5 px-4 font-mono">
                    {renderTrendIcon(item.trend)}
                  </td>

                  {/* Last Practiced */}
                  <td className="py-3.5 px-4 font-mono text-prime-textMuted">
                    {item.lastPracticed}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/train?skillId=${item.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border border-orange-500/20 text-[11px] font-semibold transition-all"
                        title="Start Training"
                      >
                        <Dumbbell className="h-3 w-3" />
                        <span className="hidden sm:inline">Train</span>
                      </Link>
                      <Link
                        href={`/progress/skills/${item.slug}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-prime-surface hover:bg-prime-surface/90 text-prime-text text-[11px] font-semibold border border-prime-borderSubtle transition-all"
                      >
                        <span>Detail</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
