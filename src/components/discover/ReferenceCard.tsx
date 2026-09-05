"use client";

import * as React from "react";
import {
  ArtistReferenceData,
  REFERENCE_TYPE_CONFIGS,
} from "@/lib/types";
import {
  Star,
  ExternalLink,
  Edit2,
  Trash2,
  Calendar,
  Sparkles,
} from "lucide-react";
import { toggleFavoriteReference, deleteReference } from "@/actions/discovery";
import { cn } from "@/lib/utils";

interface ReferenceCardProps {
  reference: ArtistReferenceData;
  onEdit: (ref: ArtistReferenceData) => void;
  onStudy: (ref: ArtistReferenceData) => void;
  onDelete?: (id: string) => void;
}

export function ReferenceCard({
  reference,
  onEdit,
  onStudy,
  onDelete,
}: ReferenceCardProps) {
  const [favorite, setFavorite] = React.useState(reference.favorite);
  const typeConfig =
    REFERENCE_TYPE_CONFIGS[reference.type] || REFERENCE_TYPE_CONFIGS.SONG;

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newFav = await toggleFavoriteReference(reference.id);
    setFavorite(newFav);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete reference "${reference.title}"?`)) {
      await deleteReference(reference.id);
      if (onDelete) onDelete(reference.id);
    }
  };

  return (
    <div className="group relative rounded-xl border border-prime-borderSubtle bg-prime-surface p-4 hover:border-sky-500/40 hover:shadow-prime-md transition-all flex flex-col justify-between">
      <div>
        {/* Top bar: Type + Favorite + Actions */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span
            className={cn(
              "px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border",
              typeConfig.badgeClass
            )}
          >
            {typeConfig.label}
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
                onEdit(reference);
              }}
              className="p-1 rounded-md text-prime-textMuted hover:text-prime-text opacity-0 group-hover:opacity-100 transition-all"
              title="Edit Reference"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 rounded-md text-prime-textMuted hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
              title="Delete Reference"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Title & Creator */}
        <h3 className="text-sm sm:text-base font-extrabold text-prime-text tracking-tight group-hover:text-sky-300 transition-colors line-clamp-1">
          {reference.title}
        </h3>
        <p className="text-xs font-semibold text-prime-textSecondary mt-0.5">
          by {reference.creator}
          {reference.album && (
            <span className="text-prime-textMuted font-normal">
              {" "}
              • {reference.album}
            </span>
          )}
        </p>

        {/* Meta details */}
        <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-prime-textMuted">
          {reference.year && (
            <span className="flex items-center gap-1 font-mono">
              <Calendar className="h-3 w-3" />
              {reference.year}
            </span>
          )}
          {reference.genre && (
            <span className="px-1.5 py-0.5 rounded bg-prime-surfaceSubtle border border-prime-borderSubtle">
              {reference.genre}
            </span>
          )}
          {reference.studySessionCount !== undefined && reference.studySessionCount > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20 font-mono">
              {reference.studySessionCount} studies logged
            </span>
          )}
        </div>

        {/* Notes Preview */}
        {reference.notes && (
          <p className="text-xs text-prime-textMuted mt-2.5 line-clamp-2 leading-relaxed bg-prime-surfaceSubtle/50 p-2 rounded-lg border border-prime-borderSubtle">
            {reference.notes}
          </p>
        )}
      </div>

      {/* Footer buttons */}
      <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-prime-borderSubtle">
        {reference.url ? (
          <a
            href={reference.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 font-semibold"
          >
            <span>Open Link</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="text-[11px] text-prime-textMuted font-mono">Manual Reference</span>
        )}

        <button
          onClick={() => onStudy(reference)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-500/15 text-sky-300 border border-sky-500/30 text-xs font-bold hover:bg-sky-500/25 transition-all"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Study Work</span>
        </button>
      </div>
    </div>
  );
}
