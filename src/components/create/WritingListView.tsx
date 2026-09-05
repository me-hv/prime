"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import {
  WritingDocumentData,
  WritingType,
  WRITING_TYPE_CONFIGS,
} from "@/lib/types";
import { WritingCard } from "./WritingCard";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface WritingListViewProps {
  documents: WritingDocumentData[];
}

export function WritingListView({ documents }: WritingListViewProps) {
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const filtered = documents.filter((doc) => {
    const matchType = selectedType === "ALL" ? true : doc.type === selectedType;
    const matchStatus =
      selectedStatus === "ALL" ? true : doc.status === selectedStatus;
    return matchType && matchStatus;
  });

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-prime-borderSubtle">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold tracking-tight text-prime-text uppercase">
            Writing Studio Drafts
          </h2>
          <span className="rounded-full bg-prime-surface border border-prime-border px-2.5 py-0.5 text-xs font-mono text-prime-gold font-semibold">
            {documents.length} drafts
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Status filter tabs */}
          <div className="flex items-center rounded-lg bg-prime-surface p-0.5 border border-prime-borderSubtle">
            {["ALL", "DRAFT", "IN_PROGRESS", "FINISHED"].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-mono font-medium transition-colors",
                  selectedStatus === st
                    ? "bg-prime-card text-prime-gold shadow-prime-sm"
                    : "text-prime-textMuted hover:text-prime-text"
                )}
              >
                {st === "ALL"
                  ? "All"
                  : st === "DRAFT"
                  ? "Drafts"
                  : st === "IN_PROGRESS"
                  ? "Writing"
                  : "Finished"}
              </button>
            ))}
          </div>

          <Link href="/create/write">
            <Button
              variant="gold"
              size="sm"
              className="h-8 text-xs font-semibold shadow-prime-glow-gold"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              <span>New Writing</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Writing Type Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedType("ALL")}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-mono transition-colors whitespace-nowrap",
            selectedType === "ALL"
              ? "bg-prime-gold/15 text-prime-gold border border-prime-gold/30 font-semibold"
              : "bg-prime-surface text-prime-textMuted hover:text-prime-text border border-prime-borderSubtle"
          )}
        >
          All Categories ({documents.length})
        </button>
        {(Object.keys(WRITING_TYPE_CONFIGS) as WritingType[]).map((type) => {
          const count = documents.filter((d) => d.type === type).length;
          if (count === 0 && selectedType !== type) return null;

          return (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-mono transition-colors whitespace-nowrap",
                selectedType === type
                  ? "bg-prime-gold/15 text-prime-gold border border-prime-gold/30 font-semibold"
                  : "bg-prime-surface text-prime-textMuted hover:text-prime-text border border-prime-borderSubtle"
              )}
            >
              {WRITING_TYPE_CONFIGS[type].label} ({count})
            </button>
          );
        })}
      </div>

      {/* Documents Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filtered.map((doc) => (
            <WritingCard key={doc.id} document={doc} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-prime-borderSubtle bg-prime-surface/40 p-8 text-center">
          <p className="text-xs text-prime-textMuted font-medium">
            Nothing written in this category yet.
          </p>
          <p className="text-[11px] text-prime-textMuted/70 mt-1">
            Start with one line. You don&apos;t need the whole song today.
          </p>
          <Link href="/create/write">
            <Button variant="outline" size="sm" className="mt-3 text-xs">
              <Plus className="h-3.5 w-3.5 mr-1 text-prime-gold" />
              <span>Open Writing Studio</span>
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
