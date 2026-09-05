import { redirect } from "next/navigation";
import { createWritingDocument } from "@/actions/writings";
import { WritingType } from "@/lib/types";

interface PageProps {
  searchParams: Promise<{ type?: string; title?: string }>;
}

export const dynamic = "force-dynamic";

export default async function NewWritingPage({ searchParams }: PageProps) {
  const { type, title } = await searchParams;
  const docType =
    type &&
    ["VERSE", "HOOK", "BARS_16", "FREE_WRITE", "CONCEPT", "POEM"].includes(
      type
    )
      ? (type as WritingType)
      : "VERSE";

  const doc = await createWritingDocument({
    title: title || "Untitled Draft",
    type: docType,
    content: "",
  });

  redirect(`/create/write/${doc.id}`);
}
