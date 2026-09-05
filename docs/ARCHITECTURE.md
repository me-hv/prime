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
* **`User`** (1) ─── (N) **`Artist`** (1) ─── (N) **`ArtistReference`**: Curated artist library & multi-format reference vault (`SONG`, `ALBUM`, `ARTIST`, `BOOK`, `ARTICLE`, `INTERVIEW`, `VIDEO`, `OTHER`).
* **`ArtistReference`** (1) ─── (N) **`StudySession`**: In-depth track dissections across 14 focus areas with drift-proof timers and structured anatomical prompts.
* **`StudySession`** (1) ─── (1) **`WritingDocument`** / **`TrainingSession`**: 1-click bridge transforming masterwork observations into deliberate practice drills and song drafts.
* **`User`** (1) ─── (N) **`AlbumStudy`**: Project-level album architecture breakdowns (sequencing, cohesion, standout moments, and production lessons).
* **`User`** (1) ─── (N) **`ListeningEntry`**: Purpose-driven listening logs tagged by intent (`CASUAL`, `STUDY`, `INSPIRATION`, `PRODUCTION`, `WRITING`, `FLOW`, `RESEARCH`).
* **`User`** (1) ─── (N) **`DailyReflection`**: Grounded daily retrospectives with automated activity snapshots (`continueItem`, `improveItem`, `tomorrowPriority`).
* **`User`** (1) ─── (N) **`WeeklyReview`**: 7-day creative volume audits with deterministic diagnostic insights and suggested focus areas.
* **`User`** (1) ─── (N) **`Bottleneck`**: Diagnosed creative obstacles with 1-5 severity ratings, attempted solutions, and 1-click **Train Weakness** launcher to gymnasium drills.
* **`User`** (1) ─── (N) **`Breakthrough`**: Breakthrough log linking insights directly to skills and finished songs.
* **`User`** (1) ─── (N) **`Milestone`**: Visual artistic milestone timeline across career, craft, releases, and milestones.
* **`User`** (1) ─── (1) **`ArtistDNAProfile`**: Core artist identity statement, ranked creative values, workflow preferences, observed patterns, and 6 descriptive dimensions.

---

## 4. Discovery & Reflection Architecture (Phase 4)

### The Complete Artist Development Learning Loop
PRIME closes the full human artist development loop:
```
DISCOVER → STUDY → REFLECT → IDENTIFY WEAKNESS → PRACTICE → CREATE → FINISH → REFLECT
```

1. **Reference Vault & Track Dissection**: References are cataloged with status (`STUDYING`, `ACTIVE_REFERENCE`, `DISCOVERED`, `ARCHIVED`) and dissected in a dedicated full-screen study arena.
2. **Study-to-Practice Conversion Engine**: Observations and analyzed techniques can be instantly converted into a Training Drill (`/train`), a Writing Document (`/create/write`), a Song Concept (`/create/songs`), or a Quick Capture.
3. **Data-Grounded Daily Reflections**: Daily logs display an automated live activity summary (drafts written, training minutes, exercises finished, studies conducted, and songs touched today) before capturing what to continue, what to improve, and tomorrow's #1 priority.
4. **Deterministic Diagnostic Weekly Insights**: Weekly reviews synthesize actual 7-day practice volume, identify most and least practiced disciplines, surface recurring high-severity bottlenecks, and recommend concrete focus areas without black-box AI hallucinations.
5. **Bottleneck Audit & Train Weakness Bridge**: Active creative bottlenecks feature an immediate **Train Weakness** button that routes the artist directly into targeted Phase 3 gymnasium drills.
6. **Automatic Activity Synchronization**: Logging a study session or listening entry automatically records a `LISTENING` creative activity, while saving a daily reflection or weekly review records a `REFLECTION` activity, maintaining creative streaks seamlessly.

---

## 5. Progress & Artist DNA Architecture (Phase 5)

