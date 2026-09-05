# PRIME — Personal Artist Operating System

> **"Create more. Learn more. Finish more. Reflect more. Waste less."**  
> *"What should I do today that actually moves me closer to becoming the artist I want to be?"*

---

## 1. Overview

**PRIME** is a personal creative development system built specifically for songwriters, rappers, music producers, and writers. It is designed from first principles to prioritize creative momentum, surgical execution, and daily deliberate practice over administrative busywork.

PRIME is **not** a generic to-do list, habit tracker, or SaaS productivity board. It is an artist command center where daily high-leverage missions, real creative activity tracking, goal milestones, and quick idea capture converge into a unified operating system.

---

## 2. Core Philosophy

* **Action Over Organization**: You don't need 47 stats; you need to write the verse, arrange the beat, and finish the song.
* **Grounded Creative Streaks**: A day counts only when you complete real creative work (writing, producing, recording, study, drills, reflection). No artificial check-in points.
* **Frictionless Capture**: Never lose a lyric, punchline, melody, or concept because capturing it was inconvenient.
* **Singular Daily Focus**: The dashboard anchors your day to ONE decisive primary mission.

---

## 3. Implemented Capabilities

### Phase 1: Foundation & Artist OS Shell
* **Command Center Dashboard**:
  * Dynamic time-aware greeting and live date indicator.
  * **Current Focus**: Overarching artist north-star with linked active goals.
  * **Today's Mission**: The #1 daily mission with completion toggle, celebratory animations, and modal editing.
  * **Today's Creative Activities**: Instant logger with preset minute counters, discipline tags (Writing, Production, Recording, Listening/Study, Reading, Practice, Reflection), and duration tallies.
  * **Active Goals & Targets**: Progress tracking (e.g., 3/6 songs, 6/10 verses) across disciplines with inline `+1` / `-1` rapid increments and category filters.
  * **Weekly Creative Cadence**: 7-day visual bar breakdown reflecting real creative time spent.
  * **Creative Consistency & 14-Day Matrix**: Authentic activity-backed streak engine.
  * **Idea Vault**: Fast capture repository for lyrics, hooks, thoughts, and song concepts with 1-click clipboard copy.
* **Global Quick Capture**: Accessible across the entire app via `+ CAPTURE` buttons, sidebar, or global keyboard shortcuts (`⌘K` / `Ctrl+K` / `C`).
* **Artist Identity & DNA**: Profile manager for artist moniker, bio, multi-discipline tagging, current focus, and long-term vision.
* **Settings & Local Data Portability**: Theme selector, studio session defaults, and 1-click full database JSON export.
* **True Persistence**: Zero-config SQLite database via Prisma ORM with seed data and server actions.
* **Fully Responsive**: First-class mobile layout tested across mobile, tablet, and desktop viewports.

### Phase 2: Creative Workspace (`/create`)
* **Creative Hub & Recent Work**:
  * Unified recent work stream showing writings, songs, and projects sorted by last edit.
  * Tabbed workspace: Overview, Writing Studio, Song Workspace, Projects, and Creative Inbox.
* **Creative Inbox & 1-Click Conversion**:
  * Inbox management with status filters (`INBOX`, `IN_PROGRESS`, `ARCHIVED`).
  * Instant modal conversion of raw captures directly into **Writing Drafts** or **Songs / Song Sections**.
* **Writing Studio (`/create/write/[id]`)**:
  * Focused, distraction-free drafting studio for verses, hooks, 16 bars, concepts, and poems.
  * Live word & character counters with real-time feedback.
  * Debounced background autosave (`Saving...` -> `Saved`) preserving typing flow.
  * Focus mode toggle hiding sidebar and surrounding chrome.
* **Modular Song Workspace (`/create/songs/[id]`)**:
  * Song structure builder with modular sections (`Intro`, `Verse`, `Hook`, `Bridge`, `Outro`, `Pre-Chorus`, `Breakdown`, `Notes`).
  * Live section reordering (move up/down), section duplication, collapse/expand toggles, and live word count aggregation.
  * Metadata controls: BPM, Musical Key, Genre, Mood, Status pipeline (`Idea` -> `Writing` -> `Demo` -> `Recording` -> `Mixing` -> `Finished` -> `Archived`), Next Action prompt, and Project assignment.
* **Project Sequencer & Tracklist Board (`/create/projects/[id]`)**:
  * Multi-track EP, Album, Mixtape, and Beat Tape release planning.
  * Drag/button tracklist sequencing with dynamic track numbering.
  * Add songs directly to projects with instant status and word count rollups.
* **Universal Creative Search**:
  * Instant typeahead workspace search across drafts, lyrics, song titles, concepts, project tracks, and raw captures with keyboard navigation and direct routing.

