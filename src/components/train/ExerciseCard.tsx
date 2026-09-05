"use client";

import * as React from "react";
import Link from "next/link";
import {
  Clock,
  Flame,
  Mic2,
  Sliders,
  BookOpen,
  Activity,
  Music,
  Headphones,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  ExerciseData,
  ExerciseCategory,
  EXERCISE_CATEGORY_CONFIGS,
  DIFFICULTY_CONFIGS,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<ExerciseCategory, React.ElementType> = {
  RAP: Mic2,
  FLOW: Activity,
  WRITING: Flame,
  RHYME: Sparkles,
  FREESTYLE: Mic2,
  STORYTELLING: BookOpen,
  VOCABULARY: BookOpen,
  PRODUCTION: Sliders,
  EAR_TRAINING: Headphones,
};

interface ExerciseCardProps {
  exercise: ExerciseData;
  onStart?: (exercise: ExerciseData) => void;
  className?: string;
}

export function ExerciseCard({
  exercise,
  onStart,
  className,
}: ExerciseCardProps) {
  const catConfig = EXERCISE_CATEGORY_CONFIGS[exercise.category] || {
    label: exercise.category,
    badgeClass: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  };

  const diffConfig = DIFFICULTY_CONFIGS[exercise.difficulty] || {
    label: exercise.difficulty,
    badgeClass: "bg-prime-surfaceSubtle text-prime-textMuted border-prime-borderSubtle",
    dots: 1,
  };

  const Icon = CATEGORY_ICONS[exercise.category] || Flame;
  const isPracticed = (exercise.sessionCount || 0) > 0;

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border border-prime-borderSubtle bg-prime-surface p-5 transition-all duration-200 hover:border-prime-border hover:shadow-prime-md hover:-translate-y-0.5",
        className
      )}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border",
                catConfig.badgeClass
              )}
            >
              <Icon className="h-3 w-3" />
              {catConfig.label}
            </span>

            {exercise.defaultBpm && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono text-prime-textMuted bg-prime-surfaceSubtle border border-prime-borderSubtle">
                <Music className="h-2.5 w-2.5 text-orange-400" />
                {exercise.defaultBpm} BPM
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Difficulty dots */}
            <div className="flex items-center gap-1" title={`Difficulty: ${diffConfig.label}`}>
              {[1, 2, 3, 4].map((dot) => (
                <span
                  key={dot}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-colors",
                    dot <= diffConfig.dots
                      ? "bg-orange-400"
                      : "bg-prime-borderSubtle"
                  )}
                />
              ))}
            </div>

            {/* Time */}
            <span className="flex items-center gap-1 text-[11px] font-mono text-prime-textMuted">
              <Clock className="h-3 w-3" />
              {exercise.estimatedDuration}m
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-prime-text group-hover:text-orange-400 transition-colors line-clamp-1 mb-1.5">
          {exercise.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-prime-textSecondary line-clamp-2 mb-4 leading-relaxed">
          {exercise.description}
        </p>

        {/* Skills Covered Tags */}
        {exercise.skills && exercise.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {exercise.skills.slice(0, 3).map((skill) => (
              <span
                key={skill.id}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-prime-surfaceSubtle text-prime-textMuted border border-prime-borderSubtle/60"
              >
                #{skill.name}
              </span>
            ))}
            {exercise.skills.length > 3 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 text-prime-textMuted/60">
                +{exercise.skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer / Action */}
      <div className="pt-3 border-t border-prime-borderSubtle flex items-center justify-between gap-3 mt-auto">
        <div className="text-[11px] font-mono text-prime-textMuted flex items-center gap-1.5">
          {isPracticed ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>
                {exercise.sessionCount} session{exercise.sessionCount! > 1 ? "s" : ""}
              </span>
            </>
          ) : (
            <span className="text-prime-textMuted/60">New Drill</span>
          )}
        </div>

        {onStart ? (
          <button
            onClick={() => onStart(exercise)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-black text-xs font-bold transition-all active:scale-[0.98] shadow-prime-sm"
          >
            <span>Start</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        ) : (
          <Link
            href={`/train/${exercise.slug || exercise.id}`}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-500/15 hover:bg-orange-500 text-orange-300 hover:text-black border border-orange-500/30 hover:border-orange-500 text-xs font-bold transition-all active:scale-[0.98]"
          >
            <span>Start</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    </div>
  );
}
