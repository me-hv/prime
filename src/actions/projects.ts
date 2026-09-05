"use server";

import { prisma } from "@/lib/db";
import {
  CreativeProjectData,
  ProjectType,
  ProjectStatus,
  SongStatus,
  SongSectionType,
} from "@/lib/types";
import { revalidatePath } from "next/cache";

const DEFAULT_USER_ID = "prime-artist-user";

export async function getProjects(filter?: {
  status?: string;
}): Promise<CreativeProjectData[]> {
  const whereClause: Record<string, unknown> = { userId: DEFAULT_USER_ID };

  if (filter?.status && filter.status !== "ALL") {
    whereClause.status = filter.status;
  }

  const projects = await prisma.creativeProject.findMany({
    where: whereClause,
    include: {
      projectSongs: {
        include: {
          song: {
            include: {
              sections: true,
            },
          },
        },
        orderBy: { trackNumber: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return projects.map((p) => ({
    id: p.id,
    userId: p.userId,
    title: p.title,
    description: p.description,
    type: p.type as ProjectType,
    status: p.status as ProjectStatus,
    targetDate: p.targetDate,
    notes: p.notes,
    coverUrl: p.coverUrl,
    songs: p.projectSongs.map((ps) => ({
      id: ps.id,
      projectId: ps.projectId,
      songId: ps.songId,
      trackNumber: ps.trackNumber,
      notes: ps.notes,
      song: {
        id: ps.song.id,
        userId: ps.song.userId,
        title: ps.song.title,
        concept: ps.song.concept,
        status: ps.song.status as SongStatus,
        genre: ps.song.genre,
        bpm: ps.song.bpm,
        musicalKey: ps.song.musicalKey,
        mood: ps.song.mood,
        nextAction: ps.song.nextAction,
        tags: ps.song.tags,
        notes: ps.song.notes,
        wordCount: ps.song.wordCount,
        sections: ps.song.sections.map((sec) => ({
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
        createdAt: ps.song.createdAt.toISOString(),
        updatedAt: ps.song.updatedAt.toISOString(),
      },
      createdAt: ps.createdAt.toISOString(),
      updatedAt: ps.updatedAt.toISOString(),
    })),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));
}

export async function getProject(id: string): Promise<CreativeProjectData | null> {
  const p = await prisma.creativeProject.findFirst({
    where: { id, userId: DEFAULT_USER_ID },
    include: {
      projectSongs: {
        include: {
          song: {
            include: {
              sections: {
                orderBy: { orderIndex: "asc" },
              },
            },
          },
        },
        orderBy: { trackNumber: "asc" },
      },
    },
  });

  if (!p) return null;

  return {
    id: p.id,
    userId: p.userId,
    title: p.title,
    description: p.description,
    type: p.type as ProjectType,
    status: p.status as ProjectStatus,
    targetDate: p.targetDate,
    notes: p.notes,
    coverUrl: p.coverUrl,
    songs: p.projectSongs.map((ps) => ({
      id: ps.id,
      projectId: ps.projectId,
      songId: ps.songId,
      trackNumber: ps.trackNumber,
      notes: ps.notes,
      song: {
        id: ps.song.id,
        userId: ps.song.userId,
        title: ps.song.title,
        concept: ps.song.concept,
        status: ps.song.status as SongStatus,
        genre: ps.song.genre,
        bpm: ps.song.bpm,
        musicalKey: ps.song.musicalKey,
        mood: ps.song.mood,
        nextAction: ps.song.nextAction,
        tags: ps.song.tags,
        notes: ps.song.notes,
        wordCount: ps.song.wordCount,
        sections: ps.song.sections.map((sec) => ({
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
        createdAt: ps.song.createdAt.toISOString(),
        updatedAt: ps.song.updatedAt.toISOString(),
      },
      createdAt: ps.createdAt.toISOString(),
      updatedAt: ps.updatedAt.toISOString(),
    })),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

export async function createProject(data: {
  title: string;
  description?: string;
  type?: ProjectType;
  status?: ProjectStatus;
  targetDate?: string;
  notes?: string;
}): Promise<CreativeProjectData> {
  const p = await prisma.creativeProject.create({
    data: {
      userId: DEFAULT_USER_ID,
      title: data.title.trim(),
      description: data.description?.trim() || null,
      type: data.type || "EP",
      status: data.status || "PLANNING",
      targetDate: data.targetDate || null,
      notes: data.notes?.trim() || null,
    },
  });

  revalidatePath("/create");
  return (await getProject(p.id))!;
}

export async function updateProject(
  id: string,
  data: {
    title?: string;
    description?: string;
    type?: ProjectType;
    status?: ProjectStatus;
    targetDate?: string;
    notes?: string;
  }
) {
  const p = await prisma.creativeProject.update({
    where: { id },
    data: {
      title: data.title !== undefined ? data.title.trim() : undefined,
      description: data.description !== undefined ? data.description.trim() || null : undefined,
      type: data.type !== undefined ? data.type : undefined,
      status: data.status !== undefined ? data.status : undefined,
      targetDate: data.targetDate !== undefined ? data.targetDate || null : undefined,
      notes: data.notes !== undefined ? data.notes.trim() || null : undefined,
    },
  });

  revalidatePath("/create");
  revalidatePath(`/create/projects/${id}`);
  return p;
}

export async function addSongToProject(projectId: string, songId: string) {
  const lastTrack = await prisma.projectSong.findFirst({
    where: { projectId },
    orderBy: { trackNumber: "desc" },
  });

  const nextTrackNumber = lastTrack ? lastTrack.trackNumber + 1 : 1;

  const projectSong = await prisma.projectSong.upsert({
    where: {
      projectId_songId: { projectId, songId },
    },
    update: {},
    create: {
      projectId,
      songId,
      trackNumber: nextTrackNumber,
    },
  });

  revalidatePath("/create");
  revalidatePath(`/create/projects/${projectId}`);
  return projectSong;
}

export async function removeSongFromProject(projectId: string, songId: string) {
  await prisma.projectSong.deleteMany({
    where: { projectId, songId },
  });

  revalidatePath("/create");
  revalidatePath(`/create/projects/${projectId}`);
  return { success: true };
}

export async function reorderProjectSongs(
  projectId: string,
  songIdsInOrder: string[]
) {
  await prisma.$transaction(
    songIdsInOrder.map((songId, index) =>
      prisma.projectSong.updateMany({
        where: { projectId, songId },
        data: { trackNumber: index + 1 },
      })
    )
  );

  revalidatePath(`/create/projects/${projectId}`);
  return { success: true };
}

export async function deleteProject(id: string) {
  const existing = await prisma.creativeProject.findFirst({
    where: { id, userId: DEFAULT_USER_ID },
  });
  if (!existing) return { success: false };

  await prisma.creativeProject.delete({ where: { id } });
  revalidatePath("/create");
  return { success: true };
}
