"use client";

import * as React from "react";
import { useState } from "react";
import {
  QuickCaptureData,
  CaptureType,
  CAPTURE_TYPE_CONFIGS,
} from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import {
  ArrowRight,
  Trash2,
  Archive,
  Edit3,
  Copy,
  Check,
  Plus,
} from "lucide-react";
import {
  updateQuickCapture,
  archiveQuickCapture,
  deleteQuickCapture,
} from "@/actions/captures";
import { useToast } from "@/components/ui/Toast";
import { formatShortDate } from "@/lib/utils";
import { ConvertCaptureModal } from "./ConvertCaptureModal";
import { useNavigation } from "@/components/navigation/NavigationProvider";
import { cn } from "@/lib/utils";

interface CreativeInboxViewProps {
  captures: QuickCaptureData[];
}

export function CreativeInboxView({ captures }: CreativeInboxViewProps) {
  const { success, error } = useToast();
  const { openQuickCapture } = useNavigation();

  const [selectedStatus, setSelectedStatus] = useState<string>("INBOX");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [convertingCapture, setConvertingCapture] =
    useState<QuickCaptureData | null>(null);
  const [editingCapture, setEditingCapture] = useState<QuickCaptureData | null>(
    null
  );
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editType, setEditType] = useState<CaptureType>("IDEA");
  const [editTags, setEditTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredCaptures = captures.filter((c) => {
    const matchStatus =
      selectedStatus === "ALL" ? true : c.status === selectedStatus;
    const matchType = selectedType === "ALL" ? true : c.type === selectedType;
    return matchStatus && matchType;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    success("Copied to clipboard.");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleArchive = async (id: string) => {
    try {
      await archiveQuickCapture(id);
      success("Capture archived.");
    } catch (err) {
      console.error(err);
      error("Failed to archive capture.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteQuickCapture(id);
      success("Capture deleted.");
    } catch (err) {
      console.error(err);
      error("Failed to delete capture.");
    }
  };

  const openEdit = (c: QuickCaptureData) => {
    setEditingCapture(c);
    setEditTitle(c.title || "");
    setEditContent(c.content);
    setEditType(c.type);
    setEditTags(c.tags || "");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCapture || !editContent.trim()) return;

    try {
      setIsSubmitting(true);
      await updateQuickCapture(editingCapture.id, {
        title: editTitle.trim() || undefined,
        content: editContent.trim(),
        type: editType,
        tags: editTags.trim() || undefined,
      });
      success("Capture updated.");
      setEditingCapture(null);
    } catch (err) {
      console.error(err);
      error("Failed to update capture.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-prime-borderSubtle">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold tracking-tight text-prime-text uppercase">
            Creative Inbox
          </h2>
          <span className="rounded-full bg-prime-surface border border-prime-border px-2.5 py-0.5 text-xs font-mono text-prime-gold font-semibold">
            {captures.filter((c) => c.status === "INBOX").length} unassigned
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center rounded-lg bg-prime-surface p-0.5 border border-prime-borderSubtle">
            {["INBOX", "IN_PROGRESS", "ARCHIVED", "ALL"].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-mono font-medium transition-colors",
                  selectedStatus === st
                    ? "bg-prime-card text-prime-gold shadow-prime-sm"
                    : "text-prime-textMuted hover:text-prime-text"
                )}
              >
                {st === "INBOX"
                  ? "Inbox"
                  : st === "IN_PROGRESS"
                  ? "Developing"
                  : st === "ARCHIVED"
                  ? "Archived"
                  : "All"}
              </button>
            ))}
          </div>

          <Button
            variant="gold"
            size="sm"
            onClick={openQuickCapture}
            className="h-8 text-xs font-semibold shadow-prime-glow-gold"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>Capture</span>
          </Button>
        </div>
      </div>

      {/* Type Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedType("ALL")}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-mono transition-colors whitespace-nowrap",
            selectedType === "ALL"
              ? "bg-prime-gold/15 text-prime-gold border border-prime-gold/30 font-semibold"
              : "bg-prime-surface text-prime-textMuted hover:text-prime-text border border-prime-borderSubtle"
          )}
        >
          All Types
        </button>
        {(Object.keys(CAPTURE_TYPE_CONFIGS) as CaptureType[]).map((type) => {
          const count = captures.filter((c) => c.type === type).length;
          if (count === 0 && selectedType !== type) return null;

          return (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-mono transition-colors whitespace-nowrap",
                selectedType === type
                  ? "bg-prime-gold/15 text-prime-gold border border-prime-gold/30 font-semibold"
                  : "bg-prime-surface text-prime-textMuted hover:text-prime-text border border-prime-borderSubtle"
              )}
            >
              {CAPTURE_TYPE_CONFIGS[type].label} ({count})
            </button>
          );
        })}
      </div>

      {/* Captures Stream */}
      {filteredCaptures.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredCaptures.map((item) => {
            const config =
              CAPTURE_TYPE_CONFIGS[item.type] || CAPTURE_TYPE_CONFIGS.IDEA;

            return (
              <div
                key={item.id}
                className="group relative rounded-xl border border-prime-borderSubtle bg-prime-card/85 p-4 transition-all duration-200 hover:border-prime-border hover:bg-prime-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="rounded bg-prime-surface border border-prime-border px-2 py-0.5 text-[10px] font-mono text-prime-gold font-medium">
                        {config.label}
                      </span>
                      {item.status === "IN_PROGRESS" && (
                        <span className="rounded bg-sky-500/15 border border-sky-500/30 px-1.5 py-0.2 text-[9px] font-mono text-sky-300">
                          Converted to {item.convertedTo}
                        </span>
                      )}
                      {item.status === "ARCHIVED" && (
                        <span className="rounded bg-zinc-600/20 border border-zinc-600/30 px-1.5 py-0.2 text-[9px] font-mono text-zinc-400">
                          Archived
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-mono text-prime-textMuted mr-1">
                        {formatShortDate(item.createdAt)}
                      </span>
                      <button
                        onClick={() => handleCopy(item.id, item.content)}
                        className="p-1 text-prime-textMuted hover:text-prime-text"
                        title="Copy text"
                      >
                        {copiedId === item.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => openEdit(item)}
                        className="p-1 text-prime-textMuted hover:text-prime-text"
                        title="Edit capture"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      {item.status !== "ARCHIVED" && (
                        <button
                          onClick={() => handleArchive(item.id)}
                          className="p-1 text-prime-textMuted hover:text-prime-gold"
                          title="Archive"
                        >
                          <Archive className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-prime-textMuted hover:text-rose-400"
                        title="Delete capture"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {item.title && (
                    <h4 className="text-sm font-bold text-prime-text mb-1">
                      {item.title}
                    </h4>
                  )}

                  <p className="text-xs text-prime-text whitespace-pre-wrap leading-relaxed font-sans">
                    {item.content}
                  </p>

                  {item.tags && (
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {item.tags.split(",").map((tag, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-black/40 px-1.5 py-0.2 text-[9px] font-mono text-prime-textMuted"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Convert Button */}
                <div className="mt-4 pt-3 border-t border-prime-borderSubtle/60 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-prime-textMuted">
                    {item.content.length} chars
                  </span>

                  <Button
                    variant="gold"
                    size="sm"
                    onClick={() => setConvertingCapture(item)}
                    className="h-7 px-3 text-xs gap-1 font-semibold"
                  >
                    <span>Convert to Project / Draft</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-prime-borderSubtle bg-prime-surface/40 p-8 text-center">
          <p className="text-xs text-prime-textMuted">
            No captures found in this inbox view.
          </p>
          <p className="text-[11px] text-prime-textMuted/70 mt-1">
            Hit <kbd className="font-mono bg-black/40 px-1 rounded">⌘K</kbd> to capture an idea, hook, or punchline instantly.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={openQuickCapture}
            className="mt-3 text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1 text-prime-gold" />
            <span>Quick Capture</span>
          </Button>
        </div>
      )}

      {/* Convert Modal */}
      <ConvertCaptureModal
        capture={convertingCapture}
        isOpen={Boolean(convertingCapture)}
        onClose={() => setConvertingCapture(null)}
      />

      {/* Edit Capture Modal */}
      {editingCapture && (
        <Modal
          isOpen={Boolean(editingCapture)}
          onClose={() => setEditingCapture(null)}
          title="EDIT QUICK CAPTURE"
          description="Update the content or category of this inbox item."
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 pt-1">
            <Input
              label="Title (optional)"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Give this thought a short name..."
            />

            <Select
              label="Category"
              value={editType}
              onChange={(e) => setEditType(e.target.value as CaptureType)}
            >
              {(Object.keys(CAPTURE_TYPE_CONFIGS) as CaptureType[]).map(
                (type) => (
                  <option key={type} value={type}>
                    {CAPTURE_TYPE_CONFIGS[type].label}
                  </option>
                )
              )}
            </Select>

            <Textarea
              label="Content"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
              required
            />

            <Input
              label="Tags (comma-separated)"
              value={editTags}
              onChange={(e) => setEditTags(e.target.value)}
              placeholder="bars, hook, dark"
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-prime-borderSubtle">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditingCapture(null)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gold"
                disabled={isSubmitting || !editContent.trim()}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
