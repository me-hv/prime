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
  content: string;
  tags: string | null;
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
