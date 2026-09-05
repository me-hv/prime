"use client";

import * as React from "react";
import { useState } from "react";
import {
  DailyReflectionData,
  TodayActivityContext,
} from "@/lib/types";
import {
  getDailyReflection,
  getTodayActivityContext,
  saveDailyReflection,
} from "@/actions/reflection";
import { getTodayDateString } from "@/lib/utils";
import {
  BookMarked,
  CheckCircle2,
  Calendar,
  Sparkles,
  Flame,
  PenTool,
  Headphones,
  Disc,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DailyReflectionViewProps {
  initialReflection: DailyReflectionData | null;
  initialContext: TodayActivityContext;
  pastReflections: DailyReflectionData[];
  onReflectionSaved: (ref: DailyReflectionData) => void;
}

export function DailyReflectionView({
  initialReflection,
  initialContext,
  pastReflections,
  onReflectionSaved,
}: DailyReflectionViewProps) {
  const [selectedDate, setSelectedDate] = useState(
    initialReflection?.date || getTodayDateString()
  );
  const [context, setContext] = useState<TodayActivityContext>(initialContext);
  const [loadingContext, setLoadingContext] = useState(false);

  // Form Fields
  const [created, setCreated] = useState(initialReflection?.created || "");
  const [finished, setFinished] = useState(initialReflection?.finished || "");
  const [unfinished, setUnfinished] = useState(initialReflection?.unfinished || "");
  const [practiced, setPracticed] = useState(initialReflection?.practiced || "");
  const [skillWorked, setSkillWorked] = useState(initialReflection?.skillWorked || "");
  const [difficulties, setDifficulties] = useState(initialReflection?.difficulties || "");
  const [studied, setStudied] = useState(initialReflection?.studied || "");
  const [learned, setLearlearned] = useState(initialReflection?.learned || "");
  const [energy, setEnergy] = useState(initialReflection?.energy || "");
  const [drained, setDrained] = useState(initialReflection?.drained || "");
  const [distractions, setDistractions] = useState(initialReflection?.distractions || "");
  const [clicked, setClicked] = useState(initialReflection?.clicked || "");
  const [surprised, setSurprised] = useState(initialReflection?.surprised || "");
  const [continueItem, setContinueItem] = useState(initialReflection?.continueItem || "");
  const [improveItem, setImproveItem] = useState(initialReflection?.improveItem || "");
  const [tomorrowPriority, setTomorrowPriority] = useState(
    initialReflection?.tomorrowPriority || ""
  );

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // When date changes, load that date's reflection and context
  const handleDateChange = async (newDate: string) => {
    setSelectedDate(newDate);
    setLoadingContext(true);
    try {
      const [refData, ctxData] = await Promise.all([
        getDailyReflection(newDate),
        getTodayActivityContext(newDate),
      ]);

      setContext(ctxData);
      if (refData) {
        setCreated(refData.created || "");
        setFinished(refData.finished || "");
        setUnfinished(refData.unfinished || "");
        setPracticed(refData.practiced || "");
        setSkillWorked(refData.skillWorked || "");
        setDifficulties(refData.difficulties || "");
        setStudied(refData.studied || "");
        setLearlearned(refData.learned || "");
        setEnergy(refData.energy || "");
        setDrained(refData.drained || "");
        setDistractions(refData.distractions || "");
        setClicked(refData.clicked || "");
        setSurprised(refData.surprised || "");
        setContinueItem(refData.continueItem || "");
        setImproveItem(refData.improveItem || "");
        setTomorrowPriority(refData.tomorrowPriority || "");
      } else {
        // Clear form for fresh entry
        setCreated("");
        setFinished("");
        setUnfinished("");
        setPracticed("");
        setSkillWorked("");
        setDifficulties("");
        setStudied("");
        setLearlearned("");
        setEnergy("");
        setDrained("");
        setDistractions("");
        setClicked("");
        setSurprised("");
        setContinueItem("");
        setImproveItem("");
        setTomorrowPriority("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingContext(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      const saved = await saveDailyReflection({
        date: selectedDate,
        created,
        finished,
        unfinished,
        practiced,
        skillWorked,
        difficulties,
        studied,
        learned,
        energy,
        drained,
        distractions,
        clicked,
        surprised,
        continueItem,
        improveItem,
        tomorrowPriority,
        snapshotStats: JSON.stringify({
          writingDraftsCount: context.writingDraftsCount,
          trainingMinutes: context.trainingMinutes,
          exercisesCompletedCount: context.exercisesCompletedCount,
          studySessionsCount: context.studySessionsCount,
          songsUpdatedCount: context.songsUpdatedCount,
          totalCreativeMinutes: context.totalCreativeMinutes,
        }),
      });

      onReflectionSaved(saved);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save reflection.");
    } finally {
      setSaving(false);
    }
  };

  const isToday = selectedDate === getTodayDateString();

  return (
    <div className="space-y-6">
      {/* Date Bar & Past Reflections Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-prime-surface p-4 rounded-xl border border-prime-borderSubtle">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-indigo-400 shrink-0" />
          <span className="text-xs font-bold text-prime-text">Reflection Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="rounded-lg bg-prime-surfaceSubtle border border-prime-borderSubtle px-2.5 py-1 text-xs text-prime-text focus:outline-none focus:border-indigo-500 font-mono"
          />
          {isToday && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 uppercase">
              Today
            </span>
          )}
        </div>

        {/* Quick Jump past dates */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] text-prime-textMuted font-mono mr-1">History:</span>
          {pastReflections.slice(0, 5).map((r) => (
            <button
              key={r.date}
              onClick={() => handleDateChange(r.date)}
              className={cn(
                "px-2 py-0.5 rounded text-[10px] font-mono transition-all border",
                selectedDate === r.date
                  ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-bold"
                  : "bg-prime-surfaceSubtle text-prime-textMuted border-prime-borderSubtle hover:text-prime-text"
              )}
            >
              {r.date.slice(5)}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Activity Context Banner */}
      <div className={cn("rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/30 via-prime-surface to-prime-surface p-5 shadow-prime-sm transition-opacity duration-200", loadingContext && "opacity-50")}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-300 font-bold">
                PRIME Activity Snapshot for {selectedDate}
              </span>
            </div>
            <p className="text-xs text-prime-textMuted">
              {context.totalCreativeMinutes > 0
                ? `You logged ${context.totalCreativeMinutes} total creative minutes across ${context.activities.length} session(s) on this date.`
                : "No creative activities recorded yet on this date."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-mono">
              <PenTool className="h-3 w-3" />
              <span>{context.writingDraftsCount} drafts</span>
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-300 border border-orange-500/20 text-xs font-mono">
              <Flame className="h-3 w-3" />
              <span>{context.trainingMinutes}m practice ({context.exercisesCompletedCount} drills)</span>
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/20 text-xs font-mono">
              <Headphones className="h-3 w-3" />
              <span>{context.studySessionsCount} studies</span>
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-mono">
              <Disc className="h-3 w-3" />
              <span>{context.songsUpdatedCount} songs updated</span>
            </span>
          </div>
        </div>
      </div>

      {/* Structured Reflection Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Creation & Output */}
        <div className="rounded-2xl border border-prime-borderSubtle bg-prime-surface p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-prime-borderSubtle text-amber-400">
            <PenTool className="h-4 w-4" />
            <h3 className="text-xs font-bold font-mono tracking-wider uppercase">
              1. Creation & Output
            </h3>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-prime-text block">
              What did I create today?
            </label>
            <textarea
              rows={2}
              value={created}
              onChange={(e) => setCreated(e.target.value)}
              placeholder="Verses drafted, hooks conceived, beats arranged..."
              className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle p-3 text-xs text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-prime-text block">
                What did I finish?
              </label>
              <input
                type="text"
                value={finished}
                onChange={(e) => setFinished(e.target.value)}
                placeholder="Finished a 16-bar verse..."
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-prime-text block">
                What did I leave unfinished?
              </label>
              <input
                type="text"
                value={unfinished}
                onChange={(e) => setUnfinished(e.target.value)}
                placeholder="Hook transition needs bridge..."
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* 2. Practice & Deliberate Training */}
        <div className="rounded-2xl border border-prime-borderSubtle bg-prime-surface p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-prime-borderSubtle text-orange-400">
            <Flame className="h-4 w-4" />
            <h3 className="text-xs font-bold font-mono tracking-wider uppercase">
              2. Deliberate Practice & Drills
            </h3>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-prime-text block">
              What did I practice and what skills did I train?
            </label>
            <textarea
              rows={2}
              value={practiced}
              onChange={(e) => setPracticed(e.target.value)}
              placeholder="Metronome syncopation at 140 BPM, multi-syllabic rhyme chains..."
              className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle p-3 text-xs text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-prime-text block">
              What felt difficult / where was the friction?
            </label>
            <input
              type="text"
              value={difficulties}
              onChange={(e) => setDifficulties(e.target.value)}
              placeholder="Maintaining pocket during 32nd note bursts..."
              className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* 3. Learning & Masterwork Study */}
        <div className="rounded-2xl border border-prime-borderSubtle bg-prime-surface p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-prime-borderSubtle text-sky-400">
            <Headphones className="h-4 w-4" />
            <h3 className="text-xs font-bold font-mono tracking-wider uppercase">
              3. Study & Ingestion
            </h3>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-prime-text block">
              What masterwork did I study and what did I learn?
            </label>
            <textarea
              rows={3}
              value={learned}
              onChange={(e) => setLearlearned(e.target.value)}
              placeholder="Dissected André 3000's verse on 'Aquemini' — learned how conversational pauses heighten lyrical impact..."
              className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle p-3 text-xs text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>
        </div>

        {/* 4. Mindset, Energy & Distractions */}
        <div className="rounded-2xl border border-prime-borderSubtle bg-prime-surface p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-prime-borderSubtle text-emerald-400">
            <Sparkles className="h-4 w-4" />
            <h3 className="text-xs font-bold font-mono tracking-wider uppercase">
              4. Mindset & Energy
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-prime-text block">
                What gave me energy?
              </label>
              <input
                type="text"
                value={energy}
                onChange={(e) => setEnergy(e.target.value)}
                placeholder="Writing first thing in the morning..."
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-prime-text block">
                What drained / distracted me?
              </label>
              <input
                type="text"
                value={drained}
                onChange={(e) => setDrained(e.target.value)}
                placeholder="Social media browsing, self-doubt..."
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-prime-text block">
              What clicked today / What surprised me?
            </label>
            <input
              type="text"
              value={clicked}
              onChange={(e) => setClicked(e.target.value)}
              placeholder="Realized hook melody needs fewer words to breathe..."
              className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* 5. Tomorrow's Creative Priority (Span full width) */}
        <div className="md:col-span-2 rounded-2xl border border-indigo-500/40 bg-indigo-950/20 p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-indigo-500/30 text-indigo-300">
            <BookMarked className="h-4 w-4" />
            <h3 className="text-xs font-bold font-mono tracking-wider uppercase">
              5. Tomorrow&apos;s Creative Priority
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-indigo-200 block">
                Primary Creative Mission For Tomorrow *
              </label>
              <input
                type="text"
                value={tomorrowPriority}
                onChange={(e) => setTomorrowPriority(e.target.value)}
                placeholder="e.g. Complete Verse 2 for Track 01 and record scratch vocal demo"
                className="w-full rounded-xl bg-prime-surface border border-indigo-500/30 px-3 py-2.5 text-xs sm:text-sm text-prime-text placeholder:text-prime-textMuted/50 focus:outline-none focus:border-indigo-400 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-prime-textMuted block">
                What to improve?
              </label>
              <input
                type="text"
                value={improveItem}
                onChange={(e) => setImproveItem(e.target.value)}
                placeholder="Stay in studio chair 30m straight..."
                className="w-full rounded-xl bg-prime-surface border border-prime-borderSubtle px-3 py-2 text-xs text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Action Bar */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-prime-borderSubtle">
        {savedSuccess ? (
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
            <CheckCircle2 className="h-4 w-4" />
            <span>Daily Reflection Saved & Creative Streak Updated!</span>
          </div>
        ) : <div />}

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500 text-white text-xs sm:text-sm font-bold hover:bg-indigo-400 disabled:opacity-50 shadow-prime-md transition-all active:scale-[0.98]"
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>{saving ? "Saving Reflection..." : "Save Daily Reflection"}</span>
        </button>
      </div>
    </div>
  );
}
