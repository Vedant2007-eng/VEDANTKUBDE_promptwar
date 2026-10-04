"use client";

import React from "react";
import { EyeOff, AlertCircle, ArrowUpRight } from "lucide-react";
import { BlindSpotItem } from "@/types/decision";
import { SeverityBadge } from "@/components/ui/Badge";

interface BlindSpotCardProps {
  blindSpot: BlindSpotItem;
  rank: number;
}

export const BlindSpotCard: React.FC<BlindSpotCardProps> = ({
  blindSpot,
  rank,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#12192B] to-[#0D1424] border border-red-500/20 p-5 sm:p-6 backdrop-blur-md transition-all duration-300 hover:border-red-500/40 hover:shadow-xl hover:shadow-red-950/20">
      {/* Accent corner light */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/15 text-red-400 font-mono text-xs font-bold border border-red-500/30">
            0{rank}
          </span>
          <SeverityBadge severity={blindSpot.severity} />
        </div>

        <span className="text-[11px] font-semibold text-purple-300 bg-purple-950/50 px-2.5 py-1 rounded-full border border-purple-500/25">
          {blindSpot.relatedPerspective}
        </span>
      </div>

      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mb-2 flex items-center gap-1.5">
        <span>{blindSpot.title}</span>
      </h3>

      <p className="text-sm text-slate-300 leading-relaxed">
        {blindSpot.explanation}
      </p>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1 text-slate-400">
          <EyeOff size={13} className="text-red-400" />
          <span>Unexamined cognitive gap</span>
        </span>
        <span className="text-slate-500 italic">
          Worth factoring into final choice
        </span>
      </div>
    </div>
  );
};
