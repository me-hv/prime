"use client";

import * as React from "react";
import Link from "next/link";
import {
  Clock,
  ArrowRight,
  Zap,
  Target,
  Music,
} from "lucide-react";
import { ExerciseData, EXERCISE_CATEGORY_CONFIGS } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TodayTrainingCardProps {
  recommendation: {
    exercise: ExerciseData;
    reason: string;
  } | null;
  onStart?: (exercise: ExerciseData) => void;
  className?: string;
}

export function TodayTrainingCard({
  recommendation,
  onStart,
  className,
}: TodayTrainingCardProps) {
  if (!recommendation) return null;

  const { exercise, reason } = recommendation;
  const catConfig = EXERCISE_CATEGORY_CONFIGS[exercise.category] || {
    label: exercise.category,
    badgeClass: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 via-prime-surface to-prime-surface p-6 sm:p-7 shadow-prime-md",
        className
      )}
    >
      {/* Background glow & accents */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-12 h-32 w-32 rounded-full bg-yellow-500/5 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          {/* Top Tag */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-extrabold uppercase tracking-wider bg-orange-500 text-black shadow-prime-sm">
              <Zap className="h-3 w-3 fill-black" />
              TODAY&apos;S DAILY DRILL
            </span>

            <span
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold border",
                catConfig.badgeClass
              )}
            >
              {catConfig.label}
            </span>

            {exercise.defaultBpm && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono text-prime-textMuted bg-prime-surfaceSubtle border border-prime-borderSubtle">
                <Music className="h-2.5 w-2.5 text-orange-400" />
                {exercise.defaultBpm} BPM
              </span>
            )}

            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-prime-textMuted ml-1">
              <Clock className="h-3 w-3 text-orange-400" />
              {exercise.estimatedDuration} mins
            </span>
          </div>

          {/* Exercise Title */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-prime-text">
              {exercise.title}
            </h2>
            <p className="text-xs sm:text-sm text-prime-textSecondary mt-1 leading-relaxed">
              {exercise.description}
            </p>
          </div>

          {/* Smart Recommendation Reason */}
          <div className="flex items-start gap-2 pt-1 text-xs text-orange-300/90 font-medium">
            <Target className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
            <span>{reason}</span>
          </div>

          {/* Linked Skills */}
          {exercise.skills && exercise.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {exercise.skills.map((s) => (
                <span
                  key={s.id}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-prime-surfaceSubtle/80 text-prime-textMuted border border-prime-borderSubtle"
                >
                  #{s.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="shrink-0 flex items-center md:flex-col justify-end gap-3">
          {onStart ? (
            <button
              onClick={() => onStart(exercise)}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-sm tracking-wide shadow-prime-md transition-all active:scale-[0.98]"
            >
              <span>Begin Practice</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <Link
              href={`/train/${exercise.slug || exercise.id}`}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-sm tracking-wide shadow-prime-md transition-all active:scale-[0.98]"
            >
              <span>Begin Practice</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}

          <span className="text-[11px] font-mono text-prime-textMuted text-center block">
            Sample accuracy • Zero drift
          </span>
        </div>
      </div>
    </div>
  );
}
