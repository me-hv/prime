"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { SongData, SongStatus, SONG_STATUS_CONFIGS } from "@/lib/types";
import { SongCard } from "./SongCard";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface SongListViewProps {
  songs: SongData[];
}

export function SongListView({ songs }: SongListViewProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const filtered = songs.filter((s) => {
    if (selectedStatus === "ALL") return true;
    return s.status === selectedStatus;
  });

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-prime-borderSubtle">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold tracking-tight text-prime-text uppercase">
            Song Catalog & Workspace
          </h2>
          <span className="rounded-full bg-prime-surface border border-prime-border px-2.5 py-0.5 text-xs font-mono text-prime-gold font-semibold">
            {songs.length} songs
          </span>
        </div>

        <Link href="/create/songs">
          <Button
            variant="gold"
            size="sm"
            className="h-8 text-xs font-semibold shadow-prime-glow-gold"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>New Song</span>
          </Button>
        </Link>
      </div>

      {/* Song Status Pipeline Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedStatus("ALL")}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-mono transition-colors whitespace-nowrap",
            selectedStatus === "ALL"
              ? "bg-prime-gold/15 text-prime-gold border border-prime-gold/30 font-semibold"
              : "bg-prime-surface text-prime-textMuted hover:text-prime-text border border-prime-borderSubtle"
          )}
        >
          All Stages ({songs.length})
        </button>
        {(Object.keys(SONG_STATUS_CONFIGS) as SongStatus[]).map((status) => {
          const count = songs.filter((s) => s.status === status).length;
          if (count === 0 && selectedStatus !== status) return null;

          return (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-mono transition-colors whitespace-nowrap",
                selectedStatus === status
                  ? "bg-prime-gold/15 text-prime-gold border border-prime-gold/30 font-semibold"
                  : "bg-prime-surface text-prime-textMuted hover:text-prime-text border border-prime-borderSubtle"
              )}
            >
              {SONG_STATUS_CONFIGS[status].label} ({count})
            </button>
          );
        })}
      </div>

      {/* Songs Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filtered.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-prime-borderSubtle bg-prime-surface/40 p-8 text-center">
          <p className="text-xs text-prime-textMuted font-medium">
            No songs found in this pipeline stage.
          </p>
          <p className="text-[11px] text-prime-textMuted/70 mt-1">
            Pick an idea or hook and turn it into something real.
          </p>
          <Link href="/create/songs">
            <Button variant="outline" size="sm" className="mt-3 text-xs">
              <Plus className="h-3.5 w-3.5 mr-1 text-prime-gold" />
              <span>Create New Song Workspace</span>
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
