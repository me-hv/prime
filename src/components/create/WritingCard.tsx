"use client";

import * as React from "react";
import Link from "next/link";
import { WritingDocumentData, WRITING_TYPE_CONFIGS } from "@/lib/types";
import { formatShortDate } from "@/lib/utils";
import { ArrowRight, Trash2, Clock } from "lucide-react";
import { deleteWritingDocument } from "@/actions/writings";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

interface WritingCardProps {
  document: WritingDocumentData;
}

export function WritingCard({ document }: WritingCardProps) {
  const { success, error } = useToast();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const typeConfig =
    WRITING_TYPE_CONFIGS[document.type] || WRITING_TYPE_CONFIGS.FREE_WRITE;

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete "${document.title}"?`)) return;

    try {
      setIsDeleting(true);
      await deleteWritingDocument(document.id);
      success("Draft removed.");
    } catch (err) {
      console.error(err);
      error("Failed to delete draft.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Link
      href={`/create/write/${document.id}`}
      className="group relative rounded-xl border border-prime-borderSubtle bg-prime-card/85 p-4 transition-all duration-200 hover:border-prime-border hover:bg-prime-card flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <span
            className={cn(
              "rounded px-2 py-0.5 text-[10px] font-mono border uppercase tracking-wider",
              typeConfig.badgeClass
            )}
          >
            {typeConfig.label}
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-prime-textMuted flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatShortDate(document.updatedAt)}</span>
            </span>

            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-prime-textMuted hover:text-rose-400"
              title="Delete draft"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <h3 className="text-sm font-bold tracking-tight text-prime-text group-hover:text-prime-gold transition-colors line-clamp-1">
          {document.title}
        </h3>

        {document.content && (
          <p className="mt-1.5 text-xs text-prime-textSecondary line-clamp-3 leading-relaxed font-sans font-normal opacity-90">
            {document.content}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-prime-borderSubtle/60 flex items-center justify-between text-xs font-mono">
        <span className="text-prime-textMuted">
          {document.wordCount} words • {document.characterCount} chars
        </span>
        <span className="text-prime-textMuted group-hover:text-prime-gold group-hover:translate-x-0.5 transition-all flex items-center gap-1 font-semibold">
          <span>Open</span>
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}
