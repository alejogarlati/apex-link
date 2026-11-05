"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-[#0066b1] hover:bg-[#1c69d4] text-white border border-[#0066b1] hover:border-[#1c69d4] shadow-md shadow-[#0066b1]/20",
  secondary:
    "bg-[#1a1a1a] hover:bg-[#262626] text-white border border-[#3c3c3c] hover:border-[#525252]",
  danger:
    "bg-[#e22718] hover:bg-[#c91f12] text-white border border-[#e22718] shadow-md shadow-[#e22718]/20",
  outline:
    "bg-transparent hover:bg-[#0066b1]/10 text-white border border-[#3c3c3c] hover:border-[#0066b1]",
  ghost:
    "bg-transparent hover:bg-white/5 text-[#bbbbbb] hover:text-white border border-transparent",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-[11px] gap-1.5",
  md: "px-4 py-2.5 text-xs gap-2",
  lg: "px-6 py-3 text-sm gap-2.5",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading}
        className={cn(
          "inline-flex items-center justify-center font-bold uppercase tracking-wider rounded-lg transition-all duration-150 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[#0066b1] focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50 disabled:pointer-events-none",
          VARIANT_STYLES[variant],
          SIZE_STYLES[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
            <span>{loadingText || children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
