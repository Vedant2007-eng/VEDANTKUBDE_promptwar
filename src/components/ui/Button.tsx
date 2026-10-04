"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "accent";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs font-medium rounded-lg gap-1.5",
    md: "px-4 py-2.5 text-sm font-medium rounded-xl gap-2",
    lg: "px-6 py-3.5 text-base font-semibold rounded-xl gap-2.5",
  };

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-lg shadow-purple-900/30 hover:shadow-purple-700/50 hover:from-purple-500 hover:to-blue-500 border border-purple-400/30 active:scale-[0.99]",
    secondary:
      "bg-[#10182A] text-slate-200 border border-white/10 hover:border-purple-400/40 hover:bg-[#162238] hover:text-white shadow-sm active:scale-[0.99]",
    accent:
      "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-900/30 hover:shadow-cyan-600/40 hover:from-cyan-400 hover:to-blue-500 border border-cyan-400/30 active:scale-[0.99]",
    outline:
      "bg-transparent text-slate-300 border border-white/15 hover:border-white/30 hover:text-white hover:bg-white/5 active:scale-[0.99]",
    ghost:
      "bg-transparent text-slate-400 hover:text-white hover:bg-white/5 active:scale-[0.99]",
    danger:
      "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 active:scale-[0.99]",
  };

  return (
    <button
      className={`relative inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050914] ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin h-4 w-4" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && (
        <span className="inline-flex shrink-0">{rightIcon}</span>
      )}
    </button>
  );
};
