"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Music,
} from "lucide-react";
import {
  ExerciseData,
  EXERCISE_CATEGORY_CONFIGS,
  DIFFICULTY_CONFIGS,
} from "@/lib/types";
import { RapidSprintStudio } from "@/components/train/RapidSprintStudio";
import { PocketGym } from "@/components/train/PocketGym";
import { FreestylePrompter } from "@/components/train/FreestylePrompter";
import { RhymeBuilderView } from "@/components/train/RhymeBuilderView";
import { VocabularyGymView } from "@/components/train/VocabularyGymView";
import { ProductionChallengeView } from "@/components/train/ProductionChallengeView";
import { SessionCompletionModal } from "@/components/train/SessionCompletionModal";
import { createTrainingSession, completeTrainingSession } from "@/actions/training";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

interface PracticeArenaClientProps {
  exercise: ExerciseData;
}

export function PracticeArenaClient({ exercise }: PracticeArenaClientProps) {
  const router = useRouter();
  const { success, error } = useToast();

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  const [completedDetails, setCompletedDetails] = useState<{
    durationSeconds: number;
    writingDocumentId?: string;
    notes?: string;
  } | null>(null);

  // Initialize session in background on mount
  useEffect(() => {
    let isMounted = true;
    async function initSession() {
      try {
        const session = await createTrainingSession({
          exerciseId: exercise.id,
          status: "IN_PROGRESS",
        });
        if (isMounted) {
          setActiveSessionId(session.id);
        }
      } catch (err) {
        console.error("Failed to initialize training session:", err);
      }
    }
    initSession();
    return () => {
      isMounted = false;
    };
  }, [exercise.id]);

  const catConfig = EXERCISE_CATEGORY_CONFIGS[exercise.category] || {
    label: exercise.category,
    badgeClass: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  };

  const diffConfig = DIFFICULTY_CONFIGS[exercise.difficulty] || {
    label: exercise.difficulty,
    badgeClass: "bg-prime-surfaceSubtle text-prime-textMuted border-prime-borderSubtle",
    dots: 1,
  };

  // Handler for Rapid Writing Sprint finish
  const handleSprintFinish = (docId: string, durationSeconds: number, text: string) => {
    setCompletedDetails({
      durationSeconds,
      writingDocumentId: docId,
      notes: `Completed 16-bar writing sprint (${text.split(/\s+/).filter(Boolean).length} words).`,
    });
    setCompletionModalOpen(true);
  };

  // Handler for Pocket Gym session finish
  const handlePocketGymFinish = (durationSeconds: number, bpm: number, drillNotes: string) => {
    setCompletedDetails({
      durationSeconds: Math.max(durationSeconds, 60),
      notes: drillNotes,
    });
    setCompletionModalOpen(true);
  };

  // Handler for Freestyle Prompter finish
  const handleFreestyleFinish = (durationSeconds: number, wordsCount: number, drillNotes: string) => {
    setCompletedDetails({
      durationSeconds: Math.max(durationSeconds, 60),
      notes: `Freestyle: ${wordsCount} prompt words integrated. ${drillNotes}`,
    });
    setCompletionModalOpen(true);
  };

  // Handler for Rhyme Builder finish
  const handleRhymeFinish = (chainId: string, entriesCount: number) => {
    setCompletedDetails({
      durationSeconds: exercise.estimatedDuration * 60,
      notes: `Constructed ${entriesCount} multisyllabic rhyme entries for anchor chain.`,
    });
    setCompletionModalOpen(true);
  };

  // Handler for Vocabulary Gym finish
  const handleVocabFinish = (entryId?: string) => {
    setCompletedDetails({
      durationSeconds: exercise.estimatedDuration * 60,
      notes: `Studied vocabulary entry (${entryId || "new word"}), associations, and authored custom lyrical line.`,
    });
    setCompletionModalOpen(true);
  };

  // Handler for Production Challenge finish
  const handleProductionFinish = (durationSeconds: number, challengeNotes: string) => {
    setCompletedDetails({
      durationSeconds,
      notes: challengeNotes,
    });
    setCompletionModalOpen(true);
  };

  // Save Self-Evaluation
  const handleSaveEvaluation = async (ratings: {
    effortRating: number;
    difficultyRating: number;
    confidenceRating: number;
    notes: string;
  }) => {
    if (!activeSessionId) return;

    try {
      const res = await completeTrainingSession(activeSessionId, {
        durationSeconds: completedDetails?.durationSeconds || exercise.estimatedDuration * 60,
        effortRating: ratings.effortRating,
        difficultyRating: ratings.difficultyRating,
        confidenceRating: ratings.confidenceRating,
        notes: ratings.notes || completedDetails?.notes,
        writingDocumentId: completedDetails?.writingDocumentId,
      });

      if (res.success) {
        success("Drill logged! Training streak & practice time updated.");
        setCompletionModalOpen(false);
        router.push("/train");
      }
    } catch (err) {
      console.error(err);
      error("Failed to save training evaluation.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* Back & Breadcrumb Bar */}
      <div className="flex items-center justify-between gap-4 pb-2">
        <Link
          href="/train"
          className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-prime-textMuted hover:text-prime-text transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Exit Arena to Train Hub</span>
        </Link>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border",
              catConfig.badgeClass
            )}
          >
            {catConfig.label}
          </span>
          <span className="text-xs font-mono text-prime-textMuted">
            {diffConfig.label}
          </span>
        </div>
      </div>

      {/* Drill Header & Briefing */}
      <div className="rounded-2xl border border-prime-border bg-prime-surface p-6 sm:p-7 space-y-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-prime-text">
              {exercise.title}
            </h1>
            {exercise.defaultBpm && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono text-prime-textMuted bg-prime-surfaceSubtle border border-prime-borderSubtle">
                <Music className="h-3.5 w-3.5 text-orange-400" />
                Target {exercise.defaultBpm} BPM
              </span>
            )}
          </div>
          <p className="text-sm text-prime-textSecondary leading-relaxed">
            {exercise.description}
          </p>
        </div>

        {/* Instructions & Constraints */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {exercise.instructions && (
            <div className="rounded-xl border border-prime-borderSubtle bg-prime-surfaceSubtle/60 p-4 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-orange-400 font-bold block">
                Execution Instructions
              </span>
              <p className="text-xs text-prime-textSecondary leading-relaxed whitespace-pre-line">
                {exercise.instructions}
              </p>
            </div>
          )}

          {exercise.constraints && (
            <div className="rounded-xl border border-prime-borderSubtle bg-prime-surfaceSubtle/60 p-4 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                Creative Constraints
              </span>
              <p className="text-xs text-prime-textSecondary leading-relaxed whitespace-pre-line">
                {exercise.constraints}
              </p>
            </div>
          )}
        </div>

        {/* Skills Targeted */}
        {exercise.skills && exercise.skills.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-prime-borderSubtle text-xs font-mono text-prime-textMuted">
            <span className="uppercase text-[10px] font-bold text-prime-textSecondary">
              Targeted Skills:
            </span>
            {exercise.skills.map((s) => (
              <span
                key={s.id}
                className="px-2 py-0.5 rounded bg-prime-surfaceSubtle border border-prime-borderSubtle text-prime-text"
              >
                #{s.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Tool Arena */}
      <div className="pt-2">
        {/* 1. Writing & Storytelling -> Rapid 16-Bar Sprint Studio */}
        {(exercise.category === "WRITING" || exercise.category === "STORYTELLING") && (
          <RapidSprintStudio
            exerciseTitle={exercise.title}
            starterPrompt={exercise.starterPrompt || undefined}
            initialTimeSeconds={exercise.timeLimitSeconds || 600}
            onFinishSprint={handleSprintFinish}
          />
        )}

        {/* 2. Flow & Rap Cadence -> Pocket Gym Metronome */}
        {(exercise.category === "FLOW" || exercise.category === "RAP") && (
          <PocketGym
            initialBpm={exercise.defaultBpm || 90}
            onSessionComplete={handlePocketGymFinish}
          />
        )}

        {/* 3. Freestyle & Improv -> Freestyle Prompter */}
        {exercise.category === "FREESTYLE" && (
          <FreestylePrompter
            initialDurationSeconds={exercise.timeLimitSeconds || 60}
            onFinish={handleFreestyleFinish}
          />
        )}

        {/* 4. Rhyme Construction -> Multisyllabic Rhyme Builder */}
        {exercise.category === "RHYME" && (
          <RhymeBuilderView
            onCompleteSession={(chainId, entriesCount) =>
              handleRhymeFinish(chainId, entriesCount)
            }
          />
        )}

        {/* 5. Vocabulary Gym -> Word Study & Vault */}
        {exercise.category === "VOCABULARY" && (
          <VocabularyGymView
            onCompleteSession={(entryId) => handleVocabFinish(entryId)}
          />
        )}

        {/* 6. Production & Ear Training -> Production Challenge */}
        {(exercise.category === "PRODUCTION" || exercise.category === "EAR_TRAINING") && (
          <ProductionChallengeView
            title={exercise.title}
            instructions={exercise.instructions}
            constraints={exercise.constraints}
            starterPrompt={exercise.starterPrompt}
            timeLimitSeconds={exercise.timeLimitSeconds}
            onFinishChallenge={handleProductionFinish}
          />
        )}
      </div>

      {/* Completion Modal */}
      {completionModalOpen && (
        <SessionCompletionModal
          isOpen={completionModalOpen}
          onClose={() => setCompletionModalOpen(false)}
          onSave={handleSaveEvaluation}
          exerciseTitle={exercise.title}
          durationSeconds={completedDetails?.durationSeconds || exercise.estimatedDuration * 60}
          writingDocumentId={completedDetails?.writingDocumentId}
          initialNotes={completedDetails?.notes}
        />
      )}
    </div>
  );
}
