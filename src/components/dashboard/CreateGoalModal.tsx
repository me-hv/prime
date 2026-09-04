"use client";

import * as React from "react";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { GoalCategory, GOAL_CATEGORY_CONFIGS } from "@/lib/types";
import { createGoal } from "@/actions/goals";
import { useToast } from "@/components/ui/Toast";

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateGoalModal({ isOpen, onClose }: CreateGoalModalProps) {
  const { success, error } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<GoalCategory>("MUSIC");
  const [targetProgress, setTargetProgress] = useState<number>(10);
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const [unit, setUnit] = useState("songs");
  const [targetDate, setTargetDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      await createGoal({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        targetProgress: Number(targetProgress),
        currentProgress: Number(currentProgress),
        unit: unit.trim() || "%",
        targetDate: targetDate || undefined,
      });

      success("Goal established.");
      setTitle("");
      setDescription("");
      setTargetProgress(10);
      setCurrentProgress(0);
      setUnit("songs");
      setTargetDate("");
      onClose();
    } catch (err) {
      console.error(err);
      error("Failed to create goal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="SET NEW CREATIVE GOAL"
      description="Define concrete targets for your music, lyrics, production catalog, or skill mastery."
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        <Input
          label="Goal Title"
          placeholder="e.g. Finish Debut EP, Write 10 16-Bar Verses, Master 5 Beats"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as GoalCategory)}
          >
            {(Object.keys(GOAL_CATEGORY_CONFIGS) as GoalCategory[]).map((cat) => (
              <option key={cat} value={cat}>
                {GOAL_CATEGORY_CONFIGS[cat].label}
              </option>
            ))}
          </Select>

          <Input
            label="Target Date (optional)"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>

        {/* Progress and Unit Setup */}
        <div className="grid grid-cols-3 gap-2">
          <Input
            label="Current"
            type="number"
            min={0}
            value={currentProgress}
            onChange={(e) => setCurrentProgress(Number(e.target.value))}
          />
          <Input
            label="Target"
            type="number"
            min={1}
            value={targetProgress}
            onChange={(e) => setTargetProgress(Number(e.target.value))}
            required
          />
          <Input
            label="Unit"
            placeholder="songs, verses, hrs"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            required
          />
        </div>

        <Textarea
          label="Description / Execution Strategy (optional)"
          placeholder="What specific criteria define this goal being completed?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <div className="flex justify-end gap-2 pt-2">
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
            {isSubmitting ? "Saving..." : "Lock In Goal"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
