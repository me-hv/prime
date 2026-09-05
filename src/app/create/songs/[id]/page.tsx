import * as React from "react";
import { notFound } from "next/navigation";
import { getSong } from "@/actions/songs";
import { getProjects } from "@/actions/projects";
import { SongEditor } from "@/components/create/SongEditor";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function SongEditorPage({ params }: PageProps) {
  const { id } = await params;
  const [song, projects] = await Promise.all([getSong(id), getProjects()]);

  if (!song) {
    notFound();
  }

  return <SongEditor initialSong={song} availableProjects={projects} />;
}
