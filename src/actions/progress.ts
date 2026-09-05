"use server";

import { prisma } from "@/lib/db";
import {
  ArtistStatus,
  BottleneckCategory,
  BreakthroughCategory,
  CurrentArtistFocusData,
  ExerciseCategory,
  ExerciseDifficulty,
  FinishingHealthData,
  ProgressInsightItem,
  ProgressOverviewData,
  ReferenceType,
  SkillCategory,
  SkillDetailData,
  SkillMatrixItem,
  SkillTrendDirection,
  SongSectionType,
  SongStatus,
  StrengthSignal,
  StudyFocus,
  StudyPracticeGapItem,
  TimeRangePeriod,
  TIME_RANGE_CONFIGS,
  WeaknessSignal,
  WritingStatus,
  WritingType,
  CreativeOutputTimeSeriesPoint,
} from "@/lib/types";
import { getTodayDateString } from "@/lib/utils";
import { subDays, format, differenceInDays } from "date-fns";

const DEFAULT_USER_ID = "prime-artist-user";

// Helper: Calculate start date for time range
function getDateRange(period: TimeRangePeriod) {
  const config = TIME_RANGE_CONFIGS[period] || TIME_RANGE_CONFIGS["30D"];
  const now = new Date();
  if (!config.days) {
    return {
      currentStart: new Date(2020, 0, 1),
      currentEnd: now,
      previousStart: null,
      previousEnd: null,
      days: 365,
    };
  }

  const currentStart = subDays(now, config.days);
  const currentEnd = now;
  const previousStart = subDays(currentStart, config.days);
  const previousEnd = currentStart;

  return {
    currentStart,
    currentEnd,
    previousStart,
    previousEnd,
    days: config.days,
  };
}

// ==========================================
// 1. Progress Overview
// ==========================================

