import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral" | "mpower";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
  pulse?: boolean;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  success: "bg-[#0fa336]/15 text-[#00E676] border-[#0fa336]/30",
  warning: "bg-[#f4b400]/15 text-[#f4b400] border-[#f4b400]/30",
  danger: "bg-[#e22718]/15 text-[#ff6b6b] border-[#e22718]/30",
  info: "bg-[#0066b1]/15 text-[#81c4ff] border-[#0066b1]/30",
  neutral: "bg-[#1a1a1a] text-[#bbbbbb] border-[#3c3c3c]",
  mpower: "bg-[#0066b1] text-white border-[#1c69d4]",
};

const DOT_CLASSES: Record<BadgeVariant, string> = {
  success: "bg-[#00E676]",
  warning: "bg-[#f4b400]",
  danger: "bg-[#e22718]",
  info: "bg-[#0066b1]",
  neutral: "bg-[#7e7e7e]",
  mpower: "bg-white",
};

export function Badge({
  className,
  variant = "neutral",
  dot = false,
  pulse = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border text-[10px] font-mono font-bold uppercase tracking-wider",
        VARIANT_CLASSES[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            DOT_CLASSES[variant],
            pulse && "animate-pulse"
          )}
        />
      )}
      {children}
    </span>
  );
}
