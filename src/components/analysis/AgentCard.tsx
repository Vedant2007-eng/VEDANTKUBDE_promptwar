"use client";

import React from "react";
import { 
  Target, 
  ClipboardCheck, 
  Coins, 
  TrendingUp, 
  ShieldAlert, 
  HelpCircle, 
  Layers, 
  FileSearch, 
  GitFork, 
  Hourglass, 
  Scale, 
  Users, 
  BrainCircuit, 
  Undo2, 
  Compass, 
  Loader2, 
  CheckCircle2, 
  Clock 
} from "lucide-react";
import { AgentMeta, AgentStatus } from "@/types/decision";
import { StatusBadge } from "@/components/ui/Badge";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Target,
  ClipboardCheck,
  Coins,
  TrendingUp,
  ShieldAlert,
  HelpCircle,
  Layers,
  FileSearch,
  GitFork,
  Hourglass,
  Scale,
  Users,
  BrainCircuit,
  Undo2,
  Compass,
};

interface AgentCardProps {
  agent: AgentMeta;
  status: AgentStatus;
  currentAnalyzingId?: string;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  status,
  currentAnalyzingId,
}) => {
  const Icon = ICON_MAP[agent.iconName] || Target;
  const isCurrent = status === "Analyzing...";
  const isDone = status === "Completed";

  return (
    <div
      className={`relative overflow-hidden rounded-xl p-3.5 transition-all duration-300 ${
        isCurrent
          ? "bg-gradient-to-r from-purple-950/60 to-cyan-950/60 border-2 border-cyan-400/60 shadow-lg shadow-cyan-950/50 scale-[1.02]"
          : isDone
          ? "bg-[#0D1424]/90 border border-emerald-500/25 hover:border-emerald-500/40"
          : "bg-[#090E1A]/80 border border-white/5 opacity-70"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
              isCurrent
                ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                : isDone
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                : "bg-white/5 border-white/10 text-slate-500"
            }`}
          >
            <Icon size={16} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono text-slate-500">#{agent.number}</span>
              <h4 className="text-xs font-bold text-white truncate">
                {agent.name}
              </h4>
            </div>
            <span className="text-[10px] text-slate-400 truncate block">
              {agent.category}
            </span>
          </div>
        </div>

        <div className="shrink-0 flex items-center">
          {isCurrent ? (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/40">
              <Loader2 size={11} className="animate-spin text-cyan-400" />
              <span>Analyzing</span>
            </div>
          ) : isDone ? (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
              <CheckCircle2 size={12} className="text-emerald-400" />
              <span>Done</span>
            </div>
          ) : (
            <span className="text-[10px] text-slate-500 font-medium px-2 py-0.5 rounded-full bg-white/5">
              Pending
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
