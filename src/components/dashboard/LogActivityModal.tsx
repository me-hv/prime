"use client";

import * as React from "react";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ActivityType, ACTIVITY_CONFIGS } from "@/lib/types";
import { createCreativeActivity } from "@/actions/activities";
import { useToast } from "@/components/ui/Toast";
import { getTodayDateString } from "@/lib/utils";
import {
  PenTool,
  Sliders,
  Mic,
  Headphones,
  BookOpen,
  Flame,
  Compass,
} from "lucide-react";
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

const DURATION_PRESETS = [15, 25, 30, 45, 60, 90, 120];

interface LogActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogActivityModal({ isOpen, onClose }: LogActivityModalProps) {
  const { success, error } = useToast();
  const [selectedType, setSelectedType] = useState<ActivityType>("WRITING");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState<number>(30);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || duration <= 0) return;

    try {
      setIsSubmitting(true);
      await createCreativeActivity({
        type: selectedType,
        title: title.trim(),
        description: description.trim() || undefined,
        durationMinutes: Number(duration),
        date: getTodayDateString(),
      });

      success(`${ACTIVITY_CONFIGS[selectedType].label} activity logged.`);
      setTitle("");
      setDescription("");
      setDuration(30);
      onClose();
    } catch (err) {
      console.error(err);
      error("Failed to log activity.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="LOG CREATIVE ACTIVITY"
      description="Record real time spent writing, producing, recording, studying, or practicing."
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {/* Activity Type Selector Grid */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-prime-textMuted font-mono">
            Creative Discipline
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(Object.keys(ACTIVITY_CONFIGS) as ActivityType[]).map((type) => {
              const config = ACTIVITY_CONFIGS[type];
              const Icon = TYPE_ICONS[type];
              const isSelected = selectedType === type;

              return (
                <button
                  type="button"
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border p-2 text-xs font-medium transition-all text-left",
                    isSelected
                      ? "border-prime-gold/40 bg-prime-gold/15 text-prime-gold shadow-prime-sm"
                      : "border-prime-borderSubtle bg-prime-surface/80 text-prime-textSecondary hover:border-prime-border hover:text-prime-text"
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{config.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Activity Title */}
        <Input
          label="What did you work on?"
          placeholder="e.g. 16 bars for new verse, 808 drum mixing, Kendrick album study..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />

        {/* Duration with presets */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-prime-textSecondary">
            Duration (Minutes)
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={1}
              max={720}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-28 font-mono"
              required
            />
            <div className="flex flex-wrap gap-1.5">
              {DURATION_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setDuration(preset)}
                  className={cn(
                    "rounded-md border px-2 py-1 text-xs font-mono transition-colors",
                    duration === preset
                      ? "border-prime-gold bg-prime-gold/15 text-prime-gold"
                      : "border-prime-borderSubtle bg-prime-surface text-prime-textMuted hover:text-prime-text hover:border-prime-border"
                  )}
                >
                  {preset}m
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Optional Description / Notes */}
        <Textarea
          label="Notes / Key Takeaways (optional)"
          placeholder="Rhyme schemes discovered, mixing tricks used, breakthroughs..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="gold"
            disabled={isSubmitting || !title.trim()}
          >
            {isSubmitting ? "Logging..." : "Log Activity"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
