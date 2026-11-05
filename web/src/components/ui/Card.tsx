import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  mStripe?: boolean;
  interactive?: boolean;
}

export function Card({
  className,
  mStripe = false,
  interactive = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "relative bg-[#141414] border border-[#262626] rounded-xl overflow-hidden shadow-lg",
        interactive && "hover:border-[#0066b1] transition-all duration-150",
        className
      )}
      {...props}
    >
      {mStripe && (
        <div className="h-1 w-full flex" aria-hidden="true">
          <div className="h-full w-1/3 bg-[#0066b1]" />
          <div className="h-full w-1/3 bg-[#1c69d4]" />
          <div className="h-full w-1/3 bg-[#e22718]" />
        </div>
      )}
      {children}
    </div>
  );
}
