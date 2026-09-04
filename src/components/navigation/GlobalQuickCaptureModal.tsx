"use client";

import * as React from "react";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { useNavigation } from "./NavigationProvider";
import { CaptureType, CAPTURE_TYPE_CONFIGS } from "@/lib/types";
import { createQuickCapture } from "@/actions/captures";
import { useToast } from "@/components/ui/Toast";
import {
  Lightbulb,
  Feather,
  Music,
  MessageSquare,
  Disc,
  FileText,
  Bell,
  Sparkles,
} from "lucide-react";
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

export function GlobalQuickCaptureModal() {
  const { isQuickCaptureOpen, closeQuickCapture } = useNavigation();
  const { success, error } = useToast();

  const [selectedType, setSelectedType] = useState<CaptureType>("IDEA");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setIsSubmitting(true);
      await createQuickCapture({
        type: selectedType,
        content: content.trim(),
        tags: tags.trim() || undefined,
      });

      success(`${CAPTURE_TYPE_CONFIGS[selectedType].label} captured.`);
      setContent("");
      setTags("");
      closeQuickCapture();
    } catch (err) {
      console.error(err);
      error("Failed to save capture. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isQuickCaptureOpen}
      onClose={closeQuickCapture}
      title="QUICK CAPTURE"
      description="Capture inspiration the instant it strikes. Never lose a bar, hook, or concept."
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {/* Type Selector Pills */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-prime-textMuted font-mono">
            Capture Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {(Object.keys(CAPTURE_TYPE_CONFIGS) as CaptureType[]).map((type) => {
              const config = CAPTURE_TYPE_CONFIGS[type];
              const Icon = TYPE_ICONS[type] || Sparkles;
              const isSelected = selectedType === type;

              return (
                <button
                  type="button"
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs font-medium transition-all text-left",
                    isSelected
                      ? "border-prime-gold/40 bg-prime-gold/15 text-prime-gold shadow-prime-sm"
                      : "border-prime-borderSubtle bg-prime-surface/80 text-prime-textSecondary hover:border-prime-border hover:text-prime-text"
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{config.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Field */}
        <Textarea
          label="Content / Idea"
          placeholder={
            selectedType === "LYRIC"
              ? "Type your 16 bars, rhyme scheme, or single punchline..."
              : selectedType === "HOOK"
              ? "Melody notes, vocal cadence, hook lyrics..."
              : selectedType === "SONG_IDEA"
              ? "Song concept, working title, emotional angle..."
              : "Drop the raw thought here..."
          }
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          autoFocus
          required
        />

        {/* Tags */}
        <Input
          label="Tags (optional, comma-separated)"
          placeholder="e.g. verse-2, ep-track, dark-tempo, hook"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={closeQuickCapture}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="gold"
            disabled={isSubmitting || !content.trim()}
            className="px-5 shadow-prime-glow-gold font-semibold"
          >
            {isSubmitting ? "Capturing..." : "Save Capture"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
