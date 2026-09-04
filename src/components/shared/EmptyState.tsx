"use client";

import * as React from "react";
import { LucideIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  phaseBadge?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  icon: Icon = Sparkles,
  phaseBadge,
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondaryAction,
  className,
  children,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-prime-borderSubtle bg-gradient-to-b from-prime-card/90 to-prime-surface/80 p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[380px] shadow-prime-sm",
        className
      )}
    >
      {/* Background glow accent */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-prime-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* Icon frame */}
      <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-prime-border bg-prime-surface shadow-prime-sm">
        <Icon className="h-6 w-6 text-prime-gold" />
      </div>

      {phaseBadge && (
        <span className="mb-3 inline-flex items-center gap-1 rounded-full border border-prime-gold/20 bg-prime-gold/10 px-2.5 py-0.5 text-[11px] font-medium text-prime-gold font-mono">
          {phaseBadge}
        </span>
      )}

      <h3 className="text-xl font-bold tracking-tight text-prime-text sm:text-2xl max-w-md">
        {title}
      </h3>

      <p className="mt-2.5 text-sm text-prime-textSecondary max-w-lg leading-relaxed">
        {description}
      </p>

      {children && <div className="mt-6 w-full max-w-md">{children}</div>}

      {(actionLabel || secondaryLabel) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {actionLabel && (
            <Button
              variant="gold"
              onClick={onAction}
              className="px-5 shadow-prime-glow-gold"
            >
              {actionLabel}
            </Button>
          )}
          {secondaryLabel && (
            <Button
              variant="secondary"
              onClick={onSecondaryAction}
              className="px-5"
            >
              {secondaryLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
