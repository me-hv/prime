"use client";

import * as React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  WritingDocumentData,
  WritingType,
  WritingStatus,
  WRITING_TYPE_CONFIGS,
} from "@/lib/types";
import {
  updateWritingDocument,
  deleteWritingDocument,
} from "@/actions/writings";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  Trash2,
  Maximize2,
  Minimize2,
  CheckCircle2,
  AlertCircle,
  Tag,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

interface WritingEditorProps {
  initialDocument: WritingDocumentData;
}

type SaveState = "idle" | "saving" | "saved" | "error";

export function WritingEditor({ initialDocument }: WritingEditorProps) {
  const router = useRouter();
  const { success, error } = useToast();

  const [title, setTitle] = useState(initialDocument.title);
  const [content, setContent] = useState(initialDocument.content);
  const [type, setType] = useState<WritingType>(initialDocument.type);
  const [status, setStatus] = useState<WritingStatus>(initialDocument.status);
  const [tags, setTags] = useState(initialDocument.tags || "");

  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [lastSavedTime, setLastSavedTime] = useState<string>("Just now");
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);

  // Live word & character counts
  const wordCount = content.trim()
    ? content.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const characterCount = content.length;

  const performSave = useCallback(
    async (
      overrideTitle?: string,
      overrideContent?: string,
      overrideType?: WritingType,
      overrideStatus?: WritingStatus,
      overrideTags?: string
    ) => {
      try {
        setSaveState("saving");
        await updateWritingDocument(initialDocument.id, {
          title: overrideTitle !== undefined ? overrideTitle : title,
          content: overrideContent !== undefined ? overrideContent : content,
          type: overrideType !== undefined ? overrideType : type,
          status: overrideStatus !== undefined ? overrideStatus : status,
          tags: overrideTags !== undefined ? overrideTags : tags,
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
    },
    [initialDocument.id, title, content, type, status, tags]
  );

  // Debounced Autosave Trigger
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveState("saving");

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      performSave();
    }, 1200);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [title, content, type, status, tags, performSave]);

  // Keyboard shortcut: Cmd/Ctrl + S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        performSave();
        success("Saved manually.");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [performSave, success]);

  const handleDelete = async () => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      setIsDeleting(true);
      await deleteWritingDocument(initialDocument.id);
      success("Draft deleted.");
      router.push("/create?tab=writings");
    } catch (err) {
      console.error(err);
      error("Failed to delete draft.");
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={cn(
        "min-h-[80vh] flex flex-col transition-all duration-300",
        isFocusMode && "max-w-4xl mx-auto"
      )}
    >
      {/* Studio Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-prime-borderSubtle">
        <div className="flex items-center gap-3">
          <Link
            href="/create?tab=writings"
            className="flex items-center gap-1.5 text-xs font-mono text-prime-textMuted hover:text-prime-text transition-colors p-1 rounded-md"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Writings</span>
          </Link>

          <div className="h-4 w-px bg-prime-borderSubtle" />

          {/* Type Selector */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value as WritingType)}
            className="rounded-lg border border-prime-borderSubtle bg-prime-surface px-2.5 py-1 text-xs font-mono text-prime-gold font-medium cursor-pointer"
          >
            {(Object.keys(WRITING_TYPE_CONFIGS) as WritingType[]).map((t) => (
              <option key={t} value={t}>
                {WRITING_TYPE_CONFIGS[t].label}
              </option>
            ))}
          </select>

          {/* Status Selector */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as WritingStatus)}
            className="rounded-lg border border-prime-borderSubtle bg-prime-surface px-2.5 py-1 text-xs font-mono text-prime-textSecondary cursor-pointer"
          >
            <option value="DRAFT">Draft</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="FINISHED">Finished</option>
            <option value="ARCHIVED">Archived</option>
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
                onClick={() => performSave()}
                className="text-rose-400 hover:underline flex items-center gap-1"
              >
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Save failed — Retry</span>
              </button>
            )}
          </div>

          <Button
            variant="ghost"
            size="iconSm"
            onClick={() => setIsFocusMode((prev) => !prev)}
            title={isFocusMode ? "Exit Focus Mode" : "Focus Mode"}
            className="text-prime-textMuted hover:text-prime-text"
          >
            {isFocusMode ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="iconSm"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete draft"
            className="text-prime-textMuted hover:text-rose-400"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col py-6 space-y-4">
        {/* Title Field */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Verse or Draft..."
          className="w-full bg-transparent text-2xl sm:text-3xl font-extrabold tracking-tight text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none"
        />

        {/* Tags Field */}
        <div className="flex items-center gap-2 text-xs text-prime-textMuted">
          <Tag className="h-3.5 w-3.5 text-prime-gold shrink-0" />
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Add tags (e.g. verse-2, ep-track, dark-tempo)..."
            className="w-full bg-transparent text-xs font-mono text-prime-textSecondary placeholder:text-prime-textMuted/40 focus:outline-none"
          />
        </div>

        {/* Text Writing Area */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing... Bars, rhyme schemes, story beats, or raw honest thoughts."
          rows={16}
          autoFocus
          className="w-full flex-1 min-h-[420px] bg-transparent text-base sm:text-lg text-prime-text placeholder:text-prime-textMuted/30 leading-relaxed font-sans resize-none focus:outline-none"
        />
      </div>

      {/* Footer Word & Character Counter */}
      <div className="py-3 border-t border-prime-borderSubtle flex flex-wrap items-center justify-between text-xs font-mono text-prime-textMuted">
        <div className="flex items-center gap-3">
          <span>
            Words: <strong className="text-prime-text">{wordCount}</strong>
          </span>
          <span>•</span>
          <span>
            Characters:{" "}
            <strong className="text-prime-text">{characterCount}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-prime-surface border border-prime-borderSubtle px-1.5 py-0.5 text-[10px] text-prime-textMuted">
            ⌘S to save
          </kbd>
        </div>
      </div>
    </div>
  );
}
