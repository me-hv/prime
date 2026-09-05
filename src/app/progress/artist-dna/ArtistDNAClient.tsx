"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Dna } from "lucide-react";
import { ArtistDNAData } from "@/lib/types";
import { ArtistIdentityStatementEditor } from "@/components/progress/dna/ArtistIdentityStatementEditor";
import { CreativeValuesEditor } from "@/components/progress/dna/CreativeValuesEditor";
import { CreativePreferencesEditor } from "@/components/progress/dna/CreativePreferencesEditor";
import { ObservedPatternsView } from "@/components/progress/dna/ObservedPatternsView";
import { ArtistDimensionsView } from "@/components/progress/dna/ArtistDimensionsView";
import { BeforeVsNowCard } from "@/components/progress/dna/BeforeVsNowCard";
import { ArtistEvolutionTimeline } from "@/components/progress/dna/ArtistEvolutionTimeline";

interface ArtistDNAClientProps {
  initialDNA: ArtistDNAData;
}

export function ArtistDNAClient({ initialDNA }: ArtistDNAClientProps) {
  return (
    <div className="space-y-6 pb-16 animate-fade-in max-w-6xl mx-auto">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-prime-borderSubtle">
        <div>
          <Link
            href="/progress"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-prime-textMuted hover:text-prime-text mb-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Progress Dashboard</span>
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <Dna className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-purple-400">
              Identity & Evolution Blueprint
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-prime-text">
            ARTIST DNA
          </h1>
          <p className="text-xs sm:text-sm text-prime-textMuted mt-0.5">
            Cross-sectional identity contrasting your explicit vision with PRIME&apos;s verified observed patterns.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-purple-500/15 text-purple-300 border border-purple-500/30">
            Evidence Layer Active
          </span>
        </div>
      </div>

      {/* 1. Artist Identity Statement (User-Authored) */}
      <ArtistIdentityStatementEditor
        initialStatement={initialDNA.identityStatement}
      />

      {/* 2. User-Authored Creative Values */}
      <CreativeValuesEditor initialValues={initialDNA.creativeValues} />

      {/* 3. User-Authored Creative Preferences & Profile */}
      <CreativePreferencesEditor dna={initialDNA} />

      {/* 4. PRIME Observed Patterns & Signals (Deterministic Evidence) */}
      <ObservedPatternsView patterns={initialDNA.observedPatterns} />

      {/* 5. 6 Descriptive Dimensions */}
      <ArtistDimensionsView dimensions={initialDNA.dimensions} />

      {/* 6. Before vs Now Comparison */}
      <BeforeVsNowCard beforeVsNow={initialDNA.beforeVsNow} />

      {/* 7. Unified Artist Evolution Timeline */}
      <ArtistEvolutionTimeline timeline={initialDNA.evolutionTimeline} />
    </div>
  );
}
