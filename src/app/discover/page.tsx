import * as React from "react";
import {
  getDiscoveryStats,
  getTodayStudyRecommendation,
  getReferences,
  getArtists,
  getStudySessions,
  getAlbumStudies,
  getListeningEntries,
} from "@/actions/discovery";
import { DiscoverHubClient } from "./DiscoverHubClient";

export const dynamic = "force-dynamic";

export default async function DiscoverPage() {
  const [
    stats,
    recommendation,
    references,
    artists,
    studies,
    albumStudies,
    listening,
  ] = await Promise.all([
    getDiscoveryStats(),
    getTodayStudyRecommendation(),
    getReferences(),
    getArtists(),
    getStudySessions(),
    getAlbumStudies(),
    getListeningEntries(50),
  ]);

  return (
    <DiscoverHubClient
      initialStats={stats}
      initialRecommendation={recommendation}
      initialReferences={references}
      initialArtists={artists}
      initialStudies={studies}
      initialAlbumStudies={albumStudies}
      initialListening={listening}
    />
  );
}