export async function getProgressOverview(
  period: TimeRangePeriod = "30D"
): Promise<ProgressOverviewData> {
  const { currentStart, currentEnd, previousStart, previousEnd, days } =
    getDateRange(period);

  const startStr = format(currentStart, "yyyy-MM-dd");
  const endStr = format(currentEnd, "yyyy-MM-dd");

  // 1. Training Sessions in period
  const [currentTrainings, prevTrainings] = await Promise.all([
    prisma.trainingSession.findMany({
      where: {
        userId: DEFAULT_USER_ID,
        status: "COMPLETED",
        createdAt: { gte: currentStart, lte: currentEnd },
      },
      select: { durationSeconds: true },
    }),
    previousStart && previousEnd
      ? prisma.trainingSession.findMany({
          where: {
            userId: DEFAULT_USER_ID,
            status: "COMPLETED",
            createdAt: { gte: previousStart, lte: previousEnd },
          },
          select: { durationSeconds: true },
        })
      : Promise.resolve([]),
  ]);

  const currentPracticeMinutes = Math.round(
    currentTrainings.reduce((sum, s) => sum + s.durationSeconds, 0) / 60
  );
  const prevPracticeMinutes = Math.round(
    prevTrainings.reduce((sum, s) => sum + s.durationSeconds, 0) / 60
  );
  const practiceMinutesDeltaPct =
    prevPracticeMinutes > 0
      ? Math.round(
          ((currentPracticeMinutes - prevPracticeMinutes) / prevPracticeMinutes) * 100
        )
      : null;

  // 2. Writing Documents & Word Output
  const [currentWritings, prevWritings] = await Promise.all([
    prisma.writingDocument.findMany({
      where: {
        userId: DEFAULT_USER_ID,
        createdAt: { gte: currentStart, lte: currentEnd },
      },
      select: { wordCount: true },
    }),
    previousStart && previousEnd
      ? prisma.writingDocument.findMany({
          where: {
            userId: DEFAULT_USER_ID,
            createdAt: { gte: previousStart, lte: previousEnd },
          },
          select: { wordCount: true },
        })
      : Promise.resolve([]),
  ]);

  const currentWordsWritten = currentWritings.reduce(
    (sum, w) => sum + w.wordCount,
    0
  );
  const prevWordsWritten = prevWritings.reduce((sum, w) => sum + w.wordCount, 0);
  const wordsWrittenDeltaPct =
    prevWordsWritten > 0
      ? Math.round(
          ((currentWordsWritten - prevWordsWritten) / prevWordsWritten) * 100
        )
      : null;

  // 3. Songs Started, Progressed, Finished
  const allSongs = await prisma.song.findMany({
    where: { userId: DEFAULT_USER_ID },
    select: { id: true, status: true, createdAt: true, updatedAt: true },
  });

  const songsStartedCount = allSongs.filter(
    (s) => s.createdAt >= currentStart && s.createdAt <= currentEnd
  ).length;

  const songsProgressedCount = allSongs.filter(
    (s) => s.updatedAt >= currentStart && s.updatedAt <= currentEnd
  ).length;

  const songsFinishedCount = allSongs.filter(
    (s) =>
      s.status === "FINISHED" &&
      s.updatedAt >= currentStart &&
      s.updatedAt <= currentEnd
  ).length;

  // 4. Studies Completed
  const [currentStudies, prevStudies] = await Promise.all([
    prisma.studySession.count({
      where: {
        userId: DEFAULT_USER_ID,
        createdAt: { gte: currentStart, lte: currentEnd },
      },
    }),
    previousStart && previousEnd
      ? prisma.studySession.count({
          where: {
            userId: DEFAULT_USER_ID,
            createdAt: { gte: previousStart, lte: previousEnd },
          },
        })
      : Promise.resolve(0),
  ]);

  const studiesDeltaPct =
    prevStudies > 0
      ? Math.round(((currentStudies - prevStudies) / prevStudies) * 100)
      : null;

  // 5. Reflections Completed (Daily + Weekly)
  const [dailyReflectionsCount, weeklyReviewsCount] = await Promise.all([
    prisma.dailyReflection.count({
      where: {
        userId: DEFAULT_USER_ID,
        date: { gte: startStr, lte: endStr },
      },
    }),
    prisma.weeklyReview.count({
      where: {
        userId: DEFAULT_USER_ID,
        weekStart: { gte: startStr, lte: endStr },
      },
    }),
  ]);
  const reflectionsCompletedCount = dailyReflectionsCount + weeklyReviewsCount;

  // 6. Active Creative Days
  const periodActivities = await prisma.creativeActivity.findMany({
    where: {
      userId: DEFAULT_USER_ID,
      date: { gte: startStr, lte: endStr },
    },
    select: { date: true },
  });
  const activeDaysSet = new Set(periodActivities.map((a) => a.date));
  const activeCreativeDays = activeDaysSet.size;

  // 7. Active Projects & Breakthroughs
  const [activeProjectsCount, breakthroughsCount] = await Promise.all([
    prisma.creativeProject.count({
      where: {
        userId: DEFAULT_USER_ID,
        status: { in: ["PLANNING", "IN_PROGRESS"] },
      },
    }),
    prisma.breakthrough.count({
      where: {
        userId: DEFAULT_USER_ID,
        createdAt: { gte: currentStart, lte: currentEnd },
      },
    }),
  ]);

  // 8. Streak calculation
  const allActivities = await prisma.creativeActivity.findMany({
    where: { userId: DEFAULT_USER_ID },
    select: { date: true },
  });
  const allActivityDates = new Set(allActivities.map((a) => a.date));
  const today = getTodayDateString();
  let streak = 0;
  let checkDate = new Date();
  if (!allActivityDates.has(today)) {
    checkDate = subDays(checkDate, 1);
  }
  while (true) {
    const dStr = format(checkDate, "yyyy-MM-dd");
    if (allActivityDates.has(dStr)) {
      streak++;
      checkDate = subDays(checkDate, 1);
    } else {
      break;
    }
  }

  // Momentum determination
  const activeRatio = activeCreativeDays / Math.max(1, days);
  let creativeMomentum: "HIGH" | "STEADY" | "REBUILDING" | "STARTING" = "STARTING";
  if (activeRatio >= 0.6 || streak >= 5) {
    creativeMomentum = "HIGH";
  } else if (activeRatio >= 0.3 || streak >= 2) {
    creativeMomentum = "STEADY";
  } else if (activeCreativeDays >= 1) {
    creativeMomentum = "REBUILDING";
  }

  return {
    period,
    practiceMinutes: currentPracticeMinutes,
    practiceMinutesDeltaPct,
    practiceSessionsCount: currentTrainings.length,
    wordsWritten: currentWordsWritten,
    wordsWrittenDeltaPct,
    writingSessionsCount: currentWritings.length,
    songsStartedCount,
    songsProgressedCount,
    songsFinishedCount,
    studiesCompletedCount: currentStudies,
    studiesDeltaPct,
    reflectionsCompletedCount,
    activeCreativeDays,
    totalPeriodDays: days,
    activeProjectsCount,
    breakthroughsCount,
    currentStreak: streak,
    creativeMomentum,
  };
}

// ==========================================
// 2. Creative Output Time-Series
// ==========================================

export async function getCreativeOutputAnalytics(
  period: TimeRangePeriod = "30D"
): Promise<CreativeOutputTimeSeriesPoint[]> {
  const { currentStart, currentEnd, days } = getDateRange(period);
  const startStr = format(currentStart, "yyyy-MM-dd");
  const endStr = format(currentEnd, "yyyy-MM-dd");

  const activities = await prisma.creativeActivity.findMany({
    where: {
      userId: DEFAULT_USER_ID,
      date: { gte: startStr, lte: endStr },
    },
    select: { date: true, type: true, durationMinutes: true },
    orderBy: { date: "asc" },
  });

  const numBuckets = Math.min(days, 30);
  const step = Math.max(1, Math.floor(days / numBuckets));
  const points: CreativeOutputTimeSeriesPoint[] = [];

  for (let i = days - 1; i >= 0; i -= step) {
    const targetDate = subDays(currentEnd, i);
    const dateStr = format(targetDate, "yyyy-MM-dd");
    const label = format(targetDate, days <= 14 ? "EEE, MMM d" : "MMM d");

    const bucketActivities = activities.filter((a) => {
      if (step === 1) return a.date === dateStr;
      const diff = Math.abs(differenceInDays(new Date(a.date), targetDate));
      return diff < step;
    });

    let writingMinutes = 0;
    let practiceMinutes = 0;
    let studyMinutes = 0;
    let reflectionMinutes = 0;

    for (const act of bucketActivities) {
      if (act.type === "WRITING") writingMinutes += act.durationMinutes;
      else if (act.type === "PRACTICE") practiceMinutes += act.durationMinutes;
      else if (act.type === "LISTENING" || act.type === "READING")
        studyMinutes += act.durationMinutes;
      else if (act.type === "REFLECTION")
        reflectionMinutes += act.durationMinutes;
    }

    points.push({
      date: dateStr,
      label,
      writingMinutes,
      practiceMinutes,
      studyMinutes,
      reflectionMinutes,
      totalMinutes:
        writingMinutes + practiceMinutes + studyMinutes + reflectionMinutes,
    });
  }

  return points;
}

