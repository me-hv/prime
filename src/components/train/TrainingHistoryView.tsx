"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import {
  History,
  Clock,
  Flame,
  Gauge,
  Sparkles,
  FileText,
  Calendar,
  ArrowUpRight,
  Filter,
  CheckCircle2,
} from "lucide-react";
import {
  TrainingSessionData,
  ExerciseCategory,
  EXERCISE_CATEGORY_CONFIGS,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TrainingHistoryViewProps {
  sessions: TrainingSessionData[];
  className?: string;
}

export function TrainingHistoryView({
  sessions,
  className,
}: TrainingHistoryViewProps) {
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const filteredSessions = sessions.filter((s) => {
    if (selectedCategory === "ALL") return true;
    return s.exercise?.category === selectedCategory;
  });

  const totalMinutes = Math.round(
    sessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60
  );

  const avgEffort =
    sessions.length > 0
      ? (
          sessions.reduce((sum, s) => sum + (s.effortRating || 0), 0) /
          sessions.filter((s) => s.effortRating).length
        ).toFixed(1)
      : "0.0";

  return (
    <div className={cn("space-y-6", className)}>
      {/* Overview Stats Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface p-4">
          <div className="flex items-center gap-2 text-prime-textMuted text-xs font-mono mb-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-orange-400" />
            <span>TOTAL SESSIONS</span>
          </div>
          <p className="text-2xl font-black font-mono text-prime-text">
            {sessions.length}
          </p>
        </div>

        <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface p-4">
          <div className="flex items-center gap-2 text-prime-textMuted text-xs font-mono mb-1">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            <span>TOTAL PRACTICE TIME</span>
          </div>
          <p className="text-2xl font-black font-mono text-prime-text">
            {totalMinutes} <span className="text-xs text-prime-textMuted font-normal">mins</span>
          </p>
        </div>

        <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface p-4">
          <div className="flex items-center gap-2 text-prime-textMuted text-xs font-mono mb-1">
            <Flame className="h-3.5 w-3.5 text-yellow-400" />
            <span>AVG INTENSITY</span>
          </div>
          <p className="text-2xl font-black font-mono text-prime-text">
            {avgEffort} <span className="text-xs text-prime-textMuted font-normal">/ 5.0</span>
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-prime-textMuted" />
          <span className="text-xs font-mono text-prime-textMuted uppercase">
            Filter History:
          </span>
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-xl bg-prime-surface border border-prime-borderSubtle px-3 py-1.5 text-xs text-prime-text focus:outline-none focus:border-orange-500/50"
        >
          <option value="ALL">All Categories</option>
          <option value="FLOW">Flow & Cadence</option>
          <option value="WRITING">Writing Sprints</option>
          <option value="RAP">Rap Delivery</option>
          <option value="RHYME">Rhymes</option>
          <option value="FREESTYLE">Freestyle</option>
          <option value="STORYTELLING">Storytelling</option>
          <option value="VOCABULARY">Vocabulary</option>
          <option value="PRODUCTION">Production</option>
          <option value="EAR_TRAINING">Ear Training</option>
        </select>
      </div>

      {/* Session History List */}
      {filteredSessions.length > 0 ? (
        <div className="space-y-3">
          {filteredSessions.map((session) => {
            const exerciseCategory = session.exercise?.category as ExerciseCategory | undefined;
            const catConfig = (exerciseCategory && EXERCISE_CATEGORY_CONFIGS[exerciseCategory]) || {
              label: exerciseCategory || "Practice",
              badgeClass: "bg-orange-500/15 text-orange-300 border-orange-500/30",
            };

            const minutes = Math.floor(session.durationSeconds / 60);
            const seconds = session.durationSeconds % 60;
            const timeStr = `${minutes}m ${seconds.toString().padStart(2, "0")}s`;

            return (
              <div
                key={session.id}
                className="rounded-2xl border border-prime-borderSubtle bg-prime-surface p-5 transition-all hover:border-prime-border space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border",
                        catConfig.badgeClass
                      )}
                    >
                      {catConfig.label}
                    </span>
                    <h4 className="text-base font-bold text-prime-text">
                      {session.exercise?.title || "Practice Drill"}
                    </h4>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-prime-textMuted">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(session.createdAt), "MMM d, yyyy • h:mm a")}
                    </span>
                    <span className="flex items-center gap-1.5 text-prime-text">
                      <Clock className="h-3 w-3 text-orange-400" />
                      {timeStr}
                    </span>
                  </div>
                </div>

                {/* Ratings Strip */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono py-2 px-3 rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle/60">
                  <div className="flex items-center gap-1.5">
                    <Flame className="h-3.5 w-3.5 text-orange-400" />
                    <span className="text-prime-textMuted">Effort:</span>
                    <span className="font-bold text-prime-text">
                      {session.effortRating || "—"} / 5
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Gauge className="h-3.5 w-3.5 text-amber-400" />
                    <span className="text-prime-textMuted">Difficulty:</span>
                    <span className="font-bold text-prime-text">
                      {session.difficultyRating || "—"} / 5
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
                    <span className="text-prime-textMuted">Confidence:</span>
                    <span className="font-bold text-prime-text">
                      {session.confidenceRating || "—"} / 5
                    </span>
                  </div>

                  {session.writingDocument && (
                    <Link
                      href={`/create/${session.writingDocument.id}`}
                      className="ml-auto flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>View Output Draft ({session.writingDocument.wordCount} words)</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>

                {/* Reflection Notes */}
                {session.notes && (
                  <div className="text-xs text-prime-textSecondary leading-relaxed bg-prime-surfaceSubtle/40 p-3 rounded-xl border border-prime-borderSubtle/40">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-prime-textMuted block mb-1">
                      Artist Reflections:
                    </span>
                    <p className="italic">{session.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-prime-borderSubtle bg-prime-surface p-12 text-center space-y-3">
          <History className="h-10 w-10 text-prime-textMuted mx-auto" />
          <h3 className="text-base font-bold text-prime-text">No practice sessions logged yet</h3>
          <p className="text-xs text-prime-textMuted max-w-sm mx-auto">
            Complete your first daily drill or writing sprint to build your training history and streak.
          </p>
        </div>
      )}
    </div>
  );
}
