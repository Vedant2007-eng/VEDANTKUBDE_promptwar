"use client";

import React from "react";
import { CheckCircle2, HelpCircle, EyeOff, Sparkles, LucideIcon } from "lucide-react";

interface FinalInsightCardProps {
  type: "supported" | "uncertain" | "blindSpots" | "reflection";
  title: string;
  description: string;
  className?: string;
}

export const FinalInsightCard: React.FC<FinalInsightCardProps> = ({
  type,
  title,
  description,
  className = "",
}) => {
  const configs: Record<
    FinalInsightCardProps["type"],
    {
      icon: LucideIcon;
      colorClass: string;
      bgClass: string;
      borderClass: string;
    }
  > = {
    supported: {
      icon: CheckCircle2,
      colorClass: "text-emerald-400",
      bgClass: "bg-emerald-500/10",
      borderClass: "border-emerald-500/25",
    },
    uncertain: {
      icon: HelpCircle,
      colorClass: "text-amber-400",
      bgClass: "bg-amber-500/10",
      borderClass: "border-amber-500/25",
    },
    blindSpots: {
      icon: EyeOff,
      colorClass: "text-red-400",
      bgClass: "bg-red-500/10",
      borderClass: "border-red-500/25",
    },
    reflection: {
      icon: Sparkles,
      colorClass: "text-purple-400",
      bgClass: "bg-purple-500/10",
      borderClass: "border-purple-500/30",
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div
      className={`rounded-2xl bg-[#0D1424]/90 border ${config.borderClass} p-5 sm:p-6 backdrop-blur-md transition-all duration-300 hover:shadow-lg ${className}`}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-xl ${config.bgClass} ${config.colorClass} border border-white/5`}
        >
          <Icon size={17} />
        </span>
        <h4 className="text-sm font-bold text-white tracking-tight">
          {title}
        </h4>
      </div>

      <p className="text-sm text-slate-300 leading-relaxed bg-[#070B14]/50 p-3.5 rounded-xl border border-white/5">
        {description}
      </p>
    </div>
  );
};
