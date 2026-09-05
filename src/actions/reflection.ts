"use server";

import { prisma } from "@/lib/db";
import {
  ActivityType,
  BottleneckCategory,
  BottleneckData,
  BreakthroughCategory,
  BreakthroughData,
  DailyReflectionData,
  MilestoneCategory,
  MilestoneData,
  ReflectionStatsData,
  SkillCategory,
  SongStatus,
  TodayActivityContext,
  WeeklyDiagnosticInsight,
  WeeklyReviewData,
} from "@/lib/types";
import { revalidatePath } from "next/cache";
import { getTodayDateString } from "@/lib/utils";
import { format, startOfWeek, endOfWeek } from "date-fns";

const DEFAULT_USER_ID = "prime-artist-user";

// ==========================================
// 1. Daily Reflection Actions
// ==========================================

export async function getDailyReflection(
  date?: string
): Promise<DailyReflectionData | null> {
  const targetDate = date || getTodayDateString();
  const ref = await prisma.dailyReflection.findUnique({
    where: {
      userId_date: {
        userId: DEFAULT_USER_ID,
        date: targetDate,
      },
    },
  });

  if (!ref) return null;

  return {
    id: ref.id,
    userId: ref.userId,
    date: ref.date,
    created: ref.created,
    finished: ref.finished,
    unfinished: ref.unfinished,
    practiced: ref.practiced,
    skillWorked: ref.skillWorked,
    difficulties: ref.difficulties,
    studied: ref.studied,
    learned: ref.learned,
    energy: ref.energy,
    drained: ref.drained,
    distractions: ref.distractions,
    clicked: ref.clicked,
    surprised: ref.surprised,
    continueItem: ref.continueItem,
    improveItem: ref.improveItem,
    tomorrowPriority: ref.tomorrowPriority,
    snapshotStats: ref.snapshotStats,
    createdAt: ref.createdAt.toISOString(),
    updatedAt: ref.updatedAt.toISOString(),
  };
}

export async function getDailyReflections(
  limit = 30
): Promise<DailyReflectionData[]> {
  const list = await prisma.dailyReflection.findMany({
    where: { userId: DEFAULT_USER_ID },
    orderBy: { date: "desc" },
    take: limit,
  });

  return list.map((ref) => ({
    id: ref.id,
    userId: ref.userId,
    date: ref.date,
    created: ref.created,
    finished: ref.finished,
    unfinished: ref.unfinished,
    practiced: ref.practiced,
    skillWorked: ref.skillWorked,
    difficulties: ref.difficulties,
    studied: ref.studied,
    learned: ref.learned,
    energy: ref.energy,
    drained: ref.drained,
    distractions: ref.distractions,
    clicked: ref.clicked,
    surprised: ref.surprised,
    continueItem: ref.continueItem,
    improveItem: ref.improveItem,
    tomorrowPriority: ref.tomorrowPriority,
    snapshotStats: ref.snapshotStats,
    createdAt: ref.createdAt.toISOString(),
    updatedAt: ref.updatedAt.toISOString(),
  }));
}

