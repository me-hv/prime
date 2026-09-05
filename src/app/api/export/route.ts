import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const [
      user,
      profile,
      missions,
      activities,
      goals,
      captures,
      writings,
      songs,
      sections,
      projects,
      projectSongs,
      skills,
      exercises,
      trainingSessions,
      rhymeChains,
      rhymeEntries,
      vocabularyEntries,
      artists,
      artistReferences,
      studySessions,
      albumStudies,
      listeningEntries,
      dailyReflections,
      weeklyReviews,
      bottlenecks,
      breakthroughs,
      milestones,
    ] = await Promise.all([
      prisma.user.findFirst({ include: { profile: true } }),
      prisma.profile.findFirst(),
      prisma.dailyMission.findMany({ orderBy: { date: "desc" } }),
      prisma.creativeActivity.findMany({ orderBy: { date: "desc" } }),
      prisma.goal.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.quickCapture.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.writingDocument.findMany({ orderBy: { updatedAt: "desc" } }),
      prisma.song.findMany({
        include: {
          sections: { orderBy: { orderIndex: "asc" } },
          projectSongs: true,
        },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.songSection.findMany({ orderBy: { orderIndex: "asc" } }),
      prisma.creativeProject.findMany({
        include: {
          projectSongs: {
            include: { song: true },
            orderBy: { trackNumber: "asc" },
          },
        },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.projectSong.findMany({ orderBy: { trackNumber: "asc" } }),
      prisma.skill.findMany({ orderBy: { name: "asc" } }),
      prisma.exercise.findMany({
        include: { skills: { include: { skill: true } } },
        orderBy: { orderIndex: "asc" },
      }),
      prisma.trainingSession.findMany({
        include: { exercise: true, writingDocument: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.rhymeChain.findMany({
        include: { entries: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.rhymeEntry.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.vocabularyEntry.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.artist.findMany({
        include: { references: true },
        orderBy: { name: "asc" },
      }),
      prisma.artistReference.findMany({
        include: { artist: true },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.studySession.findMany({
        include: { reference: true, artist: true, skill: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.albumStudy.findMany({
        include: { reference: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.listeningEntry.findMany({
        include: { reference: true },
        orderBy: { date: "desc" },
      }),
      prisma.dailyReflection.findMany({ orderBy: { date: "desc" } }),
      prisma.weeklyReview.findMany({ orderBy: { weekStart: "desc" } }),
      prisma.bottleneck.findMany({
        include: { skill: true },
        orderBy: [{ resolved: "asc" }, { severity: "desc" }],
      }),
      prisma.breakthrough.findMany({
        include: { skill: true, song: true, trainingSession: true, studySession: true },
        orderBy: { date: "desc" },
      }),
      prisma.milestone.findMany({ orderBy: { date: "desc" } }),
    ]);

    const exportData = {
      version: "4.0.0",
      exportedAt: new Date().toISOString(),
      user,
      profile,
      dailyMissions: missions,
      creativeActivities: activities,
      goals,
      quickCaptures: captures,
      writingDocuments: writings,
      songs,
      songSections: sections,
      creativeProjects: projects,
      projectSongs,
      skills,
      exercises,
      trainingSessions,
      rhymeChains,
      rhymeEntries,
      vocabularyEntries,
      artists,
      artistReferences,
      studySessions,
      albumStudies,
      listeningEntries,
      dailyReflections,
      weeklyReviews,
      bottlenecks,
      breakthroughs,
      milestones,
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="prime-artist-backup-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 });
  }
}
