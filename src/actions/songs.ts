"use server";

import { prisma } from "@/lib/db";
import {
  SongData,
  SongSectionData,
  SongStatus,
  SongSectionType,
  SECTION_TYPE_CONFIGS,
} from "@/lib/types";
import { revalidatePath } from "next/cache";

const DEFAULT_USER_ID = "prime-artist-user";

function calculateWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
}

export async function getSongs(filter?: { status?: string }): Promise<SongData[]> {
  const whereClause: Record<string, unknown> = { userId: DEFAULT_USER_ID };

  if (filter?.status && filter.status !== "ALL") {
    whereClause.status = filter.status;
  }

  const songs = await prisma.song.findMany({
    where: whereClause,
    include: {
      sections: {
        orderBy: { orderIndex: "asc" },
      },
      projectSongs: {
        select: { projectId: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return songs.map((s) => ({
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
    projectIds: s.projectSongs.map((ps) => ps.projectId),
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }));
}

export async function getSong(id: string): Promise<SongData | null> {
  const song = await prisma.song.findFirst({
    where: { id, userId: DEFAULT_USER_ID },
    include: {
      sections: {
        orderBy: { orderIndex: "asc" },
      },
      projectSongs: {
        select: { projectId: true },
      },
    },
  });

  if (!song) return null;

  return {
    id: song.id,
    userId: song.userId,
    title: song.title,
    concept: song.concept,
    status: song.status as SongStatus,
    genre: song.genre,
    bpm: song.bpm,
    musicalKey: song.musicalKey,
    mood: song.mood,
    nextAction: song.nextAction,
    tags: song.tags,
    notes: song.notes,
    wordCount: song.wordCount,
    sections: song.sections.map((sec) => ({
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
    projectIds: song.projectSongs.map((ps) => ps.projectId),
    createdAt: song.createdAt.toISOString(),
    updatedAt: song.updatedAt.toISOString(),
  };
}

export async function createSong(data: {
  title?: string;
  concept?: string;
  status?: SongStatus;
  genre?: string;
  bpm?: number;
  musicalKey?: string;
  mood?: string;
  nextAction?: string;
  tags?: string;
  withDefaultSections?: boolean;
}): Promise<SongData> {
  const song = await prisma.song.create({
    data: {
      userId: DEFAULT_USER_ID,
      title: data.title?.trim() || "Untitled Song",
      concept: data.concept?.trim() || null,
      status: data.status || "IDEA",
      genre: data.genre?.trim() || null,
      bpm: data.bpm || null,
      musicalKey: data.musicalKey?.trim() || null,
      mood: data.mood?.trim() || null,
      nextAction: data.nextAction?.trim() || "Define song concept and hook",
      tags: data.tags?.trim() || null,
      wordCount: 0,
    },
  });

  if (data.withDefaultSections !== false) {
    // Create standard starter sections: Concept Notes, Hook, Verse 1, Verse 2
    await prisma.songSection.createMany({
      data: [
        {
          songId: song.id,
          type: "HOOK",
          name: "Main Hook",
          content: "",
          orderIndex: 0,
          collapsed: false,
          wordCount: 0,
        },
        {
          songId: song.id,
          type: "VERSE",
          name: "Verse 1",
          content: "",
          orderIndex: 1,
          collapsed: false,
          wordCount: 0,
        },
        {
          songId: song.id,
          type: "VERSE",
          name: "Verse 2",
          content: "",
          orderIndex: 2,
          collapsed: false,
          wordCount: 0,
        },
        {
          songId: song.id,
          type: "NOTES",
          name: "Arrangement Notes",
          content: "",
          orderIndex: 3,
          collapsed: true,
          wordCount: 0,
        },
      ],
    });
  }

  revalidatePath("/create");
  return (await getSong(song.id))!;
}

export async function updateSongMetadata(
  id: string,
  data: {
    title?: string;
    concept?: string;
    status?: SongStatus;
    genre?: string;
    bpm?: number | null;
    musicalKey?: string;
    mood?: string;
    nextAction?: string;
    tags?: string;
    notes?: string;
  }
) {
  const song = await prisma.song.update({
    where: { id },
    data: {
      title: data.title !== undefined ? data.title.trim() || "Untitled Song" : undefined,
      concept: data.concept !== undefined ? data.concept.trim() || null : undefined,
      status: data.status !== undefined ? data.status : undefined,
      genre: data.genre !== undefined ? data.genre.trim() || null : undefined,
      bpm: data.bpm !== undefined ? (data.bpm ? Number(data.bpm) : null) : undefined,
      musicalKey: data.musicalKey !== undefined ? data.musicalKey.trim() || null : undefined,
      mood: data.mood !== undefined ? data.mood.trim() || null : undefined,
      nextAction: data.nextAction !== undefined ? data.nextAction.trim() || null : undefined,
      tags: data.tags !== undefined ? data.tags.trim() || null : undefined,
      notes: data.notes !== undefined ? data.notes.trim() || null : undefined,
    },
  });

  revalidatePath("/create");
  revalidatePath(`/create/songs/${id}`);
  return song;
}

export async function addSongSection(
  songId: string,
  data: {
    type: SongSectionType;
    name?: string;
    content?: string;
  }
): Promise<SongSectionData> {
  const defaultTitle =
    SECTION_TYPE_CONFIGS[data.type]?.defaultTitle || "Section";
  const name = data.name?.trim() || defaultTitle;
  const content = data.content || "";
  const wordCount = calculateWords(content);

  // Get current max orderIndex
  const lastSection = await prisma.songSection.findFirst({
    where: { songId },
    orderBy: { orderIndex: "desc" },
  });

  const nextIndex = lastSection ? lastSection.orderIndex + 1 : 0;

  const section = await prisma.songSection.create({
    data: {
      songId,
      type: data.type,
      name,
      content,
      orderIndex: nextIndex,
      collapsed: false,
      wordCount,
    },
  });

  await recalculateSongWordCount(songId);

  revalidatePath(`/create/songs/${songId}`);
  return {
    id: section.id,
    songId: section.songId,
    type: section.type as SongSectionType,
    name: section.name,
    content: section.content,
    orderIndex: section.orderIndex,
    collapsed: section.collapsed,
    wordCount: section.wordCount,
    createdAt: section.createdAt.toISOString(),
    updatedAt: section.updatedAt.toISOString(),
  };
}

export async function updateSongSection(
  sectionId: string,
  data: {
    name?: string;
    content?: string;
    collapsed?: boolean;
    type?: SongSectionType;
  }
): Promise<SongSectionData | null> {
  const existing = await prisma.songSection.findUnique({
    where: { id: sectionId },
  });
  if (!existing) return null;

  const content = data.content !== undefined ? data.content : existing.content;
  const wordCount = calculateWords(content);

  const updated = await prisma.songSection.update({
    where: { id: sectionId },
    data: {
      name:
        data.name !== undefined ? data.name.trim() || existing.name : existing.name,
      content,
      type: data.type || existing.type,
      collapsed:
        data.collapsed !== undefined ? data.collapsed : existing.collapsed,
      wordCount,
    },
  });

  await recalculateSongWordCount(existing.songId);

  revalidatePath(`/create/songs/${existing.songId}`);
  return {
    id: updated.id,
    songId: updated.songId,
    type: updated.type as SongSectionType,
    name: updated.name,
    content: updated.content,
    orderIndex: updated.orderIndex,
    collapsed: updated.collapsed,
    wordCount: updated.wordCount,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  };
}

export async function deleteSongSection(sectionId: string) {
  const existing = await prisma.songSection.findUnique({
    where: { id: sectionId },
  });
  if (!existing) return { success: false };

  await prisma.songSection.delete({ where: { id: sectionId } });
  await recalculateSongWordCount(existing.songId);

  revalidatePath(`/create/songs/${existing.songId}`);
  return { success: true };
}

export async function duplicateSongSection(
  sectionId: string
): Promise<SongSectionData | null> {
  const existing = await prisma.songSection.findUnique({
    where: { id: sectionId },
  });
  if (!existing) return null;

  const section = await prisma.songSection.create({
    data: {
      songId: existing.songId,
      type: existing.type,
      name: `${existing.name} (Copy)`,
      content: existing.content,
      orderIndex: existing.orderIndex + 1,
      collapsed: false,
      wordCount: existing.wordCount,
    },
  });

  await recalculateSongWordCount(existing.songId);
  revalidatePath(`/create/songs/${existing.songId}`);
  return {
    id: section.id,
    songId: section.songId,
    type: section.type as SongSectionType,
    name: section.name,
    content: section.content,
    orderIndex: section.orderIndex,
    collapsed: section.collapsed,
    wordCount: section.wordCount,
    createdAt: section.createdAt.toISOString(),
    updatedAt: section.updatedAt.toISOString(),
  };
}

export async function reorderSongSections(
  songId: string,
  sectionIdsInOrder: string[]
) {
  await prisma.$transaction(
    sectionIdsInOrder.map((id, index) =>
      prisma.songSection.update({
        where: { id },
        data: { orderIndex: index },
      })
    )
  );

  revalidatePath(`/create/songs/${songId}`);
  return { success: true };
}

export async function deleteSong(id: string) {
  const existing = await prisma.song.findFirst({
    where: { id, userId: DEFAULT_USER_ID },
  });
  if (!existing) return { success: false };

  await prisma.song.delete({ where: { id } });
  revalidatePath("/create");
  return { success: true };
}

async function recalculateSongWordCount(songId: string) {
  const sections = await prisma.songSection.findMany({
    where: { songId },
    select: { wordCount: true },
  });
  const total = sections.reduce((sum, s) => sum + s.wordCount, 0);

  await prisma.song.update({
    where: { id: songId },
    data: { wordCount: total },
  });
}
