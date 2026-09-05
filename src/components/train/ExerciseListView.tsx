"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  Flame,
  Activity,
  Mic2,
  Sparkles,
  BookOpen,
  Sliders,
  Headphones,
  RotateCcw,
} from "lucide-react";
import {
  ExerciseData,
} from "@/lib/types";
import { ExerciseCard } from "./ExerciseCard";
import { cn } from "@/lib/utils";

interface ExerciseListViewProps {
  exercises: ExerciseData[];
  onStartExercise?: (exercise: ExerciseData) => void;
  className?: string;
}

const CATEGORIES: { id: string; label: string; icon: React.ElementType }[] = [
  { id: "ALL", label: "All Disciplines", icon: SlidersHorizontal },
  { id: "FLOW", label: "Flow & Cadence", icon: Activity },
  { id: "WRITING", label: "Writing Sprints", icon: Flame },
  { id: "RAP", label: "Rap Delivery", icon: Mic2 },
  { id: "RHYME", label: "Rhyme Schemes", icon: Sparkles },
  { id: "FREESTYLE", label: "Freestyle & Improv", icon: Mic2 },
  { id: "STORYTELLING", label: "Storytelling", icon: BookOpen },
  { id: "VOCABULARY", label: "Vocabulary", icon: BookOpen },
  { id: "PRODUCTION", label: "Production", icon: Sliders },
  { id: "EAR_TRAINING", label: "Ear Training", icon: Headphones },
];

export function ExerciseListView({
  exercises,
  onStartExercise,
  className,
}: ExerciseListViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState("ALL");
  const [selectedDuration, setSelectedDuration] = useState("ALL");

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      // Category filter
      if (selectedCategory !== "ALL" && ex.category !== selectedCategory) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== "ALL" && ex.difficulty !== selectedDifficulty) {
        return false;
      }

      // Duration filter
      if (selectedDuration !== "ALL") {
        if (selectedDuration === "QUICK" && ex.estimatedDuration > 5) return false;
        if (selectedDuration === "MEDIUM" && (ex.estimatedDuration <= 5 || ex.estimatedDuration > 15)) return false;
        if (selectedDuration === "DEEP" && ex.estimatedDuration <= 15) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = ex.title.toLowerCase().includes(q);
        const inDesc = ex.description.toLowerCase().includes(q);
        const inPrompt = ex.starterPrompt?.toLowerCase().includes(q) || false;
        const inConstraints = ex.constraints?.toLowerCase().includes(q) || false;
        const inSkills = ex.skills?.some((s) => s.name.toLowerCase().includes(q)) || false;

        if (!inTitle && !inDesc && !inPrompt && !inConstraints && !inSkills) {
          return false;
        }
      }

      return true;
    });
  }, [exercises, selectedCategory, selectedDifficulty, selectedDuration, searchQuery]);

  const hasActiveFilters =
    selectedCategory !== "ALL" ||
    selectedDifficulty !== "ALL" ||
    selectedDuration !== "ALL" ||
    searchQuery.trim().length > 0;

  const resetFilters = () => {
    setSelectedCategory("ALL");
    setSelectedDifficulty("ALL");
    setSelectedDuration("ALL");
    setSearchQuery("");
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Search & Secondary Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-prime-textMuted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search drills by flow, rhyme, topic, keywords, or skills..."
            className="w-full rounded-xl bg-prime-surface border border-prime-borderSubtle pl-10 pr-9 py-2.5 text-xs text-prime-text placeholder:text-prime-textMuted/60 focus:outline-none focus:border-orange-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-prime-textMuted hover:text-prime-text"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Difficulty Filter */}
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="rounded-xl bg-prime-surface border border-prime-borderSubtle px-3 py-2.5 text-xs text-prime-text focus:outline-none focus:border-orange-500/50"
        >
          <option value="ALL">All Difficulties</option>
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
          <option value="MASTER">Master</option>
        </select>

        {/* Duration Filter */}
        <select
          value={selectedDuration}
          onChange={(e) => setSelectedDuration(e.target.value)}
          className="rounded-xl bg-prime-surface border border-prime-borderSubtle px-3 py-2.5 text-xs text-prime-text focus:outline-none focus:border-orange-500/50"
        >
          <option value="ALL">All Durations</option>
          <option value="QUICK">Quick (≤ 5 mins)</option>
          <option value="MEDIUM">Standard (6 - 15 mins)</option>
          <option value="DEEP">Deep Work (15+ mins)</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-prime-surfaceSubtle hover:bg-prime-surface text-prime-textMuted hover:text-prime-text border border-prime-borderSubtle text-xs transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const Icon = cat.icon;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap",
                isSelected
                  ? "bg-orange-500/15 text-orange-300 border border-orange-500/40 shadow-prime-sm"
                  : "bg-prime-surface text-prime-textSecondary hover:text-prime-text border border-prime-borderSubtle"
              )}
            >
              <Icon className="h-3 w-3" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-mono text-prime-textMuted">
        <span>
          Showing <strong>{filteredExercises.length}</strong> drill{filteredExercises.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Exercise Cards Grid */}
      {filteredExercises.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onStart={onStartExercise}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-prime-borderSubtle bg-prime-surface p-12 text-center space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto">
            <Search className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-prime-text">No drills match your filter</h3>
            <p className="text-xs text-prime-textMuted mt-1 max-w-sm mx-auto">
              Try adjusting your category, difficulty level, or search keywords.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-orange-500/15 hover:bg-orange-500 text-orange-300 hover:text-black border border-orange-500/30 text-xs font-bold transition-all"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
