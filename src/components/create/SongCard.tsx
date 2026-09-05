"use client";

import * as React from "react";
import Link from "next/link";
import { SongData, SONG_STATUS_CONFIGS } from "@/lib/types";
import { formatShortDate } from "@/lib/utils";
import {
  ArrowRight,
  Trash2,
  Clock,
  Layers,
  Target,
} from "lucide-react";
import { deleteSong } from "@/actions/songs";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

interface SongCardProps {
  song: SongData;
}

export function SongCard({ song }: SongCardProps) {
  const { success, error } = useToast();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const statusConfig =
    SONG_STATUS_CONFIGS[song.status] || SONG_STATUS_CONFIGS.IDEA;

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete song "${song.title}"?`)) return;

    try {
      setIsDeleting(true);
      await deleteSong(song.id);
      success("Song removed.");
    } catch (err) {
      console.error(err);
      error("Failed to delete song.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Link
      href={`/create/songs/${song.id}`}
      className="group relative rounded-xl border border-prime-borderSubtle bg-prime-card/85 p-5 transition-all duration-200 hover:border-prime-border hover:bg-prime-card flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <span
            className={cn(
              "rounded px-2.5 py-0.5 text-[10px] font-mono border uppercase tracking-wider font-semibold",
              statusConfig.badgeClass
            )}
          >
            {statusConfig.label}
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-prime-textMuted flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatShortDate(song.updatedAt)}</span>
            </span>

            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-prime-textMuted hover:text-rose-400"
              title="Delete song"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <h3 className="text-base font-bold tracking-tight text-prime-text group-hover:text-prime-gold transition-colors line-clamp-1">
          {song.title}
        </h3>

        {song.concept && (
          <p className="mt-1 text-xs text-prime-textSecondary line-clamp-2 leading-relaxed font-sans">
            {song.concept}
          </p>
        )}

        {/* Musical Metadata Tags */}
        {(song.bpm || song.musicalKey || song.genre) && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
            {song.genre && (
              <span className="rounded bg-prime-surface border border-prime-borderSubtle px-2 py-0.5 text-prime-textMuted">
                {song.genre}
              </span>
            )}
            {song.bpm && (
              <span className="rounded bg-prime-surface border border-prime-borderSubtle px-2 py-0.5 text-prime-gold font-bold">
                {song.bpm} BPM
              </span>
            )}
            {song.musicalKey && (
              <span className="rounded bg-prime-surface border border-prime-borderSubtle px-2 py-0.5 text-sky-400">
                Key: {song.musicalKey}
              </span>
            )}
          </div>
        )}

        {/* Next Action Indicator (Finish Machine Foundation) */}
        {song.nextAction && (
          <div className="mt-3 flex items-start gap-1.5 rounded-lg bg-prime-surface/90 border border-prime-borderSubtle/80 p-2 text-xs">
            <Target className="h-3.5 w-3.5 text-prime-gold shrink-0 mt-0.5" />
            <span className="text-[11px] text-prime-textSecondary line-clamp-1">
              Next: <strong className="text-prime-text font-medium">{song.nextAction}</strong>
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-prime-borderSubtle/60 flex items-center justify-between text-xs font-mono">
        <span className="text-prime-textMuted flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5 text-prime-gold" />
          <span>{song.sections.length} sections • {song.wordCount} words</span>
        </span>
        <span className="text-prime-textMuted group-hover:text-prime-gold group-hover:translate-x-0.5 transition-all flex items-center gap-1 font-semibold">
          <span>Studio</span>
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}
