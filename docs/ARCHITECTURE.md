# PRIME System Architecture & Design Specification

This document details the architectural principles, data schema, component design system, state synchronization patterns, and extension points for **PRIME (Personal Artist Operating System)**.

---

## 1. Architectural Principles

1. **Low Friction, High Velocity**: Every interaction (capturing a bar, setting today's mission, logging a beat session) requires minimal clicks and instant visual feedback.
2. **Action Over Dashboard Clutter**: The system avoids unnecessary widgets or fake gamification metrics. Data represents real creative volume.
3. **Local-First, Cloud-Ready Persistence**: Data is persisted in a relational database (`SQLite` via `Prisma ORM` in Phase 1). The schema is completely portable to `PostgreSQL` in multi-device/cloud deployment phases.
4. **Server Actions & Optimistic UX**: Mutations utilize Next.js Server Actions with immediate path revalidation (`revalidatePath`) and toast notifications.
5. **Universal Accessibility & Responsiveness**: Mobile is treated as a primary recording/capturing surface with dedicated touch targets, bottom navigation, and quick capture modals.

---

## 2. System Layer Topology

```
┌────────────────────────────────────────────────────────┐
│                   PRIME USER INTERFACE                 │
│  [Sidebar]  [MobileNav]  [QuickCapture]  [ToastSystem] │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│                 APPLICATION ROUTE SHELLS               │
│  / (Dashboard) | /create | /train | /discover | etc.   │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│                 SERVER ACTIONS LAYER                   │
│   missions.ts | activities.ts | goals.ts | stats.ts    │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│                 DATA PERSISTENCE LAYER                 │
│             Prisma ORM Client Singleton                │
│                 SQLite DB (dev.db)                     │
└────────────────────────────────────────────────────────┘
```

---

## 3. Relational Data Models

### Entity Relationship Overview
 
* **`User`** (1) ─── (1) **`Profile`**: Core artist identity, moniker, vision, and disciplines.
* **`User`** (1) ─── (N) **`DailyMission`**: Unique constraint on `[userId, date]`, enforcing ONE primary mission per day.
* **`User`** (1) ─── (N) **`CreativeActivity`**: Real creative activity logs with discipline, duration, and date.
* **`User`** (1) ─── (N) **`Goal`**: Multi-discipline targets with unit, category, and milestone progress.
* **`User`** (1) ─── (N) **`QuickCapture`**: Categorized inspiration vault (lyrics, hooks, thoughts, concepts) with status and conversion linkages.
* **`User`** (1) ─── (N) **`WritingDocument`**: Dedicated standalone lyric and verse drafting studio documents (`VERSE`, `HOOK`, `BARS_16`, `FREE_WRITE`, `CONCEPT`, `POEM`).
* **`User`** (1) ─── (N) **`Song`**: Full-structured multi-section songwriting workspace (`Idea` -> `Writing` -> `Demo` -> `Recording` -> `Mixing` -> `Finished`).
* **`Song`** (1) ─── (N) **`SongSection`**: Ordered modular building blocks (`HOOK`, `VERSE`, `BRIDGE`, `INTRO`, `OUTRO`, `PRE_CHORUS`, `BREAKDOWN`, `NOTES`).
* **`User`** (1) ─── (N) **`CreativeProject`**: Collection releases (`EP`, `ALBUM`, `BEAT_TAPE`, `MIXTAPE`, `CONCEPT_SUITE`).
* **`CreativeProject`** (N) ─── (N) **`Song`** via **`ProjectSong`**: Explicit tracklist sequencing board with `trackNumber`.
* **`Skill`** (N) ─── (N) **`Exercise`** via **`ExerciseSkill`**: Core artistic competencies and training drills across 8+ disciplines.
* **`User`** (1) ─── (N) **`TrainingSession`**: Practice session logs with durations, 1-5 ratings (Effort, Difficulty, Confidence), and reflection notes.
* **`TrainingSession`** (N) ─── (1) **`WritingDocument`**: Direct link between rapid writing sprints and the Creative Workspace.
* **`User`** (1) ─── (N) **`RhymeChain`** (1) ─── (N) **`RhymeEntry`**: Multi-syllabic rhyme scheme vault and syllabic matching.
* **`User`** (1) ─── (N) **`VocabularyEntry`**: Lyrical dictionary with pronunciations, custom lines, and sensory associations.

---

## 4. Training Engine Architecture (Phase 3)

### Precision Web Audio Metronome & Lookahead Scheduler
Standard JavaScript `setInterval` and `setTimeout` suffer from main-thread UI contention and aggressive background-tab throttling. To ensure true studio-grade rhythmic timing, PRIME implements a 2-tier Web Audio scheduler:
1. A 25ms timer periodically inspects the `AudioContext.currentTime` timeline.
2. Synthesized oscillator clicks (high accent on beat 1, lower tone on other beats) are pre-scheduled 100ms in advance directly onto the hardware audio thread.
3. Beat flash callbacks fire in sync with scheduled audio pulses, guaranteeing sample-accurate pocket locking with zero timing drift.

### Drift-Proof Timestamp-Delta Timer
Training countdown and elapsed timers calculate remaining time from high-resolution timestamp deltas (`Date.now()` / `performance.now()`) rather than frame-by-frame ticks. If the artist minimizes the browser or locks their screen during a sprint, the timer calculates the exact elapsed interval upon return.

### Creative Activity & Streak Synchronization
When an artist finishes a drill and logs their self-evaluation, `completeTrainingSession` automatically dispatches a `CreativeActivity` record (`type: "PRACTICE"` or `"WRITING"`). This updates the Dashboard's daily streak, weekly practice minutes, and activity matrix without requiring manual duplication.

---

## 5. UI Design System & Aesthetic Tokens

PRIME employs a bespoke **Studio Obsidian** dark theme:

| Token | Hex Value | Semantic Usage |
|---|---|---|
| `prime.bg` | `#090A0F` | Deepest canvas background |
| `prime.surface` | `#10121A` | Secondary surface / navigation / modal backdrops |
| `prime.card` | `#151822` | Card elements, containers, and modules |
| `prime.border` | `#232838` | Structural dividing borders |
| `prime.gold` | `#E5A93C` | Primary brand accent & studio energy glow |
| `prime.text` | `#F8FAFC` | Primary high-contrast typography |
| `prime.textSecondary`| `#94A3B8` | Body descriptions and metadata |
| `prime.textMuted` | `#64748B` | Subtle captions and time labels |

### Component Hierarchy
* **Primitives (`src/components/ui/`)**: `Button`, `Card`, `Modal`, `Input`, `Textarea`, `Select`, `Badge`, `ProgressBar`, `Toast`.
* **Navigation (`src/components/navigation/`)**: `Sidebar`, `MobileNav`, `GlobalQuickCaptureModal`, `NavigationProvider`.
* **Dashboard Modules (`src/components/dashboard/`)**: `DashboardHeader`, `TodayMissionCard`, `TodayActivitiesSection`, `GoalsSection`, `WeeklyOverviewChart`, `CreativeStreakCard`, `QuickCapturesFeed`.
* **Creative Modules (`src/components/create/`)**: `WritingEditor`, `SongScaffolder`, `ProjectTracklistBoard`, `CaptureConverterModal`.
* **Training Modules (`src/components/train/`)**: `PocketGym`, `MetronomeEngine`, `TrainingTimer`, `RapidSprintStudio`, `FreestylePrompter`, `RhymeBuilderView`, `VocabularyGymView`, `ProductionChallengeView`, `SessionCompletionModal`, `ExerciseCard`, `ExerciseListView`, `TodayTrainingCard`, `TrainingHubHeader`, `TrainingHistoryView`.

---

## 6. Extension Points for Phase 4+

1. **Music Discovery & Study (`/discover`)**:
   * Song structure analysis and rhyme scheme annotation linked to Rhyme Chains and Vocabulary entries.
2. **Audio Waveform Recording (`/reflect` & `/create`)**:
   * Direct vocal take recording with local playback and waveform analysis.
3. **Artist DNA Engine (`/progress`)**:
   * Aggregates activity distributions, exercise ratings, and writing sprint frequencies to map the artist's developmental growth curve.
