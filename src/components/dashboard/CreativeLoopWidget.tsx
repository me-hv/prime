"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Compass, 
  Dumbbell, 
  Sparkles, 
  Brain, 
  ArrowRight,
  BookOpen,
  AlertTriangle
} from "lucide-react";
import type {
  DiscoveryStatsData,
  ReflectionStatsData,
  TodayStudyRecommendation,
} from "@/lib/types";

interface CreativeLoopWidgetProps {
  discoveryStats?: DiscoveryStatsData;
  reflectionStats?: ReflectionStatsData;
  todayStudy?: TodayStudyRecommendation | null;
}

export function CreativeLoopWidget({
  discoveryStats,
  reflectionStats,
  todayStudy,
}: CreativeLoopWidgetProps) {
  const stages = [
    {
      name: "DISCOVER",
      icon: Compass,
      href: "/discover",
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      activeBorder: "hover:border-blue-500/40",
      desc: "Reference Vault & Inspiration",
      metric: discoveryStats ? `${discoveryStats.totalReferences} refs` : "Vault",
    },
    {
      name: "STUDY",
      icon: BookOpen,
      href: "/discover?tab=vault",
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
      activeBorder: "hover:border-cyan-500/40",
      desc: "Track Dissection & Anatomy",
      metric: discoveryStats ? `${discoveryStats.totalStudySessions} dissections` : "Anatomy",
    },
    {
      name: "REFLECT",
      icon: Brain,
      href: "/reflect",
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      activeBorder: "hover:border-purple-500/40",
      desc: "Diagnostics & Retrospectives",
      metric: reflectionStats ? `${reflectionStats.totalDailyReflections} logs` : "Diagnostics",
    },
    {
      name: "PRACTICE",
      icon: Dumbbell,
      href: "/train",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      activeBorder: "hover:border-amber-500/40",
      desc: "Deliberate Gymnasium Drills",
      metric: "Gymnasium",
    },
    {
      name: "CREATE",
      icon: Sparkles,
      href: "/create",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      activeBorder: "hover:border-emerald-500/40",
      desc: "Song Engine & Studio",
      metric: "Studio",
    },
  ];

  return (
    <div className="bg-prime-surface border border-prime-border rounded-xl p-6 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-accent-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
            <h2 className="text-xs font-mono uppercase tracking-widest text-prime-accent">
              PRIME Master Loop
            </h2>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
            The Artist Development Cycle
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-prime-muted">
          <span>Discover → Study → Reflect → Train → Create</span>
        </div>
      </div>

      {/* 5-Stage Visual Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 relative z-10">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <Link
              key={stage.name}
              href={stage.href}
              className={`group flex flex-col justify-between p-4 rounded-lg border transition-all duration-200 bg-prime-bg/40 ${stage.activeBorder} hover:bg-prime-surface-hover`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg border ${stage.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-prime-muted">0{idx + 1}</span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-prime-accent transition-colors">
                  {stage.name}
                </h4>
                <p className="text-[11px] text-prime-muted line-clamp-2 mt-1 leading-snug">
                  {stage.desc}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-prime-border/50 flex items-center justify-between">
                <span className="text-[11px] font-mono text-prime-muted group-hover:text-white transition-colors">
                  {stage.metric}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-prime-muted group-hover:text-prime-accent group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Status Sub-Bar */}
      {(todayStudy?.reference || (reflectionStats && reflectionStats.activeBottlenecksCount > 0)) && (
        <div className="mt-4 pt-4 border-t border-prime-border/60 grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">
          {todayStudy?.reference && (
            <Link
              href="/discover"
              className="flex items-center justify-between p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-[10px] font-mono uppercase text-cyan-400 font-semibold tracking-wider">
                    Today&apos;s Focus Study
                  </div>
                  <div className="text-xs font-semibold text-white truncate max-w-[240px]">
                    {todayStudy.reference.title} {todayStudy.reference.creator ? `• ${todayStudy.reference.creator}` : ""}
                  </div>
                </div>
              </div>
              <span className="text-xs text-cyan-400 group-hover:underline flex items-center gap-1">
                Study <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          )}

          {reflectionStats && reflectionStats.activeBottlenecksCount > 0 && (
            <Link
              href="/reflect?tab=bottlenecks"
              className="flex items-center justify-between p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 hover:border-amber-500/40 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-[10px] font-mono uppercase text-amber-400 font-semibold tracking-wider">
                    Active Creative Bottlenecks
                  </div>
                  <div className="text-xs font-semibold text-white">
                    {reflectionStats.activeBottlenecksCount} diagnosed obstacle{reflectionStats.activeBottlenecksCount > 1 ? "s" : ""} waiting for drills
                  </div>
                </div>
              </div>
              <span className="text-xs text-amber-400 group-hover:underline flex items-center gap-1">
                Resolve <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
