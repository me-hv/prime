import * as React from "react";
import { getWritingDocuments } from "@/actions/writings";
import { getSongs } from "@/actions/songs";
import { getProjects } from "@/actions/projects";
import { getQuickCaptures } from "@/actions/captures";
import { CreateHubClient } from "./CreateHubClient";

export const dynamic = "force-dynamic";

export default async function CreatePage() {
  const [writings, songs, projects, captures] = await Promise.all([
    getWritingDocuments(),
    getSongs(),
    getProjects(),
    getQuickCaptures({ limit: 50 }),
  ]);

  return (
    <CreateHubClient
      initialWritings={writings}
      initialSongs={songs}
      initialProjects={projects}
      initialCaptures={captures}
    />
  );
}
