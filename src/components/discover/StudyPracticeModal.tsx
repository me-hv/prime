"use client";

import * as React from "react";
import { useState } from "react";
import {
  X,
  Sparkles,
  Flame,
  PenTool,
  Disc,
  Lightbulb,
  ArrowRight,
  Check,
} from "lucide-react";
import { convertStudyToPractice } from "@/actions/discovery";
import { useRouter } from "next/navigation";

interface StudyPracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  studySessionId: string;
  defaultObservation?: string;
  focusTitle?: string;
}

export function StudyPracticeModal({
  isOpen,
  onClose,
  studySessionId,
  defaultObservation = "",
  focusTitle = "Study Observation",
}: StudyPracticeModalProps) {
  const router = useRouter();
  const [targetType, setTargetType] = useState<"DRILL" | "WRITING" | "SONG" | "CAPTURE">("WRITING");
  const [customTitle, setCustomTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConvert = async () => {
    setLoading(true);
    try {
      const res = await convertStudyToPractice({
        studySessionId,
        targetType,
        promptTitle: customTitle.trim() || undefined,
      });

      setFeedback(res.message);
      setTimeout(() => {
        onClose();
        router.push(res.redirectUrl);
      }, 500);
    } catch (err) {
      console.error(err);
      setFeedback("Failed to convert observation to practice.");
    } finally {
      setLoading(false);
    }
  };

  const OPTIONS = [
    {
      id: "WRITING",
      label: "10-Min Writing Sprint / Draft",
      description: "Initialize a new Writing Document with this study observation as your starter constraint prompt.",
      icon: PenTool,
      badge: "Creative Workspace",
      badgeClass: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    },
    {
      id: "DRILL",
      label: "Deliberate Training Drill",
      description: "Launch targeted flow, cadence, or writing drills in the Artist Training Gymnasium.",
      icon: Flame,
      badge: "Training Gymnasium",
      badgeClass: "bg-orange-500/10 text-orange-300 border-orange-500/30",
    },
    {
      id: "SONG",
      label: "New Song Concept & Structure",
      description: "Scaffold a full modular song workspace pre-populated with arrangement notes from this study.",
      icon: Disc,
      badge: "Song Production",
      badgeClass: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    },
    {
      id: "CAPTURE",
      label: "Creative Inbox Idea",
      description: "Save this technique takeaway to your raw idea capture feed for later song development.",
      icon: Lightbulb,
      badge: "Idea Vault",
      badgeClass: "bg-sky-500/10 text-sky-300 border-sky-500/30",
    },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-sky-500/30 bg-prime-surface p-6 shadow-prime-lg">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-prime-borderSubtle">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-prime-text">
                Turn Observation Into Practice
              </h3>
              <p className="text-xs text-prime-textMuted">
                {focusTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-prime-textMuted hover:text-prime-text hover:bg-prime-surfaceHover"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Observation Quote preview */}
        {defaultObservation && (
          <div className="my-4 p-3 rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle">
            <span className="text-[10px] font-mono uppercase tracking-wider text-prime-textMuted block mb-1">
              Study Takeaway / Technique:
            </span>
            <p className="text-xs text-prime-textSecondary italic">
              &quot;{defaultObservation.slice(0, 180)}{defaultObservation.length > 180 ? "..." : ""}&quot;
            </p>
          </div>
        )}

        {/* Conversion Target Selector */}
        <div className="space-y-2.5 my-4">
          <label className="text-xs font-semibold text-prime-text block">
            Select Practice Pathway:
          </label>
          <div className="grid grid-cols-1 gap-2">
            {OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = targetType === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTargetType(opt.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-sky-500/10 border-sky-500/40 shadow-prime-sm"
                      : "bg-prime-surfaceSubtle/50 border-prime-borderSubtle hover:border-prime-border"
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${isSelected ? "bg-sky-500 text-white" : "bg-prime-surface border border-prime-borderSubtle text-prime-textMuted"}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-prime-text">
                        {opt.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${opt.badgeClass}`}>
                        {opt.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-prime-textMuted mt-0.5 leading-relaxed">
                      {opt.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Custom Title */}
        <div className="space-y-1.5 mb-5">
          <label className="text-xs font-medium text-prime-textMuted">
            Custom Title (Optional)
          </label>
          <input
            type="text"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder="e.g. Cadence Switch Drill - 4 Bar Contrast"
            className="w-full rounded-lg bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs text-prime-text placeholder:text-prime-textMuted/50 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Feedback / Loading */}
        {feedback && (
          <div className="mb-4 p-2.5 rounded-lg bg-sky-500/15 border border-sky-500/30 text-xs text-sky-300 flex items-center gap-2">
            <Check className="h-4 w-4" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-prime-borderSubtle">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-prime-textMuted hover:text-prime-text"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConvert}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 text-white text-xs font-bold hover:bg-sky-400 disabled:opacity-50 shadow-prime-sm transition-all"
          >
            <span>{loading ? "Generating..." : "Apply & Start Practice"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
