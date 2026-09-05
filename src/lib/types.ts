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
  type: "WRITING" | "SONG" | "PROJECT" | "CAPTURE";
  categoryBadge: string;
  href: string;
  updatedAt: string;
  snippet?: string;
}
