"use client";

import * as React from "react";
import { useState } from "react";
import {
  MilestoneCategory,
  MilestoneData,
  MILESTONE_CATEGORY_CONFIGS,
} from "@/lib/types";
import { createMilestone } from "@/actions/reflection";
import { getTodayDateString } from "@/lib/utils";
import { X, Award } from "lucide-react";

interface MilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (m: MilestoneData) => void;
}

export function MilestoneModal({
  isOpen,
  onClose,
  onSaved,
}: MilestoneModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(getTodayDateString());
  const [category, setCategory] = useState<MilestoneCategory>("CREATION");
  const [description, setDescription] = useState("");
  const [significance, setSignificance] = useState("");
  const [lessons, setLessons] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Please provide both a title and description.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const m = await createMilestone({
        title: title.trim(),
        date,
        category,
        description: description.trim(),
        significance: significance.trim() || null,
        lessons: lessons.trim() || null,
        nextStep: nextStep.trim() || null,
      });

      onSaved(m);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to save milestone.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-purple-500/30 bg-prime-surface p-6 shadow-prime-lg">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-prime-borderSubtle">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Award className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-prime-text">
                Record Artist Milestone
              </h3>
              <p className="text-xs text-prime-textMuted">
                Chronicle major releases, craft breakthroughs, or body-of-work completions.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-prime-textMuted hover:text-prime-text hover:bg-prime-surfaceHover"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-prime-text block mb-1">
              Milestone Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Completed First 5-Track EP Demo"
              className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs sm:text-sm text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-purple-500 font-bold"
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="text-xs font-semibold text-prime-text block mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {(Object.keys(MILESTONE_CATEGORY_CONFIGS) as MilestoneCategory[]).map(
                (c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-all text-center ${
                      category === c
                        ? "bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold"
                        : "bg-prime-surfaceSubtle text-prime-textMuted border-prime-borderSubtle hover:text-prime-text"
                    }`}
                  >
                    {MILESTONE_CATEGORY_CONFIGS[c].label}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="text-xs font-semibold text-prime-text block mb-1">
              Date Achieved
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs text-prime-text focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-prime-text block mb-1">
              Description of Milestone *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Wrote, recorded, and arranged all 5 songs over a 60-day sprint without cutting corners..."
              className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle p-3 text-xs sm:text-sm text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
            />
          </div>

          {/* Significance */}
          <div>
            <label className="text-xs font-semibold text-prime-text block mb-1">
              Personal Significance
            </label>
            <textarea
              rows={2}
              value={significance}
              onChange={(e) => setSignificance(e.target.value)}
              placeholder="Why this matters to my artist journey..."
              className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle p-3 text-xs text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* Lessons & Next Horizon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-prime-text block mb-1">
                Key Lesson Learned
              </label>
              <input
                type="text"
                value={lessons}
                onChange={(e) => setLessons(e.target.value)}
                placeholder="Finishing requires killing perfectionism..."
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-prime-text block mb-1">
                Next Horizon
              </label>
              <input
                type="text"
                value={nextStep}
                onChange={(e) => setNextStep(e.target.value)}
                placeholder="Begin vocal tracking & mix passes..."
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-prime-borderSubtle">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-prime-textMuted hover:text-prime-text"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-purple-500 text-white text-xs font-bold hover:bg-purple-400 disabled:opacity-50 shadow-prime-sm transition-all"
            >
              {loading ? "Saving..." : "Record Milestone"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
