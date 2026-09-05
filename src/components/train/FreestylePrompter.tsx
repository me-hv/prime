"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import {
  Flame,
  Shuffle,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Volume2,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MetronomeEngine } from "./MetronomeEngine";

interface FreestylePrompterProps {
  initialDurationSeconds?: number;
  onFinish?: (durationSeconds: number, wordsCount: number, notes: string) => void;
  className?: string;
}

const WORD_BANK = [
  "Obsidian", "Horizon", "Surgical", "Telescope", "Blueprint", "Thunder", "Concrete",
  "Submarine", "Pressure", "Architect", "Vortex", "Compass", "Midnight", "Resonance",
  "Catalyst", "Mercury", "Altitude", "Refraction", "Labyrinth", "Frequency", "Ignition",
  "Shadow", "Grit", "Pillar", "Clockwork", "Metropolis", "Gravity", "Velocity",
  "Dynasty", "Corridor", "Armor", "Transmission", "Echo", "Sanctuary", "Relic",
  "Chandelier", "Foundry", "Satellite", "Mirage", "Avalanche", "Turbulence", "Solitude",
  "Neon", "Monolith", "Canvas", "Voltage", "Parachute", "Constellation", "Tension",
];

export function FreestylePrompter({
  initialDurationSeconds = 60,
  onFinish,
  className,
}: FreestylePrompterProps) {
  const [intervalSec, setIntervalSec] = useState(10);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordsUsed, setWordsUsed] = useState<string[]>([WORD_BANK[0]]);
  const [isFreestyling, setIsFreestyling] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [remaining, setRemaining] = useState(initialDurationSeconds);
  const [bpm, setBpm] = useState(90);
  const [isClickEnabled, setIsClickEnabled] = useState(false);

  const metronomeRef = useRef<MetronomeEngine | null>(null);

  // Initialize metronome engine
  useEffect(() => {
    const engine = new MetronomeEngine(bpm, 4);
    metronomeRef.current = engine;
    return () => {
      engine.destroy();
      metronomeRef.current = null;
    };
  }, [bpm]);

  // Update metronome BPM
  useEffect(() => {
    if (metronomeRef.current) {
      metronomeRef.current.setBpm(bpm);
    }
  }, [bpm]);

  // Handle Metronome on/off with freestyle
  useEffect(() => {
    if (!metronomeRef.current) return;
    if (isFreestyling && isClickEnabled) {
      metronomeRef.current.start();
    } else {
      metronomeRef.current.stop();
    }
  }, [isFreestyling, isClickEnabled]);

  // Main timer & word rotation
  useEffect(() => {
    if (!isFreestyling) return;

    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1);
      setRemaining((prev) => {
        if (prev <= 1) {
          setIsFreestyling(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFreestyling]);

  // Word change interval
  useEffect(() => {
    if (!isFreestyling) return;

    const wordInterval = setInterval(() => {
      triggerNextWord();
    }, intervalSec * 1000);

    return () => clearInterval(wordInterval);
  }, [isFreestyling, intervalSec]);

  const triggerNextWord = () => {
    const nextIdx = Math.floor(Math.random() * WORD_BANK.length);
    const nextWord = WORD_BANK[nextIdx];
    setCurrentWordIndex(nextIdx);
    setWordsUsed((prev) => [...prev, nextWord]);
  };

  const handleStart = () => {
    setIsFreestyling(true);
    if (remaining <= 0) {
      setRemaining(initialDurationSeconds);
      setElapsed(0);
      setWordsUsed([WORD_BANK[0]]);
    }
  };

  const handlePause = () => {
    setIsFreestyling(false);
  };

  const handleReset = () => {
    setIsFreestyling(false);
    setRemaining(initialDurationSeconds);
    setElapsed(0);
    setWordsUsed([WORD_BANK[0]]);
  };

  const handleComplete = () => {
    setIsFreestyling(false);
    if (onFinish) {
      onFinish(elapsed, wordsUsed.length, `Freestyle drill with ${wordsUsed.length} words used.`);
    }
  };

  const currentWord = WORD_BANK[currentWordIndex];

  return (
    <div
      className={cn(
        "rounded-2xl border border-red-500/30 bg-gradient-to-b from-red-950/20 via-prime-surface to-prime-card p-5 sm:p-6 shadow-prime-lg space-y-6 animate-fade-in",
        className
      )}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-prime-borderSubtle">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/15 text-red-400 border border-red-500/30">
            <Flame className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-extrabold uppercase tracking-tight text-prime-text font-mono">
              FREESTYLE PROMPTER GYM
            </h2>
            <p className="text-[11px] text-prime-textMuted">
              Random word prompts delivered at interval cadence to build spontaneous flow reflexes.
            </p>
          </div>
        </div>

        {/* Live Timer Indicator */}
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-prime-surface border border-prime-border px-3 py-1 font-mono text-sm text-red-300 flex items-center gap-1.5 font-bold">
            <Clock className="h-3.5 w-3.5 text-red-400" />
            <span>{remaining}s remaining</span>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleComplete}
            disabled={elapsed === 0}
            className="text-xs border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 h-8"
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            <span>Finish</span>
          </Button>
        </div>
      </div>

      {/* Hero Word Display Banner */}
      <div className="rounded-2xl border border-red-500/30 bg-prime-bg/90 p-8 sm:p-12 text-center space-y-3 relative overflow-hidden shadow-prime-inner">
        <span className="text-[11px] font-mono uppercase tracking-widest text-red-400 font-bold block">
          Current Prompt Word
        </span>

        <div className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-prime-text animate-fade-in uppercase">
          {currentWord}
        </div>

        <p className="text-xs text-prime-textMuted font-medium pt-2">
          {isFreestyling
            ? `Next word in ${intervalSec}s • Weave it into your flow immediately.`
            : "Press 'Start Freestyle' to begin."}
        </p>

        {/* Word History Pills */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-1.5 max-w-md mx-auto">
          {wordsUsed.slice(-6).map((w, idx) => (
            <span
              key={idx}
              className={cn(
                "rounded px-2 py-0.5 text-[10px] font-mono",
                idx === wordsUsed.slice(-6).length - 1
                  ? "bg-red-500/20 text-red-300 border border-red-500/40 font-bold"
                  : "bg-prime-surface text-prime-textMuted"
              )}
            >
              {w}
            </span>
          ))}
        </div>
      </div>

      {/* Controls & Metronome Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {/* Word Rotation Interval */}
        <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/60 p-3 space-y-2 text-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-prime-textMuted block font-bold">
            Word Switch Interval
          </span>
          <div className="flex items-center justify-center gap-1.5">
            {[5, 10, 15, 30].map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setIntervalSec(sec)}
                className={cn(
                  "rounded px-2.5 py-1 text-xs font-mono font-bold transition-colors",
                  intervalSec === sec
                    ? "bg-prime-card text-red-400 border border-prime-border shadow-prime-sm"
                    : "text-prime-textMuted hover:text-prime-text"
                )}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>

        {/* Metronome Beat Click */}
        <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/60 p-3 space-y-2 text-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-prime-textMuted block font-bold">
            Backing Metronome Click
          </span>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setIsClickEnabled(!isClickEnabled)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-mono font-bold border transition-colors flex items-center gap-1",
                isClickEnabled
                  ? "bg-red-500/20 text-red-300 border-red-500/40"
                  : "bg-prime-surface text-prime-textMuted border-prime-border"
              )}
            >
              {isClickEnabled ? (
                <Volume2 className="h-3.5 w-3.5" />
              ) : (
                <VolumeX className="h-3.5 w-3.5" />
              )}
              <span>{isClickEnabled ? `${bpm} BPM` : "Click Off"}</span>
            </button>
            {isClickEnabled && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setBpm((prev) => Math.max(60, prev - 5))}
                  className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-prime-surface border border-prime-border text-prime-textMuted hover:text-prime-text"
                >
                  -5
                </button>
                <button
                  type="button"
                  onClick={() => setBpm((prev) => Math.min(180, prev + 5))}
                  className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-prime-surface border border-prime-border text-prime-textMuted hover:text-prime-text"
                >
                  +5
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Manual Next Word Button */}
        <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/60 p-3 space-y-2 text-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-prime-textMuted block font-bold">
            Manual Shuffle
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={triggerNextWord}
            className="w-full text-xs font-mono font-bold hover:bg-prime-surface border border-prime-borderSubtle h-7"
          >
            <Shuffle className="h-3.5 w-3.5 mr-1" />
            <span>Next Word</span>
          </Button>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-xs text-prime-textMuted hover:text-prime-text"
        >
          <RotateCcw className="h-3.5 w-3.5 mr-1" />
          <span>Reset</span>
        </Button>

        {isFreestyling ? (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handlePause}
            className="border-red-500/40 text-red-300 min-w-[150px]"
          >
            <Pause className="h-4 w-4 mr-2 fill-current" />
            <span>Pause</span>
          </Button>
        ) : (
          <Button
            type="button"
            variant="gold"
            size="lg"
            onClick={handleStart}
            className="min-w-[150px] shadow-prime-glow-gold"
          >
            <Play className="h-4 w-4 mr-2 fill-current" />
            <span>{elapsed > 0 ? "Resume" : "Start Freestyle"}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
