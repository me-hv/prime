"use client";

import * as React from "react";
import { useState } from "react";
import {
  BreakthroughData,
  BreakthroughCategory,
  BREAKTHROUGH_CATEGORY_CONFIGS,
  SkillData,
  SongData,
} from "@/lib/types";
import {
  Sparkles,
  Plus,
  Trash2,
} from "lucide-react";
import { deleteBreakthrough } from "@/actions/reflection";
import { BreakthroughModal } from "./BreakthroughModal";
import { cn } from "@/lib/utils";

interface BreakthroughLogViewProps {
  breakthroughs: BreakthroughData[];
  skills: SkillData[];
  songs: SongData[];
  onBreakthroughSaved: (b: BreakthroughData) => void;
  onDeleted?: (id: string) => void;
}

export function BreakthroughLogView({
  breakthroughs,
  skills,
  songs,
  onBreakthroughSaved,
  onDeleted,
}: BreakthroughLogViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const filtered = breakthroughs.filter((b) => {
    if (categoryFilter !== "ALL" && b.category !== categoryFilter) return false;
    return true;
  });

  const handleDelete = async (id: string) => {
    if (confirm("Delete this breakthrough log?")) {
      await deleteBreakthrough(id);
      if (onDeleted) onDeleted(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-prime-text">
            Creative Breakthrough & Quantum Leap Log
          </h2>
          <p className="text-xs text-prime-textMuted">
            Record meaningful breakthroughs in flow, lyricism, sonic production, or artist mindset when they click.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 shadow-prime-sm transition-all shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Log Breakthrough</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setCategoryFilter("ALL")}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
            categoryFilter === "ALL"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold"
              : "bg-prime-surface/60 text-prime-textMuted hover:text-prime-text border border-prime-borderSubtle"
          )}
        >
          All Categories
        </button>
        {(Object.keys(BREAKTHROUGH_CATEGORY_CONFIGS) as BreakthroughCategory[]).map(
          (c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                categoryFilter === c
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold"
                  : "bg-prime-surface/60 text-prime-textMuted hover:text-prime-text border border-prime-borderSubtle"
              )}
            >
              {BREAKTHROUGH_CATEGORY_CONFIGS[c].label}
            </button>
          )
        )}
      </div>

      {/* Breakthroughs List */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((b) => {
            const catConfig =
              BREAKTHROUGH_CATEGORY_CONFIGS[b.category] ||
              BREAKTHROUGH_CATEGORY_CONFIGS.FLOW;

            return (
              <div
                key={b.id}
                className="group rounded-2xl border border-prime-borderSubtle bg-prime-surface p-5 hover:border-amber-500/40 hover:shadow-prime-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Bar: Category Badge + Date */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border",
                        catConfig.badgeClass
                      )}
                    >
                      {catConfig.label}
                    </span>
                    <span className="text-[11px] text-prime-textMuted font-mono">
                      {b.date}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base font-extrabold text-prime-text tracking-tight group-hover:text-amber-300 transition-colors">
                      {b.title}
                    </h3>
                    <p className="text-xs text-prime-textSecondary leading-relaxed mt-1">
                      {b.description}
                    </p>
                  </div>

                  {/* Cause & Permanent Effect */}
                  <div className="space-y-2 text-xs pt-1">
                    {b.cause && (
                      <div className="p-2.5 rounded-xl bg-prime-surfaceSubtle/60 border border-prime-borderSubtle">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-prime-textMuted font-bold block mb-0.5">
                          What Triggered / Caused It:
                        </span>
                        <p className="text-prime-textSecondary">
                          {b.cause}
                        </p>
                      </div>
                    )}

                    {b.changeEffect && (
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold block mb-0.5">
                          What Changed Permanently In My Craft:
                        </span>
                        <p className="text-amber-200 leading-relaxed font-medium">
                          {b.changeEffect}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Link & Delete */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-prime-borderSubtle text-xs">
                  {b.song ? (
                    <span className="text-prime-textMuted font-mono text-[11px]">
                      Linked to: <strong className="text-prime-text font-sans">{b.song.title}</strong>
                    </span>
                  ) : b.skill ? (
                    <span className="text-prime-textMuted font-mono text-[11px]">
                      Skill: <strong className="text-prime-text font-sans">{b.skill.name}</strong>
                    </span>
                  ) : <div />}

                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-1.5 rounded-lg text-prime-textMuted hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete Record"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 rounded-2xl border border-prime-borderSubtle bg-prime-surface/40 p-6 space-y-3">
          <Sparkles className="h-8 w-8 text-prime-textMuted mx-auto" />
          <h3 className="text-sm font-bold text-prime-text">
            No breakthroughs recorded yet
          </h3>
          <p className="text-xs text-prime-textMuted max-w-sm mx-auto">
            Breakthroughs are worth recording when they happen. Log new pockets discovered, vocal cadence unlocks, and mindset shifts.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 shadow-prime-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Log Your First Breakthrough</span>
          </button>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <BreakthroughModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          skills={skills}
          songs={songs}
          onSaved={(saved) => {
            onBreakthroughSaved(saved);
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
