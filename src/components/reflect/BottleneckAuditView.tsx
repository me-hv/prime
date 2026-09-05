"use client";

import * as React from "react";
import { useState } from "react";
import {
  BottleneckData,
  BottleneckCategory,
  BOTTLENECK_CATEGORY_CONFIGS,
} from "@/lib/types";
import {
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  Flame,
} from "lucide-react";
import { resolveBottleneck, deleteBottleneck } from "@/actions/reflection";
import { BottleneckModal } from "./BottleneckModal";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface BottleneckAuditViewProps {
  bottlenecks: BottleneckData[];
  onBottleneckSaved: (b: BottleneckData) => void;
  onDeleted?: (id: string) => void;
}

export function BottleneckAuditView({
  bottlenecks,
  onBottleneckSaved,
  onDeleted,
}: BottleneckAuditViewProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBottleneck, setEditingBottleneck] = useState<BottleneckData | null>(null);
  const [statusFilter, setStatusFilter] = useState<"ACTIVE" | "RESOLVED" | "ALL">("ACTIVE");

  const filteredBottlenecks = bottlenecks.filter((b) => {
    if (statusFilter === "ACTIVE") return !b.resolved;
    if (statusFilter === "RESOLVED") return b.resolved;
    return true;
  });

  const handleResolve = async (id: string) => {
    const note = prompt("What solution worked to resolve this bottleneck?");
    await resolveBottleneck(id, note || undefined);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this bottleneck record?")) {
      await deleteBottleneck(id);
      if (onDeleted) onDeleted(id);
    }
  };

  const handleTrainWeakness = (category: BottleneckCategory) => {
    const mapping: Record<string, string> = {
      FLOW: "FLOW",
      WRITING: "WRITING",
      FINISHING: "WRITING",
      RHYME: "RHYME",
      VOCABULARY: "VOCABULARY",
      STORYTELLING: "STORYTELLING",
      PRODUCTION: "PRODUCTION",
    };
    const targetCategory = mapping[category] || "WRITING";
    router.push(`/train?category=${targetCategory}`);
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-prime-text">
            Creative Bottleneck & Friction Audit
          </h2>
          <p className="text-xs text-prime-textMuted">
            Identify recurring bottlenecks, rate severity (1–5), log attempted solutions, and turn weaknesses directly into deliberate training drills.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingBottleneck(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-400 shadow-prime-sm transition-all shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Audit New Bottleneck</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setStatusFilter("ACTIVE")}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
            statusFilter === "ACTIVE"
              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
              : "bg-prime-surface text-prime-textMuted border border-prime-borderSubtle hover:text-prime-text"
          )}
        >
          Active Bottlenecks ({bottlenecks.filter((b) => !b.resolved).length})
        </button>
        <button
          onClick={() => setStatusFilter("RESOLVED")}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
            statusFilter === "RESOLVED"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "bg-prime-surface text-prime-textMuted border border-prime-borderSubtle hover:text-prime-text"
          )}
        >
          Resolved ({bottlenecks.filter((b) => b.resolved).length})
        </button>
        <button
          onClick={() => setStatusFilter("ALL")}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
            statusFilter === "ALL"
              ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
              : "bg-prime-surface text-prime-textMuted border border-prime-borderSubtle hover:text-prime-text"
          )}
        >
          All Records ({bottlenecks.length})
        </button>
      </div>

      {/* Bottlenecks List */}
      {filteredBottlenecks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBottlenecks.map((b) => {
            const catConfig =
              BOTTLENECK_CATEGORY_CONFIGS[b.category] ||
              BOTTLENECK_CATEGORY_CONFIGS.FINISHING;

            return (
              <div
                key={b.id}
                className={cn(
                  "group rounded-2xl border p-5 transition-all flex flex-col justify-between space-y-4",
                  b.resolved
                    ? "bg-prime-surface/40 border-prime-borderSubtle opacity-80"
                    : "bg-prime-surface border-rose-500/25 hover:border-rose-500/40 shadow-prime-sm"
                )}
              >
                <div className="space-y-3">
                  {/* Top Bar: Category + Severity Dots + Date */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border",
                        catConfig.badgeClass
                      )}
                    >
                      {catConfig.label}
                    </span>

                    {/* Severity Meter (1-5) */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-prime-textMuted uppercase mr-1">
                        Severity:
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((dot) => (
                          <span
                            key={dot}
                            className={cn(
                              "h-2 w-2 rounded-full",
                              dot <= b.severity
                                ? b.severity >= 4
                                  ? "bg-rose-500"
                                  : "bg-amber-500"
                                : "bg-prime-surfaceSubtle border border-prime-borderSubtle"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <h3 className="text-sm sm:text-base font-extrabold text-prime-text leading-snug">
                    {b.description}
                  </h3>

                  {/* Attempted Solution & Result */}
                  {b.attemptedSolution && (
                    <div className="p-2.5 rounded-xl bg-prime-surfaceSubtle/60 border border-prime-borderSubtle text-xs space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-prime-textMuted font-bold block">
                        Attempted Solution:
                      </span>
                      <p className="text-prime-textSecondary leading-relaxed">
                        {b.attemptedSolution}
                      </p>
                      {b.result && (
                        <p className="text-emerald-400 text-xs font-semibold pt-0.5">
                          Result: {b.result}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="text-[11px] text-prime-textMuted font-mono">
                    Logged on {b.date}
                    {b.resolved && b.resolvedAt && (
                      <span className="text-emerald-400 ml-2">
                        • Resolved on {new Date(b.resolvedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-prime-borderSubtle">
                  <div className="flex items-center gap-2">
                    {!b.resolved ? (
                      <button
                        onClick={() => handleResolve(b.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/25 transition-all"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Mark Resolved</span>
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Resolved</span>
                      </span>
                    )}

                    <button
                      onClick={() => handleDelete(b.id)}
                      className="p-1.5 rounded-lg text-prime-textMuted hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all text-xs"
                      title="Delete Record"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Train Weakness Button */}
                  {!b.resolved && (
                    <button
                      onClick={() => handleTrainWeakness(b.category)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-500/15 text-orange-300 border border-orange-500/30 text-xs font-bold hover:bg-orange-500/25 transition-all"
                    >
                      <Flame className="h-3.5 w-3.5" />
                      <span>Train Weakness</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 rounded-2xl border border-prime-borderSubtle bg-prime-surface/40 p-6 space-y-3">
          <AlertTriangle className="h-8 w-8 text-prime-textMuted mx-auto" />
          <h3 className="text-sm font-bold text-prime-text">
            No bottlenecks recorded in this view
          </h3>
          <p className="text-xs text-prime-textMuted max-w-sm mx-auto">
            Honest diagnosis is the fastest route to improvement. Log when you feel resistance, procrastination, finishing anxiety, or technical limits.
          </p>
          <button
            onClick={() => {
              setEditingBottleneck(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-400 shadow-prime-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Audit Your First Bottleneck</span>
          </button>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <BottleneckModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingBottleneck(null);
          }}
          bottleneckToEdit={editingBottleneck}
          onSaved={(saved) => {
            onBottleneckSaved(saved);
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
