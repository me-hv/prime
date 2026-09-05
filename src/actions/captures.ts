"use server";

import { prisma } from "@/lib/db";
import {
  CaptureType,
  CaptureStatus,
  QuickCaptureData,
  WritingType,
  SongSectionType,
} from "@/lib/types";
import { revalidatePath } from "next/cache";
import { createWritingDocument } from "./writings";
import { createSong, addSongSection } from "./songs";

const DEFAULT_USER_ID = "prime-artist-user";

export async function getQuickCaptures(filter?: {
  status?: string;
  type?: string;
  limit?: number;
}): Promise<QuickCaptureData[]> {
  const whereClause: Record<string, unknown> = { userId: DEFAULT_USER_ID };

  if (filter?.status && filter.status !== "ALL") {
    whereClause.status = filter.status;
  }
  if (filter?.type && filter.type !== "ALL") {
    whereClause.type = filter.type;
  }

  const captures = await prisma.quickCapture.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    take: filter?.limit || 50,
  });

  return captures.map((c) => ({
    id: c.id,
    userId: c.userId,
    type: c.type as CaptureType,
    title: c.title,
    content: c.content,
    tags: c.tags,
    status: c.status as CaptureStatus,
    convertedTo: c.convertedTo,
    convertedId: c.convertedId,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));
}

export async function createQuickCapture(data: {
  type: CaptureType;
  content: string;
  title?: string;
  tags?: string;
}) {
  const capture = await prisma.quickCapture.create({
    data: {
      userId: DEFAULT_USER_ID,
      type: data.type,
      title: data.title?.trim() || null,
      content: data.content.trim(),
      tags: data.tags ? data.tags.trim() : null,
      status: "INBOX",
    },
  });

  revalidatePath("/");
  revalidatePath("/create");
  return capture;
}

export async function updateQuickCapture(
  id: string,
  data: {
    title?: string;
    content?: string;
    type?: CaptureType;
    status?: CaptureStatus;
    tags?: string;
  }
) {
  const capture = await prisma.quickCapture.update({
    where: { id },
    data: {
      title: data.title !== undefined ? data.title.trim() || null : undefined,
      content: data.content !== undefined ? data.content.trim() : undefined,
      type: data.type !== undefined ? data.type : undefined,
      status: data.status !== undefined ? data.status : undefined,
      tags: data.tags !== undefined ? data.tags.trim() || null : undefined,
    },
  });

  revalidatePath("/");
  revalidatePath("/create");
  return capture;
}

export async function archiveQuickCapture(id: string) {
  const capture = await prisma.quickCapture.update({
    where: { id },
    data: { status: "ARCHIVED" },
  });

  revalidatePath("/");
  revalidatePath("/create");
  return capture;
}

export async function deleteQuickCapture(id: string) {
  await prisma.quickCapture.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/create");
  return { success: true };
}

export async function convertCaptureToWriting(
  captureId: string,
  options: {
    title?: string;
    type?: WritingType;
  }
) {
  const capture = await prisma.quickCapture.findUnique({
    where: { id: captureId },
  });
  if (!capture) return null;

  // Determine appropriate title
  const title =
    options.title?.trim() ||
    capture.title?.trim() ||
    (capture.content.length > 40
      ? `${capture.content.slice(0, 37)}...`
      : capture.content);

  // Map capture type to writing type if not explicitly passed
  let writingType: WritingType = options.type || "FREE_WRITE";
  if (!options.type) {
    if (capture.type === "HOOK") writingType = "HOOK";
    else if (capture.type === "LYRIC") writingType = "BARS";
    else if (capture.type === "SONG_IDEA") writingType = "CONCEPT";
    else if (capture.type === "IDEA") writingType = "IDEA";
  }

  const doc = await createWritingDocument({
    title,
    content: capture.content,
    type: writingType,
    tags: capture.tags || undefined,
  });

  // Update capture status to indicate conversion while preserving original content
  await prisma.quickCapture.update({
    where: { id: captureId },
    data: {
      status: "IN_PROGRESS",
      convertedTo: "WRITING",
      convertedId: doc.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/create");
  return doc;
}

export async function convertCaptureToSong(
  captureId: string,
  options: {
    title?: string;
    sectionType?: SongSectionType;
  }
) {
  const capture = await prisma.quickCapture.findUnique({
    where: { id: captureId },
  });
  if (!capture) return null;

  const title =
    options.title?.trim() ||
    capture.title?.trim() ||
    (capture.content.length > 40
      ? `${capture.content.slice(0, 37)}...`
      : capture.content);

  const sectionType = options.sectionType || (capture.type === "HOOK" ? "HOOK" : "VERSE");

  // Create new song
  const song = await createSong({
    title,
    concept: capture.type === "SONG_IDEA" || capture.type === "IDEA" ? capture.content : undefined,
    status: "WRITING",
    withDefaultSections: false,
  });

  // Add the capture content as the target section
  await addSongSection(song.id, {
    type: sectionType,
    name: sectionType === "HOOK" ? "Main Hook" : "Verse 1",
    content: capture.content,
  });

  // Also add standard starter sections: Verse 2 and Notes
  if (sectionType === "HOOK") {
    await addSongSection(song.id, {
      type: "VERSE",
      name: "Verse 1",
      content: "",
    });
  }
  await addSongSection(song.id, {
    type: "NOTES",
    name: "Arrangement Notes",
    content: "",
  });

  // Update capture metadata
  await prisma.quickCapture.update({
    where: { id: captureId },
    data: {
      status: "IN_PROGRESS",
      convertedTo: "SONG",
      convertedId: song.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/create");
  return song;
}
