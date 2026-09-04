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

## 3. Phase 1 Capabilities (Implemented)

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
* **Interactive Section Shells**: Polished empty states and architecture previews for:
  * `/create` — Writing Studio, Beat Hub, Song Catalog, Creative Projects.
  * `/train` — Rap flow pocket drills, writing sprints, beat speed-drills, and rhyme mapping.
  * `/discover` — Song anatomy breakdown, classic album study, artist lineage, literature.
  * `/reflect` — Artist retrospective journal, voice notes, weekly reviews, future-self letters.
  * `/progress` — Time allocation by discipline, total logged volume, and Artist DNA preview.
* **Settings & Local Data Portability**: Theme selector, studio session defaults, and 1-click full database JSON export.
* **True Persistence**: Zero-config SQLite database via Prisma ORM with seed data and server actions.
* **Fully Responsive**: First-class mobile layout tested across 320px, 375px, 390px, 430px, tablet, and desktop viewports.

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
│   ├── schema.prisma       # Prisma relational data model
│   └── seed.ts             # Default artist starter seed data
├── src/
│   ├── actions/            # Next.js Server Actions (CRUD & stats)
│   │   ├── activities.ts   # Creative activity queries & mutations
│   │   ├── captures.ts     # Quick captures logic
│   │   ├── goals.ts        # Goals & milestone progress
│   │   ├── missions.ts     # Daily single-mission operations
│   │   ├── profile.ts      # Artist DNA & profile management
│   │   └── stats.ts        # Streak calculations & cadence metrics
│   ├── app/                # Next.js App Router routes
│   │   ├── api/export/     # Full JSON data backup endpoint
│   │   ├── create/         # Creative studio workspace shell
│   │   ├── discover/       # Song study & album analysis shell
│   │   ├── progress/       # Output metrics & discipline charts
│   │   ├── profile/        # Artist identity management
│   │   ├── reflect/        # Journal & weekly audit shell
│   │   ├── settings/       # Themes, defaults, data export
│   │   ├── train/          # Flow & lyric gym shell
│   │   ├── globals.css     # Bespoke dark studio theme styling
│   │   ├── layout.tsx      # Root layout with sidebar & providers
│   │   └── page.tsx        # Command center dashboard
│   ├── components/
│   │   ├── dashboard/      # Mission, activity, goal, and streak cards
│   │   ├── navigation/     # Sidebar, MobileNav, Global Quick Capture
│   │   ├── shared/         # Reusable empty states
│   │   └── ui/             # Button, Card, Modal, Input, Badge, Toast
│   └── lib/
│       ├── db.ts           # Prisma client singleton
│       ├── types.ts        # Strongly-typed data models & configs
│       └── utils.ts        # Date and style utility helpers
└── tailwind.config.ts      # Bespoke palette and shadows
```

---

## 7. Roadmap Preview

* **Phase 1** — Foundation & Artist OS Shell *(Current)*
* **Phase 2** — Creative Workspace (Songwriting lab, Rhyme mapping, Beat hub)
* **Phase 3** — Training System (Freestyle drills, Metronome pocket gym, Syllable sprint)
* **Phase 4** — Music Discovery & Study (Song anatomy, Album breakdown)
* **Phase 5** — Reflection & Journaling (Voice journal, Weekly audit, Future letters)
* **Phase 6** — Progress & Artist DNA (Flow fingerprint, Cadence analytics)
* **Phase 7** — AI Coach & Deep Focus Shield (Anti-distraction, Creative sparring)
* **Phase 8** — Deep Integrations & Advanced Audio Architecture

---

## 8. License

Private / Personal Project — All rights reserved.
