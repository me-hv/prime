"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import {
  CreativeProjectData,
  ProjectType,
  PROJECT_TYPE_CONFIGS,
} from "@/lib/types";
import { ProjectCard } from "./ProjectCard";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectsListViewProps {
  projects: CreativeProjectData[];
}

export function ProjectsListView({ projects }: ProjectsListViewProps) {
  const [selectedType, setSelectedType] = useState<string>("ALL");

  const filtered = projects.filter((p) => {
    if (selectedType === "ALL") return true;
    return p.type === selectedType;
  });

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-prime-borderSubtle">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold tracking-tight text-prime-text uppercase">
            Creative Projects & Bodies of Work
          </h2>
          <span className="rounded-full bg-prime-surface border border-prime-border px-2.5 py-0.5 text-xs font-mono text-prime-gold font-semibold">
            {projects.length} projects
          </span>
        </div>

        <Link href="/create/projects">
          <Button
            variant="gold"
            size="sm"
            className="h-8 text-xs font-semibold shadow-prime-glow-gold"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>New Project</span>
          </Button>
        </Link>
      </div>

      {/* Project Type Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedType("ALL")}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-mono transition-colors whitespace-nowrap",
            selectedType === "ALL"
              ? "bg-prime-gold/15 text-prime-gold border border-prime-gold/30 font-semibold"
              : "bg-prime-surface text-prime-textMuted hover:text-prime-text border border-prime-borderSubtle"
          )}
        >
          All Projects ({projects.length})
        </button>
        {(Object.keys(PROJECT_TYPE_CONFIGS) as ProjectType[]).map((type) => {
          const count = projects.filter((p) => p.type === type).length;
          if (count === 0 && selectedType !== type) return null;

          return (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-mono transition-colors whitespace-nowrap",
                selectedType === type
                  ? "bg-prime-gold/15 text-prime-gold border border-prime-gold/30 font-semibold"
                  : "bg-prime-surface text-prime-textMuted hover:text-prime-text border border-prime-borderSubtle"
              )}
            >
              {PROJECT_TYPE_CONFIGS[type].label} ({count})
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filtered.map((proj) => (
            <ProjectCard key={proj.id} project={proj} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-prime-borderSubtle bg-prime-surface/40 p-8 text-center">
          <p className="text-xs text-prime-textMuted font-medium">
            No active projects in this category.
          </p>
          <p className="text-[11px] text-prime-textMuted/70 mt-1">
            Group your songs into an EP, Album, or structured concept release.
          </p>
          <Link href="/create/projects">
            <Button variant="outline" size="sm" className="mt-3 text-xs">
              <Plus className="h-3.5 w-3.5 mr-1 text-prime-gold" />
              <span>Create New Project</span>
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
