"use server";

import { prisma } from "@/lib/db";
import { SearchItemResult } from "@/lib/types";

const DEFAULT_USER_ID = "prime-artist-user";

export async function searchCreativeWorkspace(
  query: string
): Promise<SearchItemResult[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  // 1. Search Writing Documents
  const writings = await prisma.writingDocument.findMany({
    where: {
      userId: DEFAULT_USER_ID,
      OR: [
        { title: { contains: q } },
        { content: { contains: q } },
        { tags: { contains: q } },
      ],
    },
    take: 10,
    orderBy: { updatedAt: "desc" },
  });

  // 2. Search Songs and Song Sections
  const songs = await prisma.song.findMany({
    where: {
      userId: DEFAULT_USER_ID,
      OR: [
        { title: { contains: q } },
        { concept: { contains: q } },
        { tags: { contains: q } },
        { nextAction: { contains: q } },
        {
          sections: {
            some: {
              OR: [{ name: { contains: q } }, { content: { contains: q } }],
            },
          },
        },
      ],
    },
    include: {
      sections: true,
    },
    take: 10,
    orderBy: { updatedAt: "desc" },
  });

  // 3. Search Projects
  const projects = await prisma.creativeProject.findMany({
    where: {
      userId: DEFAULT_USER_ID,
      OR: [
        { title: { contains: q } },
        { description: { contains: q } },
        { notes: { contains: q } },
      ],
    },
    take: 5,
    orderBy: { updatedAt: "desc" },
  });

  // 4. Search Quick Captures
  const captures = await prisma.quickCapture.findMany({
    where: {
      userId: DEFAULT_USER_ID,
      OR: [
        { title: { contains: q } },
        { content: { contains: q } },
        { tags: { contains: q } },
      ],
    },
    take: 10,
    orderBy: { createdAt: "desc" },
  });

  const results: SearchItemResult[] = [];

  // Map Writings
  for (const w of writings) {
    results.push({
      id: w.id,
      title: w.title,
      subtitle: `${w.type} • ${w.wordCount} words • Status: ${w.status}`,
      type: "WRITING",
      categoryBadge: "Writing Draft",
      href: `/create/write/${w.id}`,
      updatedAt: w.updatedAt.toISOString(),
      snippet: w.content.slice(0, 90),
    });
  }

  // Map Songs
  for (const s of songs) {
    results.push({
      id: s.id,
      title: s.title,
      subtitle: `${s.status} • ${s.sections.length} sections • ${s.wordCount} words`,
      type: "SONG",
      categoryBadge: "Song Workspace",
      href: `/create/songs/${s.id}`,
      updatedAt: s.updatedAt.toISOString(),
      snippet: s.concept || s.nextAction || undefined,
    });
  }

  // Map Projects
  for (const p of projects) {
    results.push({
      id: p.id,
      title: p.title,
      subtitle: `${p.type} • Status: ${p.status}`,
      type: "PROJECT",
      categoryBadge: "Creative Project",
      href: `/create/projects/${p.id}`,
      updatedAt: p.updatedAt.toISOString(),
      snippet: p.description || undefined,
    });
  }

  // Map Captures
  for (const c of captures) {
    results.push({
      id: c.id,
      title: c.title || c.content.slice(0, 35) + "...",
      subtitle: `Capture • Type: ${c.type} • Status: ${c.status}`,
      type: "CAPTURE",
      categoryBadge: "Inbox Idea",
      href: `/create?tab=inbox`,
      updatedAt: c.updatedAt.toISOString(),
      snippet: c.content,
    });
  }

  return results;
}
