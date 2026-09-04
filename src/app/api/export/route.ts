import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const [user, profile, missions, activities, goals, captures] =
      await Promise.all([
        prisma.user.findFirst({ include: { profile: true } }),
        prisma.profile.findFirst(),
        prisma.dailyMission.findMany({ orderBy: { date: "desc" } }),
        prisma.creativeActivity.findMany({ orderBy: { date: "desc" } }),
        prisma.goal.findMany({ orderBy: { createdAt: "desc" } }),
        prisma.quickCapture.findMany({ orderBy: { createdAt: "desc" } }),
      ]);

    const exportData = {
      version: "1.0.0",
      exportedAt: new Date().toISOString(),
      user,
      profile,
      dailyMissions: missions,
      creativeActivities: activities,
      goals,
      quickCaptures: captures,
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
