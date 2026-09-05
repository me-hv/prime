"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  QuickCaptureData,
  WritingType,
  SongSectionType,
  WRITING_TYPE_CONFIGS,
  SECTION_TYPE_CONFIGS,
} from "@/lib/types";
import {
  convertCaptureToWriting,
  convertCaptureToSong,
} from "@/actions/captures";
import { useToast } from "@/components/ui/Toast";
import { FileText, Music, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConvertCaptureModalProps {
  capture: QuickCaptureData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ConvertCaptureModal({
  capture,
  isOpen,
  onClose,
}: ConvertCaptureModalProps) {
  const router = useRouter();
  const { success, error } = useToast();

  const [destination, setDestination] = useState<"WRITING" | "SONG">("WRITING");
  const [title, setTitle] = useState("");
  const [writingType, setWritingType] = useState<WritingType>("FREE_WRITE");
  const [sectionType, setSectionType] = useState<SongSectionType>("HOOK");
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (capture) {
      setTitle(
        capture.title ||
          (capture.content.length > 35
            ? `${capture.content.slice(0, 32)}...`
            : capture.content)
      );
      if (capture.type === "HOOK") {
        setDestination("SONG");
        setSectionType("HOOK");
        setWritingType("HOOK");
      } else if (capture.type === "LYRIC") {
        setDestination("WRITING");
        setWritingType("BARS");
      } else if (capture.type === "SONG_IDEA") {
        setDestination("SONG");
        setWritingType("CONCEPT");
      }
    }
  }, [capture]);

  if (!capture) return null;

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);

      if (destination === "WRITING") {
        const doc = await convertCaptureToWriting(capture.id, {
          title: title.trim(),
          type: writingType,
        });
        if (doc) {
          success("Capture converted into Writing Draft.");
          onClose();
          router.push(`/create/write/${doc.id}`);
        }
      } else {
        const song = await convertCaptureToSong(capture.id, {
          title: title.trim(),
          sectionType,
        });
        if (song) {
          success("Capture converted into Song Workspace.");
          onClose();
          router.push(`/create/songs/${song.id}`);
        }
      }
    } catch (err) {
      console.error(err);
      error("Failed to convert capture.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="CONVERT CAPTURE INTO CREATIVE WORK"
      description="Turn this spark into an active draft or structured song without losing the original idea."
    >
      <form onSubmit={handleConvert} className="space-y-4 pt-1">
        {/* Raw Capture Preview */}
        <div className="rounded-lg border border-prime-borderSubtle bg-prime-surface/70 p-3">
          <span className="text-[10px] font-mono text-prime-gold uppercase font-semibold">
            Original Capture ({capture.type})
          </span>
          <p className="mt-1 text-xs text-prime-textSecondary line-clamp-3 italic">
            &ldquo;{capture.content}&rdquo;
          </p>
        </div>

        {/* Destination Target Tabs */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-prime-textMuted font-mono">
            Convert To
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDestination("WRITING")}
              className={cn(
                "flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all",
                destination === "WRITING"
                  ? "border-sky-500/40 bg-sky-500/15 text-sky-300 shadow-prime-sm"
                  : "border-prime-borderSubtle bg-prime-surface/80 text-prime-textSecondary hover:border-prime-border hover:text-prime-text"
              )}
            >
              <FileText className="h-4 w-4 shrink-0 text-sky-400" />
              <div>
                <p className="text-xs font-bold">Writing Studio Draft</p>
                <p className="text-[10px] text-prime-textMuted">
                  Verses, 16 bars, free writes, lyric notebook
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setDestination("SONG")}
              className={cn(
                "flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all",
                destination === "SONG"
                  ? "border-purple-500/40 bg-purple-500/15 text-purple-300 shadow-prime-sm"
                  : "border-prime-borderSubtle bg-prime-surface/80 text-prime-textSecondary hover:border-prime-border hover:text-prime-text"
              )}
            >
              <Music className="h-4 w-4 shrink-0 text-purple-400" />
              <div>
                <p className="text-xs font-bold">Structured Song</p>
                <p className="text-[10px] text-prime-textMuted">
                  Multi-section song workspace with hooks & verses
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Title Input */}
        <Input
          label="New Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Obsidian Skies, Titanium Bars..."
          required
        />

        {/* Sub-type Selectors */}
        {destination === "WRITING" ? (
          <Select
            label="Writing Category"
            value={writingType}
            onChange={(e) => setWritingType(e.target.value as WritingType)}
          >
            {(Object.keys(WRITING_TYPE_CONFIGS) as WritingType[]).map((type) => (
              <option key={type} value={type}>
                {WRITING_TYPE_CONFIGS[type].label}
              </option>
            ))}
          </Select>
        ) : (
          <Select
            label="Initial Song Section"
            value={sectionType}
            onChange={(e) => setSectionType(e.target.value as SongSectionType)}
          >
            {(Object.keys(SECTION_TYPE_CONFIGS) as SongSectionType[]).map(
              (type) => (
                <option key={type} value={type}>
                  Place into: {SECTION_TYPE_CONFIGS[type].label}
                </option>
              )
            )}
          </Select>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-prime-borderSubtle">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="gold"
            disabled={isSubmitting || !title.trim()}
            className="shadow-prime-glow-gold font-semibold"
          >
            <span>{isSubmitting ? "Converting..." : "Convert & Open"}</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </form>
    </Modal>
  );
}
