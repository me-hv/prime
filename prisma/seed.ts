import { PrismaClient } from "@prisma/client";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding PRIME database with Phase 1, 2 & 3 models...");

  // Clean existing data in reverse relational order
  await prisma.milestone.deleteMany();
  await prisma.breakthrough.deleteMany();
  await prisma.bottleneck.deleteMany();
  await prisma.weeklyReview.deleteMany();
  await prisma.dailyReflection.deleteMany();
  await prisma.listeningEntry.deleteMany();
  await prisma.albumStudy.deleteMany();
  await prisma.studySession.deleteMany();
  await prisma.artistReference.deleteMany();
  await prisma.artist.deleteMany();
  await prisma.vocabularyEntry.deleteMany();
  await prisma.rhymeEntry.deleteMany();
  await prisma.rhymeChain.deleteMany();
  await prisma.trainingSession.deleteMany();
  await prisma.exerciseSkill.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.skill.deleteMany();
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

  // 1. Create default user
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

  // 2. Create Today's Mission
  await prisma.dailyMission.create({
    data: {
      userId: user.id,
      date: todayStr,
      title: "Complete 10-Min Rapid 16-Bar Sprint & Record Second Verse for 'Obsidian Skies'",
      description: "Warm up with a 10-minute cadence drill at 90 BPM, then write the second verse focusing on multi-syllabic rhyme chains.",
      completed: false,
    },
  });

  // 3. Create Creative Activities
  await prisma.creativeActivity.createMany({
    data: [
      {
        userId: user.id,
        type: "PRACTICE",
        title: "Metronome Pocket Lock & Flow Drills (90 BPM)",
        description: "Practiced 4-bar pocket transitions and syncopated cadence switches.",
        durationMinutes: 30,
        date: todayStr,
        completed: true,
      },
      {
        userId: user.id,
        type: "WRITING",
        title: "10-Minute Rapid 16-Bar Sprint: 'Zero Floor Reflections'",
        description: "Zero-editing instinct sprint exploring the early grind in Manchester.",
        durationMinutes: 20,
        date: todayStr,
        completed: true,
      },
      {
        userId: user.id,
        type: "PRODUCTION",
        title: "Arranged 8-Bar Melodic Hook for 'Obsidian Skies'",
        description: "Filtered rhodes, live sub bass articulation, and stereo vocal chops.",
        durationMinutes: 60,
        date: yesterdayStr,
        completed: true,
      },
      {
        userId: user.id,
        type: "WRITING",
        title: "Writing Studio: Drafted Hook for 'Zero Floor'",
        description: "Anthemic, grounded chorus about the sacrifice required for mastery.",
        durationMinutes: 45,
        date: yesterdayStr,
        completed: true,
      },
      {
        userId: user.id,
        type: "RECORDING",
        title: "Vocal Reference & Delivery Takes",
        description: "Tracked rough takes to test cadence bounce and pocket feel.",
        durationMinutes: 50,
        date: twoDaysAgoStr,
        completed: true,
      },
      {
        userId: user.id,
        type: "LISTENING",
        title: "Album Dissection: 'Illmatic' & 'Daytona'",
        description: "Analyzed rhyme density, pocket syncopation, and drum swing.",
        durationMinutes: 40,
        date: threeDaysAgoStr,
        completed: true,
      },
      {
        userId: user.id,
        type: "PRACTICE",
        title: "Freestyle 60-Second Word Prompter Drill",
        description: "Freestyled over 88 BPM boom-bap loop with continuous word injection.",
        durationMinutes: 25,
        date: fourDaysAgoStr,
        completed: true,
      },
      {
        userId: user.id,
        type: "REFLECTION",
        title: "Weekly Creative Retrospective & Cadence Audit",
        description: "Audited writing velocity and set targets for the EP rollout.",
        durationMinutes: 30,
        date: fiveDaysAgoStr,
        completed: true,
      },
    ],
  });

  // 4. Create Goals
  await prisma.goal.createMany({
    data: [
      {
        userId: user.id,
        title: "Write & Finish 6 Debut EP Tracks",
        description: "Full lyrics, arrangements, and finalized recordings for THE OBSIDIAN TAPE.",
        category: "MUSIC",
        status: "IN_PROGRESS",
        currentProgress: 2,
        targetProgress: 6,
        unit: "songs",
        targetDate: "2026-11-30",
      },
      {
        userId: user.id,
        title: "Complete 20 Daily 16-Bar Writing Sprints",
        description: "Deliberate writing speed and instinct development in the Training Gym.",
        category: "RAP",
        status: "IN_PROGRESS",
        currentProgress: 7,
        targetProgress: 20,
        unit: "sprints",
        targetDate: "2026-10-15",
      },
      {
        userId: user.id,
        title: "Log 50 Hours of Dedicated Production & Drills",
        description: "Arrangements, sound selection drills, and sample flips.",
        category: "PRODUCTION",
        status: "IN_PROGRESS",
        currentProgress: 24,
        targetProgress: 50,
        unit: "hours",
        targetDate: "2026-12-31",
      },
    ],
  });

  // 5. Create Quick Captures
  await prisma.quickCapture.createMany({
    data: [
      {
        userId: user.id,
        type: "LYRIC",
        title: "Obsidian Pocket Bar",
        content: "Turned the pressure into architecture, built the ceiling out of obsidian.",
        tags: "obsidian, cadence, punchline",
        status: "INBOX",
      },
      {
        userId: user.id,
        type: "HOOK",
        title: "No Safety Net Hook Idea",
        content: "Jumped without a parachute, learned to fly before the ground arrived.",
        tags: "hook, anthem",
        status: "INBOX",
      },
      {
        userId: user.id,
        type: "SONG_IDEA",
        title: "Midnight In Manchester",
        content: "Late night grime tempo (140 BPM) with orchestral strings and reflective storytelling.",
        tags: "concept, 140bpm, strings",
        status: "INBOX",
      },
    ],
  });

  // 6. Create Phase 2 Writing Documents
  const sprintDoc = await prisma.writingDocument.create({
    data: {
      userId: user.id,
      title: "16-Bar Sprint: The Pressure Line",
      content: `Built from the dust where the shadows divide
Kept my ambition locked tight on the inside
Never begged for a seat at the table they made
Carved my own path with a surgical blade
Clock on the wall ticking down every second
Heard every whisper and doubt that was reckoned
Turned every fracture to structural steel
Now tell me what part of this journey ain't real
Eight in the morning, the notebook is open
Spitting the truth that was never yet spoken
Pocket is tight like a snare on the one
We don't pack up till the masterpiece done
Concrete beneath me, the skyline is grey
Finding the light at the close of the day
Obsidian skies with the gold on the floor
Writing the legacy, opening doors.`,
      type: "BARS",
      status: "FINISHED",
      tags: "sprint, 16bars, cadence",
      wordCount: 128,
      characterCount: 680,
    },
  });

  const doc1 = await prisma.writingDocument.create({
    data: {
      userId: user.id,
      title: "The Price of Craft (Free Write)",
      content: `True craft doesn't negotiate with mood.
You sit at the desk when the fire is roaring, and you sit at the desk when there's only ash.
The difference between an amateur and a master is not inspiration — it is the refusal to leave the room until something honest exists.
Rhyme density is just muscle memory. The real work is having something to say that resonates ten years from now.`,
      type: "FREE_WRITE",
      status: "IN_PROGRESS",
      tags: "philosophy, craft, discipline",
      wordCount: 75,
      characterCount: 462,
    },
  });

  // 7. Create Phase 2 Songs & Sections
  const song1 = await prisma.song.create({
    data: {
      userId: user.id,
      title: "Obsidian Skies",
      concept: "A brooding, atmospheric anthem about relentless creative obsession under heavy northern skies.",
      status: "WRITING",
      genre: "Cinematic Hip-Hop / Rap",
      bpm: 90,
      musicalKey: "D Minor",
      mood: "Tense, resolute, atmospheric",
      nextAction: "Record final second verse takes and polish double tracking",
      tags: "lead single, cinematic, dark, ep",
      notes: "Lead track for THE OBSIDIAN TAPE EP. Drums have an unquantized boom-bap swing with heavy 808 sub.",
      wordCount: 210,
    },
  });

  await prisma.songSection.createMany({
    data: [
      {
        songId: song1.id,
        type: "HOOK",
        name: "Main Hook",
        content: `Underneath obsidian skies we ignite
Turning every shadow into blinding white light
No permission asked, no concession made
Everything we built was forged in the shade.`,
        orderIndex: 0,
        wordCount: 32,
      },
      {
        songId: song1.id,
        type: "VERSE",
        name: "Verse 1",
        content: `Came up through the cellar where the concrete breathes
Every single promise that the midnight leaves
Locked inside the temple with the 90 BPM
Every line a pillar that won't ever bend
Counted out the losses till the balance was clear
Turned the isolation into something severe.`,
        orderIndex: 1,
        wordCount: 45,
      },
    ],
  });

  const song2 = await prisma.song.create({
    data: {
      userId: user.id,
      title: "Zero Floor",
      concept: "Starting from nothing with no safety net and turning pure grit into timeless art.",
      status: "DEMO",
      genre: "Soulful Boom-Bap",
      bpm: 88,
      musicalKey: "G Minor",
      mood: "Triumphant, nostalgic",
      nextAction: "Track live brass reference",
      tags: "soul, sample, personal",
      wordCount: 140,
    },
  });

  // 8. Create Creative Project
  const project = await prisma.creativeProject.create({
    data: {
      userId: user.id,
      title: "THE OBSIDIAN TAPE EP",
      description: "A 6-track cinematic hip-hop body of work exploring discipline, ambition, and identity.",
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

  // ==========================================
  // 9. PHASE 3: Seed Skills
  // ==========================================
  console.log("Seeding Phase 3 Skills...");
  const skillsData = [
    // Rap & Delivery
    { name: "Flow", slug: "flow", category: "RAP", description: "Pocket precision, syncopation elasticity, rhythm locking across tempos." },
    { name: "Cadence", slug: "cadence", category: "RAP", description: "Melodic inflection, stress patterns, dynamic rhythmic variations in phrasing." },
    { name: "Pocket", slug: "pocket", category: "RAP", description: "Staying glued to the groove — pushing ahead, sitting dead center, or dragging behind." },
    { name: "Delivery & Projection", slug: "delivery", category: "RAP", description: "Vocal conviction, diaphragm support, presence, and articulation clarity." },
    { name: "Breath Control", slug: "breath-control", category: "RAP", description: "Strategic breath placement, sustained 4-bar lunges without cadence collapse." },
    { name: "Freestyle", slug: "freestyle", category: "RAP", description: "Improvised rhyming, on-the-fly thematic connection, spontaneous recovery." },

    // Writing
    { name: "Writing Speed", slug: "writing-speed", category: "WRITING", description: "High-velocity instinctive drafting without premature self-censorship or editing." },
    { name: "Wordplay", slug: "wordplay", category: "WRITING", description: "Double entendres, homophones, phonetic twists, clever punchline mechanics." },
    { name: "Sensory Imagery", slug: "imagery", category: "WRITING", description: "Grounded physical descriptions that paint vivid scenes using all 5 senses." },
    { name: "Storytelling", slug: "storytelling", category: "WRITING", description: "Narrative structure, character motivation, tension arcs, satisfying payoff." },
    { name: "Metaphor & Simile", slug: "metaphor", category: "WRITING", description: "Extended metaphors, unexpected conceptual parallels, fresh figurative language." },
    { name: "Internal Rhyme", slug: "internal-rhyme", category: "WRITING", description: "Weaving multisyllabic rhymes inside bars rather than just at line endings." },
    { name: "Multisyllabic Rhyme", slug: "multisyllabic-rhyme", category: "WRITING", description: "Matching 3, 4, or 5 syllable vowel/consonant patterns cleanly." },
    { name: "Hook Writing", slug: "hooks", category: "WRITING", description: "Anthemic, memorable, repeatable melodic and rhythmic chorus formulation." },

    // Production
    { name: "Drum Programming", slug: "drums", category: "PRODUCTION", description: "Unquantized swing, velocity dynamics, groove pocket, bounce engineering." },
    { name: "Melodic Composition", slug: "melody", category: "PRODUCTION", description: "Memorable top-line motifs, counter-melodies, harmonic progression tension." },
    { name: "Sound Selection", slug: "sound-selection", category: "PRODUCTION", description: "Curating high-character samples, distinct synth patches, minimal clutter." },
    { name: "Song Arrangement", slug: "arrangement", category: "PRODUCTION", description: "Dynamic energy shifts, drops, tension buildup, transitions, ear candy." },
    { name: "Sample Flipping", slug: "sampling", category: "PRODUCTION", description: "Chopping, pitching, reversing, re-harmonizing audio into new compositions." },

    // Ear Training & Vocab
    { name: "Ear Training", slug: "ear-training", category: "EAR_TRAINING", description: "Tempo recognition, pitch direction discernment, major/minor mood perception." },
    { name: "Vocabulary Expansion", slug: "vocabulary", category: "VOCABULARY", description: "Broadening active lyrical vocabulary, slang/literary fusion, precision phrasing." },
  ];

  const skillMap = new Map<string, string>();
  for (const s of skillsData) {
    const created = await prisma.skill.create({ data: s });
    skillMap.set(s.slug, created.id);
  }

  // ==========================================
  // 10. PHASE 3: Seed 40+ Curated Exercises
  // ==========================================
  console.log("Seeding Phase 3 Curated Exercises...");

  const exercises = [
    // ------------------------------------
    // Category 1: RAP & DELIVERY (8)
    // ------------------------------------
    {
      slug: "metronome-pocket-lock",
      title: "Metronome Pocket Lock (85-95 BPM)",
      category: "FLOW",
      difficulty: "BEGINNER",
      estimatedDuration: 10,
      defaultBpm: 90,
      description: "Master steady rhythmic delivery by rapping a single 4-bar rhyme scheme directly on beat 1, 2, 3, 4.",
      instructions: `1. Launch the Pocket Gym metronome at 90 BPM.
2. Select a single 4-bar rhyme scheme or anchor bar.
3. Speak each syllable dead-center on the click for 2 minutes without drifting.
4. Increase tempo by +5 BPM every 2 minutes up to 105 BPM.`,
      constraints: "• Never rush ahead of the snare\n• Pronounce every consonant crisply\n• Keep your breath steady and silent",
      starterPrompt: "Built from the ground where the concrete breathes / Holding the fire that the midnight leaves",
      skillSlugs: ["pocket", "flow", "delivery"],
      orderIndex: 1,
    },
    {
      slug: "cadence-inversion",
      title: "Cadence Inversion (On-Beat to Off-Beat)",
      category: "FLOW",
      difficulty: "ADVANCED",
      estimatedDuration: 10,
      defaultBpm: 92,
      description: "Deliver 4 bars landing on the downbeat, then invert the cadence to start on the 'and' of beat 1.",
      instructions: `1. Start the metronome at 92 BPM.
2. Deliver 4 bars with accents falling squarely on Beats 1 and 3.
3. On Bar 5, switch your rhythm: start your phrases on the syncopated off-beat (the 'and' of 1).
4. Alternate every 4 bars for 4 full cycles.`,
      constraints: "• Keep the exact same lyrics while shifting the rhythmic pocket\n• Do not lose the groove during the transition bar",
      starterPrompt: "Downbeat: 'Check the clock, hear the sound' vs Off-beat: '...And check the clock, we hear the sound'",
      skillSlugs: ["cadence", "flow", "pocket"],
      orderIndex: 2,
    },
    {
      slug: "triplet-pocket-injection",
      title: "Triplet Pocket Injection (120-140 BPM)",
      category: "FLOW",
      difficulty: "INTERMEDIATE",
      estimatedDuration: 10,
      defaultBpm: 130,
      description: "Practice seamless transitions between straight 16th-note flows and 3-syllable triplet rolls.",
      instructions: `1. Set metronome to 130 BPM (or 65 BPM half-time).
2. Deliver 2 bars of straight 16th-note cadence (4 syllables per beat).
3. Switch immediately to a triplet pocket (3 syllables per beat: '1-and-a, 2-and-a') for 2 bars.
4. Repeat for 10 minutes until the shift feels effortless.`,
      constraints: "• Do not swallow syllables on the triplet roll\n• Land the 4th bar snare with high vocal impact",
      starterPrompt: "Straight: 'Walking through the city when the rain starts falling' → Triplet: 'Level up, never stop, settle for nothing'",
      skillSlugs: ["flow", "cadence"],
      orderIndex: 3,
    },
    {
      slug: "breath-control-sustained-lunge",
      title: "Breath Control: 4-Bar Sustained Lunge",
      category: "RAP",
      difficulty: "ADVANCED",
      estimatedDuration: 10,
      defaultBpm: 88,
      description: "Deliver a dense, uninterrupted 4-bar lyrical stretch on a single full diaphragm breath.",
      instructions: `1. Inhale deeply into your lower belly (not your chest).
2. Start the 88 BPM click.
3. Deliver a continuous 16-bar verse, taking only ONE breath every 4 complete bars (Bars 1-4, 5-8, 9-12, 13-16).
4. Focus on maintaining identical vocal projection on bar 4 as on bar 1.`,
      constraints: "• Zero mid-line gasps or drop in vocal volume\n• Crisp enunciation on the final bar of each lunge",
      starterPrompt: "Lock in, no drop, full power from start to finish.",
      skillSlugs: ["breath-control", "delivery"],
      orderIndex: 4,
    },
    {
      slug: "pocket-shifting-ahead-behind",
      title: "Pocket Shifting: Ahead vs Behind the Beat",
      category: "FLOW",
      difficulty: "EXPERT",
      estimatedDuration: 12,
      defaultBpm: 88,
      description: "Intentionally rap slightly ahead of the beat (urgency) vs dragging behind the beat (laid-back boom-bap).",
      instructions: `1. Set metronome to 88 BPM.
2. Round 1 (2 mins): Rap slightly ahead of the click (pre-snare urgency).
3. Round 2 (2 mins): Rap dead center on the click (mechanical precision).
4. Round 3 (2 mins): Drag your syllables lazily behind the snare (classic late pocket).
5. Switch styles on command.`,
      constraints: "• Must remain in control without losing the downbeat\n• Hear the micro-timing difference clearly",
      starterPrompt: "Observe how mood completely changes just by where your consonants land.",
      skillSlugs: ["pocket", "flow"],
      orderIndex: 5,
    },
    {
      slug: "accent-displacement-drill",
      title: "Accent Displacement & Polyrhythmic Emphasis",
      category: "FLOW",
      difficulty: "ADVANCED",
      estimatedDuration: 10,
      defaultBpm: 90,
      description: "Shift vocal volume accents away from expected snare hits onto unexpected 16th-note subdivisions.",
      instructions: `1. Take an 8-bar verse.
2. Identify where your natural vocal stresses fall (usually Beats 2 and 4).
3. Shift the heavy vocal stress to the 'e' or 'a' of Beat 2.
4. Notice how this creates syncopated tension that commands attention.`,
      constraints: "• Do not change the words, only the emphasized syllables\n• Maintain rhythmic stability",
      starterPrompt: "Turn a predictable cadence into an elastic, hypnotic groove.",
      skillSlugs: ["cadence", "flow", "delivery"],
      orderIndex: 6,
    },
    {
      slug: "vocal-projection-conditioning",
      title: "Dynamic Vocal Projection & Conviction",
      category: "RAP",
      difficulty: "BEGINNER",
      estimatedDuration: 8,
      defaultBpm: 90,
      description: "Condition vocal diaphragm power, switching between intimate close-mic delivery and full chest projection.",
      instructions: `1. Perform 4 bars at intimate whispering intensity (close proximity).
2. Immediately jump to room-filling projection (chest voice, maximum resonance) on Bar 5.
3. Maintain steady pitch and diction across both dynamic levels.`,
      constraints: "• Do not strain the throat; use diaphragm support\n• Avoid clipping mic or losing tone",
      starterPrompt: "Quiet intensity commands respect; explosive projection delivers impact.",
      skillSlugs: ["delivery"],
      orderIndex: 7,
    },
    {
      slug: "double-time-articulation",
      title: "Double-Time Diction & Speed Articulation (130 BPM)",
      category: "RAP",
      difficulty: "ADVANCED",
      estimatedDuration: 10,
      defaultBpm: 130,
      description: "Train tongue and lip dexterity for rapid-fire 32nd-note chopper flows without muddiness.",
      instructions: `1. Set metronome to 130 BPM.
2. Select a dense multisyllabic tongue-twister line.
3. Double the syllable rate (8 syllables per beat).
4. Record 4 consecutive passes, ensuring every consonant is crystal-clear.`,
      constraints: "• Zero slurring or missing end consonants ('t', 'k', 'p')\n• Stay locked on the snare pocket",
      starterPrompt: "Surgical articulation beats raw speed every single time.",
      skillSlugs: ["delivery", "flow"],
      orderIndex: 8,
    },

    // ------------------------------------
    // Category 2: RAPID WRITING (8)
    // ------------------------------------
    {
      slug: "rapid-16-bar-sprint",
      title: "10-Minute Rapid 16-Bar Sprint",
      category: "WRITING",
      difficulty: "INTERMEDIATE",
      estimatedDuration: 10,
      timeLimitSeconds: 600,
      description: "Pure instinctive lyrical creation. Write 16 non-stop bars in 10 minutes with zero backspacing or editing.",
      instructions: `1. Start the 10-minute timer.
2. Read the prompt, lock into your first thought, and write without stopping.
3. Do NOT edit or erase lines while the clock runs. If a bar feels weak, keep moving forward to the next.
4. Aim to complete all 16 bars before 00:00.
5. Your output will be saved directly as a Writing Studio Draft in your Creative Workspace.`,
      constraints: "• Minimum 16 bars\n• Zero backspacing/editing during the sprint\n• Complete within 10 minutes",
      starterPrompt: "Write 16 bars about the hunger you felt before anybody believed in your vision.",
      skillSlugs: ["writing-speed", "internal-rhyme", "multisyllabic-rhyme"],
      orderIndex: 9,
    },
    {
      slug: "rapid-5-min-hook-sprint",
      title: "5-Minute 3-Hook Formulation Sprint",
      category: "WRITING",
      difficulty: "BEGINNER",
      estimatedDuration: 5,
      timeLimitSeconds: 300,
      description: "Craft 3 distinct, high-impact chorus options for a single song concept in under 5 minutes.",
      instructions: `1. Given a single title or concept, formulate Hook Option A (Anthemic & Melodic).
2. Formulate Hook Option B (Lyrical & Rhythmic Bounce).
3. Formulate Hook Option C (Minimalist 2-line chant).
4. Pick the winner after the timer ends.`,
      constraints: "• 3 distinct hook directions\n• High repetition and memorable cadence\n• Finished in 5 minutes",
      starterPrompt: "Concept: 'No Safety Net' — Jumped off the ledge with zero backup plan.",
      skillSlugs: ["hooks", "writing-speed"],
      orderIndex: 10,
    },
    {
      slug: "sensory-immersion-verse",
      title: "Sensory Detail & Physical Immersion Drill",
      category: "WRITING",
      difficulty: "INTERMEDIATE",
      estimatedDuration: 12,
      timeLimitSeconds: 720,
      description: "Write 12 bars where every line contains at least one concrete physical sensory detail (sight, sound, texture, smell, taste).",
      instructions: `1. Choose a real location from your past (e.g. late night studio, rain-soaked bus stop, corner diner).
2. Banish abstract adjectives ('sad', 'angry', 'crazy').
3. Replace them with sensory objects ('rust on the handrail', 'smell of burning clutch', 'neon buzzing').
4. Write 12 bars immersing the listener in the physical room.`,
      constraints: "• Zero abstract emotion words\n• At least 1 physical sensory object per line",
      starterPrompt: "A cramped basement studio at 3:00 AM in the middle of winter.",
      skillSlugs: ["imagery", "storytelling"],
      orderIndex: 11,
    },
    {
      slug: "punchline-architecture-reversal",
      title: "Punchline Architecture & Setup Reversal",
      category: "WRITING",
      difficulty: "ADVANCED",
      estimatedDuration: 10,
      description: "Write 4 independent 2-bar punchlines where Line 1 creates a false expectation and Line 2 delivers a clever reversal.",
      instructions: `1. Bar 1: Set up a premise that leads the listener's brain down path A.
2. Bar 2: Flip the meaning of the key word or deliver a double entendre that subverts the expectation.
3. Write 4 separate 2-bar sets.`,
      constraints: "• Must contain clear setup → punchline mechanics\n• Avoid cliché rap wordplay (e.g. 'cold like ice')",
      starterPrompt: "Themes: Time, Architecture, Navigation, Legacy.",
      skillSlugs: ["wordplay", "metaphor"],
      orderIndex: 12,
    },
    {
      slug: "micro-story-16-lines",
      title: "Micro-Story in 16 Lines",
      category: "WRITING",
      difficulty: "INTERMEDIATE",
      estimatedDuration: 15,
      timeLimitSeconds: 900,
      description: "Write a complete narrative arc with beginning, inciting incident, climax, and resolution in exactly 16 bars.",
      instructions: `1. Bars 1-4: Establish the protagonist, setting, and initial state.
2. Bars 5-8: The inciting event or conflict that breaks the pattern.
3. Bars 9-12: The moment of highest tension or confrontation.
4. Bars 13-16: The aftermath and emotional resolution.`,
      constraints: "• Complete story with clear arc in exactly 16 lines\n• Maintain rhyming flow throughout",
      starterPrompt: "A decision made at a traffic light that changed the trajectory of a decade.",
      skillSlugs: ["storytelling", "writing-speed"],
      orderIndex: 13,
    },
    {
      slug: "extended-metaphor-deep-dive",
      title: "Extended Metaphor Deep-Dive (8 Bars)",
      category: "WRITING",
      difficulty: "ADVANCED",
      estimatedDuration: 12,
      description: "Sustain a single metaphor framework (e.g. deep sea navigation, metallurgy, chess) across 8 consecutive bars.",
      instructions: `1. Pick a single domain outside of music (e.g. Architecture, Botany, Astronomy, Horology).
2. Extract 8 technical terms from that domain.
3. Write an 8-bar verse about your creative journey using only imagery from that chosen field.`,
      constraints: "• Do not break the metaphor universe\n• Every bar must advance the core theme",
      starterPrompt: "Domain: Watchmaking & Horology (gears, escapements, mainsprings, friction, balance).",
      skillSlugs: ["metaphor", "wordplay", "imagery"],
      orderIndex: 14,
    },
    {
      slug: "lyrical-economy-compression",
      title: "Lyrical Economy & Line Compression",
      category: "WRITING",
      difficulty: "ADVANCED",
      estimatedDuration: 10,
      description: "Take an existing 16-bar draft and compress it into 8 razor-sharp bars with 50% fewer filler words.",
      instructions: `1. Review a draft verse.
2. Identify all filler words ('yeah', 'you know', 'just', 'really', 'like').
3. Re-write the verse packing the exact same meaning and imagery into half the bar count.
4. Experience how density amplifies lyrical power.`,
      constraints: "• Maximum impact per syllable\n• Eliminate all conversational padding",
      starterPrompt: "Tight writing is confident writing. Say more with fewer syllables.",
      skillSlugs: ["writing-speed", "wordplay"],
      orderIndex: 15,
    },
    {
      slug: "15-min-narrative-verse-sprint",
      title: "15-Minute Cinematic Narrative Sprint",
      category: "WRITING",
      difficulty: "INTERMEDIATE",
      estimatedDuration: 15,
      timeLimitSeconds: 900,
      description: "A timed narrative sprint capturing a pivotal milestone with cinematic pacing.",
      instructions: `1. Set the 15-minute clock.
2. Write a full 20-bar verse chronicling a real sequence of events.
3. Focus on pacing: let early bars breathe, accelerate internal rhymes in the middle, and finish on an unforgettable closing statement.`,
      constraints: "• 20 bars minimum\n• Strict chronological order",
      starterPrompt: "The 24 hours leading up to an irreversible life pivot.",
      skillSlugs: ["storytelling", "writing-speed"],
      orderIndex: 16,
    },

    // ------------------------------------
    // Category 3: RHYME CONSTRUCTION (6)
    // ------------------------------------
    {
      slug: "multisyllabic-3-syllable-chains",
      title: "Multisyllabic 3-Syllable Rhyme Chain",
      category: "RHYME",
      difficulty: "INTERMEDIATE",
      estimatedDuration: 10,
      description: "Build a chain of 6+ rhyming phrases around a 3-syllable anchor phrase, matching vowel sounds.",
      instructions: `1. Enter your anchor phrase (e.g. 'com-pli-cat-ed' or 'pres-sure-cook-er').
2. Identify the vowel sequence (e.g. O - I - A - E).
3. Construct at least 6 rhyming pairs or phrases maintaining that exact vowel sequence.
4. Save your chain to your Rhyme Vault.`,
      constraints: "• Minimum 6 rhyme entries\n• Maintain identical syllable count\n• Avoid using the exact same root word",
      starterPrompt: "Anchor: 'com-pli-cat-ed' → 'dom-i-nat-ed', 'con-cen-trat-ed', 'cal-cu-lat-ed', 'ob-li-gat-ed'",
      skillSlugs: ["multisyllabic-rhyme"],
      orderIndex: 17,
    },
    {
      slug: "internal-rhyme-weaver",
      title: "Internal Rhyme Weaver (2 Multis Per Bar)",
      category: "RHYME",
      difficulty: "ADVANCED",
      estimatedDuration: 12,
      description: "Write 8 bars where each line contains two distinct internal rhyme pairs before the final end rhyme.",
      instructions: `1. Map out Scheme: Bar contains (A1 ... A2) in the middle, and lands on B at the end.
2. Next line matches (A3 ... A4) inside and lands on B2.
3. Write 8 bars following this dense internal interlocking lattice.`,
      constraints: "• 2 internal rhyme pairs per line\n• End rhyme must also match",
      starterPrompt: "Example: 'The [cold design] in the [gold of mine] brought the [pressure back] / I [hold the line] through the [folds of time] on the [measured track]'",
      skillSlugs: ["internal-rhyme", "multisyllabic-rhyme"],
      orderIndex: 18,
    },
    {
      slug: "slant-rhyme-assonance-expansion",
      title: "Slant Rhyme & Assonance Expansion",
      category: "RHYME",
      difficulty: "BEGINNER",
      estimatedDuration: 10,
      description: "Expand past rigid exact rhymes by matching pure vowel sounds across different ending consonants.",
      instructions: `1. Select an anchor word (e.g. 'obsidian').
2. Match only the vowel sounds (O - I - I - U - N).
3. Find 8 slant rhymes with different consonant endings (e.g. 'collision in', 'decision went', 'envision him').
4. Notice how slant rhymes prevent repetitive, predictable writing.`,
      constraints: "• No exact rhymes allowed — strictly slant/assonance\n• Minimum 8 variations",
      starterPrompt: "Anchor: 'obsidian' → 'envision him', 'collision in', 'decision win'",
      skillSlugs: ["multisyllabic-rhyme", "internal-rhyme"],
      orderIndex: 19,
    },
    {
      slug: "4-syllable-complex-multi-matrix",
      title: "4-Syllable Complex Multi-Rhyme Matrix",
      category: "RHYME",
      difficulty: "EXPERT",
      estimatedDuration: 15,
      description: "Construct 4-syllable whole-phrase rhymes and integrate them into a dense 8-bar rap sequence.",
      instructions: `1. Anchor: 4 full syllables (e.g. 'structural steel').
2. Generate 5 matching phrases ('puncture the wheel', 'rupture and heal', 'nothing is real', 'cutting the deal').
3. Write an 8-bar verse weaving all 5 phrases into natural cadence.`,
      constraints: "• Exactly 4-syllable matching blocks\n• Verse must sound natural, not forced",
      starterPrompt: "Anchor: 'architectural plan' → 'part of a surgical clan', 'darkness is blurring the land'",
      skillSlugs: ["multisyllabic-rhyme", "internal-rhyme"],
      orderIndex: 20,
    },
    {
      slug: "end-rhyme-variation-8-bars",
      title: "End-Rhyme Variation (Zero Vowel Repeats)",
      category: "RHYME",
      difficulty: "ADVANCED",
      estimatedDuration: 12,
      description: "Write 8 bars using a completely new end-rhyme vowel sound for every 2-bar couplet (AABBCCDD).",
      instructions: `1. Bars 1-2: Sound A (e.g. 'night' / 'sight').
2. Bars 3-4: Sound B (e.g. 'stone' / 'zone').
3. Bars 5-6: Sound C (e.g. 'floor' / 'door').
4. Bars 7-8: Sound D (e.g. 'steel' / 'real').
5. Ensure internal rhymes bridge the transitions between couplets.`,
      constraints: "• 4 distinct vowel families\n• Smooth, seamless narrative progression",
      starterPrompt: "Couplets must flow into each other without feeling disjointed.",
      skillSlugs: ["multisyllabic-rhyme", "flow"],
      orderIndex: 21,
    },
    {
      slug: "cross-bar-rhyme-enjambment",
      title: "Cross-Bar Rhyme Enjambment Drill",
      category: "RHYME",
      difficulty: "EXPERT",
      estimatedDuration: 12,
      description: "Place your rhyme words across bar lines so sentence grammar overflows bar boundaries.",
      instructions: `1. Instead of stopping sentence thoughts at the end of Bar 1, let the sentence carry over past Beat 4 into Bar 2.
2. Land the rhyme word unexpectedly on Beat 2 of the next bar.
3. Write 8 bars with enjambment to create a conversational, unpredictable cadence.`,
      constraints: "• Sentences must span across bar lines\n• Rhythmic groove must remain solid",
      starterPrompt: "Enjambment breaks monotony and makes flow feel human and alive.",
      skillSlugs: ["flow", "cadence", "internal-rhyme"],
      orderIndex: 22,
    },

    // ------------------------------------
    // Category 4: FREESTYLE (5)
    // ------------------------------------
    {
      slug: "freestyle-60s-word-prompter",
      title: "60-Second Random Word Prompter Challenge",
      category: "FREESTYLE",
      difficulty: "INTERMEDIATE",
      estimatedDuration: 5,
      defaultBpm: 90,
      description: "Freestyle over a beat while PRIME prompts a new random word every 10 seconds. Integrate each word instantly.",
      instructions: `1. Start the freestyle prompter with 10-second word intervals.
2. Turn on metronome (90 BPM) or your own backing beat.
3. When a new word flashes, weave it into your current rhyme scheme within 2 bars.
4. Keep the flow moving even if you stumble — never stop the rhythm.`,
      constraints: "• Zero pauses or stopping the flow\n• Every prompted word must be spoken on-beat",
      starterPrompt: "Words will cycle automatically. Trust your instincts and stay in the pocket.",
      skillSlugs: ["freestyle", "flow"],
      orderIndex: 23,
    },
    {
      slug: "freestyle-3-word-story-arc",
      title: "3-Word Unrelated Storyline Improv",
      category: "FREESTYLE",
      difficulty: "ADVANCED",
      estimatedDuration: 8,
      defaultBpm: 88,
      description: "Receive 3 completely unrelated nouns and freestyle a cohesive 16-bar narrative connecting all three.",
      instructions: `1. Generate 3 random words (e.g. 'Compass', 'Submarine', 'Telescope').
2. Start the 88 BPM beat.
3. Freestyle 16 bars weaving all 3 objects into a logical storyline with a clear beginning and ending.`,
      constraints: "• Narrative must make sense\n• No dead air",
      starterPrompt: "Connect the disconnected through storytelling intuition.",
      skillSlugs: ["freestyle", "storytelling"],
      orderIndex: 24,
    },
    {
      slug: "freestyle-object-association",
      title: "Object Association Room Freestyle",
      category: "FREESTYLE",
      difficulty: "BEGINNER",
      estimatedDuration: 5,
      defaultBpm: 85,
      description: "Look around your physical room and freestyle 8 bars about 4 separate physical objects in sight.",
      instructions: `1. Look around your immediate space.
2. Pick 4 physical items (e.g. headphones, coffee cup, window frame, audio interface).
3. Freestyle 2 bars per item, turning each into a metaphor for your craft.`,
      constraints: "• Real physical objects only\n• Continuous delivery",
      starterPrompt: "Your environment is an infinite well of lyrical inspiration.",
      skillSlugs: ["freestyle", "imagery"],
      orderIndex: 25,
    },
    {
      slug: "freestyle-4-bar-topic-pivot",
      title: "4-Bar Topic Pivot Drill",
      category: "FREESTYLE",
      difficulty: "ADVANCED",
      estimatedDuration: 8,
      defaultBpm: 92,
      description: "Switch your entire lyrical subject matter every 4 bars without stopping or losing the rhyme flow.",
      instructions: `1. Bar 1-4: Topic 1 (Your origins).
2. Bar 5-8: Topic 2 (A sci-fi future city).
3. Bar 9-12: Topic 3 (The mechanics of sound).
4. Bar 13-16: Topic 4 (A message to your future self).`,
      constraints: "• Seamless topic pivots on the downbeat of Bar 5, 9, 13\n• No pause between transitions",
      starterPrompt: "Pivoting trains your brain to change gears under pressure.",
      skillSlugs: ["freestyle", "cadence"],
      orderIndex: 26,
    },
    {
      slug: "freestyle-2-min-continuous-flow",
      title: "2-Minute Continuous Flow (Zero Dead Air)",
      category: "FREESTYLE",
      difficulty: "EXPERT",
      estimatedDuration: 5,
      defaultBpm: 90,
      description: "Freestyle for 120 unbroken seconds without a single pause, hesitation, or filler silence.",
      instructions: `1. Start the 2-minute timer with a 90 BPM groove.
2. Rap continuously. If you run out of words, use cadence scatting or phonetic repetition until the next rhyme arrives.
3. Never stop moving your mouth on beat.`,
      constraints: "• 120 continuous seconds\n• Zero stops",
      starterPrompt: "Endurance drill. Build the stamina to never get stuck on mic.",
      skillSlugs: ["freestyle", "breath-control", "flow"],
      orderIndex: 27,
    },

    // ------------------------------------
    // Category 5: STORYTELLING (5)
    // ------------------------------------
    {
      slug: "3-part-cinematic-arc",
      title: "3-Part Cinematic Narrative Arc",
      category: "STORYTELLING",
      difficulty: "INTERMEDIATE",
      estimatedDuration: 15,
      description: "Write a 3-act story across 12 bars: Act 1 (The Setup), Act 2 (The Breaking Point), Act 3 (The Revelation).",
      instructions: `1. Act 1 (Bars 1-4): Introduce the character, the stakes, and the baseline world.
2. Act 2 (Bars 5-8): The catalyst event that shatters normalcy.
3. Act 3 (Bars 9-12): The transformation and lasting consequence.`,
      constraints: "• Clear 3-act structure\n• Emotional weight and grounded dialogue",
      starterPrompt: "A young musician walking into a closed-door label meeting.",
      skillSlugs: ["storytelling", "imagery"],
      orderIndex: 28,
    },
    {
      slug: "perspective-shift-antagonist",
      title: "Perspective Shift: The Antagonist's Eyes",
      category: "STORYTELLING",
      difficulty: "ADVANCED",
      estimatedDuration: 15,
      description: "Describe a conflict entirely from the perspective of someone who opposes or doubts you.",
      instructions: `1. Choose a real or fictional conflict.
2. Step inside the mind of the other person. Give them genuine motivation and convincing reasoning.
3. Write 12 bars from their point of view without parodying them.`,
      constraints: "• The antagonist must sound fully rational in their own mind\n• Nuanced character writing",
      starterPrompt: "A mentor who believes you are throwing your life away on music.",
      skillSlugs: ["storytelling", "metaphor"],
      orderIndex: 29,
    },
    {
      slug: "sensory-memory-reconstruction",
      title: "Sensory Memory Reconstruction",
      category: "STORYTELLING",
      difficulty: "BEGINNER",
      estimatedDuration: 10,
      description: "Reconstruct a vivid memory from your childhood using exact physical sensory cues.",
      instructions: `1. Pick a single hour from your past.
2. Recall the weather, lighting, physical sounds, room temperature, and smells.
3. Write an 8-bar verse grounding the listener in that exact memory.`,
      constraints: "• Real physical memory\n• Zero vague generic lines",
      starterPrompt: "A specific rainy afternoon listening to a tape in an old car.",
      skillSlugs: ["storytelling", "imagery"],
      orderIndex: 30,
    },
    {
      slug: "60-second-micro-epic",
      title: "The 60-Second Micro-Epic",
      category: "STORYTELLING",
      difficulty: "ADVANCED",
      estimatedDuration: 10,
      timeLimitSeconds: 600,
      description: "Write a high-stakes complete narrative verse under 90 words with the emotional impact of a full film.",
      instructions: `1. Focus on economy of language.
2. Every single word must carry plot or character significance.
3. Deliver a beginning, climax, and emotional gut punch in 8 to 12 bars.`,
      constraints: "• Under 90 total words\n• Complete narrative arc",
      starterPrompt: "An artist listening to their master recording for the very first time after 5 years of silence.",
      skillSlugs: ["storytelling", "writing-speed"],
      orderIndex: 31,
    },
    {
      slug: "dialogue-driven-verse",
      title: "Dialogue-Driven Verse",
      category: "STORYTELLING",
      difficulty: "EXPERT",
      estimatedDuration: 12,
      description: "Write a 12-bar verse featuring two distinct characters speaking back and forth in rhymed dialogue.",
      instructions: `1. Character A speaks for 2 bars with one cadence.
2. Character B responds for 2 bars with a contrasting cadence and tone.
3. Build conversational tension through 3 exchanges.`,
      constraints: "• Distinct vocal tones for each speaker\n• Natural dialogue that still rhymes tightly",
      starterPrompt: "A dialogue between the artist and their inner doubt at 2:00 AM.",
      skillSlugs: ["storytelling", "cadence"],
      orderIndex: 32,
    },

    // ------------------------------------
    // Category 6: VOCABULARY (5)
    // ------------------------------------
    {
      slug: "daily-word-lyrical-integration",
      title: "Daily Word Expansion & Lyrical Integration",
      category: "VOCABULARY",
      difficulty: "BEGINNER",
      estimatedDuration: 8,
      description: "Discover a powerful literary word, understand its phonetic weight, and write 2 original lyrical lines using it.",
      instructions: `1. Study the selected word of the day: definition, part of speech, pronunciation.
2. Analyze its vowel sequence and internal rhyme potential.
3. Write 2 original, impactful rap lines integrating the word seamlessly.
4. Add the entry to your Vocabulary Vault.`,
      constraints: "• Word must feel natural and unforced in the bar\n• Save custom lines to vault",
      starterPrompt: "Word: 'Obsidian' (A dark, glassy volcanic rock formed by rapid cooling).",
      skillSlugs: ["vocabulary", "imagery"],
      orderIndex: 33,
    },
    {
      slug: "abstract-concept-concretization",
      title: "Abstract Concept Concretization",
      category: "VOCABULARY",
      difficulty: "INTERMEDIATE",
      estimatedDuration: 10,
      description: "Take 3 abstract nouns ('Loneliness', 'Ambition', 'Regret') and describe each using only concrete physical objects.",
      instructions: `1. For each abstract noun, write 2 bars where the abstract word NEVER appears.
2. Instead, describe concrete actions and physical items that evoke that exact feeling.
3. 'Show, don't tell' at the highest level.`,
      constraints: "• Never name the emotion directly\n• Physical metaphors only",
      starterPrompt: "Concretize 'Ambition' without saying 'hungry', 'dream', or 'grind'.",
      skillSlugs: ["vocabulary", "metaphor", "imagery"],
      orderIndex: 34,
    },
    {
      slug: "cliche-elimination-drill",
      title: "Cliché Elimination & Precision Phrasing",
      category: "VOCABULARY",
      difficulty: "INTERMEDIATE",
      estimatedDuration: 10,
      description: "Identify 3 tired rap clichés and rewrite each with fresh, surprising, high-precision vocabulary.",
      instructions: `1. Cliché 1: 'I'm on fire' → Rewrite with precision.
2. Cliché 2: 'They counted me out' → Rewrite with precision.
3. Cliché 3: 'Chasing my dreams' → Rewrite with precision.`,
      constraints: "• Zero overused tropes\n• High sensory resonance",
      starterPrompt: "Fresh vocabulary separates timeless lyricists from background noise.",
      skillSlugs: ["vocabulary", "wordplay"],
      orderIndex: 35,
    },
    {
      slug: "double-entendre-idiom-inversion",
      title: "Double Entendre & Idiom Inversion",
      category: "VOCABULARY",
      difficulty: "ADVANCED",
      estimatedDuration: 12,
      description: "Take 3 common English idioms and invert their literal/figurative meanings across 2-bar couplets.",
      instructions: `1. Idiom examples: 'Bite the bullet', 'Burn the bridge', 'Blood on the floor'.
2. Craft couplets where the idiom operates on both a literal physical level and a metaphorical psychological level.`,
      constraints: "• Dual-layer meaning in both lines",
      starterPrompt: "Invert 'burning bridges' so the fire illuminates the path forward.",
      skillSlugs: ["vocabulary", "wordplay", "metaphor"],
      orderIndex: 36,
    },
    {
      slug: "technical-jargon-metaphor-synthesis",
      title: "Technical Jargon & World-Building",
      category: "VOCABULARY",
      difficulty: "EXPERT",
      estimatedDuration: 12,
      description: "Incorporate specialized terminology from architecture, physics, or finance to create a distinct lyrical aesthetic.",
      instructions: `1. Select 4 technical terms (e.g. 'cantilever', 'half-life', 'inertia', 'liquidity').
2. Write 4 couplets applying these technical principles to music and life.`,
      constraints: "• Accurate use of technical jargon\n• Natural phonetic integration",
      starterPrompt: "Specialized language gives your catalog a signature intellectual texture.",
      skillSlugs: ["vocabulary", "metaphor"],
      orderIndex: 37,
    },

    // ------------------------------------
    // Category 7: PRODUCTION (6)
    // ------------------------------------
    {
      slug: "3-element-beat-challenge",
      title: "3-Element Beat Challenge (Kick, Snare, Hat)",
      category: "PRODUCTION",
      difficulty: "INTERMEDIATE",
      estimatedDuration: 15,
      description: "Build an infectious, dynamic drum groove using ONLY kick, snare, and hi-hat with velocity modulation and swing.",
      instructions: `1. In your DAW or sampler, load only 1 kick, 1 snare/clap, and 1 hi-hat.
2. No melodies, no 808s, no percs.
3. Create an 8-bar loop that makes your head nod purely through groove, velocity shifts, and ghost notes.
4. Record your reflection notes and outcome in PRIME.`,
      constraints: "• Exactly 3 sound sources\n• Zero additional layers or melodic stems",
      starterPrompt: "If the bounce doesn't work with 3 elements, 30 elements won't fix it.",
      skillSlugs: ["drums", "sound-selection"],
      orderIndex: 38,
    },
    {
      slug: "1-instrument-melodic-hook",
      title: "1-Instrument 8-Bar Melodic Hook Composition",
      category: "PRODUCTION",
      difficulty: "BEGINNER",
      estimatedDuration: 15,
      description: "Compose an unforgettable 8-bar melodic top-line using a single sound (piano, rhodes, or synth lead).",
      instructions: `1. Open your DAW with a single melodic instrument.
2. Compose an 8-bar melody with call-and-response phrasing.
3. Ensure the melody can be hummed or whistled after hearing it once.`,
      constraints: "• Single instrument layer\n• Memorable call-and-response motif",
      starterPrompt: "A classic melody works on a toy piano.",
      skillSlugs: ["melody", "arrangement"],
      orderIndex: 39,
    },
    {
      slug: "5-sound-minimalist-arrangement",
      title: "5-Sound Minimalist Arrangement Drill",
      category: "PRODUCTION",
      difficulty: "ADVANCED",
      estimatedDuration: 20,
      description: "Arrange a full 2-minute beat structure (Intro, Verse, Hook, Verse, Outro) using a maximum of 5 total sounds.",
      instructions: `1. Choose 5 sounds: Kick, Snare, Hi-hat, Bass/808, 1 Melodic element.
2. Build tension, drops, and energy shifts strictly through arrangement subtraction and filtering.
3. Record duration and notes.`,
      constraints: "• Maximum 5 total stems across the entire project",
      starterPrompt: "Mastery is knowing what to leave out.",
      skillSlugs: ["arrangement", "sound-selection"],
      orderIndex: 40,
    },
    {
      slug: "15-min-sample-flip-sprint",
      title: "15-Minute Speed Sample Flip Sprint",
      category: "PRODUCTION",
      difficulty: "ADVANCED",
      estimatedDuration: 15,
      timeLimitSeconds: 900,
      description: "Chop a sample, pitch it, flip the groove, and add drums into a completed beat idea in 15 minutes.",
      instructions: `1. Grab a raw audio sample.
2. Start the 15-minute timer.
3. Chop into 8 slices, pitch up/down, create a new harmonic progression, and lay down drums.
4. Stop when the clock hits 00:00.`,
      constraints: "• 15-minute strict time limit\n• Must produce an arrangeable 8-bar loop",
      starterPrompt: "Speed kills overthinking. Trust your first instinct.",
      skillSlugs: ["sampling", "drums", "sound-selection"],
      orderIndex: 41,
    },
    {
      slug: "unquantized-drum-pocket-extraction",
      title: "Unquantized Drum Pocket Extraction",
      category: "PRODUCTION",
      difficulty: "EXPERT",
      estimatedDuration: 15,
      description: "Play drum patterns entirely by hand without grid quantization, dialing in micro-timing swing.",
      instructions: `1. Turn off grid snap/quantization in your DAW.
2. Finger-drum the kick and snare live over a click.
3. Adjust micro-timing manually to find the sweet spot between human looseness and driving pulse.`,
      constraints: "• Zero 100% grid quantization on drums",
      starterPrompt: "The groove lives in the micro-seconds between the grid lines.",
      skillSlugs: ["drums", "pocket"],
      orderIndex: 42,
    },
    {
      slug: "arrangement-tension-stripping",
      title: "Arrangement Tension & Energy Stripping",
      category: "PRODUCTION",
      difficulty: "INTERMEDIATE",
      estimatedDuration: 15,
      description: "Take a busy loop and strip out 60% of the elements to create dramatic vocal space for the verses.",
      instructions: `1. Open a dense beat project.
2. Mute everything except the kick, low bass, and one subtle atmosphere.
3. Hear how much space opens up for the vocal delivery.`,
      constraints: "• Maximize dynamic contrast between Verse and Chorus",
      starterPrompt: "Give the vocalist room to dominate.",
      skillSlugs: ["arrangement", "sound-selection"],
      orderIndex: 43,
    },

    // ------------------------------------
    // Category 8: EAR TRAINING (5)
    // ------------------------------------
    {
      slug: "tempo-recognition-pocket-sync",
      title: "Tempo Recognition & Pocket Sync Drill",
      category: "EAR_TRAINING",
      difficulty: "BEGINNER",
      estimatedDuration: 8,
      description: "Listen to tracks across genres and estimate the exact BPM within ±2 BPM using Tap Tempo.",
      instructions: `1. Play any instrumental or song.
2. Tap the tempo button in Pocket Gym until the BPM locks.
3. Verify your guess against the track's real tempo.
4. Train your internal clock to immediately sense 85, 90, 120, 140 BPM.`,
      constraints: "• Guess before checking the readout",
      starterPrompt: "An artist with an accurate internal clock never struggles in the studio.",
      skillSlugs: ["ear-training", "pocket"],
      orderIndex: 44,
    },
    {
      slug: "major-minor-mood-identification",
      title: "Major vs Minor Harmonic Mood Identification",
      category: "EAR_TRAINING",
      difficulty: "BEGINNER",
      estimatedDuration: 8,
      description: "Identify whether chord progressions are Major (bright, triumphant) or Minor (dark, introspective, tense).",
      instructions: `1. Listen to 5 musical references.
2. Classify the root tonality and describe the emotional texture.
3. Match appropriate lyrical themes to the harmonic mood.`,
      constraints: "• Connect chord quality directly to lyrical tone",
      starterPrompt: "Harmonic awareness aligns vocal emotion with the production canvas.",
      skillSlugs: ["ear-training", "melody"],
      orderIndex: 45,
    },
    {
      slug: "pitch-direction-melodic-intervals",
      title: "Pitch Direction & Melodic Interval Discernment",
      category: "EAR_TRAINING",
      difficulty: "INTERMEDIATE",
      estimatedDuration: 10,
      description: "Track vocal melodies and identify whether intervals are stepping by half-step, whole-step, or leaping by 4ths/5ths.",
      instructions: `1. Listen to a vocal hook melody.
2. Hum the notes back and map the pitch movement (ascending, descending, leaping).
3. Replicate the interval leaps in your own vocal delivery.`,
      constraints: "• Accurately hum root and target notes",
      starterPrompt: "Pitch precision makes rap cadences significantly more hypnotic.",
      skillSlugs: ["ear-training", "delivery"],
      orderIndex: 46,
    },
    {
      slug: "frequency-space-drum-separation",
      title: "Frequency Space & Drum Separation Ear Drill",
      category: "EAR_TRAINING",
      difficulty: "ADVANCED",
      estimatedDuration: 10,
      description: "Listen critically to professional mixes and isolate Sub (20-60Hz), Low-Mid (200-500Hz), and Top Air (8-12kHz).",
      instructions: `1. Put on studio headphones.
2. Focus strictly on where the kick sub ends and the 808 fundamental begins.
3. Identify where the vocal sits in the 1kHz - 4kHz presence bracket.`,
      constraints: "• Critical listening with zero distractions",
      starterPrompt: "Train your ears to hear balance, not just volume.",
      skillSlugs: ["ear-training", "sound-selection"],
      orderIndex: 47,
    },
    {
      slug: "rhythm-transcription-syllable-clapping",
      title: "Rhythm Transcription & Syllable Clapping",
      category: "EAR_TRAINING",
      difficulty: "INTERMEDIATE",
      estimatedDuration: 10,
      description: "Listen to a complex rap flow and clap the exact syllable rhythm without saying the words.",
      instructions: `1. Pick an iconic fast verse (e.g. Kendrick, Andre 3000, Eminem).
2. Isolate 4 bars.
3. Clap out the exact syncopated rhythm with your hands.
4. Deliver your own original lyrics using that exact clapped rhythm.`,
      constraints: "• Perfect rhythmic reproduction without words",
      starterPrompt: "Cadence is pure percussion translated into syllables.",
      skillSlugs: ["ear-training", "flow", "cadence"],
      orderIndex: 48,
    },
  ];

  for (const ex of exercises) {
    const { skillSlugs, ...data } = ex;
    const created = await prisma.exercise.create({ data });

    // Link skills
    for (const slug of skillSlugs) {
      const skillId = skillMap.get(slug);
      if (skillId) {
        await prisma.exerciseSkill.create({
          data: {
            exerciseId: created.id,
            skillId,
          },
        });
      }
    }
  }

  // ==========================================
  // 11. PHASE 3: Seed Rhyme Chains & Vocabulary
  // ==========================================
  console.log("Seeding Starter Rhyme Chains & Vocabulary...");

  const chain1 = await prisma.rhymeChain.create({
    data: {
      userId: user.id,
      anchorPhrase: "complicated",
      syllableCount: 4,
      notes: "4-syllable multisyllabic rhyme chain with O-I-A-E vowel sequence.",
      entries: {
        create: [
          { rhymeText: "dominated", syllables: 4, orderIndex: 0, notes: "Strong punchline ending" },
          { rhymeText: "concentrated", syllables: 4, orderIndex: 1, notes: "Internal anchor" },
          { rhymeText: "calculated", syllables: 4, orderIndex: 2, notes: "Precision theme" },
          { rhymeText: "obligated", syllables: 4, orderIndex: 3, notes: "Moral tension" },
          { rhymeText: "demonstrated", syllables: 4, orderIndex: 4, notes: "Delivery bar" },
        ],
      },
    },
  });

  const chain2 = await prisma.rhymeChain.create({
    data: {
      userId: user.id,
      anchorPhrase: "obsidian skies",
      syllableCount: 5,
      notes: "Lead single title multi chain.",
      entries: {
        create: [
          { rhymeText: "magnificent rise", syllables: 5, orderIndex: 0 },
          { rhymeText: "conditioned to thrive", syllables: 5, orderIndex: 1 },
          { rhymeText: "division of lies", syllables: 5, orderIndex: 2 },
          { rhymeText: "collision inside", syllables: 5, orderIndex: 3 },
        ],
      },
    },
  });

  await prisma.vocabularyEntry.createMany({
    data: [
      {
        userId: user.id,
        word: "Obsidian",
        definition: "A hard, dark, glasslike volcanic rock formed by the rapid solidification of lava without crystallization.",
        pronunciation: "əb-ˈsi-dē-ən",
        partOfSpeech: "noun / adjective",
        userLine: "Built the ceiling out of obsidian so the cracks never let the light leak.",
        associations: "volcanic, dark glass, unbreakable, midnight, surgical edge",
      },
      {
        userId: user.id,
        word: "Melancholy",
        definition: "A feeling of pensive sadness, typically with no obvious cause; thoughtful sobriety.",
        pronunciation: "ˈme-lən-ˌkä-lē",
        partOfSpeech: "noun / adjective",
        userLine: "Heavy melancholy dripping through the rhodes chords at four in the morning.",
        associations: "minor chords, rain, nostalgia, solitude, deep thought",
      },
      {
        userId: user.id,
        word: "Juxtaposition",
        definition: "The fact of two things being seen or placed close together with contrasting effect.",
        pronunciation: "ˌjək-stə-pə-ˈzi-shən",
        partOfSpeech: "noun",
        userLine: "Juxtaposition of the dirty baseline against the heavenly choir.",
        associations: "contrast, tension, dual nature, light and dark",
      },
      {
        userId: user.id,
        word: "Resonance",
        definition: "The quality in a sound of being deep, full, and reverberating; the power to evoke enduring emotions.",
        pronunciation: "ˈre-zə-nən(t)s",
        partOfSpeech: "noun",
        userLine: "We chase resonance over momentary noise every single session.",
        associations: "acoustic depth, timelessness, harmonic vibration, lasting impact",
      },
    ],
  });

  // ==========================================
  // 12. PHASE 3: Seed Completed Training Sessions
  // ==========================================
  console.log("Seeding Sample Completed Training Sessions...");

  const sprintEx = await prisma.exercise.findUnique({ where: { slug: "rapid-16-bar-sprint" } });
  const pocketEx = await prisma.exercise.findUnique({ where: { slug: "metronome-pocket-lock" } });
  const rhymeEx = await prisma.exercise.findUnique({ where: { slug: "multisyllabic-3-syllable-chains" } });

  if (sprintEx) {
    await prisma.trainingSession.create({
      data: {
        userId: user.id,
        exerciseId: sprintEx.id,
        status: "COMPLETED",
        startedAt: subDays(new Date(), 0),
        endedAt: subDays(new Date(), 0),
        durationSeconds: 600,
        effortRating: 5,
        difficultyRating: 4,
        confidenceRating: 4,
        notes: "Sprint completed with zero pauses. Wrote 16 bars on Manchester origins. Saved straight to Writing Studio.",
        writingDocumentId: sprintDoc.id,
      },
    });
  }

  if (pocketEx) {
    await prisma.trainingSession.create({
      data: {
        userId: user.id,
        exerciseId: pocketEx.id,
        status: "COMPLETED",
        startedAt: subDays(new Date(), 1),
        endedAt: subDays(new Date(), 1),
        durationSeconds: 600,
        effortRating: 4,
        difficultyRating: 3,
        confidenceRating: 5,
        notes: "Pocket was locked at 90 BPM. Practiced accent displacement on beat 3.",
      },
    });
  }

  if (rhymeEx) {
    await prisma.trainingSession.create({
      data: {
        userId: user.id,
        exerciseId: rhymeEx.id,
        status: "COMPLETED",
        startedAt: subDays(new Date(), 2),
        endedAt: subDays(new Date(), 2),
        durationSeconds: 720,
        effortRating: 4,
        difficultyRating: 4,
        confidenceRating: 4,
        notes: "Constructed 5 matching 4-syllable pairs for 'complicated'. Added to Rhyme Vault.",
      },
    });
  }

  // ==========================================
  // Phase 4: Discovery & Reflection Seed Data
  // ==========================================
  console.log("Seeding Phase 4 Discovery & Reflection models...");

  // 1. Reference Artists
  const kendrick = await prisma.artist.create({
    data: {
      userId: user.id,
      name: "Kendrick Lamar",
      role: "Rapper / Songwriter / Conceptualist",
      status: "ACTIVE_REFERENCE",
      genres: "Conscious Rap, Jazz Rap, West Coast Hip-Hop",
      tags: "cadence switches, thematic worldbuilding, vocal inflection",
      favorite: true,
      notes: "Master of narrative vulnerability, multi-perspective writing, and abrupt dynamic cadence pivots.",
    },
  });

  const andre = await prisma.artist.create({
    data: {
      userId: user.id,
      name: "André 3000",
      role: "Rapper / Songwriter / Multi-instrumentalist",
      status: "ACTIVE_REFERENCE",
      genres: "Southern Hip-Hop, Funk, Experimental",
      tags: "pocket elasticity, melody within rap, storytelling",
      favorite: true,
      notes: "Effortlessly swings between behind-the-beat conversational delivery and breakneck multi-syllabic runs.",
    },
  });

  const doom = await prisma.artist.create({
    data: {
      userId: user.id,
      name: "MF DOOM",
      role: "Rapper / Producer",
      status: "STUDYING",
      genres: "Abstract Hip-Hop, Boom Bap",
      tags: "internal rhyme density, compound rhymes, oblique wordplay",
      favorite: true,
      notes: "Rhymes entire sentences with matching vowel schemes without sacrificing vivid surrealist imagery.",
    },
  });

  const dilla = await prisma.artist.create({
    data: {
      userId: user.id,
      name: "J Dilla",
      role: "Music Producer / Beatmaker",
      status: "ACTIVE_REFERENCE",
      genres: "Soul Sampling, Instrumental Hip-Hop, Neo-Soul",
      tags: "swing quantization off, sample chop, sub bass pocket",
      favorite: true,
      notes: "Humanized MPC micro-timing and unquantized grooves that defined the modern producer aesthetic.",
    },
  });

  const rubin = await prisma.artist.create({
    data: {
      userId: user.id,
      name: "Rick Rubin",
      role: "Creative Producer / Author",
      status: "STUDYING",
      genres: "Philosophy of Art, Production Architecture",
      tags: "reduction, creative instinct, subverting doubt",
      favorite: false,
      notes: "Reductionist philosophy: strip away non-essential elements until only the purest artistic impulse remains.",
    },
  });

  // 2. Artist References
  const dnaRef = await prisma.artistReference.create({
    data: {
      userId: user.id,
      artistId: kendrick.id,
      type: "SONG",
      title: "DNA.",
      creator: "Kendrick Lamar",
      album: "DAMN.",
      year: 2017,
      genre: "Hip-Hop / Hardcore Rap",
      favorite: true,
      url: "https://open.spotify.com/track/6HZILIRieu8S0iqY8kIKhj",
      notes: "Two contrasting sections: disciplined metric cadence in part 1 followed by unhinged acapella/808 aggression in part 2.",
      tags: "cadence, contrast, delivery, 808s",
    },
  });

  const samDotRef = await prisma.artistReference.create({
    data: {
      userId: user.id,
      artistId: kendrick.id,
      type: "SONG",
      title: "Sing About Me, I'm Dying of Thirst",
      creator: "Kendrick Lamar",
      album: "good kid, m.A.A.d city",
      year: 2012,
      genre: "Conscious Rap / Storytelling",
      favorite: true,
      notes: "12-minute 3-part epic written from three distinct character viewpoints with gunshot fading techniques.",
      tags: "storytelling, character perspective, narrative arc",
    },
  });

  const tpabRef = await prisma.artistReference.create({
    data: {
      userId: user.id,
      artistId: kendrick.id,
      type: "ALBUM",
      title: "To Pimp a Butterfly",
      creator: "Kendrick Lamar",
      year: 2015,
      genre: "Jazz Rap / Funk / Spoken Word",
      favorite: true,
      notes: "Masterwork in album cohesion: recurring spoken-word poem expanding after each song into a Tupac interview climax.",
      tags: "album architecture, recurring poem, live instrumentation",
    },
  });

  const accordionRef = await prisma.artistReference.create({
    data: {
      userId: user.id,
      artistId: doom.id,
      type: "SONG",
      title: "Accordion",
      creator: "Madvillain (MF DOOM & Madlib)",
      album: "Madvillainy",
      year: 2004,
      genre: "Underground Hip-Hop",
      favorite: true,
      notes: "Daedelus accordion loop with no chorus, 2 verses of continuous internal multisyllabic rhyme stringing.",
      tags: "internal rhyme, multisyllabic, sample flip",
    },
  });

  const creativeActRef = await prisma.artistReference.create({
    data: {
      userId: user.id,
      artistId: rubin.id,
      type: "BOOK",
      title: "The Creative Act: A Way of Being",
      creator: "Rick Rubin",
      year: 2023,
      genre: "Philosophy & Creativity",
      favorite: true,
      notes: "Chapters on Tuning In, Beginners Mind, The Vessel, and Overcoming Creative Doubt.",
      tags: "creative mindset, daily ritual, listening",
    },
  });

  // 3. Track Study Sessions
  await prisma.studySession.create({
    data: {
      userId: user.id,
      referenceId: dnaRef.id,
      artistId: kendrick.id,
      focus: "CADENCE",
      durationSeconds: 1200,
      startedAt: subDays(new Date(), 3),
      completedAt: subDays(new Date(), 3),
      observations: "The first 16 bars feature restrained metric division where syllables hit squarely on eighth notes. At bar 17 the beat collapses and vocal delivery becomes frantic.",
      techniques: "Abrupt cadence acceleration, dynamic contrast without pitch change, conversational pauses between punches.",
      favoriteSection: "Beat switch at 2:05 (Fox News sample into rapid fire second verse)",
      whyItWorks: "Extreme dynamic restraint in section 1 makes the chaotic energy of section 2 feel explosive.",
      whatSurprisedMe: "How little instrumentation is active during the heaviest vocal moments.",
      whatILearned: "Contrast between rigid pocket and chaotic freestyle cadence creates maximum tension.",
      experimentIdea: "Write a 16-bar verse where bar 1-8 uses strict 4-syllable rhyme cadence, then bar 9-16 doubles speed.",
      takeaway: "Mastery of cadence is about knowing when to break your own pattern.",
      rating: 5,
    },
  });

  await prisma.studySession.create({
    data: {
      userId: user.id,
      referenceId: accordionRef.id,
      artistId: doom.id,
      focus: "RHYME",
      durationSeconds: 900,
      startedAt: subDays(new Date(), 1),
      completedAt: subDays(new Date(), 1),
      observations: "DOOM weaves 3-syllable slant rhymes across consecutive lines without forcing sentence structure.",
      techniques: "Compound vowel rhyming ('holding microphone' / 'golden cyclone'), cross-line enjambment.",
      favoriteSection: "Opening 4 bars: 'Living off borrowed time, the clock ticks faster...'",
      whyItWorks: "Assonance and consonant grouping allow lines to flow naturally without predictable end rhymes.",
      whatSurprisedMe: "How conversational the cadence feels despite mathematically dense rhyme schemes.",
      whatILearned: "Focus on matching vowel patterns rather than exact spelling to unlock complex multisyllables.",
      experimentIdea: "Build a 6-word multisyllabic rhyme chain around the vowel sequence 'A-I-O' and draft 8 bars.",
      takeaway: "Internal rhyme creates rhythmic propulsion even over slow, unquantized beats.",
      rating: 5,
    },
  });

  // 4. Album Architecture Studies
  await prisma.albumStudy.create({
    data: {
      userId: user.id,
      referenceId: tpabRef.id,
      overallImpression: "A monumental body of work that functions as a single continuous musical and philosophical journey.",
      themes: "Self-worth, survivor's guilt, institutional racism, spiritual transformation, artistic responsibility.",
      productionNotes: "Live jazz rhythm sections (Terrace Martin, Thundercat, Robert Glasper) layered over dusty hip-hop drum breaks.",
      writingNotes: "Spoken-word poem accumulates line by line across tracks, concluding with an interview with Tupac Shakur.",
      sequencingNotes: "High-energy funk ('King Kunta') followed by dark introspection ('Institutionalized') creating an emotional rollercoaster.",
      standoutTracks: "Wesley's Theory, These Walls, The Blacker the Berry, Mortal Man",
      weakestTrack: "Hood Politics (slight lull in sequencing, though still strong)",
      recurringTechniques: "Recurring leitmotif poem, vocal pitch-shifting to represent psychological distress, live horns.",
      lessons: "A great album has a unifying sonic architecture and an overarching conceptual question it seeks to resolve.",
      experimentIdeas: "Create a 3-track mini-suite where a 4-line spoken mantra recurs in different musical keys.",
      rating: 5,
    },
  });

  // 5. Listening Diary Entries
  await prisma.listeningEntry.createMany({
    data: [
      {
        userId: user.id,
        referenceId: dnaRef.id,
        title: "DNA.",
        creator: "Kendrick Lamar",
        date: todayStr,
        durationMinutes: 15,
        purpose: "FLOW",
        mood: "Fired up / Focused",
        reaction: "The vocal inflection in verse 2 is visceral and completely locked to the 808 transient.",
        studyWorthy: true,
        notes: "Study the breath placement between bar 8 and 12.",
      },
      {
        userId: user.id,
        referenceId: accordionRef.id,
        title: "Accordion",
        creator: "Madvillain",
        date: yesterdayStr,
        durationMinutes: 20,
        purpose: "STUDY",
        mood: "Analytical",
        reaction: "Incredible demonstration of internal multi-syllabic rhyme weaving over a loop.",
        studyWorthy: true,
        notes: "Logged full track dissection in Study Vault.",
      },
      {
        userId: user.id,
        title: "Aquemini",
        creator: "OutKast",
        date: twoDaysAgoStr,
        durationMinutes: 25,
        purpose: "WRITING",
        mood: "Inspired",
        reaction: "André 3000's closing verse represents peak conversational lyricism.",
        studyWorthy: true,
        notes: "'My mind warps and bends, floats the wind, count to ten...'",
      },
    ],
  });

  // 6. Daily Reflections
  await prisma.dailyReflection.create({
    data: {
      userId: user.id,
      date: yesterdayStr,
      created: "Drafted 16 bars for Track 01 'Obsidian Skies' and structured demo chorus.",
      finished: "Completed 10-Minute Rapid Writing Sprint without stopping.",
      unfinished: "Need to refine the vocal cadence on the transition between verse 1 and hook.",
      practiced: "30 minutes metronome pocket syncopation drills at 90 BPM.",
      skillWorked: "Pocket Mastery & Cadence Variation",
      difficulties: "Rushing the delivery on fast 16th-note triplets on bar 9.",
      studied: "Dissected MF DOOM's internal rhyme schemes on 'Accordion'.",
      learned: "Vowel assonance creates natural bounce without forcing rigid end rhymes.",
      energy: "Writing early in the morning before looking at email gave massive momentum.",
      drained: "Phone notifications during the afternoon studio session.",
      distractions: "Checked social media between vocal takes.",
      clicked: "Realized the hook melody works better with half as many words.",
      surprised: "How fast the 10-minute sprint draft came together when zero editing was allowed.",
      continueItem: "Daily 10-minute morning sprint habit.",
      improveItem: "Put phone on airplane mode during vocal tracking.",
      tomorrowPriority: "Finish Verse 2 of 'Obsidian Skies' with 4-syllable rhyme schemes.",
      snapshotStats: JSON.stringify({
        writingDraftsCount: 2,
        trainingMinutes: 30,
        exercisesCompletedCount: 2,
        studySessionsCount: 1,
        songsUpdatedCount: 1,
        totalCreativeMinutes: 65,
      }),
    },
  });

  // 7. Weekly Reviews
  await prisma.weeklyReview.create({
    data: {
      userId: user.id,
      weekStart: format(startOfWeek(subDays(new Date(), 7), { weekStartsOn: 1 }), "yyyy-MM-dd"),
      weekEnd: format(endOfWeek(subDays(new Date(), 7), { weekStartsOn: 1 }), "yyyy-MM-dd"),
      outputNotes: "Completed 4 writing sprint drafts, locked in the arrangement for 2 EP tracks, and finished the core vocal structure for 'Obsidian Skies'.",
      learningNotes: "Studied 3 classic masterworks (Kendrick, DOOM, OutKast). Understood how dynamic restraint heightens explosive verses.",
      weaknessesNotes: "Struggled with finishing second verses — perfectionism causes hesitation when changing cadence.",
      momentumNotes: "10-minute rapid sprints in the morning eliminated writer's block. The metronome gym kept my pocket tight.",
      breakthroughNotes: "Discovered behind-the-beat vocal delivery pocket; everything grooves significantly harder.",
      nextFocus: "Dedicate the upcoming week to song completion & verse 2 finalization across all EP tracks.",
      statsSummary: JSON.stringify({
        totalMinutesPracticed: 145,
        totalDrillsCompleted: 9,
        totalWritingsCreated: 4,
        totalReferencesStudied: 3,
        totalSongsFinished: 1,
        mostPracticedCategory: "RAP & FLOW",
        leastPracticedCategory: "STORYTELLING",
        recurringBottleneck: "FINISHING: Hesitation on second verses",
        suggestedFocus: "Song Completion & 16-Bar Finalization",
      }),
    },
  });

  // 8. Bottlenecks
  await prisma.bottleneck.createMany({
    data: [
      {
        userId: user.id,
        category: "FINISHING",
        description: "I start songs with high energy hooks but slow down on verse 2 due to perfectionist overthinking.",
        severity: 4,
        date: todayStr,
        attemptedSolution: "Enforce 10-minute rapid 16-bar sprint rule with zero stopping or editing.",
        result: "Drafted 2 full verses in 20 minutes without getting stuck.",
        resolved: false,
      },
      {
        userId: user.id,
        category: "FLOW",
        description: "Tendency to rush ahead of the snare during fast 140 BPM trap cadences.",
        severity: 3,
        date: subDays(new Date(), 4).toISOString().split("T")[0],
        attemptedSolution: "Practiced with Pocket Gym metronome at 70 BPM (half-time click) to anchor delivery.",
        result: "Pocket feels locked and relaxed now.",
        resolved: true,
        resolvedAt: new Date(),
      },
    ],
  });

  // 9. Breakthroughs
  await prisma.breakthrough.createMany({
    data: [
      {
        userId: user.id,
        title: "Behind-The-Beat Delivery Pocket",
        category: "FLOW",
        date: subDays(new Date(), 2).toISOString().split("T")[0],
        description: "Discovered that dragging my vocal delivery slightly behind the metronome grid creates an infectious bounce.",
        cause: "Studying André 3000 and practicing with subdivision metronome clicks.",
        changeEffect: "All future verses will intentionally ride the back of the pocket rather than rushing the beat.",
      },
      {
        userId: user.id,
        title: "Vowel-Matrix Slant Rhyming",
        category: "WRITING",
        date: subDays(new Date(), 5).toISOString().split("T")[0],
        description: "Matching internal vowel sounds across words rather than exact spelling eliminates rhyming blocks.",
        cause: "Building multisyllabic rhyme matrices in the Rhyme Vault.",
        changeEffect: "Expanded rhyme palette by 300% without cheesy exact rhymes.",
      },
    ],
  });

  // 10. Milestones
  await prisma.milestone.createMany({
    data: [
      {
        userId: user.id,
        title: "Completed First 5-Track Body of Work Writing & Demos",
        date: subDays(new Date(), 10).toISOString().split("T")[0],
        category: "CREATION",
        description: "Wrote and demo-tracked all 5 songs for debut EP 'PRIME TRANSMISSIONS'.",
        significance: "First time completing a coherent, themed body of work from start to finish without abandoning tracks.",
        lessons: "Consistency and daily rapid sprints beat waiting for spontaneous inspiration.",
        nextStep: "Begin final vocal tracking and mixing passes.",
      },
      {
        userId: user.id,
        title: "14-Day Unbroken Creative Streak in PRIME",
        date: todayStr,
        category: "SKILL",
        description: "Logged deliberate practice, writing, and study sessions every single day for two straight weeks.",
        significance: "Proved that artist identity is built on daily studio habits rather than occasional inspiration.",
        lessons: "The system creates the artist.",
        nextStep: "Maintain streak through Phase 4 and into release.",
      },
    ],
  });

  console.log("Phase 1, 2, 3 & 4 Database seeded successfully with full training, study vault, and reflection diagnostic models!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
