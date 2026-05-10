import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "../lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-lime-400 text-black hover:bg-lime-500": variant === "default",
            "border border-[var(--border)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface-raised)]":
              variant === "outline",
            "hover:bg-[var(--surface-raised)] text-[var(--text-primary)]":
              variant === "ghost",
            "text-[var(--accent)] underline-offset-4 hover:underline":
              variant === "link",
            "bg-red-600 text-white hover:bg-red-700": variant === "destructive",
          },
          {
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-md px-3": size === "sm",
            "h-11 rounded-md px-8": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