// ==========================================
// 3. Finishing Health & Funnel
// ==========================================

export async function getFinishingHealth(): Promise<FinishingHealthData> {
  const songs = await prisma.song.findMany({
    where: { userId: DEFAULT_USER_ID },
    orderBy: { updatedAt: "desc" },
  });

  const totalCreated = songs.length;
  const finishedSongs = songs.filter((s) => s.status === "FINISHED");
  const totalFinished = finishedSongs.length;
  const archivedSongs = songs.filter((s) => s.status === "ARCHIVED");
  const totalArchived = archivedSongs.length;
  const activeSongs = songs.filter(
    (s) => s.status !== "FINISHED" && s.status !== "ARCHIVED"
  );
  const totalActive = activeSongs.length;

  const completionRatioPct =
    totalCreated > 0 ? Math.round((totalFinished / totalCreated) * 100) : 0;

  // Average days to finish
  let totalDaysToFinish = 0;
  let countWithDuration = 0;
  for (const s of finishedSongs) {
    const days = differenceInDays(s.updatedAt, s.createdAt);
    if (days >= 0) {
      totalDaysToFinish += days;
      countWithDuration++;
    }
  }
  const avgDaysToFinish =
    countWithDuration > 0
      ? Math.round(totalDaysToFinish / countWithDuration)
      : null;

  // Funnel distribution
  const STATUS_ORDER: { status: SongStatus; label: string }[] = [
    { status: "IDEA", label: "Idea" },
    { status: "CONCEPT", label: "Concept" },
    { status: "WRITING", label: "Writing" },
    { status: "DEMO", label: "Demo" },
    { status: "RECORDING", label: "Recording" },
    { status: "MIXING", label: "Mixing" },
    { status: "MASTERING", label: "Mastering" },
    { status: "FINISHED", label: "Finished" },
  ];

  const funnelDistribution = STATUS_ORDER.map(({ status, label }) => {
    const count = songs.filter((s) => s.status === status).length;
    const percentage =
      totalCreated > 0 ? Math.round((count / totalCreated) * 100) : 0;
    return { status, label, count, percentage };
  });

  // Stalled songs: active and updatedAt >= 14 days ago
  const now = new Date();
  const stalledSongs = activeSongs
    .map((s) => {
      const daysInactive = differenceInDays(now, s.updatedAt);
      return {
        id: s.id,
        title: s.title,
        status: s.status as SongStatus,
        daysInactive,
        genre: s.genre,
        nextAction: s.nextAction,
        updatedAt: s.updatedAt.toISOString(),
      };
    })
    .filter((s) => s.daysInactive >= 14)
    .sort((a, b) => b.daysInactive - a.daysInactive);

  return {
    totalCreated,
    totalFinished,
    totalActive,
    totalArchived,
    completionRatioPct,
    avgDaysToFinish,
    stalledSongsCount: stalledSongs.length,
    funnelDistribution,
    stalledSongs,
  };
}

// ==========================================
// 4. Skill Development Matrix
// ==========================================

