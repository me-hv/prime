"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Plus,
  Clock,
  Trash2,
  PenTool,
  Sliders,
  Mic,
  Headphones,
  BookOpen,
  Flame,
  Compass,
} from "lucide-react";
import {
  ActivityType,
  ACTIVITY_CONFIGS,
  CreativeActivityData,
} from "@/lib/types";
import { LogActivityModal } from "./LogActivityModal";
import { deleteCreativeActivity } from "@/actions/activities";
import { useToast } from "@/components/ui/Toast";
import { formatMinutes } from "@/lib/utils";
import { cn } from "@/lib/utils";

const TYPE_ICONS: Record<ActivityType, React.ElementType> = {
  WRITING: PenTool,
  PRODUCTION: Sliders,
  RECORDING: Mic,
  LISTENING: Headphones,
  READING: BookOpen,
  PRACTICE: Flame,
  REFLECTION: Compass,
};

interface TodayActivitiesSectionProps {
  activities: CreativeActivityData[];
}

export function TodayActivitiesSection({ activities }: TodayActivitiesSectionProps) {
  const { success, error } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const totalMinutesToday = activities.reduce((sum, a) => sum + a.durationMinutes, 0);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteCreativeActivity(id);
      success("Activity removed.");
    } catch (err) {
      console.error(err);
      error("Failed to delete activity.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold tracking-tight text-prime-text uppercase">
              Today&apos;s Creative Work
            </h2>
            {activities.length > 0 && (
              <span className="rounded-full bg-prime-surface border border-prime-border px-2 py-0.5 text-[11px] font-mono text-prime-gold font-semibold">
                {formatMinutes(totalMinutesToday)} logged
              </span>
            )}
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="h-8 text-xs font-semibold"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>Log Activity</span>
          </Button>
        </div>

        {activities.length > 0 ? (
          <div className="space-y-2">
            {activities.map((act) => {
              const config = ACTIVITY_CONFIGS[act.type] || ACTIVITY_CONFIGS.WRITING;
              const Icon = TYPE_ICONS[act.type] || PenTool;

              return (
                <div
                  key={act.id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-prime-borderSubtle bg-prime-card/80 p-3.5 transition-all hover:border-prime-border hover:bg-prime-card"
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                        config.badgeClass
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-sm text-prime-text truncate">
                          {act.title}
                        </span>
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.2 text-[10px] font-mono border",
                            config.badgeClass
                          )}
                        >
                          {config.label}
                        </span>
                      </div>
                      {act.description && (
                        <p className="mt-0.5 text-xs text-prime-textMuted line-clamp-1">
                          {act.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-auto shrink-0 pl-11 sm:pl-0">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-prime-textSecondary bg-prime-surface/90 px-2.5 py-1 rounded-md border border-prime-borderSubtle">
                      <Clock className="h-3.5 w-3.5 text-prime-gold" />
                      <span>{act.durationMinutes}m</span>
                    </div>

                    <button
                      onClick={() => handleDelete(act.id)}
                      disabled={deletingId === act.id}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-prime-textMuted hover:text-rose-400"
                      title="Delete activity"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-prime-borderSubtle bg-prime-surface/40 p-6 text-center">
            <p className="text-xs text-prime-textMuted">
              No creative activities logged today yet.
            </p>
            <p className="text-[11px] text-prime-textMuted/70 mt-1">
              Writing, beat making, vocal sessions, listening analysis, or freestyle drills all count toward your momentum.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="mt-3 text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1 text-prime-gold" />
              <span>Record First Session</span>
            </Button>
          </div>
        )}
      </div>

      <LogActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
