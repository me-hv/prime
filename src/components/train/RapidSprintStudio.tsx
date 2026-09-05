"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { TrainingTimer } from "./TrainingTimer";
import { Button } from "@/components/ui/Button";
import {
  PenTool,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createWritingDocument } from "@/actions/writings";
import { useToast } from "@/components/ui/Toast";

interface RapidSprintStudioProps {
  exerciseTitle?: string;
  starterPrompt?: string;
  initialTimeSeconds?: number;
  onFinishSprint: (docId: string, durationSeconds: number, text: string) => void;
  className?: string;
}

export function RapidSprintStudio({
  exerciseTitle = "10-Minute Rapid 16-Bar Sprint",
  starterPrompt = "Write 16 bars about the hunger you felt before anybody believed in your vision.",
  initialTimeSeconds = 600,
  onFinishSprint,
  className,
}: RapidSprintStudioProps) {
  const { error } = useToast();
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-focus writing canvas
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Calculate non-empty lines (bars written)
  const lines = content.split("\n").filter((l) => l.trim().length > 0);
  const barCount = lines.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = content.length;

  const targetBars = 16;
  const isTargetReached = barCount >= targetBars;

  const handleFinish = useCallback(
    async (finalElapsedSeconds?: number) => {
      if (isSaving) return;
      setIsSaving(true);

      const actualDuration = finalElapsedSeconds || elapsed || initialTimeSeconds;

      try {
        // Extract a meaningful title from the first bar or prompt
        const firstLine = lines[0]?.trim() || "Untitled Sprint";
        const sprintTitle = `16-Bar Sprint: ${firstLine.slice(0, 30)}${firstLine.length > 30 ? "..." : ""}`;

        const doc = await createWritingDocument({
          title: sprintTitle,
          content: content.trim(),
          type: "BARS",
          tags: "sprint, 16bars, training-gym",
        });

        onFinishSprint(doc.id, actualDuration, content);
      } catch (err) {
        console.error("Failed to save sprint document:", err);
        error("Failed to save writing sprint. Please try again.");
        setIsSaving(false);
      }
    },
    [content, elapsed, initialTimeSeconds, isSaving, lines, onFinishSprint, error]
  );

  return (
    <div className={cn("space-y-6 animate-fade-in", className)}>
      {/* 1. Timer & Target Status Ribbon */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Interactive Precision Timer */}
        <div className="lg:col-span-5">
          <TrainingTimer
            initialSeconds={initialTimeSeconds}
            mode="countdown"
            autoStart={true}
            onTick={(_, elSec) => setElapsed(elSec)}
            onComplete={(elSec) => handleFinish(elSec)}
          />
        </div>

        {/* Right: Live Metrics & Starter Challenge */}
        <div className="lg:col-span-7 space-y-3">
          {/* Starter Prompt Card */}
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-prime-surface to-prime-card p-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                  Sprint Prompt
                </span>
              </div>
              <span className="text-[10px] font-mono text-prime-textMuted uppercase font-semibold">
                {exerciseTitle}
              </span>
            </div>
            <p className="text-sm font-semibold text-prime-text leading-relaxed">
              &ldquo;{starterPrompt}&rdquo;
            </p>
            <p className="text-[11px] text-prime-textMuted font-mono">
              ⚡ Rule: Zero backspacing. Do not self-edit while the clock runs. Move forward.
            </p>
          </div>

          {/* Bar Tracker Ribbon */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/70 p-3 text-center space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-prime-textMuted block font-bold">
                Bars Target
              </span>
              <div className="flex items-baseline justify-center gap-1 font-mono">
                <span
                  className={cn(
                    "text-2xl font-black transition-colors",
                    isTargetReached ? "text-emerald-400" : "text-prime-gold"
                  )}
                >
                  {barCount}
                </span>
                <span className="text-xs text-prime-textMuted">/ {targetBars}</span>
              </div>
            </div>

            <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/70 p-3 text-center space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-prime-textMuted block font-bold">
                Words
              </span>
              <span className="text-2xl font-black font-mono text-prime-text block">
                {wordCount}
              </span>
            </div>

            <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/70 p-3 text-center space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-prime-textMuted block font-bold">
                Characters
              </span>
              <span className="text-2xl font-black font-mono text-prime-text block">
                {charCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Writing Studio Canvas */}
      <div className="rounded-2xl border border-prime-border bg-prime-card/90 p-5 sm:p-6 shadow-prime-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-prime-borderSubtle">
          <div className="flex items-center gap-2">
            <PenTool className="h-4 w-4 text-prime-gold" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-prime-text">
              16-Bar Writing Arena
            </span>
          </div>

          <Button
            type="button"
            variant="gold"
            size="sm"
            onClick={() => handleFinish(elapsed)}
            disabled={isSaving || content.trim().length === 0}
            className="h-8 text-xs font-semibold shadow-prime-glow-gold"
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
            <span>{isSaving ? "Saving..." : "Finish Sprint & Review"}</span>
          </Button>
        </div>

        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Bar 01: Built from the dust where the shadows divide...
Bar 02: Kept my ambition locked tight on the inside...
Bar 03:
Bar 04:...`}
          className="w-full min-h-[340px] bg-transparent text-sm sm:text-base font-sans text-prime-text placeholder:text-prime-textMuted/40 leading-relaxed resize-none focus:outline-none scrollbar-thin"
        />

        <div className="flex items-center justify-between pt-3 border-t border-prime-borderSubtle text-[11px] font-mono text-prime-textMuted">
          <span>{isTargetReached ? "✓ 16 bars reached!" : `${16 - barCount} bars remaining`}</span>
          <span>Output is saved directly to your Creative Workspace</span>
        </div>
      </div>
    </div>
  );
}