export async function getSkillDevelopmentMatrix(
  period: TimeRangePeriod = "30D"
): Promise<SkillMatrixItem[]> {
  const { currentStart, currentEnd, previousStart, previousEnd } =
    getDateRange(period);

  const skills = await prisma.skill.findMany({
    include: {
      exercises: {
        include: {
          exercise: {
            include: {
              sessions: {
                where: { userId: DEFAULT_USER_ID, status: "COMPLETED" },
                orderBy: { createdAt: "desc" },
              },
            },
          },
        },
      },
      studySessions: {
        where: { userId: DEFAULT_USER_ID },
        select: { id: true },
      },
      breakthroughs: {
        where: { userId: DEFAULT_USER_ID },
        select: { id: true },
      },
    },
    orderBy: { name: "asc" },
  });

  const now = new Date();

  return skills.map((skill) => {
    const exerciseCount = skill.exercises.length;
    const allSessions = skill.exercises.flatMap((e) => e.exercise.sessions);

    // Current period sessions
    const currentSessions = allSessions.filter(
      (s) => s.createdAt >= currentStart && s.createdAt <= currentEnd
    );

    // Previous period sessions
    const prevSessions =
      previousStart && previousEnd
        ? allSessions.filter(
            (s) => s.createdAt >= previousStart && s.createdAt <= previousEnd
          )
        : [];

    const completedSessions = currentSessions.length;
    const totalPracticeMinutes = Math.round(
      currentSessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60
    );

    // Confidence & difficulty
    const ratedSessions = currentSessions.filter(
      (s) => s.confidenceRating !== null
    );
    const avgConfidence =
      ratedSessions.length > 0
        ? Number(
            (
              ratedSessions.reduce(
                (sum, s) => sum + (s.confidenceRating || 0),
                0
              ) / ratedSessions.length
            ).toFixed(1)
          )
        : null;

    const diffSessions = currentSessions.filter(
      (s) => s.difficultyRating !== null
    );
    const avgDifficulty =
      diffSessions.length > 0
        ? Number(
            (
              diffSessions.reduce(
                (sum, s) => sum + (s.difficultyRating || 0),
                0
              ) / diffSessions.length
            ).toFixed(1)
          )
        : null;

    // Practice Frequency Level
    let practiceFrequency: "High" | "Medium" | "Low" | "None" = "None";
    if (completedSessions >= 6) practiceFrequency = "High";
    else if (completedSessions >= 2) practiceFrequency = "Medium";
    else if (completedSessions >= 1) practiceFrequency = "Low";

    // Trend calculation
    let trend: SkillTrendDirection = "INACTIVE";
    if (completedSessions > 0 && prevSessions.length === 0) {
      trend = "NEW";
    } else if (completedSessions > prevSessions.length) {
      trend = "UP";
    } else if (completedSessions < prevSessions.length) {
      trend = "DOWN";
    } else if (completedSessions > 0) {
      trend = "STEADY";
    }

    // Last Practiced
    let lastPracticed: string | null = null;
    let isUndertrained = false;
    if (allSessions.length > 0) {
      const latest = allSessions.reduce((prev, curr) =>
        curr.createdAt > prev.createdAt ? curr : prev
      );
      const daysAgo = differenceInDays(now, latest.createdAt);
      if (daysAgo === 0) lastPracticed = "Today";
      else if (daysAgo === 1) lastPracticed = "Yesterday";
      else lastPracticed = `${daysAgo}d ago`;

      if (daysAgo > 14) isUndertrained = true;
    } else {
      isUndertrained = true;
      lastPracticed = "Never";
    }

    return {
      id: skill.id,
      name: skill.name,
      slug: skill.slug,
      category: skill.category as SkillCategory,
      description: skill.description,
      practiceFrequency,
      completedSessions,
      totalPracticeMinutes,
      avgConfidence,
      avgDifficulty,
      trend,
      lastPracticed,
      isUndertrained,
      exerciseCount,
      studyCount: skill.studySessions.length,
      breakthroughCount: skill.breakthroughs.length,
      creativeWorkCount: 0, // Computed in detail
    };
  });
}

// ==========================================
// 5. Skill Detail View
// ==========================================

