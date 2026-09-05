"use server";

import { prisma } from "@/lib/db";
import {
  ExerciseCategory,
  ExerciseData,
  ExerciseDifficulty,
  SkillCategory,
  SkillData,
  TrainingSessionData,
  TrainingSessionStatus,
  TrainingStatsData,
  WritingType,
  WritingStatus,
} from "@/lib/types";
import { revalidatePath } from "next/cache";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";

const DEFAULT_USER_ID = "prime-artist-user";

export async function getSkills(): Promise<SkillData[]> {
  const skills = await prisma.skill.findMany({
    include: {
      exercises: { select: { id: true } },
    },
    orderBy: { name: "asc" },
  });

  return skills.map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    category: s.category as SkillCategory,
    description: s.description,
    exerciseCount: s.exercises.length,
  }));
}

export async function getExercises(filter?: {
  category?: string;
  difficulty?: string;
  skillId?: string;
  search?: string;
}): Promise<ExerciseData[]> {
  const whereClause: Record<string, unknown> = { active: true };

  if (filter?.category && filter.category !== "ALL") {
    whereClause.category = filter.category;
  }
  if (filter?.difficulty && filter.difficulty !== "ALL") {
    whereClause.difficulty = filter.difficulty;
  }
  if (filter?.skillId && filter.skillId !== "ALL") {
    whereClause.skills = {
      some: { skillId: filter.skillId },
    };
  }
  if (filter?.search && filter.search.trim()) {
    const q = filter.search.trim();
    whereClause.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { instructions: { contains: q } },
      { starterPrompt: { contains: q } },
    ];
  }

  const exercises = await prisma.exercise.findMany({
    where: whereClause,
    include: {
      skills: {
        include: { skill: true },
      },
      sessions: {
        where: { userId: DEFAULT_USER_ID, status: "COMPLETED" },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true },
      },
      _count: {
        select: { sessions: { where: { userId: DEFAULT_USER_ID, status: "COMPLETED" } } },
      },
    },
    orderBy: [{ orderIndex: "asc" }, { title: "asc" }],
  });

  return exercises.map((ex) => ({
    id: ex.id,
    slug: ex.slug,
    title: ex.title,
    description: ex.description,
    category: ex.category as ExerciseCategory,
    difficulty: ex.difficulty as ExerciseDifficulty,
    estimatedDuration: ex.estimatedDuration,
    instructions: ex.instructions,
    constraints: ex.constraints,
    starterPrompt: ex.starterPrompt,
    defaultBpm: ex.defaultBpm,
    timeLimitSeconds: ex.timeLimitSeconds,
    active: ex.active,
    orderIndex: ex.orderIndex,
    skills: ex.skills.map((es) => ({
      id: es.skill.id,
      name: es.skill.name,
      slug: es.skill.slug,
      category: es.skill.category as SkillCategory,
      description: es.skill.description,
    })),
    sessionCount: ex._count.sessions,
    lastPracticedAt: ex.sessions[0]?.createdAt.toISOString() || null,
    createdAt: ex.createdAt.toISOString(),
    updatedAt: ex.updatedAt.toISOString(),
  }));
}

export async function getExercise(idOrSlug: string): Promise<ExerciseData | null> {
  const ex = await prisma.exercise.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
    include: {
      skills: {
        include: { skill: true },
      },
      sessions: {
        where: { userId: DEFAULT_USER_ID, status: "COMPLETED" },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true },
      },
      _count: {
        select: { sessions: { where: { userId: DEFAULT_USER_ID, status: "COMPLETED" } } },
      },
    },
  });

  if (!ex) return null;

  return {
    id: ex.id,
    slug: ex.slug,
    title: ex.title,
    description: ex.description,
    category: ex.category as ExerciseCategory,
    difficulty: ex.difficulty as ExerciseDifficulty,
    estimatedDuration: ex.estimatedDuration,
    instructions: ex.instructions,
    constraints: ex.constraints,
    starterPrompt: ex.starterPrompt,
    defaultBpm: ex.defaultBpm,
    timeLimitSeconds: ex.timeLimitSeconds,
    active: ex.active,
    orderIndex: ex.orderIndex,
    skills: ex.skills.map((es) => ({
      id: es.skill.id,
      name: es.skill.name,
      slug: es.skill.slug,
      category: es.skill.category as SkillCategory,
      description: es.skill.description,
    })),
    sessionCount: ex._count.sessions,
    lastPracticedAt: ex.sessions[0]?.createdAt.toISOString() || null,
    createdAt: ex.createdAt.toISOString(),
    updatedAt: ex.updatedAt.toISOString(),
  };
}

