import { HTMLAttributes } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "../lib/utils";

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  value: string | number;
  label: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  accent?: boolean;
}

export function StatCard({
  value,
  label,
  trend,
  accent = false,
  className,
  ...props
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border border-[var(--border)] p-4",
        accent
          ? "bg-[var(--accent)] border-transparent"
          : "bg-[var(--surface)]",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "text-3xl font-bold",
          accent ? "text-black" : "text-[var(--text-primary)]",
        )}
      >
        {value}
      </span>
      <div className="mt-1 flex items-center justify-between">
        <span
          className={cn(
            "text-sm",
            accent ? "text-black/70" : "text-[var(--text-muted)]",
          )}
        >
          {label}
        </span>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 text-sm",
              trend.isPositive
                ? accent
                  ? "text-black"
                  : "text-green-500"
                : accent
                  ? "text-black"
                  : "text-red-500",
            )}
          >
            {trend.isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
