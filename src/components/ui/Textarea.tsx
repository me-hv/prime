import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-xs font-medium text-prime-textSecondary">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            "flex min-h-[90px] w-full rounded-lg border border-prime-border bg-prime-surface px-3.5 py-2.5 text-sm text-prime-text placeholder:text-prime-textMuted/60 transition-colors focus-visible:outline-none focus-visible:border-prime-gold focus-visible:ring-1 focus-visible:ring-prime-gold/40 disabled:cursor-not-allowed disabled:opacity-50 resize-y",
            error && "border-rose-500 focus-visible:border-rose-500 focus-visible:ring-rose-500/30",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-rose-400">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
