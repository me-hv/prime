"use server";

import { prisma } from "@/lib/db";
import { getTodayDateString, getCurrentWeekDates } from "@/lib/utils";
import { ActivityType, CreativeActivityData, WeeklyDayStat } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { parseISO, format } from "date-fns";

const DEFAULT_USER_ID = "prime-artist-user";

export async function getRecentActivities(limit = 20): Promise<CreativeActivityData[]> {
  const activities = await prisma.creativeActivity.findMany({
    where: { userId: DEFAULT_USER_ID },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    take: limit,
  });

  return activities.map((a) => ({
    id: a.id,
    userId: a.userId,
    type: a.type as ActivityType,
    title: a.title,
    description: a.description,
    durationMinutes: a.durationMinutes,
    date: a.date,
    completed: a.completed,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  }));
}

export async function getTodayActivities(dateStr?: string): Promise<CreativeActivityData[]> {
  const targetDate = dateStr || getTodayDateString();
  const activities = await prisma.creativeActivity.findMany({
    where: {
      userId: DEFAULT_USER_ID,
      date: targetDate,
    },
    orderBy: { createdAt: "desc" },
  });

  return activities.map((a) => ({
    id: a.id,
    userId: a.userId,
    type: a.type as ActivityType,
    title: a.title,
    description: a.description,
    durationMinutes: a.durationMinutes,
    date: a.date,
    completed: a.completed,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  }));
}

export async function createCreativeActivity(data: {
  type: ActivityType;
  title: string;
  description?: string;
  durationMinutes: number;
  date?: string;
}) {
  const activity = await prisma.creativeActivity.create({
    data: {
      userId: DEFAULT_USER_ID,
      type: data.type,
      title: data.title.trim(),
      description: data.description ? data.description.trim() : null,
      durationMinutes: Math.max(1, data.durationMinutes),
      date: data.date || getTodayDateString(),
      completed: true,
    },
  });

  revalidatePath("/");
  revalidatePath("/progress");
  return activity;
}

export async function deleteCreativeActivity(id: string) {
  await prisma.creativeActivity.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/progress");
  return { success: true };
}

export async function getWeeklyOverview(): Promise<WeeklyDayStat[]> {
  const weekDates = getCurrentWeekDates();
  const today = getTodayDateString();

  const activities = await prisma.creativeActivity.findMany({
    where: {
      userId: DEFAULT_USER_ID,
      date: {
        in: weekDates,
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const dayMap = new Map<string, typeof activities>();
  for (const date of weekDates) {
    dayMap.set(date, []);
  }

  for (const act of activities) {
    if (dayMap.has(act.date)) {
      dayMap.get(act.date)!.push(act);
    }
  }

  return weekDates.map((dateStr) => {
    const parsedDate = parseISO(dateStr);
    const dayActivities = dayMap.get(dateStr) || [];
    const totalMinutes = dayActivities.reduce((sum, act) => sum + act.durationMinutes, 0);

    // Determine primary discipline
    const counts = new Map<ActivityType, number>();
    for (const act of dayActivities) {
      const type = act.type as ActivityType;
      counts.set(type, (counts.get(type) || 0) + act.durationMinutes);
    }

    let primaryDiscipline: ActivityType | null = null;
    let maxMin = 0;
    for (const [type, mins] of counts.entries()) {
      if (mins > maxMin) {
        maxMin = mins;
        primaryDiscipline = type;
      }
    }

    return {
      date: dateStr,
      dayLabel: format(parsedDate, "EEE"), // Mon, Tue
      fullDayName: format(parsedDate, "EEEE"),
      isToday: dateStr === today,
      totalMinutes,
      activitiesCount: dayActivities.length,
      activities: dayActivities.map((a) => ({
        id: a.id,
        userId: a.userId,
        type: a.type as ActivityType,
        title: a.title,
        description: a.description,
        durationMinutes: a.durationMinutes,
        date: a.date,
        completed: a.completed,
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
      })),
      primaryDiscipline,
    };
  });
}
