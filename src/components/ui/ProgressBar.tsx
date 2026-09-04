"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
  showLabel?: boolean;
  color?: "gold" | "cyan" | "purple" | "emerald" | "default";
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  color = "gold",
  className,
  ...props
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colorStyles = {
    gold: "bg-gradient-to-r from-prime-goldDark to-prime-gold shadow-[0_0_12px_rgba(229,169,60,0.3)]",
    cyan: "bg-gradient-to-r from-sky-600 to-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.3)]",
    purple: "bg-gradient-to-r from-purple-600 to-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.3)]",
    emerald: "bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]",
    default: "bg-prime-text",
  };

  return (
    <div className={cn("w-full space-y-1.5", className)} {...props}>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-prime-surface border border-prime-borderSubtle">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            colorStyles[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center text-[11px] text-prime-textMuted font-mono">
          <span>{Math.round(percentage)}% complete</span>
          <span>{value} / {max}</span>
        </div>
      )}
    </div>
  );
}
