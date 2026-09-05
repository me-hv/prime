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

---

## 4. UI Design System & Aesthetic Tokens

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
* **Domain Modules (`src/components/dashboard/`)**: `DashboardHeader`, `TodayMissionCard`, `TodayActivitiesSection`, `GoalsSection`, `WeeklyOverviewChart`, `CreativeStreakCard`, `QuickCapturesFeed`.

---

## 5. Extension Points for Phase 2+

1. **Lyrical Editor Integration (`/create`)**:
   * The `QuickCapture` table is designed to directly export captures into full-length `SongDraft` documents.
2. **Audio Waveform Recording (`/reflect` & `/create`)**:
   * Real-time audio recording hooks can store blob references linked to `CreativeActivity` records.
3. **Training Automation (`/train`)**:
   * Timed drill completions can automatically dispatch `createCreativeActivity` records with `type: 'PRACTICE'` or `'WRITING'`.
4. **Artist DNA Engine (`/progress`)**:
   * Aggregates activity distributions and rhyme metric scores to construct a multidimensional artist fingerprint.
