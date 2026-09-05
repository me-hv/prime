"use server";

import { prisma } from "@/lib/db";
import { RhymeChainData } from "@/lib/types";
import { revalidatePath } from "next/cache";

const DEFAULT_USER_ID = "prime-artist-user";

export async function getRhymeChains(): Promise<RhymeChainData[]> {
  const chains = await prisma.rhymeChain.findMany({
    where: { userId: DEFAULT_USER_ID },
    include: {
      entries: {
        orderBy: { orderIndex: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return chains.map((c) => ({
    id: c.id,
    userId: c.userId,
    sessionId: c.sessionId,
    anchorPhrase: c.anchorPhrase,
    syllableCount: c.syllableCount,
    notes: c.notes,
    entries: c.entries.map((e) => ({
      id: e.id,
      chainId: e.chainId,
      rhymeText: e.rhymeText,
      syllables: e.syllables,
      orderIndex: e.orderIndex,
      notes: e.notes,
      createdAt: e.createdAt.toISOString(),
    })),
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));
}

export async function createRhymeChain(data: {
  anchorPhrase: string;
  syllableCount?: number;
  notes?: string;
  sessionId?: string;
  entries?: { rhymeText: string; syllables?: number; notes?: string }[];
}): Promise<RhymeChainData> {
  const chain = await prisma.rhymeChain.create({
    data: {
      userId: DEFAULT_USER_ID,
      anchorPhrase: data.anchorPhrase.trim(),
      syllableCount: data.syllableCount || 1,
      notes: data.notes?.trim() || null,
      sessionId: data.sessionId || null,
      entries: data.entries && data.entries.length > 0
        ? {
            create: data.entries.map((e, index) => ({
              rhymeText: e.rhymeText.trim(),
              syllables: e.syllables || data.syllableCount || 1,
              orderIndex: index,
              notes: e.notes?.trim() || null,
            })),
          }
        : undefined,
    },
    include: {
      entries: {
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  revalidatePath("/train");
  return {
    id: chain.id,
    userId: chain.userId,
    sessionId: chain.sessionId,
    anchorPhrase: chain.anchorPhrase,
    syllableCount: chain.syllableCount,
    notes: chain.notes,
    entries: chain.entries.map((e) => ({
      id: e.id,
      chainId: e.chainId,
      rhymeText: e.rhymeText,
      syllables: e.syllables,
      orderIndex: e.orderIndex,
      notes: e.notes,
      createdAt: e.createdAt.toISOString(),
    })),
    createdAt: chain.createdAt.toISOString(),
    updatedAt: chain.updatedAt.toISOString(),
  };
}

export async function addRhymeEntry(
  chainId: string,
  data: { rhymeText: string; syllables?: number; notes?: string }
) {
  const existingChain = await prisma.rhymeChain.findFirst({
    where: { id: chainId, userId: DEFAULT_USER_ID },
  });

  if (!existingChain) return { success: false };

  const lastEntry = await prisma.rhymeEntry.findFirst({
    where: { chainId },
    orderBy: { orderIndex: "desc" },
  });

  const nextIndex = lastEntry ? lastEntry.orderIndex + 1 : 0;

  const entry = await prisma.rhymeEntry.create({
    data: {
      chainId,
      rhymeText: data.rhymeText.trim(),
      syllables: data.syllables || existingChain.syllableCount,
      orderIndex: nextIndex,
      notes: data.notes?.trim() || null,
    },
  });

  await prisma.rhymeChain.update({
    where: { id: chainId },
    data: { updatedAt: new Date() },
  });

  revalidatePath("/train");
  return {
    success: true,
    entry: {
      id: entry.id,
      chainId: entry.chainId,
      rhymeText: entry.rhymeText,
      syllables: entry.syllables,
      orderIndex: entry.orderIndex,
      notes: entry.notes,
      createdAt: entry.createdAt.toISOString(),
    },
  };
}

export async function deleteRhymeChain(id: string) {
  const existing = await prisma.rhymeChain.findFirst({
    where: { id, userId: DEFAULT_USER_ID },
  });

  if (!existing) return { success: false };

  await prisma.rhymeChain.delete({ where: { id } });
  revalidatePath("/train");
  return { success: true };
}