export async function getSkillDetail(
  idOrSlug: string
): Promise<SkillDetailData | null> {
  const skill = await prisma.skill.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
    include: {
      exercises: {
        include: {
          exercise: {
            include: {
              skills: { include: { skill: true } },
              sessions: {
                where: { userId: DEFAULT_USER_ID, status: "COMPLETED" },
                orderBy: { createdAt: "desc" },
              },
            },
          },
        },
      },
      studySessions: {
        where: { userId: DEFAULT_USER_ID },
        include: { reference: true, artist: true },
        orderBy: { createdAt: "desc" },
      },
      breakthroughs: {
        where: { userId: DEFAULT_USER_ID },
        orderBy: { date: "desc" },
      },
      bottlenecks: {
        where: { userId: DEFAULT_USER_ID },
        orderBy: { date: "desc" },
      },
    },
  });

  if (!skill) return null;

  const exercises = skill.exercises.map((e) => e.exercise);
  const allSessions = exercises.flatMap((ex) =>
    ex.sessions.map((s) => ({ ...s, exerciseTitle: ex.title }))
  );
  allSessions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // History Points
  const historyPoints = allSessions.slice(0, 30).map((s) => ({
    date: format(s.createdAt, "yyyy-MM-dd"),
    sessionTitle: s.exerciseTitle,
    durationSeconds: s.durationSeconds,
    effortRating: s.effortRating,
    difficultyRating: s.difficultyRating,
    confidenceRating: s.confidenceRating,
  }));

  // Associated Songs and Writings
  const q = skill.name.toLowerCase();
  const [songs, writings, reflections] = await Promise.all([
    prisma.song.findMany({
      where: {
        userId: DEFAULT_USER_ID,
        OR: [
          { concept: { contains: q } },
          { tags: { contains: q } },
          { notes: { contains: q } },
        ],
      },
      include: { sections: true },
      take: 10,
    }),
    prisma.writingDocument.findMany({
      where: {
        userId: DEFAULT_USER_ID,
        OR: [
          { title: { contains: q } },
          { tags: { contains: q } },
          { content: { contains: q } },
        ],
      },
      take: 10,
    }),
    prisma.dailyReflection.findMany({
      where: {
        userId: DEFAULT_USER_ID,
        OR: [
          { skillWorked: { contains: q } },
          { difficulties: { contains: q } },
          { learned: { contains: q } },
        ],
      },
      orderBy: { date: "desc" },
      take: 5,
    }),
  ]);

  // Skill matrix item summary
  const totalMins = Math.round(
    allSessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60
  );
  const rated = allSessions.filter((s) => s.confidenceRating !== null);
  const avgConf =
    rated.length > 0
      ? Number(
          (
            rated.reduce((sum, s) => sum + (s.confidenceRating || 0), 0) /
            rated.length
          ).toFixed(1)
        )
      : null;

  const diffs = allSessions.filter((s) => s.difficultyRating !== null);
  const avgDiff =
    diffs.length > 0
      ? Number(
          (
            diffs.reduce((sum, s) => sum + (s.difficultyRating || 0), 0) /
            diffs.length
          ).toFixed(1)
        )
      : null;

  const matrixItem: SkillMatrixItem = {
    id: skill.id,
    name: skill.name,
    slug: skill.slug,
    category: skill.category as SkillCategory,
    description: skill.description,
    practiceFrequency:
      allSessions.length >= 6
        ? "High"
        : allSessions.length >= 2
        ? "Medium"
        : allSessions.length >= 1
        ? "Low"
        : "None",
    completedSessions: allSessions.length,
    totalPracticeMinutes: totalMins,
    avgConfidence: avgConf,
    avgDifficulty: avgDiff,
    trend: allSessions.length > 0 ? "UP" : "INACTIVE",
    lastPracticed:
      allSessions.length > 0
        ? format(allSessions[0].createdAt, "yyyy-MM-dd")
        : "Never",
    isUndertrained:
      allSessions.length === 0 ||
      differenceInDays(new Date(), allSessions[0].createdAt) > 14,
    exerciseCount: exercises.length,
    studyCount: skill.studySessions.length,
    breakthroughCount: skill.breakthroughs.length,
    creativeWorkCount: songs.length + writings.length,
  };

  return {
    skill: {
      id: skill.id,
      name: skill.name,
      slug: skill.slug,
      category: skill.category as SkillCategory,
      description: skill.description,
      exerciseCount: exercises.length,
    },
    matrix: matrixItem,
    historyPoints,
    associatedExercises: exercises.map((ex) => ({
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
      skills: ex.skills.map((s) => ({
        id: s.skill.id,
        name: s.skill.name,
        slug: s.skill.slug,
        category: s.skill.category as SkillCategory,
        description: s.skill.description,
        exerciseCount: 1,
      })),
      sessionCount: ex.sessions.length,
      lastPracticedAt: ex.sessions[0]?.createdAt?.toISOString() || null,
      createdAt: ex.createdAt.toISOString(),
      updatedAt: ex.updatedAt.toISOString(),
    })),
    associatedStudies: skill.studySessions.map((st) => ({
      id: st.id,
      userId: st.userId,
      referenceId: st.referenceId,
      artistId: st.artistId,
      focus: st.focus as StudyFocus,
      customFocus: st.customFocus,
      startedAt: st.startedAt.toISOString(),
      completedAt: st.completedAt ? st.completedAt.toISOString() : null,
      durationSeconds: st.durationSeconds,
      observations: st.observations,
      techniques: st.techniques,
      favoriteSection: st.favoriteSection,
      whyItWorks: st.whyItWorks,
      whatSurprisedMe: st.whatSurprisedMe,
      whatILearned: st.whatILearned,
      experimentIdea: st.experimentIdea,
      takeaway: st.takeaway,
      rating: st.rating,
      skillId: st.skillId,
      reference: st.reference
        ? {
            id: st.reference.id,
            userId: st.reference.userId,
            type: st.reference.type as ReferenceType,
            title: st.reference.title,
            creator: st.reference.creator,
            artistId: st.reference.artistId,
            year: st.reference.year,
            url: st.reference.url,
            album: st.reference.album,
            genre: st.reference.genre,
            notes: st.reference.notes,
            tags: st.reference.tags,
            favorite: st.reference.favorite,
            studySessionCount: 1,
            albumStudyCount: 0,
            listeningEntryCount: 0,
            createdAt: st.reference.createdAt.toISOString(),
            updatedAt: st.reference.updatedAt.toISOString(),
          }
        : null,
      artist: st.artist
        ? {
            id: st.artist.id,
            userId: st.artist.userId,
            name: st.artist.name,
            role: st.artist.role,
            notes: st.artist.notes,
            status: st.artist.status as ArtistStatus,
            genres: st.artist.genres,
            tags: st.artist.tags,
            favorite: st.artist.favorite,
            referenceCount: 0,
            studySessionCount: 1,
            createdAt: st.artist.createdAt.toISOString(),
            updatedAt: st.artist.updatedAt.toISOString(),
          }
        : null,
      createdAt: st.createdAt.toISOString(),
      updatedAt: st.updatedAt.toISOString(),
    })),
    associatedBreakthroughs: skill.breakthroughs.map((b) => ({
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
    })),
    associatedBottlenecks: skill.bottlenecks.map((bt) => ({
      id: bt.id,
      userId: bt.userId,
      category: bt.category as BottleneckCategory,
      description: bt.description,
      severity: bt.severity,
      date: bt.date,
      attemptedSolution: bt.attemptedSolution,
      result: bt.result,
      resolved: bt.resolved,
      resolvedAt: bt.resolvedAt ? bt.resolvedAt.toISOString() : null,
      skillId: bt.skillId,
      createdAt: bt.createdAt.toISOString(),
      updatedAt: bt.updatedAt.toISOString(),
    })),
    associatedSongs: songs.map((s) => ({
      id: s.id,
      userId: s.userId,
      title: s.title,
      concept: s.concept,
      status: s.status as SongStatus,
      genre: s.genre,
      bpm: s.bpm,
      musicalKey: s.musicalKey,
      mood: s.mood,
      nextAction: s.nextAction,
      tags: s.tags,
      notes: s.notes,
      wordCount: s.wordCount,
      sections: s.sections.map((sec) => ({
        id: sec.id,
        songId: sec.songId,
        type: sec.type as SongSectionType,
        name: sec.name,
        content: sec.content,
        orderIndex: sec.orderIndex,
        collapsed: sec.collapsed,
        wordCount: sec.wordCount,
        createdAt: sec.createdAt.toISOString(),
        updatedAt: sec.updatedAt.toISOString(),
      })),
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    })),
    associatedWritings: writings.map((w) => ({
      id: w.id,
      userId: w.userId,
      title: w.title,
      content: w.content,
      type: w.type as WritingType,
      status: w.status as WritingStatus,
      tags: w.tags,
      wordCount: w.wordCount,
      characterCount: w.characterCount,
      createdAt: w.createdAt.toISOString(),
      updatedAt: w.updatedAt.toISOString(),
    })),
    recentReflectionMentions: reflections.map((r) => ({
      date: r.date,
      skillWorked: r.skillWorked,
      difficulties: r.difficulties,
      learned: r.learned,
    })),
  };
}

