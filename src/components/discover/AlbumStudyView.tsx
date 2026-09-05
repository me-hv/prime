"use client";

import * as React from "react";
import { useState } from "react";
import { AlbumStudyData, ArtistReferenceData } from "@/lib/types";
import {
  Disc3,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import { deleteAlbumStudy } from "@/actions/discovery";
import { AlbumStudyModal } from "./AlbumStudyModal";

interface AlbumStudyViewProps {
  studies: AlbumStudyData[];
  albumReferences: ArtistReferenceData[];
  onDeleted?: (id: string) => void;
  onStudySaved: (study: AlbumStudyData) => void;
}

export function AlbumStudyView({
  studies,
  albumReferences,
  onDeleted,
  onStudySaved,
}: AlbumStudyViewProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Delete album study for "${title}"?`)) {
      await deleteAlbumStudy(id);
      if (onDeleted) onDeleted(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-prime-text">
            Album Architecture & Project Studies
          </h2>
          <p className="text-xs text-prime-textMuted">
            Analyze complete bodies of work: sequencing, emotional pacing, sonic cohesion, and recurring motifs.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-500 text-white text-xs font-bold hover:bg-purple-400 shadow-prime-sm transition-all shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>New Album Study</span>
        </button>
      </div>

      {/* Studies Grid */}
      {studies.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {studies.map((s) => (
            <div
              key={s.id}
              className="group rounded-2xl border border-prime-borderSubtle bg-prime-surface p-5 hover:border-purple-500/40 hover:shadow-prime-md transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      Album Architecture
                    </span>
                    {s.rating && (
                      <div className="flex items-center text-amber-400">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="text-[11px] font-bold font-mono ml-0.5">
                          {s.rating}/5
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-extrabold text-prime-text group-hover:text-purple-300 transition-colors">
                    {s.reference?.title || "Album Study"}
                  </h3>
                  <p className="text-xs font-semibold text-prime-textSecondary">
                    by {s.reference?.creator}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(s.id, s.reference?.title || "Album")}
                  className="p-1.5 rounded-lg text-prime-textMuted hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete Study"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Overall Impression */}
              {s.overallImpression && (
                <div className="p-3 rounded-xl bg-prime-surfaceSubtle/60 border border-prime-borderSubtle text-xs text-prime-textSecondary leading-relaxed">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-prime-textMuted font-bold block mb-1">
                    Overall Impression & Vision:
                  </span>
                  {s.overallImpression}
                </div>
              )}

              {/* Themes & Sequencing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {s.themes && (
                  <div className="p-3 rounded-xl bg-prime-surfaceSubtle/40 border border-prime-borderSubtle">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold block mb-1">
                      Thematic Motifs:
                    </span>
                    <p className="text-prime-textSecondary leading-relaxed">
                      {s.themes}
                    </p>
                  </div>
                )}

                {s.sequencingNotes && (
                  <div className="p-3 rounded-xl bg-prime-surfaceSubtle/40 border border-prime-borderSubtle">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-bold block mb-1">
                      Sequencing & Pacing:
                    </span>
                    <p className="text-prime-textSecondary leading-relaxed">
                      {s.sequencingNotes}
                    </p>
                  </div>
                )}
              </div>

              {/* Standout vs Weakest */}
              <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                {s.standoutTracks && (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                    Standouts: {s.standoutTracks}
                  </span>
                )}
                {s.weakestTrack && (
                  <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 font-medium">
                    Weakest: {s.weakestTrack}
                  </span>
                )}
              </div>

              {/* Lessons & Takeaways */}
              {s.lessons && (
                <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-sky-300 font-bold block mb-0.5">
                    Key Lessons For My Own Projects:
                  </span>
                  <p className="text-sky-200 leading-relaxed">
                    {s.lessons}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 rounded-2xl border border-prime-borderSubtle bg-prime-surface/40 p-6 space-y-3">
          <Disc3 className="h-8 w-8 text-prime-textMuted mx-auto" />
          <h3 className="text-sm font-bold text-prime-text">
            No album architecture studies logged
          </h3>
          <p className="text-xs text-prime-textMuted max-w-sm mx-auto">
            Great artists study entire bodies of work, not just isolated singles. Analyze track transitions, emotional arcs, and conceptual worldbuilding.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-500 text-white text-xs font-bold hover:bg-purple-400 shadow-prime-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Dissect Your First Album</span>
          </button>
        </div>
      )}

      {/* Add Study Modal */}
      {modalOpen && (
        <AlbumStudyModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          albumReferences={albumReferences}
          onSaved={(study) => {
            onStudySaved(study);
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
