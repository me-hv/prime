"use server";

import { prisma } from "@/lib/db";
import { GoalCategory, GoalData, GoalStatus } from "@/lib/types";
import { revalidatePath } from "next/cache";

const DEFAULT_USER_ID = "prime-artist-user";

export async function getGoals(): Promise<GoalData[]> {
  const goals = await prisma.goal.findMany({
    where: { userId: DEFAULT_USER_ID },
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
  });

  return goals.map((g) => ({
    id: g.id,
    userId: g.userId,
    title: g.title,
    description: g.description,
    category: g.category as GoalCategory,
    targetDate: g.targetDate,
    status: g.status as GoalStatus,
    currentProgress: g.currentProgress,
    targetProgress: g.targetProgress,
    unit: g.unit,
    createdAt: g.createdAt.toISOString(),
    updatedAt: g.updatedAt.toISOString(),
  }));
}

export async function createGoal(data: {
  title: string;
  description?: string;
  category: GoalCategory;
  targetDate?: string;
  targetProgress?: number;
  currentProgress?: number;
  unit?: string;
}) {
  const goal = await prisma.goal.create({
    data: {
      userId: DEFAULT_USER_ID,
      title: data.title.trim(),
      description: data.description ? data.description.trim() : null,
      category: data.category,
      targetDate: data.targetDate || null,
      targetProgress: data.targetProgress && data.targetProgress > 0 ? data.targetProgress : 100,
      currentProgress: data.currentProgress || 0,
      unit: data.unit ? data.unit.trim() : "%",
      status: "IN_PROGRESS",
    },
  });

  revalidatePath("/");
  return goal;
}

export async function updateGoalProgress(id: string, newProgress: number) {
  const existing = await prisma.goal.findUnique({ where: { id } });
  if (!existing) return null;

  const validProgress = Math.max(0, newProgress);
  const isCompleted = validProgress >= existing.targetProgress;

  const goal = await prisma.goal.update({
    where: { id },
    data: {
      currentProgress: validProgress,
      status: isCompleted ? "COMPLETED" : "IN_PROGRESS",
    },
  });

  revalidatePath("/");
  return goal;
}

export async function updateGoalStatus(id: string, status: GoalStatus) {
  const goal = await prisma.goal.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/");
  return goal;
}

export async function deleteGoal(id: string) {
  await prisma.goal.delete({
    where: { id },
  });

  revalidatePath("/");
  return { success: true };
}