// ==========================================
// 6. Strength & Weakness Signals
// ==========================================

export async function getStrengthAndWeaknessSignals(): Promise<{
  strengths: StrengthSignal[];
  weaknesses: WeaknessSignal[];
}> {
  const matrix = await getSkillDevelopmentMatrix("90D");
  const exercises = await prisma.exercise.findMany({
    where: { active: true },
    include: { skills: { include: { skill: true } } },
  });

  const strengths: StrengthSignal[] = [];
  const weaknesses: WeaknessSignal[] = [];

  for (const item of matrix) {
    const evidenceList: string[] = [];

    // Strength Check: High/Medium practice, confidence >= 3.8, breakthroughs > 0
    if (
      (item.practiceFrequency === "High" || item.practiceFrequency === "Medium") &&
      item.avgConfidence !== null &&
      item.avgConfidence >= 3.8
    ) {
      evidenceList.push(`${item.completedSessions} completed practice sessions`);
      evidenceList.push(`Average confidence: ${item.avgConfidence}/5`);
      if (item.breakthroughCount > 0) {
        evidenceList.push(`${item.breakthroughCount} recorded breakthroughs`);
      }
      if (item.totalPracticeMinutes > 0) {
        evidenceList.push(`${item.totalPracticeMinutes} minutes trained`);
      }

      strengths.push({
        skillName: item.name,
        skillId: item.id,
        summary: `${item.name} is a high-confidence, well-drilled area in your current creative process.`,
        evidence: evidenceList,
        category: item.category,
      });
    }

    // Weakness / Undertrained Check
    const relevantEx = exercises.find((ex) =>
      ex.skills.some((s) => s.skillId === item.id)
    );

    if (item.isUndertrained) {
      weaknesses.push({
        skillName: item.name,
        skillId: item.id,
        summary:
          item.lastPracticed === "Never"
            ? `${item.name} has no logged practice history in the training gym.`
            : `${item.name} has not been drilled in ${item.lastPracticed}.`,
        evidence: [
          item.lastPracticed === "Never"
            ? "0 completed sessions"
            : `Last practiced: ${item.lastPracticed}`,
          `Exercise catalog includes ${item.exerciseCount} drills`,
        ],
        category: item.category,
        type: "UNDERTRAINED",
        suggestedExerciseSlug: relevantEx?.slug || "cadence-drill",
        suggestedExerciseTitle: relevantEx?.title || "Cadence Switch Drill",
      });
    } else if (
      item.avgConfidence !== null &&
      item.avgConfidence <= 3.0 &&
      item.completedSessions >= 2
    ) {
      weaknesses.push({
        skillName: item.name,
        skillId: item.id,
        summary: `${item.name} shows lower reported confidence (${item.avgConfidence}/5) despite repeated attempts.`,
        evidence: [
          `Average confidence: ${item.avgConfidence}/5`,
          item.avgDifficulty
            ? `Average perceived difficulty: ${item.avgDifficulty}/5`
            : "High perceived friction",
          `${item.completedSessions} sessions drilled`,
        ],
        category: item.category,
        type: "CHALLENGE",
        suggestedExerciseSlug: relevantEx?.slug || "rhyme-density",
        suggestedExerciseTitle: relevantEx?.title || "Targeted Skill Workout",
      });
    }
  }

  return { strengths, weaknesses };
}

// ==========================================
// 7. Study -> Practice Gap Analysis
// ==========================================

