"use client";

import * as React from "react";
import { useState } from "react";
import {
  ArtistReferenceData,
  ListeningEntryData,
  ListeningPurpose,
  LISTENING_PURPOSE_CONFIGS,
} from "@/lib/types";
import { createListeningEntry } from "@/actions/discovery";
import { getTodayDateString } from "@/lib/utils";
import { X, Headphones } from "lucide-react";

interface ListeningEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  references: ArtistReferenceData[];
  onSaved: (entry: ListeningEntryData) => void;
}

export function ListeningEntryModal({
  isOpen,
  onClose,
  references,
  onSaved,
}: ListeningEntryModalProps) {
  const [title, setTitle] = useState("");
  const [creator, setCreator] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [date, setDate] = useState(getTodayDateString());
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [purpose, setPurpose] = useState<ListeningPurpose>("STUDY");
  const [mood, setMood] = useState("");
  const [reaction, setReaction] = useState("");
  const [studyWorthy, setStudyWorthy] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectReference = (refId: string) => {
    setReferenceId(refId);
    const ref = references.find((r) => r.id === refId);
    if (ref) {
      setTitle(ref.title);
      setCreator(ref.creator);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !creator.trim()) {
      setError("Please provide both title and artist/creator name.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const entry = await createListeningEntry({
        referenceId: referenceId || undefined,
        title: title.trim(),
        creator: creator.trim(),
        date,
        durationMinutes: Number(durationMinutes) || 15,
        purpose,
        mood: mood.trim() || undefined,
        reaction: reaction.trim() || undefined,
        studyWorthy,
        notes: notes.trim() || undefined,
      });

      onSaved(entry);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to save listening entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-sky-500/30 bg-prime-surface p-6 shadow-prime-lg">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-prime-borderSubtle">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Headphones className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-prime-text">
                Log Listening Session
              </h3>
              <p className="text-xs text-prime-textMuted">
                Record what you listened to, emotional reaction, and purpose.
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
          {/* Quick autofill from existing reference */}
          {references.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-prime-text block mb-1">
                Autofill from Reference Library (Optional)
              </label>
              <select
                value={referenceId}
                onChange={(e) => handleSelectReference(e.target.value)}
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs text-prime-text focus:outline-none focus:border-sky-500"
              >
                <option value="">-- Manual entry --</option>
                {references.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title} — {r.creator}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Title & Creator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-prime-text block mb-1">
                Track / Album Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sing About Me, I'm Dying of Thirst"
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs text-prime-text placeholder:text-prime-textMuted/50 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-prime-text block mb-1">
                Artist / Creator *
              </label>
              <input
                type="text"
                required
                value={creator}
                onChange={(e) => setCreator(e.target.value)}
                placeholder="e.g. Kendrick Lamar"
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs text-prime-text placeholder:text-prime-textMuted/50 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Purpose Selector */}
          <div>
            <label className="text-xs font-semibold text-prime-text block mb-1.5">
              Listening Purpose
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {(Object.keys(LISTENING_PURPOSE_CONFIGS) as ListeningPurpose[]).map(
                (p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPurpose(p)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-all text-center ${
                      purpose === p
                        ? "bg-sky-500/20 text-sky-300 border-sky-500/40"
                        : "bg-prime-surfaceSubtle text-prime-textMuted border-prime-borderSubtle hover:text-prime-text"
                    }`}
                  >
                    {LISTENING_PURPOSE_CONFIGS[p].label}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Date & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-prime-text block mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs text-prime-text focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-prime-text block mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs text-prime-text focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Reaction */}
          <div>
            <label className="text-xs font-semibold text-prime-text block mb-1">
              Immediate Reaction / What Stood Out
            </label>
            <textarea
              rows={2}
              value={reaction}
              onChange={(e) => setReaction(e.target.value)}
              placeholder="e.g. The vocal modulation on the second verse creates eerie vulnerability..."
              className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle p-3 text-xs text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-sky-500 resize-none"
            />
          </div>

          {/* Mood & Additional Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-prime-text block mb-1">
                Sonic Mood / Atmosphere
              </label>
              <input
                type="text"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="e.g. Dark, introspective, triumphant"
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-prime-text block mb-1">
                Key Takeaways / Production Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Try this hi-hat velocity pattern"
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Study-Worthy Checkbox */}
          <label className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 cursor-pointer">
            <input
              type="checkbox"
              checked={studyWorthy}
              onChange={(e) => setStudyWorthy(e.target.checked)}
              className="rounded border-amber-500 text-amber-500 focus:ring-0"
            />
            <div>
              <span className="text-xs font-bold text-amber-300 block">
                Flag as Study-Worthy
              </span>
              <span className="text-[11px] text-prime-textMuted block">
                Highlights this track on the dashboard for deep technical dissection.
              </span>
            </div>
          </label>

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
              className="px-5 py-2 rounded-xl bg-sky-500 text-white text-xs font-bold hover:bg-sky-400 disabled:opacity-50 shadow-prime-sm transition-all"
            >
              {loading ? "Saving..." : "Log Listening"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
