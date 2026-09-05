"use server";

import { prisma } from "@/lib/db";
import {
  ArtistDNAData,
  PatternConfidenceLevel,
} from "@/lib/types";
import { revalidatePath } from "next/cache";
import { subDays, format } from "date-fns";

const DEFAULT_USER_ID = "prime-artist-user";

export async function getArtistDNA(): Promise<ArtistDNAData> {
  // 1. Get or create ArtistDNAProfile
  let profile = await prisma.artistDNAProfile.findUnique({
    where: { userId: DEFAULT_USER_ID },
  });

  if (!profile) {
    profile = await prisma.artistDNAProfile.create({
      data: {
        userId: DEFAULT_USER_ID,
      },
    });
  }

  // Parse JSON helper
  const parseJsonList = (val: string | null, defaultVal: string[]): string[] => {
    if (!val) return defaultVal;
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : defaultVal;
    } catch {
      return defaultVal;
    }
  };

  const creativeValues = parseJsonList(profile.creativeValues, [
    "Authenticity",
    "Technical Skill",
    "Storytelling",
    "Emotional Honesty",
    "Originality",
    "Craftsmanship",
  ]);
  const favoriteGenres = parseJsonList(profile.favoriteGenres, [
    "Hip-Hop",
    "Boom Bap",
    "Jazz Rap",
    "Alternative R&B",
  ]);
  const favoriteArtists = parseJsonList(profile.favoriteArtists, [
    "Kendrick Lamar",
    "André 3000",
    "MF DOOM",
    "Black Thought",
    "Nas",
  ]);
  const favoriteProducers = parseJsonList(profile.favoriteProducers, [
    "J Dilla",
    "Madlib",
    "The Alchemist",
    "RZA",
  ]);
  const favoriteStyles = parseJsonList(profile.favoriteStyles, [
    "Multi-syllabic rhyming",
    "Off-beat syncopation",
    "Storytelling",
  ]);
  const favoriteThemes = parseJsonList(profile.favoriteThemes, [
    "Self-mastery",
    "Personal evolution",
    "Creative discipline",
  ]);
  const userStrengths = parseJsonList(profile.userStrengths, [
    "Flow variability",
    "Internal rhymes",
    "Conceptual songwriting",
  ]);
  const userWeaknesses = parseJsonList(profile.userWeaknesses, [
    "Hook simplicity",
    "Vocal projection",
  ]);

  // 2. Load History Data for Deterministic Pattern Derivation
  const [
    trainingSessions,
    studySessions,
    writings,
    songs,
    projects,
    reflections,
    weeklyReviews,
    breakthroughs,
    bottlenecks,
    milestones,
    skills,
    artists,
  ] = await Promise.all([
    prisma.trainingSession.findMany({
      where: { userId: DEFAULT_USER_ID, status: "COMPLETED" },
      include: { exercise: { include: { skills: { include: { skill: true } } } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.studySession.findMany({
      where: { userId: DEFAULT_USER_ID },
      include: { reference: true, artist: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.writingDocument.findMany({
      where: { userId: DEFAULT_USER_ID },
      orderBy: { createdAt: "desc" },
    }),
    prisma.song.findMany({
      where: { userId: DEFAULT_USER_ID },
      include: { sections: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.creativeProject.findMany({
      where: { userId: DEFAULT_USER_ID },
      orderBy: { createdAt: "desc" },
    }),
    prisma.dailyReflection.findMany({
      where: { userId: DEFAULT_USER_ID },
      orderBy: { date: "desc" },
    }),
    prisma.weeklyReview.findMany({
      where: { userId: DEFAULT_USER_ID },
      orderBy: { weekStart: "desc" },
    }),
    prisma.breakthrough.findMany({
      where: { userId: DEFAULT_USER_ID },
      orderBy: { date: "desc" },
    }),
    prisma.bottleneck.findMany({
      where: { userId: DEFAULT_USER_ID },
      orderBy: { date: "desc" },
    }),
    prisma.milestone.findMany({
      where: { userId: DEFAULT_USER_ID },
      orderBy: { date: "desc" },
    }),
    prisma.skill.findMany(),
    prisma.artist.findMany({ where: { userId: DEFAULT_USER_ID } }),
  ]);

  // Total data points across all systems
  const totalDataPoints =
    trainingSessions.length +
    studySessions.length +
    writings.length +
    songs.length +
    reflections.length;

  const getConfidenceLevel = (count: number): PatternConfidenceLevel => {
    if (count < 3 || totalDataPoints < 5) return "INSUFFICIENT_DATA";
    if (count >= 3 && count < 8) return "EMERGING_PATTERN";
    if (count >= 8 && count < 20) return "RECURRING_PATTERN";
    return "STRONG_PATTERN";
  };

  // 3. Observed Patterns Derivation
  // A. Strengths
  const observedStrengths: Array<{
    title: string;
    evidence: string;
    confidence: PatternConfidenceLevel;
  }> = [];

  const flowSessions = trainingSessions.filter(
    (t) => t.exercise.category === "FLOW" || t.exercise.category === "RAP"
  );
  if (flowSessions.length >= 2) {
    const avgFlowConf =
      flowSessions
        .filter((s) => s.confidenceRating !== null)
        .reduce((sum, s) => sum + (s.confidenceRating || 0), 0) /
      Math.max(1, flowSessions.filter((s) => s.confidenceRating !== null).length);

    observedStrengths.push({
      title: "Flow Dynamics & Cadence Execution",
      evidence: `${flowSessions.length} completed drills with an average self-reported confidence of ${(
        avgFlowConf || 4.2
      ).toFixed(1)}/5.`,
      confidence: getConfidenceLevel(flowSessions.length),
    });
  }

  const writingOutputs = writings.filter((w) => w.wordCount > 100);
  if (writingOutputs.length >= 2) {
    const totalWords = writings.reduce((sum, w) => sum + w.wordCount, 0);
    observedStrengths.push({
      title: "Lyrical Volume & Rapid Free-Writing",
      evidence: `${writings.length} writing studio drafts totaling ${totalWords} words recorded.`,
      confidence: getConfidenceLevel(writings.length),
    });
  }

  if (observedStrengths.length === 0) {
    observedStrengths.push({
      title: "Early Creative Exploration",
      evidence: "Log more training sessions and writing drafts to reveal high-confidence strength signals.",
      confidence: "INSUFFICIENT_DATA",
    });
  }

  // B. Emerging Skills
  const observedEmerging: Array<{
    title: string;
    evidence: string;
    confidence: PatternConfidenceLevel;
  }> = [];

  const rhymeSessions = trainingSessions.filter(
    (t) => t.exercise.category === "RHYME" || t.exercise.category === "VOCABULARY"
  );
  if (rhymeSessions.length > 0) {
    observedEmerging.push({
      title: "Multi-Syllabic Rhyme Schemes & Vocabulary",
      evidence: `${rhymeSessions.length} completed drills in Rhyme and Vocabulary gyms.`,
      confidence: getConfidenceLevel(rhymeSessions.length),
    });
  }

  const albumStudiesCount = studySessions.filter(
    (s) => s.focus === "ARRANGEMENT" || s.focus === "CONCEPT"
  ).length;
  if (albumStudiesCount > 0) {
    observedEmerging.push({
      title: "Concept-Driven Song Architecture",
      evidence: `${albumStudiesCount} deep dissections focusing on overarching track concepts.`,
      confidence: getConfidenceLevel(albumStudiesCount),
    });
  }

  if (observedEmerging.length === 0) {
    observedEmerging.push({
      title: "Targeted Skill Development",
      evidence: "Continue practicing new drill categories in the Training Gymnasium.",
      confidence: "INSUFFICIENT_DATA",
    });
  }

  // C. Undertrained Areas
  const observedUndertrained: Array<{
    title: string;
    evidence: string;
    confidence: PatternConfidenceLevel;
  }> = [];

  const storySessions = trainingSessions.filter(
    (t) => t.exercise.category === "STORYTELLING"
  );
  if (storySessions.length <= 1) {
    observedUndertrained.push({
      title: "Narrative & Perspective Storytelling",
      evidence: `${storySessions.length} practice drills logged across your entire history.`,
      confidence: storySessions.length === 0 ? "RECURRING_PATTERN" : "EMERGING_PATTERN",
    });
  }

  const productionDrills = trainingSessions.filter(
    (t) => t.exercise.category === "PRODUCTION" || t.exercise.category === "EAR_TRAINING"
  );
  const productionStudies = studySessions.filter(
    (s) => s.focus === "PRODUCTION" || s.focus === "SAMPLING"
  );
  if (productionStudies.length > productionDrills.length) {
    observedUndertrained.push({
      title: "Active Beat Production Execution",
      evidence: `${productionStudies.length} production dissections vs only ${productionDrills.length} deliberate ear/production drills.`,
      confidence: getConfidenceLevel(productionStudies.length),
    });
  }

  // D. Creative Tendencies
  const observedTendencies: Array<{
    title: string;
    evidence: string;
    confidence: PatternConfidenceLevel;
  }> = [];

  const finishedSongsCount = songs.filter((s) => s.status === "FINISHED").length;
  const activeSongsCount = songs.filter(
    (s) => s.status !== "FINISHED" && s.status !== "ARCHIVED"
  ).length;

  if (activeSongsCount >= 3) {
    observedTendencies.push({
      title: "Idea Proliferation Over Finishing",
      evidence: `You currently maintain ${activeSongsCount} active song projects with ${finishedSongsCount} completed songs.`,
      confidence: getConfidenceLevel(songs.length),
    });
  }

  if (writings.length > songs.length) {
    observedTendencies.push({
      title: "Free-Flow Verse Draft Preference",
      evidence: `You tend to write standalone verse/hook drafts (${writings.length} drafts) before formalizing them into structured song entities.`,
      confidence: getConfidenceLevel(writings.length),
    });
  }

  // E. Study Patterns
  const observedStudyPatterns: Array<{
    title: string;
    evidence: string;
    confidence: PatternConfidenceLevel;
  }> = [];

  const topStudiedArtist = artists.find((a) => a.favorite) || artists[0];
  if (topStudiedArtist) {
    observedStudyPatterns.push({
      title: `Lyrical Lineage: ${topStudiedArtist.name}`,
      evidence: `${topStudiedArtist.name} is prioritized as a core reference anchor in your Discovery Lineage.`,
      confidence: "STRONG_PATTERN",
    });
  }

  if (studySessions.length >= 3) {
    observedStudyPatterns.push({
      title: "Anatomical Dissection Methodology",
      evidence: `${studySessions.length} tracks dissected with timestamped observations and flow analysis.`,
      confidence: getConfidenceLevel(studySessions.length),
    });
  }

  // 4. Dimensions Breakdown
  // Creator
  const totalCreations = writings.length + songs.length;
  const writingPct =
    totalCreations > 0 ? Math.round((writings.length / totalCreations) * 100) : 60;
  const songsPct = totalCreations > 0 ? 100 - writingPct : 40;
  const creator = {
    topFormat: writings.length >= songs.length ? "Lyrical Verses & Drafts" : "Structured Songs",
    distribution: { writingPct, songsPct, productionPct: 0 },
    summary: `Primary creative energy directed towards ${
      writings.length >= songs.length ? "verse writing and rhyme craft" : "multi-section song development"
    }.`,
  };

  // Student
  const student = {
    topFocus: "Flow Dynamics & Cadence",
    studiedArtistsCount: artists.length,
    totalStudies: studySessions.length,
    summary: `${studySessions.length} total study sessions investigating ${artists.length} influential artist references.`,
  };

  // Practitioner
  const totalPracticeMins = Math.round(
    trainingSessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60
  );
  const practitioner = {
    topSkill: "Flow Switching & Cadence Control",
    totalPracticeHours: Number((totalPracticeMins / 60).toFixed(1)),
    avgEffort: 4.1,
    summary: `${trainingSessions.length} deliberate drills completed across ${Number(
      (totalPracticeMins / 60).toFixed(1)
    )} practice hours.`,
  };

  // Finisher
  const finishRatio =
    songs.length > 0 ? Math.round((finishedSongsCount / songs.length) * 100) : 0;
  const finisher = {
    finishRatio,
    activePipelineCount: activeSongsCount,
    summary: `${finishRatio}% completion ratio with ${activeSongsCount} active tracks currently moving through the pipeline.`,
  };

  // Explorer
  const explorer = {
    genreDiversity: favoriteGenres.length,
    skillBreadth: skills.length,
    summary: `Active exploration across ${favoriteGenres.length} musical genres and ${skills.length} technical rap & writing skills.`,
  };

  // Reflector
  const totalReviews = reflections.length + weeklyReviews.length;
  const reflector = {
    reviewConsistencyPct: Math.min(100, Math.round((reflections.length / 30) * 100)),
    totalReviews,
    summary: `${totalReviews} total reflection logs maintaining studio self-awareness and accountability.`,
  };

  // 5. Before vs Now (90 days comparison)
  const now = new Date();
  const past90 = subDays(now, 90);
  const past180 = subDays(now, 180);

  const recentTrainings = trainingSessions.filter(
    (t) => t.createdAt >= past90 && t.createdAt <= now
  );
  const priorTrainings = trainingSessions.filter(
    (t) => t.createdAt >= past180 && t.createdAt < past90
  );

  const recentPracticeHours = Number(
    (
      recentTrainings.reduce((sum, s) => sum + s.durationSeconds, 0) /
      3600
    ).toFixed(1)
  );
  const priorPracticeHours = Number(
    (
      priorTrainings.reduce((sum, s) => sum + s.durationSeconds, 0) /
      3600
    ).toFixed(1)
  );

  const recentFinishedSongs = songs.filter(
    (s) => s.status === "FINISHED" && s.updatedAt >= past90
  ).length;
  const priorFinishedSongs = songs.filter(
    (s) =>
      s.status === "FINISHED" &&
      s.updatedAt >= past180 &&
      s.updatedAt < past90
  ).length;

  const recentWritings = writings.filter((w) => w.createdAt >= past90).length;
  const priorWritings = writings.filter(
    (w) => w.createdAt >= past180 && w.createdAt < past90
  ).length;

  const recentStudies = studySessions.filter((s) => s.createdAt >= past90).length;
  const priorStudies = studySessions.filter(
    (s) => s.createdAt >= past180 && s.createdAt < past90
  ).length;

  const beforeVsNow = {
    periodA: {
      label: "Prior 90 Days",
      practiceHours: priorPracticeHours,
      finishedSongs: priorFinishedSongs,
      writingCount: priorWritings,
      studyCount: priorStudies,
    },
    periodB: {
      label: "Last 90 Days",
      practiceHours: recentPracticeHours,
      finishedSongs: recentFinishedSongs,
      writingCount: recentWritings,
      studyCount: recentStudies,
    },
    summary:
      recentPracticeHours >= priorPracticeHours
        ? "Practice hours and creative consistency expanded significantly over the latest 90-day cycle."
        : "Creative focus shifted towards deep listening and conceptual writing development.",
  };

  // 6. Unified Artist Evolution Timeline
  const evolutionEvents: Array<{
    id: string;
    date: string;
    type:
      | "MILESTONE"
      | "BREAKTHROUGH"
      | "SONG_FINISHED"
      | "PROJECT_COMPLETED"
      | "SKILL_ACHIEVEMENT"
      | "BOTTLENECK_RESOLVED";
    title: string;
    category: string;
    description: string;
    significance: string | null;
  }> = [];

  // Add Milestones
  for (const m of milestones) {
    evolutionEvents.push({
      id: `milestone-${m.id}`,
      date: m.date,
      type: "MILESTONE",
      title: m.title,
      category: m.category,
      description: m.description,
      significance: m.significance,
    });
  }

  // Add Breakthroughs
  for (const b of breakthroughs) {
    evolutionEvents.push({
      id: `breakthrough-${b.id}`,
      date: b.date,
      type: "BREAKTHROUGH",
      title: b.title,
      category: b.category,
      description: b.description,
      significance: b.changeEffect || "Artistic breakthrough documented in studio session.",
    });
  }

  // Add Finished Songs
  for (const s of songs.filter((song) => song.status === "FINISHED")) {
    evolutionEvents.push({
      id: `song-${s.id}`,
      date: format(s.updatedAt, "yyyy-MM-dd"),
      type: "SONG_FINISHED",
      title: `Finished Track: "${s.title}"`,
      category: "CREATIVE_OUTPUT",
      description: s.concept || `Completed ${s.genre || "Hip-Hop"} song arrangement and lyrics.`,
      significance: "Full song milestone completed and ready for catalog sequencing.",
    });
  }

  // Add Completed Projects
  for (const p of projects.filter((proj) => proj.status === "COMPLETED")) {
    evolutionEvents.push({
      id: `project-${p.id}`,
      date: format(p.updatedAt, "yyyy-MM-dd"),
      type: "PROJECT_COMPLETED",
      title: `Body of Work Completed: "${p.title}"`,
      category: "CATALOG",
      description: p.description || "Entire creative project finalized.",
      significance: "Major creative body of work shipped.",
    });
  }

  // Add Resolved Bottlenecks
  for (const bt of bottlenecks.filter((b) => b.resolved && b.resolvedAt)) {
    evolutionEvents.push({
      id: `bottleneck-${bt.id}`,
      date: format(bt.resolvedAt || new Date(), "yyyy-MM-dd"),
      type: "BOTTLENECK_RESOLVED",
      title: `Overcame Bottleneck: ${bt.category}`,
      category: "DISCIPLINE",
      description: bt.description,
      significance: bt.result || "Successfully eliminated creative friction point.",
    });
  }

  // Sort timeline chronologically (newest first)
  evolutionEvents.sort((a, b) => (a.date < b.date ? 1 : -1));

  return {
    id: profile.id,
    userId: profile.userId,
    identityStatement: profile.identityStatement,
    creativeValues,
    favoriteGenres,
    favoriteArtists,
    favoriteProducers,
    favoriteStyles,
    preferredBpmRange: profile.preferredBpmRange,
    favoriteThemes,
    creativeEnvironment: profile.creativeEnvironment,
    userStrengths,
    userWeaknesses,
    manualFocusOverride: profile.manualFocusOverride,
    notes: profile.notes,
    observedPatterns: {
      strengths: observedStrengths,
      emerging: observedEmerging,
      undertrained: observedUndertrained,
      tendencies: observedTendencies,
      studyPatterns: observedStudyPatterns,
    },
    dimensions: {
      creator,
      student,
      practitioner,
      finisher,
      explorer,
      reflector,
    },
    beforeVsNow,
    evolutionTimeline: evolutionEvents,
  };
}

export async function updateArtistDNA(data: {
  identityStatement?: string;
  creativeValues?: string[];
  favoriteGenres?: string[];
  favoriteArtists?: string[];
  favoriteProducers?: string[];
  favoriteStyles?: string[];
  preferredBpmRange?: string;
  favoriteThemes?: string[];
  creativeEnvironment?: string;
  userStrengths?: string[];
  userWeaknesses?: string[];
  manualFocusOverride?: string | null;
  notes?: string | null;
}): Promise<void> {
  const updatePayload: Record<string, unknown> = {};

  if (data.identityStatement !== undefined) {
    updatePayload.identityStatement = data.identityStatement;
  }
  if (data.creativeValues !== undefined) {
    updatePayload.creativeValues = JSON.stringify(data.creativeValues);
  }
  if (data.favoriteGenres !== undefined) {
    updatePayload.favoriteGenres = JSON.stringify(data.favoriteGenres);
  }
  if (data.favoriteArtists !== undefined) {
    updatePayload.favoriteArtists = JSON.stringify(data.favoriteArtists);
  }
  if (data.favoriteProducers !== undefined) {
    updatePayload.favoriteProducers = JSON.stringify(data.favoriteProducers);
  }
  if (data.favoriteStyles !== undefined) {
    updatePayload.favoriteStyles = JSON.stringify(data.favoriteStyles);
  }
  if (data.preferredBpmRange !== undefined) {
    updatePayload.preferredBpmRange = data.preferredBpmRange;
  }
  if (data.favoriteThemes !== undefined) {
    updatePayload.favoriteThemes = JSON.stringify(data.favoriteThemes);
  }
  if (data.creativeEnvironment !== undefined) {
    updatePayload.creativeEnvironment = data.creativeEnvironment;
  }
  if (data.userStrengths !== undefined) {
    updatePayload.userStrengths = JSON.stringify(data.userStrengths);
  }
  if (data.userWeaknesses !== undefined) {
    updatePayload.userWeaknesses = JSON.stringify(data.userWeaknesses);
  }
  if (data.manualFocusOverride !== undefined) {
    updatePayload.manualFocusOverride = data.manualFocusOverride;
  }
  if (data.notes !== undefined) {
    updatePayload.notes = data.notes;
  }

  await prisma.artistDNAProfile.upsert({
    where: { userId: DEFAULT_USER_ID },
    create: {
      userId: DEFAULT_USER_ID,
      ...updatePayload,
    },
    update: updatePayload,
  });

  revalidatePath("/progress");
  revalidatePath("/progress/artist-dna");
  revalidatePath("/");
}
