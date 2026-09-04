"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import {
  Edit3,
  Plus,
  Flame,
  Check,
} from "lucide-react";
import { upsertTodayMission, toggleMissionComplete } from "@/actions/missions";
import { useToast } from "@/components/ui/Toast";
import { DailyMissionData } from "@/lib/types";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface TodayMissionCardProps {
  mission: DailyMissionData | null;
}

export function TodayMissionCard({ mission }: TodayMissionCardProps) {
  const { success, error } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState(mission?.title || "");
  const [description, setDescription] = useState(mission?.description || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleOpenModal = () => {
    setTitle(mission?.title || "");
    setDescription(mission?.description || "");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      await upsertTodayMission(title.trim(), description.trim() || undefined);
      success("Today's mission set.");
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      error("Failed to update mission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleComplete = async () => {
    if (!mission || isToggling) return;
    const newStatus = !mission.completed;

    try {
      setIsToggling(true);
      await toggleMissionComplete(mission.id, newStatus);

      if (newStatus) {
        success("Mission accomplished! Pure focus.");
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#E5A93C", "#FBBF24", "#FFFFFF", "#38BDF8"],
        });
      } else {
        success("Mission marked incomplete.");
      }
    } catch (err) {
      console.error(err);
      error("Failed to toggle mission status.");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <>
      <div
        className={cn(
          "relative rounded-xl border p-6 transition-all duration-300",
          mission?.completed
            ? "border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-prime-surface to-prime-card/90 shadow-prime-sm"
            : mission
            ? "border-prime-border bg-prime-card/95 shadow-prime-md ring-1 ring-prime-gold/15"
            : "border-dashed border-prime-border bg-prime-surface/50"
        )}
      >
        {/* Top Header Label */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg font-bold text-xs",
                mission?.completed
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-prime-gold/15 text-prime-gold"
              )}
            >
              <Flame className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-prime-gold font-mono">
                Today&apos;s Primary Mission
              </span>
              <p className="text-[10px] text-prime-textMuted font-mono">
                The single high-leverage objective that moves the needle today.
              </p>
            </div>
          </div>

          {mission && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenModal}
              className="h-7 px-2 text-xs text-prime-textMuted hover:text-prime-text"
            >
              <Edit3 className="h-3.5 w-3.5 mr-1" />
              <span>Edit</span>
            </Button>
          )}
        </div>

        {/* Content Body */}
        {mission ? (
          <div className="mt-4 flex items-start gap-4">
            <button
              onClick={handleToggleComplete}
              disabled={isToggling}
              aria-label={mission.completed ? "Mark incomplete" : "Mark complete"}
              className={cn(
                "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all active:scale-90",
                mission.completed
                  ? "border-emerald-500 bg-emerald-500 text-prime-bg shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  : "border-prime-borderHighlight bg-prime-surface hover:border-prime-gold hover:text-prime-gold text-transparent"
              )}
            >
              <Check className="h-4 w-4 stroke-[3]" />
            </button>

            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  "text-base sm:text-lg font-bold tracking-tight text-prime-text transition-all",
                  mission.completed && "line-through text-prime-textMuted opacity-80"
                )}
              >
                {mission.title}
              </h3>
              {mission.description && (
                <p
                  className={cn(
                    "mt-1 text-xs sm:text-sm text-prime-textSecondary leading-relaxed",
                    mission.completed && "text-prime-textMuted/70"
                  )}
                >
                  {mission.description}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
            <p className="text-xs text-prime-textSecondary">
              No primary mission defined for today. What is the ONE creative act you must finish?
            </p>
            <Button
              variant="gold"
              size="sm"
              onClick={handleOpenModal}
              className="font-semibold shadow-prime-glow-gold shrink-0"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              <span>Set Today&apos;s Mission</span>
            </Button>
          </div>
        )}
      </div>

      {/* Define / Edit Mission Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={mission ? "EDIT TODAY'S MISSION" : "DEFINE TODAY'S MISSION"}
        description="Pick one clear, decisive creative milestone to execute today."
      >
        <form onSubmit={handleSave} className="space-y-4 pt-1">
          <Input
            label="Mission Title"
            placeholder="e.g. Finish the second verse of 'Obsidian Skies'"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
          <Textarea
            label="Context / Focus Notes (optional)"
            placeholder="Specific rhyme schemes, mixing details, or constraints..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gold"
              disabled={isSubmitting || !title.trim()}
            >
              {isSubmitting ? "Saving..." : "Lock In Mission"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
