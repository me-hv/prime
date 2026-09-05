"use server";

import { prisma } from "@/lib/db";
import {
  ArtistData,
  ArtistReferenceData,
  ArtistStatus,
  DiscoveryStatsData,
  ListeningEntryData,
  ListeningPurpose,
  ReferenceType,
  SkillCategory,
  StudyFocus,
  StudySessionData,
  AlbumStudyData,
  TodayStudyRecommendation,
} from "@/lib/types";
import { revalidatePath } from "next/cache";
import { getTodayDateString } from "@/lib/utils";

const DEFAULT_USER_ID = "prime-artist-user";

// ==========================================
// 1. Artist Roster Actions
// ==========================================

export async function getArtists(): Promise<ArtistData[]> {
  const artists = await prisma.artist.findMany({
    where: { userId: DEFAULT_USER_ID },
    include: {
      references: { select: { id: true } },
      studySessions: { select: { id: true } },
    },
    orderBy: [{ favorite: "desc" }, { name: "asc" }],
  });

  return artists.map((a) => ({
    id: a.id,
    userId: a.userId,
    name: a.name,
    role: a.role,
    notes: a.notes,
    status: a.status as ArtistStatus,
    genres: a.genres,
    tags: a.tags,
    favorite: a.favorite,
    referenceCount: a.references.length,
    studySessionCount: a.studySessions.length,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  }));
}

export async function getArtist(id: string): Promise<ArtistData | null> {
  const a = await prisma.artist.findFirst({
    where: { id, userId: DEFAULT_USER_ID },
    include: {
      references: { select: { id: true } },
      studySessions: { select: { id: true } },
    },
  });
  if (!a) return null;

  return {
    id: a.id,
    userId: a.userId,
    name: a.name,
    role: a.role,
    notes: a.notes,
    status: a.status as ArtistStatus,
    genres: a.genres,
    tags: a.tags,
    favorite: a.favorite,
    referenceCount: a.references.length,
    studySessionCount: a.studySessions.length,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  };
}

export async function createArtist(input: {
  name: string;
  role?: string | null;
  notes?: string | null;
  status?: ArtistStatus;
  genres?: string | null;
  tags?: string | null;
  favorite?: boolean;
}): Promise<ArtistData> {
  const a = await prisma.artist.create({
    data: {
      userId: DEFAULT_USER_ID,
      name: input.name.trim(),
      role: input.role?.trim() || "Rapper / Songwriter",
      notes: input.notes?.trim() || null,
      status: input.status || "STUDYING",
      genres: input.genres?.trim() || null,
      tags: input.tags?.trim() || null,
      favorite: !!input.favorite,
    },
  });

  revalidatePath("/discover");
  return {
    id: a.id,
    userId: a.userId,
    name: a.name,
    role: a.role,
    notes: a.notes,
    status: a.status as ArtistStatus,
    genres: a.genres,
    tags: a.tags,
    favorite: a.favorite,
    referenceCount: 0,
    studySessionCount: 0,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  };
}

export async function updateArtist(
  id: string,
  input: {
    name?: string;
    role?: string;
    notes?: string | null;
    status?: ArtistStatus;
    genres?: string | null;
    tags?: string | null;
    favorite?: boolean;
  }
): Promise<ArtistData> {
  const a = await prisma.artist.update({
    where: { id, userId: DEFAULT_USER_ID },
    data: {
      ...(input.name !== undefined && { name: input.name.trim() }),
      ...(input.role !== undefined && { role: input.role.trim() }),
      ...(input.notes !== undefined && { notes: input.notes?.trim() || null }),
      ...(input.status !== undefined && { status: input.status }),
      ...(input.genres !== undefined && { genres: input.genres?.trim() || null }),
      ...(input.tags !== undefined && { tags: input.tags?.trim() || null }),
      ...(input.favorite !== undefined && { favorite: input.favorite }),
    },
  });

  revalidatePath("/discover");
  return {
    id: a.id,
    userId: a.userId,
    name: a.name,
    role: a.role,
    notes: a.notes,
    status: a.status as ArtistStatus,
    genres: a.genres,
    tags: a.tags,
    favorite: a.favorite,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  };
}

export async function deleteArtist(id: string): Promise<boolean> {
  await prisma.artist.delete({
    where: { id, userId: DEFAULT_USER_ID },
  });
  revalidatePath("/discover");
  return true;
}

// ==========================================
// 2. Reference Library Actions
// ==========================================