### Phase 3: Training System (`/train`)
* **Artist Gymnasium Command Center**:
  * **Today's Training Recommendation**: Deterministic drill recommendation based on artist practice gaps.
  * **Active Training Ribbon**: Real-time stats (Daily Training Streak, Weekly Practice Minutes, Total Sessions Logged, Skills Covered).
  * **Drill Catalog Grid**: 40+ curated drills across 8+ artistic disciplines with category tabs, difficulty levels, duration filters, and live search.
* **Web Audio Metronome & Pocket Gym (`/train/pocket-gym`)**:
  * Precision Web Audio API lookahead scheduler (`audioContext.currentTime`) with zero timing drift.
  * 40–240 BPM slider, tap tempo algorithm, volume gain, and standard hip-hop tempo presets (80–145 BPM).
  * Time signatures (3/4, 4/4, 6/4), subdivisions (1/4, 1/8, 1/16, triplets), and visual beat pulse indicator.
  * Cadence drills (*Pocket Shift*, *Cadence Switch*, *Beat Division*, *Accent Displacement*).
* **10-Minute Rapid 16-Bar Writing Sprint Studio**:
  * Distraction-free writing arena with drift-proof timestamp-delta countdown timer.
  * Live bar counter (`X / 16 bars`), word and character counters.
  * 1-Click save directly into `WritingDocument` (`type: "BARS"`) in Creative Workspace.
* **Freestyle Prompter**:
  * Timed random word prompter with configurable intervals (5s, 10s, 15s, 30s) and backing metronome click.
* **Multisyllabic Rhyme Chain Builder**:
  * Anchor phrase builder, syllable counter, rhyme variations stream, and permanent rhyme vault.
* **Vocabulary Gym & Word Vault**:
  * Word study logger, definitions, phonetics, original lyrical lines, and sensory association mapping.
* **Beat Production Arena**:
  * Speed challenges (*15-min sample flip*, *3-element beat*, *5-sound arrangement*) with interactive constraint checklists and DAW session logger.
* **Post-Drill Self-Evaluation & Streak Integration**:
  * 1-5 ratings for Focus & Intensity, Technical Difficulty, and Execution Confidence with reflection notes.
  * Automatic synchronization with `CreativeActivity` and dashboard streaks.

### Phase 4: Discovery & Reflection (`/discover` & `/reflect`)
* **The Master Artist Learning Loop**:
  * Closes the deliberate practice loop: `DISCOVER → STUDY → REFLECT → IDENTIFY WEAKNESS → PRACTICE → CREATE → FINISH → REFLECT`.
  * Visual master loop dashboard widget with live stage counters and focus indicators.
* **Artist Library & Reference Vault (`/discover`)**:
  * Curated artist directory with discipline badges, style notes, and linked works.
  * Multi-format reference library across 8 media types (`Song`, `Album`, `Artist`, `Book`, `Article`, `Interview`, `Video`, `Other`).
  * Study status tracking (`Studying`, `Active Reference`, `Discovered`, `Archived`) and favorite pin toggle.
* **Track Dissection Arena & Study Sessions (`/discover/study/[id]`)**:
  * Full-screen, distraction-free study environment with drift-proof countdown timer.
  * 14 specialized study focus areas (Rhyme Schemes, Flow & Pocket, Storytelling, Wordplay, Dynamic Range, Arrangement, Vocal Delivery, Mixing, etc.).
  * Structured anatomical prompt fields: Key Observations, Dissected Techniques, Favorite Section, Why It Works, What Surprised Me, Core Takeaway, Experiment Idea, and 1-5 Study Value Rating.
* **Study → Practice Conversion Engine**:
  * 1-Click bridge routing analyzed techniques into **Gymnasium Drills** (`/train`), **Writing Drafts** (`/create/write`), **Song Concepts** (`/create/songs`), or **Quick Captures**.
* **Album Architecture Dissection**:
  * Project-level body-of-work breakdowns: Narrative Arc & Sequencing, Sonic Cohesion, Standout Tracks & Pivots, Creative Risks, and Applied Production Lessons.
* **Purpose-Driven Listening Diary**:
  * Fast listening logger categorized by artistic intent (`Casual`, `Study`, `Inspiration`, `Production`, `Writing`, `Flow`, `Research`) with study-worthy flags.
* **Data-Grounded Daily Retrospectives (`/reflect`)**:
  * Live daily activity snapshot automatically counting drafts written, training minutes, exercises finished, studies completed, and songs updated today.
  * 3-Question high-leverage retrospective: What worked / Continue doing, What broke / What to improve, and Tomorrow's #1 Priority.
