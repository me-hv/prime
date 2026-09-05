"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { ArtistData } from "@/lib/types";
import { ArtistCard } from "./ArtistCard";
import { Search, Plus, Users, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArtistListViewProps {
  artists: ArtistData[];
  onNewArtist: () => void;
  onEditArtist: (artist: ArtistData) => void;
  onAddReferenceForArtist: (artist: ArtistData) => void;
  onFilterByArtist: (artistId: string) => void;
}

const STATUS_FILTERS: { id: string; label: string }[] = [
  { id: "ALL", label: "All Artists" },
  { id: "STUDYING", label: "Actively Studying" },
  { id: "ACTIVE_REFERENCE", label: "Active Reference" },
  { id: "DISCOVERED", label: "Discovered" },
  { id: "ARCHIVED", label: "Archived" },
];

export function ArtistListView({
  artists,
  onNewArtist,
  onEditArtist,
  onAddReferenceForArtist,
  onFilterByArtist,
}: ArtistListViewProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const filteredArtists = useMemo(() => {
    return artists.filter((a) => {
      if (statusFilter !== "ALL" && a.status !== statusFilter) return false;
      if (favoritesOnly && !a.favorite) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = a.name.toLowerCase().includes(q);
        const matchesRole = a.role.toLowerCase().includes(q);
        const matchesNotes = a.notes?.toLowerCase().includes(q);
        const matchesGenres = a.genres?.toLowerCase().includes(q);
        return matchesName || matchesRole || matchesNotes || matchesGenres;
      }
      return true;
    });
  }, [artists, search, statusFilter, favoritesOnly]);

  return (
    <div className="space-y-4">
      {/* Search + Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-prime-textMuted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search artists by name, role, genre, notes..."
            className="w-full rounded-xl bg-prime-surface border border-prime-borderSubtle pl-9 pr-4 py-2 text-xs sm:text-sm text-prime-text placeholder:text-prime-textMuted/50 focus:outline-none focus:border-amber-500"
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
            onClick={onNewArtist}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 shadow-prime-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Artist</span>
          </button>
        </div>
      </div>

      {/* Status Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setStatusFilter(f.id)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
              statusFilter === f.id
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "bg-prime-surface/60 text-prime-textMuted hover:text-prime-text border border-prime-borderSubtle"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredArtists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArtists.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              onEdit={onEditArtist}
              onAddReference={onAddReferenceForArtist}
              onFilterByArtist={onFilterByArtist}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 rounded-2xl border border-prime-borderSubtle bg-prime-surface/40 p-6 space-y-3">
          <Users className="h-8 w-8 text-prime-textMuted mx-auto" />
          <h3 className="text-sm font-bold text-prime-text">
            No artists found
          </h3>
          <p className="text-xs text-prime-textMuted max-w-sm mx-auto">
            {search || statusFilter !== "ALL" || favoritesOnly
              ? "Try adjusting your filters or search terms."
              : "Start building your Artist Lineage. Add legends, lyricists, and producers you actively study."}
          </p>
          {!search && (
            <button
              onClick={onNewArtist}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 shadow-prime-sm transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add Your First Artist</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
