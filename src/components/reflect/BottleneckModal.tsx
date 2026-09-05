"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  BottleneckCategory,
  BottleneckData,
  BOTTLENECK_CATEGORY_CONFIGS,
} from "@/lib/types";
import { createBottleneck, updateBottleneck } from "@/actions/reflection";
import { getTodayDateString } from "@/lib/utils";
import { X, AlertTriangle } from "lucide-react";

interface BottleneckModalProps {
  isOpen: boolean;
  onClose: () => void;
  bottleneckToEdit?: BottleneckData | null;
  onSaved: (b: BottleneckData) => void;
}

export function BottleneckModal({
  isOpen,
  onClose,
  bottleneckToEdit,
  onSaved,
}: BottleneckModalProps) {
  const [category, setCategory] = useState<BottleneckCategory>("FINISHING");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState(3);
  const [date, setDate] = useState(getTodayDateString());
  const [attemptedSolution, setAttemptedSolution] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bottleneckToEdit) {
      setCategory(bottleneckToEdit.category);
      setDescription(bottleneckToEdit.description);
      setSeverity(bottleneckToEdit.severity);
      setDate(bottleneckToEdit.date);
      setAttemptedSolution(bottleneckToEdit.attemptedSolution || "");
      setResult(bottleneckToEdit.result || "");
    } else {
      setCategory("FINISHING");
      setDescription("");
      setSeverity(3);
      setDate(getTodayDateString());
      setAttemptedSolution("");
      setResult("");
    }
    setError(null);
  }, [bottleneckToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError("Please describe the bottleneck or blocker.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (bottleneckToEdit) {
        const updated = await updateBottleneck(bottleneckToEdit.id, {
          category,
          description: description.trim(),
          severity,
          attemptedSolution: attemptedSolution.trim() || null,
          result: result.trim() || null,
        });
        onSaved(updated);
      } else {
        const created = await createBottleneck({
          category,
          description: description.trim(),
          severity,
          date,
          attemptedSolution: attemptedSolution.trim() || null,
          result: result.trim() || null,
        });
        onSaved(created);
      }
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to save bottleneck.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-rose-500/30 bg-prime-surface p-6 shadow-prime-lg">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-prime-borderSubtle">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-prime-text">
                {bottleneckToEdit ? "Edit Bottleneck Audit" : "Audit Creative Bottleneck"}
              </h3>
              <p className="text-xs text-prime-textMuted">
                Diagnose resistance, procrastination, or technical friction.
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
          {/* Category Selector */}
          <div>
            <label className="text-xs font-semibold text-prime-text block mb-1.5">
              Bottleneck Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {(Object.keys(BOTTLENECK_CATEGORY_CONFIGS) as BottleneckCategory[]).map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-all text-center ${
                      category === cat
                        ? "bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold"
                        : "bg-prime-surfaceSubtle text-prime-textMuted border-prime-borderSubtle hover:text-prime-text"
                    }`}
                  >
                    {BOTTLENECK_CATEGORY_CONFIGS[cat].label}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-prime-text block mb-1">
              Description of the Problem *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. I start songs with strong hooks but abandon the verses because I get perfectionist anxiety about the second 8 bars..."
              className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle p-3 text-xs sm:text-sm text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-rose-500 resize-none leading-relaxed"
            />
          </div>

          {/* Severity (1-5) */}
          <div className="p-3 rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-prime-text">
                Friction / Severity Rating (1–5)
              </label>
              <span className="text-xs font-bold font-mono text-rose-400">
                {severity} / 5
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSeverity(level)}
                  className={`py-2 rounded-lg text-xs font-bold font-mono border transition-all ${
                    severity === level
                      ? level >= 4
                        ? "bg-rose-500 text-white border-rose-500"
                        : "bg-amber-500 text-black border-amber-500"
                      : "bg-prime-surface border-prime-borderSubtle text-prime-textMuted hover:text-prime-text"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Attempted Solution */}
          <div>
            <label className="text-xs font-semibold text-prime-text block mb-1">
              Attempted / Planned Solution
            </label>
            <textarea
              rows={2}
              value={attemptedSolution}
              onChange={(e) => setAttemptedSolution(e.target.value)}
              placeholder="e.g. Set a strict 10-minute timer and force a zero-editing rule until 16 bars are completed..."
              className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle p-3 text-xs text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-rose-500 resize-none"
            />
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
              className="px-5 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-400 disabled:opacity-50 shadow-prime-sm transition-all"
            >
              {loading ? "Saving..." : bottleneckToEdit ? "Update Audit" : "Save Bottleneck"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
