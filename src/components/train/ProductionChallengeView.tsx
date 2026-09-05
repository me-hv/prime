"use client";

import * as React from "react";
import { useState } from "react";
import { TrainingTimer } from "./TrainingTimer";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import {
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductionChallengeViewProps {
  title: string;
  instructions: string;
  constraints?: string | null;
  starterPrompt?: string | null;
  timeLimitSeconds?: number | null;
  onFinishChallenge: (durationSeconds: number, notes: string) => void;
  className?: string;
}

export function ProductionChallengeView({
  title,
  instructions,
  constraints,
  starterPrompt,
  timeLimitSeconds = 900,
  onFinishChallenge,
  className,
}: ProductionChallengeViewProps) {
  const [elapsed, setElapsed] = useState(0);
  const [dawSessionNotes, setDawSessionNotes] = useState("");
  const [bpmUsed, setBpmUsed] = useState("90");
  const [checkedConstraints, setCheckedConstraints] = useState<Record<number, boolean>>({});

  const constraintList = constraints
    ? constraints
        .split("\n")
        .map((c) => c.replace(/^[•\-\*]\s*/, "").trim())
        .filter(Boolean)
    : [];

  const toggleConstraint = (idx: number) => {
    setCheckedConstraints((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleFinish = (finalElapsed?: number) => {
    const totalSec = finalElapsed || elapsed || (timeLimitSeconds || 900);
    const combinedNotes = `BPM: ${bpmUsed} • DAW Notes: ${dawSessionNotes.trim()}`;
    onFinishChallenge(totalSec, combinedNotes);
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-purple-500/30 bg-gradient-to-b from-purple-950/20 via-prime-surface to-prime-card p-5 sm:p-6 shadow-prime-lg space-y-6 animate-fade-in",
        className
      )}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-prime-borderSubtle">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-extrabold uppercase tracking-tight text-prime-text font-mono">
              BEAT PRODUCTION ARENA
            </h2>
            <p className="text-[11px] text-prime-textMuted">{title}</p>
          </div>
        </div>

        <Button
          type="button"
          variant="gold"
          size="sm"
          onClick={() => handleFinish()}
          className="text-xs shadow-prime-glow-gold h-8"
        >
          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
          <span>Complete Challenge</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Timer */}
        <div className="lg:col-span-5">
          <TrainingTimer
            initialSeconds={timeLimitSeconds || 900}
            mode={timeLimitSeconds ? "countdown" : "elapsed"}
            autoStart={true}
            onTick={(_, elSec) => setElapsed(elSec)}
            onComplete={(elSec) => handleFinish(elSec)}
          />
        </div>

        {/* Right: Challenge Constraints & DAW Notes */}
        <div className="lg:col-span-7 space-y-4">
          {/* Starter Prompt */}
          {starterPrompt && (
            <div className="rounded-xl border border-purple-500/20 bg-purple-950/20 p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold block">
                Challenge Mantra
              </span>
              <p className="text-sm font-semibold text-prime-text">
                &ldquo;{starterPrompt}&rdquo;
              </p>
              {instructions && (
                <p className="text-xs text-prime-textMuted mt-1">
                  {instructions}
                </p>
              )}
            </div>
          )}

          {/* Constraint Checklist */}
          {constraintList.length > 0 && (
            <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/70 p-4 space-y-2.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-prime-textMuted font-bold block">
                Challenge Constraints ({Object.values(checkedConstraints).filter(Boolean).length}/{constraintList.length})
              </span>
              <div className="space-y-1.5">
                {constraintList.map((constraint, idx) => {
                  const isChecked = !!checkedConstraints[idx];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleConstraint(idx)}
                      className={cn(
                        "w-full text-left flex items-center gap-2.5 rounded-lg p-2 text-xs transition-colors border",
                        isChecked
                          ? "bg-purple-500/15 border-purple-500/40 text-purple-300 font-medium"
                          : "bg-prime-surface border-prime-borderSubtle text-prime-textSecondary hover:text-prime-text"
                      )}
                    >
                      <div
                        className={cn(
                          "h-4 w-4 rounded border flex items-center justify-center shrink-0 text-[10px]",
                          isChecked
                            ? "bg-purple-500 text-prime-bg border-purple-400"
                            : "border-prime-borderSubtle bg-prime-bg"
                        )}
                      >
                        {isChecked && "✓"}
                      </div>
                      <span>{constraint}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* DAW Session Log Form */}
          <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/70 p-4 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-prime-textMuted font-bold block">
              Session & Sound Log
            </span>

            <div className="w-32">
              <Input
                label="BPM Used"
                value={bpmUsed}
                onChange={(e) => setBpmUsed(e.target.value)}
                placeholder="e.g. 90"
              />
            </div>

            <Textarea
              label="Stems, Arrangement & Sample Notes"
              value={dawSessionNotes}
              onChange={(e) => setDawSessionNotes(e.target.value)}
              placeholder="e.g. Chopped soul vocal sample pitched down 2 semitones, laid unquantized 88 BPM boom-bap drums..."
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
