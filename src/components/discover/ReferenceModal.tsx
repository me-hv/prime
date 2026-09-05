"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  ArtistData,
  ArtistReferenceData,
  ReferenceType,
  REFERENCE_TYPE_CONFIGS,
} from "@/lib/types";
import { createReference, updateReference } from "@/actions/discovery";
import { X, Library } from "lucide-react";

interface ReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  referenceToEdit?: ArtistReferenceData | null;
  artists: ArtistData[];
  onSaved: (ref: ArtistReferenceData) => void;
}

export function ReferenceModal({
  isOpen,
  onClose,
  referenceToEdit,
  artists,
  onSaved,
}: ReferenceModalProps) {
  const [type, setType] = useState<ReferenceType>("SONG");
  const [title, setTitle] = useState("");
  const [creator, setCreator] = useState("");
  const [artistId, setArtistId] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [album, setAlbum] = useState("");
  const [genre, setGenre] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (referenceToEdit) {
      setType(referenceToEdit.type);
      setTitle(referenceToEdit.title);
      setCreator(referenceToEdit.creator);
      setArtistId(referenceToEdit.artistId || "");
      setYear(referenceToEdit.year ? String(referenceToEdit.year) : "");
      setAlbum(referenceToEdit.album || "");
      setGenre(referenceToEdit.genre || "");
      setUrl(referenceToEdit.url || "");
      setNotes(referenceToEdit.notes || "");
      setTags(referenceToEdit.tags || "");
      setFavorite(referenceToEdit.favorite);
    } else {
      setType("SONG");
      setTitle("");
      setCreator("");
      setArtistId("");
      setYear("");
      setAlbum("");
      setGenre("");
      setUrl("");
      setNotes("");
      setTags("");
      setFavorite(false);
    }
    setError(null);
  }, [referenceToEdit, isOpen]);

  if (!isOpen) return null;

  const handleArtistSelect = (id: string) => {
    setArtistId(id);
    const selected = artists.find((a) => a.id === id);
    if (selected && !creator) {
      setCreator(selected.name);
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
      if (referenceToEdit) {
        const updated = await updateReference(referenceToEdit.id, {
          type,
          title: title.trim(),
          creator: creator.trim(),
          artistId: artistId || null,
          year: year ? parseInt(year, 10) : null,
          album: album.trim() || null,
          genre: genre.trim() || null,
          url: url.trim() || null,
          notes: notes.trim() || null,
          tags: tags.trim() || null,
          favorite,
        });
        onSaved(updated);
      } else {
        const created = await createReference({
          type,
          title: title.trim(),
          creator: creator.trim(),
          artistId: artistId || null,
          year: year ? parseInt(year, 10) : null,
          album: album.trim() || null,
          genre: genre.trim() || null,
          url: url.trim() || null,
          notes: notes.trim() || null,
          tags: tags.trim() || null,
          favorite,
        });
        onSaved(created);
      }
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to save reference. Please try again.");
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
              <Library className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-prime-text">
              {referenceToEdit ? "Edit Reference" : "Add Creative Reference"}
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
          {/* Reference Type */}
          <div>
            <label className="text-xs font-semibold text-prime-text block mb-1.5">
              Reference Type
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(Object.keys(REFERENCE_TYPE_CONFIGS) as ReferenceType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-all text-center ${
                    type === t
                      ? "bg-sky-500/20 text-sky-300 border-sky-500/40"
                      : "bg-prime-surfaceSubtle text-prime-textMuted border-prime-borderSubtle hover:text-prime-text"
                  }`}
                >
                  {REFERENCE_TYPE_CONFIGS[t].label.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-prime-text block mb-1">
              Title / Track Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. DNA. or The Creative Act"
              className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs sm:text-sm text-prime-text placeholder:text-prime-textMuted/50 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Artist / Creator & Link to Artist Roster */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-prime-text block mb-1">
                Artist / Creator Name *
              </label>
              <input
                type="text"
                required
                value={creator}
                onChange={(e) => setCreator(e.target.value)}
                placeholder="e.g. Kendrick Lamar"
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs sm:text-sm text-prime-text placeholder:text-prime-textMuted/50 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-prime-text block mb-1">
                Link to Artist Library
              </label>
              <select
                value={artistId}
                onChange={(e) => handleArtistSelect(e.target.value)}
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs sm:text-sm text-prime-text focus:outline-none focus:border-sky-500"
              >
                <option value="">-- No linked artist --</option>
                {artists.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Album & Year */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-prime-text block mb-1">
                Album / Source
              </label>
              <input
                type="text"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                placeholder="e.g. DAMN."
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs text-prime-text placeholder:text-prime-textMuted/50 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-prime-text block mb-1">
                Year
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 2017"
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs text-prime-text placeholder:text-prime-textMuted/50 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Genre & URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-prime-text block mb-1">
                Genre / Subgenre
              </label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="e.g. Conscious Rap / Trap"
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs text-prime-text placeholder:text-prime-textMuted/50 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-prime-text block mb-1">
                External URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs text-prime-text placeholder:text-prime-textMuted/50 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-prime-text block mb-1">
              Study Notes / Why This Matters
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Key standout elements: intense cadence transitions, heavy 808 sidechain, lyrical density..."
              className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle p-3 text-xs text-prime-text placeholder:text-prime-textMuted/50 focus:outline-none focus:border-sky-500 resize-none"
            />
          </div>

          {/* Tags & Favorite Checkbox */}
          <div className="flex items-center justify-between gap-4 pt-1">
            <div className="flex-1">
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Tags: flow, cadence, drums, 90s"
                className="w-full rounded-lg bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-1.5 text-xs text-prime-text placeholder:text-prime-textMuted/50 focus:outline-none focus:border-sky-500"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-prime-text shrink-0">
              <input
                type="checkbox"
                checked={favorite}
                onChange={(e) => setFavorite(e.target.checked)}
                className="rounded border-prime-borderSubtle text-sky-500 focus:ring-0"
              />
              <span>Mark Favorite</span>
            </label>
          </div>

          {/* Action buttons */}
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
              {loading ? "Saving..." : referenceToEdit ? "Update Reference" : "Save Reference"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
