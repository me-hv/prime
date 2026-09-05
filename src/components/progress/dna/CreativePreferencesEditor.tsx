"use client";

import * as React from "react";
import { useState } from "react";
import {
  Sliders,
  Music,
  Users,
  Radio,
  Clock,
  Check,
  Edit3,
  Flame,
  ShieldAlert,
} from "lucide-react";
import { updateArtistDNA } from "@/actions/dna";
import { ArtistDNAData } from "@/lib/types";

interface CreativePreferencesEditorProps {
  dna: ArtistDNAData;
}

export function CreativePreferencesEditor({
  dna,
}: CreativePreferencesEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [genres, setGenres] = useState(dna.favoriteGenres.join(", "));
  const [artists, setArtists] = useState(dna.favoriteArtists.join(", "));
  const [producers, setProducers] = useState(dna.favoriteProducers.join(", "));
  const [styles, setStyles] = useState(dna.favoriteStyles.join(", "));
  const [bpm, setBpm] = useState(dna.preferredBpmRange);
  const [themes, setThemes] = useState(dna.favoriteThemes.join(", "));
  const [environment, setEnvironment] = useState(dna.creativeEnvironment);
  const [userStrengths, setUserStrengths] = useState(
    dna.userStrengths.join(", ")
  );
  const [userWeaknesses, setUserWeaknesses] = useState(
    dna.userWeaknesses.join(", ")
  );
  const [manualFocus, setManualFocus] = useState(
    dna.manualFocusOverride || ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateArtistDNA({
        favoriteGenres: genres
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        favoriteArtists: artists
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        favoriteProducers: producers
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        favoriteStyles: styles
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        preferredBpmRange: bpm.trim(),
        favoriteThemes: themes
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        creativeEnvironment: environment.trim(),
        userStrengths: userStrengths
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        userWeaknesses: userWeaknesses
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        manualFocusOverride: manualFocus.trim() || null,
      });

      setSavedSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (e) {
      console.error("Failed to save creative preferences:", e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-prime-borderSubtle bg-prime-card/90 p-5 sm:p-6 shadow-prime-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-prime-borderSubtle">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-prime-text uppercase flex items-center gap-2">
            <Sliders className="h-4 w-4 text-purple-400" />
            My Creative Preferences & Profile
          </h3>
          <p className="text-xs text-prime-textMuted mt-0.5">
            Explicitly define your musical lineage, production tastes, and workflow rules. (User-Authored)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <Check className="h-3 w-3" /> Saved
            </span>
          )}
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-prime-surface hover:bg-prime-surface/80 text-prime-text text-xs font-semibold border border-prime-borderSubtle transition-all"
            >
              <Edit3 className="h-3.5 w-3.5 text-purple-400" />
              <span>Edit Preferences</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
                className="px-3 py-1.5 rounded-lg bg-prime-surface text-xs font-semibold text-prime-textMuted hover:text-prime-text border border-prime-borderSubtle"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-400 text-zinc-950 text-xs font-bold font-mono transition-all shadow-prime-sm"
              >
                <Check className="h-3.5 w-3.5" />
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-prime-textMuted uppercase">
              Favorite Genres (comma-separated)
            </label>
            <input
              type="text"
              value={genres}
              onChange={(e) => setGenres(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-prime-surface border border-prime-borderSubtle text-xs text-prime-text focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-prime-textMuted uppercase">
              Preferred BPM Range
            </label>
            <input
              type="text"
              value={bpm}
              onChange={(e) => setBpm(e.target.value)}
              placeholder="e.g. 84 - 94 BPM"
              className="w-full px-3 py-2 rounded-xl bg-prime-surface border border-prime-borderSubtle text-xs text-prime-text focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-prime-textMuted uppercase">
              Influential Lyricists & Artists
            </label>
            <input
              type="text"
              value={artists}
              onChange={(e) => setArtists(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-prime-surface border border-prime-borderSubtle text-xs text-prime-text focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-prime-textMuted uppercase">
              Influential Producers & Sound Architects
            </label>
            <input
              type="text"
              value={producers}
              onChange={(e) => setProducers(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-prime-surface border border-prime-borderSubtle text-xs text-prime-text focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-prime-textMuted uppercase">
              Lyrical & Songwriting Styles
            </label>
            <input
              type="text"
              value={styles}
              onChange={(e) => setStyles(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-prime-surface border border-prime-borderSubtle text-xs text-prime-text focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-prime-textMuted uppercase">
              Core Themes & Subject Matter
            </label>
            <input
              type="text"
              value={themes}
              onChange={(e) => setThemes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-prime-surface border border-prime-borderSubtle text-xs text-prime-text focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-prime-textMuted uppercase">
              Self-Reported Strengths
            </label>
            <input
              type="text"
              value={userStrengths}
              onChange={(e) => setUserStrengths(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-prime-surface border border-prime-borderSubtle text-xs text-prime-text focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-prime-textMuted uppercase">
              Self-Reported Weaknesses
            </label>
            <input
              type="text"
              value={userWeaknesses}
              onChange={(e) => setUserWeaknesses(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-prime-surface border border-prime-borderSubtle text-xs text-prime-text focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-mono font-bold text-prime-textMuted uppercase">
              Ideal Studio & Creative Environment
            </label>
            <input
              type="text"
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-prime-surface border border-prime-borderSubtle text-xs text-prime-text focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-mono font-bold text-prime-textMuted uppercase">
              Manual Focus Override (Optional)
            </label>
            <input
              type="text"
              value={manualFocus}
              onChange={(e) => setManualFocus(e.target.value)}
              placeholder="Leave empty to use PRIME's deterministic priority focus"
              className="w-full px-3 py-2 rounded-xl bg-prime-surface border border-prime-borderSubtle text-xs text-prime-text focus:outline-none focus:border-purple-500/50"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Genres & BPM */}
          <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/70 p-4 space-y-2">
            <span className="text-[11px] font-mono uppercase font-bold text-prime-textMuted flex items-center gap-1.5">
              <Music className="h-3.5 w-3.5 text-purple-400" />
              Genres & Tempo
            </span>
            <div className="flex flex-wrap gap-1.5">
              {dna.favoriteGenres.map((g) => (
                <span
                  key={g}
                  className="px-2 py-0.5 rounded bg-prime-card border border-prime-borderSubtle text-prime-textSecondary"
                >
                  {g}
                </span>
              ))}
            </div>
            <p className="text-[11px] font-mono text-prime-textMuted pt-1">
              Preferred BPM: <span className="text-prime-text font-bold">{dna.preferredBpmRange}</span>
            </p>
          </div>

          {/* Lineage */}
          <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/70 p-4 space-y-2">
            <span className="text-[11px] font-mono uppercase font-bold text-prime-textMuted flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-sky-400" />
              Influences & Masters
            </span>
            <div className="flex flex-wrap gap-1.5">
              {dna.favoriteArtists.map((a) => (
                <span
                  key={a}
                  className="px-2 py-0.5 rounded bg-prime-card border border-prime-borderSubtle text-prime-textSecondary"
                >
                  {a}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-prime-textMuted pt-1">
              Producers: {dna.favoriteProducers.join(", ")}
            </p>
          </div>

          {/* Lyrical Styles & Themes */}
          <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/70 p-4 space-y-2">
            <span className="text-[11px] font-mono uppercase font-bold text-prime-textMuted flex items-center gap-1.5">
              <Radio className="h-3.5 w-3.5 text-amber-400" />
              Styles & Themes
            </span>
            <div className="flex flex-wrap gap-1.5">
              {dna.favoriteStyles.map((s) => (
                <span
                  key={s}
                  className="px-2 py-0.5 rounded bg-prime-card border border-prime-borderSubtle text-prime-textSecondary"
                >
                  {s}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-prime-textMuted pt-1">
              Themes: {dna.favoriteThemes.join(" • ")}
            </p>
          </div>

          {/* User Strengths */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-4 space-y-2">
            <span className="text-[11px] font-mono uppercase font-bold text-emerald-400 flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5" />
              My Claimed Strengths
            </span>
            <div className="flex flex-wrap gap-1.5">
              {dna.userStrengths.map((s) => (
                <span
                  key={s}
                  className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* User Weaknesses */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-950/10 p-4 space-y-2">
            <span className="text-[11px] font-mono uppercase font-bold text-amber-400 flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5" />
              My Acknowledged Weaknesses
            </span>
            <div className="flex flex-wrap gap-1.5">
              {dna.userWeaknesses.map((w) => (
                <span
                  key={w}
                  className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300"
                >
                  {w}
                </span>
              ))}
            </div>
          </div>

          {/* Studio Environment */}
          <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/70 p-4 space-y-1.5">
            <span className="text-[11px] font-mono uppercase font-bold text-prime-textMuted flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-indigo-400" />
              Studio Environment
            </span>
            <p className="text-xs text-prime-textSecondary leading-relaxed italic">
              &ldquo;{dna.creativeEnvironment}&rdquo;
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
