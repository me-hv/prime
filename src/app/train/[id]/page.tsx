import * as React from "react";
import { notFound } from "next/navigation";
import { getExercise } from "@/actions/training";
import { PracticeArenaClient } from "./PracticeArenaClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const exercise = await getExercise(id);

  if (!exercise) {
    return {
      title: "Exercise Not Found | PRIME",
    };
  }

  return {
    title: `${exercise.title} | Train | PRIME`,
    description: exercise.description,
  };
}

export default async function ExercisePracticePage({ params }: PageProps) {
  const { id } = await params;
  const exercise = await getExercise(id);

  if (!exercise) {
    notFound();
  }

  return <PracticeArenaClient exercise={exercise} />;
}
