"use server";

import { prisma } from "@/lib/db";
import { ProfileData } from "@/lib/types";
import { revalidatePath } from "next/cache";

const DEFAULT_USER_ID = "prime-artist-user";

export async function getProfile(): Promise<ProfileData> {
  let user = await prisma.user.findUnique({
    where: { id: DEFAULT_USER_ID },
    include: { profile: true },
  });

  if (!user || !user.profile) {
    user = await prisma.user.upsert({
      where: { id: DEFAULT_USER_ID },
      create: {
        id: DEFAULT_USER_ID,
        name: "Harry",
        email: "artist@prime.os",
        profile: {
          create: {
            displayName: "Harry",
            artistName: "HARRY / PRIME",
            bio: "Songwriter, rapper, music producer, and lyricist building a classic catalog.",
            disciplines: JSON.stringify(["Rap", "Songwriting", "Music Production", "Writing"]),
            currentFocus: "BUILD MY MUSIC CAREER & FINISH MY DEBUT EP",
            vision: "Create timeless music with surgical lyrical precision, hypnotic cadence, and rich production architecture.",
          },
        },
      },
      update: {},
      include: { profile: true },
    });
  }

  const p = user.profile!;
  let parsedDisciplines: string[] = [];
  try {
    parsedDisciplines = JSON.parse(p.disciplines);
  } catch {
    parsedDisciplines = ["Rap", "Songwriting", "Music Production", "Writing"];
  }

  return {
    id: p.id,
    userId: p.userId,
    displayName: p.displayName,
    artistName: p.artistName,
    bio: p.bio,
    disciplines: parsedDisciplines,
    currentFocus: p.currentFocus,
    vision: p.vision,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

export async function updateProfile(data: {
  displayName: string;
  artistName: string;
  bio: string;
  disciplines: string[];
  currentFocus: string;
  vision: string;
}) {
  const profile = await prisma.profile.update({
    where: { userId: DEFAULT_USER_ID },
    data: {
      displayName: data.displayName.trim(),
      artistName: data.artistName.trim(),
      bio: data.bio.trim(),
      disciplines: JSON.stringify(data.disciplines),
      currentFocus: data.currentFocus.trim(),
      vision: data.vision.trim(),
    },
  });

  revalidatePath("/");
  revalidatePath("/profile");
  revalidatePath("/settings");
  return profile;
}
