"use server";

import { prisma } from "@/lib/db";
import { SearchItemResult } from "@/lib/types";

const DEFAULT_USER_ID = "prime-artist-user";

export async function searchCreativeWorkspace(
  query: string
): Promise<SearchItemResult[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const [
    writings,
    songs,
    projects,
    captures,
    artists,
    references,
    studySessions,
    reflections,
    bottlenecks,
    breakthroughs,
    milestones,
    skills,
    profile,
  ] = await Promise.all([
    // 1. Writings
    prisma.writingDocument.findMany({
      where: {
        userId: DEFAULT_USER_ID,
        OR: [
          { title: { contains: q } },
          { content: { contains: q } },
          { tags: { contains: q } },
        ],
      },
      take: 5,
      orderBy: { updatedAt: "desc" },
    }),

    // 2. Songs
    prisma.song.findMany({
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
      include: { sections: true },
      take: 5,
      orderBy: { updatedAt: "desc" },
    }),

    // 3. Projects
    prisma.creativeProject.findMany({
      where: {
        userId: DEFAULT_USER_ID,
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
          { notes: { contains: q } },
        ],
      },
      take: 4,
      orderBy: { updatedAt: "desc" },
    }),

    // 4. Captures
    prisma.quickCapture.findMany({
      where: {
        userId: DEFAULT_USER_ID,
        OR: [
          { title: { contains: q } },
          { content: { contains: q } },
          { tags: { contains: q } },
        ],
      },
      take: 5,
      orderBy: { createdAt: "desc" },
    }),

    // 5. Artists
    prisma.artist.findMany({
      where: {
        userId: DEFAULT_USER_ID,
        OR: [
          { name: { contains: q } },
          { role: { contains: q } },
          { notes: { contains: q } },
          { genres: { contains: q } },
          { tags: { contains: q } },
        ],
      },
      take: 5,
      orderBy: { updatedAt: "desc" },
    }),

    // 6. References
    prisma.artistReference.findMany({
      where: {
        userId: DEFAULT_USER_ID,
        OR: [
          { title: { contains: q } },
          { creator: { contains: q } },
          { album: { contains: q } },
          { notes: { contains: q } },
          { tags: { contains: q } },
        ],
      },
      take: 6,
      orderBy: { updatedAt: "desc" },
    }),

    // 7. Study Sessions
    prisma.studySession.findMany({
      where: {
        userId: DEFAULT_USER_ID,
        OR: [
          { observations: { contains: q } },
          { techniques: { contains: q } },
          { whatILearned: { contains: q } },
          { takeaway: { contains: q } },
          { customFocus: { contains: q } },
        ],
      },
      include: { reference: true },
      take: 5,
      orderBy: { createdAt: "desc" },
    }),

    // 8. Daily Reflections
    prisma.dailyReflection.findMany({
      where: {
        userId: DEFAULT_USER_ID,
        OR: [
          { clicked: { contains: q } },
          { learned: { contains: q } },
          { created: { contains: q } },
          { tomorrowPriority: { contains: q } },
        ],
      },
      take: 4,
      orderBy: { date: "desc" },
    }),

    // 9. Bottlenecks
    prisma.bottleneck.findMany({
      where: {
        userId: DEFAULT_USER_ID,
        OR: [
          { description: { contains: q } },
          { attemptedSolution: { contains: q } },
          { result: { contains: q } },
        ],
      },
      take: 4,
      orderBy: { date: "desc" },
    }),

    // 10. Breakthroughs
    prisma.breakthrough.findMany({
      where: {
        userId: DEFAULT_USER_ID,
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
          { cause: { contains: q } },
          { changeEffect: { contains: q } },
        ],
      },
      take: 4,
      orderBy: { date: "desc" },
    }),

    // 11. Milestones
    prisma.milestone.findMany({
      where: {
        userId: DEFAULT_USER_ID,
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
          { significance: { contains: q } },
          { lessons: { contains: q } },
        ],
      },
      take: 4,
      orderBy: { date: "desc" },
    }),

    // 12. Skills
    prisma.skill.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { slug: { contains: q } },
          { description: { contains: q } },
          { category: { contains: q } },
        ],
      },
      take: 5,
    }),

    // 13. Artist DNA Profile
    prisma.artistDNAProfile.findFirst({
      where: {
        userId: DEFAULT_USER_ID,
        OR: [
          { identityStatement: { contains: q } },
          { creativeValues: { contains: q } },
          { favoriteGenres: { contains: q } },
          { favoriteArtists: { contains: q } },
          { favoriteProducers: { contains: q } },
          { favoriteStyles: { contains: q } },
          { favoriteThemes: { contains: q } },
        ],
      },
    }),
  ]);

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

  // Map Artists
  for (const a of artists) {
    results.push({
      id: a.id,
      title: a.name,
      subtitle: `${a.role} • Status: ${a.status}`,
      type: "ARTIST",
      categoryBadge: "Artist Library",
      href: `/discover?tab=artists`,
      updatedAt: a.updatedAt.toISOString(),
      snippet: a.notes || a.genres || undefined,
    });
  }

  // Map References
  for (const r of references) {
    results.push({
      id: r.id,
      title: r.title,
      subtitle: `${r.type} • by ${r.creator}${r.album ? ` • ${r.album}` : ""}`,
      type: "REFERENCE",
      categoryBadge: "Reference Vault",
      href: `/discover?tab=references`,
      updatedAt: r.updatedAt.toISOString(),
      snippet: r.notes || r.genre || undefined,
    });
  }

  // Map Study Sessions
  for (const st of studySessions) {
    results.push({
      id: st.id,
      title: st.reference ? `Study: ${st.reference.title}` : `Study Session (${st.focus})`,
      subtitle: `${st.focus} Analysis • Duration: ${Math.round(st.durationSeconds / 60)} min`,
      type: "STUDY",
      categoryBadge: "Song Breakdown",
      href: `/discover?tab=vault`,
      updatedAt: st.updatedAt.toISOString(),
      snippet: st.takeaway || st.whatILearned || st.observations || undefined,
    });
  }

  // Map Daily Reflections
  for (const rf of reflections) {
    results.push({
      id: rf.id,
      title: `Daily Reflection (${rf.date})`,
      subtitle: `Retrospective • ${rf.tomorrowPriority ? `Priority: ${rf.tomorrowPriority}` : "Daily Log"}`,
      type: "REFLECTION",
      categoryBadge: "Daily Reflection",
      href: `/reflect?tab=daily&date=${rf.date}`,
      updatedAt: rf.updatedAt.toISOString(),
      snippet: rf.clicked || rf.learned || rf.created || undefined,
    });
  }

  // Map Bottlenecks
  for (const b of bottlenecks) {
    results.push({
      id: b.id,
      title: `Bottleneck: ${b.category}`,
      subtitle: `Severity ${b.severity}/5 • ${b.resolved ? "Resolved" : "Active Block"}`,
      type: "BOTTLENECK",
      categoryBadge: "Creative Block",
      href: `/reflect?tab=bottlenecks`,
      updatedAt: b.updatedAt.toISOString(),
      snippet: b.description,
    });
  }

  // Map Breakthroughs
  for (const br of breakthroughs) {
    results.push({
      id: br.id,
      title: br.title,
      subtitle: `Breakthrough • ${br.category} • ${br.date}`,
      type: "BREAKTHROUGH",
      categoryBadge: "Creative Leap",
      href: `/reflect?tab=breakthroughs`,
      updatedAt: br.updatedAt.toISOString(),
      snippet: br.description,
    });
  }

  // Map Milestones
  for (const m of milestones) {
    results.push({
      id: m.id,
      title: m.title,
      subtitle: `Milestone • ${m.category} • ${m.date}`,
      type: "MILESTONE",
      categoryBadge: "Milestone",
      href: `/reflect?tab=milestones`,
      updatedAt: m.updatedAt.toISOString(),
      snippet: m.description,
    });
  }

  // Map Skills
  for (const sk of skills) {
    results.push({
      id: sk.id,
      title: sk.name,
      subtitle: `Skill • ${sk.category} • Category Matrix`,
      type: "SKILL",
      categoryBadge: "Skill Matrix",
      href: `/progress/skills/${sk.slug}`,
      updatedAt: sk.updatedAt.toISOString(),
      snippet: sk.description || undefined,
    });
  }

  // Map Artist DNA
  if (profile) {
    results.push({
      id: profile.id,
      title: "Artist DNA Profile",
      subtitle: "Identity, Creative Values & Stylistic Preferences",
      type: "DNA",
      categoryBadge: "Artist DNA",
      href: `/progress/artist-dna`,
      updatedAt: profile.updatedAt.toISOString(),
      snippet: profile.identityStatement,
    });
  }

  return results;
}
