"use client";

import * as React from "react";
import { useState } from "react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/Button";
import { useNavigation } from "@/components/navigation/NavigationProvider";
import {
  Sparkles,
  PenTool,
  Music,
  Disc,
  FolderGit2,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  {
    id: "writing",
    label: "Writing Studio",
    icon: PenTool,
    title: "SONGWRITING & LYRIC LAB",
    description:
      "A dedicated, distraction-free environment for writing verses, rhyme mapping, punchline notebooks, and song structures.",
    badge: "PHASE 2 WORKSPACE",
    features: [
      "Multi-syllabic rhyme detection & cadence highlighting",
      "Verse, Chorus, Bridge, and Outro structured scaffolding",
      "Draft versioning with timestamped lyrical revisions",
      "Direct conversion from Quick Capture notes into full song drafts",
    ],
  },
  {
    id: "music",
    label: "Music & Production",
    icon: Music,
    title: "PRODUCTION & ARRANGEMENT HUB",
    description:
      "Track beat versions, stem arrangements, sound design sessions, and reference mixes.",
    badge: "PHASE 2 WORKSPACE",
    features: [
      "BPM & Key tag cataloging with Ableton/Logic session links",
      "Beat arrangement progress trackers & mix note checklists",
      "Sample and texture inventory tagging",
      "Reference track A/B comparison logs",
    ],
  },
  {
    id: "songs",
    label: "Song Catalog",
    icon: Disc,
    title: "FINISHED SONGS & EP CATALOG",
    description:
      "The vault of completed masterworks, demo cuts, and body-of-work project tracking.",
    badge: "PHASE 2 WORKSPACE",
    features: [
      "EP & Album tracklist sequencing builder",
      "Song completion status: Idea → Scratch → Written → Demo → Mixed → Mastered",
      "Lyrical themes and sonic palette tags",
    ],
  },
  {
    id: "projects",
    label: "Creative Projects",
    icon: FolderGit2,
    title: "LONG-TERM ARTIST PROJECTS",
    description:
      "Multi-week creative sprints, visual concepts, music video storyboards, and release campaigns.",
    badge: "PHASE 2 WORKSPACE",
    features: [
      "Project milestone tracking and phase deadlines",
      "Visual moodboard and concept documentation",
      "Release asset checklists and rollout strategy",
    ],
  },
];

export default function CreatePage() {
  const [activeTab, setActiveTab] = useState("writing");
  const { openQuickCapture } = useNavigation();

  const currentSection =
    SECTIONS.find((s) => s.id === activeTab) || SECTIONS[0];
  const Icon = currentSection.icon;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-prime-borderSubtle">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-purple-400">
              Creative Studio
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-prime-text">
            CREATE
          </h1>
          <p className="text-xs sm:text-sm text-prime-textMuted mt-0.5">
            Your songs, verses, beat arrangements, and unfinished experiments.
          </p>
        </div>

        <Button
          variant="gold"
          onClick={openQuickCapture}
          className="shadow-prime-glow-gold self-start sm:self-auto font-semibold"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          <span>Capture Idea</span>
        </Button>
      </div>

      {/* Workspace Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {SECTIONS.map((sec) => {
          const TabIcon = sec.icon;
          const isSelected = activeTab === sec.id;

          return (
            <button
              key={sec.id}
              onClick={() => setActiveTab(sec.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap",
                isSelected
                  ? "bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-prime-sm"
                  : "bg-prime-surface text-prime-textMuted hover:text-prime-text border border-prime-borderSubtle"
              )}
            >
              <TabIcon className="h-3.5 w-3.5" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Empty State / Workspace Canvas */}
      <EmptyState
        icon={Icon}
        phaseBadge={currentSection.badge}
        title={currentSection.title}
        description={currentSection.description}
        actionLabel="Capture an Idea"
        onAction={openQuickCapture}
        className="border-purple-500/20"
      >
        <div className="mt-4 rounded-xl border border-prime-borderSubtle bg-prime-surface/80 p-4 text-left space-y-2">
          <p className="text-[11px] font-mono uppercase tracking-wider text-prime-textMuted font-bold">
            Planned Architecture & Capabilities:
          </p>
          <ul className="space-y-1.5 text-xs text-prime-textSecondary">
            {currentSection.features.map((feat, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </EmptyState>
    </div>
  );
}
