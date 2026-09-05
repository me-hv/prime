"use client";

import * as React from "react";
import { useState } from "react";
import {
  History,
  Sparkles,
  Award,
  Disc3,
  Layers,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { ArtistDNAData } from "@/lib/types";

interface ArtistEvolutionTimelineProps {
  timeline: ArtistDNAData["evolutionTimeline"];
}

export function ArtistEvolutionTimeline({
  timeline,
}: ArtistEvolutionTimelineProps) {
  const [filterType, setFilterType] = useState<string>("ALL");

  const filters = [
    { id: "ALL", label: `All Events (${timeline.length})` },
    {
      id: "MILESTONE",
      label: "Milestones",
      count: timeline.filter((t) => t.type === "MILESTONE").length,
    },
    {
      id: "BREAKTHROUGH",
      label: "Breakthroughs",
      count: timeline.filter((t) => t.type === "BREAKTHROUGH").length,
    },
    {
      id: "SONG_FINISHED",
      label: "Finished Songs",
      count: timeline.filter((t) => t.type === "SONG_FINISHED").length,
    },
    {
      id: "PROJECT_COMPLETED",
      label: "Projects Shipped",
      count: timeline.filter((t) => t.type === "PROJECT_COMPLETED").length,
    },
    {
      id: "BOTTLENECK_RESOLVED",
      label: "Overcome Bottlenecks",
      count: timeline.filter((t) => t.type === "BOTTLENECK_RESOLVED").length,
    },
  ];

  const filteredTimeline = timeline.filter((item) => {
    if (filterType !== "ALL" && item.type !== filterType) return false;
    return true;
  });

  const getEventMeta = (type: ArtistDNAData["evolutionTimeline"][0]["type"]) => {
    switch (type) {
      case "MILESTONE":
        return {
          icon: Award,
          badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
          nodeBg: "bg-emerald-500",
        };
      case "BREAKTHROUGH":
        return {
          icon: Sparkles,
          badgeClass: "bg-purple-500/15 text-purple-300 border-purple-500/30",
          nodeBg: "bg-purple-500",
        };
      case "SONG_FINISHED":
        return {
          icon: Disc3,
          badgeClass: "bg-sky-500/15 text-sky-300 border-sky-500/30",
          nodeBg: "bg-sky-500",
        };
      case "PROJECT_COMPLETED":
        return {
          icon: Layers,
          badgeClass: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
          nodeBg: "bg-indigo-500",
        };
      case "BOTTLENECK_RESOLVED":
        return {
          icon: CheckCircle2,
          badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
          nodeBg: "bg-amber-500",
        };
      default:
        return {
          icon: History,
          badgeClass: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
          nodeBg: "bg-zinc-500",
        };
    }
  };

  return (
    <div className="rounded-2xl border border-prime-borderSubtle bg-prime-card/90 p-5 sm:p-6 shadow-prime-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-prime-borderSubtle">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-prime-text uppercase flex items-center gap-2">
            <History className="h-4 w-4 text-purple-400" />
            Artist Evolution Timeline
          </h3>
          <p className="text-xs text-prime-textMuted mt-0.5">
            Chronological evidence of creative breakthroughs, shipped masters, and solved bottlenecks.
          </p>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {filters.map((f) => {
          const active = filterType === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                active
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "bg-prime-surface/70 text-prime-textMuted hover:text-prime-text"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Timeline Stream */}
      {filteredTimeline.length === 0 ? (
        <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/40 p-8 text-center space-y-1">
          <p className="text-xs text-prime-textMuted">
            No events match the selected category.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-6 pt-2 border-l border-prime-borderSubtle/60 ml-3 sm:ml-4">
          {filteredTimeline.map((item) => {
            const meta = getEventMeta(item.type);
            const Icon = meta.icon;

            return (
              <div key={item.id} className="relative group">
                {/* Timeline node */}
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-1 h-3.5 w-3.5 rounded-full ${meta.nodeBg} ring-4 ring-prime-card`}
                />

                <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/70 p-4 space-y-2 group-hover:border-prime-border transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${meta.badgeClass}`}
                      >
                        <Icon className="h-3 w-3" />
                        {item.type.replace("_", " ")}
                      </span>
                      <h4 className="font-bold text-sm text-prime-text">
                        {item.title}
                      </h4>
                    </div>

                    <span className="text-[11px] font-mono text-prime-textMuted flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {item.date}
                    </span>
                  </div>

                  <p className="text-xs text-prime-textSecondary leading-relaxed">
                    {item.description}
                  </p>

                  {item.significance && (
                    <p className="text-[11px] font-mono text-purple-300 pt-1 border-t border-prime-borderSubtle/50">
                      Significance: {item.significance}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
