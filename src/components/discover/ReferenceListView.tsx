"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import {
  ArtistReferenceData,
} from "@/lib/types";
import { ReferenceCard } from "./ReferenceCard";
import { Search, Plus, Star, Library } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReferenceListViewProps {
  references: ArtistReferenceData[];
  onNewReference: () => void;
  onEditReference: (ref: ArtistReferenceData) => void;
  onStudyReference: (ref: ArtistReferenceData) => void;
}

const TYPE_FILTERS: { id: string; label: string }[] = [
  { id: "ALL", label: "All References" },
  { id: "SONG", label: "Songs" },
  { id: "ALBUM", label: "Albums" },
  { id: "BOOK", label: "Books & Literature" },
  { id: "ARTICLE", label: "Articles & Essays" },
  { id: "INTERVIEW", label: "Interviews" },
  { id: "VIDEO", label: "Video Breakdowns" },
];

export function ReferenceListView({
  references,
  onNewReference,
  onEditReference,
  onStudyReference,
}: ReferenceListViewProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const filteredReferences = useMemo(() => {
    return references.filter((r) => {
      if (typeFilter !== "ALL" && r.type !== typeFilter) return false;
      if (favoritesOnly && !r.favorite) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = r.title.toLowerCase().includes(q);
        const matchesCreator = r.creator.toLowerCase().includes(q);
        const matchesNotes = r.notes?.toLowerCase().includes(q);
        const matchesAlbum = r.album?.toLowerCase().includes(q);
        const matchesTags = r.tags?.toLowerCase().includes(q);
        return (
          matchesTitle ||
          matchesCreator ||
          matchesNotes ||
          matchesAlbum ||
          matchesTags
        );
      }
      return true;
    });
  }, [references, search, typeFilter, favoritesOnly]);

  return (
    <div className="space-y-4">
      {/* Controls: Search + Filters + Favorites Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-prime-textMuted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search references, artists, albums, or notes..."
            className="w-full rounded-xl bg-prime-surface border border-prime-borderSubtle pl-9 pr-4 py-2 text-xs sm:text-sm text-prime-text placeholder:text-prime-textMuted/50 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Favorite toggle + Add button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFavoritesOnly(!favoritesOnly)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all",
              favoritesOnly
                ? "bg-amber-500/15 text-amber-300 border-amber-500/40"
                : "bg-prime-surface text-prime-textMuted border-prime-borderSubtle hover:text-prime-text"
            )}
          >
            <Star className={cn("h-3.5 w-3.5", favoritesOnly && "fill-current")} />
            <span>Favorites</span>
          </button>
          <button
            onClick={onNewReference}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 text-white text-xs font-bold hover:bg-sky-400 shadow-prime-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Reference</span>
          </button>
        </div>
      </div>

      {/* Type Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setTypeFilter(f.id)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
              typeFilter === f.id
                ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                : "bg-prime-surface/60 text-prime-textMuted hover:text-prime-text border border-prime-borderSubtle"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* References Grid */}
      {filteredReferences.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReferences.map((ref) => (
            <ReferenceCard
              key={ref.id}
              reference={ref}
              onEdit={onEditReference}
              onStudy={onStudyReference}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 rounded-2xl border border-prime-borderSubtle bg-prime-surface/40 p-6 space-y-3">
          <Library className="h-8 w-8 text-prime-textMuted mx-auto" />
          <h3 className="text-sm font-bold text-prime-text">
            No creative references found
          </h3>
          <p className="text-xs text-prime-textMuted max-w-sm mx-auto">
            {search || typeFilter !== "ALL" || favoritesOnly
              ? "Try adjusting your filters or search terms."
              : "Save inspiring songs, albums, books, and interviews to build your personal reference library."}
          </p>
          {!search && (
            <button
              onClick={onNewReference}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 text-white text-xs font-bold hover:bg-sky-400 shadow-prime-sm transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add Your First Reference</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
