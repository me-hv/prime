export type ActivityType =
  | "WRITING"
  | "PRODUCTION"
  | "RECORDING"
  | "LISTENING"
  | "READING"
  | "PRACTICE"
  | "REFLECTION";

export interface ActivityTypeConfig {
  label: string;
  description: string;
  iconName: string;
  badgeClass: string;
  color: string;
}

export const ACTIVITY_CONFIGS: Record<ActivityType, ActivityTypeConfig> = {
  WRITING: {
    label: "Writing",
    description: "Verses, lyrics, hooks, concepts, storytelling",
    iconName: "PenTool",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    color: "#F59E0B",
  },
  PRODUCTION: {
    label: "Music Production",
    description: "Beat making, sound design, arrangements, mixing",
    iconName: "Sliders",
    badgeClass: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    color: "#A855F7",
  },
  RECORDING: {
    label: "Recording",
    description: "Vocal takes, references, ad-libs, demo tracking",
    iconName: "Mic",
    badgeClass: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    color: "#F43F5E",
  },
  LISTENING: {
    label: "Listening / Study",
    description: "Album breakdowns, reference analysis, critical listening",
    iconName: "Headphones",
    badgeClass: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    color: "#38BDF8",
  },
  READING: {
    label: "Reading",
    description: "Books, poetry, bios, music theory, literature",
    iconName: "BookOpen",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    color: "#10B981",
  },
  PRACTICE: {
    label: "Practice / Drills",
    description: "Freestyle, cadence drills, breath control, instrument",
    iconName: "Flame",
    badgeClass: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    color: "#FB923C",
  },
  REFLECTION: {
    label: "Reflection / Journal",
    description: "Daily review, artist mindset, retrospective",
    iconName: "Compass",
    badgeClass: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    color: "#818CF8",
  },
};

export type GoalCategory =
  | "MUSIC"
  | "WRITING"
  | "RAP"
  | "PRODUCTION"
  | "PERSONAL"
  | "LEARNING";

export interface GoalCategoryConfig {
  label: string;
  badgeClass: string;
}

