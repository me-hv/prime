import { redirect } from "next/navigation";
import { createSong } from "@/actions/songs";

interface PageProps {
  searchParams: Promise<{ title?: string; concept?: string; genre?: string }>;
}

export const dynamic = "force-dynamic";

export default async function NewSongPage({ searchParams }: PageProps) {
  const { title, concept, genre } = await searchParams;

  const song = await createSong({
    title: title || "Untitled Song",
    concept: concept || undefined,
    genre: genre || undefined,
    status: "IDEA",
    withDefaultSections: true,
  });

  redirect(`/create/songs/${song.id}`);
}
