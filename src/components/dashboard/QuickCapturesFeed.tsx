"use client";

import * as React from "react";
import { useState } from "react";
import {
  QuickCaptureData,
  CaptureType,
  CAPTURE_TYPE_CONFIGS,
} from "@/lib/types";
import { Button } from "@/components/ui/Button";
import {
  Lightbulb,
  Feather,
  Music,
  MessageSquare,
  Disc,
  FileText,
  Bell,
  Sparkles,
  Copy,
  Trash2,
  Check,
  Plus,
} from "lucide-react";
import { deleteQuickCapture } from "@/actions/captures";
import { useToast } from "@/components/ui/Toast";
import { useNavigation } from "@/components/navigation/NavigationProvider";
import { formatShortDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const TYPE_ICONS: Record<CaptureType, React.ElementType> = {
  IDEA: Lightbulb,
  LYRIC: Feather,
  HOOK: Music,
  THOUGHT: MessageSquare,
  SONG_IDEA: Disc,
  WRITING_IDEA: FileText,
  REMINDER: Bell,
};

interface QuickCapturesFeedProps {
  captures: QuickCaptureData[];
}

export function QuickCapturesFeed({ captures }: QuickCapturesFeedProps) {
  const { success, error } = useToast();
  const { openQuickCapture } = useNavigation();
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredCaptures = captures.filter((c) => {
    if (selectedType === "ALL") return true;
    return c.type === selectedType;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    success("Copied to clipboard.");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteQuickCapture(id);
      success("Capture deleted.");
    } catch (err) {
      console.error(err);
      error("Failed to delete capture.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="rounded-xl border border-prime-borderSubtle bg-prime-card/85 p-5 shadow-prime-sm space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-prime-borderSubtle">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-prime-gold" />
          <h3 className="text-sm font-bold tracking-tight text-prime-text uppercase">
            Quick Idea Vault
          </h3>
          <span className="rounded-full bg-prime-surface border border-prime-border px-2 py-0.5 text-[10px] font-mono text-prime-textMuted">
            {captures.length} captures
          </span>
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={openQuickCapture}
          className="h-7 px-2.5 text-xs self-start sm:self-auto shadow-prime-glow-gold font-semibold"
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          <span>Capture</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedType("ALL")}
          className={cn(
            "rounded-md px-2 py-0.5 text-[11px] font-mono transition-colors whitespace-nowrap",
            selectedType === "ALL"
              ? "bg-prime-gold/15 text-prime-gold border border-prime-gold/30"
              : "bg-prime-surface text-prime-textMuted hover:text-prime-text border border-prime-borderSubtle"
          )}
        >
          All
        </button>
        {(Object.keys(CAPTURE_TYPE_CONFIGS) as CaptureType[]).map((type) => {
          const count = captures.filter((c) => c.type === type).length;
          if (count === 0 && selectedType !== type) return null;

          return (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={cn(
                "rounded-md px-2 py-0.5 text-[11px] font-mono transition-colors whitespace-nowrap",
                selectedType === type
                  ? "bg-prime-gold/15 text-prime-gold border border-prime-gold/30"
                  : "bg-prime-surface text-prime-textMuted hover:text-prime-text border border-prime-borderSubtle"
              )}
            >
              {CAPTURE_TYPE_CONFIGS[type].label} ({count})
            </button>
          );
        })}
      </div>

      {/* Captures List */}
      {filteredCaptures.length > 0 ? (
        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {filteredCaptures.map((item) => {
            const config = CAPTURE_TYPE_CONFIGS[item.type] || CAPTURE_TYPE_CONFIGS.IDEA;
            const Icon = TYPE_ICONS[item.type] || Sparkles;

            return (
              <div
                key={item.id}
                className="group relative rounded-lg border border-prime-borderSubtle bg-prime-surface/70 p-3 transition-colors hover:border-prime-border hover:bg-prime-surface"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="flex items-center gap-1 rounded bg-prime-border/50 px-1.5 py-0.2 text-[10px] font-mono text-prime-gold font-medium">
                      <Icon className="h-3 w-3" />
                      <span>{config.label}</span>
                    </span>
                    <span className="text-[10px] font-mono text-prime-textMuted">
                      {formatShortDate(item.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={() => handleCopy(item.id, item.content)}
                      className="p-1 text-prime-textMuted hover:text-prime-text"
                      title="Copy content"
                    >
                      {copiedId === item.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="p-1 text-prime-textMuted hover:text-rose-400"
                      title="Delete capture"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-prime-text whitespace-pre-wrap leading-relaxed font-sans">
                  {item.content}
                </p>

                {item.tags && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.tags.split(",").map((tag, idx) => (
                      <span
                        key={idx}
                        className="rounded bg-black/40 px-1.5 py-0.2 text-[9px] font-mono text-prime-textMuted"
                      >
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-prime-borderSubtle bg-prime-surface/30 p-4 text-center">
          <p className="text-xs text-prime-textMuted">No captures recorded in this category.</p>
        </div>
      )}
    </div>
  );
}
