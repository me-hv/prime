"use client";

import * as React from "react";
import {
  Sparkles,
  TrendingUp,
  Clock,
  Compass,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import {
  ArtistDNAData,
  PATTERN_CONFIDENCE_CONFIGS,
  PatternConfidenceLevel,
} from "@/lib/types";

interface ObservedPatternsViewProps {
  patterns: ArtistDNAData["observedPatterns"];
}

export function ObservedPatternsView({ patterns }: ObservedPatternsViewProps) {
  const renderConfidenceBadge = (confidence: PatternConfidenceLevel) => {
    const config = PATTERN_CONFIDENCE_CONFIGS[confidence];
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${config.badgeClass}`}
        title={config.description}
      >
        {confidence === "INSUFFICIENT_DATA" && (
          <HelpCircle className="h-3 w-3" />
        )}
        {confidence === "EMERGING_PATTERN" && (
          <Sparkles className="h-3 w-3" />
        )}
        {confidence === "RECURRING_PATTERN" && (
          <TrendingUp className="h-3 w-3" />
        )}
        {confidence === "STRONG_PATTERN" && (
          <CheckCircle2 className="h-3 w-3" />
        )}
        {config.label}
      </span>
    );
  };

  return (
    <div className="rounded-2xl border border-prime-borderSubtle bg-prime-card/90 p-5 sm:p-6 shadow-prime-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-prime-borderSubtle">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-prime-text uppercase flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            PRIME Observed Patterns & Identity Signals
          </h3>
          <p className="text-xs text-prime-textMuted mt-0.5">
            Deterministic patterns derived from your recorded training, writing, study, and reflection logs.
          </p>
        </div>
        <span className="text-[11px] font-mono text-prime-textMuted">
          Honest Confidence Thresholds
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Verified Strength Signals */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-4.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-emerald-400 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" />
              Observed Strengths
            </span>
          </div>
          <div className="space-y-3">
            {patterns.strengths.map((item, i) => (
              <div
                key={i}
                className="rounded-lg border border-emerald-500/20 bg-prime-surface/80 p-3 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs text-prime-text">
                    {item.title}
                  </span>
                  {renderConfidenceBadge(item.confidence)}
                </div>
                <p className="text-[11px] text-prime-textSecondary leading-relaxed">
                  {item.evidence}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Emerging Skills */}
        <div className="rounded-xl border border-sky-500/20 bg-sky-950/10 p-4.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-sky-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Emerging Skills
            </span>
          </div>
          <div className="space-y-3">
            {patterns.emerging.map((item, i) => (
              <div
                key={i}
                className="rounded-lg border border-sky-500/20 bg-prime-surface/80 p-3 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs text-prime-text">
                    {item.title}
                  </span>
                  {renderConfidenceBadge(item.confidence)}
                </div>
                <p className="text-[11px] text-prime-textSecondary leading-relaxed">
                  {item.evidence}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Undertrained Areas */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-950/10 p-4.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-amber-400 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Undertrained Areas
            </span>
          </div>
          <div className="space-y-3">
            {patterns.undertrained.map((item, i) => (
              <div
                key={i}
                className="rounded-lg border border-amber-500/20 bg-prime-surface/80 p-3 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs text-prime-text">
                    {item.title}
                  </span>
                  {renderConfidenceBadge(item.confidence)}
                </div>
                <p className="text-[11px] text-prime-textSecondary leading-relaxed">
                  {item.evidence}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Creative Tendencies & Study Patterns */}
        <div className="rounded-xl border border-purple-500/20 bg-purple-950/10 p-4.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-purple-400 flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5" />
              Tendencies & Lineage Focus
            </span>
          </div>
          <div className="space-y-3">
            {patterns.tendencies.concat(patterns.studyPatterns).map((item, i) => (
              <div
                key={i}
                className="rounded-lg border border-purple-500/20 bg-prime-surface/80 p-3 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs text-prime-text">
                    {item.title}
                  </span>
                  {renderConfidenceBadge(item.confidence)}
                </div>
                <p className="text-[11px] text-prime-textSecondary leading-relaxed">
                  {item.evidence}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
