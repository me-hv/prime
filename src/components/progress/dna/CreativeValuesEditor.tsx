"use client";

import * as React from "react";
import { useState } from "react";
import { Sparkles, Plus, X, Check } from "lucide-react";
import { updateArtistDNA } from "@/actions/dna";

interface CreativeValuesEditorProps {
  initialValues: string[];
}

const PRESET_VALUES = [
  "Authenticity",
  "Technical Skill",
  "Storytelling",
  "Emotional Honesty",
  "Originality",
  "Craftsmanship",
  "Consistency",
  "Finishing",
  "Performance",
  "Experimentation",
  "Lyrical Density",
  "Conceptual Rigor",
];

export function CreativeValuesEditor({
  initialValues,
}: CreativeValuesEditorProps) {
  const [values, setValues] = useState<string[]>(initialValues);
  const [customInput, setCustomInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleValue = async (val: string) => {
    let next: string[];
    if (values.includes(val)) {
      next = values.filter((v) => v !== val);
    } else {
      next = [...values, val];
    }
    setValues(next);
    await persistValues(next);
  };

  const addCustomValue = async () => {
    const trimmed = customInput.trim();
    if (!trimmed || values.includes(trimmed)) return;
    const next = [...values, trimmed];
    setValues(next);
    setCustomInput("");
    await persistValues(next);
  };

  const persistValues = async (newValues: string[]) => {
    setIsSaving(true);
    try {
      await updateArtistDNA({ creativeValues: newValues });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (e) {
      console.error("Failed to update creative values:", e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-prime-borderSubtle bg-prime-card/90 p-5 sm:p-6 shadow-prime-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-prime-borderSubtle">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-prime-text uppercase flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            My Creative Values
          </h3>
          <p className="text-xs text-prime-textMuted mt-0.5">
            What principles matter most to you as an artist? (User-Authored)
          </p>
        </div>

        {savedSuccess && (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <Check className="h-3 w-3" /> Saved
          </span>
        )}
      </div>

      {/* Value Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {PRESET_VALUES.map((val) => {
          const isSelected = values.includes(val);
          return (
            <button
              key={val}
              onClick={() => toggleValue(val)}
              disabled={isSaving}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm"
                  : "bg-prime-surface/70 text-prime-textMuted hover:text-prime-text border border-prime-borderSubtle/60"
              }`}
            >
              {val}
            </button>
          );
        })}

        {/* Custom Values */}
        {values
          .filter((v) => !PRESET_VALUES.includes(v))
          .map((val) => (
            <span
              key={val}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40"
            >
              <span>{val}</span>
              <button
                onClick={() => toggleValue(val)}
                className="hover:text-rose-400 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
      </div>

      {/* Add Custom Value Input */}
      <div className="flex items-center gap-2 max-w-sm pt-2">
        <input
          type="text"
          placeholder="Add custom creative value..."
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustomValue();
            }
          }}
          className="flex-1 px-3 py-1.5 rounded-xl bg-prime-surface border border-prime-borderSubtle text-xs text-prime-text focus:outline-none focus:border-purple-500/50"
        />
        <button
          onClick={addCustomValue}
          disabled={!customInput.trim() || isSaving}
          className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-bold font-mono transition-all disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
