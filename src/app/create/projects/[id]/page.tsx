import * as React from "react";
import { notFound } from "next/navigation";
import { getProject } from "@/actions/projects";
import { getSongs } from "@/actions/songs";
import { ProjectEditor } from "@/components/create/ProjectEditor";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function ProjectEditorPage({ params }: PageProps) {
  const { id } = await params;
  const [project, songs] = await Promise.all([getProject(id), getSongs()]);

  if (!project) {
    notFound();
  }

  return <ProjectEditor initialProject={project} availableSongs={songs} />;
}
