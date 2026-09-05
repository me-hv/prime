"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { MetronomeEngine, Subdivision } from "./MetronomeEngine";
import { Button } from "@/components/ui/Button";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Plus,
  Minus,
  Activity,
  Zap,
  Flame,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

interface PocketGymProps {
  initialBpm?: number;
  initialDrill?: string;
  onSessionComplete?: (durationSeconds: number, bpm: number, drillNotes: string) => void;
  className?: string;
}

const TEMPO_PRESETS = [80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145];

const CADENCE_DRILLS = [
  {
    id: "pocket-shift",
    name: "Pocket Shift",
    tag: "Micro-Timing",
    desc: "Deliver 4 bars slightly ahead of the beat (urgency), 4 bars dead center, and 4 bars dragging lazily behind the snare.",
    tips: "Ahead: Consonants hit micro-seconds before the click. Behind: Drag syllables into the pocket after the snare.",
  },
  {
    id: "cadence-switch",
    name: "Cadence Switch",
    tag: "Elasticity",
    desc: "Rap in straight 16th notes for 4 bars, then switch seamlessly to a 3-syllable triplet roll on Bar 5 without stumbling.",
    tips: "Count: 1-e-&-a (straight) → 1-and-a, 2-and-a (triplets).",
  },
  {
    id: "beat-division",
    name: "Beat Division",
    tag: "Rhythmic Speed",
    desc: "Cycle through rhythmic subdivisions: 4 bars Quarter notes → 4 bars 8th notes → 4 bars 16th notes → 4 bars Triplets.",
    tips: "Focus on syllable clarity as note density doubles.",
  },
  {
    id: "accent-displacement",
    name: "Accent Displacement",
    tag: "Syncopation",
    desc: "Shift your heavy vocal volume emphasis away from the expected Beat 2 & 4 onto unexpected off-beat syllables.",
    tips: "Accent the 'and' or 'e' subdivision to create hypnotic syncopated tension.",
  },
];

