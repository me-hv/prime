import { redirect } from "next/navigation";
import { createProject } from "@/actions/projects";
import { ProjectType } from "@/lib/types";

interface PageProps {
  searchParams: Promise<{ title?: string; type?: string }>;
}

export const dynamic = "force-dynamic";

export default async function NewProjectPage({ searchParams }: PageProps) {
  const { title, type } = await searchParams;
  const projectType =
    type &&
    ["EP", "ALBUM", "BEAT_TAPE", "MIXTAPE", "CONCEPT_SUITE"].includes(type)
      ? (type as ProjectType)
      : "EP";

  const project = await createProject({
    title: title || "Untitled Project",
    type: projectType,
    status: "IN_PROGRESS",
  });

  redirect(`/create/projects/${project.id}`);
}