/**
 * Deterministic training recommendation based on user's recent practice gaps.
 * E.g., if user hasn't trained Flow recently, recommend Flow pocket drill;
 * if user hasn't trained Writing recently, recommend 16-bar sprint.
 */
export async function getDailyTrainingRecommendation(): Promise<{
  exercise: ExerciseData;
  reason: string;
} | null> {
  const allExercises = await getExercises();
  if (allExercises.length === 0) return null;

  // Fetch recent completed sessions
  const recentSessions = await prisma.trainingSession.findMany({
    where: { userId: DEFAULT_USER_ID, status: "COMPLETED" },
    include: { exercise: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const practicedCategories = new Set(recentSessions.map((s) => s.exercise.category));
  const categoryPriority: ExerciseCategory[] = [
    "WRITING",
    "FLOW",
    "RAP",
    "RHYME",
    "FREESTYLE",
    "PRODUCTION",
    "STORYTELLING",
    "VOCABULARY",
    "EAR_TRAINING",
  ];

  // Find the first priority category that hasn't been practiced recently
  let targetCategory = categoryPriority.find((cat) => !practicedCategories.has(cat));
  if (!targetCategory) {
    targetCategory = "WRITING";
  }

  // Find an uncompleted or least-recently completed exercise in that category
  let candidate = allExercises.find(
    (ex) => ex.category === targetCategory && (ex.sessionCount || 0) === 0
  );

  if (!candidate) {
    candidate = allExercises.find((ex) => ex.category === targetCategory);
  }

  if (!candidate) {
    candidate = allExercises[0];
  }

  let reason = `Recommended practice for today to sharpen your ${candidate.category.toLowerCase().replace("_", " ")} fundamentals.`;
  if (candidate.category === "WRITING") {
    reason = "Sharpen your writing velocity and instinct with a timed 16-bar execution drill.";
  } else if (candidate.category === "FLOW" || candidate.category === "RAP") {
    reason = "Lock into the pocket and train your cadence transitions with the metronome.";
  } else if (candidate.category === "RHYME") {
    reason = "Expand your multi-syllabic vocabulary and internal rhyme density.";
  } else if (candidate.category === "FREESTYLE") {
    reason = "Warm up your improvisational reflexes and verbal association speed.";
  } else if (candidate.category === "PRODUCTION") {
    reason = "Speed challenge to dial in drum swing, minimal arrangements, and sound selection.";
  }

  return { exercise: candidate, reason };
}

export async function getTrainingSessions(filter?: {
  category?: string;
  exerciseId?: string;
  limit?: number;
}): Promise<TrainingSessionData[]> {
  const whereClause: Record<string, unknown> = { userId: DEFAULT_USER_ID };

  if (filter?.exerciseId) {
    whereClause.exerciseId = filter.exerciseId;
  }
  if (filter?.category && filter.category !== "ALL") {
    whereClause.exercise = { category: filter.category };
  }

  const sessions = await prisma.trainingSession.findMany({
    where: whereClause,
    include: {
      exercise: {
        include: {
          skills: {
            include: { skill: true },
          },
        },
      },
      writingDocument: true,
    },
    orderBy: { createdAt: "desc" },
    take: filter?.limit || 50,
  });

  return sessions.map((s) => ({
    id: s.id,
    userId: s.userId,
    exerciseId: s.exerciseId,
    status: s.status as TrainingSessionStatus,
    startedAt: s.startedAt.toISOString(),
    endedAt: s.endedAt ? s.endedAt.toISOString() : null,
    durationSeconds: s.durationSeconds,
    effortRating: s.effortRating,
    difficultyRating: s.difficultyRating,
    confidenceRating: s.confidenceRating,
    notes: s.notes,
    resultPayload: s.resultPayload,
    writingDocumentId: s.writingDocumentId,
    exercise: {
      id: s.exercise.id,
      slug: s.exercise.slug,
      title: s.exercise.title,
      description: s.exercise.description,
      category: s.exercise.category as ExerciseCategory,
      difficulty: s.exercise.difficulty as ExerciseDifficulty,
      estimatedDuration: s.exercise.estimatedDuration,
      instructions: s.exercise.instructions,
      constraints: s.exercise.constraints,
      starterPrompt: s.exercise.starterPrompt,
      defaultBpm: s.exercise.defaultBpm,
      timeLimitSeconds: s.exercise.timeLimitSeconds,
      active: s.exercise.active,
      orderIndex: s.exercise.orderIndex,
      skills: s.exercise.skills.map((es) => ({
        id: es.skill.id,
        name: es.skill.name,
        slug: es.skill.slug,
        category: es.skill.category as SkillCategory,
        description: es.skill.description,
      })),
      createdAt: s.exercise.createdAt.toISOString(),
      updatedAt: s.exercise.updatedAt.toISOString(),
    },
    writingDocument: s.writingDocument
      ? {
          id: s.writingDocument.id,
          userId: s.writingDocument.userId,
          title: s.writingDocument.title,
          content: s.writingDocument.content,
          type: s.writingDocument.type as WritingType,
          status: s.writingDocument.status as WritingStatus,
          tags: s.writingDocument.tags,
          wordCount: s.writingDocument.wordCount,
          characterCount: s.writingDocument.characterCount,
          createdAt: s.writingDocument.createdAt.toISOString(),
          updatedAt: s.writingDocument.updatedAt.toISOString(),
        }
      : null,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }));
}

export async function getTrainingSession(id: string): Promise<TrainingSessionData | null> {
  const s = await prisma.trainingSession.findFirst({
    where: { id, userId: DEFAULT_USER_ID },
    include: {
      exercise: {
        include: {
          skills: {
            include: { skill: true },
          },
        },
      },
      writingDocument: true,
    },
  });

  if (!s) return null;

  return {
    id: s.id,
    userId: s.userId,
    exerciseId: s.exerciseId,
    status: s.status as TrainingSessionStatus,
    startedAt: s.startedAt.toISOString(),
    endedAt: s.endedAt ? s.endedAt.toISOString() : null,
    durationSeconds: s.durationSeconds,
    effortRating: s.effortRating,
    difficultyRating: s.difficultyRating,
    confidenceRating: s.confidenceRating,
    notes: s.notes,
    resultPayload: s.resultPayload,
    writingDocumentId: s.writingDocumentId,
    exercise: {
      id: s.exercise.id,
      slug: s.exercise.slug,
      title: s.exercise.title,
      description: s.exercise.description,
      category: s.exercise.category as ExerciseCategory,
      difficulty: s.exercise.difficulty as ExerciseDifficulty,
      estimatedDuration: s.exercise.estimatedDuration,
      instructions: s.exercise.instructions,
      constraints: s.exercise.constraints,
      starterPrompt: s.exercise.starterPrompt,
      defaultBpm: s.exercise.defaultBpm,
      timeLimitSeconds: s.exercise.timeLimitSeconds,
      active: s.exercise.active,
      orderIndex: s.exercise.orderIndex,
      skills: s.exercise.skills.map((es) => ({
        id: es.skill.id,
        name: es.skill.name,
        slug: es.skill.slug,
        category: es.skill.category as SkillCategory,
        description: es.skill.description,
      })),
      createdAt: s.exercise.createdAt.toISOString(),
      updatedAt: s.exercise.updatedAt.toISOString(),
    },
    writingDocument: s.writingDocument
      ? {
          id: s.writingDocument.id,
          userId: s.writingDocument.userId,
          title: s.writingDocument.title,
          content: s.writingDocument.content,
          type: s.writingDocument.type as WritingType,
          status: s.writingDocument.status as WritingStatus,
          tags: s.writingDocument.tags,
          wordCount: s.writingDocument.wordCount,
          characterCount: s.writingDocument.characterCount,
          createdAt: s.writingDocument.createdAt.toISOString(),
          updatedAt: s.writingDocument.updatedAt.toISOString(),
        }
      : null,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  };
}

export async function createTrainingSession(data: {
  exerciseId: string;
  status?: TrainingSessionStatus;
  durationSeconds?: number;
  notes?: string;
  writingDocumentId?: string;
  resultPayload?: string;
}): Promise<TrainingSessionData> {
  const session = await prisma.trainingSession.create({
    data: {
      userId: DEFAULT_USER_ID,
      exerciseId: data.exerciseId,
      status: data.status || "IN_PROGRESS",
      startedAt: new Date(),
      durationSeconds: data.durationSeconds || 0,
      notes: data.notes?.trim() || null,
      writingDocumentId: data.writingDocumentId || null,
      resultPayload: data.resultPayload || null,
    },
    include: {
      exercise: {
        include: {
          skills: {
            include: { skill: true },
          },
        },
      },
    },
  });

  revalidatePath("/train");
  return {
    id: session.id,
    userId: session.userId,
    exerciseId: session.exerciseId,
    status: session.status as TrainingSessionStatus,
    startedAt: session.startedAt.toISOString(),
    endedAt: session.endedAt ? session.endedAt.toISOString() : null,
    durationSeconds: session.durationSeconds,
    effortRating: session.effortRating,
    difficultyRating: session.difficultyRating,
    confidenceRating: session.confidenceRating,
    notes: session.notes,
    resultPayload: session.resultPayload,
    writingDocumentId: session.writingDocumentId,
    exercise: {
      id: session.exercise.id,
      slug: session.exercise.slug,
      title: session.exercise.title,
      description: session.exercise.description,
      category: session.exercise.category as ExerciseCategory,
      difficulty: session.exercise.difficulty as ExerciseDifficulty,
      estimatedDuration: session.exercise.estimatedDuration,
      instructions: session.exercise.instructions,
      constraints: session.exercise.constraints,
      starterPrompt: session.exercise.starterPrompt,
      defaultBpm: session.exercise.defaultBpm,
      timeLimitSeconds: session.exercise.timeLimitSeconds,
      active: session.exercise.active,
      orderIndex: session.exercise.orderIndex,
      skills: session.exercise.skills.map((es) => ({
        id: es.skill.id,
        name: es.skill.name,
        slug: es.skill.slug,
        category: es.skill.category as SkillCategory,
        description: es.skill.description,
      })),
      createdAt: session.exercise.createdAt.toISOString(),
      updatedAt: session.exercise.updatedAt.toISOString(),
    },
    createdAt: session.createdAt.toISOString(),
    updatedAt: session.updatedAt.toISOString(),
  };
}

export async function completeTrainingSession(
  id: string,
  data: {
    durationSeconds: number;
    effortRating?: number;
    difficultyRating?: number;
    confidenceRating?: number;
    notes?: string;
    writingDocumentId?: string;
    resultPayload?: string;
  }
): Promise<{ success: boolean; session?: TrainingSessionData }> {
  const existing = await prisma.trainingSession.findFirst({
    where: { id, userId: DEFAULT_USER_ID },
    include: { exercise: true },
  });

  if (!existing) return { success: false };

  const durationMinutes = Math.max(1, Math.round(data.durationSeconds / 60));

  const updated = await prisma.trainingSession.update({
    where: { id },
    data: {
      status: "COMPLETED",
      endedAt: new Date(),
      durationSeconds: data.durationSeconds,
      effortRating: data.effortRating || null,
      difficultyRating: data.difficultyRating || null,
      confidenceRating: data.confidenceRating || null,
      notes: data.notes?.trim() || existing.notes,
      writingDocumentId: data.writingDocumentId || existing.writingDocumentId,
      resultPayload: data.resultPayload || existing.resultPayload,
    },
    include: {
      exercise: {
        include: {
          skills: {
            include: { skill: true },
          },
        },
      },
      writingDocument: true,
    },
  });

  // Automatically record a real CreativeActivity so daily streaks and dashboard time sync seamlessly!
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const activityType =
    existing.exercise.category === "WRITING" ? "WRITING" : "PRACTICE";

  await prisma.creativeActivity.create({
    data: {
      userId: DEFAULT_USER_ID,
      type: activityType,
      title: `Training: ${existing.exercise.title}`,
      description: data.notes?.trim() || `Completed ${durationMinutes} min ${existing.exercise.title}`,
      durationMinutes,
      date: todayStr,
      completed: true,
    },
  });

  revalidatePath("/train");
  revalidatePath("/train/history");
  revalidatePath("/");
  revalidatePath("/create");

  return {
    success: true,
    session: {
      id: updated.id,
      userId: updated.userId,
      exerciseId: updated.exerciseId,
      status: updated.status as TrainingSessionStatus,
      startedAt: updated.startedAt.toISOString(),
      endedAt: updated.endedAt ? updated.endedAt.toISOString() : null,
      durationSeconds: updated.durationSeconds,
      effortRating: updated.effortRating,
      difficultyRating: updated.difficultyRating,
      confidenceRating: updated.confidenceRating,
      notes: updated.notes,
      resultPayload: updated.resultPayload,
      writingDocumentId: updated.writingDocumentId,
      exercise: {
        id: updated.exercise.id,
        slug: updated.exercise.slug,
        title: updated.exercise.title,
        description: updated.exercise.description,
        category: updated.exercise.category as ExerciseCategory,
        difficulty: updated.exercise.difficulty as ExerciseDifficulty,
        estimatedDuration: updated.exercise.estimatedDuration,
        instructions: updated.exercise.instructions,
        constraints: updated.exercise.constraints,
        starterPrompt: updated.exercise.starterPrompt,
        defaultBpm: updated.exercise.defaultBpm,
        timeLimitSeconds: updated.exercise.timeLimitSeconds,
        active: updated.exercise.active,
        orderIndex: updated.exercise.orderIndex,
        skills: updated.exercise.skills.map((es) => ({
          id: es.skill.id,
          name: es.skill.name,
          slug: es.skill.slug,
          category: es.skill.category as SkillCategory,
          description: es.skill.description,
        })),
        createdAt: updated.exercise.createdAt.toISOString(),
        updatedAt: updated.exercise.updatedAt.toISOString(),
      },
      writingDocument: updated.writingDocument
        ? {
            id: updated.writingDocument.id,
            userId: updated.writingDocument.userId,
            title: updated.writingDocument.title,
            content: updated.writingDocument.content,
            type: updated.writingDocument.type as WritingType,
            status: updated.writingDocument.status as WritingStatus,
            tags: updated.writingDocument.tags,
            wordCount: updated.writingDocument.wordCount,
            characterCount: updated.writingDocument.characterCount,
            createdAt: updated.writingDocument.createdAt.toISOString(),
            updatedAt: updated.writingDocument.updatedAt.toISOString(),
          }
        : null,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    },
  };
}

export async function getTrainingStats(): Promise<TrainingStatsData> {
  const completedSessions = await prisma.trainingSession.findMany({
    where: { userId: DEFAULT_USER_ID, status: "COMPLETED" },
    include: {
      exercise: {
        include: { skills: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalSessionsCompleted = completedSessions.length;
  const totalPracticeMinutes = Math.round(
    completedSessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60
  );

  // Weekly Practice Minutes (Monday to Sunday)
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const weeklySessions = completedSessions.filter((s) => {
    const d = new Date(s.createdAt);
    return d >= weekStart && d <= weekEnd;
  });

  const weeklyPracticeMinutes = Math.round(
    weeklySessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60
  );

  // Unique Skills Trained
  const uniqueSkillIds = new Set<string>();
  completedSessions.forEach((s) => {
    s.exercise.skills.forEach((es) => uniqueSkillIds.add(es.skillId));
  });

  // Calculate Authentic Training Streak
  // Collect unique dates where at least one session was completed
  const sessionDatesSet = new Set(
    completedSessions.map((s) => format(new Date(s.createdAt), "yyyy-MM-dd"))
  );

  const todayStr = format(now, "yyyy-MM-dd");
  const yesterdayStr = format(subDays(now, 1), "yyyy-MM-dd");

  const streakActiveToday = sessionDatesSet.has(todayStr);

  let streakDays = 0;
  let checkDate = streakActiveToday ? now : subDays(now, 1);

  if (sessionDatesSet.has(todayStr) || sessionDatesSet.has(yesterdayStr)) {
    while (true) {
      const dateStr = format(checkDate, "yyyy-MM-dd");
      if (sessionDatesSet.has(dateStr)) {
        streakDays++;
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    }
  }

  return {
    streakDays,
    streakActiveToday,
    weeklyPracticeMinutes,
    totalSessionsCompleted,
    skillsTrainedCount: uniqueSkillIds.size,
    totalPracticeMinutes,
  };
}
