"use client";

import * as React from "react";
import { useState } from "react";
import {
  BreakthroughCategory,
  BreakthroughData,
  BREAKTHROUGH_CATEGORY_CONFIGS,
  SkillData,
  SongData,
} from "@/lib/types";
import { createBreakthrough } from "@/actions/reflection";
import { getTodayDateString } from "@/lib/utils";
import { X, Sparkles } from "lucide-react";

interface BreakthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  skills: SkillData[];
  songs: SongData[];
  onSaved: (b: BreakthroughData) => void;
}

export function BreakthroughModal({
  isOpen,
  onClose,
  skills,
  songs,
  onSaved,
}: BreakthroughModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<BreakthroughCategory>("FLOW");
  const [date, setDate] = useState(getTodayDateString());
  const [description, setDescription] = useState("");
  const [cause, setCause] = useState("");
  const [changeEffect, setChangeEffect] = useState("");
  const [skillId, setSkillId] = useState("");
  const [songId, setSongId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Please provide a title and description.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const b = await createBreakthrough({
        title: title.trim(),
        category,
        date,
        description: description.trim(),
        cause: cause.trim() || null,
        changeEffect: changeEffect.trim() || null,
        skillId: skillId || null,
        songId: songId || null,
      });

      onSaved(b);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to save breakthrough.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-amber-500/30 bg-prime-surface p-6 shadow-prime-lg">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-prime-borderSubtle">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-prime-text">
                Log Creative Breakthrough
              </h3>
              <p className="text-xs text-prime-textMuted">
                Document quantum leaps in flow, lyricism, sonic texture, or mindset.
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
          {/* Title & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-prime-text block mb-1">
                Breakthrough Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Discovered Behind-the-Beat Pocket Delivery"
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs sm:text-sm text-prime-text placeholder:text-prime-textMuted/50 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-prime-text block mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs text-prime-text focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <label className="text-xs font-semibold text-prime-text block mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {(Object.keys(BREAKTHROUGH_CATEGORY_CONFIGS) as BreakthroughCategory[]).map(
                (c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-all text-center ${
                      category === c
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold"
                        : "bg-prime-surfaceSubtle text-prime-textMuted border-prime-borderSubtle hover:text-prime-text"
                    }`}
                  >
                    {BREAKTHROUGH_CATEGORY_CONFIGS[c].label}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-prime-text block mb-1">
              What Was the Breakthrough? *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Realized I was rushing on beat 3; when I drag the delivery into the snare pocket, the bounce quadruples..."
              className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle p-3 text-xs sm:text-sm text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
            />
          </div>

          {/* Cause */}
          <div>
            <label className="text-xs font-semibold text-prime-text block mb-1">
              What Caused / Triggered It?
            </label>
            <input
              type="text"
              value={cause}
              onChange={(e) => setCause(e.target.value)}
              placeholder="e.g. Practicing at 80 BPM with subdivision click or studying J Dilla tracks"
              className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Permanent Craft Change */}
          <div>
            <label className="text-xs font-semibold text-amber-400 block mb-1">
              What Changed Permanently In My Craft?
            </label>
            <textarea
              rows={2}
              value={changeEffect}
              onChange={(e) => setChangeEffect(e.target.value)}
              placeholder="e.g. I will always track vocal takes slightly behind the metronome grid for this bounce."
              className="w-full rounded-xl bg-amber-500/5 border border-amber-500/25 p-3 text-xs text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Link to Skill or Song */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-prime-text block mb-1">
                Link to Skill (Optional)
              </label>
              <select
                value={skillId}
                onChange={(e) => setSkillId(e.target.value)}
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs text-prime-text focus:outline-none focus:border-amber-500"
              >
                <option value="">-- No linked skill --</option>
                {skills.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-prime-text block mb-1">
                Link to Song (Optional)
              </label>
              <select
                value={songId}
                onChange={(e) => setSongId(e.target.value)}
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs text-prime-text focus:outline-none focus:border-amber-500"
              >
                <option value="">-- No linked song --</option>
                {songs.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
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
              className="px-5 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 disabled:opacity-50 shadow-prime-sm transition-all"
            >
              {loading ? "Saving..." : "Log Breakthrough"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
