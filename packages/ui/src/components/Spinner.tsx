import { Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

export interface SpinnerProps {
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function Spinner({ size = "default", className }: SpinnerProps) {
  return (
    <Loader2
      className={cn(
        "animate-spin text-slate-600",
        {
          "h-4 w-4": size === "sm",
          "h-6 w-6": size === "default",
          "h-8 w-8": size === "lg",
        },
        className,
      )}
    />
  );
}
