"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, 
  Eye, 
  HelpCircle, 
  ShieldAlert, 
  Layers, 
  CheckCircle2, 
  Filter, 
  Sparkles,
  Search,
  MessageCircleQuestion
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProgressSidebar } from "@/components/layout/ProgressSidebar";
import { DecisionCard } from "@/components/decision/DecisionCard";
import { MetricCard } from "@/components/decision/MetricCard";
import { BlindSpotCard } from "@/components/analysis/BlindSpotCard";
import { PerspectiveCard } from "@/components/analysis/PerspectiveCard";
import { Button } from "@/components/ui/Button";
import { useDecision } from "@/context/DecisionContext";
import { AGENT_PERSPECTIVES, mockAnalysis } from "@/data/mockAnalysis";

export default function ResultsPage() {
  const router = useRouter();
  const { currentDecision, startAnalysis, decisionInput, reasoningInput, setActiveStep } = useDecision();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Ensure state is loaded
  useEffect(() => {
    setActiveStep(3);
    if (!currentDecision) {
      const fallbackDecision = decisionInput || "I should invest in this company because the company is growing quickly.";
      const fallbackReasoning = reasoningInput || "Their revenue doubled in the last 12 months, customer sentiment is positive, and I don't want to miss the rally.";
      startAnalysis(fallbackDecision, fallbackReasoning);
    }
  }, [currentDecision, decisionInput, reasoningInput, startAnalysis, setActiveStep]);

  const activeData = currentDecision || mockAnalysis(
    "I should invest in this company because the company is growing quickly.",
    "Their revenue doubled in the last 12 months, customer sentiment is positive, and I don't want to miss the rally."
  );

  const categories = ["All", "Strategic", "Resources & Risks", "Validation", "Systemic & Future"];

  const filteredPerspectives = AGENT_PERSPECTIVES.filter((p) => {
    if (selectedCategory === "All") return true;
    return p.category === selectedCategory;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Progress Sidebar (Current = 3) */}
          <ProgressSidebar currentStepNumber={3} />

          {/* Right Main Results Dashboard */}
          <div className="flex-1 w-full space-y-10 min-w-0">
            {/* Top Header */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold tracking-wider uppercase">
                <Eye size={13} className="text-purple-400" />
                <span>Multi-Perspective Audit Complete</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                WHAT WE FOUND
              </h1>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                We uncovered hidden assumptions, unhedged vulnerabilities, and missing context in your stated logic.
              </p>
            </div>

            {/* Original Decision Card */}
            <DecisionCard
              decision={activeData.decision}
              reasoning={activeData.reasoning}
              allowEdit={true}
              onEdited={(newD, newR) => {
                startAnalysis(newD, newR);
              }}
            />

            {/* Metrics Row */}
            <section className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Core Findings Overview
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <MetricCard
                  label="Blind Spots"
                  value={activeData.metrics.blindSpotsCount}
                  description="High-severity factors omitted from your thesis"
                  type="blindSpots"
                />
                <MetricCard
                  label="Risks Identified"
                  value={activeData.metrics.risksCount}
                  description="Downside vulnerabilities requiring hedge plans"
                  type="risks"
                />
                <MetricCard
                  label="Challenged Assumptions"
                  value={activeData.metrics.assumptionsCount}
                  description="Beliefs treated as facts without verification"
                  type="assumptions"
                />
                <MetricCard
                  label="Missing Context"
                  value={activeData.metrics.missingInfoCount}
                  description="Critical data points yet to be audited"
                  type="missingInfo"
                />
              </div>
            </section>

            {/* TOP BLIND SPOTS Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                    <span className="text-red-400">●</span>
                    TOP BLIND SPOTS
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    Critical angles that were entirely omitted or glossed over in your reasoning.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeData.blindSpots.map((spot, idx) => (
                  <BlindSpotCard
                    key={spot.id}
                    blindSpot={spot}
                    rank={idx + 1}
                  />
                ))}
              </div>
            </section>

            {/* 15 Perspective Detailed Breakdown */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    PERSPECTIVE ANALYSIS
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    Detailed inquiry points across all 15 cognitive dimensions.
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-purple-600 text-white shadow-sm shadow-purple-900/40"
                          : "bg-[#10182A] text-slate-400 hover:text-white border border-white/5"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPerspectives.map((meta) => {
                  const findingText = activeData.analysis[meta.id] || "No anomalies flagged.";
                  const detail = activeData.detailedAnalysis[meta.id];

                  return (
                    <PerspectiveCard
                      key={meta.id}
                      meta={meta}
                      findingText={findingText}
                      detail={detail}
                    />
                  );
                })}
              </div>
            </section>

            {/* KEY QUESTIONS TO CONSIDER Section */}
            <section className="rounded-2xl bg-gradient-to-br from-[#10182A] to-[#0D1424] border border-cyan-500/25 p-6 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  <MessageCircleQuestion size={18} />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    KEY QUESTIONS TO CONSIDER
                  </h3>
                  <p className="text-xs text-slate-400">
                    Questions designed to reveal your true risk tolerance and thesis stability.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {activeData.questions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#070B14]/80 border border-white/5 flex items-start gap-3"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-300 font-mono text-xs font-bold">
                      0{idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 leading-snug">
                      {q}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Bottom Guidance & Primary CTA */}
            <div className="rounded-2xl bg-purple-950/20 border border-purple-500/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                This analysis is meant to help you think more deeply. <br />
                <strong className="text-purple-300">The final decision is always yours.</strong>
              </p>

              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight size={18} />}
                onClick={() => router.push("/reflection")}
                className="w-full sm:w-auto px-8 py-3.5 shrink-0 shadow-lg shadow-purple-900/50"
              >
                Continue to Reflection →
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
