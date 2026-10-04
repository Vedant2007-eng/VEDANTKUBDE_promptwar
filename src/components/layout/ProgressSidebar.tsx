"use client";

import React from "react";
import Link from "next/link";
import { Check, Compass, Eye, FileText, Brain, Sparkles, ArrowRight } from "lucide-react";

interface StepConfig {
  number: number;
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const STEPS: StepConfig[] = [
  { number: 1, label: "Input", path: "/", icon: FileText },
  { number: 2, label: "AI Analysis", path: "/analyze", icon: Sparkles },
  { number: 3, label: "Results", path: "/results", icon: Eye },
  { number: 4, label: "Reflection", path: "/reflection", icon: Brain },
  { number: 5, label: "Final Insights", path: "/final", icon: Compass },
];

interface ProgressSidebarProps {
  currentStepNumber: number; // 3, 4, or 5
  className?: string;
}

export const ProgressSidebar: React.FC<ProgressSidebarProps> = ({
  currentStepNumber,
  className = "",
}) => {
  return (
    <>
      {/* Mobile Top Stepper Bar */}
      <div className="lg:hidden w-full mb-6 p-3 rounded-2xl bg-[#0D1424]/90 border border-white/10 backdrop-blur-md">
        <div className="flex items-center justify-between text-xs mb-2 px-1">
          <span className="font-semibold text-purple-300">
            Step {currentStepNumber} of 5: {STEPS[currentStepNumber - 1]?.label}
          </span>
          <span className="font-mono text-slate-400">
            {Math.round(((currentStepNumber - 1) / 4) * 100)}% Complete
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {STEPS.map((step) => {
            const isCompleted = step.number < currentStepNumber;
            const isCurrent = step.number === currentStepNumber;

            return (
              <div
                key={step.number}
                className="flex-1 flex flex-col items-center"
                title={`${step.number}. ${step.label}`}
              >
                <div
                  className={`w-full h-1.5 rounded-full transition-all duration-300 ${
                    isCompleted
                      ? "bg-purple-500"
                      : isCurrent
                      ? "bg-gradient-to-r from-purple-500 to-cyan-400 shadow-sm shadow-cyan-400/50"
                      : "bg-white/10"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop Left Sidebar */}
      <aside
        className={`hidden lg:block w-72 shrink-0 ${className}`}
        aria-label="Workflow progress"
      >
        <div className="sticky top-24 p-6 rounded-2xl bg-[#0D1424]/80 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/40">
          <div className="mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
              Workflow Progression
            </span>
            <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
              Decision Journey
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Step-by-step examination of assumptions, risks, and blind spots.
            </p>
          </div>

          <nav className="space-y-4 relative" aria-label="Steps">
            {/* Vertical connector line */}
            <div
              className="absolute left-4 top-4 bottom-4 w-0.5 bg-white/10 -z-0"
              aria-hidden="true"
            />

            {STEPS.map((step) => {
              const isCompleted = step.number < currentStepNumber;
              const isCurrent = step.number === currentStepNumber;
              const isNext = step.number > currentStepNumber;
              const Icon = step.icon;

              const content = (
                <div className="flex items-center gap-3 relative z-10 group">
                  {/* Step status node */}
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl border text-xs font-semibold transition-all duration-200 ${
                      isCompleted
                        ? "bg-purple-600/20 border-purple-500 text-purple-300 shadow-sm shadow-purple-900/40"
                        : isCurrent
                        ? "bg-gradient-to-br from-purple-500 to-cyan-500 border-white/40 text-white shadow-lg shadow-purple-600/40 ring-2 ring-purple-400/30"
                        : "bg-[#10182A] border-white/10 text-slate-500"
                    }`}
                  >
                    {isCompleted ? (
                      <Check size={14} className="stroke-[3] text-purple-300" />
                    ) : (
                      <Icon size={14} />
                    )}
                  </div>

                  {/* Step Text Info */}
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm font-semibold transition-colors ${
                          isCurrent
                            ? "text-white"
                            : isCompleted
                            ? "text-slate-300 group-hover:text-purple-300"
                            : "text-slate-500"
                        }`}
                      >
                        {step.label}
                      </span>
                      <span
                        className={`text-[10px] font-medium uppercase px-2 py-0.5 rounded-full ${
                          isCompleted
                            ? "bg-purple-950/60 text-purple-300 border border-purple-500/20"
                            : isCurrent
                            ? "bg-cyan-950/80 text-cyan-300 border border-cyan-400/40 font-semibold"
                            : "bg-white/5 text-slate-500"
                        }`}
                      >
                        {isCompleted ? "Completed" : isCurrent ? "Current" : "Next"}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-0.5 font-mono">
                      Phase 0{step.number}
                    </span>
                  </div>
                </div>
              );

              // Completed steps are clickable to jump back if desired
              if (isCompleted) {
                return (
                  <Link
                    key={step.number}
                    href={step.path}
                    className="block p-1.5 -mx-1.5 rounded-xl transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <div key={step.number} className="p-1.5 -mx-1.5">
                  {content}
                </div>
              );
            })}
          </nav>

          {/* Quick reminder card */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20">
              <span className="text-[11px] font-semibold text-purple-300 block mb-1">
                Guiding Principle
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                The AI finds what you might overlook. You retain 100% agency over the final decision.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
