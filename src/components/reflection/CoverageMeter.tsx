"use client";

import React from "react";
import { Info, ShieldCheck, Activity } from "lucide-react";
import { ReflectionCoverage } from "@/types/decision";

interface CoverageMeterProps {
  coverage: ReflectionCoverage;
  className?: string;
}

export const CoverageMeter: React.FC<CoverageMeterProps> = ({
  coverage,
  className = "",
}) => {
  const metrics: Array<{
    label: string;
    value: number;
    color: string;
    description: string;
  }> = [
    {
      label: "Evidence",
      value: coverage.evidence,
      color: "from-blue-500 to-cyan-400",
      description: "Tested empirical backing vs intuition",
    },
    {
      label: "Risks",
      value: coverage.risks,
      color: "from-amber-500 to-red-400",
      description: "Stress-tested downside vulnerabilities",
    },
    {
      label: "Alternatives",
      value: coverage.alternatives,
      color: "from-purple-500 to-indigo-400",
      description: "Contrasted competing & staged options",
    },
    {
      label: "Assumptions",
      value: coverage.assumptions,
      color: "from-purple-500 to-pink-400",
      description: "Surfaced hidden presuppositions",
    },
    {
      label: "Uncertainty",
      value: coverage.uncertainty,
      color: "from-teal-400 to-emerald-400",
      description: "Separated known facts from speculation",
    },
  ];

  return (
    <div
      className={`rounded-2xl bg-[#0D1424]/90 border border-white/10 p-5 sm:p-6 backdrop-blur-md ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/25">
              <Activity size={14} />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Reflection Coverage
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Quantifying cognitive breadth across critical decision vectors.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold">
          <ShieldCheck size={13} />
          <span>Multi-Perspective Audit</span>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4 my-5">
        {metrics.map((item) => (
          <div key={item.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-200">{item.label}</span>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  — {item.description}
                </span>
              </div>
              <span className="font-mono font-bold text-cyan-300">
                {item.value}%
              </span>
            </div>

            <div className="h-2.5 w-full rounded-full bg-slate-900 border border-white/5 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-700 ease-out`}
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20 flex items-start gap-2.5">
        <Info size={16} className="text-purple-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong>Important:</strong> This represents how thoroughly different aspects of your reasoning were examined. It does not predict whether your decision will be correct.
        </p>
      </div>
    </div>
  );
};
