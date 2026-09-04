import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs font-medium border transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "border-prime-border bg-prime-surface text-prime-textSecondary",
        gold:
          "border-prime-gold/30 bg-prime-gold/10 text-prime-gold",
        writing:
          "border-amber-500/20 bg-amber-500/10 text-amber-300",
        production:
          "border-purple-500/20 bg-purple-500/10 text-purple-300",
        recording:
          "border-rose-500/20 bg-rose-500/10 text-rose-300",
        listening:
          "border-sky-500/20 bg-sky-500/10 text-sky-300",
        reading:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
        practice:
          "border-orange-500/20 bg-orange-500/10 text-orange-300",
        reflection:
          "border-indigo-500/20 bg-indigo-500/10 text-indigo-300",
        success:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
        outline:
          "border-prime-borderSubtle bg-transparent text-prime-textMuted",
      },
      size: {
        sm: "px-1.5 py-0.5 text-[10px]",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
