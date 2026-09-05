import * as React from "react";
import { notFound } from "next/navigation";
import { getWritingDocument } from "@/actions/writings";
import { WritingEditor } from "@/components/create/WritingEditor";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function WritingEditorPage({ params }: PageProps) {
  const { id } = await params;
  const doc = await getWritingDocument(id);

  if (!doc) {
    notFound();
  }

  return <WritingEditor initialDocument={doc} />;
}
