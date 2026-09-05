"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CreativeProjectData,
  ProjectType,
  ProjectStatus,
  PROJECT_TYPE_CONFIGS,
  SongData,
} from "@/lib/types";
import {
  updateProject,
  addSongToProject,
  removeSongFromProject,
  reorderProjectSongs,
  deleteProject,
} from "@/actions/projects";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import {
  ArrowLeft,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Disc,
  ExternalLink,
  Save,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

interface ProjectEditorProps {
  initialProject: CreativeProjectData;
  availableSongs?: SongData[];
}

export function ProjectEditor({
  initialProject,
  availableSongs = [],
}: ProjectEditorProps) {
  const router = useRouter();
  const { success, error } = useToast();

  const [title, setTitle] = useState(initialProject.title);
  const [description, setDescription] = useState(
    initialProject.description || ""
  );
  const [type, setType] = useState<ProjectType>(initialProject.type);
  const [status, setStatus] = useState<ProjectStatus>(initialProject.status);
  const [targetDate, setTargetDate] = useState(initialProject.targetDate || "");
  const [notes, setNotes] = useState(initialProject.notes || "");

  const [songs, setSongs] = useState(initialProject.songs);
  const [isAddSongOpen, setIsAddSongOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const typeConfig = PROJECT_TYPE_CONFIGS[type] || PROJECT_TYPE_CONFIGS.EP;

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSaving(true);
      await updateProject(initialProject.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        type,
        status,
        targetDate: targetDate || undefined,
        notes: notes.trim() || undefined,
      });
      success("Project settings saved.");
    } catch (err) {
      console.error(err);
      error("Failed to save project.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSong = async (songId: string) => {
    try {
      await addSongToProject(initialProject.id, songId);
      const songToAdd = availableSongs.find((s) => s.id === songId);
      if (songToAdd) {
        setSongs((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            projectId: initialProject.id,
            songId: songToAdd.id,
            trackNumber: prev.length + 1,
            notes: null,
            song: songToAdd,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
      }
      success("Song added to project tracklist.");
      setIsAddSongOpen(false);
    } catch (err) {
      console.error(err);
      error("Failed to add song.");
    }
  };

  const handleRemoveSong = async (songId: string) => {
    try {
      await removeSongFromProject(initialProject.id, songId);
      setSongs((prev) => prev.filter((s) => s.songId !== songId));
      success("Track removed from project.");
    } catch (err) {
      console.error(err);
      error("Failed to remove track.");
    }
  };

  const handleMoveTrack = async (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === songs.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const reordered = [...songs];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    setSongs(reordered);
    await reorderProjectSongs(
      initialProject.id,
      reordered.map((s) => s.songId)
    );
  };

  const handleDelete = async () => {
    if (!confirm(`Delete project "${title}"? Attached songs will not be deleted.`))
      return;
    try {
      setIsDeleting(true);
      await deleteProject(initialProject.id);
      success("Project removed.");
      router.push("/create?tab=projects");
    } catch (err) {
      console.error(err);
      error("Failed to delete project.");
      setIsDeleting(false);
    }
  };

  const attachedSongIds = new Set(songs.map((s) => s.songId));
  const unattachedSongs = availableSongs.filter(
    (s) => !attachedSongIds.has(s.id)
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-prime-borderSubtle">
        <div className="flex items-center gap-3">
          <Link
            href="/create?tab=projects"
            className="flex items-center gap-1.5 text-xs font-mono text-prime-textMuted hover:text-prime-text transition-colors p-1 rounded-md"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Projects</span>
          </Link>

          <div className="h-4 w-px bg-prime-borderSubtle" />

          <span
            className={cn(
              "rounded px-2.5 py-0.5 text-[10px] font-mono border uppercase tracking-wider font-semibold",
              typeConfig.badgeClass
            )}
          >
            {typeConfig.label}
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            type="button"
            variant="ghost"
            size="iconSm"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete project"
            className="text-prime-textMuted hover:text-rose-400"
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="gold"
            size="sm"
            onClick={handleSaveProject}
            disabled={isSaving}
            className="h-8 text-xs font-semibold shadow-prime-glow-gold"
          >
            <Save className="h-3.5 w-3.5 mr-1" />
            <span>{isSaving ? "Saving..." : "Save Project"}</span>
          </Button>
        </div>
      </div>

      {/* Project Configuration Form */}
      <form onSubmit={handleSaveProject} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <Input
              label="Project Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. THE OBSIDIAN TAPE EP"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Select
              label="Project Type"
              value={type}
              onChange={(e) => setType(e.target.value as ProjectType)}
            >
              {(Object.keys(PROJECT_TYPE_CONFIGS) as ProjectType[]).map((t) => (
                <option key={t} value={t}>
                  {PROJECT_TYPE_CONFIGS[t].label}
                </option>
              ))}
            </Select>

            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
            >
              <option value="IDEA">Idea</option>
              <option value="PLANNING">Planning</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <Textarea
              label="Project Narrative & Concept"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Sonic direction, thematic narrative, release vision..."
              rows={2}
            />
          </div>

          <div className="space-y-3">
            <Input
              label="Target Release Date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
            <Input
              label="Production Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Mixing notes, mastering, features..."
            />
          </div>
        </div>
      </form>

      {/* Tracklist Sequencing Section */}
      <div className="space-y-3 pt-4 border-t border-prime-borderSubtle">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Disc className="h-4 w-4 text-purple-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-prime-text font-mono">
              Tracklist Sequencing
            </h3>
            <span className="rounded-full bg-prime-surface border border-prime-border px-2 py-0.5 text-[10px] font-mono text-prime-gold font-semibold">
              {songs.length} tracks
            </span>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsAddSongOpen(true)}
            className="h-8 text-xs font-semibold"
          >
            <Plus className="h-3.5 w-3.5 mr-1 text-purple-400" />
            <span>+ Attach Song</span>
          </Button>
        </div>

        {/* Track List */}
        {songs.length > 0 ? (
          <div className="space-y-2">
            {songs.map((ps, idx) => (
              <div
                key={ps.songId}
                className="flex items-center justify-between gap-3 rounded-xl border border-prime-borderSubtle bg-prime-card/90 p-3.5 transition-all hover:border-prime-border"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-prime-surface border border-prime-border text-xs font-mono font-bold text-prime-gold">
                    {idx + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-prime-text truncate">
                        {ps.song?.title || "Untitled Track"}
                      </p>
                      {ps.song?.status && (
                        <span className="rounded bg-prime-surface border border-prime-borderSubtle px-1.5 py-0.2 text-[9px] font-mono text-prime-textMuted">
                          {ps.song.status}
                        </span>
                      )}
                    </div>
                    {ps.song?.concept && (
                      <p className="text-xs text-prime-textMuted truncate">
                        {ps.song.concept}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Link
                    href={`/create/songs/${ps.songId}`}
                    className="p-1.5 text-xs text-prime-textSecondary hover:text-prime-gold flex items-center gap-1 font-mono"
                    title="Open in Song Workspace"
                  >
                    <span>Open</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>

                  <div className="h-4 w-px bg-prime-borderSubtle" />

                  {/* Reorder Buttons */}
                  <button
                    onClick={() => handleMoveTrack(idx, "up")}
                    disabled={idx === 0}
                    className="p-1 text-prime-textMuted hover:text-prime-text disabled:opacity-20"
                    title="Move up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleMoveTrack(idx, "down")}
                    disabled={idx === songs.length - 1}
                    className="p-1 text-prime-textMuted hover:text-prime-text disabled:opacity-20"
                    title="Move down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleRemoveSong(ps.songId)}
                    className="p-1 text-prime-textMuted hover:text-rose-400"
                    title="Remove from tracklist"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-prime-borderSubtle bg-prime-surface/40 p-8 text-center">
            <p className="text-xs text-prime-textMuted">
              No songs attached to this project tracklist yet.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddSongOpen(true)}
              className="mt-3 text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1 text-purple-400" />
              <span>Add First Track</span>
            </Button>
          </div>
        )}
      </div>

      {/* Add Song Modal */}
      <Modal
        isOpen={isAddSongOpen}
        onClose={() => setIsAddSongOpen(false)}
        title="ATTACH SONG TO TRACKLIST"
        description="Select an existing song from your catalog to sequence into this project."
      >
        <div className="space-y-2 pt-1 max-h-72 overflow-y-auto">
          {unattachedSongs.length > 0 ? (
            unattachedSongs.map((song) => (
              <button
                key={song.id}
                onClick={() => handleAddSong(song.id)}
                className="w-full flex items-center justify-between rounded-xl border border-prime-borderSubtle bg-prime-surface p-3 text-left transition-colors hover:border-prime-gold hover:bg-prime-card group"
              >
                <div>
                  <p className="text-xs font-bold text-prime-text group-hover:text-prime-gold">
                    {song.title}
                  </p>
                  <p className="text-[11px] text-prime-textMuted">
                    {song.status} • {song.sections.length} sections
                  </p>
                </div>
                <span className="text-xs font-mono text-prime-gold font-semibold">
                  + Add Track
                </span>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-xs text-prime-textMuted">
              All songs in your catalog are already in this tracklist, or no songs exist yet.
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
