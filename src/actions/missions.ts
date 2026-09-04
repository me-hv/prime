"use server";

import { prisma } from "@/lib/db";
import { getTodayDateString } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { DailyMissionData } from "@/lib/types";

// Default user ID for single-user Artist OS
const DEFAULT_USER_ID = "prime-artist-user";

async function ensureDefaultUser() {
  const user = await prisma.user.findUnique({
    where: { id: DEFAULT_USER_ID },
  });

  if (!user) {
    return prisma.user.create({
      data: {
        id: DEFAULT_USER_ID,
        name: "Harry",
        email: "artist@prime.os",
        profile: {
          create: {
            displayName: "Harry",
            artistName: "HARRY / PRIME",
            bio: "Songwriter, rapper, music producer, and lyricist building a classic catalog.",
            disciplines: JSON.stringify(["Rap", "Songwriting", "Music Production", "Writing"]),
            currentFocus: "BUILD MY MUSIC CAREER & FINISH MY DEBUT EP",
            vision: "Create timeless music with surgical lyrical precision, hypnotic cadence, and rich production architecture.",
          },
        },
      },
    });
  }
  return user;
}

export async function getTodayMission(dateStr?: string): Promise<DailyMissionData | null> {
  await ensureDefaultUser();
  const targetDate = dateStr || getTodayDateString();

  const mission = await prisma.dailyMission.findUnique({
    where: {
      userId_date: {
        userId: DEFAULT_USER_ID,
        date: targetDate,
      },
    },
  });

  if (!mission) return null;

  return {
    id: mission.id,
    userId: mission.userId,
    date: mission.date,
    title: mission.title,
    description: mission.description,
    completed: mission.completed,
    completedAt: mission.completedAt ? mission.completedAt.toISOString() : null,
    createdAt: mission.createdAt.toISOString(),
    updatedAt: mission.updatedAt.toISOString(),
  };
}

export async function upsertTodayMission(
  title: string,
  description?: string,
  dateStr?: string
) {
  await ensureDefaultUser();
  const targetDate = dateStr || getTodayDateString();

  const mission = await prisma.dailyMission.upsert({
    where: {
      userId_date: {
        userId: DEFAULT_USER_ID,
        date: targetDate,
      },
    },
    update: {
      title: title.trim(),
      description: description ? description.trim() : null,
    },
    create: {
      userId: DEFAULT_USER_ID,
      date: targetDate,
      title: title.trim(),
      description: description ? description.trim() : null,
      completed: false,
    },
  });

  revalidatePath("/");
  return mission;
}

export async function toggleMissionComplete(id: string, completed: boolean) {
  const mission = await prisma.dailyMission.update({
    where: { id },
    data: {
      completed,
      completedAt: completed ? new Date() : null,
    },
  });

  revalidatePath("/");
  return mission;
}

export async function deleteMission(id: string) {
  await prisma.dailyMission.delete({
    where: { id },
  });

  revalidatePath("/");
  return { success: true };
}
