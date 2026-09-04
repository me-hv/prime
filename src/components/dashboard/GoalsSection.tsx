"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  Plus,
  Trash2,
  Calendar,
  Minus,
} from "lucide-react";
import {
  GoalCategory,
  GOAL_CATEGORY_CONFIGS,
  GoalData,
} from "@/lib/types";
import { CreateGoalModal } from "./CreateGoalModal";
import { updateGoalProgress, deleteGoal } from "@/actions/goals";
import { useToast } from "@/components/ui/Toast";
import { formatShortDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface GoalsSectionProps {
  goals: GoalData[];
}

export function GoalsSection({ goals }: GoalsSectionProps) {
  const { success, error } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredGoals = goals.filter((g) => {
    if (selectedCategory === "ALL") return true;
    return g.category === selectedCategory;
  });

  const handleAdjustProgress = async (goal: GoalData, delta: number) => {
    try {
      setUpdatingId(goal.id);
      const nextProgress = Math.max(0, goal.currentProgress + delta);
      await updateGoalProgress(goal.id, nextProgress);
      if (nextProgress >= goal.targetProgress && goal.currentProgress < goal.targetProgress) {
        success(`Goal Completed: ${goal.title}!`);
      }
    } catch (err) {
      console.error(err);
      error("Failed to update goal progress.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setUpdatingId(id);
      await deleteGoal(id);
      success("Goal removed.");
    } catch (err) {
      console.error(err);
      error("Failed to delete goal.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <section id="goals" className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold tracking-tight text-prime-text uppercase">
              Active Goals & Targets
            </h2>
            <span className="rounded-full bg-prime-surface border border-prime-border px-2 py-0.5 text-[11px] font-mono text-prime-textSecondary">
              {goals.filter((g) => g.status === "IN_PROGRESS").length} in progress
            </span>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="h-8 text-xs font-semibold self-start sm:self-auto"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>New Goal</span>
          </Button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={cn(
              "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap font-mono",
              selectedCategory === "ALL"
                ? "bg-prime-gold/15 text-prime-gold border border-prime-gold/30"
                : "bg-prime-surface/80 text-prime-textMuted hover:text-prime-text border border-prime-borderSubtle"
            )}
          >
            All ({goals.length})
          </button>
          {(Object.keys(GOAL_CATEGORY_CONFIGS) as GoalCategory[]).map((cat) => {
            const count = goals.filter((g) => g.category === cat).length;
            if (count === 0 && selectedCategory !== cat) return null;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap font-mono",
                  selectedCategory === cat
                    ? "bg-prime-gold/15 text-prime-gold border border-prime-gold/30"
                    : "bg-prime-surface/80 text-prime-textMuted hover:text-prime-text border border-prime-borderSubtle"
                )}
              >
                {GOAL_CATEGORY_CONFIGS[cat].label} ({count})
              </button>
            );
          })}
        </div>

        {/* Goal Cards Grid */}
        {filteredGoals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredGoals.map((goal) => {
              const catConfig = GOAL_CATEGORY_CONFIGS[goal.category] || GOAL_CATEGORY_CONFIGS.MUSIC;
              const isDone = goal.status === "COMPLETED";

              return (
                <div
                  key={goal.id}
                  className={cn(
                    "group relative rounded-xl border p-4 transition-all duration-200 flex flex-col justify-between",
                    isDone
                      ? "border-emerald-500/20 bg-emerald-950/10"
                      : "border-prime-borderSubtle bg-prime-card/85 hover:border-prime-border hover:bg-prime-card"
                  )}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span
                        className={cn(
                          "rounded px-2 py-0.5 text-[10px] font-mono border uppercase tracking-wider",
                          catConfig.badgeClass
                        )}
                      >
                        {catConfig.label}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {goal.targetDate && (
                          <div className="flex items-center gap-1 text-[11px] font-mono text-prime-textMuted">
                            <Calendar className="h-3 w-3" />
                            <span>{formatShortDate(goal.targetDate)}</span>
                          </div>
                        )}
                        <button
                          onClick={() => handleDelete(goal.id)}
                          disabled={updatingId === goal.id}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-prime-textMuted hover:text-rose-400"
                          title="Delete goal"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3
                      className={cn(
                        "text-sm font-bold tracking-tight text-prime-text",
                        isDone && "line-through text-prime-textMuted"
                      )}
                    >
                      {goal.title}
                    </h3>
                    {goal.description && (
                      <p className="mt-1 text-xs text-prime-textSecondary line-clamp-2 leading-relaxed">
                        {goal.description}
                      </p>
                    )}
                  </div>

                  {/* Progress Section */}
                  <div className="mt-4 pt-3 border-t border-prime-borderSubtle/60 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-prime-textSecondary">
                        Progress:{" "}
                        <strong className="text-prime-text">
                          {goal.currentProgress}
                        </strong>{" "}
                        / {goal.targetProgress} {goal.unit}
                      </span>
                      <span className="font-bold text-prime-gold">
                        {Math.round(
                          Math.min(
                            100,
                            (goal.currentProgress / goal.targetProgress) * 100
                          )
                        )}
                        %
                      </span>
                    </div>

                    <ProgressBar
                      value={goal.currentProgress}
                      max={goal.targetProgress}
                      color={isDone ? "emerald" : "gold"}
                    />

                    {/* Quick Step Buttons */}
                    {!isDone && (
                      <div className="flex items-center justify-end gap-1.5 pt-1">
                        <button
                          onClick={() => handleAdjustProgress(goal, -1)}
                          disabled={goal.currentProgress <= 0 || updatingId === goal.id}
                          className="flex h-6 w-6 items-center justify-center rounded border border-prime-borderSubtle bg-prime-surface text-prime-textSecondary hover:text-prime-text hover:border-prime-border disabled:opacity-30"
                          title="Decrease progress by 1"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleAdjustProgress(goal, 1)}
                          disabled={updatingId === goal.id}
                          className="flex h-6 w-6 items-center justify-center rounded border border-prime-borderSubtle bg-prime-surface text-prime-gold hover:border-prime-gold hover:bg-prime-gold/10 disabled:opacity-30"
                          title="Increase progress by 1"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-prime-borderSubtle bg-prime-surface/40 p-6 text-center">
            <p className="text-xs text-prime-textMuted">
              No goals in this category yet.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="mt-3 text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1 text-prime-gold" />
              <span>Create Target Goal</span>
            </Button>
          </div>
        )}
      </section>

      <CreateGoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
