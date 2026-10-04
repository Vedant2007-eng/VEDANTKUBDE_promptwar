"use client";

import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "interactive" | "glow" | "elevated";
  glowColor?: "purple" | "cyan" | "blue" | "danger" | "warning";
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = "default",
  glowColor = "purple",
  className = "",
  ...props
}) => {
  const glowClasses = {
    purple: "hover:border-purple-500/40 hover:shadow-purple-950/40",
    cyan: "hover:border-cyan-500/40 hover:shadow-cyan-950/40",
    blue: "hover:border-blue-500/40 hover:shadow-blue-950/40",
    danger: "hover:border-red-500/40 hover:shadow-red-950/40",
    warning: "hover:border-amber-500/40 hover:shadow-amber-950/40",
  };

  const variantClasses = {
    default:
      "bg-[#0D1424]/80 backdrop-blur-md border border-white/[0.08] shadow-lg shadow-black/40",
    interactive:
      `bg-[#0D1424]/80 backdrop-blur-md border border-white/[0.08] shadow-lg shadow-black/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${glowClasses[glowColor]}`,
    glow:
      "bg-gradient-to-b from-[#10182A]/90 to-[#0D1424]/90 backdrop-blur-lg border border-purple-500/25 shadow-xl shadow-purple-950/20 relative overflow-hidden",
    elevated:
      "bg-[#10182A]/90 backdrop-blur-xl border border-white/[0.12] shadow-2xl shadow-black/60",
  };

  return (
    <div
      className={`rounded-2xl ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
