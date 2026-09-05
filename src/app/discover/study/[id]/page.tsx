import * as React from "react";
import { getReference, getReferences, getArtists } from "@/actions/discovery";
import { StudySessionClient } from "./StudySessionClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface StudyPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudyPage({ params }: StudyPageProps) {
  const { id } = await params;
  const [reference, references, artists] = await Promise.all([
    getReference(id),
    getReferences(),
    getArtists(),
  ]);

  if (!reference) {
    notFound();
  }

  return (
    <StudySessionClient
      reference={reference}
      references={references}
      artists={artists}
    />
  );
}