export async function saveDailyReflection(input: {
  date?: string;
  created?: string | null;
  finished?: string | null;
  unfinished?: string | null;
  practiced?: string | null;
  skillWorked?: string | null;
  difficulties?: string | null;
  studied?: string | null;
  learned?: string | null;
  energy?: string | null;
  drained?: string | null;
  distractions?: string | null;
  clicked?: string | null;
  surprised?: string | null;
  continueItem?: string | null;
  improveItem?: string | null;
  tomorrowPriority?: string | null;
  snapshotStats?: string | null;
}): Promise<DailyReflectionData> {
  const targetDate = input.date || getTodayDateString();

  const ref = await prisma.dailyReflection.upsert({
    where: {
      userId_date: {
        userId: DEFAULT_USER_ID,
        date: targetDate,
      },
    },
    update: {
      created: input.created?.trim() || null,
      finished: input.finished?.trim() || null,
      unfinished: input.unfinished?.trim() || null,
      practiced: input.practiced?.trim() || null,
      skillWorked: input.skillWorked?.trim() || null,
      difficulties: input.difficulties?.trim() || null,
      studied: input.studied?.trim() || null,
      learned: input.learned?.trim() || null,
      energy: input.energy?.trim() || null,
      drained: input.drained?.trim() || null,
      distractions: input.distractions?.trim() || null,
      clicked: input.clicked?.trim() || null,
      surprised: input.surprised?.trim() || null,
      continueItem: input.continueItem?.trim() || null,
      improveItem: input.improveItem?.trim() || null,
      tomorrowPriority: input.tomorrowPriority?.trim() || null,
      snapshotStats: input.snapshotStats || null,
    },
    create: {
      userId: DEFAULT_USER_ID,
      date: targetDate,
      created: input.created?.trim() || null,
      finished: input.finished?.trim() || null,
      unfinished: input.unfinished?.trim() || null,
      practiced: input.practiced?.trim() || null,
      skillWorked: input.skillWorked?.trim() || null,
      difficulties: input.difficulties?.trim() || null,
      studied: input.studied?.trim() || null,
      learned: input.learned?.trim() || null,
      energy: input.energy?.trim() || null,
      drained: input.drained?.trim() || null,
      distractions: input.distractions?.trim() || null,
      clicked: input.clicked?.trim() || null,
      surprised: input.surprised?.trim() || null,
      continueItem: input.continueItem?.trim() || null,
      improveItem: input.improveItem?.trim() || null,
      tomorrowPriority: input.tomorrowPriority?.trim() || null,
      snapshotStats: input.snapshotStats || null,
    },
  });

  // Auto-log activity
  const existingActivity = await prisma.creativeActivity.findFirst({
    where: {
      userId: DEFAULT_USER_ID,
      type: "REFLECTION",
      date: targetDate,
      title: `Daily Artist Reflection (${targetDate})`,
    },
  });

  if (!existingActivity) {
    await prisma.creativeActivity.create({
      data: {
        userId: DEFAULT_USER_ID,
        type: "REFLECTION",
        title: `Daily Artist Reflection (${targetDate})`,
        description: input.clicked || input.learned || input.tomorrowPriority || "Daily studio retrospective",
        durationMinutes: 15,
        date: targetDate,
        completed: true,
      },
    });
  }

  revalidatePath("/reflect");
  revalidatePath("/");
  return {
    id: ref.id,
    userId: ref.userId,
    date: ref.date,
    created: ref.created,
    finished: ref.finished,
    unfinished: ref.unfinished,
    practiced: ref.practiced,
    skillWorked: ref.skillWorked,
    difficulties: ref.difficulties,
    studied: ref.studied,
    learned: ref.learned,
    energy: ref.energy,
    drained: ref.drained,
    distractions: ref.distractions,
    clicked: ref.clicked,
    surprised: ref.surprised,
    continueItem: ref.continueItem,
    improveItem: ref.improveItem,
    tomorrowPriority: ref.tomorrowPriority,
    snapshotStats: ref.snapshotStats,
    createdAt: ref.createdAt.toISOString(),
    updatedAt: ref.updatedAt.toISOString(),
  };
}

