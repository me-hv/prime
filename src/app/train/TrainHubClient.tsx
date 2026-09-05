"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ExerciseData,
  TrainingSessionData,
  TrainingStatsData,
  RhymeChainData,
  VocabularyEntryData,
} from "@/lib/types";
import { TrainingHubHeader } from "@/components/train/TrainingHubHeader";
import { TodayTrainingCard } from "@/components/train/TodayTrainingCard";
import { ExerciseListView } from "@/components/train/ExerciseListView";
import { PocketGym } from "@/components/train/PocketGym";
import { RhymeBuilderView } from "@/components/train/RhymeBuilderView";
import { VocabularyGymView } from "@/components/train/VocabularyGymView";
import { TrainingHistoryView } from "@/components/train/TrainingHistoryView";
import { SessionCompletionModal } from "@/components/train/SessionCompletionModal";
import { createTrainingSession, completeTrainingSession } from "@/actions/training";
import { useToast } from "@/components/ui/Toast";

interface TrainHubClientProps {
  exercises: ExerciseData[];
  recommendation: {
    exercise: ExerciseData;
    reason: string;
  } | null;
  recentSessions: TrainingSessionData[];
  stats: TrainingStatsData;
  rhymeChains: RhymeChainData[];
  vocabularyEntries: VocabularyEntryData[];
}

export function TrainHubClient({
  exercises,
  recommendation,
  recentSessions,
  stats,
  rhymeChains,
  vocabularyEntries,
}: TrainHubClientProps) {
  const router = useRouter();
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState("drills");

  // Modal evaluation state for standalone Pocket Gym / Quick Drill
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  const [completedDrillInfo, setCompletedDrillInfo] = useState<{
    exerciseTitle: string;
    exerciseId?: string;
    durationSeconds: number;
    notes?: string;
    sessionId?: string;
  } | null>(null);

  const handleStartExercise = (exercise: ExerciseData) => {
    router.push(`/train/${exercise.slug || exercise.id}`);
  };

  const handleOpenPocketGym = () => {
    setActiveTab("pocket-gym");
  };

  const handlePocketGymComplete = async (
    durationSeconds: number,
    bpm: number,
    drillNotes: string
  ) => {
    // Find matching Pocket drill if exists, or create a custom pocket session
    const pocketEx = exercises.find((e) => e.category === "FLOW" || e.category === "RAP") || exercises[0];

    try {
      const session = await createTrainingSession({
        exerciseId: pocketEx.id,
        durationSeconds,
        notes: drillNotes,
      });

      setCompletedDrillInfo({
        exerciseTitle: `Pocket Gym (${bpm} BPM)`,
        exerciseId: pocketEx.id,
        durationSeconds,
        notes: drillNotes,
        sessionId: session.id,
      });
      setCompletionModalOpen(true);
    } catch (err) {
      console.error(err);
      error("Failed to start session tracking.");
    }
  };

  const handleSaveEvaluation = async (ratings: {
    effortRating: number;
    difficultyRating: number;
    confidenceRating: number;
    notes: string;
  }) => {
    if (!completedDrillInfo?.sessionId) {
      setCompletionModalOpen(false);
      return;
    }

    try {
      const res = await completeTrainingSession(completedDrillInfo.sessionId, {
        durationSeconds: completedDrillInfo.durationSeconds,
        effortRating: ratings.effortRating,
        difficultyRating: ratings.difficultyRating,
        confidenceRating: ratings.confidenceRating,
        notes: ratings.notes || completedDrillInfo.notes,
      });

      if (res.success) {
        success("Training drill completed and logged!");
        setCompletionModalOpen(false);
        setCompletedDrillInfo(null);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      error("Failed to record session rating.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* 1. Header with Stats Ribbon & Tab Navigation */}
      <TrainingHubHeader
        stats={stats}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenPocketGym={handleOpenPocketGym}
      />

      {/* 2. Active Tab Content */}
      {activeTab === "drills" && (
        <div className="space-y-8">
          {/* Daily Training Recommendation Hero */}
          {recommendation && (
            <TodayTrainingCard
              recommendation={recommendation}
              onStart={handleStartExercise}
            />
          )}

          {/* Drill Catalog with Filters */}
          <ExerciseListView
            exercises={exercises}
            onStartExercise={handleStartExercise}
          />
        </div>
      )}

      {activeTab === "pocket-gym" && (
        <div className="space-y-6">
          <PocketGym
            initialBpm={recommendation?.exercise?.defaultBpm || 90}
            onSessionComplete={handlePocketGymComplete}
          />
        </div>
      )}

      {activeTab === "rhymes" && (
        <div className="space-y-6">
          <RhymeBuilderView initialChains={rhymeChains} />
        </div>
      )}

      {activeTab === "vocab" && (
        <div className="space-y-6">
          <VocabularyGymView initialEntries={vocabularyEntries} />
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-6">
          <TrainingHistoryView sessions={recentSessions} />
        </div>
      )}

      {/* Self-Evaluation Completion Modal */}
      {completionModalOpen && completedDrillInfo && (
        <SessionCompletionModal
          isOpen={completionModalOpen}
          onClose={() => setCompletionModalOpen(false)}
          onSave={handleSaveEvaluation}
          exerciseTitle={completedDrillInfo.exerciseTitle}
          durationSeconds={completedDrillInfo.durationSeconds}
          initialNotes={completedDrillInfo.notes}
        />
      )}
    </div>
  );
}
