import * as React from "react";
import { getSkillDetail } from "@/actions/progress";
import { SkillDetailClient } from "./SkillDetailClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface SkillDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SkillDetailPage({
  params,
}: SkillDetailPageProps) {
  const { id } = await params;
  const data = await getSkillDetail(id);

  if (!data) {
    notFound();
  }

  return <SkillDetailClient data={data} />;
}
