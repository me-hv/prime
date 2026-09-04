"use server";

import { prisma } from "@/lib/db";
import { getTodayDateString, getCurrentWeekDates } from "@/lib/utils";
import { DashboardStats } from "@/lib/types";
import { subDays, format } from "date-fns";

const DEFAULT_USER_ID = "prime-artist-user";

export async function getDashboardStats(): Promise<DashboardStats> {
  const today = getTodayDateString();
  const currentWeekDates = getCurrentWeekDates();

  // 1. Creative activities this week
  const weekActivities = await prisma.creativeActivity.findMany({
    where: {
      userId: DEFAULT_USER_ID,
      date: {
        in: currentWeekDates,
      },
    },
  });

  const distinctDaysThisWeek = new Set(weekActivities.map((a) => a.date)).size;
  const totalCreativeMinutesWeek = weekActivities.reduce(
    (sum, a) => sum + a.durationMinutes,
    0
  );

  // 2. Discipline session counts across all time
  const allActivities = await prisma.creativeActivity.findMany({
    where: { userId: DEFAULT_USER_ID },
    select: { type: true, date: true },
  });

  const totalWritingSessions = allActivities.filter(
    (a) => a.type === "WRITING"
  ).length;
  const totalProductionSessions = allActivities.filter(
    (a) => a.type === "PRODUCTION"
  ).length;
  const totalStudySessions = allActivities.filter(
    (a) => a.type === "LISTENING" || a.type === "READING"
  ).length;

  // 3. Completed missions
  const completedMissionsCount = await prisma.dailyMission.count({
    where: {
      userId: DEFAULT_USER_ID,
      completed: true,
    },
  });

  // 4. Calculate genuine creative streak
  const activityDates = new Set(allActivities.map((a) => a.date));

  let streak = 0;
  const streakActiveToday = activityDates.has(today);

  let checkDate = new Date();
  if (!streakActiveToday) {
    checkDate = subDays(checkDate, 1);
  }

  while (true) {
    const formatted = format(checkDate, "yyyy-MM-dd");
    if (activityDates.has(formatted)) {
      streak++;
      checkDate = subDays(checkDate, 1);
    } else {
      break;
    }
  }

  return {
    creativeDaysThisWeek: distinctDaysThisWeek,
    totalCreativeMinutesWeek,
    totalWritingSessions,
    totalProductionSessions,
    totalStudySessions,
    completedMissionsCount,
    currentStreakDays: streak,
    streakActiveToday,
  };
}

export async function getStreakMatrix(days = 14) {
  const dates: { date: string; hasActivity: boolean; dayName: string; isToday: boolean }[] = [];
  const today = getTodayDateString();

  const allActivities = await prisma.creativeActivity.findMany({
    where: { userId: DEFAULT_USER_ID },
    select: { date: true },
  });

  const activeDates = new Set(allActivities.map((a) => a.date));

  for (let i = days - 1; i >= 0; i--) {
    const d = subDays(new Date(), i);
    const dateStr = format(d, "yyyy-MM-dd");
    dates.push({
      date: dateStr,
      dayName: format(d, "EEE"),
      hasActivity: activeDates.has(dateStr),
      isToday: dateStr === today,
    });
  }

  return dates;
}
