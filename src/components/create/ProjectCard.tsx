"use client";

import * as React from "react";
import Link from "next/link";
import { CreativeProjectData, PROJECT_TYPE_CONFIGS } from "@/lib/types";
import { formatShortDate } from "@/lib/utils";
import {
  ArrowRight,
  Trash2,
  Calendar,
  Disc,
} from "lucide-react";
import { deleteProject } from "@/actions/projects";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: CreativeProjectData;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { success, error } = useToast();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const typeConfig =
    PROJECT_TYPE_CONFIGS[project.type] || PROJECT_TYPE_CONFIGS.EP;

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete project "${project.title}"?`)) return;

    try {
      setIsDeleting(true);
      await deleteProject(project.id);
      success("Project removed.");
    } catch (err) {
      console.error(err);
      error("Failed to delete project.");
    } finally {
      setIsDeleting(false);
    }
  };

  const finishedSongsCount = project.songs.filter(
    (ps) => ps.song?.status === "FINISHED"
  ).length;

  return (
    <Link
      href={`/create/projects/${project.id}`}
      className="group relative rounded-xl border border-prime-borderSubtle bg-prime-card/85 p-5 transition-all duration-200 hover:border-prime-border hover:bg-prime-card flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <span
            className={cn(
              "rounded px-2.5 py-0.5 text-[10px] font-mono border uppercase tracking-wider font-semibold",
              typeConfig.badgeClass
            )}
          >
            {typeConfig.label}
          </span>

          <div className="flex items-center gap-2">
            {project.targetDate && (
              <span className="text-[10px] font-mono text-prime-textMuted flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatShortDate(project.targetDate)}</span>
              </span>
            )}

            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-prime-textMuted hover:text-rose-400"
              title="Delete project"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <h3 className="text-base font-bold tracking-tight text-prime-text group-hover:text-prime-gold transition-colors line-clamp-1">
          {project.title}
        </h3>

        {project.description && (
          <p className="mt-1 text-xs text-prime-textSecondary line-clamp-2 leading-relaxed font-sans">
            {project.description}
          </p>
        )}

        {/* Attached Track Preview */}
        {project.songs.length > 0 && (
          <div className="mt-3.5 space-y-1.5 border-t border-prime-borderSubtle/60 pt-3">
            <span className="text-[10px] font-mono uppercase text-prime-textMuted font-semibold tracking-wider">
              Tracklist Preview:
            </span>
            <div className="space-y-1">
              {project.songs.slice(0, 3).map((ps, idx) => (
                <div
                  key={ps.id}
                  className="flex items-center justify-between text-xs font-mono text-prime-textSecondary"
                >
                  <span className="truncate">
                    {idx + 1}. {ps.song?.title || "Untitled Track"}
                  </span>
                  <span className="text-[10px] text-prime-textMuted">
                    {ps.song?.status}
                  </span>
                </div>
              ))}
              {project.songs.length > 3 && (
                <p className="text-[10px] font-mono text-prime-gold">
                  +{project.songs.length - 3} more tracks...
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-prime-borderSubtle/60 flex items-center justify-between text-xs font-mono">
        <span className="text-prime-textMuted flex items-center gap-1.5">
          <Disc className="h-3.5 w-3.5 text-purple-400" />
          <span>
            {project.songs.length} tracks • {finishedSongsCount} finished
          </span>
        </span>
        <span className="text-prime-textMuted group-hover:text-prime-gold group-hover:translate-x-0.5 transition-all flex items-center gap-1 font-semibold">
          <span>Project</span>
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}