export async function getStudyPracticeGap(): Promise<StudyPracticeGapItem[]> {
  const [studies, trainingSessions] = await Promise.all([
    prisma.studySession.findMany({
      where: { userId: DEFAULT_USER_ID },
      select: { focus: true },
    }),
    prisma.trainingSession.findMany({
      where: { userId: DEFAULT_USER_ID, status: "COMPLETED" },
      include: { exercise: { select: { category: true } } },
    }),
  ]);

  const CATEGORIES = [
    { key: "FLOW", label: "Flow & Cadence", exerciseCategory: "FLOW" },
    { key: "LYRICISM", label: "Lyricism & Wordplay", exerciseCategory: "WRITING" },
    { key: "RHYME", label: "Rhyme Density & Schemes", exerciseCategory: "RHYME" },
    { key: "STORYTELLING", label: "Storytelling & Narrative", exerciseCategory: "STORYTELLING" },
    { key: "PRODUCTION", label: "Music Production & Beats", exerciseCategory: "PRODUCTION" },
    { key: "DELIVERY", label: "Delivery & Performance", exerciseCategory: "RAP" },
  ];

  return CATEGORIES.map((cat) => {
    const studyCount = studies.filter(
      (s) =>
        s.focus === cat.key ||
        (s.focus === "FLOW" && cat.key === "FLOW") ||
        (s.focus === "WRITING" && cat.key === "LYRICISM")
    ).length;

    const practiceCount = trainingSessions.filter(
      (t) =>
        t.exercise.category === cat.exerciseCategory ||
        (cat.key === "FLOW" && t.exercise.category === "FLOW")
    ).length;

    const studyVolume: "HIGH" | "MEDIUM" | "LOW" | "NONE" =
      studyCount >= 5
        ? "HIGH"
        : studyCount >= 2
        ? "MEDIUM"
        : studyCount >= 1
        ? "LOW"
        : "NONE";

    const practiceVolume: "HIGH" | "MEDIUM" | "LOW" | "NONE" =
      practiceCount >= 6
        ? "HIGH"
        : practiceCount >= 2
        ? "MEDIUM"
        : practiceCount >= 1
        ? "LOW"
        : "NONE";

    let status: "BALANCED" | "STUDY_GAP" | "PRACTICE_GAP" | "DORMANT" = "DORMANT";
    let insight = `No significant study or practice logged for ${cat.label}.`;

    if (
      (studyVolume === "HIGH" || studyVolume === "MEDIUM") &&
      (practiceVolume === "HIGH" || practiceVolume === "MEDIUM")
    ) {
      status = "BALANCED";
      insight = `Strong alignment: You frequently dissect ${cat.label} in Discovery and actively reinforce it in Training.`;
    } else if (
      (studyVolume === "HIGH" || studyVolume === "MEDIUM") &&
      (practiceVolume === "LOW" || practiceVolume === "NONE")
    ) {
      status = "STUDY_GAP";
      insight = `${cat.label} is heavily analyzed in Study sessions (${studyCount} dissections) but underpracticed in the Gym (${practiceCount} drills).`;
    } else if (
      (practiceVolume === "HIGH" || practiceVolume === "MEDIUM") &&
      (studyVolume === "LOW" || studyVolume === "NONE")
    ) {
      status = "PRACTICE_GAP";
      insight = `High practice volume (${practiceCount} drills) with minimal external reference study. Consider dissecting masterworks.`;
    }

    return {
      focus: cat.label,
      studyVolume,
      practiceVolume,
      studyCount,
      practiceCount,
      status,
      insight,
      actionTargetCategory: cat.exerciseCategory,
    };
  });
}

// ==========================================
// 8. Progress Insights
// ==========================================

export async function getProgressInsights(
  period: TimeRangePeriod = "30D"
): Promise<ProgressInsightItem[]> {
  const [overview, finishing, gapAnalysis, signals] = await Promise.all([
    getProgressOverview(period),
    getFinishingHealth(),
    getStudyPracticeGap(),
    getStrengthAndWeaknessSignals(),
  ]);

  const insights: ProgressInsightItem[] = [];

  // 1. Positive Growth Insight
  if (overview.practiceMinutesDeltaPct !== null && overview.practiceMinutesDeltaPct > 15) {
    insights.push({
      id: "insight-practice-surge",
      type: "POSITIVE",
      title: "Practice Volume Expansion",
      observation: `Training volume increased by ${overview.practiceMinutesDeltaPct}% compared to the prior period.`,
      evidence: `${overview.practiceMinutes} minutes logged across ${overview.practiceSessionsCount} sessions.`,
      actionLabel: "View Training History",
      actionHref: "/train",
    });
  } else if (overview.wordsWrittenDeltaPct !== null && overview.wordsWrittenDeltaPct > 15) {
    insights.push({
      id: "insight-writing-surge",
      type: "POSITIVE",
      title: "Writing Output Expansion",
      observation: `Lyrical draft output increased by ${overview.wordsWrittenDeltaPct}% over the last period.`,
      evidence: `${overview.wordsWritten} words written across ${overview.writingSessionsCount} drafts.`,
      actionLabel: "Open Writing Studio",
      actionHref: "/create",
    });
  }

  // 2. Study -> Practice Gap Insight
  const topStudyGap = gapAnalysis.find((g) => g.status === "STUDY_GAP");
  if (topStudyGap) {
    insights.push({
      id: "insight-study-practice-gap",
      type: "GAP",
      title: `${topStudyGap.focus} Study-to-Practice Gap`,
      observation: `${topStudyGap.focus} is frequently studied but rarely converted into deliberate gym drills.`,
      evidence: `${topStudyGap.studyCount} studies vs ${topStudyGap.practiceCount} gym drills.`,
      actionLabel: "Start Practice Drill",
      actionHref: `/train?category=${topStudyGap.actionTargetCategory || "RAP"}`,
    });
  }

  // 3. Finishing Bottleneck Insight
  if (finishing.stalledSongsCount > 0) {
    insights.push({
      id: "insight-stalled-songs",
      type: "BOTTLENECK",
      title: "Creative Pipeline Friction",
      observation: `${finishing.stalledSongsCount} active song projects have had zero recorded edits in the last 14+ days.`,
      evidence: `Top stalled: "${finishing.stalledSongs[0].title}" (${finishing.stalledSongs[0].daysInactive} days inactive).`,
      actionLabel: "Resume Writing",
      actionHref: `/create/songs/${finishing.stalledSongs[0].id}`,
    });
  }

  // 4. Creative Consistency Insight
  if (overview.activeCreativeDays >= 12) {
    insights.push({
      id: "insight-creative-consistency",
      type: "CONSISTENCY",
      title: "Strong Studio Consistency",
      observation: `Creative activity logged on ${overview.activeCreativeDays} of the last ${overview.totalPeriodDays} days.`,
      evidence: `Current creative streak: ${overview.currentStreak} consecutive days.`,
      actionLabel: "Log Daily Reflection",
      actionHref: "/reflect",
    });
  }

  // 5. Undertrained Skill Insight
  const topUndertrained = signals.weaknesses.find(
    (w) => w.type === "UNDERTRAINED"
  );
  if (topUndertrained) {
    insights.push({
      id: `insight-undertrained-${topUndertrained.skillId}`,
      type: "NEGLECTED",
      title: `Undertrained Skill: ${topUndertrained.skillName}`,
      observation: `${topUndertrained.skillName} has had no practice logged in over 14 days.`,
      evidence: topUndertrained.evidence.join(" • "),
      actionLabel: `Train ${topUndertrained.skillName}`,
      actionHref: topUndertrained.suggestedExerciseSlug
        ? `/train/${topUndertrained.suggestedExerciseSlug}`
        : "/train",
    });
  }

  // 6. Breakthroughs Insight
  if (overview.breakthroughsCount > 0) {
    insights.push({
      id: "insight-breakthrough-momentum",
      type: "BREAKTHROUGH",
      title: "Recent Technical Breakthroughs",
      observation: `${overview.breakthroughsCount} creative epiphanies and technical unlocks logged in this window.`,
      evidence: "Documented in your Artist Reflection Vault.",
      actionLabel: "View Breakthrough Vault",
      actionHref: "/reflect?tab=breakthroughs",
    });
  }

  // Fallback insight if low data
  if (insights.length === 0) {
    insights.push({
      id: "insight-initial-baseline",
      type: "POSITIVE",
      title: "Establishing Creative Baseline",
      observation: "Continue logging daily writing, training drills, and study sessions to build high-confidence pattern analysis.",
      evidence: "PRIME requires ~10 sessions across disciplines for deep trend detection.",
      actionLabel: "Start Daily Mission",
      actionHref: "/",
    });
  }

  return insights;
}

