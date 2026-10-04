"use client";

import React from "react";
import { EyeOff, AlertTriangle, HelpCircle, FileQuestion, LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: number | string;
  description: string;
  type: "blindSpots" | "risks" | "assumptions" | "missingInfo";
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  description,
  type,
}) => {
  const configs: Record<
    MetricCardProps["type"],
    {
      icon: LucideIcon;
      colorClass: string;
      bgClass: string;
      borderClass: string;
      textGlow: string;
    }
  > = {
    blindSpots: {
      icon: EyeOff,
      colorClass: "text-red-400",
      bgClass: "bg-red-500/10",
      borderClass: "border-red-500/25 hover:border-red-500/40",
      textGlow: "group-hover:text-red-300",
    },
    risks: {
      icon: AlertTriangle,
      colorClass: "text-amber-400",
      bgClass: "bg-amber-500/10",
      borderClass: "border-amber-500/25 hover:border-amber-500/40",
      textGlow: "group-hover:text-amber-300",
    },
    assumptions: {
      icon: HelpCircle,
      colorClass: "text-purple-400",
      bgClass: "bg-purple-500/10",
      borderClass: "border-purple-500/25 hover:border-purple-500/40",
      textGlow: "group-hover:text-purple-300",
    },
    missingInfo: {
      icon: FileQuestion,
      colorClass: "text-cyan-400",
      bgClass: "bg-cyan-500/10",
      borderClass: "border-cyan-500/25 hover:border-cyan-500/40",
      textGlow: "group-hover:text-cyan-300",
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-[#0D1424]/90 backdrop-blur-md border ${config.borderClass} p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${config.bgClass} ${config.colorClass} border border-white/5 transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon size={20} />
        </span>
        <span className={`text-2xl sm:text-3xl font-black font-mono tracking-tight text-white ${config.textGlow}`}>
          {value}
        </span>
      </div>

      <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
        {label}
      </h4>
      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
        {description}
      </p>
    </div>
  );
};
