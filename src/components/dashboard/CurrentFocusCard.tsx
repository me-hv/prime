"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { Target, Edit3, ArrowRight } from "lucide-react";
import { updateProfile } from "@/actions/profile";
import { useToast } from "@/components/ui/Toast";
import Link from "next/link";
import { ProfileData, GoalData } from "@/lib/types";

interface CurrentFocusCardProps {
  profile: ProfileData;
  supportingGoals?: GoalData[];
}

export function CurrentFocusCard({ profile, supportingGoals = [] }: CurrentFocusCardProps) {
  const { success, error } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [focus, setFocus] = useState(profile.currentFocus);
  const [vision, setVision] = useState(profile.vision);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!focus.trim()) return;

    try {
      setIsSubmitting(true);
      await updateProfile({
        displayName: profile.displayName,
        artistName: profile.artistName,
        bio: profile.bio,
        disciplines: profile.disciplines,
        currentFocus: focus.trim(),
        vision: vision.trim(),
      });
      success("Current focus updated.");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      error("Failed to update focus.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeGoals = supportingGoals.filter((g) => g.status === "IN_PROGRESS").slice(0, 3);

  return (
    <>
      <div className="relative overflow-hidden rounded-xl border border-prime-gold/30 bg-gradient-to-br from-prime-card/95 via-prime-surface to-prime-card/80 p-5 shadow-prime-sm">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-prime-gold/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-prime-gold/15 text-prime-gold">
              <Target className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-prime-gold font-mono">
              Current Focus
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFocus(profile.currentFocus);
              setVision(profile.vision);
              setIsEditing(true);
            }}
            className="h-7 px-2 text-xs text-prime-textMuted hover:text-prime-text"
          >
            <Edit3 className="h-3.5 w-3.5 mr-1" />
            <span>Refine</span>
          </Button>
        </div>

        {/* Primary Focus Title */}
        <div className="mt-3">
          <h2 className="text-lg sm:text-xl font-black tracking-tight text-prime-text uppercase">
            {profile.currentFocus || "Define your main creative focus"}
          </h2>
          {profile.vision && (
            <p className="mt-1.5 text-xs text-prime-textSecondary line-clamp-2 leading-relaxed">
              {profile.vision}
            </p>
          )}
        </div>

        {/* Supporting Active Goals */}
        {activeGoals.length > 0 && (
          <div className="mt-4 pt-4 border-t border-prime-borderSubtle">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-prime-textMuted font-mono">
                Supporting Goals ({activeGoals.length})
              </span>
              <Link
                href="#goals"
                className="text-[11px] text-prime-gold hover:underline flex items-center gap-1 font-mono"
              >
                <span>View all</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {activeGoals.map((g) => {
                const progressPct = Math.round(
                  Math.min(100, (g.currentProgress / g.targetProgress) * 100)
                );
                return (
                  <div
                    key={g.id}
                    className="rounded-lg border border-prime-borderSubtle bg-prime-surface/70 p-2.5 transition-colors hover:border-prime-border"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-prime-textMuted mb-1">
                      <span className="text-prime-gold">{g.category}</span>
                      <span>{progressPct}%</span>
                    </div>
                    <p className="text-xs font-medium text-prime-text truncate">
                      {g.title}
                    </p>
                    <div className="mt-2 h-1 w-full bg-prime-borderSubtle rounded-full overflow-hidden">
                      <div
                        className="h-full bg-prime-gold rounded-full"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Edit Focus Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="REFINE CURRENT FOCUS"
        description="The overarching north star guiding your daily missions and creative output."
      >
        <form onSubmit={handleSave} className="space-y-4 pt-1">
          <Input
            label="Current Core Focus"
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            placeholder="e.g. BUILD MY MUSIC CAREER & COMPLETE DEBUT EP"
            required
            autoFocus
          />
          <Textarea
            label="Long-Term Vision & Philosophy"
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            placeholder="What does mastery and artistic success look like for you?"
            rows={3}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsEditing(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gold"
              disabled={isSubmitting || !focus.trim()}
            >
              {isSubmitting ? "Saving..." : "Save Focus"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
