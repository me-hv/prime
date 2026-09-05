"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import {
  StudySessionData,
  StudyFocus,
  STUDY_FOCUS_CONFIGS,
} from "@/lib/types";
import {
  Headphones,
  Search,
  Sparkles,
  Clock,
  Star,
  Trash2,
  Flame,
} from "lucide-react";
import { deleteStudySession } from "@/actions/discovery";
import { StudyPracticeModal } from "./StudyPracticeModal";
import { cn } from "@/lib/utils";

interface StudyVaultViewProps {
  studies: StudySessionData[];
  onStartStudy: () => void;
  onDeleted?: (id: string) => void;
}

export function StudyVaultView({
  studies,
  onStartStudy,
  onDeleted,
}: StudyVaultViewProps) {
  const [search, setSearch] = useState("");
  const [focusFilter, setFocusFilter] = useState("ALL");
  const [practiceModalStudy, setPracticeModalStudy] = useState<StudySessionData | null>(null);

  const filteredStudies = useMemo(() => {
    return studies.filter((s) => {
      if (focusFilter !== "ALL" && s.focus !== focusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesRef = s.reference?.title.toLowerCase().includes(q);
        const matchesArtist = s.reference?.creator.toLowerCase().includes(q) || s.artist?.name.toLowerCase().includes(q);
        const matchesObs = s.observations?.toLowerCase().includes(q);
        const matchesTech = s.techniques?.toLowerCase().includes(q);
        const matchesLearn = s.whatILearned?.toLowerCase().includes(q);
        const matchesTakeaway = s.takeaway?.toLowerCase().includes(q);
        return (
          matchesRef ||
          matchesArtist ||
          matchesObs ||
          matchesTech ||
          matchesLearn ||
          matchesTakeaway
        );
      }
      return true;
    });
  }, [studies, search, focusFilter]);

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Delete study session for "${title}"?`)) {
      await deleteStudySession(id);
      if (onDeleted) onDeleted(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Search & Focus Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-prime-textMuted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search study takeaways, techniques, artists..."
            className="w-full rounded-xl bg-prime-surface border border-prime-borderSubtle pl-9 pr-4 py-2 text-xs sm:text-sm text-prime-text placeholder:text-prime-textMuted/50 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Start Study Button */}
        <button
          onClick={onStartStudy}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 text-white text-xs font-bold hover:bg-sky-400 shadow-prime-sm transition-all shrink-0"
        >
          <Sparkles className="h-4 w-4" />
          <span>New Track Dissection</span>
        </button>
      </div>

      {/* Focus Discipline Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setFocusFilter("ALL")}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
            focusFilter === "ALL"
              ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
              : "bg-prime-surface/60 text-prime-textMuted hover:text-prime-text border border-prime-borderSubtle"
          )}
        >
          All Disciplines
        </button>
        {(Object.keys(STUDY_FOCUS_CONFIGS) as StudyFocus[]).map((f) => {
          const cfg = STUDY_FOCUS_CONFIGS[f];
          return (
            <button
              key={f}
              onClick={() => setFocusFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                focusFilter === f
                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                  : "bg-prime-surface/60 text-prime-textMuted hover:text-prime-text border border-prime-borderSubtle"
              )}
            >
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Studies Grid */}
      {filteredStudies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStudies.map((s) => {
            const focusCfg = STUDY_FOCUS_CONFIGS[s.focus] || STUDY_FOCUS_CONFIGS.FLOW;
            const refTitle = s.reference
              ? `"${s.reference.title}" — ${s.reference.creator}`
              : s.artist
              ? `Study on ${s.artist.name}`
              : `Technique Study: ${s.focus}`;

            return (
              <div
                key={s.id}
                className="group rounded-xl border border-prime-borderSubtle bg-prime-surface p-5 hover:border-sky-500/40 hover:shadow-prime-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Bar: Focus Badge + Duration + Date + Rating */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${focusCfg.badgeClass}`}>
                      {focusCfg.label}
                    </span>

                    <div className="flex items-center gap-2 text-xs text-prime-textMuted">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="h-3 w-3 text-sky-400" />
                        {Math.max(1, Math.round(s.durationSeconds / 60))} min
                      </span>
                      <span>•</span>
                      <span>{new Date(s.startedAt).toLocaleDateString()}</span>
                      {s.rating && (
                        <div className="flex items-center text-amber-400 pl-1">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span className="text-[11px] font-bold font-mono ml-0.5">{s.rating}/5</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-base font-extrabold text-prime-text tracking-tight group-hover:text-sky-300 transition-colors">
                      {refTitle}
                    </h3>
                    {s.favoriteSection && (
                      <p className="text-xs text-sky-400/80 font-mono mt-0.5">
                        Standout Section: {s.favoriteSection}
                      </p>
                    )}
                  </div>

                  {/* Observations & Technique breakdown */}
                  {s.observations && (
                    <div className="space-y-1 text-xs">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-prime-textMuted font-bold block">
                        Core Observation:
                      </span>
                      <p className="text-prime-textSecondary leading-relaxed bg-prime-surfaceSubtle/50 p-2.5 rounded-lg border border-prime-borderSubtle">
                        {s.observations}
                      </p>
                    </div>
                  )}

                  {s.techniques && (
                    <div className="space-y-1 text-xs">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-prime-textMuted font-bold block">
                        Techniques Noticed:
                      </span>
                      <p className="text-prime-textSecondary leading-relaxed">
                        {s.techniques}
                      </p>
                    </div>
                  )}

                  {/* Why It Works & Learnings */}
                  {s.whyItWorks && (
                    <div className="space-y-1 text-xs">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                        Why It Works:
                      </span>
                      <p className="text-prime-textSecondary leading-relaxed">
                        {s.whyItWorks}
                      </p>
                    </div>
                  )}

                  {s.experimentIdea && (
                    <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-xs">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-sky-300 font-bold block mb-0.5">
                        Experiment To Try:
                      </span>
                      <p className="text-sky-200">
                        {s.experimentIdea}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-prime-borderSubtle">
                  <button
                    onClick={() => handleDelete(s.id, refTitle)}
                    className="p-1.5 rounded-lg text-prime-textMuted hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all text-xs flex items-center gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>

                  <button
                    onClick={() => setPracticeModalStudy(s)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/15 text-sky-300 border border-sky-500/30 text-xs font-bold hover:bg-sky-500/25 transition-all"
                  >
                    <Flame className="h-3.5 w-3.5" />
                    <span>Turn Into Practice</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 rounded-2xl border border-prime-borderSubtle bg-prime-surface/40 p-6 space-y-3">
          <Headphones className="h-8 w-8 text-prime-textMuted mx-auto" />
          <h3 className="text-sm font-bold text-prime-text">
            No song study dissections recorded
          </h3>
          <p className="text-xs text-prime-textMuted max-w-sm mx-auto">
            {search || focusFilter !== "ALL"
              ? "Try adjusting your filters or search terms."
              : "Study something that teaches you something. Dissect cadence switches, pocket elasticity, and lyrical architecture."}
          </p>
          {!search && (
            <button
              onClick={onStartStudy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 text-white text-xs font-bold hover:bg-sky-400 shadow-prime-sm transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>Start Your First Track Dissection</span>
            </button>
          )}
        </div>
      )}

      {/* Practice Conversion Modal */}
      {practiceModalStudy && (
        <StudyPracticeModal
          isOpen={!!practiceModalStudy}
          onClose={() => setPracticeModalStudy(null)}
          studySessionId={practiceModalStudy.id}
          defaultObservation={
            practiceModalStudy.experimentIdea ||
            practiceModalStudy.whatILearned ||
            practiceModalStudy.techniques ||
            practiceModalStudy.observations ||
            ""
          }
          focusTitle={
            practiceModalStudy.reference
              ? `${practiceModalStudy.focus} on "${practiceModalStudy.reference.title}"`
              : `${practiceModalStudy.focus} Study`
          }
        />
      )}
    </div>
  );
}
