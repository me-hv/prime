"use client";

import * as React from "react";
import { useState } from "react";
import { VocabularyEntryData } from "@/lib/types";
import { createVocabularyEntry, deleteVocabularyEntry } from "@/actions/vocabulary";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  Library,
  Plus,
  Trash2,
  BookOpen,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

interface VocabularyGymViewProps {
  initialEntries?: VocabularyEntryData[];
  onCompleteSession?: (entryId: string) => void;
  className?: string;
}

export function VocabularyGymView({
  initialEntries = [],
  onCompleteSession,
  className,
}: VocabularyGymViewProps) {
  const { success, error } = useToast();
  const [entries, setEntries] = useState<VocabularyEntryData[]>(initialEntries);
  const [searchQuery, setSearchQuery] = useState("");

  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [pronunciation, setPronunciation] = useState("");
  const [partOfSpeech, setPartOfSpeech] = useState("");
  const [userLine, setUserLine] = useState("");
  const [associations, setAssociations] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim() || !definition.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await createVocabularyEntry({
        word: word.trim(),
        definition: definition.trim(),
        pronunciation: pronunciation.trim() || undefined,
        partOfSpeech: partOfSpeech.trim() || undefined,
        userLine: userLine.trim() || undefined,
        associations: associations.trim() || undefined,
      });

      setEntries((prev) => [created, ...prev]);
      setWord("");
      setDefinition("");
      setPronunciation("");
      setPartOfSpeech("");
      setUserLine("");
      setAssociations("");
      success(`Added '${created.word}' to your Vocabulary Vault.`);

      if (onCompleteSession) {
        onCompleteSession(created.id);
      }
    } catch (err) {
      console.error(err);
      error("Failed to add vocabulary entry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteVocabularyEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      success("Vocabulary entry deleted.");
    } catch (err) {
      console.error(err);
      error("Failed to delete vocabulary entry.");
    }
  };

  const filteredEntries = entries.filter((e) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.word.toLowerCase().includes(q) ||
      e.definition.toLowerCase().includes(q) ||
      (e.userLine && e.userLine.toLowerCase().includes(q))
    );
  });

  return (
    <div
      className={cn(
        "rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/15 via-prime-surface to-prime-card p-5 sm:p-6 shadow-prime-lg space-y-6 animate-fade-in",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-prime-borderSubtle">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Library className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-extrabold uppercase tracking-tight text-prime-text font-mono">
              VOCABULARY GYM & WORD VAULT
            </h2>
            <p className="text-[11px] text-prime-textMuted">
              Expand your lyrical palette with high-resonance literary words, custom lines, and sensory associations.
            </p>
          </div>
        </div>

        <span className="rounded-full bg-prime-surface border border-prime-border px-3 py-1 font-mono text-xs text-emerald-300 font-semibold">
          {entries.length} Words Logged
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Word Study Entry Form */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handleCreate}
            className="rounded-xl border border-prime-borderSubtle bg-prime-surface/70 p-4 space-y-3.5"
          >
            <span className="text-[10px] font-mono uppercase tracking-wider text-prime-textMuted font-bold block">
              Study & Log New Word
            </span>

            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Word"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="e.g. Obsidian"
                required
              />
              <Input
                label="Part of Speech"
                value={partOfSpeech}
                onChange={(e) => setPartOfSpeech(e.target.value)}
                placeholder="noun / adj"
              />
            </div>

            <Input
              label="Pronunciation / Phonetics"
              value={pronunciation}
              onChange={(e) => setPronunciation(e.target.value)}
              placeholder="e.g. əb-ˈsi-dē-ən"
            />

            <Textarea
              label="Definition"
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              placeholder="A dark, glassy volcanic rock formed by rapid cooling..."
              rows={2}
              required
            />

            <Textarea
              label="Your Original Lyrical Line"
              value={userLine}
              onChange={(e) => setUserLine(e.target.value)}
              placeholder="Built the ceiling out of obsidian so the cracks never let the light leak..."
              rows={2}
            />

            <Input
              label="Sensory Associations & Slant Rhymes"
              value={associations}
              onChange={(e) => setAssociations(e.target.value)}
              placeholder="midnight, volcanic, unbreakable, surgical"
            />

            <Button
              type="submit"
              variant="gold"
              size="sm"
              disabled={isSubmitting || !word.trim() || !definition.trim()}
              className="w-full text-xs font-semibold shadow-prime-glow-gold"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              <span>{isSubmitting ? "Logging..." : "Save Word to Vault"}</span>
            </Button>
          </form>
        </div>

        {/* Right Column: Vocabulary Vault Feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-prime-textMuted font-bold block">
              Word Vault Entries ({filteredEntries.length})
            </span>

            {/* Search filter */}
            <div className="relative w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-prime-textMuted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search words..."
                className="w-full rounded-lg border border-prime-border bg-prime-surface py-1 pl-8 pr-3 text-xs text-prime-text placeholder:text-prime-textMuted focus:border-prime-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3 max-h-[520px] overflow-y-auto scrollbar-thin">
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-xl border border-prime-borderSubtle bg-prime-card p-4 space-y-2.5 transition-all hover:border-emerald-500/30"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-prime-text font-mono">
                          {entry.word}
                        </h4>
                        {entry.partOfSpeech && (
                          <span className="text-[10px] font-mono italic text-prime-textMuted">
                            ({entry.partOfSpeech})
                          </span>
                        )}
                        {entry.pronunciation && (
                          <span className="rounded bg-prime-surface px-1.5 py-0.2 text-[10px] font-mono text-emerald-400">
                            {entry.pronunciation}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-prime-textSecondary mt-1 leading-relaxed">
                        {entry.definition}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(entry.id)}
                      className="text-prime-textMuted hover:text-rose-400 p-1 transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {entry.userLine && (
                    <div className="rounded-lg bg-prime-surface/70 p-2.5 border border-prime-borderSubtle">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-400 font-bold block mb-0.5">
                        Lyrical Application:
                      </span>
                      <p className="text-xs font-serif italic text-prime-text leading-relaxed">
                        &ldquo;{entry.userLine}&rdquo;
                      </p>
                    </div>
                  )}

                  {entry.associations && (
                    <div className="flex items-center gap-1 text-[11px] text-prime-textMuted">
                      <span className="font-mono text-[10px] uppercase font-bold text-prime-textSecondary">
                        Associations:
                      </span>
                      <span>{entry.associations}</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-prime-borderSubtle bg-prime-surface/40 p-12 text-center space-y-2">
                <BookOpen className="h-6 w-6 text-prime-gold mx-auto" />
                <h4 className="text-sm font-bold text-prime-text">
                  No Vocabulary Entries Found
                </h4>
                <p className="text-xs text-prime-textMuted">
                  Log your first new word on the left to start building your lyrical dictionary.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
