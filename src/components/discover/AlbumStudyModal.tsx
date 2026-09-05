"use client";

import * as React from "react";
import { useState } from "react";
import { AlbumStudyData, ArtistReferenceData } from "@/lib/types";
import { createAlbumStudy } from "@/actions/discovery";
import { X, Disc3, Star } from "lucide-react";

interface AlbumStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  albumReferences: ArtistReferenceData[];
  onSaved: (study: AlbumStudyData) => void;
}

export function AlbumStudyModal({
  isOpen,
  onClose,
  albumReferences,
  onSaved,
}: AlbumStudyModalProps) {
  const [referenceId, setReferenceId] = useState<string>(
    albumReferences[0]?.id || ""
  );
  const [overallImpression, setOverallImpression] = useState("");
  const [themes, setThemes] = useState("");
  const [productionNotes, setProductionNotes] = useState("");
  const [writingNotes, setWritingNotes] = useState("");
  const [sequencingNotes, setSequencingNotes] = useState("");
  const [standoutTracks, setStandoutTracks] = useState("");
  const [weakestTrack, setWeakestTrack] = useState("");
  const [recurringTechniques, setRecurringTechniques] = useState("");
  const [lessons, setLessons] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceId) {
      setError("Please select an album reference to study.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const study = await createAlbumStudy({
        referenceId,
        overallImpression: overallImpression.trim() || undefined,
        themes: themes.trim() || undefined,
        productionNotes: productionNotes.trim() || undefined,
        writingNotes: writingNotes.trim() || undefined,
        sequencingNotes: sequencingNotes.trim() || undefined,
        standoutTracks: standoutTracks.trim() || undefined,
        weakestTrack: weakestTrack.trim() || undefined,
        recurringTechniques: recurringTechniques.trim() || undefined,
        lessons: lessons.trim() || undefined,
        rating,
      });

      onSaved(study);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to save album study.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-purple-500/30 bg-prime-surface p-6 shadow-prime-lg">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-prime-borderSubtle">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Disc3 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-prime-text">
                New Album Architecture Study
              </h3>
              <p className="text-xs text-prime-textMuted">
                Dissect full body-of-work sequencing, production themes, and lyrical cohesion.
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
          {/* Album Reference Selector */}
          <div>
            <label className="text-xs font-semibold text-prime-text block mb-1">
              Select Album Reference *
            </label>
            <select
              required
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value)}
              className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs sm:text-sm text-prime-text focus:outline-none focus:border-purple-500"
            >
              <option value="">-- Choose an Album Reference --</option>
              {albumReferences.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} — {r.creator} ({r.year || "N/A"})
                </option>
              ))}
            </select>
          </div>

          {/* Overall Impression */}
          <div>
            <label className="text-xs font-semibold text-prime-text block mb-1">
              Overall Impression & Sonic Identity
            </label>
            <textarea
              rows={3}
              value={overallImpression}
              onChange={(e) => setOverallImpression(e.target.value)}
              placeholder="e.g. Masterclass in jazz-rap fusion with deeply vulnerable, cinematic narrative arcs..."
              className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle p-3 text-xs text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* Themes & Sequencing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-prime-text block mb-1">
                Themes & Motifs
              </label>
              <textarea
                rows={2}
                value={themes}
                onChange={(e) => setThemes(e.target.value)}
                placeholder="Recurring lyrical themes, skits, interludes, worldbuilding..."
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle p-3 text-xs text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-prime-text block mb-1">
                Sequencing & Emotional Pacing
              </label>
              <textarea
                rows={2}
                value={sequencingNotes}
                onChange={(e) => setSequencingNotes(e.target.value)}
                placeholder="Track transitions, energy curves, key changes between songs..."
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle p-3 text-xs text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>
          </div>

          {/* Production & Writing Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-prime-text block mb-1">
                Production & Soundscapes
              </label>
              <textarea
                rows={2}
                value={productionNotes}
                onChange={(e) => setProductionNotes(e.target.value)}
                placeholder="Sonic texture, drum styling, sampling choices..."
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle p-3 text-xs text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-prime-text block mb-1">
                Writing & Flow Techniques
              </label>
              <textarea
                rows={2}
                value={writingNotes}
                onChange={(e) => setWritingNotes(e.target.value)}
                placeholder="Cadence habits, lyrical perspectives, recurring techniques..."
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle p-3 text-xs text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>
          </div>

          {/* Recurring Techniques */}
          <div>
            <label className="text-xs font-semibold text-prime-text block mb-1">
              Recurring Techniques & Structural Formulas
            </label>
            <input
              type="text"
              value={recurringTechniques}
              onChange={(e) => setRecurringTechniques(e.target.value)}
              placeholder="e.g. Beat switches at 2:30, pitched vocal chops, monologue intros"
              className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Standouts & Weakest */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-prime-text block mb-1">
                Standout Tracks
              </label>
              <input
                type="text"
                value={standoutTracks}
                onChange={(e) => setStandoutTracks(e.target.value)}
                placeholder="e.g. Track 03, Track 07, Track 11"
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-prime-text block mb-1">
                Weakest Track / Missed Opportunity
              </label>
              <input
                type="text"
                value={weakestTrack}
                onChange={(e) => setWeakestTrack(e.target.value)}
                placeholder="e.g. Track 08 (slows momentum)"
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Lessons for own work */}
          <div>
            <label className="text-xs font-semibold text-prime-text block mb-1">
              Key Lessons For My Next Project / EP
            </label>
            <textarea
              rows={3}
              value={lessons}
              onChange={(e) => setLessons(e.target.value)}
              placeholder="What structural principles will I adopt when sequencing my own body of work?"
              className="w-full rounded-xl bg-purple-500/5 border border-purple-500/25 p-3 text-xs text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* Rating */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle">
            <span className="text-xs font-semibold text-prime-text">
              Project Masterwork Rating:
            </span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1 ${star <= rating ? "text-amber-400" : "text-prime-textMuted/40"}`}
                >
                  <Star className="h-4 w-4 fill-current" />
                </button>
              ))}
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
              {loading ? "Saving..." : "Save Album Study"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
