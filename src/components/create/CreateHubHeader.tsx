"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  Plus,
  Search,
  PenTool,
  Music,
  FolderGit2,
  Inbox,
  X,
  Layers,
  ArrowRight,
} from "lucide-react";
import { useNavigation } from "@/components/navigation/NavigationProvider";
import { searchCreativeWorkspace } from "@/actions/search";
import { SearchItemResult } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CreateHubHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  inboxCount?: number;
  writingsCount?: number;
  songsCount?: number;
  projectsCount?: number;
}

export function CreateHubHeader({
  activeTab,
  onTabChange,
  inboxCount = 0,
  writingsCount = 0,
  songsCount = 0,
  projectsCount = 0,
}: CreateHubHeaderProps) {
  const router = useRouter();
  const { openQuickCapture } = useNavigation();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchItemResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const results = await searchCreativeWorkspace(searchQuery);
        setSearchResults(results);
        setIsSearchOpen(true);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener for search results
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const TABS = [
    { id: "overview", label: "Overview & Hub", icon: Layers, count: null },
    { id: "writings", label: "Writing Studio", icon: PenTool, count: writingsCount },
    { id: "songs", label: "Songs", icon: Music, count: songsCount },
    { id: "projects", label: "Projects", icon: FolderGit2, count: projectsCount },
    { id: "inbox", label: "Creative Inbox", icon: Inbox, count: inboxCount },
  ];

  return (
    <div className="space-y-4 pb-4 border-b border-prime-borderSubtle">
      {/* Top Banner & Quick Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-purple-400">
              Creative Operating Studio
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-prime-text">
            CREATIVE WORKSPACE
          </h1>
          <p className="text-xs sm:text-sm text-prime-textMuted mt-0.5">
            Turn ideas into verses, songs, and bodies of work.
          </p>
        </div>

        {/* Action Button Strip */}
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/create/write">
            <Button
              variant="secondary"
              size="sm"
              className="h-9 text-xs font-semibold"
            >
              <PenTool className="h-3.5 w-3.5 mr-1.5 text-sky-400" />
              <span>+ Writing</span>
            </Button>
          </Link>

          <Link href="/create/songs">
            <Button
              variant="secondary"
              size="sm"
              className="h-9 text-xs font-semibold"
            >
              <Music className="h-3.5 w-3.5 mr-1.5 text-purple-400" />
              <span>+ Song</span>
            </Button>
          </Link>

          <Link href="/create/projects">
            <Button
              variant="secondary"
              size="sm"
              className="h-9 text-xs font-semibold"
            >
              <FolderGit2 className="h-3.5 w-3.5 mr-1.5 text-amber-400" />
              <span>+ Project</span>
            </Button>
          </Link>

          <Button
            variant="gold"
            size="sm"
            onClick={openQuickCapture}
            className="h-9 text-xs font-semibold shadow-prime-glow-gold"
          >
            <Plus className="h-4 w-4 mr-1" />
            <span>Capture</span>
          </Button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative" ref={searchContainerRef}>
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-prime-textMuted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchResults.length > 0) setIsSearchOpen(true);
            }}
            placeholder="Search lyrics, song titles, concepts, notes, or tags..."
            className="w-full h-10 rounded-xl border border-prime-border bg-prime-surface pl-10 pr-10 text-xs sm:text-sm text-prime-text placeholder:text-prime-textMuted/60 transition-colors focus-visible:outline-none focus-visible:border-prime-gold focus-visible:ring-1 focus-visible:ring-prime-gold/30"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSearchResults([]);
                setIsSearchOpen(false);
              }}
              className="absolute right-3 p-1 text-prime-textMuted hover:text-prime-text"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Results Flyout */}
        {isSearchOpen && (
          <div className="absolute top-11 left-0 right-0 z-50 rounded-xl border border-prime-border bg-prime-surface p-2 shadow-prime-md max-h-96 overflow-y-auto space-y-1 animate-slide-up">
            {isSearching ? (
              <div className="p-4 text-center text-xs text-prime-textMuted font-mono">
                Searching creative catalog...
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map((item) => (
                <button
                  key={`${item.type}-${item.id}`}
                  onClick={() => {
                    setIsSearchOpen(false);
                    router.push(item.href);
                  }}
                  className="w-full flex items-start justify-between gap-3 rounded-lg p-2.5 text-left transition-colors hover:bg-prime-card group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="rounded bg-prime-border px-1.5 py-0.2 text-[9px] font-mono text-prime-gold font-medium">
                        {item.categoryBadge}
                      </span>
                      <p className="text-xs font-bold text-prime-text group-hover:text-prime-gold transition-colors truncate">
                        {item.title}
                      </p>
                    </div>
                    <p className="text-[11px] text-prime-textMuted truncate">
                      {item.subtitle}
                    </p>
                    {item.snippet && (
                      <p className="mt-1 text-[11px] text-prime-textSecondary line-clamp-1 italic font-sans">
                        &ldquo;{item.snippet}&rdquo;
                      </p>
                    )}
                  </div>

                  <ArrowRight className="h-4 w-4 text-prime-textMuted group-hover:text-prime-gold group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-prime-textMuted">
                No matching writings, songs, or captures found for &ldquo;{searchQuery}&rdquo;.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Studio Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map((tab) => {
          const TabIcon = tab.icon;
          const isSelected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap",
                isSelected
                  ? "bg-prime-gold/15 text-prime-gold border border-prime-gold/30 shadow-prime-sm"
                  : "bg-prime-surface text-prime-textMuted hover:text-prime-text border border-prime-borderSubtle"
              )}
            >
              <TabIcon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  className={cn(
                    "rounded px-1.5 py-0.2 text-[10px] font-mono",
                    isSelected
                      ? "bg-prime-gold/20 text-prime-gold font-bold"
                      : "bg-prime-card text-prime-textMuted"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
