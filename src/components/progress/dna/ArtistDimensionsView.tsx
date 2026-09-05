"use client";

import * as React from "react";
import {
  PenTool,
  Compass,
  Dumbbell,
  CheckCircle2,
  Globe,
  BookOpen,
  Layers,
} from "lucide-react";
import { ArtistDNAData } from "@/lib/types";

interface ArtistDimensionsViewProps {
  dimensions: ArtistDNAData["dimensions"];
}

export function ArtistDimensionsView({
  dimensions,
}: ArtistDimensionsViewProps) {
  const { creator, student, practitioner, finisher, explorer, reflector } =
    dimensions;

  const DIMENSION_CARDS = [
    {
      id: "creator",
      title: "Creator",
      subtitle: creator.topFormat,
      description: creator.summary,
      icon: PenTool,
      accent: "text-amber-400",
      border: "border-amber-500/20",
      bg: "bg-amber-950/10",
      metric: `${creator.distribution.writingPct}% Writing / ${creator.distribution.songsPct}% Songs`,
    },
    {
      id: "student",
      title: "Student",
      subtitle: `Focus: ${student.topFocus}`,
      description: student.summary,
      icon: Compass,
      accent: "text-sky-400",
      border: "border-sky-500/20",
      bg: "bg-sky-950/10",
      metric: `${student.totalStudies} Dissections (${student.studiedArtistsCount} Artists)`,
    },
    {
      id: "practitioner",
      title: "Practitioner",
      subtitle: `Top Skill: ${practitioner.topSkill}`,
      description: practitioner.summary,
      icon: Dumbbell,
      accent: "text-orange-400",
      border: "border-orange-500/20",
      bg: "bg-orange-950/10",
      metric: `${practitioner.totalPracticeHours} Practice Hours`,
    },
    {
      id: "finisher",
      title: "Finisher",
      subtitle: `${finisher.finishRatio}% Catalog Completion`,
      description: finisher.summary,
      icon: CheckCircle2,
      accent: "text-emerald-400",
      border: "border-emerald-500/20",
      bg: "bg-emerald-950/10",
      metric: `${finisher.activePipelineCount} Active In Pipeline`,
    },
    {
      id: "explorer",
      title: "Explorer",
      subtitle: "Stylistic & Technical Breadth",
      description: explorer.summary,
      icon: Globe,
      accent: "text-purple-400",
      border: "border-purple-500/20",
      bg: "bg-purple-950/10",
      metric: `${explorer.genreDiversity} Genres • ${explorer.skillBreadth} Skills`,
    },
    {
      id: "reflector",
      title: "Reflector",
      subtitle: `${reflector.reviewConsistencyPct}% Review Consistency`,
      description: reflector.summary,
      icon: BookOpen,
      accent: "text-indigo-400",
      border: "border-indigo-500/20",
      bg: "bg-indigo-950/10",
      metric: `${reflector.totalReviews} Retrospective Logs`,
    },
  ];

  return (
    <div className="rounded-2xl border border-prime-borderSubtle bg-prime-card/90 p-5 sm:p-6 shadow-prime-sm space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-prime-borderSubtle">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-prime-text uppercase flex items-center gap-2">
            <Layers className="h-4 w-4 text-purple-400" />
            6 Artist DNA Dimensions
          </h3>
          <p className="text-xs text-prime-textMuted mt-0.5">
            Descriptive architectural breakdown of your creative tendencies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DIMENSION_CARDS.map((dim) => {
          const Icon = dim.icon;
          return (
            <div
              key={dim.id}
              className={`rounded-xl border ${dim.border} ${dim.bg} p-4.5 space-y-2.5 shadow-prime-xs transition-all hover:border-prime-border`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${dim.accent}`} />
                  <span className="font-bold text-sm text-prime-text">
                    {dim.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-prime-textMuted">
                  {dim.metric}
                </span>
              </div>

              <p className="font-mono text-xs font-semibold text-prime-textSecondary">
                {dim.subtitle}
              </p>

              <p className="text-xs text-prime-textMuted leading-relaxed">
                {dim.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
