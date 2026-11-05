import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rect" | "circle" | "text";
}

export function Skeleton({
  className,
  variant = "rect",
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse bg-gradient-to-r from-[#1a1a1a] via-[#262626] to-[#1a1a1a] border border-[#262626]/60",
        variant === "circle" && "rounded-full",
        variant === "rect" && "rounded-lg",
        variant === "text" && "rounded h-4 w-full",
        className
      )}
      {...props}
    />
  );
}
