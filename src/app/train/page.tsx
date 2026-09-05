import * as React from "react";
import {
  getExercises,
  getDailyTrainingRecommendation,
  getTrainingSessions,
  getTrainingStats,
} from "@/actions/training";
import { getRhymeChains } from "@/actions/rhymes";
import { getVocabularyEntries } from "@/actions/vocabulary";
import { TrainHubClient } from "./TrainHubClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Train | PRIME",
  description: "Artist Training Gym — Deliberate practice drills for flow, cadence, lyrics, and beats.",
};

export default async function TrainPage() {
  const [
    exercises,
    recommendation,
    recentSessions,
    stats,
    rhymeChains,
    vocabularyEntries,
  ] = await Promise.all([
    getExercises(),
    getDailyTrainingRecommendation(),
    getTrainingSessions({ limit: 50 }),
    getTrainingStats(),
    getRhymeChains(),
    getVocabularyEntries(),
  ]);

  return (
    <TrainHubClient
      exercises={exercises}
      recommendation={recommendation}
      recentSessions={recentSessions}
      stats={stats}
      rhymeChains={rhymeChains}
      vocabularyEntries={vocabularyEntries}
    />
  );
}
