"use server";

import { prisma } from "@/lib/db";
import { CaptureType, QuickCaptureData } from "@/lib/types";
import { revalidatePath } from "next/cache";

const DEFAULT_USER_ID = "prime-artist-user";

export async function getQuickCaptures(limit = 30): Promise<QuickCaptureData[]> {
  const captures = await prisma.quickCapture.findMany({
    where: { userId: DEFAULT_USER_ID },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return captures.map((c) => ({
    id: c.id,
    userId: c.userId,
    type: c.type as CaptureType,
    content: c.content,
    tags: c.tags,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));
}

export async function createQuickCapture(data: {
  type: CaptureType;
  content: string;
  tags?: string;
}) {
  const capture = await prisma.quickCapture.create({
    data: {
      userId: DEFAULT_USER_ID,
      type: data.type,
      content: data.content.trim(),
      tags: data.tags ? data.tags.trim() : null,
    },
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