export async function getTodayActivityContext(
  date?: string
): Promise<TodayActivityContext> {
  const targetDate = date || getTodayDateString();

  const [activities, trainingSessions, studySessions, writings, songs] =
    await Promise.all([
      prisma.creativeActivity.findMany({
        where: { userId: DEFAULT_USER_ID, date: targetDate },
        orderBy: { createdAt: "desc" },
      }),
      prisma.trainingSession.findMany({
        where: {
          userId: DEFAULT_USER_ID,
          startedAt: {
            gte: new Date(`${targetDate}T00:00:00.000Z`),
            lte: new Date(`${targetDate}T23:59:59.999Z`),
          },
        },
      }),
      prisma.studySession.findMany({
        where: {
          userId: DEFAULT_USER_ID,
          startedAt: {
            gte: new Date(`${targetDate}T00:00:00.000Z`),
            lte: new Date(`${targetDate}T23:59:59.999Z`),
          },
        },
      }),
      prisma.writingDocument.count({
        where: {
          userId: DEFAULT_USER_ID,
          updatedAt: {
            gte: new Date(`${targetDate}T00:00:00.000Z`),
            lte: new Date(`${targetDate}T23:59:59.999Z`),
          },
        },
      }),
      prisma.song.count({
        where: {
          userId: DEFAULT_USER_ID,
          updatedAt: {
            gte: new Date(`${targetDate}T00:00:00.000Z`),
            lte: new Date(`${targetDate}T23:59:59.999Z`),
          },
        },
      }),
    ]);

  const trainingSeconds = trainingSessions.reduce(
    (acc, s) => acc + s.durationSeconds,
    0
  );
  const totalMinutes = activities.reduce(
    (acc, a) => acc + a.durationMinutes,
    0
  );

  return {
    date: targetDate,
    writingDraftsCount: writings,
    trainingMinutes: Math.round(trainingSeconds / 60),
    exercisesCompletedCount: trainingSessions.length,
    studySessionsCount: studySessions.length,
    songsUpdatedCount: songs,
    totalCreativeMinutes: totalMinutes,
    activities: activities.map((a) => ({
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
  };
}

// ==========================================
// 2. Weekly Review Actions
// ==========================================

export async function getWeeklyReview(
  weekStart?: string
): Promise<WeeklyReviewData | null> {
  const currentWeekStart =
    weekStart || format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");

  const review = await prisma.weeklyReview.findUnique({
    where: {
      userId_weekStart: {
        userId: DEFAULT_USER_ID,
        weekStart: currentWeekStart,
      },
    },
  });

  if (!review) return null;

  return {
    id: review.id,
    userId: review.userId,
    weekStart: review.weekStart,
    weekEnd: review.weekEnd,
    outputNotes: review.outputNotes,
    learningNotes: review.learningNotes,
    weaknessesNotes: review.weaknessesNotes,
    momentumNotes: review.momentumNotes,
    breakthroughNotes: review.breakthroughNotes,
    nextFocus: review.nextFocus,
    statsSummary: review.statsSummary,
    createdAt: review.createdAt.toISOString(),
    updatedAt: review.updatedAt.toISOString(),
  };
}

export async function getWeeklyReviews(limit = 12): Promise<WeeklyReviewData[]> {
  const list = await prisma.weeklyReview.findMany({
    where: { userId: DEFAULT_USER_ID },
    orderBy: { weekStart: "desc" },
    take: limit,
  });

  return list.map((r) => ({
    id: r.id,
    userId: r.userId,
    weekStart: r.weekStart,
    weekEnd: r.weekEnd,
    outputNotes: r.outputNotes,
    learningNotes: r.learningNotes,
    weaknessesNotes: r.weaknessesNotes,
    momentumNotes: r.momentumNotes,
    breakthroughNotes: r.breakthroughNotes,
    nextFocus: r.nextFocus,
    statsSummary: r.statsSummary,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));
}

export async function saveWeeklyReview(input: {
  weekStart: string;
  weekEnd: string;
  outputNotes?: string | null;
  learningNotes?: string | null;
  weaknessesNotes?: string | null;
  momentumNotes?: string | null;
  breakthroughNotes?: string | null;
  nextFocus?: string | null;
  statsSummary?: string | null;
}): Promise<WeeklyReviewData> {
  const review = await prisma.weeklyReview.upsert({
    where: {
      userId_weekStart: {
        userId: DEFAULT_USER_ID,
        weekStart: input.weekStart,
      },
    },
    update: {
      weekEnd: input.weekEnd,
      outputNotes: input.outputNotes?.trim() || null,
      learningNotes: input.learningNotes?.trim() || null,
      weaknessesNotes: input.weaknessesNotes?.trim() || null,
      momentumNotes: input.momentumNotes?.trim() || null,
      breakthroughNotes: input.breakthroughNotes?.trim() || null,
      nextFocus: input.nextFocus?.trim() || null,
      statsSummary: input.statsSummary || null,
    },
    create: {
      userId: DEFAULT_USER_ID,
      weekStart: input.weekStart,
      weekEnd: input.weekEnd,
      outputNotes: input.outputNotes?.trim() || null,
      learningNotes: input.learningNotes?.trim() || null,
      weaknessesNotes: input.weaknessesNotes?.trim() || null,
      momentumNotes: input.momentumNotes?.trim() || null,
      breakthroughNotes: input.breakthroughNotes?.trim() || null,
      nextFocus: input.nextFocus?.trim() || null,
      statsSummary: input.statsSummary || null,
    },
  });

  // Auto-log activity
  const today = getTodayDateString();
  await prisma.creativeActivity.create({
    data: {
      userId: DEFAULT_USER_ID,
      type: "REFLECTION",
      title: `Weekly Creative Audit (${input.weekStart} – ${input.weekEnd})`,
      description: input.nextFocus || input.outputNotes || "Weekly retrospective review",
      durationMinutes: 30,
      date: today,
      completed: true,
    },
  });

  revalidatePath("/reflect");
  return {
    id: review.id,
    userId: review.userId,
    weekStart: review.weekStart,
    weekEnd: review.weekEnd,
    outputNotes: review.outputNotes,
    learningNotes: review.learningNotes,
    weaknessesNotes: review.weaknessesNotes,
    momentumNotes: review.momentumNotes,
    breakthroughNotes: review.breakthroughNotes,
    nextFocus: review.nextFocus,
    statsSummary: review.statsSummary,
    createdAt: review.createdAt.toISOString(),
    updatedAt: review.updatedAt.toISOString(),
  };
}

export async function generateWeeklyDiagnosticInsight(
  weekStart?: string
): Promise<WeeklyDiagnosticInsight> {
  const startDateStr =
    weekStart || format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
  const endDateStr = format(
    endOfWeek(new Date(startDateStr), { weekStartsOn: 1 }),
    "yyyy-MM-dd"
  );

  const startUtc = new Date(`${startDateStr}T00:00:00.000Z`);
  const endUtc = new Date(`${endDateStr}T23:59:59.999Z`);

  const [
    trainingSessions,
    studySessions,
    writings,
    songsFinished,
    activeBottlenecks,
  ] = await Promise.all([
    prisma.trainingSession.findMany({
      where: {
        userId: DEFAULT_USER_ID,
        startedAt: { gte: startUtc, lte: endUtc },
      },
      include: { exercise: true },
    }),
    prisma.studySession.findMany({
      where: {
        userId: DEFAULT_USER_ID,
        startedAt: { gte: startUtc, lte: endUtc },
      },
    }),
    prisma.writingDocument.count({
      where: {
        userId: DEFAULT_USER_ID,
        createdAt: { gte: startUtc, lte: endUtc },
      },
    }),
    prisma.song.count({
      where: {
        userId: DEFAULT_USER_ID,
        status: "FINISHED",
        updatedAt: { gte: startUtc, lte: endUtc },
      },
    }),
    prisma.bottleneck.findMany({
      where: { userId: DEFAULT_USER_ID, resolved: false },
      orderBy: { severity: "desc" },
    }),
  ]);

  const totalMinutes = trainingSessions.reduce(
    (acc, s) => acc + Math.round(s.durationSeconds / 60),
    0
  );

  // Discipline category frequency
  const categoryFreq: Record<string, number> = {};
  trainingSessions.forEach((s) => {
    const cat = s.exercise.category;
    categoryFreq[cat] = (categoryFreq[cat] || 0) + 1;
  });

  const sortedCategories = Object.entries(categoryFreq).sort(
    (a, b) => b[1] - a[1]
  );
  const mostPracticed = sortedCategories[0]?.[0] || "RAP & FLOW";
  const leastPracticed =
    sortedCategories.length > 1
      ? sortedCategories[sortedCategories.length - 1][0]
      : "STORYTELLING";

  const topBottleneck = activeBottlenecks[0]
    ? `${activeBottlenecks[0].category}: ${activeBottlenecks[0].description}`
    : "No critical creative bottlenecks recorded.";

  return {
    weekStart: startDateStr,
    weekEnd: endDateStr,
    totalMinutesPracticed: totalMinutes,
    totalDrillsCompleted: trainingSessions.length,
    totalWritingsCreated: writings,
    totalReferencesStudied: studySessions.length,
    totalSongsFinished: songsFinished,
    mostPracticedCategory: mostPracticed,
    leastPracticedCategory: leastPracticed,
    recurringBottleneck: topBottleneck,
    strongestMomentum:
      writings > 0
        ? "Rapid Writing & Lyricism"
        : totalMinutes > 0
        ? "Gymnasium Training Cadence"
        : "Reference Listening & Study",
    suggestedFocus:
      activeBottlenecks.length > 0 && activeBottlenecks[0].category === "FINISHING"
        ? "Song Completion & 16-Bar Finalization"
        : "Storytelling & Complex Multi-syllabic Schemes",
    actionableRecommendation:
      "Schedule two 10-minute rapid 16-bar writing sprints and one 20-minute masterwork song dissection before drafting new hooks.",
  };
}

// ==========================================
// 3. Bottleneck Audit Actions
// ==========================================

export async function getBottlenecks(filter?: {
  category?: string;
  resolved?: boolean;
}): Promise<BottleneckData[]> {
  const whereClause: Record<string, unknown> = { userId: DEFAULT_USER_ID };

  if (filter?.category && filter.category !== "ALL") {
    whereClause.category = filter.category;
  }
  if (filter?.resolved !== undefined) {
    whereClause.resolved = filter.resolved;
  }

  const list = await prisma.bottleneck.findMany({
    where: whereClause,
    include: { skill: true },
    orderBy: [{ resolved: "asc" }, { severity: "desc" }, { date: "desc" }],
  });

  return list.map((b) => ({
    id: b.id,
    userId: b.userId,
    category: b.category as BottleneckCategory,
    description: b.description,
    severity: b.severity,
    date: b.date,
    attemptedSolution: b.attemptedSolution,
    result: b.result,
    resolved: b.resolved,
    resolvedAt: b.resolvedAt?.toISOString() || null,
    skillId: b.skillId,
    skill: b.skill
      ? {
          id: b.skill.id,
          name: b.skill.name,
          slug: b.skill.slug,
          category: b.skill.category as SkillCategory,
          description: b.skill.description,
        }
      : null,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
  }));
}

export async function createBottleneck(input: {
  category: BottleneckCategory;
  description: string;
  severity?: number;
  date?: string;
  attemptedSolution?: string | null;
  result?: string | null;
  resolved?: boolean;
  skillId?: string | null;
}): Promise<BottleneckData> {
  const b = await prisma.bottleneck.create({
    data: {
      userId: DEFAULT_USER_ID,
      category: input.category,
      description: input.description.trim(),
      severity: input.severity || 3,
      date: input.date || getTodayDateString(),
      attemptedSolution: input.attemptedSolution?.trim() || null,
      result: input.result?.trim() || null,
      resolved: !!input.resolved,
      skillId: input.skillId || null,
    },
    include: { skill: true },
  });

  revalidatePath("/reflect");
  return {
    id: b.id,
    userId: b.userId,
    category: b.category as BottleneckCategory,
    description: b.description,
    severity: b.severity,
    date: b.date,
    attemptedSolution: b.attemptedSolution,
    result: b.result,
    resolved: b.resolved,
    resolvedAt: b.resolvedAt ? b.resolvedAt.toISOString() : null,
    skillId: b.skillId,
    skill: b.skill
      ? {
          id: b.skill.id,
          name: b.skill.name,
          slug: b.skill.slug,
          category: b.skill.category as SkillCategory,
          description: b.skill.description,
        }
      : null,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
  };
}

export async function updateBottleneck(
  id: string,
  input: {
    category?: BottleneckCategory;
    description?: string;
    severity?: number;
    attemptedSolution?: string | null;
    result?: string | null;
    resolved?: boolean;
    skillId?: string | null;
  }
): Promise<BottleneckData> {
  const b = await prisma.bottleneck.update({
    where: { id, userId: DEFAULT_USER_ID },
    data: {
      ...(input.category !== undefined && { category: input.category }),
      ...(input.description !== undefined && { description: input.description.trim() }),
      ...(input.severity !== undefined && { severity: input.severity }),
      ...(input.attemptedSolution !== undefined && {
        attemptedSolution: input.attemptedSolution?.trim() || null,
      }),
      ...(input.result !== undefined && { result: input.result?.trim() || null }),
      ...(input.resolved !== undefined && {
        resolved: input.resolved,
        resolvedAt: input.resolved ? new Date() : null,
      }),
      ...(input.skillId !== undefined && { skillId: input.skillId || null }),
    },
    include: { skill: true },
  });

  revalidatePath("/reflect");
  return {
    id: b.id,
    userId: b.userId,
    category: b.category as BottleneckCategory,
    description: b.description,
    severity: b.severity,
    date: b.date,
    attemptedSolution: b.attemptedSolution,
    result: b.result,
    resolved: b.resolved,
    resolvedAt: b.resolvedAt?.toISOString() || null,
    skillId: b.skillId,
    skill: b.skill
      ? {
          id: b.skill.id,
          name: b.skill.name,
          slug: b.skill.slug,
          category: b.skill.category as SkillCategory,
          description: b.skill.description,
        }
      : null,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
  };
}

export async function resolveBottleneck(
  id: string,
  resultNotes?: string | null
): Promise<BottleneckData> {
  const b = await prisma.bottleneck.update({
    where: { id, userId: DEFAULT_USER_ID },
    data: {
      resolved: true,
      resolvedAt: new Date(),
      ...(resultNotes !== undefined && { result: resultNotes?.trim() || null }),
    },
    include: { skill: true },
  });

  revalidatePath("/reflect");
  return {
    id: b.id,
    userId: b.userId,
    category: b.category as BottleneckCategory,
    description: b.description,
    severity: b.severity,
    date: b.date,
    attemptedSolution: b.attemptedSolution,
    result: b.result,
    resolved: b.resolved,
    resolvedAt: b.resolvedAt ? b.resolvedAt.toISOString() : null,
    skillId: b.skillId,
    skill: b.skill
      ? {
          id: b.skill.id,
          name: b.skill.name,
          slug: b.skill.slug,
          category: b.skill.category as SkillCategory,
          description: b.skill.description,
        }
      : null,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
  };
}

export async function deleteBottleneck(id: string): Promise<boolean> {
  await prisma.bottleneck.delete({
    where: { id, userId: DEFAULT_USER_ID },
  });

  revalidatePath("/reflect");
  return true;
}

// ==========================================
// 4. Breakthrough Log Actions
// ==========================================

export async function getBreakthroughs(
  category?: BreakthroughCategory
): Promise<BreakthroughData[]> {
  const whereClause: { userId: string; category?: BreakthroughCategory } = {
    userId: DEFAULT_USER_ID,
  };
  if (category) {
    whereClause.category = category;
  }

  const list = await prisma.breakthrough.findMany({
    where: whereClause,
    include: {
      skill: true,
      song: true,
      trainingSession: true,
      studySession: true,
    },
    orderBy: { date: "desc" },
  });

  return list.map((b) => ({
    id: b.id,
    userId: b.userId,
    title: b.title,
    category: b.category as BreakthroughCategory,
    date: b.date,
    description: b.description,
    cause: b.cause,
    changeEffect: b.changeEffect,
    skillId: b.skillId,
    skill: b.skill
      ? {
          id: b.skill.id,
          name: b.skill.name,
          slug: b.skill.slug,
          category: b.skill.category as SkillCategory,
          description: b.skill.description,
        }
      : null,
    songId: b.songId,
    song: b.song
      ? {
          id: b.song.id,
          userId: b.song.userId,
          title: b.song.title,
          concept: b.song.concept,
          status: b.song.status as SongStatus,
          genre: b.song.genre,
          bpm: b.song.bpm,
          musicalKey: b.song.musicalKey,
          mood: b.song.mood,
          nextAction: b.song.nextAction,
          tags: b.song.tags,
          notes: b.song.notes,
          wordCount: b.song.wordCount,
          sections: [],
          createdAt: b.song.createdAt.toISOString(),
          updatedAt: b.song.updatedAt.toISOString(),
        }
      : null,
    trainingSessionId: b.trainingSessionId,
    studySessionId: b.studySessionId,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
  }));
}

export async function createBreakthrough(input: {
  title: string;
  category?: BreakthroughCategory;
  date?: string;
  description: string;
  cause?: string | null;
  changeEffect?: string | null;
  skillId?: string | null;
  songId?: string | null;
  trainingSessionId?: string | null;
  studySessionId?: string | null;
}): Promise<BreakthroughData> {
  const b = await prisma.breakthrough.create({
    data: {
      userId: DEFAULT_USER_ID,
      title: input.title.trim(),
      category: input.category || "FLOW",
      date: input.date || getTodayDateString(),
      description: input.description.trim(),
      cause: input.cause?.trim() || null,
      changeEffect: input.changeEffect?.trim() || null,
      skillId: input.skillId || null,
      songId: input.songId || null,
      trainingSessionId: input.trainingSessionId || null,
      studySessionId: input.studySessionId || null,
    },
    include: { skill: true, song: true },
  });

  revalidatePath("/reflect");
  return {
    id: b.id,
    userId: b.userId,
    title: b.title,
    category: b.category as BreakthroughCategory,
    date: b.date,
    description: b.description,
    cause: b.cause,
    changeEffect: b.changeEffect,
    skillId: b.skillId,
    songId: b.songId,
    trainingSessionId: b.trainingSessionId,
    studySessionId: b.studySessionId,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
  };
}

export async function deleteBreakthrough(id: string): Promise<boolean> {
  await prisma.breakthrough.delete({
    where: { id, userId: DEFAULT_USER_ID },
  });
  revalidatePath("/reflect");
  return true;
}

// ==========================================
// 5. Milestone Actions
// ==========================================

export async function getMilestones(): Promise<MilestoneData[]> {
  const list = await prisma.milestone.findMany({
    where: { userId: DEFAULT_USER_ID },
    orderBy: { date: "desc" },
  });

  return list.map((m) => ({
    id: m.id,
    userId: m.userId,
    title: m.title,
    date: m.date,
    category: m.category as MilestoneCategory,
    description: m.description,
    significance: m.significance,
    lessons: m.lessons,
    nextStep: m.nextStep,
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt.toISOString(),
  }));
}

export async function createMilestone(input: {
  title: string;
  date?: string;
  category?: MilestoneCategory;
  description: string;
  significance?: string | null;
  lessons?: string | null;
  nextStep?: string | null;
}): Promise<MilestoneData> {
  const m = await prisma.milestone.create({
    data: {
      userId: DEFAULT_USER_ID,
      title: input.title.trim(),
      date: input.date || getTodayDateString(),
      category: input.category || "CREATION",
      description: input.description.trim(),
      significance: input.significance?.trim() || null,
      lessons: input.lessons?.trim() || null,
      nextStep: input.nextStep?.trim() || null,
    },
  });

  revalidatePath("/reflect");
  return {
    id: m.id,
    userId: m.userId,
    title: m.title,
    date: m.date,
    category: m.category as MilestoneCategory,
    description: m.description,
    significance: m.significance,
    lessons: m.lessons,
    nextStep: m.nextStep,
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt.toISOString(),
  };
}

export async function deleteMilestone(id: string): Promise<boolean> {
  await prisma.milestone.delete({
    where: { id, userId: DEFAULT_USER_ID },
  });
  revalidatePath("/reflect");
  return true;
}

// ==========================================
// 6. Reflection Stats
// ==========================================

export async function getReflectionStats(): Promise<ReflectionStatsData> {
  const [
    dailyCount,
    weeklyCount,
    activeBottlenecks,
    resolvedBottlenecks,
    breakthroughsCount,
    milestonesCount,
  ] = await Promise.all([
    prisma.dailyReflection.count({ where: { userId: DEFAULT_USER_ID } }),
    prisma.weeklyReview.count({ where: { userId: DEFAULT_USER_ID } }),
    prisma.bottleneck.count({ where: { userId: DEFAULT_USER_ID, resolved: false } }),
    prisma.bottleneck.count({ where: { userId: DEFAULT_USER_ID, resolved: true } }),
    prisma.breakthrough.count({ where: { userId: DEFAULT_USER_ID } }),
    prisma.milestone.count({ where: { userId: DEFAULT_USER_ID } }),
  ]);

  return {
    totalDailyReflections: dailyCount,
    totalWeeklyReviews: weeklyCount,
    activeBottlenecksCount: activeBottlenecks,
    resolvedBottlenecksCount: resolvedBottlenecks,
    breakthroughsCount,
    milestonesCount,
  };
}
