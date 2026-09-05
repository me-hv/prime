"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  WritingDocumentData,
  SongData,
  CreativeProjectData,
  QuickCaptureData,
} from "@/lib/types";
import { CreateHubHeader } from "@/components/create/CreateHubHeader";
import { WritingListView } from "@/components/create/WritingListView";
import { SongListView } from "@/components/create/SongListView";
import { ProjectsListView } from "@/components/create/ProjectsListView";
import { CreativeInboxView } from "@/components/create/CreativeInboxView";
import { WritingCard } from "@/components/create/WritingCard";
import { SongCard } from "@/components/create/SongCard";
import { ProjectCard } from "@/components/create/ProjectCard";
import { useNavigation } from "@/components/navigation/NavigationProvider";
import {
  PenTool,
  Music,
  FolderGit2,
  Inbox,
  Plus,
  ArrowRight,
  Clock,
} from "lucide-react";

interface CreateHubClientProps {
  initialWritings: WritingDocumentData[];
  initialSongs: SongData[];
  initialProjects: CreativeProjectData[];
  initialCaptures: QuickCaptureData[];
}

export function CreateHubClient({
  initialWritings,
  initialSongs,
  initialProjects,
  initialCaptures,
}: CreateHubClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openQuickCapture } = useNavigation();

  const tabParam = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(tabParam);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["overview", "writings", "songs", "projects", "inbox"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/create${tab === "overview" ? "" : `?tab=${tab}`}`);
  };

  // Build unified Recent Work stream (sorted by updatedAt)
  type RecentItem =
    | { kind: "WRITING"; data: WritingDocumentData; updatedAt: string }
    | { kind: "SONG"; data: SongData; updatedAt: string }
    | { kind: "PROJECT"; data: CreativeProjectData; updatedAt: string };

  const recentItems: RecentItem[] = [
    ...initialWritings.map(
      (w) => ({ kind: "WRITING" as const, data: w, updatedAt: w.updatedAt })
    ),
    ...initialSongs.map(
      (s) => ({ kind: "SONG" as const, data: s, updatedAt: s.updatedAt })
    ),
    ...initialProjects.map(
      (p) => ({ kind: "PROJECT" as const, data: p, updatedAt: p.updatedAt })
    ),
  ].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const activeSongs = initialSongs.filter(
    (s) => s.status !== "FINISHED" && s.status !== "ARCHIVED"
  );
  const inboxUnassigned = initialCaptures.filter((c) => c.status === "INBOX");

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Universal Workspace Header */}
      <CreateHubHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        inboxCount={inboxUnassigned.length}
        writingsCount={initialWritings.length}
        songsCount={initialSongs.length}
        projectsCount={initialProjects.length}
      />

      {/* Tab 1: Overview & Hub */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-fade-in">
          {/* 1. Start Creating Action Tiles */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-prime-textMuted font-bold block mb-3">
              Start Creating
            </span>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Link
                href="/create/write"
                className="group rounded-xl border border-sky-500/20 bg-gradient-to-br from-sky-950/15 via-prime-surface to-prime-card p-4 transition-all hover:border-sky-500/40 hover:shadow-prime-md"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400 mb-3 group-hover:scale-105 transition-transform">
                  <PenTool className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-prime-text group-hover:text-sky-300">
                  New Writing
                </h3>
                <p className="text-[11px] text-prime-textMuted mt-0.5">
                  Verses, 16 bars, free writes & poems
                </p>
              </Link>

              <Link
                href="/create/songs"
                className="group rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-950/15 via-prime-surface to-prime-card p-4 transition-all hover:border-purple-500/40 hover:shadow-prime-md"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/15 text-purple-400 mb-3 group-hover:scale-105 transition-transform">
                  <Music className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-prime-text group-hover:text-purple-300">
                  New Song
                </h3>
                <p className="text-[11px] text-prime-textMuted mt-0.5">
                  Structured multi-section song studio
                </p>
              </Link>

              <Link
                href="/create/projects"
                className="group rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-950/15 via-prime-surface to-prime-card p-4 transition-all hover:border-amber-500/40 hover:shadow-prime-md"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400 mb-3 group-hover:scale-105 transition-transform">
                  <FolderGit2 className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-prime-text group-hover:text-amber-300">
                  New Project
                </h3>
                <p className="text-[11px] text-prime-textMuted mt-0.5">
                  EPs, Albums & track sequencing
                </p>
              </Link>

              <button
                onClick={openQuickCapture}
                className="group text-left rounded-xl border border-prime-gold/30 bg-gradient-to-br from-prime-goldGlow via-prime-surface to-prime-card p-4 transition-all hover:border-prime-gold hover:shadow-prime-glow-gold"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-prime-gold/20 text-prime-gold mb-3 group-hover:scale-105 transition-transform">
                  <Plus className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-prime-text group-hover:text-prime-gold">
                  Quick Capture
                </h3>
                <p className="text-[11px] text-prime-textMuted mt-0.5">
                  Frictionless idea & lyric capture
                </p>
              </button>
            </div>
          </div>

          {/* 2. Recent Work Stream */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-prime-gold" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-prime-text font-mono">
                  Recent Work & Active Sessions
                </h2>
              </div>
              <button
                onClick={() => handleTabChange("writings")}
                className="text-xs font-mono text-prime-gold hover:underline flex items-center gap-1"
              >
                <span>View all drafts</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {recentItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {recentItems.slice(0, 6).map((item) => {
                  if (item.kind === "WRITING") {
                    return (
                      <WritingCard key={`w-${item.data.id}`} document={item.data} />
                    );
                  }
                  if (item.kind === "SONG") {
                    return <SongCard key={`s-${item.data.id}`} song={item.data} />;
                  }
                  return (
                    <ProjectCard key={`p-${item.data.id}`} project={item.data} />
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-prime-borderSubtle bg-prime-surface/40 p-6 text-center">
                <p className="text-xs text-prime-textMuted">
                  No creative work saved yet.
                </p>
              </div>
            )}
          </div>

          {/* 3. Active Songs & Creative Inbox Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Active Songs Pipeline */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Music className="h-4 w-4 text-purple-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-prime-text font-mono">
                    Active Songs in Pipeline ({activeSongs.length})
                  </h3>
                </div>
                <button
                  onClick={() => handleTabChange("songs")}
                  className="text-xs font-mono text-prime-gold hover:underline flex items-center gap-1"
                >
                  <span>Catalog</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              {activeSongs.length > 0 ? (
                <div className="space-y-3">
                  {activeSongs.slice(0, 3).map((song) => (
                    <SongCard key={song.id} song={song} />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-prime-borderSubtle bg-prime-surface/40 p-6 text-center">
                  <p className="text-xs text-prime-textMuted">
                    No active songs currently in writing or demo stage.
                  </p>
                </div>
              )}
            </div>

            {/* Right: Creative Inbox Preview */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Inbox className="h-4 w-4 text-sky-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-prime-text font-mono">
                    Creative Inbox ({inboxUnassigned.length})
                  </h3>
                </div>
                <button
                  onClick={() => handleTabChange("inbox")}
                  className="text-xs font-mono text-prime-gold hover:underline flex items-center gap-1"
                >
                  <span>Open inbox</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              {inboxUnassigned.length > 0 ? (
                <div className="space-y-2">
                  {inboxUnassigned.slice(0, 4).map((capture) => (
                    <div
                      key={capture.id}
                      className="rounded-xl border border-prime-borderSubtle bg-prime-card/85 p-3.5 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-prime-surface border border-prime-border px-1.5 py-0.2 text-[9px] font-mono text-prime-gold font-medium">
                          {capture.type}
                        </span>
                        <button
                          onClick={() => handleTabChange("inbox")}
                          className="text-[11px] font-mono text-prime-gold hover:underline flex items-center gap-0.5"
                        >
                          <span>Develop</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-xs text-prime-text line-clamp-2 leading-relaxed font-sans">
                        {capture.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-prime-borderSubtle bg-prime-surface/40 p-6 text-center">
                  <p className="text-xs text-prime-textMuted">
                    Inbox is clear! No unassigned thoughts.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Writing Studio */}
      {activeTab === "writings" && (
        <WritingListView documents={initialWritings} />
      )}

      {/* Tab 3: Songs */}
      {activeTab === "songs" && <SongListView songs={initialSongs} />}

      {/* Tab 4: Projects */}
      {activeTab === "projects" && (
        <ProjectsListView projects={initialProjects} />
      )}

      {/* Tab 5: Creative Inbox */}
      {activeTab === "inbox" && (
        <CreativeInboxView captures={initialCaptures} />
      )}
    </div>
  );
}
