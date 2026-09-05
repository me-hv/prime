import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PocketGym } from "@/components/train/PocketGym";

export const metadata = {
  title: "Pocket Gym & Metronome | Train | PRIME",
  description: "Precision Web Audio Metronome and Cadence Gymnasium for rappers, songwriters, and producers.",
};

export default function PocketGymPage() {
  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-4xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          href="/train"
          className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-prime-textMuted hover:text-prime-text transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Training Ground</span>
        </Link>
      </div>

      <PocketGym initialBpm={90} />
    </div>
  );
}
