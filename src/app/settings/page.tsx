"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import {
  Settings,
  User,
  Palette,
  Bell,
  Download,
  ExternalLink,
  Check,
  Sparkles,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";

const THEMES = [
  {
    id: "obsidian",
    name: "Studio Obsidian (Active)",
    description: "Deep obsidian canvas with warm studio gold accents.",
    accent: "#E5A93C",
    previewBg: "bg-[#090A0F]",
  },
  {
    id: "midnight",
    name: "Midnight Titanium",
    description: "Cool slate and charcoal surfaces with neon cyan hints.",
    accent: "#38BDF8",
    previewBg: "bg-[#0B0F19]",
  },
  {
    id: "monochrome",
    name: "Cinematic Carbon",
    description: "Minimalist black and pure titanium typography.",
    accent: "#E2E8F0",
    previewBg: "bg-[#050505]",
  },
];

export default function SettingsPage() {
  const { success } = useToast();
  const [selectedTheme, setSelectedTheme] = useState("obsidian");
  const [defaultDuration, setDefaultDuration] = useState("30");
  const [weekStart, setWeekStart] = useState("monday");

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    success("Preferences saved.");
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-prime-borderSubtle">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="h-4 w-4 text-prime-gold" />
            <span className="text-xs font-mono uppercase tracking-widest text-prime-gold">
              System Configuration
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-prime-text">
            SETTINGS
          </h1>
          <p className="text-xs sm:text-sm text-prime-textMuted mt-0.5">
            Manage your workspace theme, studio defaults, and data backups.
          </p>
        </div>
      </div>

      {/* 1. Profile Shortcut */}
      <div className="rounded-xl border border-prime-borderSubtle bg-prime-card/85 p-5 shadow-prime-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-prime-gold/15 text-prime-gold">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-prime-text">Artist Profile & DNA</h3>
            <p className="text-xs text-prime-textSecondary">
              Manage artist moniker, disciplines, and core vision.
            </p>
          </div>
        </div>

        <Link href="/profile">
          <Button variant="secondary" size="sm">
            <span>Edit Profile</span>
            <ExternalLink className="h-3.5 w-3.5 ml-1" />
          </Button>
        </Link>
      </div>

      {/* 2. Visual Theme & Aesthetics */}
      <div className="rounded-xl border border-prime-borderSubtle bg-prime-card/85 p-6 shadow-prime-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-prime-borderSubtle pb-3">
          <Palette className="h-4 w-4 text-prime-gold" />
          <h3 className="text-sm font-bold tracking-tight text-prime-text uppercase">
            Appearance & Aesthetic
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {THEMES.map((theme) => {
            const isSelected = selectedTheme === theme.id;

            return (
              <div
                key={theme.id}
                onClick={() => {
                  setSelectedTheme(theme.id);
                  success(`Switched theme to ${theme.name}`);
                }}
                className={cn(
                  "cursor-pointer rounded-xl border p-4 transition-all flex flex-col justify-between space-y-3",
                  isSelected
                    ? "border-prime-gold bg-prime-surface ring-1 ring-prime-gold/30 shadow-prime-sm"
                    : "border-prime-borderSubtle bg-prime-surface/60 hover:border-prime-border"
                )}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      "h-6 w-6 rounded-full border border-prime-border flex items-center justify-center",
                      theme.previewBg
                    )}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: theme.accent }}
                    />
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-prime-gold" />}
                </div>

                <div>
                  <p className="font-bold text-xs text-prime-text">{theme.name}</p>
                  <p className="text-[11px] text-prime-textMuted mt-1 leading-relaxed">
                    {theme.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Studio Workflow Preferences */}
      <form
        onSubmit={handleSavePreferences}
        className="rounded-xl border border-prime-borderSubtle bg-prime-card/85 p-6 shadow-prime-sm space-y-4"
      >
        <div className="flex items-center gap-2 border-b border-prime-borderSubtle pb-3">
          <Sparkles className="h-4 w-4 text-prime-gold" />
          <h3 className="text-sm font-bold tracking-tight text-prime-text uppercase">
            Studio Defaults & Routine
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-prime-textSecondary">
              Default Session Duration
            </label>
            <select
              value={defaultDuration}
              onChange={(e) => setDefaultDuration(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-prime-border bg-prime-surface px-3 py-2 text-sm text-prime-text"
            >
              <option value="15">15 Minutes (Micro Sprint)</option>
              <option value="30">30 Minutes (Standard Block)</option>
              <option value="45">45 Minutes (Deep Focus)</option>
              <option value="60">60 Minutes (Studio Session)</option>
              <option value="90">90 Minutes (Album Flow)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-prime-textSecondary">
              Cadence Week Start
            </label>
            <select
              value={weekStart}
              onChange={(e) => setWeekStart(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-prime-border bg-prime-surface px-3 py-2 text-sm text-prime-text"
            >
              <option value="monday">Monday (Standard Artist Week)</option>
              <option value="sunday">Sunday</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="secondary" size="sm">
            Save Preferences
          </Button>
        </div>
      </form>

      {/* 4. Data & Backups */}
      <div className="rounded-xl border border-prime-borderSubtle bg-prime-card/85 p-6 shadow-prime-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-prime-borderSubtle pb-3">
          <Database className="h-4 w-4 text-prime-gold" />
          <h3 className="text-sm font-bold tracking-tight text-prime-text uppercase">
            Data Ownership & Local Export
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-prime-text">
              Export Full Artist Database (JSON)
            </p>
            <p className="text-xs text-prime-textSecondary mt-0.5 max-w-md">
              Download all your lyrics, quick captures, daily missions, goals, and activity logs in standard JSON format.
            </p>
          </div>

          <a href="/api/export" download>
            <Button variant="gold" size="sm" className="shadow-prime-glow-gold shrink-0">
              <Download className="h-3.5 w-3.5 mr-1.5" />
              <span>Export All Data</span>
            </Button>
          </a>
        </div>
      </div>

      {/* 5. Notifications & Distraction Guard Placeholder */}
      <div className="rounded-xl border border-dashed border-prime-borderSubtle bg-prime-surface/40 p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5 text-prime-textMuted" />
          <div>
            <p className="text-xs font-semibold text-prime-text">
              Distraction Blocker & Focus Shield
            </p>
            <p className="text-[11px] text-prime-textMuted">
              Scheduled for Phase 7 (AI Coach & Deep Focus Shield).
            </p>
          </div>
        </div>
        <span className="rounded bg-prime-surface border border-prime-borderSubtle px-2 py-0.5 text-[10px] font-mono text-prime-textMuted">
          Upcoming
        </span>
      </div>
    </div>
  );
}