* **Weekly Creative Output Review & Diagnostic PRIME Insights**:
  * 7-Day volume audit (practice minutes, drills completed, writings created, references studied, songs finished).
  * Deterministic diagnostic insights: Most & least practiced disciplines, recurring creative bottlenecks, and suggested strategic focus.
* **Creative Bottleneck Audit & Train Weakness Bridge**:
  * Diagnosed creative roadblocks across 8 categories with 1-5 severity meters, root-cause notes, and attempted solutions.
  * Instant **Train Weakness** launcher routing directly to targeted Phase 3 gymnasium drills.
* **Breakthrough Log & Visual Milestones Timeline**:
  * Permanent log of artistic quantum leaps linked to skills and songs.
  * Chronological visual milestone timeline charting career and creative milestones.
* **Database Backup & Export 4.0.0**:
  * Extended JSON export backing up all 10 Phase 4 models alongside Phase 1–3 data.

### Phase 5: Progress & Artist DNA (`/progress` & `/progress/artist-dna`)
* **Artist Development Dashboard (`/progress`)**:
  * **Configurable Time-Range Filtering**: Full dashboard period scoping across 7 Days, 30 Days (default), 90 Days, 6 Months, 1 Year, and All Time (`ALL`).
  * **Current Artist Focus & Milestone Linkages**: Overarching focus target with active progress metrics and milestone tracker.
  * **Creative Momentum Engine**: Real-time velocity gauge (`HIGH`, `STEADY`, `REBUILDING`, `STARTING`) derived from activity frequency, streak health, and output volume.
  * **Deterministic PRIME Progress Insights**: Algorithmic progress insights with severity/urgency color coding, underlying evidence tags, and direct 1-click action buttons routing to targeted exercises, writing studio, or study modules.
  * **Multi-Discipline Output Time Series**: Day-by-day and period-by-period stacked visual bar charts of writing minutes, practice minutes, study minutes, and reflection time.
  * **Skill Development Matrix**: Comprehensive matrix of all 40+ skills with practice frequencies (`High`, `Medium`, `Low`, `None`), completed session counters, average confidence & difficulty ratings, rising/declining/steady trend indicators, undertrained alerts, and direct links to deep-dive pages.
  * **Finishing Health & Funnel Analysis**: Full-pipeline status breakdown (`Idea` -> `Concept` -> `Writing` -> `Demo` -> `Recording` -> `Mixing` -> `Mastering` -> `Finished` -> `Archived`), completion ratios, average days to finish, and **Stalled Songs Alert System** identifying inactive projects with instant action triggers.
  * **Study → Practice & Create → Finish Gap Analyses**: Direct audits highlighting references studied without practice follow-up and drafts created without finishing pipeline advancement.
  * **Strength & Weakness Signals**: Deterministic, evidence-backed signal cards showing proven artistic strengths alongside under-practiced or friction-heavy skills with direct drill launchers.
* **Skill Deep-Dive Workspace (`/progress/skills/[id]`)**:
  * Comprehensive anatomical analysis for any specific skill: historical practice volume, session log with effort/confidence ratings, curated drills catalog, associated track dissections, logged breakthroughs, related song/writing projects, linked bottlenecks, and recent reflection mentions.
* **Artist DNA Workspace (`/progress/artist-dna`)**:
  * **Artist Identity Statement**: Editable core artistic mission and sonic North Star with instant autosave.
  * **Creative Values Engine**: Ranked list of core artistic values (e.g. *Lyrical Density*, *Sonic Distinctiveness*, *Emotional Honesty*) with custom additions and priority reordering.
  * **Creative Preferences & Friction Audit**: Detailed workflow preferences across Lyricism vs Production, Writing Speed, Arrangement Style, Collaboration Preference, Optimal Working Hours, and Primary Creative Friction.
  * **PRIME Observed Patterns with Honest Confidence**: Objective behavioral pattern recognition contrasting user self-image with real database evidence, rated by confidence level (*Insufficient Data*, *Emerging Pattern*, *Recurring Pattern*, *Strong Pattern*).
  * **6 Descriptive Artist Dimensions**: Unscored descriptive spectrums across *Creator*, *Student*, *Practitioner*, *Finisher*, *Explorer*, and *Reflector*.
  * **Before vs Now 90-Day Comparison**: Direct side-by-side comparison of creative practice volume, writing output, finishing rate, and study habits between the previous 90 days and today.
  * **Unified Artist Evolution Timeline**: Chronological narrative feed of career milestones, breakthroughs, finished songs, and major project completions.
* **Dashboard Integration & Search**:
  * Subtle **Artist Growth** overview widget on `/` showing weekly practice volume, skill coverage, and quick access to Artist DNA.
  * Universal workspace search extended to index all Skills and Artist DNA profile.
