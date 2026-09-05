"use client";

import * as React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Plus,
  Volume2,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TrainingTimerProps {
  initialSeconds?: number;
  mode?: "countdown" | "elapsed";
  onComplete?: (elapsedSeconds: number) => void;
  onTick?: (remainingSeconds: number, elapsedSeconds: number) => void;
  autoStart?: boolean;
  className?: string;
  showPresets?: boolean;
}

export function TrainingTimer({
  initialSeconds = 600, // default 10 min
  mode = "countdown",
  onComplete,
  onTick,
  autoStart = false,
  className,
  showPresets = true,
}: TrainingTimerProps) {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  // Precision timestamp references to avoid drift
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const initialRemainingRef = useRef<number>(initialSeconds);
  const animFrameRef = useRef<number | null>(null);

  // Play synthesized completion chime
  const playCompletionChime = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Chord: C5 (523Hz), E5 (659Hz), G5 (784Hz)
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.15, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 1.2);
      });
    } catch {
      // AudioContext not allowed or supported
    }
  }, [soundEnabled]);

  // Main precision timer loop
  useEffect(() => {
    if (!isRunning) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    if (startTimeRef.current === 0) {
      startTimeRef.current = performance.now() - pausedTimeRef.current;
    }

    const tick = () => {
      const now = performance.now();
      const elapsedTotalMs = now - startTimeRef.current;
      const elapsedSec = Math.floor(elapsedTotalMs / 1000);

      if (mode === "countdown") {
        const remaining = Math.max(0, initialRemainingRef.current - elapsedSec);
        setRemainingSeconds(remaining);
        setElapsedSeconds(elapsedSec);

        if (onTick) onTick(remaining, elapsedSec);

        if (remaining <= 0) {
          setIsRunning(false);
          setIsFinished(true);
          playCompletionChime();
          if (onComplete) onComplete(elapsedSec);
          return;
        }
      } else {
        setElapsedSeconds(elapsedSec);
        setRemainingSeconds(elapsedSec);
        if (onTick) onTick(elapsedSec, elapsedSec);
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, mode, onComplete, onTick, playCompletionChime]);

  const handleStart = () => {
    if (isFinished) {
      handleReset();
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
    if (startTimeRef.current !== 0) {
      pausedTimeRef.current = performance.now() - startTimeRef.current;
      startTimeRef.current = 0;
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsFinished(false);
    startTimeRef.current = 0;
    pausedTimeRef.current = 0;
    initialRemainingRef.current = totalSeconds;
    setRemainingSeconds(totalSeconds);
    setElapsedSeconds(0);
  };

  const handleAddMinutes = (minutes: number) => {
    const extraSec = minutes * 60;
    setTotalSeconds((prev) => prev + extraSec);
    setRemainingSeconds((prev) => prev + extraSec);
    initialRemainingRef.current += extraSec;
  };

  const handleFinishEarly = () => {
    setIsRunning(false);
    setIsFinished(true);
    if (onComplete) {
      onComplete(elapsedSeconds);
    }
  };

  // Format time as MM:SS or HH:MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const displayTime = mode === "countdown" ? remainingSeconds : elapsedSeconds;
  const progressPercent =
    mode === "countdown" && totalSeconds > 0
      ? Math.min(100, Math.max(0, ((totalSeconds - remainingSeconds) / totalSeconds) * 100))
      : 100;

  const isWarning = mode === "countdown" && remainingSeconds <= 60 && remainingSeconds > 0;
  const isDanger = mode === "countdown" && remainingSeconds <= 15 && remainingSeconds > 0;

  return (
    <div
      className={cn(
        "rounded-2xl border border-prime-border bg-gradient-to-b from-prime-card via-prime-surface to-prime-bg p-5 shadow-prime-md transition-all",
        isDanger && "border-rose-500/50 shadow-rose-950/30",
        isWarning && !isDanger && "border-amber-500/50 shadow-amber-950/20",
        className
      )}
    >
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-prime-borderSubtle">
        <span className="text-[10px] font-mono uppercase tracking-widest text-prime-textMuted font-bold">
          {mode === "countdown" ? "Training Countdown" : "Elapsed Practice Timer"}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="rounded-lg p-1.5 text-prime-textMuted hover:text-prime-text hover:bg-prime-surface transition-colors"
            title={soundEnabled ? "Mute audio chime" : "Unmute audio chime"}
          >
            {soundEnabled ? (
              <Volume2 className="h-3.5 w-3.5 text-prime-gold" />
            ) : (
              <VolumeX className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Digital Clock Display */}
      <div className="py-6 text-center space-y-2">
        <div
          className={cn(
            "text-5xl sm:text-6xl font-black font-mono tracking-tight transition-colors select-none",
            isDanger && "text-rose-400 animate-pulse",
            isWarning && !isDanger && "text-amber-400",
            !isWarning && !isDanger && isRunning && "text-prime-gold",
            !isRunning && !isFinished && "text-prime-text",
            isFinished && "text-emerald-400"
          )}
        >
          {formatTime(displayTime)}
        </div>

        {/* Progress Bar (for countdown) */}
        {mode === "countdown" && (
          <div className="w-full max-w-xs mx-auto h-1.5 bg-prime-surface rounded-full overflow-hidden border border-prime-borderSubtle">
            <div
              className={cn(
                "h-full transition-all duration-300 rounded-full",
                isDanger ? "bg-rose-500" : isWarning ? "bg-amber-500" : "bg-prime-gold"
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        <p className="text-[11px] text-prime-textMuted font-medium pt-1">
          {isFinished
            ? "Drill Completed!"
            : isRunning
            ? "Focus. Don't stop. Lock into the pocket."
            : "Ready to start session"}
        </p>
      </div>

      {/* Presets & Controls */}
      <div className="space-y-3 pt-2">
        {/* Quick +1m / +5m Presets (when paused) */}
        {showPresets && mode === "countdown" && (
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handleAddMinutes(1)}
              className="rounded-lg border border-prime-borderSubtle bg-prime-surface/70 px-2.5 py-1 text-[11px] font-mono text-prime-textSecondary hover:text-prime-text hover:border-prime-border transition-colors flex items-center gap-1"
            >
              <Plus className="h-3 w-3" />
              <span>1 min</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddMinutes(5)}
              className="rounded-lg border border-prime-borderSubtle bg-prime-surface/70 px-2.5 py-1 text-[11px] font-mono text-prime-textSecondary hover:text-prime-text hover:border-prime-border transition-colors flex items-center gap-1"
            >
              <Plus className="h-3 w-3" />
              <span>5 min</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddMinutes(10)}
              className="rounded-lg border border-prime-borderSubtle bg-prime-surface/70 px-2.5 py-1 text-[11px] font-mono text-prime-textSecondary hover:text-prime-text hover:border-prime-border transition-colors flex items-center gap-1"
            >
              <Plus className="h-3 w-3" />
              <span>10 min</span>
            </button>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="flex items-center justify-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-xs text-prime-textMuted hover:text-prime-text"
            title="Reset timer"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            <span>Reset</span>
          </Button>

          {isRunning ? (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handlePause}
              className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10 min-w-[120px]"
            >
              <Pause className="h-4 w-4 mr-2 fill-current" />
              <span>Pause</span>
            </Button>
          ) : (
            <Button
              type="button"
              variant="gold"
              size="md"
              onClick={handleStart}
              className="min-w-[120px] shadow-prime-glow-gold"
            >
              <Play className="h-4 w-4 mr-2 fill-current" />
              <span>{elapsedSeconds > 0 ? "Resume" : "Start Drill"}</span>
            </Button>
          )}

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleFinishEarly}
            disabled={elapsedSeconds === 0}
            className="text-xs border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"
            title="Finish drill and record session"
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
            <span>Finish</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