export function PocketGym({
  initialBpm = 90,
  initialDrill = "pocket-shift",
  onSessionComplete,
  className,
}: PocketGymProps) {
  const { success } = useToast();
  const [bpm, setBpm] = useState(initialBpm);
  const [beatsPerBar, setBeatsPerBar] = useState(4);
  const [subdivision, setSubdivision] = useState<Subdivision>("quarter");
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [selectedDrill, setSelectedDrill] = useState(initialDrill);

  // Session time tracker
  const [practiceSeconds, setPracticeSeconds] = useState(0);
  const practiceIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Tap Tempo calculation
  const tapTimesRef = useRef<number[]>([]);

  // Metronome Engine Instance Ref
  const engineRef = useRef<MetronomeEngine | null>(null);

  useEffect(() => {
    const engine = new MetronomeEngine(bpm, beatsPerBar);
    engine.setSubdivision(subdivision);
    engine.setVolume(volume);
    engine.setMuted(isMuted);

    engine.setOnBeat((beat) => {
      setCurrentBeat(beat);
    });

    engineRef.current = engine;

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync BPM changes
  const updateBpm = (newBpm: number) => {
    const clamped = Math.max(40, Math.min(240, newBpm));
    setBpm(clamped);
    if (engineRef.current) {
      engineRef.current.setBpm(clamped);
    }
  };

  // Sync BeatsPerBar changes
  const updateBeatsPerBar = (beats: number) => {
    setBeatsPerBar(beats);
    if (engineRef.current) {
      engineRef.current.setBeatsPerBar(beats);
    }
  };

  // Sync Subdivision changes
  const updateSubdivision = (sub: Subdivision) => {
    setSubdivision(sub);
    if (engineRef.current) {
      engineRef.current.setSubdivision(sub);
    }
  };

  // Sync Volume changes
  const updateVolume = (vol: number) => {
    setVolume(vol);
    if (engineRef.current) {
      engineRef.current.setVolume(vol);
    }
  };

  // Sync Mute
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (engineRef.current) {
      engineRef.current.setMuted(nextMuted);
    }
  };

  // Start / Stop playback
  const togglePlay = () => {
    if (!engineRef.current) return;

    if (isPlaying) {
      engineRef.current.stop();
      setIsPlaying(false);
      setCurrentBeat(0);
      if (practiceIntervalRef.current) {
        clearInterval(practiceIntervalRef.current);
        practiceIntervalRef.current = null;
      }
    } else {
      engineRef.current.start();
      setIsPlaying(true);
      practiceIntervalRef.current = setInterval(() => {
        setPracticeSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  // Tap Tempo Algorithm
  const handleTapTempo = () => {
    const now = performance.now();
    const tapTimes = tapTimesRef.current;

    // Reset if last tap was more than 2.5 seconds ago
    if (tapTimes.length > 0 && now - tapTimes[tapTimes.length - 1] > 2500) {
      tapTimes.length = 0;
    }

    tapTimes.push(now);

    if (tapTimes.length > 5) {
      tapTimes.shift();
    }

    if (tapTimes.length >= 2) {
      let totalDiff = 0;
      for (let i = 1; i < tapTimes.length; i++) {
        totalDiff += tapTimes[i] - tapTimes[i - 1];
      }
      const avgDiff = totalDiff / (tapTimes.length - 1);
      const calculatedBpm = Math.round(60000 / avgDiff);
      updateBpm(calculatedBpm);
    }
  };

  const handleFinishPracticeSession = () => {
    if (isPlaying) {
      togglePlay();
    }
    const currentDrillObj = CADENCE_DRILLS.find((d) => d.id === selectedDrill);
    const drillNote = `Pocket Gym: ${bpm} BPM, ${beatsPerBar}/4 time, ${subdivision} subdivision. Drill: ${currentDrillObj?.name || "Freestyle Pocket"}`;

    if (onSessionComplete) {
      onSessionComplete(practiceSeconds, bpm, drillNote);
    } else {
      success(`Recorded ${Math.max(1, Math.round(practiceSeconds / 60))} min Pocket Gym session at ${bpm} BPM.`);
      setPracticeSeconds(0);
    }
  };

  const formatPracticeTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const activeDrill = CADENCE_DRILLS.find((d) => d.id === selectedDrill) || CADENCE_DRILLS[0];

  return (
    <div
      className={cn(
        "rounded-2xl border border-prime-border bg-gradient-to-b from-prime-card via-prime-surface to-prime-bg p-5 sm:p-6 shadow-prime-md space-y-6 animate-fade-in",
        className
      )}
    >
      {/* 1. Header & Live Practice Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-prime-borderSubtle">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400 border border-orange-500/30">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-extrabold uppercase tracking-tight text-prime-text font-mono">
              POCKET GYM & METRONOME
            </h2>
            <p className="text-[11px] text-prime-textMuted">
              Precision Web Audio timing for flow cadence, syncopation, and tempo locking.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {practiceSeconds > 0 && (
            <div className="flex items-center gap-1.5 rounded-lg bg-prime-surface border border-prime-border px-3 py-1 font-mono text-xs text-orange-300">
              <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
              <span>Session: {formatPracticeTime(practiceSeconds)}</span>
            </div>
          )}

          {practiceSeconds >= 30 && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleFinishPracticeSession}
              className="text-xs border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 h-8"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              <span>Log Practice</span>
            </Button>
          )}
        </div>
      </div>

      {/* 2. Visual Beat Pulse Display */}
      <div className="rounded-xl border border-prime-borderSubtle bg-prime-bg/80 p-5 text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          {Array.from({ length: beatsPerBar }).map((_, idx) => {
            const isCurrent = isPlaying && currentBeat === idx;
            const isCurrentAccent = isCurrent && idx === 0;

            return (
              <div
                key={idx}
                className={cn(
                  "flex flex-col items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border transition-all duration-100",
                  isCurrentAccent
                    ? "bg-prime-gold text-prime-bg border-prime-gold shadow-prime-glow-gold scale-110 font-black"
                    : isCurrent
                    ? "bg-amber-500/30 text-amber-300 border-amber-400 shadow-prime-sm scale-105 font-bold"
                    : "bg-prime-surface/60 text-prime-textMuted border-prime-borderSubtle font-medium"
                )}
              >
                <span className="text-xl sm:text-2xl font-mono">
                  {idx + 1}
                </span>
                <span className="text-[9px] font-mono uppercase tracking-widest opacity-80">
                  {idx === 0 ? "Accent" : "Beat"}
                </span>
              </div>
            );
          })}
        </div>

        {/* BPM Hero Display */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-3">
            <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-prime-text">
              {bpm}
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-prime-gold font-bold self-end mb-2">
              BPM
            </span>
          </div>
          <p className="text-[11px] font-mono text-prime-textMuted">
            {beatsPerBar}/4 Time Signature • {subdivision.toUpperCase()} Division
          </p>
        </div>
      </div>

      {/* 3. Tempo Stepper & Slider */}
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <Button
            type="button"
            variant="outline"
            size="iconSm"
            onClick={() => updateBpm(bpm - 5)}
            className="border-prime-border text-prime-textMuted hover:text-prime-text"
            title="-5 BPM"
          >
            <span className="font-mono text-xs font-bold">-5</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="iconSm"
            onClick={() => updateBpm(bpm - 1)}
            className="border-prime-border text-prime-textMuted hover:text-prime-text"
            title="-1 BPM"
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>

          {/* Master Start / Stop Button */}
          <Button
            type="button"
            variant={isPlaying ? "outline" : "gold"}
            size="lg"
            onClick={togglePlay}
            className={cn(
              "min-w-[150px] font-extrabold uppercase font-mono tracking-wide shadow-prime-glow-gold",
              isPlaying && "border-amber-500/50 text-amber-300 hover:bg-amber-500/10"
            )}
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4 mr-2 fill-current" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2 fill-current" />
                <span>Start Click</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="iconSm"
            onClick={() => updateBpm(bpm + 1)}
            className="border-prime-border text-prime-textMuted hover:text-prime-text"
            title="+1 BPM"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="iconSm"
            onClick={() => updateBpm(bpm + 5)}
            className="border-prime-border text-prime-textMuted hover:text-prime-text"
            title="+5 BPM"
          >
            <span className="font-mono text-xs font-bold">+5</span>
          </Button>
        </div>

        {/* BPM Slider */}
        <div className="w-full max-w-md mx-auto space-y-1.5">
          <input
            type="range"
            min={40}
            max={220}
            step={1}
            value={bpm}
            onChange={(e) => updateBpm(parseInt(e.target.value))}
            className="w-full h-1.5 bg-prime-surface rounded-lg appearance-none cursor-pointer accent-prime-gold"
          />
          <div className="flex justify-between text-[10px] font-mono text-prime-textMuted">
            <span>40 (Slow)</span>
            <span>90 (Boom-Bap)</span>
            <span>130 (Double-Time)</span>
            <span>140 (Grime/Trap)</span>
            <span>220 (Fast)</span>
          </div>
        </div>

        {/* Quick Tempo Buttons */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-prime-textMuted block text-center">
            Standard Hip-Hop & Rap Tempo Presets
          </span>
          <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-xl mx-auto">
            {TEMPO_PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => updateBpm(p)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-mono font-semibold transition-all border",
                  bpm === p
                    ? "bg-prime-gold text-prime-bg border-prime-gold shadow-prime-glow-gold"
                    : "bg-prime-surface/70 text-prime-textSecondary border-prime-borderSubtle hover:border-prime-border hover:text-prime-text"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Controls: Time Signature, Subdivisions, Tap Tempo & Volume */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-prime-borderSubtle">
        {/* Time Signature */}
        <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/50 p-3 space-y-1.5 text-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-prime-textMuted block font-bold">
            Time Signature
          </span>
          <div className="flex items-center justify-center gap-1">
            {[3, 4, 6].map((ts) => (
              <button
                key={ts}
                type="button"
                onClick={() => updateBeatsPerBar(ts)}
                className={cn(
                  "rounded px-2 py-0.5 text-xs font-mono font-bold transition-colors",
                  beatsPerBar === ts
                    ? "bg-prime-card text-prime-gold border border-prime-border"
                    : "text-prime-textMuted hover:text-prime-text"
                )}
              >
                {ts}/4
              </button>
            ))}
          </div>
        </div>

        {/* Subdivision */}
        <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/50 p-3 space-y-1.5 text-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-prime-textMuted block font-bold">
            Subdivision
          </span>
          <div className="flex items-center justify-center gap-1">
            {[
              { id: "quarter", label: "1/4" },
              { id: "eighth", label: "1/8" },
              { id: "sixteenth", label: "1/16" },
              { id: "triplet", label: "3pl" },
            ].map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => updateSubdivision(sub.id as Subdivision)}
                className={cn(
                  "rounded px-1.5 py-0.5 text-xs font-mono font-bold transition-colors",
                  subdivision === sub.id
                    ? "bg-prime-card text-prime-gold border border-prime-border"
                    : "text-prime-textMuted hover:text-prime-text"
                )}
              >
                {sub.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tap Tempo */}
        <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/50 p-3 space-y-1.5 text-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-prime-textMuted block font-bold">
            Tap Tempo
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleTapTempo}
            className="w-full text-xs font-mono font-bold text-prime-text hover:bg-prime-surface border border-prime-borderSubtle h-7"
          >
            <Zap className="h-3.5 w-3.5 mr-1 text-prime-gold" />
            <span>Tap Beat</span>
          </Button>
        </div>

        {/* Volume & Mute */}
        <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/50 p-3 space-y-1.5 text-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-prime-textMuted block font-bold">
            Volume & Tone
          </span>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={toggleMute}
              className="text-prime-textMuted hover:text-prime-text"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-rose-400" />
              ) : (
                <Volume2 className="h-4 w-4 text-prime-gold" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => updateVolume(parseFloat(e.target.value))}
              className="w-16 h-1 bg-prime-surface rounded-lg appearance-none cursor-pointer accent-prime-gold"
            />
          </div>
        </div>
      </div>

      {/* 5. Flow Cadence Drills Selector */}
      <div className="space-y-3 pt-2 border-t border-prime-borderSubtle">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-400" />
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-prime-text">
              Interactive Cadence Drills
            </h3>
          </div>
          <span className="text-[11px] font-mono text-prime-textMuted">
            Select a drill to guide your session
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CADENCE_DRILLS.map((drill) => {
            const isSelected = selectedDrill === drill.id;
            return (
              <button
                key={drill.id}
                type="button"
                onClick={() => setSelectedDrill(drill.id)}
                className={cn(
                  "text-left rounded-xl p-3 border transition-all space-y-1",
                  isSelected
                    ? "bg-orange-500/15 border-orange-500/40 text-orange-300 shadow-prime-sm"
                    : "bg-prime-surface/40 border-prime-borderSubtle text-prime-textSecondary hover:border-prime-border hover:text-prime-text"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono">{drill.name}</span>
                  <span className="text-[9px] font-mono rounded bg-prime-bg/70 px-1 py-0.2 text-prime-gold">
                    {drill.tag}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Drill Briefing Box */}
        <div className="rounded-xl border border-orange-500/20 bg-gradient-to-r from-orange-950/20 via-prime-surface to-prime-card p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-orange-400" />
            <span className="text-xs font-bold text-orange-300 font-mono uppercase">
              {activeDrill.name} Instructions
            </span>
          </div>
          <p className="text-xs text-prime-text leading-relaxed">
            {activeDrill.desc}
          </p>
          <p className="text-[11px] text-prime-textMuted font-mono bg-prime-bg/60 rounded-lg p-2 border border-prime-borderSubtle">
            💡 Coach Tip: {activeDrill.tips}
          </p>
        </div>
      </div>
    </div>
  );
}
