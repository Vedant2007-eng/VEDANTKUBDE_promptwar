"use client";

import React, { useState } from "react";
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
  HelpCircle as QuestionIcon,
  ChevronDown,
  Sparkles
} from "lucide-react";
import { AgentMeta, AgentStructuredOutput, PerspectiveId } from "@/types/decision";
import { SeverityBadge } from "@/components/ui/Badge";

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

interface PerspectiveCardProps {
  meta: AgentMeta;
  findingText: string;
  detail?: AgentStructuredOutput;
}

export const PerspectiveCard: React.FC<PerspectiveCardProps> = ({
  meta,
  findingText,
  detail,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = ICON_MAP[meta.iconName] || Target;

  return (
    <div className="group rounded-2xl bg-[#0D1424]/90 border border-white/[0.08] hover:border-purple-500/35 p-5 backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:shadow-purple-950/20 flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/20 group-hover:scale-105 transition-transform">
              <Icon size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight group-hover:text-purple-300 transition-colors">
                {meta.name}
              </h4>
              <span className="text-[10px] font-medium text-slate-400">
                {meta.category}
              </span>
            </div>
          </div>

          {detail?.severity && (
            <SeverityBadge severity={detail.severity} />
          )}
        </div>

        {/* Main finding */}
        <p className="text-sm text-slate-300 leading-relaxed bg-[#070B14]/50 p-3 rounded-xl border border-white/5">
          {findingText}
        </p>

        {/* Thoughtful Inquiry Prompt */}
        {detail?.question && (
          <div className="mt-3 p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-200">
            <span className="flex items-center gap-1 font-semibold text-cyan-400 mb-1">
              <QuestionIcon size={12} />
              <span>Inquiry to examine:</span>
            </span>
            <p className="italic text-slate-300">&ldquo;{detail.question}&rdquo;</p>
          </div>
        )}
      </div>

      {/* Footer expansion for deeper rationale */}
      {detail?.explanation && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-[11px] font-medium text-slate-400 hover:text-purple-300 transition-colors"
          >
            <span>{isExpanded ? "Hide rationale" : "View rationale breakdown"}</span>
            <ChevronDown
              size={14}
              className={`transform transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>
          {isExpanded && (
            <p className="text-xs text-slate-400 mt-2 p-2 rounded-lg bg-black/30 border border-white/5 leading-relaxed animate-in fade-in duration-200">
              {detail.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
