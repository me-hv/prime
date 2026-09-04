"use client";

import * as React from "react";
import { useState } from "react";
import { EmptyState } from "@/components/shared/EmptyState";
import { useNavigation } from "@/components/navigation/NavigationProvider";
import {
  Dumbbell,
  Flame,
  Mic2,
  Sliders,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DRILL_MODULES = [
  {
    id: "rap",
    label: "Rap Cadence & Flow",
    icon: Mic2,
    title: "CADENCE & RHYME GYMNASIUM",
    description:
      "Precision drills for flow pocket elasticity, syncopation shifts, internal multis, and breath control.",
    badge: "PHASE 3 TRAINING",
    drills: [
      "Metronome Pocket Drill (80 → 145 BPM tempo transitions)",
      "Multi-Syllabic Rhyme String Challenges (4+ syllable matching)",
      "Cadence Lock & Inversion Drills (on-beat to off-beat syncopation)",
      "Freestyle Constraint Games (forced keyword injection)",
    ],
  },
  {
    id: "writing",
    label: "Writing Exercises",
    icon: Flame,
    title: "DELIBERATE WRITING PRACTICE",
    description:
      "Timed writing challenges designed to eliminate writer's block and sharpen vivid imagery.",
    badge: "PHASE 3 TRAINING",
    drills: [
      "10-Minute Rapid 16-Bar Sprint (Zero editing, pure instinct)",
      "Sensory Detail & Micro-Storytelling constraint exercises",
      "Metaphor & Punchline Construction drills",
      "Perspective Shifts (Writing from another character's vantage point)",
    ],
  },
  {
    id: "production",
    label: "Production Drills",
    icon: Sliders,
    title: "BEAT ARCHITECTURE EXERCISES",
    description:
      "Targeted speed-production and sound design challenges to build intuition and workflow velocity.",
    badge: "PHASE 3 TRAINING",
    drills: [
      "15-Minute Sample Flip Sprint (Flip a chopped sample into a groove)",
      "Drum Pocket & Swing Programming (Groove extraction without quantization)",
      "Bass & 808 Frequency Tuning Drills",
      "Arrangement Stripping (Maximizing tension with minimal stems)",
    ],
  },
  {
    id: "vocab",
    label: "Vocabulary & Rhymes",
    icon: BookOpen,
    title: "ARTIST VOCABULARY & RHYME SCHEMES",
    description:
      "Expand your lyrical palette with high-impact vocabulary, slant rhymes, and literary tools.",
    badge: "PHASE 3 TRAINING",
    drills: [
      "Daily Word Expansion & Rhyme Family mapping",
      "Phonetic Assonance & Consonance training",
      "Idiom and Double Entendre workshops",
    ],
  },
];

export default function TrainPage() {
  const [activeTab, setActiveTab] = useState("rap");
  const { openQuickCapture } = useNavigation();

  const currentModule =
    DRILL_MODULES.find((m) => m.id === activeTab) || DRILL_MODULES[0];
  const Icon = currentModule.icon;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-prime-borderSubtle">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Dumbbell className="h-4 w-4 text-orange-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-orange-400">
              Training Ground
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-prime-text">
            TRAIN
          </h1>
          <p className="text-xs sm:text-sm text-prime-textMuted mt-0.5">
            Deliberate practice drills for flow, lyrics, beats, and vocabulary.
          </p>
        </div>
      </div>

      {/* Module Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {DRILL_MODULES.map((mod) => {
          const TabIcon = mod.icon;
          const isSelected = activeTab === mod.id;

          return (
            <button
              key={mod.id}
              onClick={() => setActiveTab(mod.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap",
                isSelected
                  ? "bg-orange-500/15 text-orange-300 border border-orange-500/30 shadow-prime-sm"
                  : "bg-prime-surface text-prime-textMuted hover:text-prime-text border border-prime-borderSubtle"
              )}
            >
              <TabIcon className="h-3.5 w-3.5" />
              <span>{mod.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Training Shell Display */}
      <EmptyState
        icon={Icon}
        phaseBadge={currentModule.badge}
        title={currentModule.title}
        description={currentModule.description}
        actionLabel="Capture Drill Concept"
        onAction={openQuickCapture}
        className="border-orange-500/20"
      >
        <div className="mt-4 rounded-xl border border-prime-borderSubtle bg-prime-surface/80 p-4 text-left space-y-2">
          <p className="text-[11px] font-mono uppercase tracking-wider text-prime-textMuted font-bold">
            Curated Drills in Development:
          </p>
          <ul className="space-y-1.5 text-xs text-prime-textSecondary">
            {currentModule.drills.map((drill, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400 shrink-0" />
                <span>{drill}</span>
              </li>
            ))}
          </ul>
        </div>
      </EmptyState>
    </div>
  );
}
