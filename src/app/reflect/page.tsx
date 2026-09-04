"use client";

import * as React from "react";
import { useState } from "react";
import { EmptyState } from "@/components/shared/EmptyState";
import { useNavigation } from "@/components/navigation/NavigationProvider";
import {
  BookMarked,
  Mic,
  CalendarCheck,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

const REFLECT_MODES = [
  {
    id: "journal",
    label: "Artist Journal",
    icon: BookMarked,
    title: "DAILY ARTIST RETROSPECTIVE",
    description:
      "A raw, honest daily journal to process creative doubt, breakthroughs, mindset shifts, and artistic identity.",
    badge: "PHASE 5 REFLECTION",
    points: [
      "Guided daily prompt templates: 'What moved me today?', 'What resistance did I face?'",
      "Mood & creative energy tagging",
      "Searchable thought archive indexed by themes and dates",
    ],
  },
  {
    id: "voice",
    label: "Voice Journal",
    icon: Mic,
    title: "STREAM-OF-CONSCIOUSNESS AUDIO",
    description:
      "Record quick vocal reflections right after studio sessions, late night walks, or intense writing moments.",
    badge: "PHASE 5 REFLECTION",
    points: [
      "Instant 1-tap mic recording with waveform visualizer",
      "AI audio transcription and key insight extraction",
      "Tag voice notes as song ideas, reflections, or reminders",
    ],
  },
  {
    id: "review",
    label: "Weekly Review",
    icon: CalendarCheck,
    title: "WEEKLY CREATIVE AUDIT",
    description:
      "Step back once a week to evaluate creative output, time allocation, completed songs, and next week's focus.",
    badge: "PHASE 5 REFLECTION",
    points: [
      "Output Volume Review (Lines written, beats started, songs finished)",
      "Distraction & Resistance Audit",
      "Next week's primary mission and goal calibration",
    ],
  },
  {
    id: "letters",
    label: "Future-Self Letters",
    icon: Mail,
    title: "LETTERS TO THE FUTURE ARTIST",
    description:
      "Write letters to yourself 6 months, 1 year, or 5 years into the future to maintain vision and accountability.",
    badge: "PHASE 5 REFLECTION",
    points: [
      "Scheduled delivery locks (unseals on specific future dates)",
      "Milestone check-ins and artistic commitment manifestos",
    ],
  },
];

export default function ReflectPage() {
  const [activeTab, setActiveTab] = useState("journal");
  const { openQuickCapture } = useNavigation();

  const currentMode =
    REFLECT_MODES.find((m) => m.id === activeTab) || REFLECT_MODES[0];
  const Icon = currentMode.icon;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-prime-borderSubtle">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookMarked className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">
              Artist Mindset & Clarity
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-prime-text">
            REFLECT
          </h1>
          <p className="text-xs sm:text-sm text-prime-textMuted mt-0.5">
            Journaling, voice notes, weekly audits, and future-self letters.
          </p>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {REFLECT_MODES.map((mode) => {
          const TabIcon = mode.icon;
          const isSelected = activeTab === mode.id;

          return (
            <button
              key={mode.id}
              onClick={() => setActiveTab(mode.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap",
                isSelected
                  ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-prime-sm"
                  : "bg-prime-surface text-prime-textMuted hover:text-prime-text border border-prime-borderSubtle"
              )}
            >
              <TabIcon className="h-3.5 w-3.5" />
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Display */}
      <EmptyState
        icon={Icon}
        phaseBadge={currentMode.badge}
        title={currentMode.title}
        description={currentMode.description}
        actionLabel="Capture a Reflection"
        onAction={openQuickCapture}
        className="border-indigo-500/20"
      >
        <div className="mt-4 rounded-xl border border-prime-borderSubtle bg-prime-surface/80 p-4 text-left space-y-2">
          <p className="text-[11px] font-mono uppercase tracking-wider text-prime-textMuted font-bold">
            Reflection Tools in Roadmap:
          </p>
          <ul className="space-y-1.5 text-xs text-prime-textSecondary">
            {currentMode.points.map((p, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </EmptyState>
    </div>
  );
}
