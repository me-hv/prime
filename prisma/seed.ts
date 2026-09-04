import { PrismaClient } from "@prisma/client";
import { format, subDays } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding PRIME database...");

  // Clean existing data
  await prisma.quickCapture.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.creativeActivity.deleteMany();
  await prisma.dailyMission.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // Create default user
  const user = await prisma.user.create({
    data: {
      id: "prime-artist-user",
      name: "Harry",
      email: "artist@prime.os",
      profile: {
        create: {
          displayName: "Harry",
          artistName: "HARRY / PRIME",
          bio: "Songwriter, rapper, music producer, and lyricist building a classic catalog.",
          disciplines: JSON.stringify([
            "Rap",
            "Songwriting",
            "Music Production",
            "Writing",
          ]),
          currentFocus: "BUILD MY MUSIC CAREER & FINISH MY DEBUT EP",
          vision:
            "Create timeless music with surgical lyrical precision, hypnotic cadence, and rich production architecture. Ship finished projects consistently.",
        },
      },
    },
  });

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const yesterdayStr = format(subDays(new Date(), 1), "yyyy-MM-dd");
  const twoDaysAgoStr = format(subDays(new Date(), 2), "yyyy-MM-dd");
  const threeDaysAgoStr = format(subDays(new Date(), 3), "yyyy-MM-dd");
  const fourDaysAgoStr = format(subDays(new Date(), 4), "yyyy-MM-dd");
  const fiveDaysAgoStr = format(subDays(new Date(), 5), "yyyy-MM-dd");

  // Create Today's Mission
  await prisma.dailyMission.create({
    data: {
      userId: user.id,
      date: todayStr,
      title: "Write and record the second verse for 'Obsidian Skies'",
      description: "Focus on internal rhyme schemes in the first 8 bars and lock into the pocket with dynamic vocal cadences.",
      completed: false,
    },
  });

  // Yesterday's Mission (Completed)
  await prisma.dailyMission.create({
    data: {
      userId: user.id,
      date: yesterdayStr,
      title: "Arrange drum section & bassline transition for intro track",
      description: "Sidechain the 808 to the punchy kick and add ghost snare rolls.",
      completed: true,
      completedAt: new Date(Date.now() - 86400000),
    },
  });

  // Create Goals
  await prisma.goal.createMany({
    data: [
      {
        userId: user.id,
        title: "Finish Debut EP (6 Tracks)",
        description: "Complete all 6 songs including mixing and vocal arrangements.",
        category: "MUSIC",
        status: "IN_PROGRESS",
        currentProgress: 3,
        targetProgress: 6,
        unit: "songs",
        targetDate: "2026-11-30",
      },
      {
        userId: user.id,
        title: "Write 10 Masterclass 16-Bar Verses",
        description: "Study multis, cadence shifts, and storytelling with zero filler lines.",
        category: "WRITING",
        status: "IN_PROGRESS",
        currentProgress: 6,
        targetProgress: 10,
        unit: "verses",
        targetDate: "2026-10-15",
      },
      {
        userId: user.id,
        title: "Build Drum Kit & Sound Architecture Library",
        description: "Curate 50 bespoke 808s, kicks, snares, and melodic textures in Ableton/Logic.",
        category: "PRODUCTION",
        status: "IN_PROGRESS",
        currentProgress: 32,
        targetProgress: 50,
        unit: "sounds",
        targetDate: "2026-10-01",
      },
      {
        userId: user.id,
        title: "Daily Cadence & Breath Control Practice",
        description: "30-minute daily vocal agility and cadence drill routines.",
        category: "RAP",
        status: "IN_PROGRESS",
        currentProgress: 18,
        targetProgress: 30,
        unit: "days",
        targetDate: "2026-09-30",
      },
    ],
  });

  // Create Creative Activities across the past days
  await prisma.creativeActivity.createMany({
    data: [
      // Today's activities
      {
        userId: user.id,
        type: "WRITING",
        title: "16 Bars for 'Obsidian Skies' - Verse 2 Concept",
        description: "Wrote first 8 bars exploring the internal rhyme scheme on 'gravity/depravity'.",
        durationMinutes: 45,
        date: todayStr,
        completed: true,
      },
      {
        userId: user.id,
        type: "LISTENING",
        title: "Nas & Kendrick Lamar — Cadence Study",
        description: "Studied syncopated triplet flows and pocket transitions in 'good kid, m.A.A.d city'.",
        durationMinutes: 30,
        date: todayStr,
        completed: true,
      },
      // Yesterday
      {
        userId: user.id,
        type: "PRODUCTION",
        title: "Drum arrangement & 808 layering for 'Obsidian Skies'",
        description: "Dialed in punchy transient shaping on the kick and saturated the 808 sub.",
        durationMinutes: 75,
        date: yesterdayStr,
        completed: true,
      },
      {
        userId: user.id,
        type: "PRACTICE",
        title: "Freestyle & Metronome Flow Drills",
        description: "Trained pocket variations at 88 BPM and 140 BPM with syllable elasticity.",
        durationMinutes: 30,
        date: yesterdayStr,
        completed: true,
      },
      // 2 days ago
      {
        userId: user.id,
        type: "WRITING",
        title: "Hook development for Track 4",
        description: "Fleshed out a 4-bar melodic hook with vocal layers.",
        durationMinutes: 50,
        date: twoDaysAgoStr,
        completed: true,
      },
      {
        userId: user.id,
        type: "RECORDING",
        title: "Demo vocal scratch track",
        description: "Recorded guide vocals to test melodies against the chord progression.",
        durationMinutes: 40,
        date: twoDaysAgoStr,
        completed: true,
      },
      // 3 days ago
      {
        userId: user.id,
        type: "PRODUCTION",
        title: "Synth Pad & Atmosphere Sound Design",
        description: "Created lush granular textures using Prophet V and analog tape emulation.",
        durationMinutes: 60,
        date: threeDaysAgoStr,
        completed: true,
      },
      // 4 days ago
      {
        userId: user.id,
        type: "READING",
        title: "'The Creative Act: A Way of Being' — Chapter 8-10",
        description: "Notes on reducing friction and letting the subconscious guide the first draft.",
        durationMinutes: 35,
        date: fourDaysAgoStr,
        completed: true,
      },
      // 5 days ago
      {
        userId: user.id,
        type: "REFLECTION",
        title: "Weekly Artist Retrospective & Mindset Audit",
        description: "Assessed output volume vs. perfectionism. Decided to prioritize speed of finishing.",
        durationMinutes: 25,
        date: fiveDaysAgoStr,
        completed: true,
      },
    ],
  });

  // Create Quick Captures
  await prisma.quickCapture.createMany({
    data: [
      {
        userId: user.id,
        type: "LYRIC",
        content: "Cold titanium in the baseline / Turn the pressure into rhythm when they try to trace mine.",
        tags: "bars, verse-2, obsidian",
      },
      {
        userId: user.id,
        type: "HOOK",
        content: "Melody idea: Low octave harmony entering on bar 3 with heavy reverb tail, dropping into a clean dry vocal.",
        tags: "arrangement, vocal, melody",
      },
      {
        userId: user.id,
        type: "SONG_IDEA",
        content: "Concept: 'Zero Floor' — A narrative about building from scratch when everyone thinks you started on the top floor.",
        tags: "concept, ep-track",
      },
      {
        userId: user.id,
        type: "IDEA",
        content: "Try sampling vinyl crackle layered behind a detuned 808 slide for the second drop.",
        tags: "production, 808",
      },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
