import * as React from "react";
import {
  getProgressOverview,
  getCreativeOutputAnalytics,
  getFinishingHealth,
  getSkillDevelopmentMatrix,
  getStrengthAndWeaknessSignals,
  getStudyPracticeGap,
  getProgressInsights,
  getCurrentArtistFocus,
} from "@/actions/progress";
import { ProgressDashboardClient } from "./ProgressDashboardClient";

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const [
    overview,
    timeSeries,
    finishing,
    matrix,
    signals,
    gapAnalysis,
    insights,
    currentFocus,
  ] = await Promise.all([
    getProgressOverview("30D"),
    getCreativeOutputAnalytics("30D"),
    getFinishingHealth(),
    getSkillDevelopmentMatrix("30D"),
    getStrengthAndWeaknessSignals(),
    getStudyPracticeGap(),
    getProgressInsights("30D"),
    getCurrentArtistFocus(),
  ]);

  return (
    <ProgressDashboardClient
      initialOverview={overview}
      initialTimeSeries={timeSeries}
      initialFinishing={finishing}
      initialMatrix={matrix}
      initialSignals={signals}
      initialGapAnalysis={gapAnalysis}
      initialInsights={insights}
      initialFocus={currentFocus}
    />
  );
}
