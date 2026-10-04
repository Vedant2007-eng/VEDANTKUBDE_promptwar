"use client";

import React from "react";

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showPercent?: boolean;
  color?: "gradient" | "purple" | "cyan" | "emerald" | "amber";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercent = false,
  color = "gradient",
  size = "md",
  className = "",
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const colorGradients = {
    gradient: "bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400",
    purple: "bg-gradient-to-r from-purple-600 to-indigo-400",
    cyan: "bg-gradient-to-r from-blue-500 to-cyan-400",
    emerald: "bg-gradient-to-r from-emerald-500 to-teal-400",
    amber: "bg-gradient-to-r from-amber-500 to-yellow-400",
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between text-xs font-medium mb-1.5 text-slate-300">
          {label && <span>{label}</span>}
          {showPercent && (
            <span className="font-mono text-cyan-300 font-semibold">{percentage}%</span>
          )}
        </div>
      )}
      <div className={`w-full overflow-hidden rounded-full bg-slate-900/90 border border-white/10 ${sizeClasses[size]}`}>
        <div
          className={`h-full transition-all duration-500 ease-out rounded-full ${colorGradients[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
