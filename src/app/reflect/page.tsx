import * as React from "react";
import {
  getDailyReflection,
  getDailyReflections,
  getTodayActivityContext,
  getWeeklyReview,
  generateWeeklyDiagnosticInsight,
  getBottlenecks,
  getBreakthroughs,
  getMilestones,
  getReflectionStats,
} from "@/actions/reflection";
import { getSkills } from "@/actions/training";
import { getSongs } from "@/actions/songs";
import { ReflectHubClient } from "./ReflectHubClient";
import { getTodayDateString } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ReflectPage() {
  const today = getTodayDateString();

  const [
    stats,
    todayReflection,
    todayContext,
    pastReflections,
    weeklyReview,
    weeklyInsight,
    bottlenecks,
    breakthroughs,
    milestones,
    skills,
    songs,
  ] = await Promise.all([
    getReflectionStats(),
    getDailyReflection(today),
    getTodayActivityContext(today),
    getDailyReflections(30),
    getWeeklyReview(),
    generateWeeklyDiagnosticInsight(),
    getBottlenecks(),
    getBreakthroughs(),
    getMilestones(),
    getSkills(),
    getSongs(),
  ]);

  return (
    <ReflectHubClient
      initialStats={stats}
      initialDailyReflection={todayReflection}
      initialContext={todayContext}
      initialPastReflections={pastReflections}
      initialWeeklyReview={weeklyReview}
      initialWeeklyInsight={weeklyInsight}
      initialBottlenecks={bottlenecks}
      initialBreakthroughs={breakthroughs}
      initialMilestones={milestones}
      skills={skills}
      songs={songs}
    />
  );
}
