"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Layers,
  Flame,
  Clock,
  ArrowRight,
  Lightbulb,
} from "lucide-react";
import { ProgressInsightItem } from "@/lib/types";

interface ProgressInsightsSectionProps {
  insights: ProgressInsightItem[];
}

export function ProgressInsightsSection({
  insights,
}: ProgressInsightsSectionProps) {
  const getInsightStyle = (type: ProgressInsightItem["type"]) => {
    switch (type) {
      case "POSITIVE":
        return {
          icon: TrendingUp,
          badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
          borderClass: "border-emerald-500/25 hover:border-emerald-500/40",
          bgGradient: "from-emerald-950/20 to-prime-card",
        };
      case "GAP":
        return {
          icon: Layers,
          badgeClass: "bg-sky-500/15 text-sky-300 border-sky-500/30",
          borderClass: "border-sky-500/25 hover:border-sky-500/40",
          bgGradient: "from-sky-950/20 to-prime-card",
        };
      case "BOTTLENECK":
        return {
          icon: AlertTriangle,
          badgeClass: "bg-rose-500/15 text-rose-300 border-rose-500/30",
          borderClass: "border-rose-500/25 hover:border-rose-500/40",
          bgGradient: "from-rose-950/20 to-prime-card",
        };
      case "CONSISTENCY":
        return {
          icon: Flame,
          badgeClass: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
          borderClass: "border-indigo-500/25 hover:border-indigo-500/40",
          bgGradient: "from-indigo-950/20 to-prime-card",
        };
      case "NEGLECTED":
        return {
          icon: Clock,
          badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
          borderClass: "border-amber-500/25 hover:border-amber-500/40",
          bgGradient: "from-amber-950/20 to-prime-card",
        };
      case "BREAKTHROUGH":
        return {
          icon: Sparkles,
          badgeClass: "bg-purple-500/15 text-purple-300 border-purple-500/30",
          borderClass: "border-purple-500/25 hover:border-purple-500/40",
          bgGradient: "from-purple-950/20 to-prime-card",
        };
      default:
        return {
          icon: Lightbulb,
          badgeClass: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
          borderClass: "border-prime-borderSubtle hover:border-prime-border",
          bgGradient: "from-prime-surface to-prime-card",
        };
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-bold tracking-tight text-prime-text uppercase">
            Deterministic Progress Insights
          </h3>
        </div>
        <span className="text-[11px] font-mono text-prime-textMuted">
          Derived from verified studio data
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {insights.map((insight) => {
          const style = getInsightStyle(insight.type);
          const Icon = style.icon;

          return (
            <div
              key={insight.id}
              className={`flex flex-col justify-between rounded-xl border bg-gradient-to-br ${style.bgGradient} p-4.5 transition-all shadow-prime-xs ${style.borderClass}`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${style.badgeClass}`}
                  >
                    <Icon className="h-3 w-3" />
                    {insight.type}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-prime-text">
                    {insight.title}
                  </h4>
                  <p className="text-xs text-prime-textSecondary mt-1 leading-relaxed">
                    {insight.observation}
                  </p>
                </div>

                <div className="pt-1 text-[11px] font-mono text-prime-textMuted border-t border-prime-borderSubtle/50">
                  <span className="text-prime-textSecondary font-semibold">
                    Evidence:
                  </span>{" "}
                  {insight.evidence}
                </div>
              </div>

              {insight.actionLabel && insight.actionHref && (
                <div className="pt-3 mt-2">
                  <Link
                    href={insight.actionHref}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 group"
                  >
                    <span>{insight.actionLabel}</span>
                    <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform" />
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
