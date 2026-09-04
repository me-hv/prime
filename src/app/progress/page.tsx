import * as React from "react";
import { getRecentActivities, getWeeklyOverview } from "@/actions/activities";
import { getDashboardStats, getStreakMatrix } from "@/actions/stats";
import {
  TrendingUp,
  Flame,
  Clock,
  CheckCircle2,
  PenTool,
  Dna,
} from "lucide-react";
import { ACTIVITY_CONFIGS, ActivityType } from "@/lib/types";
import { formatMinutes } from "@/lib/utils";
import { WeeklyOverviewChart } from "@/components/dashboard/WeeklyOverviewChart";
import { CreativeStreakCard } from "@/components/dashboard/CreativeStreakCard";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const [activities, weeklyOverview, stats, streakMatrix] =
    await Promise.all([
      getRecentActivities(50),
      getWeeklyOverview(),
      getDashboardStats(),
      getStreakMatrix(14),
    ]);

  // Aggregate time by discipline
  const disciplineTotals: Record<ActivityType, number> = {
    WRITING: 0,
    PRODUCTION: 0,
    RECORDING: 0,
    LISTENING: 0,
    READING: 0,
    PRACTICE: 0,
    REFLECTION: 0,
  };

  for (const act of activities) {
    if (disciplineTotals[act.type] !== undefined) {
      disciplineTotals[act.type] += act.durationMinutes;
    }
  }

  const allTimeMinutes = activities.reduce(
    (sum, a) => sum + a.durationMinutes,
    0
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-prime-borderSubtle">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
              Creative Analytics & Output
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-prime-text">
            PROGRESS & METRICS
          </h1>
          <p className="text-xs sm:text-sm text-prime-textMuted mt-0.5">
            Grounded data on your real creative volume, studio sessions, and discipline consistency.
          </p>
        </div>
      </div>

      {/* High-Level Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-xl border border-prime-borderSubtle bg-prime-card/85 p-4">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase text-prime-textMuted mb-2">
            <Clock className="h-3.5 w-3.5 text-prime-gold" />
            <span>Total Logged Volume</span>
          </div>
          <p className="text-2xl font-black text-prime-text font-mono">
            {formatMinutes(allTimeMinutes)}
          </p>
          <p className="text-[11px] text-prime-textMuted mt-1">
            {activities.length} logged sessions
          </p>
        </div>

        <div className="rounded-xl border border-prime-borderSubtle bg-prime-card/85 p-4">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase text-prime-textMuted mb-2">
            <Flame className="h-3.5 w-3.5 text-amber-400" />
            <span>Creative Streak</span>
          </div>
          <p className="text-2xl font-black text-prime-text font-mono">
            {stats.currentStreakDays}{" "}
            <span className="text-xs text-amber-400">DAYS</span>
          </p>
          <p className="text-[11px] text-prime-textMuted mt-1">
            {stats.streakActiveToday ? "Verified today" : "Pending session"}
          </p>
        </div>

        <div className="rounded-xl border border-prime-borderSubtle bg-prime-card/85 p-4">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase text-prime-textMuted mb-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Missions Completed</span>
          </div>
          <p className="text-2xl font-black text-prime-text font-mono">
            {stats.completedMissionsCount}
          </p>
          <p className="text-[11px] text-prime-textMuted mt-1">
            Daily primary objectives
          </p>
        </div>

        <div className="rounded-xl border border-prime-borderSubtle bg-prime-card/85 p-4">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase text-prime-textMuted mb-2">
            <PenTool className="h-3.5 w-3.5 text-sky-400" />
            <span>Writing Sessions</span>
          </div>
          <p className="text-2xl font-black text-prime-text font-mono">
            {stats.totalWritingSessions}
          </p>
          <p className="text-[11px] text-prime-textMuted mt-1">
            Verses, lyrics & concepts
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Chart */}
        <div className="lg:col-span-8">
          <WeeklyOverviewChart stats={weeklyOverview} />
        </div>

        {/* Streak Matrix */}
        <div className="lg:col-span-4">
          <CreativeStreakCard stats={stats} matrix={streakMatrix} />
        </div>
      </div>

      {/* Discipline Distribution Breakdown */}
      <div className="rounded-xl border border-prime-borderSubtle bg-prime-card/85 p-5 shadow-prime-sm space-y-4">
        <h3 className="text-sm font-bold tracking-tight text-prime-text uppercase">
          Time Allocation by Creative Discipline
        </h3>

        <div className="space-y-3">
          {(Object.keys(ACTIVITY_CONFIGS) as ActivityType[]).map((type) => {
            const config = ACTIVITY_CONFIGS[type];
            const mins = disciplineTotals[type] || 0;
            const pct = allTimeMinutes > 0 ? Math.round((mins / allTimeMinutes) * 100) : 0;

            return (
              <div key={type} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        config.badgeClass.replace("border-", "bg-").split(" ")[0]
                      )}
                    />
                    <span className="font-semibold text-prime-text">{config.label}</span>
                    <span className="text-prime-textMuted text-[10px] hidden sm:inline">
                      ({config.description})
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-prime-text">{formatMinutes(mins)}</span>
                    <span className="text-prime-textMuted w-9 text-right font-bold">
                      {pct}%
                    </span>
                  </div>
                </div>

                <div className="h-1.5 w-full rounded-full bg-prime-surface overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: config.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Artist DNA Roadmap Banner */}
      <div className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-950/20 via-prime-card to-prime-surface p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400">
            <Dna className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-prime-text uppercase">
                Artist DNA & Skill Matrix
              </h4>
              <span className="rounded bg-purple-500/15 px-1.5 py-0.2 text-[9px] font-bold text-purple-400 font-mono">
                PHASE 6
              </span>
            </div>
            <p className="text-xs text-prime-textSecondary mt-0.5 max-w-xl leading-relaxed">
              Future releases will map your lyrical complexity, flow pocket tendencies, harmonic preferences, and production signatures into a dynamic Artist DNA blueprint.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