### Analytical Principles
1. **Deterministic Metrics**: Every statistic (practice minutes, skill confidence, finishing rates, creative momentum) is calculated deterministically from source records (`TrainingSession`, `WritingDocument`, `Song`, `StudySession`, `DailyReflection`, `Bottleneck`, `Breakthrough`, `Milestone`). No fabricated AI scores.
2. **Time-Range Period Scoping**: Instant aggregation across 7D, 30D (default), 90D, 6M, 1Y, and ALL time.
3. **Honest Pattern Confidence**: PRIME's observed behavioral patterns explicitly state confidence levels (*Insufficient Data*, *Emerging Pattern*, *Recurring Pattern*, *Strong Pattern*) grounded in sample sizes and verification history.
4. **Descriptive Not Prescriptive Dimensions**: Six artist dimensions (*Creator*, *Student*, *Practitioner*, *Finisher*, *Explorer*, *Reflector*) provide a nuanced profile of current artistic habits without gamified tier gating.
5. **Actionable Gap Analysis**: Surfaces study-to-practice and create-to-finish drop-offs with 1-click execution bridges.

---

## 6. UI Design System & Aesthetic Tokens

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
* **Dashboard Modules (`src/components/dashboard/`)**: `DashboardHeader`, `TodayMissionCard`, `TodayActivitiesSection`, `GoalsSection`, `WeeklyOverviewChart`, `CreativeStreakCard`, `QuickCapturesFeed`, `CreativeLoopWidget`, `ArtistGrowthWidget`.
* **Creative Modules (`src/components/create/`)**: `WritingEditor`, `SongScaffolder`, `ProjectTracklistBoard`, `CaptureConverterModal`.
* **Training Modules (`src/components/train/`)**: `PocketGym`, `MetronomeEngine`, `TrainingTimer`, `RapidSprintStudio`, `FreestylePrompter`, `RhymeBuilderView`, `VocabularyGymView`, `ProductionChallengeView`, `SessionCompletionModal`, `ExerciseCard`, `ExerciseListView`, `TodayTrainingCard`, `TrainingHubHeader`, `TrainingHistoryView`.
* **Discovery Modules (`src/components/discover/`)**: `DiscoverHubHeader`, `TodayStudyHero`, `ReferenceCard`, `ReferenceListView`, `ReferenceModal`, `ArtistCard`, `ArtistListView`, `ArtistModal`, `StudyVaultView`, `StudySessionRunner`, `StudyPracticeModal`, `AlbumStudyView`, `AlbumStudyModal`, `ListeningDiaryView`, `ListeningEntryModal`.
* **Reflection Modules (`src/components/reflect/`)**: `ReflectHubHeader`, `DailyReflectionView`, `WeeklyReviewView`, `BottleneckAuditView`, `BottleneckModal`, `BreakthroughLogView`, `BreakthroughModal`, `MilestonesTimelineView`, `MilestoneModal`.
* **Progress Modules (`src/components/progress/`)**: `ProgressHeader`, `ArtistGrowthOverview`, `CurrentFocusCard`, `ProgressInsightsSection`, `CreativeOutputSection`, `SkillMatrixTable`, `FinishingHealthView`, `StudyPracticeGapView`, `CreateFinishGapView`, `StrengthWeaknessSignals`, `CreativeConsistencyView`.
  * **Skill Detail (`src/components/progress/skills/`)**: `SkillDetailView`.
  * **Artist DNA (`src/components/progress/dna/`)**: `ArtistIdentityStatementEditor`, `CreativeValuesEditor`, `CreativePreferencesEditor`, `ObservedPatternsView`, `ArtistDimensionsView`, `BeforeVsNowCard`, `ArtistEvolutionTimeline`.

---

## 7. Extension Points for Phase 6+

1. **AI Creative Sparring Partner & Intelligent Drill Suggester**:
   * Context-aware prompt suggestions based on unresolved bottlenecks, rhyme scheme complexity analysis, and cadence critique.
2. **Audio Waveform Recording & Vocal Take Management**:
   * In-browser audio take recording, waveform visualization, and multi-track demo management.
3. **Deep Integrations & External Sync**:
   * Cloud sync, local audio file import, and MIDI controller integration.
