import { PrismaClient } from "@prisma/client";
import { format, subDays } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding PRIME database with Phase 1 & 2 models...");

  // Clean existing data
  await prisma.projectSong.deleteMany();
  await prisma.creativeProject.deleteMany();
  await prisma.songSection.deleteMany();
  await prisma.song.deleteMany();
  await prisma.writingDocument.deleteMany();
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

  // Create Creative Activities
  await prisma.creativeActivity.createMany({
    data: [
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
      {
        userId: user.id,
        type: "PRODUCTION",
        title: "Synth Pad & Atmosphere Sound Design",
        description: "Created lush granular textures using Prophet V and analog tape emulation.",
        durationMinutes: 60,
        date: threeDaysAgoStr,
        completed: true,
      },
      {
        userId: user.id,
        type: "READING",
        title: "'The Creative Act: A Way of Being' — Chapter 8-10",
        description: "Notes on reducing friction and letting the subconscious guide the first draft.",
        durationMinutes: 35,
        date: fourDaysAgoStr,
        completed: true,
      },
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
        title: "Cold Titanium Line",
        type: "LYRIC",
        content: "Cold titanium in the baseline / Turn the pressure into rhythm when they try to trace mine.",
        tags: "bars, verse-2, obsidian",
        status: "INBOX",
      },
      {
        userId: user.id,
        title: "Low Harmony Drop",
        type: "HOOK",
        content: "Melody idea: Low octave harmony entering on bar 3 with heavy reverb tail, dropping into a clean dry vocal.",
        tags: "arrangement, vocal, melody",
        status: "IN_PROGRESS",
      },
      {
        userId: user.id,
        title: "Zero Floor Concept",
        type: "SONG_IDEA",
        content: "Concept: 'Zero Floor' — A narrative about building from scratch when everyone thinks you started on the top floor.",
        tags: "concept, ep-track",
        status: "INBOX",
      },
      {
        userId: user.id,
        title: "Vinyl Crackle + 808 Layer",
        type: "IDEA",
        content: "Try sampling vinyl crackle layered behind a detuned 808 slide for the second drop.",
        tags: "production, 808",
        status: "INBOX",
      },
    ],
  });

  // Phase 2: Create Writing Documents
  await prisma.writingDocument.createMany({
    data: [
      {
        userId: user.id,
        title: "Late Night Stream: The Price of Craft",
        content: `Nobody sees the hours in the quiet.
When the screen is the only lantern in the room,
and the drum loop repeats for the four-hundredth time.
You think you're chasing perfection, but you're really chasing honesty.
Every bar is a mirror you can't lie to.

If the cadence doesn't land on the one,
the emotion won't land on the chest.
Keep the pencil sharp, strip the excess adjectives,
let the cadence carry the weight of the confession.`,
        type: "FREE_WRITE",
        status: "IN_PROGRESS",
        tags: "mindset, craft, raw",
        wordCount: 77,
        characterCount: 462,
      },
      {
        userId: user.id,
        title: "16 Bars: 'Architectural Blueprint'",
        content: `Foundations in the concrete, blueprint in the bone
Turned every single setback to a cornerstone
They looking for the shortcut, I'm pacing out the steps
Calibrated in the shadows, heavy with the depth.

Syllables like masonry, rhythm like the steel
Never had to fake the narrative to make it feel
Pressure make diamonds or it crush you in the drift
I took the whole weight and turned it to a lift.`,
        type: "BARS",
        status: "FINISHED",
        tags: "bars, hard, precision, 16s",
        wordCount: 68,
        characterCount: 418,
      },
      {
        userId: user.id,
        title: "Hook Draft: 'All Gravity'",
        content: `Pulling down the stars when the night gets cold
Everything we built wasn't made to be sold
Tell 'em watch the ground when the cadence breaks
We ain't looking for applause, we just raising the stakes.`,
        type: "HOOK",
        status: "IN_PROGRESS",
        tags: "hook, anthem, melodic",
        wordCount: 38,
        characterCount: 228,
      },
    ],
  });

  // Phase 2: Create Songs with modular sections
  const song1 = await prisma.song.create({
    data: {
      userId: user.id,
      title: "Obsidian Skies",
      concept: "The journey of building art under crushing pressure, finding beauty in high-gravity environments.",
      status: "WRITING",
      genre: "Cinematic Hip-Hop",
      bpm: 88,
      musicalKey: "D Minor",
      mood: "Dark, Relentless, Triumphant",
      nextAction: "Complete the 2nd half of Verse 2 with internal rhymes",
      tags: "ep-lead, dark, drums",
      notes: "Feature a low sub bass drop on bar 9 of Verse 1. Keep the vocal completely centered and dry.",
      wordCount: 165,
    },
  });

  await prisma.songSection.createMany({
    data: [
      {
        songId: song1.id,
        type: "INTRO",
        name: "Intro & Ambient Build",
        content: "[Low pad swell in D Minor with vinyl hiss]\nYeah... PRIME OS.\nLet the tape roll.",
        orderIndex: 0,
        collapsed: false,
        wordCount: 15,
      },
      {
        songId: song1.id,
        type: "HOOK",
        name: "Main Hook",
        content: `Underneath obsidian skies, we don't look down
Turn the heavy metal into gold right through the sound
Every single scar is a signature we signed
Left the noise behind just to redesign the mind.`,
        orderIndex: 1,
        collapsed: false,
        wordCount: 36,
      },
      {
        songId: song1.id,
        type: "VERSE",
        name: "Verse 1 (16 Bars)",
        content: `Stepping out the elevator at the highest floor
Never had a blueprint knocking at the master door
Iron in the furnace, friction on the vocal cord
Turn the quiet hours into monuments we can't afford to lose.

Calculated cadence with the heavy shoes
Never gave a damn about the algorithm news
Built the whole catalog block by solid block
Now the rhythm ticking like an atomic clock.`,
        orderIndex: 2,
        collapsed: false,
        wordCount: 68,
      },
      {
        songId: song1.id,
        type: "VERSE",
        name: "Verse 2 (In Progress)",
        content: `Cold titanium in the baseline
Turn the pressure into rhythm when they try to trace mine
Internal depravity colliding with the gravity
Rebuilding all the shattered pieces of the sanity...`,
        orderIndex: 3,
        collapsed: false,
        wordCount: 32,
      },
      {
        songId: song1.id,
        type: "OUTRO",
        name: "Outro Fade",
        content: "[808 sustained tail fades out into rain textures]",
        orderIndex: 4,
        collapsed: true,
        wordCount: 8,
      },
    ],
  });

  const song2 = await prisma.song.create({
    data: {
      userId: user.id,
      title: "Zero Floor",
      concept: "Starting from absolute ground level when everyone assumes you had an easy head start.",
      status: "CONCEPT",
      genre: "Rap / Soul Sample",
      bpm: 92,
      musicalKey: "F Minor",
      mood: "Soulful, Reflective, Gritty",
      nextAction: "Write Verse 1 storytelling arc",
      tags: "soul, sample, story",
      wordCount: 42,
    },
  });

  await prisma.songSection.createMany({
    data: [
      {
        songId: song2.id,
        type: "HOOK",
        name: "Main Hook",
        content: `They think I jumped in at the top floor
Never saw the steps behind the back door
Counted every penny on the cold tile
Now we making every single mile worthwhile.`,
        orderIndex: 0,
        collapsed: false,
        wordCount: 34,
      },
      {
        songId: song2.id,
        type: "NOTES",
        name: "Concept Direction",
        content: "Sample chopped vocal flip from old 70s soul record. Keep drums unquantized with MPC swing.",
        orderIndex: 1,
        collapsed: false,
        wordCount: 16,
      },
    ],
  });

  // Phase 2: Create Creative Project & attach Songs
  const project = await prisma.creativeProject.create({
    data: {
      userId: user.id,
      title: "THE OBSIDIAN TAPE",
      description: "6-Track debut EP showcasing dark atmospheric production, dense lyrical storytelling, and cinematic cadences.",
      type: "EP",
      status: "IN_PROGRESS",
      targetDate: "2026-11-30",
      notes: "Release strategy: Track 1 (Intro) → Track 2 (Obsidian Skies) → Track 3 (Zero Floor).",
    },
  });

  await prisma.projectSong.createMany({
    data: [
      {
        projectId: project.id,
        songId: song1.id,
        trackNumber: 1,
        notes: "Lead single candidate",
      },
      {
        projectId: project.id,
        songId: song2.id,
        trackNumber: 2,
        notes: "Soulful midpoint contrast",
      },
    ],
  });

  console.log("Phase 1 & 2 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
