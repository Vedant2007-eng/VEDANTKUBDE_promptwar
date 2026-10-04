"use client";

import React from "react";
import { SeverityLevel, AgentStatus } from "@/types/decision";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "purple" | "cyan" | "success" | "warning" | "danger" | "neutral";
  size?: "sm" | "md";
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "sm",
  className = "",
  icon,
}) => {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px] gap-1 rounded-full",
    md: "px-2.5 py-1 text-xs gap-1.5 rounded-full font-medium",
  };

  const variantClasses = {
    default: "bg-slate-800/80 text-slate-300 border border-slate-700/60",
    purple: "bg-purple-500/15 text-purple-300 border border-purple-500/30",
    cyan: "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30",
    success: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
    danger: "bg-red-500/15 text-red-300 border border-red-500/30",
    neutral: "bg-white/5 text-slate-400 border border-white/10",
  };

  return (
    <span
      className={`inline-flex items-center font-medium tracking-wide uppercase ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export const SeverityBadge: React.FC<{ severity: SeverityLevel; className?: string }> = ({
  severity,
  className = "",
}) => {
  const configs: Record<SeverityLevel, { label: string; variant: "danger" | "warning" | "neutral" }> = {
    high: { label: "High Severity", variant: "danger" },
    medium: { label: "Moderate Risk", variant: "warning" },
    low: { label: "Low Impact", variant: "neutral" },
  };

  const config = configs[severity];

  return (
    <Badge variant={config.variant} size="sm" className={className}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-0.5 animate-pulse" />
      {config.label}
    </Badge>
  );
};

export const StatusBadge: React.FC<{ status: AgentStatus; className?: string }> = ({
  status,
  className = "",
}) => {
  if (status === "Completed") {
    return (
      <Badge variant="success" size="sm" className={className}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-0.5" />
        Completed
      </Badge>
    );
  }
  if (status === "Analyzing...") {
    return (
      <Badge variant="cyan" size="sm" className={className}>
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping mr-0.5" />
        Analyzing...
      </Badge>
    );
  }
  return (
    <Badge variant="neutral" size="sm" className={className}>
      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-0.5" />
      Pending
    </Badge>
  );
};
