"use client";

import * as React from "react";
import { useState } from "react";
import { EmptyState } from "@/components/shared/EmptyState";
import { useNavigation } from "@/components/navigation/NavigationProvider";
import {
  Compass,
  Headphones,
  Disc3,
  Users,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DISCOVERY_DOMAINS = [
  {
    id: "songs",
    label: "Song Breakdown Lab",
    icon: Headphones,
    title: "DEEP SONG ANATOMY & DISSECTION",
    description:
      "Break down classic songs by rhyme density, dynamic arrangement, harmonic transitions, and lyrical themes.",
    badge: "PHASE 4 STUDY",
    highlights: [
      "Rhyme scheme diagramming & syllable count breakdowns",
      "Dynamic track energy maps (Verse vs Pre vs Hook energy curves)",
      "Mix engineering & vocal chain analysis notes",
      "Key lyrical insights and thematic takeaways",
    ],
  },
  {
    id: "albums",
    label: "Classic Album Study",
    icon: Disc3,
    title: "ALBUM ARCHITECTURE STUDY",
    description:
      "Analyze masterwork albums as complete bodies of work: sequencing, skits, sonic cohesion, and artistic evolution.",
    badge: "PHASE 4 STUDY",
    highlights: [
      "Full tracklist sequencing analysis and emotional pacing",
      "Production themes, recurring motifs, and sonic palettes",
      "Cultural context and release impact case studies",
    ],
  },
  {
    id: "artists",
    label: "Artist Lineage",
    icon: Users,
    title: "ARTIST DNA & INFLUENCE MAP",
    description:
      "Map out the greats who inspire your sound, study their creative habits, and decode their technical signatures.",
    badge: "PHASE 4 STUDY",
    highlights: [
      "Influences tree & stylistic lineage mapping",
      "Vocal delivery signatures and trademark phrasing",
      "Philosophy, discipline, and studio routines of masters",
    ],
  },
  {
    id: "reading",
    label: "Literature & Books",
    icon: BookOpen,
    title: "CREATIVE READING & THEORY",
    description:
      "Books on creativity, poetry, psychology, music history, and writing philosophy.",
    badge: "PHASE 4 STUDY",
    highlights: [
      "Essential reading list for songwriters and creators",
      "Book note summaries and quote highlights",
      "Direct application exercises derived from literature",
    ],
  },
];

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState("songs");
  const { openQuickCapture } = useNavigation();

  const currentDomain =
    DISCOVERY_DOMAINS.find((d) => d.id === activeTab) || DISCOVERY_DOMAINS[0];
  const Icon = currentDomain.icon;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-prime-borderSubtle">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="h-4 w-4 text-sky-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-sky-400">
              Music Study & Ingestion
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-prime-text">
            DISCOVER
          </h1>
          <p className="text-xs sm:text-sm text-prime-textMuted mt-0.5">
            Song analysis, album breakdowns, artist study, and creative literature.
          </p>
        </div>
      </div>

      {/* Domain Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {DISCOVERY_DOMAINS.map((domain) => {
          const TabIcon = domain.icon;
          const isSelected = activeTab === domain.id;

          return (
            <button
              key={domain.id}
              onClick={() => setActiveTab(domain.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap",
                isSelected
                  ? "bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-prime-sm"
                  : "bg-prime-surface text-prime-textMuted hover:text-prime-text border border-prime-borderSubtle"
              )}
            >
              <TabIcon className="h-3.5 w-3.5" />
              <span>{domain.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Display */}
      <EmptyState
        icon={Icon}
        phaseBadge={currentDomain.badge}
        title={currentDomain.title}
        description={currentDomain.description}
        actionLabel="Capture Song Observation"
        onAction={openQuickCapture}
        className="border-sky-500/20"
      >
        <div className="mt-4 rounded-xl border border-prime-borderSubtle bg-prime-surface/80 p-4 text-left space-y-2">
          <p className="text-[11px] font-mono uppercase tracking-wider text-prime-textMuted font-bold">
            Study Systems Under Construction:
          </p>
          <ul className="space-y-1.5 text-xs text-prime-textSecondary">
            {currentDomain.highlights.map((h, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400 shrink-0" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </EmptyState>
    </div>
  );
}
