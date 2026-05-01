import { HTMLAttributes, forwardRef } from "react";
import { cn } from "../lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "outline";
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2",
          {
            "border-transparent bg-lime-400 text-black": variant === "default",
            "border-transparent bg-[var(--surface-raised)] text-[var(--text-primary)]":
              variant === "secondary",
            "border-transparent bg-green-600 text-white": variant === "success",
            "border-transparent bg-yellow-600 text-white":
              variant === "warning",
            "border-transparent bg-red-600 text-white": variant === "danger",
            "border-[var(--border)] text-[var(--text-primary)]":
              variant === "outline",
          },
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Badge.displayName = "Badge";
