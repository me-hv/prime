"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prime-gold/50 disabled:pointer-events-none disabled:opacity-40 select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-prime-text text-prime-bg hover:bg-white shadow-sm font-semibold",
        gold: "bg-prime-gold text-prime-bg hover:bg-prime-goldBright font-semibold shadow-prime-glow-gold",
        secondary:
          "bg-prime-surface text-prime-text border border-prime-border hover:bg-prime-cardHover hover:border-prime-borderHighlight",
        outline:
          "border border-prime-border bg-transparent text-prime-text hover:bg-prime-card hover:border-prime-borderHighlight",
        ghost:
          "text-prime-textSecondary hover:text-prime-text hover:bg-prime-cardHover/60",
        danger:
          "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 hover:border-rose-500/30",
        subtle:
          "bg-prime-card/80 text-prime-textSecondary hover:text-prime-text hover:bg-prime-card border border-prime-borderSubtle",
      },
      size: {
        sm: "h-8 px-3 text-xs gap-1.5",
        md: "h-9 px-4 text-sm gap-2",
        lg: "h-11 px-6 text-base gap-2.5",
        icon: "h-9 w-9 p-0",
        iconSm: "h-7 w-7 p-0",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
