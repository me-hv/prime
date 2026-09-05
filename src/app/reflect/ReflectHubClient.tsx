"use client";

import * as React from "react";
import { useState } from "react";
import {
  BottleneckData,
  BreakthroughData,
  DailyReflectionData,
  MilestoneData,
  ReflectionStatsData,
  SkillData,
  SongData,
  TodayActivityContext,
  WeeklyDiagnosticInsight,
  WeeklyReviewData,
} from "@/lib/types";
import { ReflectHubHeader } from "@/components/reflect/ReflectHubHeader";
import { DailyReflectionView } from "@/components/reflect/DailyReflectionView";
import { WeeklyReviewView } from "@/components/reflect/WeeklyReviewView";
import { BottleneckAuditView } from "@/components/reflect/BottleneckAuditView";
import { BottleneckModal } from "@/components/reflect/BottleneckModal";
import { BreakthroughLogView } from "@/components/reflect/BreakthroughLogView";
import { BreakthroughModal } from "@/components/reflect/BreakthroughModal";
import { MilestonesTimelineView } from "@/components/reflect/MilestonesTimelineView";
import { MilestoneModal } from "@/components/reflect/MilestoneModal";
import { useSearchParams } from "next/navigation";

interface ReflectHubClientProps {
  initialStats: ReflectionStatsData;
  initialDailyReflection: DailyReflectionData | null;
  initialContext: TodayActivityContext;
  initialPastReflections: DailyReflectionData[];
  initialWeeklyReview: WeeklyReviewData | null;
  initialWeeklyInsight: WeeklyDiagnosticInsight;
  initialBottlenecks: BottleneckData[];
  initialBreakthroughs: BreakthroughData[];
  initialMilestones: MilestoneData[];
  skills: SkillData[];
  songs: SongData[];
}

export function ReflectHubClient({
  initialStats,
  initialDailyReflection,
  initialContext,
  initialPastReflections,
  initialWeeklyReview,
  initialWeeklyInsight,
  initialBottlenecks,
  initialBreakthroughs,
  initialMilestones,
  skills,
  songs,
}: ReflectHubClientProps) {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "daily";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [stats, setStats] = useState<ReflectionStatsData>(initialStats);
  const [dailyReflections, setDailyReflections] = useState<DailyReflectionData[]>(
    initialPastReflections
  );
  const [currentDailyRef, setCurrentDailyRef] = useState<DailyReflectionData | null>(
    initialDailyReflection
  );
  const [weeklyReview, setWeeklyReview] = useState<WeeklyReviewData | null>(
    initialWeeklyReview
  );
  const [bottlenecks, setBottlenecks] = useState<BottleneckData[]>(
    initialBottlenecks
  );
  const [breakthroughs, setBreakthroughs] = useState<BreakthroughData[]>(
    initialBreakthroughs
  );
  const [milestones, setMilestones] = useState<MilestoneData[]>(
    initialMilestones
  );

  // Modals
  const [bottleneckModalOpen, setBottleneckModalOpen] = useState(false);
  const [breakthroughModalOpen, setBreakthroughModalOpen] = useState(false);
  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);

  // Handlers
  const handleDailySaved = (saved: DailyReflectionData) => {
    setCurrentDailyRef(saved);
    setDailyReflections((prev) => {
      const idx = prev.findIndex((r) => r.date === saved.date);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
    setStats((prev) => ({
      ...prev,
      totalDailyReflections: prev.totalDailyReflections + 1,
    }));
  };

  const handleWeeklySaved = (saved: WeeklyReviewData) => {
    setWeeklyReview(saved);
    setStats((prev) => ({
      ...prev,
      totalWeeklyReviews: prev.totalWeeklyReviews + 1,
    }));
  };

  const handleBottleneckSaved = (saved: BottleneckData) => {
    setBottlenecks((prev) => {
      const idx = prev.findIndex((b) => b.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
    setStats((prev) => ({
      ...prev,
      activeBottlenecksCount: prev.activeBottlenecksCount + (saved.resolved ? 0 : 1),
      resolvedBottlenecksCount: prev.resolvedBottlenecksCount + (saved.resolved ? 1 : 0),
    }));
  };

  const handleBreakthroughSaved = (saved: BreakthroughData) => {
    setBreakthroughs([saved, ...breakthroughs]);
    setStats((prev) => ({
      ...prev,
      breakthroughsCount: prev.breakthroughsCount + 1,
    }));
  };

  const handleMilestoneSaved = (saved: MilestoneData) => {
    setMilestones([saved, ...milestones]);
    setStats((prev) => ({
      ...prev,
      milestonesCount: prev.milestonesCount + 1,
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <ReflectHubHeader
        activeTab={activeTab}
        onTabChange={(t) => setActiveTab(t)}
        stats={stats}
        onNewBottleneck={() => setBottleneckModalOpen(true)}
        onNewBreakthrough={() => setBreakthroughModalOpen(true)}
        onNewMilestone={() => setMilestoneModalOpen(true)}
      />

      {/* 1. Daily Reflection Tab */}
      {activeTab === "daily" && (
        <DailyReflectionView
          initialReflection={currentDailyRef}
          initialContext={initialContext}
          pastReflections={dailyReflections}
          onReflectionSaved={handleDailySaved}
        />
      )}

      {/* 2. Weekly Review Tab */}
      {activeTab === "weekly" && (
        <WeeklyReviewView
          initialReview={weeklyReview}
          insight={initialWeeklyInsight}
          onReviewSaved={handleWeeklySaved}
        />
      )}

      {/* 3. Bottleneck Audit Tab */}
      {activeTab === "bottlenecks" && (
        <BottleneckAuditView
          bottlenecks={bottlenecks}
          onBottleneckSaved={handleBottleneckSaved}
          onDeleted={(id) => setBottlenecks(bottlenecks.filter((b) => b.id !== id))}
        />
      )}

      {/* 4. Breakthrough Log Tab */}
      {activeTab === "breakthroughs" && (
        <BreakthroughLogView
          breakthroughs={breakthroughs}
          skills={skills}
          songs={songs}
          onBreakthroughSaved={handleBreakthroughSaved}
          onDeleted={(id) =>
            setBreakthroughs(breakthroughs.filter((b) => b.id !== id))
          }
        />
      )}

      {/* 5. Milestones Tab */}
      {activeTab === "milestones" && (
        <MilestonesTimelineView
          milestones={milestones}
          onMilestoneSaved={handleMilestoneSaved}
          onDeleted={(id) => setMilestones(milestones.filter((m) => m.id !== id))}
        />
      )}

      {/* Modals */}
      {bottleneckModalOpen && (
        <BottleneckModal
          isOpen={bottleneckModalOpen}
          onClose={() => setBottleneckModalOpen(false)}
          onSaved={(saved) => {
            handleBottleneckSaved(saved);
            setBottleneckModalOpen(false);
          }}
        />
      )}

      {breakthroughModalOpen && (
        <BreakthroughModal
          isOpen={breakthroughModalOpen}
          onClose={() => setBreakthroughModalOpen(false)}
          skills={skills}
          songs={songs}
          onSaved={(saved) => {
            handleBreakthroughSaved(saved);
            setBreakthroughModalOpen(false);
          }}
        />
      )}

      {milestoneModalOpen && (
        <MilestoneModal
          isOpen={milestoneModalOpen}
          onClose={() => setMilestoneModalOpen(false)}
          onSaved={(saved) => {
            handleMilestoneSaved(saved);
            setMilestoneModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