export async function getReferences(filter?: {
  type?: string;
  artistId?: string;
  favorite?: boolean;
  search?: string;
}): Promise<ArtistReferenceData[]> {
  const whereClause: Record<string, unknown> = { userId: DEFAULT_USER_ID };

  if (filter?.type && filter.type !== "ALL") {
    whereClause.type = filter.type;
  }
  if (filter?.artistId && filter.artistId !== "ALL") {
    whereClause.artistId = filter.artistId;
  }
  if (filter?.favorite !== undefined) {
    whereClause.favorite = filter.favorite;
  }
  if (filter?.search && filter.search.trim()) {
    const q = filter.search.trim();
    whereClause.OR = [
      { title: { contains: q } },
      { creator: { contains: q } },
      { album: { contains: q } },
      { notes: { contains: q } },
      { tags: { contains: q } },
    ];
  }

  const refs = await prisma.artistReference.findMany({
    where: whereClause,
    include: {
      artist: true,
      studySessions: { select: { id: true } },
    },
    orderBy: [{ favorite: "desc" }, { updatedAt: "desc" }],
  });

  return refs.map((r) => ({
    id: r.id,
    userId: r.userId,
    type: r.type as ReferenceType,
    title: r.title,
    creator: r.creator,
    artistId: r.artistId,
    artist: r.artist
      ? {
          id: r.artist.id,
          userId: r.artist.userId,
          name: r.artist.name,
          role: r.artist.role,
          notes: r.artist.notes,
          status: r.artist.status as ArtistStatus,
          genres: r.artist.genres,
          tags: r.artist.tags,
          favorite: r.artist.favorite,
          createdAt: r.artist.createdAt.toISOString(),
          updatedAt: r.artist.updatedAt.toISOString(),
        }
      : null,
    year: r.year,
    url: r.url,
    album: r.album,
    genre: r.genre,
    notes: r.notes,
    tags: r.tags,
    favorite: r.favorite,
    studySessionCount: r.studySessions.length,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));
}

export async function getReference(id: string): Promise<ArtistReferenceData | null> {
  const r = await prisma.artistReference.findFirst({
    where: { id, userId: DEFAULT_USER_ID },
    include: {
      artist: true,
      studySessions: { select: { id: true } },
    },
  });
  if (!r) return null;

  return {
    id: r.id,
    userId: r.userId,
    type: r.type as ReferenceType,
    title: r.title,
    creator: r.creator,
    artistId: r.artistId,
    artist: r.artist
      ? {
          id: r.artist.id,
          userId: r.artist.userId,
          name: r.artist.name,
          role: r.artist.role,
          notes: r.artist.notes,
          status: r.artist.status as ArtistStatus,
          genres: r.artist.genres,
          tags: r.artist.tags,
          favorite: r.artist.favorite,
          createdAt: r.artist.createdAt.toISOString(),
          updatedAt: r.artist.updatedAt.toISOString(),
        }
      : null,
    year: r.year,
    url: r.url,
    album: r.album,
    genre: r.genre,
    notes: r.notes,
    tags: r.tags,
    favorite: r.favorite,
    studySessionCount: r.studySessions.length,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

export async function createReference(input: {
  type: ReferenceType;
  title: string;
  creator: string;
  artistId?: string | null;
  year?: number | null;
  url?: string | null;
  album?: string | null;
  genre?: string | null;
  notes?: string | null;
  tags?: string | null;
  favorite?: boolean;
}): Promise<ArtistReferenceData> {
  const ref = await prisma.artistReference.create({
    data: {
      userId: DEFAULT_USER_ID,
      type: input.type,
      title: input.title.trim(),
      creator: input.creator.trim(),
      artistId: input.artistId || null,
      year: input.year ? Number(input.year) : null,
      url: input.url?.trim() || null,
      album: input.album?.trim() || null,
      genre: input.genre?.trim() || null,
      notes: input.notes?.trim() || null,
      tags: input.tags?.trim() || null,
      favorite: !!input.favorite,
    },
    include: { artist: true },
  });

  revalidatePath("/discover");
  return {
    id: ref.id,
    userId: ref.userId,
    type: ref.type as ReferenceType,
    title: ref.title,
    creator: ref.creator,
    artistId: ref.artistId,
    artist: ref.artist
      ? {
          id: ref.artist.id,
          userId: ref.artist.userId,
          name: ref.artist.name,
          role: ref.artist.role,
          notes: ref.artist.notes,
          status: ref.artist.status as ArtistStatus,
          genres: ref.artist.genres,
          tags: ref.artist.tags,
          favorite: ref.artist.favorite,
          createdAt: ref.artist.createdAt.toISOString(),
          updatedAt: ref.artist.updatedAt.toISOString(),
        }
      : null,
    year: ref.year,
    url: ref.url,
    album: ref.album,
    genre: ref.genre,
    notes: ref.notes,
    tags: ref.tags,
    favorite: ref.favorite,
    studySessionCount: 0,
    createdAt: ref.createdAt.toISOString(),
    updatedAt: ref.updatedAt.toISOString(),
  };
}

export async function updateReference(
  id: string,
  input: {
    type?: ReferenceType;
    title?: string;
    creator?: string;
    artistId?: string | null;
    year?: number | null;
    url?: string | null;
    album?: string | null;
    genre?: string | null;
    notes?: string | null;
    tags?: string | null;
    favorite?: boolean;
  }
): Promise<ArtistReferenceData> {
  const ref = await prisma.artistReference.update({
    where: { id, userId: DEFAULT_USER_ID },
    data: {
      ...(input.type !== undefined && { type: input.type }),
      ...(input.title !== undefined && { title: input.title.trim() }),
      ...(input.creator !== undefined && { creator: input.creator.trim() }),
      ...(input.artistId !== undefined && { artistId: input.artistId || null }),
      ...(input.year !== undefined && { year: input.year ? Number(input.year) : null }),
      ...(input.url !== undefined && { url: input.url?.trim() || null }),
      ...(input.album !== undefined && { album: input.album?.trim() || null }),
      ...(input.genre !== undefined && { genre: input.genre?.trim() || null }),
      ...(input.notes !== undefined && { notes: input.notes?.trim() || null }),
      ...(input.tags !== undefined && { tags: input.tags?.trim() || null }),
      ...(input.favorite !== undefined && { favorite: input.favorite }),
    },
    include: { artist: true },
  });

  revalidatePath("/discover");
  return {
    id: ref.id,
    userId: ref.userId,
    type: ref.type as ReferenceType,
    title: ref.title,
    creator: ref.creator,
    artistId: ref.artistId,
    artist: ref.artist
      ? {
          id: ref.artist.id,
          userId: ref.artist.userId,
          name: ref.artist.name,
          role: ref.artist.role,
          notes: ref.artist.notes,
          status: ref.artist.status as ArtistStatus,
          genres: ref.artist.genres,
          tags: ref.artist.tags,
          favorite: ref.artist.favorite,
          createdAt: ref.artist.createdAt.toISOString(),
          updatedAt: ref.artist.updatedAt.toISOString(),
        }
      : null,
    year: ref.year,
    url: ref.url,
    album: ref.album,
    genre: ref.genre,
    notes: ref.notes,
    tags: ref.tags,
    favorite: ref.favorite,
    createdAt: ref.createdAt.toISOString(),
    updatedAt: ref.updatedAt.toISOString(),
  };
}

export async function toggleFavoriteReference(id: string): Promise<boolean> {
  const ref = await prisma.artistReference.findFirst({
    where: { id, userId: DEFAULT_USER_ID },
  });
  if (!ref) return false;

  const updated = await prisma.artistReference.update({
    where: { id },
    data: { favorite: !ref.favorite },
  });
  revalidatePath("/discover");
  return updated.favorite;
}

export async function deleteReference(id: string): Promise<boolean> {
  await prisma.artistReference.delete({
    where: { id, userId: DEFAULT_USER_ID },
  });
  revalidatePath("/discover");
  return true;
}

// ==========================================
// 3. Track Study Sessions
// ==========================================

export async function getStudySessions(filter?: {
  focus?: string;
  referenceId?: string;
  artistId?: string;
  search?: string;
}): Promise<StudySessionData[]> {
  const whereClause: Record<string, unknown> = { userId: DEFAULT_USER_ID };

  if (filter?.focus && filter.focus !== "ALL") {
    whereClause.focus = filter.focus;
  }
  if (filter?.referenceId && filter.referenceId !== "ALL") {
    whereClause.referenceId = filter.referenceId;
  }
  if (filter?.artistId && filter.artistId !== "ALL") {
    whereClause.artistId = filter.artistId;
  }
  if (filter?.search && filter.search.trim()) {
    const q = filter.search.trim();
    whereClause.OR = [
      { observations: { contains: q } },
      { techniques: { contains: q } },
      { whyItWorks: { contains: q } },
      { whatILearned: { contains: q } },
      { experimentIdea: { contains: q } },
      { takeaway: { contains: q } },
      { reference: { title: { contains: q } } },
      { reference: { creator: { contains: q } } },
      { artist: { name: { contains: q } } },
    ];
  }

  const sessions = await prisma.studySession.findMany({
    where: whereClause,
    include: {
      reference: { include: { artist: true } },
      artist: true,
      skill: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return sessions.map((s) => ({
    id: s.id,
    userId: s.userId,
    referenceId: s.referenceId,
    reference: s.reference
      ? {
          id: s.reference.id,
          userId: s.reference.userId,
          type: s.reference.type as ReferenceType,
          title: s.reference.title,
          creator: s.reference.creator,
          artistId: s.reference.artistId,
          year: s.reference.year,
          url: s.reference.url,
          album: s.reference.album,
          genre: s.reference.genre,
          notes: s.reference.notes,
          tags: s.reference.tags,
          favorite: s.reference.favorite,
          createdAt: s.reference.createdAt.toISOString(),
          updatedAt: s.reference.updatedAt.toISOString(),
        }
      : null,
    artistId: s.artistId,
    artist: s.artist
      ? {
          id: s.artist.id,
          userId: s.artist.userId,
          name: s.artist.name,
          role: s.artist.role,
          notes: s.artist.notes,
          status: s.artist.status as ArtistStatus,
          genres: s.artist.genres,
          tags: s.artist.tags,
          favorite: s.artist.favorite,
          createdAt: s.artist.createdAt.toISOString(),
          updatedAt: s.artist.updatedAt.toISOString(),
        }
      : null,
    focus: s.focus as StudyFocus,
    customFocus: s.customFocus,
    startedAt: s.startedAt.toISOString(),
    completedAt: s.completedAt?.toISOString() || null,
    durationSeconds: s.durationSeconds,
    observations: s.observations,
    techniques: s.techniques,
    favoriteSection: s.favoriteSection,
    whyItWorks: s.whyItWorks,
    whatSurprisedMe: s.whatSurprisedMe,
    whatILearned: s.whatILearned,
    experimentIdea: s.experimentIdea,
    takeaway: s.takeaway,
    rating: s.rating,
    skillId: s.skillId,
    skill: s.skill
      ? {
          id: s.skill.id,
          name: s.skill.name,
          slug: s.skill.slug,
          category: s.skill.category as SkillCategory,
          description: s.skill.description,
        }
      : null,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }));
}

export async function getStudySession(id: string): Promise<StudySessionData | null> {
  const s = await prisma.studySession.findFirst({
    where: { id, userId: DEFAULT_USER_ID },
    include: {
      reference: { include: { artist: true } },
      artist: true,
      skill: true,
    },
  });
  if (!s) return null;

  return {
    id: s.id,
    userId: s.userId,
    referenceId: s.referenceId,
    reference: s.reference
      ? {
          id: s.reference.id,
          userId: s.reference.userId,
          type: s.reference.type as ReferenceType,
          title: s.reference.title,
          creator: s.reference.creator,
          artistId: s.reference.artistId,
          year: s.reference.year,
          url: s.reference.url,
          album: s.reference.album,
          genre: s.reference.genre,
          notes: s.reference.notes,
          tags: s.reference.tags,
          favorite: s.reference.favorite,
          createdAt: s.reference.createdAt.toISOString(),
          updatedAt: s.reference.updatedAt.toISOString(),
        }
      : null,
    artistId: s.artistId,
    artist: s.artist
      ? {
          id: s.artist.id,
          userId: s.artist.userId,
          name: s.artist.name,
          role: s.artist.role,
          notes: s.artist.notes,
          status: s.artist.status as ArtistStatus,
          genres: s.artist.genres,
          tags: s.artist.tags,
          favorite: s.artist.favorite,
          createdAt: s.artist.createdAt.toISOString(),
          updatedAt: s.artist.updatedAt.toISOString(),
        }
      : null,
    focus: s.focus as StudyFocus,
    customFocus: s.customFocus,
    startedAt: s.startedAt.toISOString(),
    completedAt: s.completedAt?.toISOString() || null,
    durationSeconds: s.durationSeconds,
    observations: s.observations,
    techniques: s.techniques,
    favoriteSection: s.favoriteSection,
    whyItWorks: s.whyItWorks,
    whatSurprisedMe: s.whatSurprisedMe,
    whatILearned: s.whatILearned,
    experimentIdea: s.experimentIdea,
    takeaway: s.takeaway,
    rating: s.rating,
    skillId: s.skillId,
    skill: s.skill
      ? {
          id: s.skill.id,
          name: s.skill.name,
          slug: s.skill.slug,
          category: s.skill.category as SkillCategory,
          description: s.skill.description,
        }
      : null,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  };
}

export async function createStudySession(input: {
  referenceId?: string | null;
  artistId?: string | null;
  focus: StudyFocus;
  customFocus?: string | null;
  durationSeconds: number;
  observations?: string | null;
  techniques?: string | null;
  favoriteSection?: string | null;
  whyItWorks?: string | null;
  whatSurprisedMe?: string | null;
  whatILearned?: string | null;
  experimentIdea?: string | null;
  takeaway?: string | null;
  rating?: number | null;
  skillId?: string | null;
}): Promise<StudySessionData> {
  const session = await prisma.studySession.create({
    data: {
      userId: DEFAULT_USER_ID,
      referenceId: input.referenceId || null,
      artistId: input.artistId || null,
      focus: input.focus,
      customFocus: input.customFocus?.trim() || null,
      durationSeconds: input.durationSeconds || 0,
      completedAt: new Date(),
      observations: input.observations?.trim() || null,
      techniques: input.techniques?.trim() || null,
      favoriteSection: input.favoriteSection?.trim() || null,
      whyItWorks: input.whyItWorks?.trim() || null,
      whatSurprisedMe: input.whatSurprisedMe?.trim() || null,
      whatILearned: input.whatILearned?.trim() || null,
      experimentIdea: input.experimentIdea?.trim() || null,
      takeaway: input.takeaway?.trim() || null,
      rating: input.rating ? Number(input.rating) : null,
      skillId: input.skillId || null,
    },
    include: {
      reference: true,
      artist: true,
      skill: true,
    },
  });

  // Auto-log CreativeActivity to maintain artist streak & study minutes
  const today = getTodayDateString();
  const durationMins = Math.max(1, Math.round(input.durationSeconds / 60));
  const studyTitle = session.reference
    ? `Studied "${session.reference.title}" by ${session.reference.creator}`
    : `Studied ${input.focus} Technique`;

  await prisma.creativeActivity.create({
    data: {
      userId: DEFAULT_USER_ID,
      type: "LISTENING",
      title: studyTitle,
      description: input.takeaway || input.whatILearned || input.observations?.slice(0, 120),
      durationMinutes: durationMins,
      date: today,
      completed: true,
    },
  });

  revalidatePath("/discover");
  revalidatePath("/");
  return {
    id: session.id,
    userId: session.userId,
    referenceId: session.referenceId,
    artistId: session.artistId,
    focus: session.focus as StudyFocus,
    customFocus: session.customFocus,
    startedAt: session.startedAt.toISOString(),
    completedAt: session.completedAt?.toISOString() || null,
    durationSeconds: session.durationSeconds,
    observations: session.observations,
    techniques: session.techniques,
    favoriteSection: session.favoriteSection,
    whyItWorks: session.whyItWorks,
    whatSurprisedMe: session.whatSurprisedMe,
    whatILearned: session.whatILearned,
    experimentIdea: session.experimentIdea,
    takeaway: session.takeaway,
    rating: session.rating,
    skillId: session.skillId,
    createdAt: session.createdAt.toISOString(),
    updatedAt: session.updatedAt.toISOString(),
  };
}

export async function deleteStudySession(id: string): Promise<boolean> {
  await prisma.studySession.delete({
    where: { id, userId: DEFAULT_USER_ID },
  });
  revalidatePath("/discover");
  return true;
}

// ==========================================
// 4. Album Architecture Studies
// ==========================================

export async function getAlbumStudies(): Promise<AlbumStudyData[]> {
  const studies = await prisma.albumStudy.findMany({
    where: { userId: DEFAULT_USER_ID },
    include: {
      reference: { include: { artist: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return studies.map((s) => ({
    id: s.id,
    userId: s.userId,
    referenceId: s.referenceId,
    reference: {
      id: s.reference.id,
      userId: s.reference.userId,
      type: s.reference.type as ReferenceType,
      title: s.reference.title,
      creator: s.reference.creator,
      artistId: s.reference.artistId,
      year: s.reference.year,
      url: s.reference.url,
      album: s.reference.album,
      genre: s.reference.genre,
      notes: s.reference.notes,
      tags: s.reference.tags,
      favorite: s.reference.favorite,
      createdAt: s.reference.createdAt.toISOString(),
      updatedAt: s.reference.updatedAt.toISOString(),
    },
    overallImpression: s.overallImpression,
    themes: s.themes,
    productionNotes: s.productionNotes,
    writingNotes: s.writingNotes,
    sequencingNotes: s.sequencingNotes,
    standoutTracks: s.standoutTracks,
    weakestTrack: s.weakestTrack,
    recurringTechniques: s.recurringTechniques,
    lessons: s.lessons,
    experimentIdeas: s.experimentIdeas,
    rating: s.rating,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }));
}

export async function createAlbumStudy(input: {
  referenceId: string;
  overallImpression?: string;
  themes?: string;
  productionNotes?: string;
  writingNotes?: string;
  sequencingNotes?: string;
  standoutTracks?: string;
  weakestTrack?: string;
  recurringTechniques?: string;
  lessons?: string;
  experimentIdeas?: string;
  rating?: number;
}): Promise<AlbumStudyData> {
  const study = await prisma.albumStudy.create({
    data: {
      userId: DEFAULT_USER_ID,
      referenceId: input.referenceId,
      overallImpression: input.overallImpression?.trim() || null,
      themes: input.themes?.trim() || null,
      productionNotes: input.productionNotes?.trim() || null,
      writingNotes: input.writingNotes?.trim() || null,
      sequencingNotes: input.sequencingNotes?.trim() || null,
      standoutTracks: input.standoutTracks?.trim() || null,
      weakestTrack: input.weakestTrack?.trim() || null,
      recurringTechniques: input.recurringTechniques?.trim() || null,
      lessons: input.lessons?.trim() || null,
      experimentIdeas: input.experimentIdeas?.trim() || null,
      rating: input.rating ? Number(input.rating) : null,
    },
    include: { reference: true },
  });

  // Auto-log activity
  const today = getTodayDateString();
  await prisma.creativeActivity.create({
    data: {
      userId: DEFAULT_USER_ID,
      type: "LISTENING",
      title: `Album Architecture Study: "${study.reference.title}"`,
      description: input.lessons || input.overallImpression?.slice(0, 120),
      durationMinutes: 45,
      date: today,
      completed: true,
    },
  });

  revalidatePath("/discover");
  return {
    id: study.id,
    userId: study.userId,
    referenceId: study.referenceId,
    overallImpression: study.overallImpression,
    themes: study.themes,
    productionNotes: study.productionNotes,
    writingNotes: study.writingNotes,
    sequencingNotes: study.sequencingNotes,
    standoutTracks: study.standoutTracks,
    weakestTrack: study.weakestTrack,
    recurringTechniques: study.recurringTechniques,
    lessons: study.lessons,
    experimentIdeas: study.experimentIdeas,
    rating: study.rating,
    createdAt: study.createdAt.toISOString(),
    updatedAt: study.updatedAt.toISOString(),
  };
}

export async function deleteAlbumStudy(id: string): Promise<boolean> {
  await prisma.albumStudy.delete({
    where: { id, userId: DEFAULT_USER_ID },
  });
  revalidatePath("/discover");
  return true;
}

// ==========================================
// 5. Listening Diary Actions
// ==========================================

export async function getListeningEntries(limit = 50): Promise<ListeningEntryData[]> {
  const entries = await prisma.listeningEntry.findMany({
    where: { userId: DEFAULT_USER_ID },
    include: { reference: true },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    take: limit,
  });

  return entries.map((e) => ({
    id: e.id,
    userId: e.userId,
    referenceId: e.referenceId,
    reference: e.reference
      ? {
          id: e.reference.id,
          userId: e.reference.userId,
          type: e.reference.type as ReferenceType,
          title: e.reference.title,
          creator: e.reference.creator,
          artistId: e.reference.artistId,
          year: e.reference.year,
          url: e.reference.url,
          album: e.reference.album,
          genre: e.reference.genre,
          notes: e.reference.notes,
          tags: e.reference.tags,
          favorite: e.reference.favorite,
          createdAt: e.reference.createdAt.toISOString(),
          updatedAt: e.reference.updatedAt.toISOString(),
        }
      : null,
    title: e.title,
    creator: e.creator,
    date: e.date,
    durationMinutes: e.durationMinutes,
    purpose: e.purpose as ListeningPurpose,
    mood: e.mood,
    reaction: e.reaction,
    studyWorthy: e.studyWorthy,
    notes: e.notes,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  }));
}

export async function createListeningEntry(input: {
  referenceId?: string | null;
  title: string;
  creator: string;
  date?: string;
  durationMinutes?: number;
  purpose?: ListeningPurpose;
  mood?: string | null;
  reaction?: string | null;
  studyWorthy?: boolean;
  notes?: string | null;
}): Promise<ListeningEntryData> {
  const dateStr = input.date || getTodayDateString();
  const entry = await prisma.listeningEntry.create({
    data: {
      userId: DEFAULT_USER_ID,
      referenceId: input.referenceId || null,
      title: input.title.trim(),
      creator: input.creator.trim(),
      date: dateStr,
      durationMinutes: input.durationMinutes || 15,
      purpose: input.purpose || "STUDY",
      mood: input.mood?.trim() || null,
      reaction: input.reaction?.trim() || null,
      studyWorthy: !!input.studyWorthy,
      notes: input.notes?.trim() || null,
    },
  });

  // Auto-log activity
  await prisma.creativeActivity.create({
    data: {
      userId: DEFAULT_USER_ID,
      type: "LISTENING",
      title: `Listened to "${input.title}" (${input.purpose || "STUDY"})`,
      description: input.reaction || input.notes,
      durationMinutes: input.durationMinutes || 15,
      date: dateStr,
      completed: true,
    },
  });

  revalidatePath("/discover");
  return {
    id: entry.id,
    userId: entry.userId,
    referenceId: entry.referenceId,
    title: entry.title,
    creator: entry.creator,
    date: entry.date,
    durationMinutes: entry.durationMinutes,
    purpose: entry.purpose as ListeningPurpose,
    mood: entry.mood,
    reaction: entry.reaction,
    studyWorthy: entry.studyWorthy,
    notes: entry.notes,
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  };
}

export async function deleteListeningEntry(id: string): Promise<boolean> {
  await prisma.listeningEntry.delete({
    where: { id, userId: DEFAULT_USER_ID },
  });
  revalidatePath("/discover");
  return true;
}

// ==========================================
// 6. Discovery Stats & Recommendations
// ==========================================

export async function getDiscoveryStats(): Promise<DiscoveryStatsData> {
  const [referencesCount, artistsCount, studySessions, listeningEntriesCount] =
    await Promise.all([
      prisma.artistReference.count({ where: { userId: DEFAULT_USER_ID } }),
      prisma.artist.count({ where: { userId: DEFAULT_USER_ID } }),
      prisma.studySession.findMany({
        where: { userId: DEFAULT_USER_ID },
        select: { durationSeconds: true, focus: true },
      }),
      prisma.listeningEntry.count({ where: { userId: DEFAULT_USER_ID } }),
    ]);

  const totalStudySeconds = studySessions.reduce(
    (acc, s) => acc + s.durationSeconds,
    0
  );
  const activeFocusMap = new Map<string, number>();
  for (const s of studySessions) {
    activeFocusMap.set(s.focus, (activeFocusMap.get(s.focus) || 0) + 1);
  }

  const topFocus = Array.from(activeFocusMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map((e) => e[0])
    .slice(0, 4);

  return {
    totalReferences: referencesCount,
    totalArtistsStudied: artistsCount,
    totalStudySessions: studySessions.length,
    totalStudyMinutes: Math.round(totalStudySeconds / 60),
    activeStudyFocus: topFocus.length > 0 ? topFocus : ["FLOW", "CADENCE", "WRITING"],
    listeningEntriesCount,
  };
}

export async function getTodayStudyRecommendation(): Promise<TodayStudyRecommendation> {
  // Find top reference marked as favorite or with few studies
  const ref = await prisma.artistReference.findFirst({
    where: { userId: DEFAULT_USER_ID },
    include: {
      artist: true,
      studySessions: { select: { id: true } },
    },
    orderBy: [{ favorite: "desc" }, { createdAt: "desc" }],
  });

  const artist = ref?.artist
    ? {
        id: ref.artist.id,
        userId: ref.artist.userId,
        name: ref.artist.name,
        role: ref.artist.role,
        notes: ref.artist.notes,
        status: ref.artist.status as ArtistStatus,
        genres: ref.artist.genres,
        tags: ref.artist.tags,
        favorite: ref.artist.favorite,
        createdAt: ref.artist.createdAt.toISOString(),
        updatedAt: ref.artist.updatedAt.toISOString(),
      }
    : null;

  const refData: ArtistReferenceData | null = ref
    ? {
        id: ref.id,
        userId: ref.userId,
        type: ref.type as ReferenceType,
        title: ref.title,
        creator: ref.creator,
        artistId: ref.artistId,
        artist,
        year: ref.year,
        url: ref.url,
        album: ref.album,
        genre: ref.genre,
        notes: ref.notes,
        tags: ref.tags,
        favorite: ref.favorite,
        studySessionCount: ref.studySessions.length,
        createdAt: ref.createdAt.toISOString(),
        updatedAt: ref.updatedAt.toISOString(),
      }
    : null;

  return {
    reference: refData,
    artist,
    focus: "CADENCE",
    reason: ref
      ? `Study the vocal phrasing and metric divisions in "${ref.title}" by ${ref.creator}`
      : "Study the flow switches and rhyme density of classic rap masterworks.",
    suggestedAction: "Conduct 15-min deep song anatomy dissection",
  };
}

// ==========================================
// 7. STUDY → PRACTICE CONVERSION ENGINE
// ==========================================

export async function convertStudyToPractice(input: {
  studySessionId: string;
  targetType: "DRILL" | "WRITING" | "SONG" | "CAPTURE";
  skillId?: string;
  promptTitle?: string;
  customPrompt?: string;
}): Promise<{ success: boolean; redirectUrl: string; message: string }> {
  const study = await prisma.studySession.findFirst({
    where: { id: input.studySessionId, userId: DEFAULT_USER_ID },
    include: { reference: true, artist: true, skill: true },
  });

  if (!study) {
    throw new Error("Study session not found");
  }

  const observationText =
    study.experimentIdea ||
    study.whatILearned ||
    study.techniques ||
    study.observations ||
    "Apply technique from study session";

  const titlePrefix = study.reference
    ? `Study Drift: ${study.reference.title}`
    : `Study Application: ${study.focus}`;

  if (input.targetType === "WRITING") {
    // Create Writing Document in Phase 2 Creative Workspace
    const doc = await prisma.writingDocument.create({
      data: {
        userId: DEFAULT_USER_ID,
        title: input.promptTitle || `${titlePrefix} (Draft)`,
        content: `// Study Focus: ${study.focus}\n// Technique: ${study.techniques || "N/A"}\n// Observation Prompt:\n// ${observationText}\n\n`,
        type: "BARS",
        status: "DRAFT",
        tags: `study,${study.focus.toLowerCase()}`,
      },
    });
    revalidatePath("/create");
    return {
      success: true,
      redirectUrl: `/create/write/${doc.id}`,
      message: "Writing draft initialized with study prompt.",
    };
  }

  if (input.targetType === "SONG") {
    // Create Song in Phase 2 Workspace
    const song = await prisma.song.create({
      data: {
        userId: DEFAULT_USER_ID,
        title: input.promptTitle || `${titlePrefix} (Concept)`,
        concept: observationText,
        status: "IDEA",
        genre: study.reference?.genre || "Hip-Hop",
        notes: `Derived from Study Session (${study.focus}). Takeaway: ${study.takeaway || "N/A"}`,
        sections: {
          create: [
            { type: "HOOK", name: "Hook", orderIndex: 0 },
            { type: "VERSE", name: "Verse 1", orderIndex: 1 },
          ],
        },
      },
    });
    revalidatePath("/create");
    return {
      success: true,
      redirectUrl: `/create/songs/${song.id}`,
      message: "Song workspace created from study concept.",
    };
  }

  if (input.targetType === "CAPTURE") {
    // Create QuickCapture
    await prisma.quickCapture.create({
      data: {
        userId: DEFAULT_USER_ID,
        type: "IDEA",
        title: input.promptTitle || titlePrefix,
        content: `${study.focus} Takeaway:\n${observationText}\nExperiment Idea: ${study.experimentIdea || "N/A"}`,
        tags: `study,${study.focus.toLowerCase()}`,
        status: "INBOX",
      },
    });
    revalidatePath("/create");
    return {
      success: true,
      redirectUrl: `/create?tab=inbox`,
      message: "Study insight saved to Creative Inbox.",
    };
  }

  // Target: DRILL
  // Redirect to /train with target skill or category
  const targetCategory =
    study.focus === "FLOW" || study.focus === "CADENCE" || study.focus === "DELIVERY"
      ? "FLOW"
      : study.focus === "PRODUCTION" || study.focus === "ARRANGEMENT" || study.focus === "SAMPLING"
      ? "PRODUCTION"
      : "WRITING";

  return {
    success: true,
    redirectUrl: `/train?category=${targetCategory}`,
    message: `Redirecting to ${targetCategory} drills in Training Gymnasium.`,
  };
}
