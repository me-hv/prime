"use client";

import * as React from "react";
import { useState } from "react";
import {
  MilestoneData,
  MILESTONE_CATEGORY_CONFIGS,
} from "@/lib/types";
import {
  Award,
  Plus,
  Trash2,
} from "lucide-react";
import { deleteMilestone } from "@/actions/reflection";
import { MilestoneModal } from "./MilestoneModal";
import { cn } from "@/lib/utils";

interface MilestonesTimelineViewProps {
  milestones: MilestoneData[];
  onMilestoneSaved: (m: MilestoneData) => void;
  onDeleted?: (id: string) => void;
}

export function MilestonesTimelineView({
  milestones,
  onMilestoneSaved,
  onDeleted,
}: MilestonesTimelineViewProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Delete milestone "${title}"?`)) {
      await deleteMilestone(id);
      if (onDeleted) onDeleted(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-prime-text">
            Artist Milestones & Career Timeline
          </h2>
          <p className="text-xs text-prime-textMuted">
            A permanent chronicle of your artistic journey: first finished projects, song releases, live performances, and craft benchmarks.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-500 text-white text-xs font-bold hover:bg-purple-400 shadow-prime-sm transition-all shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Milestone</span>
        </button>
      </div>

      {/* Timeline */}
      {milestones.length > 0 ? (
        <div className="relative border-l border-prime-borderSubtle ml-4 sm:ml-6 space-y-6 py-2">
          {milestones.map((m) => {
            const catConfig =
              MILESTONE_CATEGORY_CONFIGS[m.category] ||
              MILESTONE_CATEGORY_CONFIGS.CREATION;

            return (
              <div key={m.id} className="relative pl-6 sm:pl-8 group">
                {/* Timeline Dot */}
                <div className="absolute -left-2.5 top-1.5 h-5 w-5 rounded-full bg-prime-surface border-2 border-purple-400 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                </div>

                {/* Milestone Card */}
                <div className="rounded-2xl border border-prime-borderSubtle bg-prime-surface p-5 hover:border-purple-500/40 hover:shadow-prime-md transition-all space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={cn(
                            "px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border",
                            catConfig.badgeClass
                          )}
                        >
                          {catConfig.label}
                        </span>
                        <span className="text-[11px] text-prime-textMuted font-mono">
                          {m.date}
                        </span>
                      </div>
                      <h3 className="text-lg font-extrabold text-prime-text group-hover:text-purple-300 transition-colors">
                        {m.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => handleDelete(m.id, m.title)}
                      className="p-1.5 rounded-lg text-prime-textMuted hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all text-xs"
                      title="Delete Milestone"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Description & Significance */}
                  <p className="text-xs sm:text-sm text-prime-textSecondary leading-relaxed">
                    {m.description}
                  </p>

                  {m.significance && (
                    <div className="p-3 rounded-xl bg-prime-surfaceSubtle/60 border border-prime-borderSubtle text-xs">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold block mb-0.5">
                        Artist Significance:
                      </span>
                      <p className="text-prime-textSecondary leading-relaxed">
                        {m.significance}
                      </p>
                    </div>
                  )}

                  {/* Lessons & What Next */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    {m.lessons && (
                      <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-sky-300 font-bold block mb-0.5">
                          Lessons Learned:
                        </span>
                        <p className="text-sky-200 leading-relaxed">
                          {m.lessons}
                        </p>
                      </div>
                    )}

                    {m.nextStep && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold block mb-0.5">
                          Next Horizon:
                        </span>
                        <p className="text-emerald-200 leading-relaxed">
                          {m.nextStep}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 rounded-2xl border border-prime-borderSubtle bg-prime-surface/40 p-6 space-y-3">
          <Award className="h-8 w-8 text-prime-textMuted mx-auto" />
          <h3 className="text-sm font-bold text-prime-text">
            No milestones recorded yet
          </h3>
          <p className="text-xs text-prime-textMuted max-w-sm mx-auto">
            Record major benchmarks in your artistic journey: finishing your first EP, releasing a song, or reaching a writing milestone.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-500 text-white text-xs font-bold hover:bg-purple-400 shadow-prime-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Record Your First Milestone</span>
          </button>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <MilestoneModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSaved={(saved) => {
            onMilestoneSaved(saved);
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
