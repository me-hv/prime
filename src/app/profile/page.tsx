"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { getProfile, updateProfile } from "@/actions/profile";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import {
  User,
  Check,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";

const AVAILABLE_DISCIPLINES = [
  "Rap",
  "Songwriting",
  "Music Production",
  "Writing",
  "Singing",
  "Instrument",
  "Sound Design",
  "Engineering",
  "Other",
];

export default function ProfilePage() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [bio, setBio] = useState("");
  const [disciplines, setDisciplines] = useState<string[]>([]);
  const [currentFocus, setCurrentFocus] = useState("");
  const [vision, setVision] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getProfile();
        setDisplayName(data.displayName);
        setArtistName(data.artistName);
        setBio(data.bio);
        setDisciplines(data.disciplines);
        setCurrentFocus(data.currentFocus);
        setVision(data.vision);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggleDiscipline = (disc: string) => {
    setDisciplines((prev) =>
      prev.includes(disc)
        ? prev.filter((d) => d !== disc)
        : [...prev, disc]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || !artistName.trim()) return;

    try {
      setIsSaving(true);
      await updateProfile({
        displayName: displayName.trim(),
        artistName: artistName.trim(),
        bio: bio.trim(),
        disciplines,
        currentFocus: currentFocus.trim(),
        vision: vision.trim(),
      });
      success("Artist identity and profile saved.");
    } catch (err) {
      console.error(err);
      error("Failed to save profile changes.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 font-mono text-xs text-prime-gold">
          <span className="h-2 w-2 rounded-full bg-prime-gold animate-ping" />
          <span>LOADING ARTIST DNA...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-prime-borderSubtle">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <User className="h-4 w-4 text-prime-gold" />
            <span className="text-xs font-mono uppercase tracking-widest text-prime-gold">
              Artist OS Identity
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-prime-text">
            ARTIST PROFILE & DNA
          </h1>
          <p className="text-xs sm:text-sm text-prime-textMuted mt-0.5">
            Configure your creative disciplines, overarching focus, and long-term vision.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleSave}
          variant="gold"
          disabled={isSaving}
          className="shadow-prime-glow-gold self-start sm:self-auto font-semibold"
        >
          <Save className="h-4 w-4 mr-1.5" />
          <span>{isSaving ? "Saving..." : "Save Identity"}</span>
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Identity Card */}
        <div className="rounded-xl border border-prime-borderSubtle bg-prime-card/85 p-6 shadow-prime-sm space-y-4">
          <h3 className="text-sm font-bold tracking-tight text-prime-text uppercase border-b border-prime-borderSubtle pb-2">
            1. Core Identity & Moniker
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Harry"
              required
            />
            <Input
              label="Artist Moniker / Handle"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              placeholder="e.g. HARRY / PRIME"
              required
            />
          </div>

          <Textarea
            label="Artist Bio / Creative Statement"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A short description of your style, sonic direction, and artistic manifesto..."
            rows={3}
          />
        </div>

        {/* Creative Disciplines */}
        <div className="rounded-xl border border-prime-borderSubtle bg-prime-card/85 p-6 shadow-prime-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold tracking-tight text-prime-text uppercase">
              2. Primary Creative Disciplines
            </h3>
            <p className="text-xs text-prime-textSecondary mt-0.5">
              Select the disciplines that define your creative practice.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {AVAILABLE_DISCIPLINES.map((disc) => {
              const isSelected = disciplines.includes(disc);

              return (
                <button
                  type="button"
                  key={disc}
                  onClick={() => toggleDiscipline(disc)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-all select-none",
                    isSelected
                      ? "border-prime-gold bg-prime-gold/15 text-prime-gold shadow-prime-sm"
                      : "border-prime-borderSubtle bg-prime-surface text-prime-textSecondary hover:border-prime-border hover:text-prime-text"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded border text-[10px]",
                      isSelected
                        ? "border-prime-gold bg-prime-gold text-prime-bg font-bold"
                        : "border-prime-borderHighlight bg-transparent"
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                  <span>{disc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Strategic Focus & Vision */}
        <div className="rounded-xl border border-prime-borderSubtle bg-prime-card/85 p-6 shadow-prime-sm space-y-4">
          <h3 className="text-sm font-bold tracking-tight text-prime-text uppercase border-b border-prime-borderSubtle pb-2">
            3. North Star & Long-Term Vision
          </h3>

          <Input
            label="Current Overarching Focus"
            value={currentFocus}
            onChange={(e) => setCurrentFocus(e.target.value)}
            placeholder="e.g. BUILD MY MUSIC CAREER & FINISH DEBUT EP"
            required
          />

          <Textarea
            label="Long-Term Artistic Vision"
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            placeholder="Describe where you want to be as an artist 3-5 years from now..."
            rows={4}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="gold"
            disabled={isSaving}
            className="px-6 shadow-prime-glow-gold font-semibold"
          >
            <Save className="h-4 w-4 mr-1.5" />
            <span>{isSaving ? "Saving..." : "Save Identity"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
