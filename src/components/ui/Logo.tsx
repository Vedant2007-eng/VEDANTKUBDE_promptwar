"use client";

import React from "react";
import Link from "next/link";
import { Eye, Sparkles } from "lucide-react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = "md" }) => {
  const iconSize = size === "sm" ? 18 : size === "lg" ? 28 : 22;
  const textSize = size === "sm" ? "text-lg" : size === "lg" ? "text-2xl" : "text-xl";

  return (
    <Link
      href="/"
      className={`group flex items-center gap-2.5 transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-lg p-1 ${className}`}
      aria-label="BlindSpot AI Home"
    >
      <div className="relative flex items-center justify-center">
        {/* Glow backdrop */}
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 opacity-60 blur-sm group-hover:opacity-90 transition-opacity duration-300" />
        
        {/* Icon container */}
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[#0D1424] border border-white/10 shadow-inner">
          <Eye size={iconSize} className="text-purple-400 group-hover:text-cyan-300 transition-colors duration-300" />
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
          </span>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-bold tracking-tight text-white ${textSize}`}>
            BLIND<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-300">SPOT</span>
          </span>
          <span className="rounded-full bg-purple-500/15 border border-purple-500/30 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-purple-300">
            AI
          </span>
        </div>
        <span className="text-[10px] font-medium tracking-wide text-slate-400">
          Think deeper. Decide better.
        </span>
      </div>
    </Link>
  );
};
