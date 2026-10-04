"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Download, 
  RotateCcw, 
  Compass, 
  Sparkles, 
  CheckCircle, 
  ShieldCheck, 
  HelpCircle, 
  FileText,
  Printer,
  Share2,
  Check
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProgressSidebar } from "@/components/layout/ProgressSidebar";
import { FinalInsightCard } from "@/components/reflection/FinalInsightCard";
import { CoverageMeter } from "@/components/reflection/CoverageMeter";
import { Button } from "@/components/ui/Button";
import { useDecision } from "@/context/DecisionContext";
import { generateInsights, generateUpdatedPerspective, mockAnalysis } from "@/data/mockAnalysis";

export default function FinalPage() {
  const router = useRouter();
  const { 
    currentDecision, 
    startAnalysis, 
    decisionInput, 
    reasoningInput, 
    resetDecision, 
    finalizeDecision,
    setActiveStep 
  } = useDecision();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setActiveStep(5);
    if (!currentDecision) {
      const fallbackDecision = decisionInput || "I should invest in this company because the company is growing quickly.";
      const fallbackReasoning = reasoningInput || "Their revenue doubled in the last 12 months, customer sentiment is positive, and I don't want to miss the rally.";
      const newD = startAnalysis(fallbackDecision, fallbackReasoning);
      finalizeDecision();
    } else if (!currentDecision.insights || !currentDecision.updatedPerspective) {
      finalizeDecision();
    }
  }, [currentDecision, decisionInput, reasoningInput, startAnalysis, finalizeDecision, setActiveStep]);

  const activeData = currentDecision || mockAnalysis(
    "I should invest in this company because the company is growing quickly.",
    "Their revenue doubled in the last 12 months, customer sentiment is positive, and I don't want to miss the rally."
  );

  const insights = activeData.insights || generateInsights(activeData);
  const updatedPerspective = activeData.updatedPerspective || generateUpdatedPerspective(activeData);

  const handleDownloadReport = () => {
    const reportContent = `
=====================================================
BLINDSPOT AI — DECISION RE-EXAMINATION REPORT
"Think deeper. Decide better."
Date: ${new Date(activeData.createdAt || Date.now()).toLocaleString()}
=====================================================

ORIGINAL DECISION:
"${activeData.decision}"

ORIGINAL REASONING:
"${activeData.reasoning}"

-----------------------------------------------------
TOP BLIND SPOTS IDENTIFIED:
-----------------------------------------------------
${activeData.blindSpots
  .map(
    (bs, i) => `${i + 1}. [${bs.severity.toUpperCase()}] ${bs.title}
   Related: ${bs.relatedPerspective}
   Details: ${bs.explanation}
`
  )
  .join("\n")}

-----------------------------------------------------
SYNTHESIZED INSIGHTS:
-----------------------------------------------------
1. Supported Reasoning:
   ${insights.supportedReasoning}

2. What Is Uncertain:
   ${insights.whatIsUncertain}

3. Main Blind Spots:
   ${insights.mainBlindSpots}

4. What Your Reflection Added:
   ${insights.whatReflectionAdded}

-----------------------------------------------------
YOUR REFLECTIONS:
-----------------------------------------------------
- Continuous Growth Evidence:
  ${activeData.reflections["q1"] || "Not provided during reflection"}

- Potential Failure / Slowdown Risks:
  ${activeData.reflections["q2"] || "Not provided during reflection"}

- Risk-Adjusted Alternatives:
  ${activeData.reflections["q3"] || "Not provided during reflection"}

- Tolerable Downside / Loss:
  ${activeData.reflections["q4"] || "Not provided during reflection"}

-----------------------------------------------------
REFLECTION COVERAGE:
-----------------------------------------------------
- Evidence:     ${activeData.coverage.evidence}%
- Risks:        ${activeData.coverage.risks}%
- Alternatives: ${activeData.coverage.alternatives}%
- Assumptions:  ${activeData.coverage.assumptions}%
- Uncertainty:  ${activeData.coverage.uncertainty}%

(Disclaimer: Reflection coverage represents how thoroughly different aspects 
of your reasoning were examined. It does not predict whether your decision will be correct.)

-----------------------------------------------------
YOUR UPDATED PERSPECTIVE:
-----------------------------------------------------
"${updatedPerspective}"

=====================================================
FINAL PRINCIPLE:
"You now have a broader view of the decision, including the key factors, 
blind spots, and open questions. The final decision is always yours."
=====================================================
    `.trim();

    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `BlindSpot-Report-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(
      `BlindSpot AI Decision Brief: "${activeData.decision}"\nUpdated Perspective: "${updatedPerspective}"`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartNew = () => {
    resetDecision();
    router.push("/");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Progress Sidebar (Current = 5) */}
          <ProgressSidebar currentStepNumber={5} />

          {/* Main Final Insights Content */}
          <div className="flex-1 w-full space-y-10 min-w-0">
            {/* Header */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold tracking-wider uppercase">
                <Compass size={13} className="text-cyan-400" />
                <span>FINAL REFLECTION</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Your Decision, Re-examined.
              </h1>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                Here&apos;s a summary of what we found, along with your reflections. The final decision is yours.
              </p>
            </div>

            {/* Original Thought Card */}
            <section className="rounded-2xl bg-[#0D1424]/90 border border-white/10 p-5 sm:p-6 backdrop-blur-md">
              <span className="text-xs font-bold tracking-wider uppercase text-purple-400 block mb-2">
                Your Original Thought
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                &ldquo;{activeData.decision}&rdquo;
              </h2>
              {activeData.reasoning && (
                <p className="text-xs sm:text-sm text-slate-300 mt-2 bg-[#070B14]/60 p-3 rounded-xl border border-white/5">
                  <strong className="text-slate-400">Initial Rationale:</strong> {activeData.reasoning}
                </p>
              )}
            </section>

            {/* Key Insights (4 Cards Grid) */}
            <section className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Core Synthesis Pillars
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FinalInsightCard
                  type="supported"
                  title="1. Supported Reasoning"
                  description={insights.supportedReasoning}
                />
                <FinalInsightCard
                  type="uncertain"
                  title="2. What's Uncertain"
                  description={insights.whatIsUncertain}
                />
                <FinalInsightCard
                  type="blindSpots"
                  title="3. Main Blind Spots"
                  description={insights.mainBlindSpots}
                />
                <FinalInsightCard
                  type="reflection"
                  title="4. What Your Reflection Added"
                  description={insights.whatReflectionAdded}
                />
              </div>
            </section>

            {/* Reflection Coverage Section */}
            <section>
              <CoverageMeter coverage={activeData.coverage} />
            </section>

            {/* Top Questions to Keep in Mind */}
            <section className="rounded-2xl bg-[#0D1424]/90 border border-white/10 p-5 sm:p-6 backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle size={18} className="text-cyan-400" />
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Top Questions to Keep in Mind
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeData.questions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#070B14]/80 border border-white/5 flex items-start gap-2.5"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-300 font-mono text-[11px] font-bold">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-snug">
                      {q}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Highlighted Card: YOUR UPDATED PERSPECTIVE */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950/60 via-[#10182A] to-cyan-950/40 border-2 border-purple-500/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-purple-950/40">
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <Sparkles size={16} />
                </span>
                <span className="text-xs sm:text-sm font-extrabold tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">
                  YOUR UPDATED PERSPECTIVE
                </span>
              </div>

              <blockquote className="text-lg sm:text-xl font-bold text-white leading-relaxed italic border-l-2 border-purple-400/80 pl-4 my-2">
                &ldquo;{updatedPerspective}&rdquo;
              </blockquote>

              <p className="text-xs text-slate-400 mt-3">
                Synthesized dynamically from your original reasoning, identified blind spots, and personal reflection inputs.
              </p>
            </section>

            {/* Final Message Banner */}
            <section className="rounded-2xl bg-gradient-to-r from-[#0D1424] to-[#121A30] border border-white/10 p-6 text-center space-y-3">
              <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Empowered Agency
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                You now have a broader view of the decision, including the key factors, blind spots, and open questions.
              </p>
              <p className="text-sm font-bold text-purple-300">
                The final decision is always yours.
              </p>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<Download size={16} />}
                  onClick={handleDownloadReport}
                  className="w-full sm:w-auto shadow-purple-900/50"
                >
                  Download Report
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  leftIcon={copied ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
                  onClick={handleCopySummary}
                  className="w-full sm:w-auto"
                >
                  {copied ? "Copied Brief!" : "Copy Summary"}
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  leftIcon={<RotateCcw size={16} />}
                  onClick={handleStartNew}
                  className="w-full sm:w-auto text-slate-300 hover:text-white"
                >
                  Start New Decision
                </Button>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
