import { HTMLAttributes, forwardRef } from "react";
import { cn } from "../lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        ref={ref}
        {...props}
      />
    );
  },
);

CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  return (
    <h3
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      className={cn("text-sm text-slate-500", className)}
      ref={ref}
      {...props}
    />
  );
});

CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return <div className={cn("p-6 pt-0", className)} ref={ref} {...props} />;
  },
);

CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn("flex items-center p-6 pt-0", className)}
        ref={ref}
        {...props}
      />
    );
  },
);

CardFooter.displayName = "CardFooter";