* **Database Backup & Export 5.0.0**:
  * Export schema updated to version `5.0.0` with full backup and restore compatibility for `ArtistDNAProfile`.

---

## 4. Tech Stack

* **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
* **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom Studio Obsidian palette, `tailwindcss-animate`)
* **Icons & Animation**: [Lucide React](https://lucide.dev/), [canvas-confetti](https://github.com/catdad/canvas-confetti)
* **Database & ORM**: [Prisma ORM](https://www.prisma.io/) with [SQLite](https://www.sqlite.org/)
* **Date Utilities**: [date-fns](https://date-fns.org/)

---

## 5. Getting Started

### Prerequisites
* Node.js v18.18+ (Node v20+ or v24 recommended)
* npm, pnpm, or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/me-hv/prime.git
   cd prime
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   ```

4. **Initialize database and seed artist data**:
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Project Structure

```
prime/
├── docs/
│   ├── ARCHITECTURE.md     # In-depth architectural blueprint
│   └── ROADMAP.md          # 8-Phase long-term roadmap
├── prisma/
│   ├── schema.prisma       # Prisma relational data model (18 models)
│   └── seed.ts             # Default artist starter seed data
├── src/
│   ├── actions/            # Next.js Server Actions (CRUD & analytics)
│   │   ├── activities.ts   # Creative activity queries & mutations
│   │   ├── captures.ts     # Quick captures logic
│   │   ├── create.ts       # Writing drafts, songs, and project actions
│   │   ├── discover.ts     # Artist library, references, and study sessions
│   │   ├── dna.ts          # Artist DNA profile operations
│   │   ├── goals.ts        # Goals & milestone progress
│   │   ├── missions.ts     # Daily single-mission operations
│   │   ├── profile.ts      # Artist profile management
│   │   ├── progress.ts     # Progress analytics, skill matrix & insights
│   │   ├── reflect.ts      # Reflections, bottlenecks & milestones
│   │   ├── search.ts       # Universal workspace search engine
│   │   ├── stats.ts        # Streak calculations & cadence metrics
│   │   └── train.ts        # Drill catalog & training session logs
│   ├── app/                # Next.js App Router routes
│   │   ├── api/export/     # Full JSON data backup endpoint (v5.0.0)
│   │   ├── create/         # Creative studio workspace & song lab
│   │   ├── discover/       # Reference vault & track dissection studio
│   │   ├── profile/        # Artist identity management
│   │   ├── progress/       # Progress dashboard & skill matrix
│   │   │   ├── artist-dna/ # Artist DNA workspace & evolution timeline
│   │   │   └── skills/[id] # Skill deep-dive analytics
│   │   ├── reflect/        # Retrospectives, bottlenecks & breakthroughs
│   │   ├── settings/       # Themes, defaults, data export
│   │   ├── train/          # Flow, writing, & beat gymnasium
│   │   ├── globals.css     # Bespoke dark studio theme styling
│   │   ├── layout.tsx      # Root layout with sidebar & providers
│   │   └── page.tsx        # Command center dashboard
│   ├── components/
│   │   ├── create/         # Writing studio, song editor, project board
│   │   ├── dashboard/      # Mission, activity, goal, streak & growth cards
│   │   ├── discover/       # Reference vault, study modal & listening diary
│   │   ├── navigation/     # Sidebar, MobileNav, Global Quick Capture
│   │   ├── progress/       # Skill matrix, time series, finishing funnel
│   │   │   ├── dna/        # Artist identity, values, patterns, dimensions
│   │   │   └── skills/     # Skill detail cards & drill linkages
│   │   ├── reflect/        # Daily retrospective, bottlenecks & timeline
│   │   ├── shared/         # Reusable empty states & search modals
│   │   ├── train/          # Metronome pocket gym, sprint timers, prompts
│   │   └── ui/             # Button, Card, Modal, Input, Badge, Toast
│   └── lib/
│       ├── db.ts           # Prisma client singleton
│       ├── types.ts        # Strongly-typed data models & configs
│       └── utils.ts        # Date, time, and style utility helpers
└── tailwind.config.ts      # Bespoke palette and shadows
```

---

## 7. Roadmap Preview

* **Phase 1** — Foundation & Artist OS Shell *(Completed)*
* **Phase 2** — Creative Workspace *(Completed)*
* **Phase 3** — Training System *(Completed)*
* **Phase 4** — Discovery & Reflection *(Completed)*
* **Phase 5** — Progress & Artist DNA *(Completed)*
* **Phase 6** — AI Sparring & Creative Partner
* **Phase 7** — Deep Focus Shield & Session Flow
* **Phase 8** — Deep Audio & Hardware Integrations

---

## 8. License

Private / Personal Project — All rights reserved.

