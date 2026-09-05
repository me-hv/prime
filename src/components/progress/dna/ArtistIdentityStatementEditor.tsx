"use client";

import * as React from "react";
import { useState } from "react";
import { Dna, Edit3, Check, X } from "lucide-react";
import { updateArtistDNA } from "@/actions/dna";

interface ArtistIdentityStatementEditorProps {
  initialStatement: string;
}

export function ArtistIdentityStatementEditor({
  initialStatement,
}: ArtistIdentityStatementEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [statement, setStatement] = useState(initialStatement);
  const [savedStatement, setSavedStatement] = useState(initialStatement);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!statement.trim()) return;
    setIsSaving(true);
    try {
      await updateArtistDNA({ identityStatement: statement.trim() });
      setSavedStatement(statement.trim());
      setIsEditing(false);
    } catch (e) {
      console.error("Failed to update identity statement:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setStatement(savedStatement);
    setIsEditing(false);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-purple-500/25 bg-gradient-to-r from-purple-950/40 via-prime-surface to-prime-surface/90 p-6 sm:p-7 shadow-prime-md">
      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Dna className="h-3.5 w-3.5 text-purple-400" />
              Artist Identity Statement
            </span>
            <span className="text-[11px] font-mono text-prime-textMuted hidden sm:inline">
              User-Authored Vision
            </span>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-prime-surface/80 hover:bg-prime-surface text-prime-text text-xs font-semibold border border-prime-borderSubtle transition-all"
            >
              <Edit3 className="h-3.5 w-3.5 text-purple-400" />
              <span>Edit Statement</span>
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              rows={3}
              placeholder="What kind of artist do you want to become?"
              className="w-full p-4 rounded-xl bg-prime-surface border border-purple-500/40 text-sm sm:text-base font-medium text-prime-text leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-prime-surface text-xs font-semibold text-prime-textMuted hover:text-prime-text border border-prime-borderSubtle transition-all"
              >
                <X className="h-3.5 w-3.5" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !statement.trim()}
                className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-400 text-zinc-950 text-xs font-bold font-mono transition-all shadow-prime-sm"
              >
                <Check className="h-3.5 w-3.5" />
                <span>{isSaving ? "Saving..." : "Save Identity"}</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <blockquote className="text-base sm:text-lg font-semibold text-prime-text tracking-tight leading-relaxed italic border-l-2 border-purple-500/50 pl-4 py-1">
              &ldquo;{savedStatement}&rdquo;
            </blockquote>
          </div>
        )}
      </div>
    </div>
  );
}
