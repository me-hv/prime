import * as React from "react";
import { getProfile } from "@/actions/profile";
import { getTodayMission } from "@/actions/missions";
import { getTodayActivities, getWeeklyOverview } from "@/actions/activities";
import { getGoals } from "@/actions/goals";
import { getQuickCaptures } from "@/actions/captures";
import { getDashboardStats, getStreakMatrix } from "@/actions/stats";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CurrentFocusCard } from "@/components/dashboard/CurrentFocusCard";
import { TodayMissionCard } from "@/components/dashboard/TodayMissionCard";
import { TodayActivitiesSection } from "@/components/dashboard/TodayActivitiesSection";
import { GoalsSection } from "@/components/dashboard/GoalsSection";
import { WeeklyOverviewChart } from "@/components/dashboard/WeeklyOverviewChart";
import { CreativeStreakCard } from "@/components/dashboard/CreativeStreakCard";
import { QuickCapturesFeed } from "@/components/dashboard/QuickCapturesFeed";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [
    profile,
    todayMission,
    todayActivities,
    goals,
    quickCaptures,
    weeklyOverview,
    dashboardStats,
    streakMatrix,
  ] = await Promise.all([
    getProfile(),
    getTodayMission(),
    getTodayActivities(),
    getGoals(),
    getQuickCaptures(15),
    getWeeklyOverview(),
    getDashboardStats(),
    getStreakMatrix(14),
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Time-Aware Header & Stats Ribbon */}
      <DashboardHeader
        displayName={profile.displayName}
        stats={dashboardStats}
      />

      {/* 2. Top Banner: Current Focus */}
      <CurrentFocusCard
        profile={profile}
        supportingGoals={goals}
      />

      {/* 3. Today's Primary Mission */}
      <TodayMissionCard mission={todayMission} />

      {/* 4. Main Dashboard Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Creative Work, Weekly Cadence, Goals */}
        <div className="lg:col-span-8 space-y-6">
          <TodayActivitiesSection activities={todayActivities} />
          <WeeklyOverviewChart stats={weeklyOverview} />
          <GoalsSection goals={goals} />
        </div>

        {/* Right Column: Streak Matrix, Idea Vault */}
        <div className="lg:col-span-4 space-y-6">
          <CreativeStreakCard
            stats={dashboardStats}
            matrix={streakMatrix}
          />
          <QuickCapturesFeed captures={quickCaptures} />
        </div>
      </div>
    </div>
  );
}
