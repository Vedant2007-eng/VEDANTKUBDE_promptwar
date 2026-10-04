"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  ArrowRight, 
  BrainCircuit, 
  FastForward, 
  Cpu, 
  Layers 
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DecisionCard } from "@/components/decision/DecisionCard";
import { AgentCard } from "@/components/analysis/AgentCard";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useDecision } from "@/context/DecisionContext";
import { AGENT_PERSPECTIVES, mockAnalysis } from "@/data/mockAnalysis";
import { AgentStatus, PerspectiveId } from "@/types/decision";

export default function AnalyzePage() {
  const router = useRouter();
  const { currentDecision, startAnalysis, decisionInput, reasoningInput, setActiveStep } = useDecision();

  // Agent statuses dictionary
  const [statuses, setStatuses] = useState<Record<PerspectiveId, AgentStatus>>(() => {
    const initial: Record<string, AgentStatus> = {};
    AGENT_PERSPECTIVES.forEach((agent) => {
      initial[agent.id] = "Pending";
    });
    return initial as Record<PerspectiveId, AgentStatus>;
  });

  const [completedCount, setCompletedCount] = useState<number>(0);
  const [currentAgentName, setCurrentAgentName] = useState<string>("Goal");
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const isNavigatingRef = useRef<boolean>(false);

  // Fallback if accessed directly with no state
  useEffect(() => {
    setActiveStep(2);
    if (!currentDecision) {
      const fallbackDecision = decisionInput || "I should invest in this company because the company is growing quickly.";
      const fallbackReasoning = reasoningInput || "Their revenue doubled in the last 12 months, customer sentiment is positive, and I don't want to miss the rally.";
      startAnalysis(fallbackDecision, fallbackReasoning);
    }
  }, [currentDecision, decisionInput, reasoningInput, startAnalysis, setActiveStep]);

  // Simulated progression
  useEffect(() => {
    let currentIdx = 0;
    const total = AGENT_PERSPECTIVES.length;

    const interval = setInterval(() => {
      if (currentIdx < total) {
        const agent = AGENT_PERSPECTIVES[currentIdx];
        setCurrentAgentName(agent.name);

        setStatuses((prev) => ({
          ...prev,
          [agent.id]: "Analyzing...",
        }));

        // Finish after slight delay
        setTimeout(() => {
          setStatuses((prev) => ({
            ...prev,
            [agent.id]: "Completed",
          }));
          setCompletedCount((prev) => Math.min(total, prev + 1));
        }, 320);

        currentIdx++;
      } else {
        clearInterval(interval);
        setIsFinished(true);
        // Automatic navigation after completion
        if (!isNavigatingRef.current) {
          isNavigatingRef.current = true;
          setTimeout(() => {
            router.push("/results");
          }, 700);
        }
      }
    }, 380);

    return () => clearInterval(interval);
  }, [router]);

  const handleSkip = () => {
    if (!isNavigatingRef.current) {
      isNavigatingRef.current = true;
      const allDone: Record<string, AgentStatus> = {};
      AGENT_PERSPECTIVES.forEach((a) => (allDone[a.id] = "Completed"));
      setStatuses(allDone as Record<PerspectiveId, AgentStatus>);
      setCompletedCount(AGENT_PERSPECTIVES.length);
      router.push("/results");
    }
  };

  const activeDecisionText = currentDecision?.decision || decisionInput || "I should invest in this company because the company is growing quickly.";
  const activeReasoningText = currentDecision?.reasoning || reasoningInput || "Their revenue doubled in the last 12 months, customer sentiment is positive, and I don't want to miss the rally.";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold tracking-wider uppercase">
            <Cpu size={13} className="animate-spin text-cyan-400" />
            <span>AI Multi-Agent Pipeline Active</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            ANALYZING YOUR DECISION
          </h1>
          <p className="text-sm text-slate-400">
            Applying 15 critical thinking perspectives to your stated reasoning.
          </p>
        </div>

        {/* User Decision Card with Edit support */}
        <DecisionCard
          decision={activeDecisionText}
          reasoning={activeReasoningText}
          allowEdit={true}
          onEdited={(newD, newR) => {
            startAnalysis(newD, newR);
          }}
        />

        {/* Central AI Visual / Glowing Orb Section */}
        <section className="relative rounded-3xl bg-[#0D1424]/70 border border-white/10 p-8 sm:p-10 backdrop-blur-xl overflow-hidden flex flex-col items-center justify-center text-center">
          {/* Animated concentric glowing rings */}
          <div className="relative flex items-center justify-center my-6">
            {/* Outer spinning ring */}
            <div className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full border border-purple-500/30 animate-spin-slow" />
            {/* Secondary reverse spinning ring */}
            <div className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-cyan-400/25 animate-spin-reverse-slow" />
            {/* Third dashed ring */}
            <div className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-dashed border-indigo-400/40 animate-spin-slow" />
            
            {/* Center glowing orb */}
            <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gradient-to-tr from-purple-700 via-indigo-600 to-cyan-500 glow-orb animate-pulse-slow">
              <BrainCircuit size={36} className="text-white drop-shadow-md" />
            </div>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-2">
            15 AI Agents are examining your thinking from different perspectives...
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mt-1 font-mono">
            Currently assessing: <span className="text-cyan-300 font-semibold">{currentAgentName}</span>
          </p>

          {/* Quick Skip Button */}
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FastForward size={14} />}
              onClick={handleSkip}
              className="text-xs border-white/10 hover:border-purple-400/40 text-slate-400 hover:text-white"
            >
              Skip simulation & view results
            </Button>
          </div>
        </section>

        {/* 15 Agent Cards Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-purple-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                15 Cognitive Perspectives Breakdown
              </h3>
            </div>
            <span className="font-mono text-xs text-purple-300">
              {completedCount} / {AGENT_PERSPECTIVES.length} Completed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {AGENT_PERSPECTIVES.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                status={statuses[agent.id]}
              />
            ))}
          </div>
        </section>

        {/* Bottom Progress Bar */}
        <section className="sticky bottom-6 rounded-2xl bg-[#0D1424]/95 border border-purple-500/30 p-4 backdrop-blur-xl shadow-2xl shadow-purple-950/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:flex-1">
            <ProgressBar
              value={completedCount}
              max={AGENT_PERSPECTIVES.length}
              label={`Analyzing your decision... (${completedCount}/${AGENT_PERSPECTIVES.length} completed)`}
              showPercent={true}
              color="gradient"
              size="md"
            />
          </div>

          <Button
            variant="primary"
            size="md"
            rightIcon={<ArrowRight size={16} />}
            onClick={handleSkip}
            className="w-full sm:w-auto shrink-0 font-semibold"
          >
            {isFinished ? "View Results Now →" : "Fast-Forward →"}
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
