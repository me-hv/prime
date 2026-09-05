"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import {
  CurrentArtistFocusData,
  FinishingHealthData,
  ProgressInsightItem,
  ProgressOverviewData,
  SkillMatrixItem,
  StrengthSignal,
  StudyPracticeGapItem,
  TimeRangePeriod,
  WeaknessSignal,
  CreativeOutputTimeSeriesPoint,
} from "@/lib/types";
import { ProgressHeader } from "@/components/progress/ProgressHeader";
import { ArtistGrowthOverview } from "@/components/progress/ArtistGrowthOverview";
import { CurrentFocusCard } from "@/components/progress/CurrentFocusCard";
import { ProgressInsightsSection } from "@/components/progress/ProgressInsightsSection";
import { CreativeOutputSection } from "@/components/progress/CreativeOutputSection";
import { SkillMatrixTable } from "@/components/progress/SkillMatrixTable";
import { FinishingHealthView } from "@/components/progress/FinishingHealthView";
import { StudyPracticeGapView } from "@/components/progress/StudyPracticeGapView";
import { CreateFinishGapView } from "@/components/progress/CreateFinishGapView";
import { StrengthWeaknessSignals } from "@/components/progress/StrengthWeaknessSignals";
import { CreativeConsistencyView } from "@/components/progress/CreativeConsistencyView";
import {
  getProgressOverview,
  getCreativeOutputAnalytics,
  getSkillDevelopmentMatrix,
  getProgressInsights,
} from "@/actions/progress";
import { useSearchParams } from "next/navigation";

interface ProgressDashboardClientProps {
  initialOverview: ProgressOverviewData;
  initialTimeSeries: CreativeOutputTimeSeriesPoint[];
  initialFinishing: FinishingHealthData;
  initialMatrix: SkillMatrixItem[];
  initialSignals: {
    strengths: StrengthSignal[];
    weaknesses: WeaknessSignal[];
  };
  initialGapAnalysis: StudyPracticeGapItem[];
  initialInsights: ProgressInsightItem[];
  initialFocus: CurrentArtistFocusData;
}

export function ProgressDashboardClient({
  initialOverview,
  initialTimeSeries,
  initialFinishing,
  initialMatrix,
  initialSignals,
  initialGapAnalysis,
  initialInsights,
  initialFocus,
}: ProgressDashboardClientProps) {
  const searchParams = useSearchParams();
  const initialTab =
    (searchParams.get("tab") as "overview" | "skills" | "finishing" | "signals") ||
    "overview";

  const [activeTab, setActiveTab] = useState<
    "overview" | "skills" | "finishing" | "signals"
  >(initialTab);
  const [timeRange, setTimeRange] = useState<TimeRangePeriod>("30D");

  const [overview, setOverview] = useState<ProgressOverviewData>(initialOverview);
  const [timeSeries, setTimeSeries] =
    useState<CreativeOutputTimeSeriesPoint[]>(initialTimeSeries);
  const [matrix, setMatrix] = useState<SkillMatrixItem[]>(initialMatrix);
  const [insights, setInsights] =
    useState<ProgressInsightItem[]>(initialInsights);
  const [isPending, startTransition] = useTransition();

  const handleTimeRangeChange = (newPeriod: TimeRangePeriod) => {
    setTimeRange(newPeriod);
    startTransition(async () => {
      try {
        const [newOverview, newSeries, newMatrix, newInsights] =
          await Promise.all([
            getProgressOverview(newPeriod),
            getCreativeOutputAnalytics(newPeriod),
            getSkillDevelopmentMatrix(newPeriod),
            getProgressInsights(newPeriod),
          ]);
        setOverview(newOverview);
        setTimeSeries(newSeries);
        setMatrix(newMatrix);
        setInsights(newInsights);
      } catch (err) {
        console.error("Failed to update progress window:", err);
      }
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-7xl mx-auto">
      {/* Header with Navigation and Time Range Filter */}
      <ProgressHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
      />

      {/* Loading Overlay State */}
      {isPending && (
        <div className="text-center py-2 text-xs font-mono text-emerald-400 animate-pulse">
          Recalculating development metrics for {timeRange}...
        </div>
      )}

      {/* TAB 1: Overview & Output */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Current Priority Focus */}
          <CurrentFocusCard focus={initialFocus} />

          {/* High Level Growth Overview */}
          <ArtistGrowthOverview overview={overview} />

          {/* Output Time-Series Chart */}
          <CreativeOutputSection timeSeries={timeSeries} />

          {/* Consistency & Gaps Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CreativeConsistencyView overview={overview} />
            <CreateFinishGapView health={initialFinishing} />
          </div>

          {/* Traceable Insights */}
          <ProgressInsightsSection insights={insights} />
        </div>
      )}

      {/* TAB 2: Skill Matrix */}
      {activeTab === "skills" && (
        <div className="space-y-6">
          <SkillMatrixTable skills={matrix} />
          <StudyPracticeGapView gaps={initialGapAnalysis} />
        </div>
      )}

      {/* TAB 3: Finishing Health */}
      {activeTab === "finishing" && (
        <div className="space-y-6">
          <FinishingHealthView health={initialFinishing} />
          <CreateFinishGapView health={initialFinishing} />
        </div>
      )}

      {/* TAB 4: Signals & Gaps */}
      {activeTab === "signals" && (
        <div className="space-y-6">
          <StrengthWeaknessSignals
            strengths={initialSignals.strengths}
            weaknesses={initialSignals.weaknesses}
          />
          <StudyPracticeGapView gaps={initialGapAnalysis} />
          <ProgressInsightsSection insights={insights} />
        </div>
      )}
    </div>
  );
}
