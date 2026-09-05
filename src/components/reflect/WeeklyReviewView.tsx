"use client";

import * as React from "react";
import { useState } from "react";
import {
  WeeklyReviewData,
  WeeklyDiagnosticInsight,
} from "@/lib/types";
import { saveWeeklyReview } from "@/actions/reflection";
import {
  CalendarCheck,
  Sparkles,
  Flame,
  PenTool,
  Headphones,
  Disc,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
} from "lucide-react";

interface WeeklyReviewViewProps {
  initialReview: WeeklyReviewData | null;
  insight: WeeklyDiagnosticInsight;
  onReviewSaved: (review: WeeklyReviewData) => void;
}

export function WeeklyReviewView({
  initialReview,
  insight,
  onReviewSaved,
}: WeeklyReviewViewProps) {
  const [outputNotes, setOutputNotes] = useState(
    initialReview?.outputNotes || ""
  );
  const [learningNotes, setLearningNotes] = useState(
    initialReview?.learningNotes || ""
  );
  const [weaknessesNotes, setWeaknessesNotes] = useState(
    initialReview?.weaknessesNotes || ""
  );
  const [momentumNotes, setMomentumNotes] = useState(
    initialReview?.momentumNotes || ""
  );
  const [breakthroughNotes, setBreakthroughNotes] = useState(
    initialReview?.breakthroughNotes || ""
  );
  const [nextFocus, setNextFocus] = useState(initialReview?.nextFocus || "");

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      const saved = await saveWeeklyReview({
        weekStart: insight.weekStart,
        weekEnd: insight.weekEnd,
        outputNotes,
        learningNotes,
        weaknessesNotes,
        momentumNotes,
        breakthroughNotes,
        nextFocus,
        statsSummary: JSON.stringify(insight),
      });

      onReviewSaved(saved);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save weekly review.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Date Range */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-prime-surface p-4 rounded-xl border border-prime-borderSubtle">
        <div className="flex items-center gap-2">
          <CalendarCheck className="h-4 w-4 text-sky-400" />
          <h2 className="text-sm sm:text-base font-bold text-prime-text">
            Weekly Creative Review: {insight.weekStart} – {insight.weekEnd}
          </h2>
        </div>
        <span className="text-xs text-prime-textMuted font-mono">
          7-Day Retrospective & Strategic Calibration
        </span>
      </div>

      {/* 7-Day Actual Output Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-prime-surface/70 border border-prime-borderSubtle rounded-xl p-4">
          <div className="flex items-center gap-2 text-prime-textMuted text-xs mb-1">
            <PenTool className="h-3.5 w-3.5 text-amber-400" />
            <span>Drafts Written</span>
          </div>
          <div className="text-2xl font-black text-prime-text">
            {insight.totalWritingsCreated}
          </div>
          <p className="text-[11px] text-prime-textMuted mt-0.5">
            new lyrics & bars
          </p>
        </div>

        <div className="bg-prime-surface/70 border border-prime-borderSubtle rounded-xl p-4">
          <div className="flex items-center gap-2 text-prime-textMuted text-xs mb-1">
            <Flame className="h-3.5 w-3.5 text-orange-400" />
            <span>Gym Volume</span>
          </div>
          <div className="text-2xl font-black text-prime-text">
            {insight.totalMinutesPracticed} <span className="text-xs font-normal text-prime-textMuted">min</span>
          </div>
          <p className="text-[11px] text-prime-textMuted mt-0.5">
            across {insight.totalDrillsCompleted} drills
          </p>
        </div>

        <div className="bg-prime-surface/70 border border-prime-borderSubtle rounded-xl p-4">
          <div className="flex items-center gap-2 text-prime-textMuted text-xs mb-1">
            <Headphones className="h-3.5 w-3.5 text-sky-400" />
            <span>References Studied</span>
          </div>
          <div className="text-2xl font-black text-prime-text">
            {insight.totalReferencesStudied}
          </div>
          <p className="text-[11px] text-prime-textMuted mt-0.5">
            song anatomy breakdowns
          </p>
        </div>

        <div className="bg-prime-surface/70 border border-prime-borderSubtle rounded-xl p-4">
          <div className="flex items-center gap-2 text-prime-textMuted text-xs mb-1">
            <Disc className="h-3.5 w-3.5 text-purple-400" />
            <span>Songs Finished</span>
          </div>
          <div className="text-2xl font-black text-prime-text">
            {insight.totalSongsFinished}
          </div>
          <p className="text-[11px] text-prime-textMuted mt-0.5">
            completed catalog tracks
          </p>
        </div>
      </div>

      {/* Deterministic PRIME Insights Hero Card */}
      <div className="rounded-2xl border border-sky-500/35 bg-gradient-to-r from-sky-950/40 via-prime-surface to-prime-surface p-5 sm:p-6 shadow-prime-md space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-sky-400" />
          <h3 className="text-xs font-bold font-mono tracking-wider uppercase text-sky-300">
            PRIME Insight — Deterministic Weekly Diagnosis
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-prime-surfaceSubtle/60 border border-prime-borderSubtle">
            <span className="text-[10px] font-mono uppercase tracking-wider text-prime-textMuted font-bold block mb-1">
              Discipline Allocation:
            </span>
            <p className="text-prime-text font-bold">
              Most Practiced: <span className="text-amber-300">{insight.mostPracticedCategory}</span>
            </p>
            <p className="text-prime-textMuted mt-0.5">
              Least Practiced: <span className="text-rose-300">{insight.leastPracticedCategory}</span>
            </p>
          </div>

          <div className="p-3 rounded-xl bg-prime-surfaceSubtle/60 border border-prime-borderSubtle">
            <span className="text-[10px] font-mono uppercase tracking-wider text-prime-textMuted font-bold block mb-1">
              Active Bottleneck:
            </span>
            <p className="text-rose-300 font-medium line-clamp-2">
              {insight.recurringBottleneck}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-prime-surfaceSubtle/60 border border-prime-borderSubtle">
            <span className="text-[10px] font-mono uppercase tracking-wider text-prime-textMuted font-bold block mb-1">
              Suggested Next Focus:
            </span>
            <p className="text-sky-300 font-bold">
              {insight.suggestedFocus}
            </p>
          </div>
        </div>

        {/* Actionable Recommendation */}
        <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs flex items-start gap-2.5">
          <Lightbulb className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
          <p className="text-sky-200 leading-relaxed">
            <strong className="text-white">Actionable Recommendation:</strong>{" "}
            {insight.actionableRecommendation}
          </p>
        </div>
      </div>

      {/* Structured Review Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Output & Pride */}
        <div className="rounded-2xl border border-prime-borderSubtle bg-prime-surface p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-prime-borderSubtle text-amber-400">
            <PenTool className="h-4 w-4" />
            <h3 className="text-xs font-bold font-mono tracking-wider uppercase">
              1. Creative Output & Pride
            </h3>
          </div>
          <p className="text-[11px] text-prime-textMuted">
            What did I create or complete this week? What piece of writing or arrangement am I genuinely proud of?
          </p>
          <textarea
            rows={4}
            value={outputNotes}
            onChange={(e) => setOutputNotes(e.target.value)}
            placeholder="e.g. Finished the full draft of Track 01, constructed 3 multisyllabic rhyme schemes..."
            className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle p-3 text-xs sm:text-sm text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-sky-500 resize-none leading-relaxed"
          />
        </div>

        {/* 2. Learning & Inspiration */}
        <div className="rounded-2xl border border-prime-borderSubtle bg-prime-surface p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-prime-borderSubtle text-sky-400">
            <Headphones className="h-4 w-4" />
            <h3 className="text-xs font-bold font-mono tracking-wider uppercase">
              2. Learning & Inspiration
            </h3>
          </div>
          <p className="text-[11px] text-prime-textMuted">
            What was the most impactful song or technique I studied this week? What did it teach me?
          </p>
          <textarea
            rows={4}
            value={learningNotes}
            onChange={(e) => setLearningNotes(e.target.value)}
            placeholder="e.g. Studying MF DOOM's internal rhyming showed me how to slant-rhyme across bar lines..."
            className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle p-3 text-xs sm:text-sm text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-sky-500 resize-none leading-relaxed"
          />
        </div>

        {/* 3. Bottlenecks & Friction */}
        <div className="rounded-2xl border border-prime-borderSubtle bg-prime-surface p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-prime-borderSubtle text-rose-400">
            <AlertTriangle className="h-4 w-4" />
            <h3 className="text-xs font-bold font-mono tracking-wider uppercase">
              3. Friction & Bottlenecks
            </h3>
          </div>
          <p className="text-[11px] text-prime-textMuted">
            What weakness or creative blocker appeared repeatedly? Where did I get stuck?
          </p>
          <textarea
            rows={4}
            value={weaknessesNotes}
            onChange={(e) => setWeaknessesNotes(e.target.value)}
            placeholder="e.g. Struggled to complete verses after getting excited about a new hook..."
            className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle p-3 text-xs sm:text-sm text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-sky-500 resize-none leading-relaxed"
          />
        </div>

        {/* 4. Momentum & Breakthroughs */}
        <div className="rounded-2xl border border-prime-borderSubtle bg-prime-surface p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-prime-borderSubtle text-emerald-400">
            <TrendingUp className="h-4 w-4" />
            <h3 className="text-xs font-bold font-mono tracking-wider uppercase">
              4. Momentum & Breakthroughs
            </h3>
          </div>
          <div className="space-y-2">
            <div>
              <label className="text-[11px] font-semibold text-prime-textMuted block mb-1">
                Studio Routine & Momentum Notes
              </label>
              <textarea
                rows={2}
                value={momentumNotes}
                onChange={(e) => setMomentumNotes(e.target.value)}
                placeholder="e.g. 10-minute morning sprints eliminated writer's block..."
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle p-2.5 text-xs text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-sky-500 resize-none leading-relaxed"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-prime-textMuted block mb-1">
                Artistic Quantum Leaps
              </label>
              <textarea
                rows={2}
                value={breakthroughNotes}
                onChange={(e) => setBreakthroughNotes(e.target.value)}
                placeholder="e.g. Discovered behind-the-beat vocal delivery pocket..."
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle p-2.5 text-xs text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-sky-500 resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* 5. Next Week Priority (Full Width) */}
        <div className="md:col-span-2 rounded-2xl border border-sky-500/40 bg-sky-950/20 p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-sky-500/30 text-sky-300">
            <CalendarCheck className="h-4 w-4" />
            <h3 className="text-xs font-bold font-mono tracking-wider uppercase">
              5. Next Week&apos;s Primary Focus & Target Skills
            </h3>
          </div>
          <p className="text-[11px] text-prime-textMuted">
            What is the single most important artistic priority for next week? Which project or skill deserves undivided focus?
          </p>
          <textarea
            rows={3}
            value={nextFocus}
            onChange={(e) => setNextFocus(e.target.value)}
            placeholder="e.g. Dedicate 45 minutes daily to 16-bar finishing drills and record 2 final vocal demo passes."
            className="w-full rounded-xl bg-prime-surface border border-sky-500/30 p-3 text-xs sm:text-sm text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-sky-400 resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-prime-borderSubtle">
        {savedSuccess ? (
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
            <CheckCircle2 className="h-4 w-4" />
            <span>Weekly Review Saved Successfully!</span>
          </div>
        ) : <div />}

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500 text-white text-xs sm:text-sm font-bold hover:bg-sky-400 disabled:opacity-50 shadow-prime-md transition-all active:scale-[0.98]"
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>{saving ? "Saving Audit..." : "Save Weekly Creative Audit"}</span>
        </button>
      </div>
    </div>
  );
}
