"use client";

import * as React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  SongData,
  SongSectionData,
  SongStatus,
  SongSectionType,
  SONG_STATUS_CONFIGS,
  SECTION_TYPE_CONFIGS,
  CreativeProjectData,
} from "@/lib/types";
import {
  updateSongMetadata,
  addSongSection,
  updateSongSection,
  deleteSongSection,
  duplicateSongSection,
  reorderSongSections,
  deleteSong,
} from "@/actions/songs";
import { addSongToProject, removeSongFromProject } from "@/actions/projects";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import {
  ArrowLeft,
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Target,
  Settings2,
  FolderGit2,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

interface SongEditorProps {
  initialSong: SongData;
  availableProjects?: CreativeProjectData[];
}

type SaveState = "idle" | "saving" | "saved" | "error";

export function SongEditor({
  initialSong,
  availableProjects = [],
}: SongEditorProps) {
  const router = useRouter();
  const { success, error } = useToast();

  const [title, setTitle] = useState(initialSong.title);
  const [concept, setConcept] = useState(initialSong.concept || "");
  const [status, setStatus] = useState<SongStatus>(initialSong.status);
  const [genre, setGenre] = useState(initialSong.genre || "");
  const [bpm, setBpm] = useState<string>(
    initialSong.bpm ? String(initialSong.bpm) : ""
  );
  const [musicalKey, setMusicalKey] = useState(initialSong.musicalKey || "");
  const [mood, setMood] = useState(initialSong.mood || "");
  const [nextAction, setNextAction] = useState(initialSong.nextAction || "");
  const [tags, setTags] = useState(initialSong.tags || "");
  const [notes, setNotes] = useState(initialSong.notes || "");

  const [sections, setSections] = useState<SongSectionData[]>(
    initialSong.sections
  );
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [lastSavedTime, setLastSavedTime] = useState<string>("Just now");
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Track project attachments
  const [attachedProjectIds, setAttachedProjectIds] = useState<string[]>(
    initialSong.projectIds || []
  );

  const metadataSaveTimer = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);

  // Total song words
  const totalWords = sections.reduce((sum, s) => sum + s.wordCount, 0);

  // Debounced metadata save
  const performMetadataSave = useCallback(async () => {
    try {
      setSaveState("saving");
      await updateSongMetadata(initialSong.id, {
        title,
        concept,
        status,
        genre,
        bpm: bpm ? Number(bpm) : null,
        musicalKey,
        mood,
        nextAction,
        tags,
        notes,
      });

      setSaveState("saved");
      const now = new Date();
      setLastSavedTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    } catch (err) {
      console.error("Save error:", err);
      setSaveState("error");
    }
  }, [
    initialSong.id,
    title,
    concept,
    status,
    genre,
    bpm,
    musicalKey,
    mood,
    nextAction,
    tags,
    notes,
  ]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveState("saving");
    if (metadataSaveTimer.current) clearTimeout(metadataSaveTimer.current);

    metadataSaveTimer.current = setTimeout(() => {
      performMetadataSave();
    }, 1200);

    return () => {
      if (metadataSaveTimer.current) clearTimeout(metadataSaveTimer.current);
    };
  }, [
    title,
    concept,
    status,
    genre,
    bpm,
    musicalKey,
    mood,
    nextAction,
    tags,
    notes,
    performMetadataSave,
  ]);

  // Section handling
  const handleAddSection = async (type: SongSectionType) => {
    try {
      const newSec = await addSongSection(initialSong.id, { type });
      setSections((prev) => [...prev, newSec]);
      success(`Added ${newSec.name}.`);
    } catch (err) {
      console.error(err);
      error("Failed to add section.");
    }
  };

  const handleSectionContentChange = (
    sectionId: string,
    newContent: string
  ) => {
    const wordCount = newContent.trim()
      ? newContent.trim().split(/\s+/).filter(Boolean).length
      : 0;

    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, content: newContent, wordCount } : s
      )
    );

    // Debounced update on server
    setSaveState("saving");
    if (metadataSaveTimer.current) clearTimeout(metadataSaveTimer.current);

    metadataSaveTimer.current = setTimeout(async () => {
      try {
        await updateSongSection(sectionId, { content: newContent });
        setSaveState("saved");
        const now = new Date();
        setLastSavedTime(
          now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
      } catch (err) {
        console.error(err);
        setSaveState("error");
      }
    }, 1000);
  };

  const handleSectionNameChange = async (
    sectionId: string,
    newName: string
  ) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, name: newName } : s))
    );
    await updateSongSection(sectionId, { name: newName });
  };

  const handleToggleCollapse = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === sectionId) {
          const nextVal = !s.collapsed;
          updateSongSection(sectionId, { collapsed: nextVal });
          return { ...s, collapsed: nextVal };
        }
        return s;
      })
    );
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm("Delete this section?")) return;
    try {
      await deleteSongSection(sectionId);
      setSections((prev) => prev.filter((s) => s.id !== sectionId));
      success("Section deleted.");
    } catch (err) {
      console.error(err);
      error("Failed to delete section.");
    }
  };

  const handleDuplicateSection = async (sectionId: string) => {
    try {
      const copy = await duplicateSongSection(sectionId);
      if (copy) {
        setSections((prev) => {
          const idx = prev.findIndex((s) => s.id === sectionId);
          const updated = [...prev];
          updated.splice(idx + 1, 0, copy as SongSectionData);
          return updated;
        });
        success("Section duplicated.");
      }
    } catch (err) {
      console.error(err);
      error("Failed to duplicate section.");
    }
  };

  const handleMoveSection = async (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === sections.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const reordered = [...sections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    setSections(reordered);
    await reorderSongSections(
      initialSong.id,
      reordered.map((s) => s.id)
    );
  };

  const handleToggleProject = async (projectId: string) => {
    const isAttached = attachedProjectIds.includes(projectId);
    try {
      if (isAttached) {
        await removeSongFromProject(projectId, initialSong.id);
        setAttachedProjectIds((prev) => prev.filter((id) => id !== projectId));
        success("Removed from project.");
      } else {
        await addSongToProject(projectId, initialSong.id);
        setAttachedProjectIds((prev) => [...prev, projectId]);
        success("Added to project tracklist.");
      }
    } catch (err) {
      console.error(err);
      error("Failed to update project attachment.");
    }
  };

  const handleDeleteSong = async () => {
    if (!confirm(`Permanently delete song "${title}"?`)) return;
    try {
      setIsDeleting(true);
      await deleteSong(initialSong.id);
      success("Song deleted.");
      router.push("/create?tab=songs");
    } catch (err) {
      console.error(err);
      error("Failed to delete song.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-prime-borderSubtle">
        <div className="flex items-center gap-3">
          <Link
            href="/create?tab=songs"
            className="flex items-center gap-1.5 text-xs font-mono text-prime-textMuted hover:text-prime-text transition-colors p-1 rounded-md"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Songs</span>
          </Link>

          <div className="h-4 w-px bg-prime-borderSubtle" />

          {/* Status Pipeline Selector */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as SongStatus)}
            className="rounded-lg border border-prime-borderSubtle bg-prime-surface px-2.5 py-1 text-xs font-mono text-prime-gold font-medium cursor-pointer"
          >
            {(Object.keys(SONG_STATUS_CONFIGS) as SongStatus[]).map((st) => (
              <option key={st} value={st}>
                Stage: {SONG_STATUS_CONFIGS[st].label}
              </option>
            ))}
          </select>
        </div>

        {/* Save State & Actions */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex items-center gap-1.5 text-xs font-mono">
            {saveState === "saving" && (
              <span className="text-prime-gold animate-pulse flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-prime-gold animate-ping" />
                <span>Saving...</span>
              </span>
            )}
            {saveState === "saved" && (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Saved ({lastSavedTime})</span>
              </span>
            )}
            {saveState === "error" && (
              <button
                onClick={performMetadataSave}
                className="text-rose-400 hover:underline flex items-center gap-1"
              >
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Save failed — Retry</span>
              </button>
            )}
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsMetadataOpen((prev) => !prev)}
            className="h-8 text-xs font-semibold"
          >
            <Settings2 className="h-3.5 w-3.5 mr-1 text-prime-gold" />
            <span>Song Details</span>
          </Button>

          <Button
            variant="ghost"
            size="iconSm"
            onClick={handleDeleteSong}
            disabled={isDeleting}
            title="Delete song"
            className="text-prime-textMuted hover:text-rose-400"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Song Title & Concept Banner */}
      <div className="space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Song Title..."
          className="w-full bg-transparent text-2xl sm:text-3xl font-extrabold tracking-tight text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none"
        />

        <textarea
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          placeholder="Song concept, core narrative, or emotional angle..."
          rows={2}
          className="w-full bg-prime-surface/60 border border-prime-borderSubtle rounded-xl p-3 text-xs sm:text-sm text-prime-textSecondary placeholder:text-prime-textMuted/40 resize-none focus:outline-none focus:border-prime-border"
        />

        {/* Next Action Bar */}
        <div className="flex items-center gap-2 rounded-xl bg-prime-surface border border-prime-borderSubtle p-2.5">
          <Target className="h-4 w-4 text-prime-gold shrink-0" />
          <span className="text-xs font-mono uppercase text-prime-textMuted font-semibold shrink-0">
            Next Action:
          </span>
          <input
            type="text"
            value={nextAction}
            onChange={(e) => setNextAction(e.target.value)}
            placeholder="e.g. Write Verse 2, record vocal scratch, mix 808..."
            className="flex-1 bg-transparent text-xs text-prime-text font-medium placeholder:text-prime-textMuted/40 focus:outline-none"
          />
        </div>
      </div>

      {/* Modular Song Sections Stream */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-prime-text font-mono">
              Song Structure & Lyrics
            </h3>
            <span className="rounded-full bg-prime-surface border border-prime-border px-2 py-0.5 text-[10px] font-mono text-prime-gold font-semibold">
              {sections.length} sections • {totalWords} words
            </span>
          </div>

          {/* Add Section Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-prime-textMuted hidden sm:inline">
              + Add Section:
            </span>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleAddSection(e.target.value as SongSectionType);
                  e.target.value = "";
                }
              }}
              defaultValue=""
              className="rounded-lg border border-prime-borderSubtle bg-prime-surface px-2.5 py-1 text-xs font-mono text-prime-gold font-medium cursor-pointer"
            >
              <option value="" disabled>
                + Add Section...
              </option>
              {(Object.keys(SECTION_TYPE_CONFIGS) as SongSectionType[]).map(
                (type) => (
                  <option key={type} value={type}>
                    {SECTION_TYPE_CONFIGS[type].label}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        {sections.length > 0 ? (
          <div className="space-y-3">
            {sections.map((section, idx) => {
              const typeConfig =
                SECTION_TYPE_CONFIGS[section.type] ||
                SECTION_TYPE_CONFIGS.VERSE;

              return (
                <div
                  key={section.id}
                  className="rounded-xl border border-prime-borderSubtle bg-prime-card/90 shadow-prime-sm transition-all overflow-hidden"
                >
                  {/* Section Header */}
                  <div className="flex items-center justify-between p-3 bg-prime-surface/80 border-b border-prime-borderSubtle/60">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <button
                        onClick={() => handleToggleCollapse(section.id)}
                        className="p-1 text-prime-textMuted hover:text-prime-text"
                        title={section.collapsed ? "Expand" : "Collapse"}
                      >
                        {section.collapsed ? (
                          <ChevronRight className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>

                      <span
                        className={cn(
                          "rounded px-2 py-0.5 text-[10px] font-mono border uppercase tracking-wider font-semibold",
                          typeConfig.badgeClass
                        )}
                      >
                        {typeConfig.label}
                      </span>

                      <input
                        type="text"
                        value={section.name}
                        onChange={(e) =>
                          handleSectionNameChange(section.id, e.target.value)
                        }
                        className="bg-transparent text-xs sm:text-sm font-bold text-prime-text focus:outline-none max-w-xs truncate"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-mono text-prime-textMuted mr-2">
                        {section.wordCount} words
                      </span>

                      {/* Move Up / Down */}
                      <button
                        onClick={() => handleMoveSection(idx, "up")}
                        disabled={idx === 0}
                        className="p-1 text-prime-textMuted hover:text-prime-text disabled:opacity-20"
                        title="Move up"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveSection(idx, "down")}
                        disabled={idx === sections.length - 1}
                        className="p-1 text-prime-textMuted hover:text-prime-text disabled:opacity-20"
                        title="Move down"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>

                      {/* Duplicate */}
                      <button
                        onClick={() => handleDuplicateSection(section.id)}
                        className="p-1 text-prime-textMuted hover:text-prime-text"
                        title="Duplicate section"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteSection(section.id)}
                        className="p-1 text-prime-textMuted hover:text-rose-400"
                        title="Delete section"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Section Content Area */}
                  {!section.collapsed && (
                    <div className="p-3 sm:p-4">
                      <textarea
                        value={section.content}
                        onChange={(e) =>
                          handleSectionContentChange(
                            section.id,
                            e.target.value
                          )
                        }
                        placeholder={`Write ${section.name}...`}
                        rows={
                          section.type === "HOOK"
                            ? 6
                            : section.type === "VERSE"
                            ? 12
                            : 4
                        }
                        className="w-full bg-transparent text-sm sm:text-base text-prime-text placeholder:text-prime-textMuted/30 leading-relaxed font-sans resize-y focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-prime-borderSubtle bg-prime-surface/40 p-8 text-center">
            <p className="text-xs text-prime-textMuted">
              No sections created yet for this song.
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddSection("HOOK")}
                className="text-xs"
              >
                + Add Hook
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddSection("VERSE")}
                className="text-xs"
              >
                + Add Verse 1
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Song Details Modal / Drawer */}
      <Modal
        isOpen={isMetadataOpen}
        onClose={() => setIsMetadataOpen(false)}
        title="SONG METADATA & PROJECT LINK"
        description="Configure musical key, tempo, genre, and album project attachments."
      >
        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Input
              label="Genre / Style"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="e.g. Hip-Hop, R&B"
            />
            <Input
              label="Tempo (BPM)"
              type="number"
              value={bpm}
              onChange={(e) => setBpm(e.target.value)}
              placeholder="e.g. 90"
            />
            <Input
              label="Musical Key"
              value={musicalKey}
              onChange={(e) => setMusicalKey(e.target.value)}
              placeholder="e.g. D Minor, F# Major"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Mood / Sonic Aesthetic"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="e.g. Dark, Euphoric, Gritty"
            />
            <Input
              label="Tags (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. lead-single, ep-track"
            />
          </div>

          <Textarea
            label="Arrangement & Mix Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Mixing tricks, reference tracks, instrumentation details..."
            rows={3}
          />

          {/* Project Attachment Section */}
          {availableProjects.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-prime-borderSubtle">
              <label className="text-xs font-semibold uppercase tracking-wider text-prime-textMuted font-mono">
                Attach to Projects ({attachedProjectIds.length} linked)
              </label>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {availableProjects.map((proj) => {
                  const isAttached = attachedProjectIds.includes(proj.id);
                  return (
                    <button
                      key={proj.id}
                      type="button"
                      onClick={() => handleToggleProject(proj.id)}
                      className={cn(
                        "w-full flex items-center justify-between rounded-lg p-2 text-xs transition-colors border text-left",
                        isAttached
                          ? "border-prime-gold/40 bg-prime-gold/15 text-prime-gold"
                          : "border-prime-borderSubtle bg-prime-surface text-prime-textSecondary hover:border-prime-border hover:text-prime-text"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <FolderGit2 className="h-3.5 w-3.5" />
                        <span className="font-medium">{proj.title}</span>
                        <span className="text-[10px] font-mono text-prime-textMuted">
                          ({proj.type})
                        </span>
                      </div>
                      <span className="font-mono text-[10px]">
                        {isAttached ? "Attached ✓" : "+ Attach"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-3 border-t border-prime-borderSubtle">
            <Button
              variant="gold"
              onClick={() => {
                performMetadataSave();
                setIsMetadataOpen(false);
              }}
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
