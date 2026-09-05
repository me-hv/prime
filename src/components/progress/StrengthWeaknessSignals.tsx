"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  AlertCircle,
  ArrowRight,
  Dumbbell,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { StrengthSignal, WeaknessSignal, SKILL_CATEGORY_CONFIGS } from "@/lib/types";

interface StrengthWeaknessSignalsProps {
  strengths: StrengthSignal[];
  weaknesses: WeaknessSignal[];
}

export function StrengthWeaknessSignals({
  strengths,
  weaknesses,
}: StrengthWeaknessSignalsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strength Signals Column */}
        <div className="rounded-2xl border border-prime-borderSubtle bg-prime-card/90 p-5 sm:p-6 shadow-prime-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-prime-borderSubtle">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold tracking-tight text-prime-text uppercase">
                Observed Strength Signals
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {strengths.length} High Confidence
            </span>
          </div>

          {strengths.length === 0 ? (
            <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/50 p-6 text-center space-y-1">
              <p className="text-xs text-prime-textMuted">
                Log more completed workouts and writing sessions to establish strength signals.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {strengths.map((s) => {
                const catConfig = SKILL_CATEGORY_CONFIGS[s.category];
                return (
                  <div
                    key={s.skillId}
                    className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/20 via-prime-surface to-prime-surface p-4 space-y-2.5 shadow-prime-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-prime-text">
                          {s.skillName}
                        </h4>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${catConfig.badgeClass}`}
                        >
                          {catConfig.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                        Verified Signal
                      </span>
                    </div>

                    <p className="text-xs text-prime-textSecondary leading-relaxed">
                      {s.summary}
                    </p>

                    <div className="space-y-1 pt-1 border-t border-prime-borderSubtle/50 text-[11px] font-mono text-prime-textMuted">
                      {s.evidence.map((ev, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                          <span>{ev}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Weakness & Undertrained Signals Column */}
        <div className="rounded-2xl border border-prime-borderSubtle bg-prime-card/90 p-5 sm:p-6 shadow-prime-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-prime-borderSubtle">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-bold tracking-tight text-prime-text uppercase">
                Weakness & Undertrained Alerts
              </h3>
            </div>
            <span className="text-[10px] font-mono text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {weaknesses.length} Actionable
            </span>
          </div>

          {weaknesses.length === 0 ? (
            <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/50 p-6 text-center space-y-1">
              <p className="text-xs text-prime-textMuted">
                No acute weaknesses or undertrained areas detected.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {weaknesses.map((w) => {
                const catConfig = SKILL_CATEGORY_CONFIGS[w.category];
                return (
                  <div
                    key={w.skillId}
                    className="rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-950/20 via-prime-surface to-prime-surface p-4 space-y-2.5 shadow-prime-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-prime-text">
                          {w.skillName}
                        </h4>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${catConfig.badgeClass}`}
                        >
                          {catConfig.label}
                        </span>
                      </div>
                      <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        {w.type}
                      </span>
                    </div>

                    <p className="text-xs text-prime-textSecondary leading-relaxed">
                      {w.summary}
                    </p>

                    <div className="space-y-1 pt-1 border-t border-prime-borderSubtle/50 text-[11px] font-mono text-prime-textMuted">
                      {w.evidence.map((ev, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3 text-amber-400 shrink-0" />
                          <span>{ev}</span>
                        </div>
                      ))}
                    </div>

                    {w.suggestedExerciseSlug && (
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-[11px] text-prime-textMuted font-mono">
                          Target: {w.suggestedExerciseTitle}
                        </span>
                        <Link
                          href={`/train/${w.suggestedExerciseSlug}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border border-orange-500/20 text-xs font-semibold transition-all"
                        >
                          <Dumbbell className="h-3 w-3" />
                          <span>Practice This</span>
                          <ArrowRight className="h-3 w-3 ml-0.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
