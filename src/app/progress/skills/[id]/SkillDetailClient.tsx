"use client";

import * as React from "react";
import { SkillDetailData } from "@/lib/types";
import { SkillDetailView } from "@/components/progress/skills/SkillDetailView";

interface SkillDetailClientProps {
  data: SkillDetailData;
}

export function SkillDetailClient({ data }: SkillDetailClientProps) {
  return <SkillDetailView data={data} />;
}
