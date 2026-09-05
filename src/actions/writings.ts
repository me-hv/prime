"use server";

import { prisma } from "@/lib/db";
import { WritingDocumentData, WritingType, WritingStatus } from "@/lib/types";
import { revalidatePath } from "next/cache";

const DEFAULT_USER_ID = "prime-artist-user";

function calculateCounts(content: string) {
  const trimmed = content.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  const characterCount = content.length;
  return { wordCount, characterCount };
}

export async function getWritingDocuments(filter?: {
  status?: string;
  type?: string;
}): Promise<WritingDocumentData[]> {
  const whereClause: Record<string, unknown> = { userId: DEFAULT_USER_ID };

  if (filter?.status && filter.status !== "ALL") {
    whereClause.status = filter.status;
  }
  if (filter?.type && filter.type !== "ALL") {
    whereClause.type = filter.type;
  }

  const docs = await prisma.writingDocument.findMany({
    where: whereClause,
    orderBy: { updatedAt: "desc" },
  });

  return docs.map((d) => ({
    id: d.id,
    userId: d.userId,
    title: d.title,
    content: d.content,
    type: d.type as WritingType,
    status: d.status as WritingStatus,
    tags: d.tags,
    wordCount: d.wordCount,
    characterCount: d.characterCount,
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
  }));
}

export async function getWritingDocument(
  id: string
): Promise<WritingDocumentData | null> {
  const doc = await prisma.writingDocument.findFirst({
    where: {
      id,
      userId: DEFAULT_USER_ID,
    },
  });

  if (!doc) return null;

  return {
    id: doc.id,
    userId: doc.userId,
    title: doc.title,
    content: doc.content,
    type: doc.type as WritingType,
    status: doc.status as WritingStatus,
    tags: doc.tags,
    wordCount: doc.wordCount,
    characterCount: doc.characterCount,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export async function createWritingDocument(data: {
  title?: string;
  content?: string;
  type?: WritingType;
  tags?: string;
}): Promise<WritingDocumentData> {
  const content = data.content || "";
  const { wordCount, characterCount } = calculateCounts(content);

  const doc = await prisma.writingDocument.create({
    data: {
      userId: DEFAULT_USER_ID,
      title: data.title?.trim() || "Untitled Draft",
      content,
      type: data.type || "FREE_WRITE",
      status: "DRAFT",
      tags: data.tags?.trim() || null,
      wordCount,
      characterCount,
    },
  });

  revalidatePath("/create");
  return {
    id: doc.id,
    userId: doc.userId,
    title: doc.title,
    content: doc.content,
    type: doc.type as WritingType,
    status: doc.status as WritingStatus,
    tags: doc.tags,
    wordCount: doc.wordCount,
    characterCount: doc.characterCount,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export async function updateWritingDocument(
  id: string,
  data: {
    title?: string;
    content?: string;
    type?: WritingType;
    status?: WritingStatus;
    tags?: string;
  }
): Promise<WritingDocumentData | null> {
  const existing = await prisma.writingDocument.findFirst({
    where: { id, userId: DEFAULT_USER_ID },
  });

  if (!existing) return null;

  const content = data.content !== undefined ? data.content : existing.content;
  const { wordCount, characterCount } = calculateCounts(content);

  const updated = await prisma.writingDocument.update({
    where: { id },
    data: {
      title: data.title !== undefined ? data.title.trim() || "Untitled Draft" : existing.title,
      content,
      type: data.type || existing.type,
      status: data.status || existing.status,
      tags: data.tags !== undefined ? data.tags.trim() || null : existing.tags,
      wordCount,
      characterCount,
    },
  });

  revalidatePath("/create");
  revalidatePath(`/create/write/${id}`);

  return {
    id: updated.id,
    userId: updated.userId,
    title: updated.title,
    content: updated.content,
    type: updated.type as WritingType,
    status: updated.status as WritingStatus,
    tags: updated.tags,
    wordCount: updated.wordCount,
    characterCount: updated.characterCount,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  };
}

export async function deleteWritingDocument(id: string) {
  const existing = await prisma.writingDocument.findFirst({
    where: { id, userId: DEFAULT_USER_ID },
  });

  if (!existing) return { success: false, error: "Not found" };

  await prisma.writingDocument.delete({ where: { id } });

  revalidatePath("/create");
  return { success: true };
}

export async function archiveWritingDocument(id: string) {
  const updated = await prisma.writingDocument.update({
    where: { id },
    data: { status: "ARCHIVED" },
  });

  revalidatePath("/create");
  return updated;
}
