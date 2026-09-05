"use client";

import * as React from "react";
import {
  ArtistData,
  ArtistReferenceData,
} from "@/lib/types";
import { StudySessionRunner } from "@/components/discover/StudySessionRunner";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface StudySessionClientProps {
  reference: ArtistReferenceData;
  references: ArtistReferenceData[];
  artists: ArtistData[];
}

export function StudySessionClient({
  reference,
  references,
  artists,
}: StudySessionClientProps) {
  const router = useRouter();

  const handleFinished = () => {
    router.push("/discover?tab=vault");
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* Back button */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 text-xs font-semibold text-prime-textMuted hover:text-prime-text transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Discover Study Vault</span>
        </Link>
      </div>

      <div className="rounded-2xl border border-sky-500/30 bg-prime-surface p-6 shadow-prime-lg">
        <StudySessionRunner
          references={references}
          artists={artists}
          initialReferenceId={reference.id}
          initialFocus="CADENCE"
          onFinished={handleFinished}
          onCancel={() => router.push("/discover")}
        />
      </div>
    </div>
  );
}
