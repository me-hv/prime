"use client";

import * as React from "react";
import { useState } from "react";
import {
  CheckCircle2,
  Flame,
  Gauge,
  Sparkles,
  FileText,
  Clock,
  Loader2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SessionCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    effortRating: number;
    difficultyRating: number;
    confidenceRating: number;
    notes: string;
  }) => Promise<void>;
  exerciseTitle: string;
  durationSeconds: number;
  writingDocumentId?: string;
  initialNotes?: string;
}

export function SessionCompletionModal({
  isOpen,
  onClose,
  onSave,
  exerciseTitle,
  durationSeconds,
  writingDocumentId,
  initialNotes = "",
}: SessionCompletionModalProps) {
  const [effort, setEffort] = useState<number>(4);
  const [difficulty, setDifficulty] = useState<number>(3);
  const [confidence, setConfidence] = useState<number>(4);
  const [notes, setNotes] = useState<string>(initialNotes);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  const timeFormatted = `${minutes}m ${seconds.toString().padStart(2, "0")}s`;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        effortRating: effort,
        difficultyRating: difficulty,
        confidenceRating: confidence,
        notes: notes.trim(),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderRatingGroup = (
    label: string,
    description: string,
    value: number,
    onChange: (v: number) => void,
    icon: React.ReactNode,
    colorClass: string
  ) => {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={colorClass}>{icon}</span>
            <span className="text-xs font-semibold text-prime-text uppercase tracking-wider">
              {label}
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-prime-textMuted">
            {value} / 5
          </span>
        </div>
        <p className="text-[11px] text-prime-textMuted">{description}</p>
        <div className="grid grid-cols-5 gap-1.5">
          {[1, 2, 3, 4, 5].map((level) => {
            const isSelected = value === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => onChange(level)}
                className={cn(
                  "py-2 rounded-lg text-xs font-mono font-bold transition-all border",
                  isSelected
                    ? "bg-orange-500 text-black border-orange-400 shadow-prime-sm font-extrabold scale-[1.02]"
                    : "bg-prime-surfaceSubtle text-prime-textSecondary border-prime-borderSubtle hover:border-prime-border hover:text-prime-text"
                )}
              >
                {level}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg rounded-2xl border border-prime-border bg-prime-surface shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-prime-borderSubtle bg-gradient-to-b from-orange-500/10 to-transparent">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-prime-textMuted hover:text-prime-text hover:bg-prime-surfaceSubtle transition-colors"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-orange-400 font-bold">
                DRILL COMPLETE
              </span>
              <h2 className="text-lg font-extrabold text-prime-text">
                {exerciseTitle}
              </h2>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-xs font-mono text-prime-textMuted bg-prime-surfaceSubtle/80 px-3 py-2 rounded-lg border border-prime-borderSubtle">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-orange-400" />
              <span>Time Trained: <strong className="text-prime-text">{timeFormatted}</strong></span>
            </div>
            {writingDocumentId && (
              <div className="flex items-center gap-1.5 text-emerald-400 ml-auto">
                <FileText className="h-3.5 w-3.5" />
                <span className="text-[11px]">Saved as Draft</span>
              </div>
            )}
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Effort */}
          {renderRatingGroup(
            "Focus & Intensity",
            "How much deliberate focus and presence did you maintain throughout the drill?",
            effort,
            setEffort,
            <Flame className="h-4 w-4" />,
            "text-orange-400"
          )}

          {/* Difficulty */}
          {renderRatingGroup(
            "Technical Difficulty",
            "How challenging was this cadence, constraint, or exercise?",
            difficulty,
            setDifficulty,
            <Gauge className="h-4 w-4" />,
            "text-amber-400"
          )}

          {/* Confidence */}
          {renderRatingGroup(
            "Execution Confidence",
            "How dialed-in and clean was your pocket lock and lyrical delivery?",
            confidence,
            setConfidence,
            <Sparkles className="h-4 w-4" />,
            "text-yellow-400"
          )}

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-prime-text uppercase tracking-wider block">
              Session Reflections / Takeaways
            </label>
            <p className="text-[11px] text-prime-textMuted">
              What pocket felt natural? What syllables tripped you up? What will you adjust next time?
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Felt comfortable at 90 BPM on straight 16ths, but triplet switch in bar 12 lost momentum. Need more breath control prep..."
              rows={3}
              className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs text-prime-text placeholder:text-prime-textMuted/50 focus:outline-none focus:border-orange-500/50 resize-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-prime-borderSubtle bg-prime-surfaceSubtle/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-prime-textMuted hover:text-prime-text hover:bg-prime-surfaceSubtle transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs tracking-wide shadow-prime-md transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Saving Session...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Log Training Session</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
