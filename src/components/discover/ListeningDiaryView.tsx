"use client";

import * as React from "react";
import { useState } from "react";
import {
  ListeningEntryData,
  ArtistReferenceData,
  LISTENING_PURPOSE_CONFIGS,
} from "@/lib/types";
import {
  Plus,
  Trash2,
  Sparkles,
  BookMarked,
} from "lucide-react";
import { deleteListeningEntry } from "@/actions/discovery";
import { ListeningEntryModal } from "./ListeningEntryModal";
import { cn } from "@/lib/utils";

interface ListeningDiaryViewProps {
  entries: ListeningEntryData[];
  references: ArtistReferenceData[];
  onStudyTrack: (title: string, creator: string) => void;
  onEntrySaved: (entry: ListeningEntryData) => void;
  onDeleted?: (id: string) => void;
}

export function ListeningDiaryView({
  entries,
  references,
  onStudyTrack,
  onEntrySaved,
  onDeleted,
}: ListeningDiaryViewProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleDelete = async (id: string) => {
    if (confirm("Delete this listening entry?")) {
      await deleteListeningEntry(id);
      if (onDeleted) onDeleted(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-prime-text">
            Purpose-Driven Listening Diary
          </h2>
          <p className="text-xs text-prime-textMuted">
            Track active listening sessions, quick emotional reactions, sonic ideas, and flag standout tracks for deep study.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 text-white text-xs font-bold hover:bg-sky-400 shadow-prime-sm transition-all shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Log Listening Session</span>
        </button>
      </div>

      {/* Entries Feed */}
      {entries.length > 0 ? (
        <div className="space-y-3">
          {entries.map((e) => {
            const purposeConfig =
              LISTENING_PURPOSE_CONFIGS[e.purpose] ||
              LISTENING_PURPOSE_CONFIGS.STUDY;

            return (
              <div
                key={e.id}
                className="group rounded-xl border border-prime-borderSubtle bg-prime-surface p-4 hover:border-sky-500/30 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border",
                        purposeConfig.badgeClass
                      )}
                    >
                      {purposeConfig.label}
                    </span>
                    {e.studyWorthy && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        Study-Worthy
                      </span>
                    )}
                    <span className="text-[11px] text-prime-textMuted font-mono">
                      {e.date} • {e.durationMinutes} min
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-prime-text">
                    &quot;{e.title}&quot; <span className="text-prime-textMuted font-normal">by {e.creator}</span>
                  </h3>

                  {e.reaction && (
                    <p className="text-xs text-prime-textSecondary leading-relaxed italic">
                      &quot;{e.reaction}&quot;
                    </p>
                  )}

                  {e.notes && (
                    <p className="text-xs text-prime-textMuted leading-relaxed">
                      {e.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {e.studyWorthy && (
                    <button
                      onClick={() => onStudyTrack(e.title, e.creator)}
                      className="px-2.5 py-1 rounded-lg bg-sky-500/15 text-sky-300 border border-sky-500/30 text-xs font-semibold hover:bg-sky-500/25 transition-all flex items-center gap-1"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>Start Dissection</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="p-1.5 rounded-lg text-prime-textMuted hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete Entry"
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
          <BookMarked className="h-8 w-8 text-prime-textMuted mx-auto" />
          <h3 className="text-sm font-bold text-prime-text">
            No listening sessions logged
          </h3>
          <p className="text-xs text-prime-textMuted max-w-sm mx-auto">
            Log what you listen to daily with intent. Categorize by purpose (Inspiration, Flow Analysis, Production) and flag tracks for dissection.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 text-white text-xs font-bold hover:bg-sky-400 shadow-prime-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Log Your First Session</span>
          </button>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <ListeningEntryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          references={references}
          onSaved={(entry) => {
            onEntrySaved(entry);
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
