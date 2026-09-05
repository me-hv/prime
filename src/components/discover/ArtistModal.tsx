"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { ArtistData, ArtistStatus, ARTIST_STATUS_CONFIGS } from "@/lib/types";
import { createArtist, updateArtist } from "@/actions/discovery";
import { X, Users } from "lucide-react";

interface ArtistModalProps {
  isOpen: boolean;
  onClose: () => void;
  artistToEdit?: ArtistData | null;
  onSaved: (artist: ArtistData) => void;
}

export function ArtistModal({
  isOpen,
  onClose,
  artistToEdit,
  onSaved,
}: ArtistModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Rapper / Lyricist");
  const [status, setStatus] = useState<ArtistStatus>("STUDYING");
  const [genres, setGenres] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (artistToEdit) {
      setName(artistToEdit.name);
      setRole(artistToEdit.role);
      setStatus(artistToEdit.status);
      setGenres(artistToEdit.genres || "");
      setNotes(artistToEdit.notes || "");
      setTags(artistToEdit.tags || "");
      setFavorite(artistToEdit.favorite);
    } else {
      setName("");
      setRole("Rapper / Lyricist");
      setStatus("STUDYING");
      setGenres("");
      setNotes("");
      setTags("");
      setFavorite(false);
    }
    setError(null);
  }, [artistToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide an artist name.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (artistToEdit) {
        const updated = await updateArtist(artistToEdit.id, {
          name: name.trim(),
          role: role.trim(),
          status,
          genres: genres.trim() || null,
          notes: notes.trim() || null,
          tags: tags.trim() || null,
          favorite,
        });
        onSaved(updated);
      } else {
        const created = await createArtist({
          name: name.trim(),
          role: role.trim(),
          status,
          genres: genres.trim() || null,
          notes: notes.trim() || null,
          tags: tags.trim() || null,
          favorite,
        });
        onSaved(created);
      }
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to save artist. Please try again.");
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
              <Users className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-prime-text">
              {artistToEdit ? "Edit Artist Profile" : "Add Artist to Library"}
            </h3>
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
          {/* Name & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-prime-text block mb-1">
                Artist Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. André 3000"
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs sm:text-sm text-prime-text placeholder:text-prime-textMuted/50 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-prime-text block mb-1">
                Primary Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Rapper / Songwriter / Producer"
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs sm:text-sm text-prime-text placeholder:text-prime-textMuted/50 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-xs font-semibold text-prime-text block mb-1.5">
              Study Status
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {(Object.keys(ARTIST_STATUS_CONFIGS) as ArtistStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all text-center ${
                    status === s
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-prime-surfaceSubtle text-prime-textMuted border-prime-borderSubtle hover:text-prime-text"
                  }`}
                >
                  {ARTIST_STATUS_CONFIGS[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* Genres */}
          <div>
            <label className="text-xs font-semibold text-prime-text block mb-1">
              Genres / Stylistic Lane
            </label>
            <input
              type="text"
              value={genres}
              onChange={(e) => setGenres(e.target.value)}
              placeholder="e.g. Southern Rap, Experimental Hip-Hop, Jazz Rap"
              className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs sm:text-sm text-prime-text placeholder:text-prime-textMuted/50 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Artist Study Notes */}
          <div>
            <label className="text-xs font-semibold text-prime-text block mb-1">
              Creative Signatures & Studio Habits
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Signature strengths: pocket elasticity, off-beat cadence, internal multisyllables, storytelling vulnerability..."
              className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle p-3 text-xs text-prime-text placeholder:text-prime-textMuted/50 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Tags & Favorite */}
          <div className="flex items-center justify-between gap-4 pt-1">
            <div className="flex-1">
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Tags: flow master, lyricist, producer"
                className="w-full rounded-lg bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-1.5 text-xs text-prime-text placeholder:text-prime-textMuted/50 focus:outline-none focus:border-amber-500"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-prime-text shrink-0">
              <input
                type="checkbox"
                checked={favorite}
                onChange={(e) => setFavorite(e.target.checked)}
                className="rounded border-prime-borderSubtle text-amber-500 focus:ring-0"
              />
              <span>Mark Favorite</span>
            </label>
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
              {loading ? "Saving..." : artistToEdit ? "Update Artist" : "Save Artist"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