export const GOAL_CATEGORY_CONFIGS: Record<GoalCategory, GoalCategoryConfig> = {
  MUSIC: { label: "Music", badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  WRITING: { label: "Writing", badgeClass: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
  RAP: { label: "Rap", badgeClass: "bg-orange-500/15 text-orange-300 border-orange-500/30" },
  PRODUCTION: { label: "Production", badgeClass: "bg-purple-500/15 text-purple-300 border-purple-500/30" },
  PERSONAL: { label: "Personal", badgeClass: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" },
  LEARNING: { label: "Learning", badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
};

export type GoalStatus = "IN_PROGRESS" | "COMPLETED" | "PAUSED";

export type CaptureType =
  | "IDEA"
  | "LYRIC"
  | "HOOK"
  | "THOUGHT"
  | "SONG_IDEA"
  | "WRITING_IDEA"
  | "REMINDER";

export const CAPTURE_TYPE_CONFIGS: Record<CaptureType, { label: string; iconName: string }> = {
  IDEA: { label: "Idea", iconName: "Lightbulb" },
  LYRIC: { label: "Lyric / Bar", iconName: "Feather" },
  HOOK: { label: "Hook / Melody", iconName: "Music" },
  THOUGHT: { label: "Thought", iconName: "MessageSquare" },
  SONG_IDEA: { label: "Song Concept", iconName: "Disc" },
  WRITING_IDEA: { label: "Writing Idea", iconName: "FileText" },
  REMINDER: { label: "Artist Note", iconName: "Bell" },
};

export type CaptureStatus = "INBOX" | "IN_PROGRESS" | "ARCHIVED";

export interface ProfileData {
  id: string;
  userId: string;
  displayName: string;
  artistName: string;
  bio: string;
  disciplines: string[];
  currentFocus: string;
  vision: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailyMissionData {
  id: string;
  userId: string;
  date: string;
  title: string;
  description: string | null;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreativeActivityData {
  id: string;
  userId: string;
  type: ActivityType;
  title: string;
  description: string | null;
  durationMinutes: number;
  date: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GoalData {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  category: GoalCategory;
  targetDate: string | null;
  status: GoalStatus;
  currentProgress: number;
  targetProgress: number;
  unit: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuickCaptureData {
  id: string;
  userId: string;
  type: CaptureType;
  title: string | null;
  content: string;
  tags: string | null;
  status: CaptureStatus;
  convertedTo: string | null;
  convertedId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyDayStat {
  date: string; // YYYY-MM-DD
  dayLabel: string; // Mon, Tue, etc.
  fullDayName: string; // Monday, Tuesday
  isToday: boolean;
  totalMinutes: number;
  activitiesCount: number;
  activities: CreativeActivityData[];
  primaryDiscipline: ActivityType | null;
}

export interface DashboardStats {
  creativeDaysThisWeek: number;
  totalCreativeMinutesWeek: number;
  totalWritingSessions: number;
  totalProductionSessions: number;
  totalStudySessions: number;
  completedMissionsCount: number;
  currentStreakDays: number;
  streakActiveToday: boolean;
}

// Phase 2: Creative Workspace Types

export type WritingType =
  | "FREE_WRITE"
  | "BARS"
  | "HOOK"
  | "VERSE"
  | "POEM"
  | "IDEA"
  | "LYRIC"
  | "CONCEPT"
  | "OTHER";

export const WRITING_TYPE_CONFIGS: Record<WritingType, { label: string; badgeClass: string }> = {
  FREE_WRITE: { label: "Free Write", badgeClass: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
  BARS: { label: "16 Bars", badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  HOOK: { label: "Hook / Chorus", badgeClass: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  VERSE: { label: "Verse", badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  POEM: { label: "Poetry / Prose", badgeClass: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
  IDEA: { label: "Creative Thought", badgeClass: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  LYRIC: { label: "Lyric Snippet", badgeClass: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
  CONCEPT: { label: "Song Concept", badgeClass: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  OTHER: { label: "Other", badgeClass: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
};

export type WritingStatus = "DRAFT" | "IN_PROGRESS" | "FINISHED" | "ARCHIVED";

export interface WritingDocumentData {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: WritingType;
  status: WritingStatus;
  tags: string | null;
  wordCount: number;
  characterCount: number;
  createdAt: string;
  updatedAt: string;
}

export type SongStatus =
  | "IDEA"
  | "CONCEPT"
  | "WRITING"
  | "DEMO"
  | "RECORDING"
  | "MIXING"
  | "MASTERING"
  | "FINISHED"
  | "ARCHIVED";

export const SONG_STATUS_CONFIGS: Record<
  SongStatus,
  { label: string; badgeClass: string; step: number }
> = {
  IDEA: { label: "Idea", badgeClass: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30", step: 1 },
  CONCEPT: { label: "Concept", badgeClass: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30", step: 2 },
  WRITING: { label: "Writing", badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30", step: 3 },
  DEMO: { label: "Demo Cut", badgeClass: "bg-purple-500/15 text-purple-300 border-purple-500/30", step: 4 },
  RECORDING: { label: "Recording", badgeClass: "bg-rose-500/15 text-rose-300 border-rose-500/30", step: 5 },
  MIXING: { label: "Mixing", badgeClass: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30", step: 6 },
  MASTERING: { label: "Mastering", badgeClass: "bg-blue-500/15 text-blue-300 border-blue-500/30", step: 7 },
  FINISHED: { label: "Finished", badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40", step: 8 },
  ARCHIVED: { label: "Archived", badgeClass: "bg-zinc-600/10 text-zinc-400 border-zinc-600/20", step: 0 },
};

export type SongSectionType =
  | "HOOK"
  | "VERSE"
  | "BRIDGE"
  | "INTRO"
  | "OUTRO"
  | "PRE_CHORUS"
  | "NOTES"
  | "CUSTOM";

export const SECTION_TYPE_CONFIGS: Record<
  SongSectionType,
  { label: string; defaultTitle: string; badgeClass: string }
> = {
  HOOK: { label: "Hook / Chorus", defaultTitle: "Hook", badgeClass: "bg-purple-500/15 text-purple-300 border-purple-500/30" },
  VERSE: { label: "Verse", defaultTitle: "Verse", badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  BRIDGE: { label: "Bridge", defaultTitle: "Bridge", badgeClass: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
  INTRO: { label: "Intro", defaultTitle: "Intro", badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  OUTRO: { label: "Outro", defaultTitle: "Outro", badgeClass: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" },
  PRE_CHORUS: { label: "Pre-Chorus", defaultTitle: "Pre-Chorus", badgeClass: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
  NOTES: { label: "Arrangement Notes", defaultTitle: "Notes & Direction", badgeClass: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30" },
  CUSTOM: { label: "Custom Section", defaultTitle: "Section", badgeClass: "bg-teal-500/15 text-teal-300 border-teal-500/30" },
};

export interface SongSectionData {
  id: string;
  songId: string;
  type: SongSectionType;
  name: string;
  content: string;
  orderIndex: number;
  collapsed: boolean;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SongData {
  id: string;
  userId: string;
  title: string;
  concept: string | null;
  status: SongStatus;
  genre: string | null;
  bpm: number | null;
  musicalKey: string | null;
  mood: string | null;
  nextAction: string | null;
  tags: string | null;
  notes: string | null;
  wordCount: number;
  sections: SongSectionData[];
  projectIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export type ProjectType =
  | "ALBUM"
  | "EP"
  | "MIXTAPE"
  | "PLAYLIST"
  | "COLLECTION"
  | "PROJECT";

export const PROJECT_TYPE_CONFIGS: Record<ProjectType, { label: string; badgeClass: string }> = {
  ALBUM: { label: "Album", badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  EP: { label: "EP", badgeClass: "bg-purple-500/15 text-purple-300 border-purple-500/30" },
  MIXTAPE: { label: "Mixtape", badgeClass: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
  PLAYLIST: { label: "Playlist", badgeClass: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
  COLLECTION: { label: "Collection", badgeClass: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" },
  PROJECT: { label: "Project", badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
};

export type ProjectStatus = "IDEA" | "PLANNING" | "IN_PROGRESS" | "COMPLETED" | "ARCHIVED";

export interface ProjectSongData {
  id: string;
  projectId: string;
  songId: string;
  trackNumber: number;
  notes: string | null;
  song?: SongData;
  createdAt: string;
  updatedAt: string;
}

export interface CreativeProjectData {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  type: ProjectType;
  status: ProjectStatus;
  targetDate: string | null;
  notes: string | null;
  coverUrl: string | null;
  songs: ProjectSongData[];
  createdAt: string;
  updatedAt: string;
}

export interface SearchItemResult {
  id: string;
  title: string;
  subtitle: string;
  type:
    | "WRITING"
    | "SONG"
    | "PROJECT"
    | "CAPTURE"
    | "ARTIST"
    | "REFERENCE"
    | "STUDY"
    | "REFLECTION"
    | "BOTTLENECK"
    | "BREAKTHROUGH"
    | "MILESTONE"
    | "SKILL"
    | "DNA";
  categoryBadge: string;
  href: string;
  updatedAt: string;
  snippet?: string;
}

// ==========================================
// Phase 3: Training System Types
// ==========================================

export type SkillCategory =
  | "RAP"
  | "WRITING"
  | "PRODUCTION"
  | "EAR_TRAINING"
  | "VOCABULARY";

export const SKILL_CATEGORY_CONFIGS: Record<
  SkillCategory,
  { label: string; badgeClass: string; color: string }
> = {
  RAP: { label: "Rap & Flow", badgeClass: "bg-orange-500/15 text-orange-300 border-orange-500/30", color: "#FB923C" },
  WRITING: { label: "Lyrical Writing", badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30", color: "#F59E0B" },
  PRODUCTION: { label: "Production", badgeClass: "bg-purple-500/15 text-purple-300 border-purple-500/30", color: "#A855F7" },
  EAR_TRAINING: { label: "Ear Training", badgeClass: "bg-sky-500/15 text-sky-300 border-sky-500/30", color: "#38BDF8" },
  VOCABULARY: { label: "Vocabulary", badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", color: "#10B981" },
};

export interface SkillData {
  id: string;
  name: string;
  slug: string;
  category: SkillCategory;
  description: string | null;
  exerciseCount?: number;
}

export type ExerciseCategory =
  | "RAP"
  | "WRITING"
  | "FLOW"
  | "RHYME"
  | "FREESTYLE"
  | "STORYTELLING"
  | "VOCABULARY"
  | "PRODUCTION"
  | "EAR_TRAINING";

export interface ExerciseCategoryConfig {
  label: string;
  shortLabel: string;
  description: string;
  badgeClass: string;
  iconName: string;
  color: string;
}

export const EXERCISE_CATEGORY_CONFIGS: Record<
  ExerciseCategory,
  ExerciseCategoryConfig
> = {
  RAP: {
    label: "Rap & Delivery",
    shortLabel: "Rap",
    description: "Breath control, vocal conviction, diction, projection",
    badgeClass: "bg-orange-500/15 text-orange-300 border-orange-500/30",
    iconName: "Mic2",
    color: "#FB923C",
  },
  FLOW: {
    label: "Flow & Cadence",
    shortLabel: "Flow",
    description: "Pocket elasticity, syncopation shifts, triplets, metric division",
    badgeClass: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    iconName: "Activity",
    color: "#F43F5E",
  },
  WRITING: {
    label: "Rapid Writing",
    shortLabel: "Writing",
    description: "Timed writing sprints, 16-bar execution, zero-editing instincts",
    badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    iconName: "PenTool",
    color: "#F59E0B",
  },
  RHYME: {
    label: "Rhyme Construction",
    shortLabel: "Rhyme",
    description: "Multisyllabic chains, internal rhyme weaving, slant rhymes",
    badgeClass: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
    iconName: "Sparkles",
    color: "#EAB308",
  },
  FREESTYLE: {
    label: "Freestyle & Improv",
    shortLabel: "Freestyle",
    description: "Random word prompt injection, object freestyle, topic pivot",
    badgeClass: "bg-red-500/15 text-red-300 border-red-500/30",
    iconName: "Flame",
    color: "#EF4444",
  },
  STORYTELLING: {
    label: "Storytelling & Concept",
    shortLabel: "Story",
    description: "3-part narrative arcs, sensory detail, perspective shifts",
    badgeClass: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    iconName: "BookOpen",
    color: "#818CF8",
  },
  VOCABULARY: {
    label: "Vocabulary Gym",
    shortLabel: "Vocab",
    description: "Daily word discovery, lyrical lines, sensory associations",
    badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    iconName: "Library",
    color: "#10B981",
  },
  PRODUCTION: {
    label: "Beat Production",
    shortLabel: "Production",
    description: "Speed sample flips, 3-element beats, 5-sound arrangements",
    badgeClass: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    iconName: "Sliders",
    color: "#A855F7",
  },
  EAR_TRAINING: {
    label: "Ear Training",
    shortLabel: "Ear",
    description: "Tempo pocket sync, major/minor mood, interval discernment",
    badgeClass: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    iconName: "Headphones",
    color: "#38BDF8",
  },
};

export type ExerciseDifficulty =
  | "BEGINNER"
  | "INTERMEDIATE"
  | "ADVANCED"
  | "EXPERT";

export const DIFFICULTY_CONFIGS: Record<
  ExerciseDifficulty,
  { label: string; badgeClass: string; dots: number }
> = {
  BEGINNER: { label: "Beginner", badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", dots: 1 },
  INTERMEDIATE: { label: "Intermediate", badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30", dots: 2 },
  ADVANCED: { label: "Advanced", badgeClass: "bg-orange-500/15 text-orange-300 border-orange-500/30", dots: 3 },
  EXPERT: { label: "Expert", badgeClass: "bg-rose-500/15 text-rose-300 border-rose-500/30", dots: 4 },
};

export interface ExerciseData {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: ExerciseCategory;
  difficulty: ExerciseDifficulty;
  estimatedDuration: number;
  instructions: string;
  constraints: string | null;
  starterPrompt: string | null;
  defaultBpm: number | null;
  timeLimitSeconds: number | null;
  active: boolean;
  orderIndex: number;
  skills: SkillData[];
  sessionCount?: number;
  lastPracticedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type TrainingSessionStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ABANDONED";

export interface TrainingSessionData {
  id: string;
  userId: string;
  exerciseId: string;
  status: TrainingSessionStatus;
  startedAt: string;
  endedAt: string | null;
  durationSeconds: number;
  effortRating: number | null;
  difficultyRating: number | null;
  confidenceRating: number | null;
  notes: string | null;
  resultPayload: string | null;
  writingDocumentId: string | null;
  exercise?: ExerciseData;
  writingDocument?: WritingDocumentData | null;
  createdAt: string;
  updatedAt: string;
}

export interface RhymeEntryData {
  id: string;
  chainId: string;
  rhymeText: string;
  syllables: number | null;
  orderIndex: number;
  notes: string | null;
  createdAt: string;
}

export interface RhymeChainData {
  id: string;
  userId: string;
  sessionId: string | null;
  anchorPhrase: string;
  syllableCount: number;
  notes: string | null;
  entries: RhymeEntryData[];
  createdAt: string;
  updatedAt: string;
}

export interface VocabularyEntryData {
  id: string;
  userId: string;
  sessionId: string | null;
  word: string;
  definition: string;
  pronunciation: string | null;
  partOfSpeech: string | null;
  userLine: string | null;
  associations: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingStatsData {
  streakDays: number;
  streakActiveToday: boolean;
  weeklyPracticeMinutes: number;
  totalSessionsCompleted: number;
  skillsTrainedCount: number;
  totalPracticeMinutes: number;
}

// ==========================================
// Phase 4: Discovery & Reflection Types
// ==========================================

export type ArtistStatus =
  | "DISCOVERED"
  | "STUDYING"
  | "ACTIVE_REFERENCE"
  | "ARCHIVED";

export const ARTIST_STATUS_CONFIGS: Record<
  ArtistStatus,
  { label: string; badgeClass: string }
> = {
  DISCOVERED: {
    label: "Discovered",
    badgeClass: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  },
  STUDYING: {
    label: "Actively Studying",
    badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  },
  ACTIVE_REFERENCE: {
    label: "Active Reference",
    badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  },
  ARCHIVED: {
    label: "Archived",
    badgeClass: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
  },
};

export type ReferenceType =
  | "SONG"
  | "ALBUM"
  | "ARTIST"
  | "BOOK"
  | "ARTICLE"
  | "INTERVIEW"
  | "VIDEO"
  | "OTHER";

export const REFERENCE_TYPE_CONFIGS: Record<
  ReferenceType,
  { label: string; iconName: string; badgeClass: string }
> = {
  SONG: {
    label: "Song Track",
    iconName: "Headphones",
    badgeClass: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  },
  ALBUM: {
    label: "Album / LP",
    iconName: "Disc",
    badgeClass: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  },
  ARTIST: {
    label: "Artist Catalog",
    iconName: "Users",
    badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  },
  BOOK: {
    label: "Book / Literature",
    iconName: "BookOpen",
    badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  },
  ARTICLE: {
    label: "Article / Essay",
    iconName: "FileText",
    badgeClass: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  },
  INTERVIEW: {
    label: "Interview / Panel",
    iconName: "Mic",
    badgeClass: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  },
  VIDEO: {
    label: "Video / Breakdown",
    iconName: "Video",
    badgeClass: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  },
  OTHER: {
    label: "Other Resource",
    iconName: "Compass",
    badgeClass: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
  },
};

export type StudyFocus =
  | "FLOW"
  | "CADENCE"
  | "WRITING"
  | "STORYTELLING"
  | "WORDPLAY"
  | "RHYME"
  | "HOOKS"
  | "DELIVERY"
  | "PRODUCTION"
  | "ARRANGEMENT"
  | "SAMPLING"
  | "SOUND_SELECTION"
  | "VOCABULARY"
  | "CONCEPT";

export interface StudyFocusConfig {
  label: string;
  category: "Writing" | "Flow" | "Production" | "Artist";
  badgeClass: string;
  description: string;
}

export const STUDY_FOCUS_CONFIGS: Record<StudyFocus, StudyFocusConfig> = {
  FLOW: {
    label: "Flow & Pocket",
    category: "Flow",
    badgeClass: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    description: "Pocket elasticity, bounce, syncopation, and rhythmic feel",
  },
  CADENCE: {
    label: "Cadence & Phrasing",
    category: "Flow",
    badgeClass: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    description: "Cadence switches, metric division, and syllable grouping",
  },
  DELIVERY: {
    label: "Delivery & Tone",
    category: "Flow",
    badgeClass: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    description: "Vocal energy, dynamic contrast, breath control, and tone inflection",
  },
  WRITING: {
    label: "Lyrical Writing",
    category: "Writing",
    badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    description: "Line construction, density, themes, and emotional impact",
  },
  STORYTELLING: {
    label: "Storytelling & Arc",
    category: "Writing",
    badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    description: "Narrative pacing, vivid imagery, sensory details, and perspectives",
  },
  WORDPLAY: {
    label: "Wordplay & Double Entendres",
    category: "Writing",
    badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    description: "Metaphors, similes, punchlines, and clever linguistic subversion",
  },
  RHYME: {
    label: "Rhyme Scheme & Multisyllables",
    category: "Writing",
    badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    description: "Internal rhymes, compound vowel chains, and slant rhymes",
  },
  HOOKS: {
    label: "Hook & Chorus Craft",
    category: "Artist",
    badgeClass: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    description: "Melodic catchiness, anthemic repetition, and vocal stickiness",
  },
  CONCEPT: {
    label: "Concept & Worldbuilding",
    category: "Artist",
    badgeClass: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    description: "Song identity, thematic coherence, and artistic authenticity",
  },
  PRODUCTION: {
    label: "Beat Production & Sonic Palette",
    category: "Production",
    badgeClass: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    description: "Drums, basslines, melodic hooks, and sonic texture",
  },
  ARRANGEMENT: {
    label: "Arrangement & Dynamics",
    category: "Production",
    badgeClass: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    description: "Build-ups, drops, beat switches, transitions, and energy arcs",
  },
  SAMPLING: {
    label: "Sample Flip & Interpolation",
    category: "Production",
    badgeClass: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    description: "Chop techniques, pitch shifting, groove realignment, and texture",
  },
  SOUND_SELECTION: {
    label: "Sound Selection & Mixing",
    category: "Production",
    badgeClass: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    description: "Frequency balance, vocal chain placement, and spatial depth",
  },
  VOCABULARY: {
    label: "Vocabulary & Lexicon",
    category: "Writing",
    badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    description: "Uncommon words, evocative nouns, and precise semantic choices",
  },
};

export type ListeningPurpose =
  | "CASUAL"
  | "INSPIRATION"
  | "STUDY"
  | "PRODUCTION"
  | "WRITING"
  | "FLOW"
  | "RESEARCH";

export const LISTENING_PURPOSE_CONFIGS: Record<
  ListeningPurpose,
  { label: string; badgeClass: string }
> = {
  STUDY: { label: "Deep Study", badgeClass: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
  INSPIRATION: { label: "Inspiration", badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  WRITING: { label: "Writing Focus", badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  FLOW: { label: "Flow Analysis", badgeClass: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
  PRODUCTION: { label: "Production Ear", badgeClass: "bg-purple-500/15 text-purple-300 border-purple-500/30" },
  RESEARCH: { label: "Research", badgeClass: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" },
  CASUAL: { label: "Casual Listen", badgeClass: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30" },
};

export interface ArtistData {
  id: string;
  userId: string;
  name: string;
  role: string;
  notes: string | null;
  status: ArtistStatus;
  genres: string | null;
  tags: string | null;
  favorite: boolean;
  referenceCount?: number;
  studySessionCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ArtistReferenceData {
  id: string;
  userId: string;
  type: ReferenceType;
  title: string;
  creator: string;
  artistId: string | null;
  artist?: ArtistData | null;
  year: number | null;
  url: string | null;
  album: string | null;
  genre: string | null;
  notes: string | null;
  tags: string | null;
  favorite: boolean;
  studySessionCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface StudySessionData {
  id: string;
  userId: string;
  referenceId: string | null;
  reference?: ArtistReferenceData | null;
  artistId: string | null;
  artist?: ArtistData | null;
  focus: StudyFocus;
  customFocus: string | null;
  startedAt: string;
  completedAt: string | null;
  durationSeconds: number;
  observations: string | null;
  techniques: string | null;
  favoriteSection: string | null;
  whyItWorks: string | null;
  whatSurprisedMe: string | null;
  whatILearned: string | null;
  experimentIdea: string | null;
  takeaway: string | null;
  rating: number | null;
  skillId: string | null;
  skill?: SkillData | null;
  createdAt: string;
  updatedAt: string;
}

export interface AlbumStudyData {
  id: string;
  userId: string;
  referenceId: string;
  reference?: ArtistReferenceData | null;
  overallImpression: string | null;
  themes: string | null;
  productionNotes: string | null;
  writingNotes: string | null;
  sequencingNotes: string | null;
  standoutTracks: string | null;
  weakestTrack: string | null;
  recurringTechniques: string | null;
  lessons: string | null;
  experimentIdeas: string | null;
  rating: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListeningEntryData {
  id: string;
  userId: string;
  referenceId: string | null;
  reference?: ArtistReferenceData | null;
  title: string;
  creator: string;
  date: string;
  durationMinutes: number;
  purpose: ListeningPurpose;
  mood: string | null;
  reaction: string | null;
  studyWorthy: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DiscoveryStatsData {
  totalReferences: number;
  totalArtistsStudied: number;
  totalStudySessions: number;
  totalStudyMinutes: number;
  activeStudyFocus: string[];
  listeningEntriesCount: number;
}

export interface TodayStudyRecommendation {
  reference: ArtistReferenceData | null;
  artist: ArtistData | null;
  focus: StudyFocus;
  reason: string;
  suggestedAction: string;
}

// Reflection Models & Configs

export type BottleneckCategory =
  | "DISCIPLINE"
  | "DISTRACTION"
  | "WRITING"
  | "FLOW"
  | "VOCABULARY"
  | "RHYME"
  | "STORYTELLING"
  | "PRODUCTION"
  | "SONG_STRUCTURE"
  | "FINISHING"
  | "CONFIDENCE"
  | "TIME"
  | "ENERGY"
  | "OTHER";

export const BOTTLENECK_CATEGORY_CONFIGS: Record<
  BottleneckCategory,
  { label: string; badgeClass: string; suggestedSkillSlug?: string }
> = {
  FINISHING: {
    label: "Finishing Songs",
    badgeClass: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    suggestedSkillSlug: "rapid-drafting",
  },
  WRITING: {
    label: "Writing & Lyricism",
    badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    suggestedSkillSlug: "rapid-drafting",
  },
  FLOW: {
    label: "Flow & Cadence",
    badgeClass: "bg-orange-500/15 text-orange-300 border-orange-500/30",
    suggestedSkillSlug: "pocket-mastery",
  },
  SONG_STRUCTURE: {
    label: "Song Structure & Hooks",
    badgeClass: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    suggestedSkillSlug: "punchline-placement",
  },
  RHYME: {
    label: "Rhyme Scheme Limits",
    badgeClass: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
    suggestedSkillSlug: "multisyllabic-rhyming",
  },
  VOCABULARY: {
    label: "Vocabulary Range",
    badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    suggestedSkillSlug: "lyrical-vocabulary",
  },
  STORYTELLING: {
    label: "Storytelling Depth",
    badgeClass: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    suggestedSkillSlug: "narrative-structure",
  },
  PRODUCTION: {
    label: "Production & Beats",
    badgeClass: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    suggestedSkillSlug: "tempo-rhythm-sync",
  },
  CONFIDENCE: {
    label: "Creative Doubt / Confidence",
    badgeClass: "bg-red-500/15 text-red-300 border-red-500/30",
  },
  DISCIPLINE: {
    label: "Daily Discipline",
    badgeClass: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
  },
  DISTRACTION: {
    label: "Distractions & Focus",
    badgeClass: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
  },
  TIME: {
    label: "Time Constraints",
    badgeClass: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
  },
  ENERGY: {
    label: "Fatigue / Energy",
    badgeClass: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
  },
  OTHER: {
    label: "Other Bottleneck",
    badgeClass: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
  },
};

export type BreakthroughCategory =
  | "FLOW"
  | "WRITING"
  | "PRODUCTION"
  | "MINDSET"
  | "PROCESS"
  | "TECHNIQUE"
  | "OTHER";

export const BREAKTHROUGH_CATEGORY_CONFIGS: Record<
  BreakthroughCategory,
  { label: string; badgeClass: string }
> = {
  FLOW: { label: "Flow & Pocket", badgeClass: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
  WRITING: { label: "Writing & Lyrics", badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  PRODUCTION: { label: "Production", badgeClass: "bg-purple-500/15 text-purple-300 border-purple-500/30" },
  MINDSET: { label: "Artist Mindset", badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  PROCESS: { label: "Creative Process", badgeClass: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
  TECHNIQUE: { label: "Vocal / DAW Technique", badgeClass: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" },
  OTHER: { label: "General Breakthrough", badgeClass: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30" },
};

export type MilestoneCategory =
  | "RELEASE"
  | "CREATION"
  | "PERFORMANCE"
  | "SKILL"
  | "MILESTONE"
  | "CAREER";

export const MILESTONE_CATEGORY_CONFIGS: Record<
  MilestoneCategory,
  { label: string; badgeClass: string }
> = {
  RELEASE: { label: "Project / Song Release", badgeClass: "bg-purple-500/15 text-purple-300 border-purple-500/30" },
  CREATION: { label: "Body of Work", badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  PERFORMANCE: { label: "Live Performance", badgeClass: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
  SKILL: { label: "Skill Milestone", badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  CAREER: { label: "Career Benchmark", badgeClass: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
  MILESTONE: { label: "Milestone", badgeClass: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" },
};

export interface DailyReflectionData {
  id: string;
  userId: string;
  date: string;
  created: string | null;
  finished: string | null;
  unfinished: string | null;
  practiced: string | null;
  skillWorked: string | null;
  difficulties: string | null;
  studied: string | null;
  learned: string | null;
  energy: string | null;
  drained: string | null;
  distractions: string | null;
  clicked: string | null;
  surprised: string | null;
  continueItem: string | null;
  improveItem: string | null;
  tomorrowPriority: string | null;
  snapshotStats: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyReviewData {
  id: string;
  userId: string;
  weekStart: string;
  weekEnd: string;
  outputNotes: string | null;
  learningNotes: string | null;
  weaknessesNotes: string | null;
  momentumNotes: string | null;
  breakthroughNotes: string | null;
  nextFocus: string | null;
  statsSummary: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BottleneckData {
  id: string;
  userId: string;
  category: BottleneckCategory;
  description: string;
  severity: number; // 1-5
  date: string;
  attemptedSolution: string | null;
  result: string | null;
  resolved: boolean;
  resolvedAt: string | null;
  skillId: string | null;
  skill?: SkillData | null;
  createdAt: string;
  updatedAt: string;
}

export interface BreakthroughData {
  id: string;
  userId: string;
  title: string;
  category: BreakthroughCategory;
  date: string;
  description: string;
  cause: string | null;
  changeEffect: string | null;
  skillId: string | null;
  skill?: SkillData | null;
  songId: string | null;
  song?: SongData | null;
  trainingSessionId: string | null;
  studySessionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MilestoneData {
  id: string;
  userId: string;
  title: string;
  date: string;
  category: MilestoneCategory;
  description: string;
  significance: string | null;
  lessons: string | null;
  nextStep: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReflectionStatsData {
  totalDailyReflections: number;
  totalWeeklyReviews: number;
  activeBottlenecksCount: number;
  resolvedBottlenecksCount: number;
  breakthroughsCount: number;
  milestonesCount: number;
}

export interface TodayActivityContext {
  date: string;
  writingDraftsCount: number;
  trainingMinutes: number;
  exercisesCompletedCount: number;
  studySessionsCount: number;
  songsUpdatedCount: number;
  totalCreativeMinutes: number;
  activities: CreativeActivityData[];
}

export interface WeeklyDiagnosticInsight {
  weekStart: string;
  weekEnd: string;
  totalMinutesPracticed: number;
  totalDrillsCompleted: number;
  totalWritingsCreated: number;
  totalReferencesStudied: number;
  totalSongsFinished: number;
  mostPracticedCategory: string | null;
  leastPracticedCategory: string | null;
  recurringBottleneck: string | null;
  strongestMomentum: string;
  suggestedFocus: string;
  actionableRecommendation: string;
}

// ==========================================
// Phase 5: Progress & Artist DNA Types
// ==========================================

export type TimeRangePeriod = "7D" | "30D" | "90D" | "6M" | "1Y" | "ALL";

export interface TimeRangeConfig {
  id: TimeRangePeriod;
  label: string;
  days: number | null; // null for ALL
  shortLabel: string;
}

export const TIME_RANGE_CONFIGS: Record<TimeRangePeriod, TimeRangeConfig> = {
  "7D": { id: "7D", label: "Last 7 Days", days: 7, shortLabel: "7D" },
  "30D": { id: "30D", label: "Last 30 Days", days: 30, shortLabel: "30D" },
  "90D": { id: "90D", label: "Last 90 Days", days: 90, shortLabel: "90D" },
  "6M": { id: "6M", label: "Last 6 Months", days: 180, shortLabel: "6M" },
  "1Y": { id: "1Y", label: "Last 1 Year", days: 365, shortLabel: "1Y" },
  "ALL": { id: "ALL", label: "All Time", days: null, shortLabel: "ALL" },
};

export type PatternConfidenceLevel =
  | "INSUFFICIENT_DATA"
  | "EMERGING_PATTERN"
  | "RECURRING_PATTERN"
  | "STRONG_PATTERN";

export interface PatternConfidenceConfig {
  label: string;
  badgeClass: string;
  description: string;
}

export const PATTERN_CONFIDENCE_CONFIGS: Record<
  PatternConfidenceLevel,
  PatternConfidenceConfig
> = {
  INSUFFICIENT_DATA: {
    label: "Insufficient Data",
    badgeClass: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    description: "PRIME needs more creative history before identifying a reliable pattern.",
  },
  EMERGING_PATTERN: {
    label: "Emerging Pattern",
    badgeClass: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    description: "Beginning to appear across multiple recent sessions.",
  },
  RECURRING_PATTERN: {
    label: "Recurring Pattern",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    description: "Consistently observed across several weeks of creative work.",
  },
  STRONG_PATTERN: {
    label: "Strong Pattern",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    description: "Established hallmark of your creative process with deep supporting evidence.",
  },
};

export type SkillTrendDirection = "UP" | "DOWN" | "STEADY" | "NEW" | "INACTIVE";

export type PracticeFrequencyLevel = "High" | "Medium" | "Low" | "None";

export interface ProgressOverviewData {
  period: TimeRangePeriod;
  practiceMinutes: number;
  practiceMinutesDeltaPct: number | null;
  practiceSessionsCount: number;
  wordsWritten: number;
  wordsWrittenDeltaPct: number | null;
  writingSessionsCount: number;
  songsStartedCount: number;
  songsProgressedCount: number;
  songsFinishedCount: number;
  studiesCompletedCount: number;
  studiesDeltaPct: number | null;
  reflectionsCompletedCount: number;
  activeCreativeDays: number;
  totalPeriodDays: number;
  activeProjectsCount: number;
  breakthroughsCount: number;
  currentStreak: number;
  creativeMomentum: "HIGH" | "STEADY" | "REBUILDING" | "STARTING";
}

export interface CreativeOutputTimeSeriesPoint {
  date: string;
  label: string;
  writingMinutes: number;
  practiceMinutes: number;
  studyMinutes: number;
  reflectionMinutes: number;
  totalMinutes: number;
}

export interface FinishingHealthData {
  totalCreated: number;
  totalFinished: number;
  totalActive: number;
  totalArchived: number;
  completionRatioPct: number;
  avgDaysToFinish: number | null;
  stalledSongsCount: number;
  funnelDistribution: Array<{
    status: SongStatus;
    label: string;
    count: number;
    percentage: number;
  }>;
  stalledSongs: Array<{
    id: string;
    title: string;
    status: SongStatus;
    daysInactive: number;
    genre: string | null;
    nextAction: string | null;
    updatedAt: string;
  }>;
}

export interface SkillMatrixItem {
  id: string;
  name: string;
  slug: string;
  category: SkillCategory;
  description: string | null;
  practiceFrequency: PracticeFrequencyLevel;
  completedSessions: number;
  totalPracticeMinutes: number;
  avgConfidence: number | null;
  avgDifficulty: number | null;
  trend: SkillTrendDirection;
  lastPracticed: string | null;
  isUndertrained: boolean;
  exerciseCount: number;
  studyCount: number;
  breakthroughCount: number;
  creativeWorkCount: number;
}

export interface SkillDetailData {
  skill: SkillData;
  matrix: SkillMatrixItem;
  historyPoints: Array<{
    date: string;
    sessionTitle: string;
    durationSeconds: number;
    effortRating: number | null;
    difficultyRating: number | null;
    confidenceRating: number | null;
  }>;
  associatedExercises: ExerciseData[];
  associatedStudies: StudySessionData[];
  associatedBreakthroughs: BreakthroughData[];
  associatedBottlenecks: BottleneckData[];
  associatedSongs: SongData[];
  associatedWritings: WritingDocumentData[];
  recentReflectionMentions: Array<{
    date: string;
    skillWorked: string | null;
    difficulties: string | null;
    learned: string | null;
  }>;
}

export interface StrengthSignal {
  skillName: string;
  skillId: string;
  summary: string;
  evidence: string[];
  category: SkillCategory;
}

export interface WeaknessSignal {
  skillName: string;
  skillId: string;
  summary: string;
  evidence: string[];
  category: SkillCategory;
  type: "UNDERTRAINED" | "CHALLENGE" | "BOTTLENECK";
  suggestedExerciseSlug: string | null;
  suggestedExerciseTitle: string | null;
}

export interface StudyPracticeGapItem {
  focus: string;
  studyVolume: "HIGH" | "MEDIUM" | "LOW" | "NONE";
  practiceVolume: "HIGH" | "MEDIUM" | "LOW" | "NONE";
  studyCount: number;
  practiceCount: number;
  status: "BALANCED" | "STUDY_GAP" | "PRACTICE_GAP" | "DORMANT";
  insight: string;
  actionTargetCategory: string | null;
}

export interface ProgressInsightItem {
  id: string;
  type:
    | "POSITIVE"
    | "IMBALANCE"
    | "GAP"
    | "BOTTLENECK"
    | "CONSISTENCY"
    | "NEGLECTED"
    | "BREAKTHROUGH";
  title: string;
  observation: string;
  evidence: string;
  actionLabel: string | null;
  actionHref: string | null;
}

export interface CurrentArtistFocusData {
  title: string;
  source:
    | "MANUAL_OVERRIDE"
    | "ACTIVE_GOAL"
    | "BOTTLENECK"
    | "UNDERTRAINED_SKILL"
    | "PROJECT"
    | "DEFAULT";
  rationale: string;
  supportingSkill: string | null;
  supportingSkillId: string | null;
  recommendedActionLabel: string;
  recommendedActionHref: string;
}

export interface ArtistDNAData {
  id: string;
  userId: string;
  identityStatement: string;
  creativeValues: string[];
  favoriteGenres: string[];
  favoriteArtists: string[];
  favoriteProducers: string[];
  favoriteStyles: string[];
  preferredBpmRange: string;
  favoriteThemes: string[];
  creativeEnvironment: string;
  userStrengths: string[];
  userWeaknesses: string[];
  manualFocusOverride: string | null;
  notes: string | null;
  observedPatterns: {
    strengths: Array<{
      title: string;
      evidence: string;
      confidence: PatternConfidenceLevel;
    }>;
    emerging: Array<{
      title: string;
      evidence: string;
      confidence: PatternConfidenceLevel;
    }>;
    undertrained: Array<{
      title: string;
      evidence: string;
      confidence: PatternConfidenceLevel;
    }>;
    tendencies: Array<{
      title: string;
      evidence: string;
      confidence: PatternConfidenceLevel;
    }>;
    studyPatterns: Array<{
      title: string;
      evidence: string;
      confidence: PatternConfidenceLevel;
    }>;
  };
  dimensions: {
    creator: {
      topFormat: string;
      distribution: {
        writingPct: number;
        songsPct: number;
        productionPct: number;
      };
      summary: string;
    };
    student: {
      topFocus: string;
      studiedArtistsCount: number;
      totalStudies: number;
      summary: string;
    };
    practitioner: {
      topSkill: string;
      totalPracticeHours: number;
      avgEffort: number;
      summary: string;
    };
    finisher: {
      finishRatio: number;
      activePipelineCount: number;
      summary: string;
    };
    explorer: {
      genreDiversity: number;
      skillBreadth: number;
      summary: string;
    };
    reflector: {
      reviewConsistencyPct: number;
      totalReviews: number;
      summary: string;
    };
  };
  beforeVsNow: {
    periodA: {
      label: string;
      practiceHours: number;
      finishedSongs: number;
      writingCount: number;
      studyCount: number;
    };
    periodB: {
      label: string;
      practiceHours: number;
      finishedSongs: number;
      writingCount: number;
      studyCount: number;
    };
    summary: string;
  } | null;
  evolutionTimeline: Array<{
    id: string;
    date: string;
    type:
      | "MILESTONE"
      | "BREAKTHROUGH"
      | "SONG_FINISHED"
      | "PROJECT_COMPLETED"
      | "SKILL_ACHIEVEMENT"
      | "BOTTLENECK_RESOLVED";
    title: string;
    category: string;
    description: string;
    significance: string | null;
  }>;
}


