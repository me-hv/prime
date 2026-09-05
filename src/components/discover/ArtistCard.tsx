"use client";

import * as React from "react";
import { ArtistData, ARTIST_STATUS_CONFIGS } from "@/lib/types";
import {
  Star,
  Edit2,
  Trash2,
  Library,
  Headphones,
  Plus,
} from "lucide-react";
import { updateArtist, deleteArtist } from "@/actions/discovery";
import { cn } from "@/lib/utils";

interface ArtistCardProps {
  artist: ArtistData;
  onEdit: (artist: ArtistData) => void;
  onAddReference: (artist: ArtistData) => void;
  onFilterByArtist: (artistId: string) => void;
  onDelete?: (id: string) => void;
}

export function ArtistCard({
  artist,
  onEdit,
  onAddReference,
  onFilterByArtist,
  onDelete,
}: ArtistCardProps) {
  const [favorite, setFavorite] = React.useState(artist.favorite);
  const statusConfig =
    ARTIST_STATUS_CONFIGS[artist.status] || ARTIST_STATUS_CONFIGS.STUDYING;

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = await updateArtist(artist.id, { favorite: !favorite });
    setFavorite(updated.favorite);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Remove artist "${artist.name}" from library?`)) {
      await deleteArtist(artist.id);
      if (onDelete) onDelete(artist.id);
    }
  };

  return (
    <div className="group relative rounded-xl border border-prime-borderSubtle bg-prime-surface p-4 hover:border-amber-500/40 hover:shadow-prime-md transition-all flex flex-col justify-between">
      <div>
        {/* Top: Status Badge + Favorite + Edit */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span
            className={cn(
              "px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border",
              statusConfig.badgeClass
            )}
          >
            {statusConfig.label}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={handleFavorite}
              className={cn(
                "p-1 rounded-md transition-colors",
                favorite
                  ? "text-amber-400 hover:text-amber-300"
                  : "text-prime-textMuted/40 hover:text-prime-textMuted"
              )}
              title={favorite ? "Favorited" : "Mark as Favorite"}
            >
              <Star className={cn("h-4 w-4", favorite && "fill-current")} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(artist);
              }}
              className="p-1 rounded-md text-prime-textMuted hover:text-prime-text opacity-0 group-hover:opacity-100 transition-all"
              title="Edit Artist"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 rounded-md text-prime-textMuted hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
              title="Delete Artist"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Name & Role */}
        <h3 className="text-base sm:text-lg font-extrabold text-prime-text tracking-tight group-hover:text-amber-300 transition-colors">
          {artist.name}
        </h3>
        <p className="text-xs font-semibold text-prime-textSecondary mt-0.5">
          {artist.role}
        </p>

        {/* Stats & Genres */}
        <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-prime-textMuted">
          <button
            onClick={() => onFilterByArtist(artist.id)}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20 font-mono hover:bg-sky-500/20 transition-all"
          >
            <Library className="h-3 w-3" />
            <span>{artist.referenceCount || 0} references</span>
          </button>
          {artist.studySessionCount !== undefined && artist.studySessionCount > 0 && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
              <Headphones className="h-3 w-3" />
              <span>{artist.studySessionCount} studies</span>
            </span>
          )}
          {artist.genres && (
            <span className="px-1.5 py-0.5 rounded bg-prime-surfaceSubtle border border-prime-borderSubtle">
              {artist.genres}
            </span>
          )}
        </div>

        {/* Notes */}
        {artist.notes && (
          <p className="text-xs text-prime-textMuted mt-2.5 line-clamp-3 leading-relaxed bg-prime-surfaceSubtle/50 p-2.5 rounded-lg border border-prime-borderSubtle">
            {artist.notes}
          </p>
        )}
      </div>

      {/* Footer: Quick Add Reference */}
      <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-prime-borderSubtle">
        <button
          onClick={() => onFilterByArtist(artist.id)}
          className="text-xs text-prime-textMuted hover:text-prime-text font-medium"
        >
          View Works ({artist.referenceCount || 0})
        </button>

        <button
          onClick={() => onAddReference(artist)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-prime-surfaceSubtle border border-prime-borderSubtle text-xs font-semibold text-prime-text hover:bg-prime-surfaceHover hover:border-prime-border transition-all"
        >
          <Plus className="h-3.5 w-3.5 text-amber-400" />
          <span>Add Work</span>
        </button>
      </div>
    </div>
  );
}