// ==========================================
// 9. Current Artist Focus
// ==========================================

export async function getCurrentArtistFocus(): Promise<CurrentArtistFocusData> {
  // 1. Check for manual override in ArtistDNAProfile
  const dna = await prisma.artistDNAProfile.findUnique({
    where: { userId: DEFAULT_USER_ID },
  });

  if (dna?.manualFocusOverride && dna.manualFocusOverride.trim()) {
    return {
      title: dna.manualFocusOverride,
      source: "MANUAL_OVERRIDE",
      rationale: "Manually set by you as your primary artistic focus in Artist DNA.",
      supportingSkill: null,
      supportingSkillId: null,
      recommendedActionLabel: "Open Creative Workspace",
      recommendedActionHref: "/create",
    };
  }

  // 2. High severity unresolved bottleneck
  const bottleneck = await prisma.bottleneck.findFirst({
    where: { userId: DEFAULT_USER_ID, resolved: false, severity: { gte: 4 } },
    include: { skill: true },
    orderBy: { severity: "desc" },
  });

  if (bottleneck) {
    return {
      title: `Eliminate Bottleneck: ${bottleneck.category}`,
      source: "BOTTLENECK",
      rationale: bottleneck.description,
      supportingSkill: bottleneck.skill?.name || "Creative Execution",
      supportingSkillId: bottleneck.skillId,
      recommendedActionLabel: "Train to Resolve Weakness",
      recommendedActionHref: bottleneck.skill
        ? `/train?skillId=${bottleneck.skillId}`
        : "/train",
    };
  }

  // 3. Active Goal with nearest deadline
  const goal = await prisma.goal.findFirst({
    where: { userId: DEFAULT_USER_ID, status: "IN_PROGRESS" },
    orderBy: { targetDate: "asc" },
  });

  if (goal) {
    return {
      title: goal.title,
      source: "ACTIVE_GOAL",
      rationale: goal.description || "Active high-priority artist goal in progress.",
      supportingSkill: goal.category,
      supportingSkillId: null,
      recommendedActionLabel: "Progress This Goal",
      recommendedActionHref: "/create",
    };
  }

  // 4. Stalled songs check
  const finishing = await getFinishingHealth();
  if (finishing.stalledSongsCount > 0) {
    const song = finishing.stalledSongs[0];
    return {
      title: `Advance Stalled Track: "${song.title}"`,
      source: "PROJECT",
      rationale: `Song has been in ${song.status} status without edits for ${song.daysInactive} days.`,
      supportingSkill: "Songwriting & Arrangement",
      supportingSkillId: null,
      recommendedActionLabel: "Open Song in Studio",
      recommendedActionHref: `/create/songs/${song.id}`,
    };
  }

  // 5. Default Foundational Focus
  return {
    title: "Master Flow Dynamics & Complete First Body of Work",
    source: "DEFAULT",
    rationale: "Foundational artist development: Build lyrical density, cadence control, and catalog output.",
    supportingSkill: "Flow & Cadence",
    supportingSkillId: null,
    recommendedActionLabel: "Start Daily Gym Workout",
    recommendedActionHref: "/train",
  };
}
