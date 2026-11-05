import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-12 px-6 border border-dashed border-[#3c3c3c] bg-[#141414]/60 rounded-xl",
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-black border border-[#262626] flex items-center justify-center text-[#0066b1] mb-4 shadow-inner">
        {icon}
      </div>

      <h3 className="text-sm font-bold uppercase tracking-wider text-white">
        {title}
      </h3>

      <p className="mt-1.5 text-xs text-[#8a8a8a] max-w-md leading-relaxed">
        {description}
      </p>

      {actionLabel && (
        <div className="mt-5">
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#0066b1] hover:bg-[#1c69d4] text-white rounded-lg transition-colors shadow-md shadow-[#0066b1]/20"
            >
              {actionLabel}
            </Link>
          ) : (
            <Button variant="primary" size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
