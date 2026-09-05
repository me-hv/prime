"use client";

import * as React from "react";
import { useState } from "react";
import { RhymeChainData } from "@/lib/types";
import { createRhymeChain, deleteRhymeChain, addRhymeEntry } from "@/actions/rhymes";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

interface RhymeBuilderViewProps {
  initialChains?: RhymeChainData[];
  onCompleteSession?: (chainId: string, entriesCount: number) => void;
  className?: string;
}

export function RhymeBuilderView({
  initialChains = [],
  onCompleteSession,
  className,
}: RhymeBuilderViewProps) {
  const { success, error } = useToast();
  const [chains, setChains] = useState<RhymeChainData[]>(initialChains);
  const [anchorPhrase, setAnchorPhrase] = useState("");
  const [syllableCount, setSyllableCount] = useState(3);
  const [notes, setNotes] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Active chain being edited
  const [activeChainId, setActiveChainId] = useState<string | null>(
    chains[0]?.id || null
  );
  const [newRhymeText, setNewRhymeText] = useState("");
  const [newRhymeNote, setNewRhymeNote] = useState("");

  const activeChain = chains.find((c) => c.id === activeChainId);

  const handleCreateChain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!anchorPhrase.trim()) return;

    setIsCreating(true);
    try {
      const created = await createRhymeChain({
        anchorPhrase: anchorPhrase.trim(),
        syllableCount,
        notes: notes.trim() || undefined,
      });

      setChains((prev) => [created, ...prev]);
      setActiveChainId(created.id);
      setAnchorPhrase("");
      setNotes("");
      success("Rhyme chain initialized.");
    } catch (err) {
      console.error(err);
      error("Failed to create rhyme chain.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChainId || !newRhymeText.trim()) return;

    try {
      const res = await addRhymeEntry(activeChainId, {
        rhymeText: newRhymeText.trim(),
        syllables: activeChain?.syllableCount || 3,
        notes: newRhymeNote.trim() || undefined,
      });

      if (res.success && res.entry) {
        setChains((prev) =>
          prev.map((c) =>
            c.id === activeChainId
              ? { ...c, entries: [...c.entries, res.entry!] }
              : c
          )
        );
        setNewRhymeText("");
        setNewRhymeNote("");
        success("Rhyme added.");
      }
    } catch (err) {
      console.error(err);
      error("Failed to add rhyme entry.");
    }
  };

  const handleDeleteChain = async (id: string) => {
    try {
      await deleteRhymeChain(id);
      setChains((prev) => prev.filter((c) => c.id !== id));
      if (activeChainId === id) {
        setActiveChainId(chains.find((c) => c.id !== id)?.id || null);
      }
      success("Rhyme chain removed.");
    } catch (err) {
      console.error(err);
      error("Failed to delete chain.");
    }
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-yellow-500/30 bg-gradient-to-b from-yellow-950/15 via-prime-surface to-prime-card p-5 sm:p-6 shadow-prime-lg space-y-6 animate-fade-in",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-prime-borderSubtle">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-extrabold uppercase tracking-tight text-prime-text font-mono">
              MULTISYLLABIC RHYME BUILDER
            </h2>
            <p className="text-[11px] text-prime-textMuted">
              Construct high-density multisyllabic rhyme schemes and save them to your permanent vault.
            </p>
          </div>
        </div>

        {activeChain && onCompleteSession && (
          <Button
            type="button"
            variant="gold"
            size="sm"
            onClick={() => onCompleteSession(activeChain.id, activeChain.entries.length)}
            className="text-xs shadow-prime-glow-gold h-8"
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            <span>Record Session</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Chain Creator & Chain Selector */}
        <div className="lg:col-span-5 space-y-5">
          {/* New Chain Form */}
          <form
            onSubmit={handleCreateChain}
            className="rounded-xl border border-prime-borderSubtle bg-prime-surface/70 p-4 space-y-3"
          >
            <span className="text-[10px] font-mono uppercase tracking-wider text-prime-textMuted font-bold block">
              Start New Rhyme Chain
            </span>

            <Input
              label="Anchor Phrase"
              value={anchorPhrase}
              onChange={(e) => setAnchorPhrase(e.target.value)}
              placeholder="e.g. complicated, obsidian skies"
              required
            />

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-prime-textSecondary mb-1.5 block">
                  Syllable Count
                </label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={syllableCount}
                  onChange={(e) => setSyllableCount(parseInt(e.target.value) || 1)}
                  className="w-full rounded-lg border border-prime-border bg-prime-surface px-3 py-2 text-sm text-prime-text focus:border-prime-gold focus:outline-none"
                />
              </div>

              <Input
                label="Scheme Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. O-I-A-E sequence"
              />
            </div>

            <Button
              type="submit"
              variant="outline"
              size="sm"
              disabled={isCreating || !anchorPhrase.trim()}
              className="w-full text-xs font-semibold border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/10"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              <span>{isCreating ? "Creating..." : "Create Anchor"}</span>
            </Button>
          </form>

          {/* Existing Chains List */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-prime-textMuted font-bold block">
              Saved Rhyme Vault ({chains.length})
            </span>

            <div className="space-y-1.5 max-h-[300px] overflow-y-auto scrollbar-thin">
              {chains.map((chain) => {
                const isSelected = chain.id === activeChainId;
                return (
                  <div
                    key={chain.id}
                    onClick={() => setActiveChainId(chain.id)}
                    className={cn(
                      "flex items-center justify-between rounded-xl p-3 border transition-all cursor-pointer",
                      isSelected
                        ? "bg-yellow-500/15 border-yellow-500/40 text-yellow-300 shadow-prime-sm"
                        : "bg-prime-surface/40 border-prime-borderSubtle text-prime-textSecondary hover:border-prime-border hover:text-prime-text"
                    )}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono">
                          {chain.anchorPhrase}
                        </span>
                        <span className="rounded bg-prime-bg px-1.5 py-0.2 text-[9px] font-mono text-prime-gold">
                          {chain.syllableCount} syl
                        </span>
                      </div>
                      <span className="text-[10px] text-prime-textMuted block">
                        {chain.entries.length} rhyming variations
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChain(chain.id);
                      }}
                      className="text-prime-textMuted hover:text-rose-400 p-1"
                      title="Delete chain"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Rhyme Chain Visualizer */}
        <div className="lg:col-span-7 space-y-4">
          {activeChain ? (
            <div className="rounded-xl border border-prime-borderSubtle bg-prime-card p-5 space-y-5">
              {/* Anchor Header */}
              <div className="space-y-1 pb-3 border-b border-prime-borderSubtle">
                <span className="text-[10px] font-mono uppercase tracking-widest text-yellow-400 font-bold">
                  Anchor Phrase ({activeChain.syllableCount} Syllables)
                </span>
                <h3 className="text-2xl font-black font-mono tracking-tight text-prime-text">
                  &ldquo;{activeChain.anchorPhrase}&rdquo;
                </h3>
                {activeChain.notes && (
                  <p className="text-xs text-prime-textMuted italic">
                    {activeChain.notes}
                  </p>
                )}
              </div>

              {/* Add Rhyme Entry Input */}
              <form onSubmit={handleAddEntry} className="flex gap-2">
                <div className="flex-1">
                  <Input
                    value={newRhymeText}
                    onChange={(e) => setNewRhymeText(e.target.value)}
                    placeholder={`Add rhyme for '${activeChain.anchorPhrase}'...`}
                    required
                  />
                </div>
                <div className="w-1/3">
                  <Input
                    value={newRhymeNote}
                    onChange={(e) => setNewRhymeNote(e.target.value)}
                    placeholder="Usage note..."
                  />
                </div>
                <Button
                  type="submit"
                  variant="gold"
                  size="sm"
                  className="h-10 px-4 self-end shadow-prime-glow-gold"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </form>

              {/* Rhyme Matrix Stream */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-prime-textMuted font-bold block">
                  Rhyme Variations ({activeChain.entries.length})
                </span>

                {activeChain.entries.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeChain.entries.map((entry, idx) => (
                      <div
                        key={entry.id}
                        className="rounded-lg border border-prime-borderSubtle bg-prime-surface/70 p-3 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-prime-text">
                            {idx + 1}. {entry.rhymeText}
                          </span>
                          <span className="text-[9px] font-mono text-prime-gold bg-prime-bg px-1.5 py-0.2 rounded">
                            {entry.syllables || activeChain.syllableCount}s
                          </span>
                        </div>
                        {entry.notes && (
                          <p className="text-[11px] text-prime-textMuted leading-tight">
                            {entry.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-prime-borderSubtle bg-prime-surface/40 p-6 text-center">
                    <p className="text-xs text-prime-textMuted">
                      No rhymes added to this chain yet. Add your first match above!
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-prime-borderSubtle bg-prime-surface/40 p-12 text-center space-y-2">
              <Sparkles className="h-6 w-6 text-prime-gold mx-auto" />
              <h4 className="text-sm font-bold text-prime-text">
                No Rhyme Chain Selected
              </h4>
              <p className="text-xs text-prime-textMuted">
                Create a new anchor phrase on the left to start building multi-syllabic schemes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
