"use client";

import React, { useState, useId } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightAdornment?: React.ReactNode;
  mono?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      helperText,
      error,
      leftIcon,
      rightAdornment,
      mono = false,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const isPassword = type === "password";
    const [mostrarPassword, setMostrarPassword] = useState(false);

    const effectiveType = isPassword ? (mostrarPassword ? "text" : "password") : type;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[11px] font-bold uppercase tracking-wider text-[#bbbbbb] font-mono"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-[#7e7e7e] pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={effectiveType}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={cn(
              "w-full px-3.5 py-2.5 bg-black border text-sm text-white placeholder:text-[#555555] rounded-lg transition-colors outline-none focus-visible:ring-1",
              error
                ? "border-[#e22718] focus:border-[#e22718] focus-visible:ring-[#e22718]"
                : "border-[#3c3c3c] hover:border-[#525252] focus:border-[#0066b1] focus-visible:ring-[#0066b1]",
              leftIcon && "pl-10",
              (isPassword || rightAdornment) && "pr-10",
              mono && "font-mono",
              disabled && "opacity-50 cursor-not-allowed bg-[#141414]",
              className
            )}
            {...props}
          />

          {isPassword ? (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setMostrarPassword((prev) => !prev)}
              aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="absolute right-3 text-[#7e7e7e] hover:text-white transition-colors p-1 rounded cursor-pointer"
            >
              {mostrarPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          ) : (
            rightAdornment && (
              <div className="absolute right-3.5 text-[#7e7e7e] flex items-center">
                {rightAdornment}
              </div>
            )
          )}
        </div>

        {error ? (
          <p
            id={errorId}
            role="alert"
            className="flex items-center gap-1.5 text-xs text-[#ff6b6b] font-mono pt-0.5"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#e22718]" />
            <span>{error}</span>
          </p>
        ) : (
          helperText && (
            <p id={helperId} className="text-[11px] text-[#7e7e7e] font-mono">
              {helperText}
            </p>
          )
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
