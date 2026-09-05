"use server";

import { prisma } from "@/lib/db";
import { VocabularyEntryData } from "@/lib/types";
import { revalidatePath } from "next/cache";

const DEFAULT_USER_ID = "prime-artist-user";

export async function getVocabularyEntries(): Promise<VocabularyEntryData[]> {
  const entries = await prisma.vocabularyEntry.findMany({
    where: { userId: DEFAULT_USER_ID },
    orderBy: { createdAt: "desc" },
  });

  return entries.map((e) => ({
    id: e.id,
    userId: e.userId,
    sessionId: e.sessionId,
    word: e.word,
    definition: e.definition,
    pronunciation: e.pronunciation,
    partOfSpeech: e.partOfSpeech,
    userLine: e.userLine,
    associations: e.associations,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  }));
}

export async function createVocabularyEntry(data: {
  word: string;
  definition: string;
  pronunciation?: string;
  partOfSpeech?: string;
  userLine?: string;
  associations?: string;
  sessionId?: string;
}): Promise<VocabularyEntryData> {
  const entry = await prisma.vocabularyEntry.create({
    data: {
      userId: DEFAULT_USER_ID,
      word: data.word.trim(),
      definition: data.definition.trim(),
      pronunciation: data.pronunciation?.trim() || null,
      partOfSpeech: data.partOfSpeech?.trim() || null,
      userLine: data.userLine?.trim() || null,
      associations: data.associations?.trim() || null,
      sessionId: data.sessionId || null,
    },
  });

  revalidatePath("/train");
  return {
    id: entry.id,
    userId: entry.userId,
    sessionId: entry.sessionId,
    word: entry.word,
    definition: entry.definition,
    pronunciation: entry.pronunciation,
    partOfSpeech: entry.partOfSpeech,
    userLine: entry.userLine,
    associations: entry.associations,
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  };
}

export async function deleteVocabularyEntry(id: string) {
  const existing = await prisma.vocabularyEntry.findFirst({
    where: { id, userId: DEFAULT_USER_ID },
  });

  if (!existing) return { success: false };

  await prisma.vocabularyEntry.delete({ where: { id } });
  revalidatePath("/train");
  return { success: true };
}
