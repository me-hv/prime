"use client";

import * as React from "react";
import { useState } from "react";
import {
  BarChart3,
  PenTool,
  Clock,
  Compass,
  BookOpen,
} from "lucide-react";
import { CreativeOutputTimeSeriesPoint } from "@/lib/types";
import { formatMinutes } from "@/lib/utils";

interface CreativeOutputSectionProps {
  timeSeries: CreativeOutputTimeSeriesPoint[];
}

export function CreativeOutputSection({
  timeSeries,
}: CreativeOutputSectionProps) {
  const [hoveredPoint, setHoveredPoint] =
    useState<CreativeOutputTimeSeriesPoint | null>(null);

  // Calculate totals
  const totalWriting = timeSeries.reduce((s, p) => s + p.writingMinutes, 0);
  const totalPractice = timeSeries.reduce((s, p) => s + p.practiceMinutes, 0);
  const totalStudy = timeSeries.reduce((s, p) => s + p.studyMinutes, 0);
  const totalReflection = timeSeries.reduce(
    (s, p) => s + p.reflectionMinutes,
    0
  );
  const totalOverall = totalWriting + totalPractice + totalStudy + totalReflection;

  const maxTotalMinutes = Math.max(
    1,
    ...timeSeries.map((p) => p.totalMinutes)
  );

  return (
    <div className="rounded-2xl border border-prime-borderSubtle bg-prime-card/90 p-5 sm:p-6 shadow-prime-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-prime-borderSubtle">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold tracking-tight text-prime-text uppercase">
              Creative Output Trend
            </h3>
          </div>
          <p className="text-xs text-prime-textMuted mt-0.5">
            Time allocated across writing, training, listening studies, and reflection.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Writing
          </span>
          <span className="flex items-center gap-1.5 text-orange-400">
            <span className="h-2 w-2 rounded-full bg-orange-400" />
            Practice
          </span>
          <span className="flex items-center gap-1.5 text-sky-400">
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            Study
          </span>
          <span className="flex items-center gap-1.5 text-indigo-400">
            <span className="h-2 w-2 rounded-full bg-indigo-400" />
            Reflection
          </span>
        </div>
      </div>

      {/* Interactive Bar Chart Visualization */}
      <div className="space-y-2">
        <div className="h-44 flex items-end gap-1 sm:gap-2 pt-6 pb-2 px-1 relative">
          {timeSeries.map((point) => {
            const heightPct = Math.max(
              4,
              Math.round((point.totalMinutes / maxTotalMinutes) * 100)
            );

            const isHovered = hoveredPoint?.date === point.date;

            // Compute sub-percentages
            const wPct =
              point.totalMinutes > 0
                ? (point.writingMinutes / point.totalMinutes) * 100
                : 0;
            const pPct =
              point.totalMinutes > 0
                ? (point.practiceMinutes / point.totalMinutes) * 100
                : 0;
            const sPct =
              point.totalMinutes > 0
                ? (point.studyMinutes / point.totalMinutes) * 100
                : 0;
            const rPct =
              point.totalMinutes > 0
                ? (point.reflectionMinutes / point.totalMinutes) * 100
                : 0;

            return (
              <div
                key={point.date}
                className="flex-1 flex flex-col justify-end h-full group cursor-pointer relative"
                onMouseEnter={() => setHoveredPoint(point)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {/* Bar Stack */}
                <div
                  className={`w-full rounded-t overflow-hidden flex flex-col justify-end transition-all ${
                    isHovered
                      ? "ring-2 ring-emerald-400 ring-offset-1 ring-offset-prime-surface scale-105"
                      : "opacity-85 hover:opacity-100"
                  }`}
                  style={{ height: `${heightPct}%` }}
                >
                  {point.reflectionMinutes > 0 && (
                    <div
                      className="bg-indigo-500 transition-all"
                      style={{ height: `${rPct}%` }}
                      title={`Reflection: ${point.reflectionMinutes}m`}
                    />
                  )}
                  {point.studyMinutes > 0 && (
                    <div
                      className="bg-sky-400 transition-all"
                      style={{ height: `${sPct}%` }}
                      title={`Study: ${point.studyMinutes}m`}
                    />
                  )}
                  {point.practiceMinutes > 0 && (
                    <div
                      className="bg-orange-400 transition-all"
                      style={{ height: `${pPct}%` }}
                      title={`Practice: ${point.practiceMinutes}m`}
                    />
                  )}
                  {point.writingMinutes > 0 && (
                    <div
                      className="bg-amber-400 transition-all"
                      style={{ height: `${wPct}%` }}
                      title={`Writing: ${point.writingMinutes}m`}
                    />
                  )}
                  {point.totalMinutes === 0 && (
                    <div className="bg-prime-borderSubtle h-full w-full" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Hover inspection tooltip */}
        <div className="h-6 flex items-center justify-between text-xs font-mono text-prime-textMuted px-2 bg-prime-surface/60 rounded-lg">
          {hoveredPoint ? (
            <>
              <span className="text-prime-text font-bold">
                {hoveredPoint.label}
              </span>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-amber-400">
                  Writing: {hoveredPoint.writingMinutes}m
                </span>
                <span className="text-orange-400">
                  Practice: {hoveredPoint.practiceMinutes}m
                </span>
                <span className="text-sky-400">
                  Study: {hoveredPoint.studyMinutes}m
                </span>
                <span className="text-indigo-400">
                  Reflect: {hoveredPoint.reflectionMinutes}m
                </span>
                <span className="text-prime-text font-bold">
                  Total: {formatMinutes(hoveredPoint.totalMinutes)}
                </span>
              </div>
            </>
          ) : (
            <span className="text-[11px] text-prime-textMuted">
              Hover over any point to inspect volume breakdown
            </span>
          )}
        </div>
      </div>

      {/* Aggregate Discipline Distribution */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        {/* Writing */}
        <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/70 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 text-amber-400 font-bold">
              <PenTool className="h-3.5 w-3.5" />
              Writing
            </span>
            <span className="text-prime-text font-bold">
              {totalOverall > 0
                ? Math.round((totalWriting / totalOverall) * 100)
                : 0}
              %
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-prime-surface overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full"
              style={{
                width: `${
                  totalOverall > 0
                    ? (totalWriting / totalOverall) * 100
                    : 0
                }%`,
              }}
            />
          </div>
          <p className="text-[11px] font-mono text-prime-textMuted">
            {formatMinutes(totalWriting)} total
          </p>
        </div>

        {/* Practice */}
        <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/70 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 text-orange-400 font-bold">
              <Clock className="h-3.5 w-3.5" />
              Practice
            </span>
            <span className="text-prime-text font-bold">
              {totalOverall > 0
                ? Math.round((totalPractice / totalOverall) * 100)
                : 0}
              %
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-prime-surface overflow-hidden">
            <div
              className="h-full bg-orange-400 rounded-full"
              style={{
                width: `${
                  totalOverall > 0
                    ? (totalPractice / totalOverall) * 100
                    : 0
                }%`,
              }}
            />
          </div>
          <p className="text-[11px] font-mono text-prime-textMuted">
            {formatMinutes(totalPractice)} total
          </p>
        </div>

        {/* Study */}
        <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/70 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 text-sky-400 font-bold">
              <Compass className="h-3.5 w-3.5" />
              Study
            </span>
            <span className="text-prime-text font-bold">
              {totalOverall > 0
                ? Math.round((totalStudy / totalOverall) * 100)
                : 0}
              %
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-prime-surface overflow-hidden">
            <div
              className="h-full bg-sky-400 rounded-full"
              style={{
                width: `${
                  totalOverall > 0
                    ? (totalStudy / totalOverall) * 100
                    : 0
                }%`,
              }}
            />
          </div>
          <p className="text-[11px] font-mono text-prime-textMuted">
            {formatMinutes(totalStudy)} total
          </p>
        </div>

        {/* Reflection */}
        <div className="rounded-xl border border-prime-borderSubtle bg-prime-surface/70 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 text-indigo-400 font-bold">
              <BookOpen className="h-3.5 w-3.5" />
              Reflection
            </span>
            <span className="text-prime-text font-bold">
              {totalOverall > 0
                ? Math.round((totalReflection / totalOverall) * 100)
                : 0}
              %
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-prime-surface overflow-hidden">
            <div
              className="h-full bg-indigo-400 rounded-full"
              style={{
                width: `${
                  totalOverall > 0
                    ? (totalReflection / totalOverall) * 100
                    : 0
                }%`,
              }}
            />
          </div>
          <p className="text-[11px] font-mono text-prime-textMuted">
            {formatMinutes(totalReflection)} total
          </p>
        </div>
      </div>
    </div>
  );
}
