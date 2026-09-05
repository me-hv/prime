"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Dumbbell,
  Clock,
  Compass,
  Sparkles,
  AlertCircle,
  Disc3,
  TrendingUp,
  ArrowRight,
  Flame,
  FileText,
} from "lucide-react";
import { SkillDetailData, SKILL_CATEGORY_CONFIGS } from "@/lib/types";
import { formatMinutes } from "@/lib/utils";

interface SkillDetailViewProps {
  data: SkillDetailData;
}

export function SkillDetailView({ data }: SkillDetailViewProps) {
  const {
    skill,
    matrix,
    historyPoints,
    associatedExercises,
    associatedStudies,
    associatedBreakthroughs,
    associatedBottlenecks,
    associatedSongs,
    associatedWritings,
    recentReflectionMentions,
  } = data;

  const catConfig = SKILL_CATEGORY_CONFIGS[skill.category];

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-6xl mx-auto">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/progress?tab=skills"
          className="inline-flex items-center gap-2 text-xs font-semibold text-prime-textMuted hover:text-prime-text transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Skill Matrix</span>
        </Link>

        <Link
          href={`/train?skillId=${skill.id}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs font-mono transition-all shadow-prime-sm"
        >
          <Dumbbell className="h-3.5 w-3.5" />
          <span>Train This Skill</span>
        </Link>
      </div>

      {/* Hero Header Card */}
      <div className="rounded-2xl border border-prime-borderSubtle bg-gradient-to-br from-prime-card via-prime-surface to-prime-surface p-6 shadow-prime-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded text-xs font-semibold border ${catConfig.badgeClass}`}
              >
                {catConfig.label}
              </span>
              {matrix.isUndertrained && (
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Undertrained
                </span>
              )}
              <span className="text-xs font-mono text-prime-textMuted">
                Last Practiced: {matrix.lastPracticed}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-prime-text">
              {skill.name}
            </h1>
            <p className="text-xs sm:text-sm text-prime-textSecondary max-w-3xl leading-relaxed">
              {skill.description ||
                "Deliberate practice and anatomical breakdown for this core artist skill."}
            </p>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/70 p-3 space-y-1">
            <span className="text-[10px] font-mono uppercase text-prime-textMuted flex items-center gap-1">
              <Clock className="h-3 w-3 text-orange-400" />
              Practice Volume
            </span>
            <p className="text-xl font-bold font-mono text-prime-text">
              {formatMinutes(matrix.totalPracticeMinutes)}
            </p>
            <p className="text-[10px] text-prime-textMuted">
              {matrix.completedSessions} completed sessions
            </p>
          </div>

          <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/70 p-3 space-y-1">
            <span className="text-[10px] font-mono uppercase text-prime-textMuted flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-400" />
              Avg Confidence
            </span>
            <p className="text-xl font-bold font-mono text-prime-text">
              {matrix.avgConfidence !== null ? `${matrix.avgConfidence}/5` : "Unrated"}
            </p>
            <p className="text-[10px] text-prime-textMuted">Self-reported ratings</p>
          </div>

          <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/70 p-3 space-y-1">
            <span className="text-[10px] font-mono uppercase text-prime-textMuted flex items-center gap-1">
              <AlertCircle className="h-3 w-3 text-sky-400" />
              Avg Difficulty
            </span>
            <p className="text-xl font-bold font-mono text-prime-text">
              {matrix.avgDifficulty !== null ? `${matrix.avgDifficulty}/5` : "—"}
            </p>
            <p className="text-[10px] text-prime-textMuted">Perceived friction</p>
          </div>

          <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/70 p-3 space-y-1">
            <span className="text-[10px] font-mono uppercase text-prime-textMuted flex items-center gap-1">
              <Compass className="h-3 w-3 text-purple-400" />
              Ecosystem Links
            </span>
            <p className="text-xl font-bold font-mono text-prime-text">
              {matrix.studyCount + matrix.breakthroughCount + matrix.creativeWorkCount}
            </p>
            <p className="text-[10px] text-prime-textMuted">
              {matrix.studyCount} studies • {matrix.breakthroughCount} breakthroughs
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Practice History & Associated Drills */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Practice Session Log */}
        <div className="lg:col-span-7 space-y-6">
          {/* Practice History Table */}
          <div className="rounded-2xl border border-prime-borderSubtle bg-prime-card/90 p-5 space-y-4 shadow-prime-sm">
            <div className="flex items-center justify-between pb-3 border-b border-prime-borderSubtle">
              <h3 className="text-sm font-bold tracking-tight text-prime-text uppercase flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-400" />
                Practice Session History
              </h3>
              <span className="text-xs font-mono text-prime-textMuted">
                {historyPoints.length} logged
              </span>
            </div>

            {historyPoints.length === 0 ? (
              <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/40 p-6 text-center space-y-1">
                <p className="text-xs text-prime-textMuted">
                  No practice sessions logged yet for this skill.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-prime-borderSubtle/50">
                {historyPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="py-3 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <p className="font-bold text-prime-text">
                        {point.sessionTitle}
                      </p>
                      <p className="font-mono text-[10px] text-prime-textMuted">
                        {point.date} • {Math.round(point.durationSeconds / 60)} min
                      </p>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      {point.confidenceRating && (
                        <span className="text-emerald-400">
                          Conf: {point.confidenceRating}/5
                        </span>
                      )}
                      {point.effortRating && (
                        <span className="text-orange-400">
                          Effort: {point.effortRating}/5
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Related Creative Work (Songs & Writings) */}
          <div className="rounded-2xl border border-prime-borderSubtle bg-prime-card/90 p-5 space-y-4 shadow-prime-sm">
            <div className="flex items-center justify-between pb-3 border-b border-prime-borderSubtle">
              <h3 className="text-sm font-bold tracking-tight text-prime-text uppercase flex items-center gap-2">
                <Disc3 className="h-4 w-4 text-emerald-400" />
                Connected Creative Work
              </h3>
              <span className="text-xs font-mono text-prime-textMuted">
                {associatedSongs.length + associatedWritings.length} items
              </span>
            </div>

            <div className="space-y-3">
              {associatedSongs.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-xl border border-prime-borderSubtle bg-prime-surface/70 p-3"
                >
                  <div className="space-y-0.5">
                    <Link
                      href={`/create/songs/${s.id}`}
                      className="font-bold text-xs text-prime-text hover:text-emerald-400 transition-colors"
                    >
                      {s.title}
                    </Link>
                    <p className="text-[10px] text-prime-textMuted">
                      Song • {s.status} • {s.wordCount} words
                    </p>
                  </div>
                  <Link
                    href={`/create/songs/${s.id}`}
                    className="text-xs text-emerald-400 font-semibold flex items-center gap-1"
                  >
                    <span>Open</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ))}

              {associatedWritings.map((w) => (
                <div
                  key={w.id}
                  className="flex items-center justify-between rounded-xl border border-prime-borderSubtle bg-prime-surface/70 p-3"
                >
                  <div className="space-y-0.5">
                    <Link
                      href={`/create/write/${w.id}`}
                      className="font-bold text-xs text-prime-text hover:text-emerald-400 transition-colors"
                    >
                      {w.title}
                    </Link>
                    <p className="text-[10px] text-prime-textMuted">
                      Draft • {w.type} • {w.wordCount} words
                    </p>
                  </div>
                  <Link
                    href={`/create/write/${w.id}`}
                    className="text-xs text-amber-400 font-semibold flex items-center gap-1"
                  >
                    <span>Open</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ))}

              {associatedSongs.length === 0 && associatedWritings.length === 0 && (
                <p className="text-xs text-prime-textMuted text-center py-4">
                  No songs or writing drafts explicitly tagged with this skill yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Associated Exercises, Studies, Breakthroughs */}
        <div className="lg:col-span-5 space-y-6">
          {/* Associated Exercises */}
          <div className="rounded-2xl border border-prime-borderSubtle bg-prime-card/90 p-5 space-y-4 shadow-prime-sm">
            <div className="flex items-center justify-between pb-3 border-b border-prime-borderSubtle">
              <h3 className="text-sm font-bold tracking-tight text-prime-text uppercase flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-emerald-400" />
                Curated Drills ({associatedExercises.length})
              </h3>
            </div>

            <div className="space-y-2.5">
              {associatedExercises.map((ex) => (
                <div
                  key={ex.id}
                  className="rounded-xl border border-prime-borderSubtle bg-prime-surface/70 p-3 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-prime-text">
                      {ex.title}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-prime-surface border border-prime-borderSubtle text-prime-textMuted">
                      {ex.estimatedDuration}m
                    </span>
                  </div>
                  <p className="text-[11px] text-prime-textSecondary line-clamp-2 leading-relaxed">
                    {ex.description}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-prime-textMuted font-mono">
                      Completed: {ex.sessionCount || 0} times
                    </span>
                    <Link
                      href={`/train/${ex.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                    >
                      <span>Start Drill</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Associated Study Sessions */}
          <div className="rounded-2xl border border-prime-borderSubtle bg-prime-card/90 p-5 space-y-4 shadow-prime-sm">
            <div className="flex items-center justify-between pb-3 border-b border-prime-borderSubtle">
              <h3 className="text-sm font-bold tracking-tight text-prime-text uppercase flex items-center gap-2">
                <Compass className="h-4 w-4 text-sky-400" />
                Discovery Dissections ({associatedStudies.length})
              </h3>
            </div>

            <div className="space-y-2.5">
              {associatedStudies.map((st) => (
                <div
                  key={st.id}
                  className="rounded-xl border border-prime-borderSubtle bg-prime-surface/70 p-3 space-y-1.5"
                >
                  <span className="font-bold text-xs text-prime-text">
                    {st.reference
                      ? `"${st.reference.title}" — ${st.reference.creator}`
                      : `Study Session (${st.focus})`}
                  </span>
                  {st.takeaway && (
                    <p className="text-[11px] text-prime-textSecondary line-clamp-2">
                      Takeaway: {st.takeaway}
                    </p>
                  )}
                  <p className="text-[10px] text-prime-textMuted font-mono">
                    {st.focus} Focus • {Math.round(st.durationSeconds / 60)} min
                  </p>
                </div>
              ))}

              {associatedStudies.length === 0 && (
                <p className="text-xs text-prime-textMuted text-center py-4">
                  No track dissections linked to this skill focus yet.
                </p>
              )}
            </div>
          </div>

          {/* Breakthroughs & Epiphanies */}
          {associatedBreakthroughs.length > 0 && (
            <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-950/20 via-prime-card to-prime-surface p-5 space-y-3 shadow-prime-sm">
              <h3 className="text-sm font-bold tracking-tight text-purple-300 uppercase flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                Skill Breakthroughs ({associatedBreakthroughs.length})
              </h3>
              <div className="space-y-2">
                {associatedBreakthroughs.map((br) => (
                  <div
                    key={br.id}
                    className="rounded-xl border border-purple-500/20 bg-prime-surface/80 p-3 space-y-1"
                  >
                    <p className="font-bold text-xs text-prime-text">
                      {br.title}
                    </p>
                    <p className="text-[11px] text-prime-textSecondary">
                      {br.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Bottlenecks */}
          {associatedBottlenecks && associatedBottlenecks.length > 0 && (
            <div className="rounded-2xl border border-rose-500/20 bg-gradient-to-br from-rose-950/20 via-prime-card to-prime-surface p-5 space-y-3 shadow-prime-sm">
              <h3 className="text-sm font-bold tracking-tight text-rose-300 uppercase flex items-center gap-2">
                <Flame className="h-4 w-4 text-rose-400" />
                Identified Bottlenecks ({associatedBottlenecks.length})
              </h3>
              <div className="space-y-2">
                {associatedBottlenecks.map((bn) => (
                  <div
                    key={bn.id}
                    className="rounded-xl border border-rose-500/20 bg-prime-surface/80 p-3 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-prime-text">{bn.category}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 uppercase">
                        {bn.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-prime-textSecondary">
                      {bn.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Reflection Mentions */}
          {recentReflectionMentions && recentReflectionMentions.length > 0 && (
            <div className="rounded-2xl border border-sky-500/20 bg-prime-card p-5 space-y-3 shadow-prime-sm">
              <h3 className="text-sm font-bold tracking-tight text-sky-300 uppercase flex items-center gap-2">
                <FileText className="h-4 w-4 text-sky-400" />
                Reflection Mentions ({recentReflectionMentions.length})
              </h3>
              <div className="space-y-2">
                {recentReflectionMentions.map((ref, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-sky-500/20 bg-prime-surface/80 p-3 space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-sky-400">
                      <span>{ref.date}</span>
                      <span>{ref.skillWorked || "Practice Focus"}</span>
                    </div>
                    {ref.learned && (
                      <p className="text-[11px] text-prime-textSecondary line-clamp-2">
                        &ldquo;{ref.learned}&rdquo;
                      </p>
                    )}
                    {ref.difficulties && (
                      <p className="text-[10px] text-rose-400/80 line-clamp-1">
                        Friction: {ref.difficulties}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
