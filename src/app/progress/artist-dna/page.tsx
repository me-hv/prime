import * as React from "react";
import { getArtistDNA } from "@/actions/dna";
import { ArtistDNAClient } from "./ArtistDNAClient";

export const dynamic = "force-dynamic";

export default async function ArtistDNAPage() {
  const dna = await getArtistDNA();

  return <ArtistDNAClient initialDNA={dna} />;
}
