"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
  ArtistData,
  ArtistReferenceData,
  StudyFocus,
  STUDY_FOCUS_CONFIGS,
  StudySessionData,
} from "@/lib/types";
import { createStudySession } from "@/actions/discovery";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Star,
  CheckCircle2,
} from "lucide-react";
import { StudyPracticeModal } from "./StudyPracticeModal";
import { cn } from "@/lib/utils";

interface StudySessionRunnerProps {
  references: ArtistReferenceData[];
  artists?: ArtistData[];
  initialReferenceId?: string;
  initialFocus?: StudyFocus;
  onFinished: (session: StudySessionData) => void;
  onCancel?: () => void;
}

export function StudySessionRunner({
  references,
  initialReferenceId,
  initialFocus = "CADENCE",
  onFinished,
  onCancel,
}: StudySessionRunnerProps) {
  // Reference & Focus selection
  const [selectedRefId, setSelectedRefId] = useState<string>(initialReferenceId || "");
  const [focus, setFocus] = useState<StudyFocus>(initialFocus);
  const [customFocus, setCustomFocus] = useState("");

  // Timer State (Timestamp-delta drift-proof)
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const startTimeRef = useRef<number>(Date.now());
  const accumulatedTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Form Breakdown Fields
  const [observations, setObservations] = useState("");
  const [techniques, setTechniques] = useState("");
  const [favoriteSection, setFavoriteSection] = useState("");
  const [whyItWorks, setWhyItWorks] = useState("");
  const [whatSurprisedMe, setWhatSurprisedMe] = useState("");
  const [whatILearned, setWhatILearned] = useState("");
  const [experimentIdea, setExperimentIdea] = useState("");
  const [takeaway, setTakeaway] = useState("");
  const [rating, setRating] = useState<number>(5);

  const [isSaving, setIsSaving] = useState(false);
  const [createdSession, setCreatedSession] = useState<StudySessionData | null>(null);
  const [practiceModalOpen, setPracticeModalOpen] = useState(false);

  // Selected Reference object
  const selectedRef = references.find((r) => r.id === selectedRefId);
  const focusConfig = STUDY_FOCUS_CONFIGS[focus] || STUDY_FOCUS_CONFIGS.FLOW;

  // Timer Effect
  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        const delta = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setSeconds(accumulatedTimeRef.current + delta);
      }, 500);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      accumulatedTimeRef.current = seconds;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, seconds]);

  const toggleTimer = () => setIsRunning((prev) => !prev);
  const resetTimer = () => {
    setIsRunning(false);
    accumulatedTimeRef.current = 0;
    setSeconds(0);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleSaveStudy = async () => {
    if (!observations.trim() && !whatILearned.trim() && !takeaway.trim()) {
      if (!confirm("Save study session without detailed notes?")) return;
    }

    setIsSaving(true);
    try {
      const session = await createStudySession({
        referenceId: selectedRefId || null,
        artistId: selectedRef?.artistId || null,
        focus,
        customFocus: customFocus.trim() || null,
        durationSeconds: seconds,
        observations: observations.trim() || null,
        techniques: techniques.trim() || null,
        favoriteSection: favoriteSection.trim() || null,
        whyItWorks: whyItWorks.trim() || null,
        whatSurprisedMe: whatSurprisedMe.trim() || null,
        whatILearned: whatILearned.trim() || null,
        experimentIdea: experimentIdea.trim() || null,
        takeaway: takeaway.trim() || null,
        rating,
      });

      setCreatedSession(session);
      onFinished(session);
    } catch (err) {
      console.error(err);
      alert("Failed to save study session.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner: Reference Context & Timestamp Timer */}
      <div className="rounded-2xl border border-sky-500/30 bg-gradient-to-r from-sky-950/40 via-prime-surface to-prime-surface p-5 shadow-prime-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Reference Selector / Title */}
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono tracking-wider uppercase bg-sky-500/20 text-sky-300 border border-sky-500/30">
                <Sparkles className="h-3 w-3" />
                Active Study Mode
              </span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${focusConfig.badgeClass}`}>
                {focusConfig.label}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <select
                value={selectedRefId}
                onChange={(e) => setSelectedRefId(e.target.value)}
                className="rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs sm:text-sm text-prime-text font-bold focus:outline-none focus:border-sky-500 max-w-md"
              >
                <option value="">-- Study without specific reference --</option>
                {references.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title} — {r.creator} ({r.type})
                  </option>
                ))}
              </select>

              {selectedRef?.url && (
                <a
                  href={selectedRef.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-semibold"
                >
                  <span>Open Track</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>

          {/* Drift-Proof Timer Controls */}
          <div className="flex items-center gap-3 shrink-0 bg-prime-surfaceSubtle/80 border border-prime-borderSubtle px-4 py-2.5 rounded-xl">
            <div className="font-mono text-2xl sm:text-3xl font-black text-prime-text tracking-wider tabular-nums">
              {formatTimer(seconds)}
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleTimer}
                className={cn(
                  "p-2 rounded-lg text-white font-bold transition-all shadow-prime-sm",
                  isRunning
                    ? "bg-amber-500 hover:bg-amber-400"
                    : "bg-sky-500 hover:bg-sky-400"
                )}
                title={isRunning ? "Pause Study Timer" : "Resume Timer"}
              >
                {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={resetTimer}
                className="p-2 rounded-lg bg-prime-surface border border-prime-borderSubtle text-prime-textMuted hover:text-prime-text"
                title="Reset Timer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Focus Area Pill Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-prime-text block">
          Select Study Focus Discipline:
        </label>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {(Object.keys(STUDY_FOCUS_CONFIGS) as StudyFocus[]).map((f) => {
            const cfg = STUDY_FOCUS_CONFIGS[f];
            const isSelected = focus === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFocus(f)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                  isSelected
                    ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-prime-sm font-bold"
                    : "bg-prime-surface/60 text-prime-textMuted hover:text-prime-text border border-prime-borderSubtle"
                )}
              >
                {cfg.label}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
          <p className="text-[11px] text-prime-textMuted italic">
            {focusConfig.description}
          </p>
          <input
            type="text"
            value={customFocus}
            onChange={(e) => setCustomFocus(e.target.value)}
            placeholder="Custom sub-focus tag (optional)..."
            className="rounded-lg bg-prime-surfaceSubtle border border-prime-borderSubtle px-2.5 py-1 text-[11px] text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-sky-500 max-w-xs"
          />
        </div>
      </div>

      {/* Structured Study Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left Column: What I Hear & Anatomy */}
        <div className="space-y-4">
          {/* Observations */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-prime-text flex items-center justify-between">
              <span>1. What Am I Listening For & Observing?</span>
              <span className="text-[10px] text-prime-textMuted font-normal">Primary Breakdown</span>
            </label>
            <textarea
              rows={4}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="e.g. The first 8 bars sit behind the beat with conversational pauses, then suddenly accelerate into triplets on bar 9..."
              className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle p-3 text-xs sm:text-sm text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-sky-500 leading-relaxed resize-none"
            />
          </div>

          {/* Specific Techniques Noticed */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-prime-text flex items-center justify-between">
              <span>2. Specific Techniques Noticed</span>
              <span className="text-[10px] text-prime-textMuted font-normal">Technical Identifiers</span>
            </label>
            <textarea
              rows={3}
              value={techniques}
              onChange={(e) => setTechniques(e.target.value)}
              placeholder="e.g. 4-syllable internal rhyme scheme, subtle vocal doubling on the 4th beat, pitch drop before chorus..."
              className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle p-3 text-xs sm:text-sm text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-sky-500 leading-relaxed resize-none"
            />
          </div>

          {/* Standout Section */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-prime-text flex items-center justify-between">
              <span>3. Standout Section / Timestamp</span>
              <span className="text-[10px] text-prime-textMuted font-normal">e.g. Verse 2 (1:45)</span>
            </label>
            <input
              type="text"
              value={favoriteSection}
              onChange={(e) => setFavoriteSection(e.target.value)}
              placeholder="e.g. Verse 2 opening 4 bars or Hook transition"
              className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs sm:text-sm text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Why It Works */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-prime-text flex items-center justify-between">
              <span>4. Why It Works (Sonic & Emotional Mechanics)</span>
              <span className="text-[10px] text-emerald-400 font-bold">Key Insight</span>
            </label>
            <textarea
              rows={3}
              value={whyItWorks}
              onChange={(e) => setWhyItWorks(e.target.value)}
              placeholder="e.g. Dynamic restraint builds tension so the drop feels twice as impactful without adding extra instruments..."
              className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle p-3 text-xs sm:text-sm text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-sky-500 leading-relaxed resize-none"
            />
          </div>
        </div>

        {/* Right Column: Key Takeaways & Experiment Ideas */}
        <div className="space-y-4">
          {/* What Surprised Me */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-prime-text flex items-center justify-between">
              <span>5. What Surprised Me?</span>
              <span className="text-[10px] text-prime-textMuted font-normal">Subverted Expectations</span>
            </label>
            <textarea
              rows={3}
              value={whatSurprisedMe}
              onChange={(e) => setWhatSurprisedMe(e.target.value)}
              placeholder="e.g. The kick drum completely drops out during the most aggressive rhyme sequence..."
              className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle p-3 text-xs sm:text-sm text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-sky-500 leading-relaxed resize-none"
            />
          </div>

          {/* What I Learned */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-prime-text flex items-center justify-between">
              <span>6. What Did I Learn?</span>
              <span className="text-[10px] text-sky-400 font-bold">Artistic Lesson</span>
            </label>
            <textarea
              rows={2}
              value={whatILearned}
              onChange={(e) => setWhatILearned(e.target.value)}
              placeholder="e.g. Flow switches don't need to be complex; shifting from on-beat to behind-the-beat creates instant groove."
              className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle p-3 text-xs sm:text-sm text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-sky-500 leading-relaxed resize-none"
            />
          </div>

          {/* Core Takeaway Summary */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-prime-text flex items-center justify-between">
              <span>7. Core Rule / 1-Sentence Takeaway</span>
              <span className="text-[10px] text-prime-textMuted font-normal">Actionable Maxim</span>
            </label>
            <input
              type="text"
              value={takeaway}
              onChange={(e) => setTakeaway(e.target.value)}
              placeholder="e.g. Constraint breeds pocket mastery."
              className="w-full rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle px-3 py-2 text-xs sm:text-sm text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* What I Want To Experiment With */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-prime-text flex items-center justify-between text-amber-400">
              <span>8. What I Want To Experiment With in My Music</span>
              <span className="text-[10px] text-amber-400 font-bold font-mono">STUDY → PRACTICE</span>
            </label>
            <textarea
              rows={2}
              value={experimentIdea}
              onChange={(e) => setExperimentIdea(e.target.value)}
              placeholder="e.g. Write a 16-bar verse where bar 1-4 is monotonic, bar 5-8 switches cadence, and bar 9-16 doubles rhyme density."
              className="w-full rounded-xl bg-amber-500/5 border border-amber-500/25 p-3 text-xs sm:text-sm text-prime-text placeholder:text-prime-textMuted/40 focus:outline-none focus:border-amber-500 leading-relaxed resize-none"
            />
          </div>

          {/* Rating */}
          <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-prime-surfaceSubtle border border-prime-borderSubtle">
            <span className="text-xs font-semibold text-prime-text">
              Study Impact Rating:
            </span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={cn(
                    "p-1 transition-colors",
                    star <= rating ? "text-amber-400" : "text-prime-textMuted/40"
                  )}
                >
                  <Star className={cn("h-4 w-4", star <= rating && "fill-current")} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-prime-borderSubtle">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-prime-textMuted hover:text-prime-text"
          >
            Cancel Study Mode
          </button>
        ) : <div />}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveStudy}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 text-white text-xs sm:text-sm font-bold hover:bg-sky-400 disabled:opacity-50 shadow-prime-md transition-all active:scale-[0.98]"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{isSaving ? "Saving..." : "Complete & Save Study"}</span>
          </button>
        </div>
      </div>

      {/* Practice Conversion Modal */}
      {createdSession && (
        <StudyPracticeModal
          isOpen={practiceModalOpen}
          onClose={() => setPracticeModalOpen(false)}
          studySessionId={createdSession.id}
          defaultObservation={
            createdSession.experimentIdea ||
            createdSession.whatILearned ||
            createdSession.observations ||
            ""
          }
          focusTitle={focusConfig.label}
        />
      )}
    </div>
  );
}
