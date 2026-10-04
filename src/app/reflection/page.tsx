"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  ArrowRight, 
  Brain, 
  Info, 
  CheckCircle2, 
  Sparkles,
  HelpCircle
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProgressSidebar } from "@/components/layout/ProgressSidebar";
import { QuestionCard } from "@/components/reflection/QuestionCard";
import { Button } from "@/components/ui/Button";
import { useDecision } from "@/context/DecisionContext";
import { REFLECTION_QUESTIONS, mockAnalysis } from "@/data/mockAnalysis";

export default function ReflectionPage() {
  const router = useRouter();
  const { 
    currentDecision, 
    startAnalysis, 
    decisionInput, 
    reasoningInput, 
    saveReflectionAnswer, 
    finalizeDecision,
    setActiveStep 
  } = useDecision();

  useEffect(() => {
    setActiveStep(4);
    if (!currentDecision) {
      const fallbackDecision = decisionInput || "I should invest in this company because the company is growing quickly.";
      const fallbackReasoning = reasoningInput || "Their revenue doubled in the last 12 months, customer sentiment is positive, and I don't want to miss the rally.";
      startAnalysis(fallbackDecision, fallbackReasoning);
    }
  }, [currentDecision, decisionInput, reasoningInput, startAnalysis, setActiveStep]);

  const activeReflections = currentDecision?.reflections || {};

  const handleGenerateFinal = () => {
    finalizeDecision();
    router.push("/final");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Progress Sidebar (Current = 4) */}
          <ProgressSidebar currentStepNumber={4} />

          {/* Main Reflection Workspace */}
          <div className="flex-1 w-full space-y-8 min-w-0">
            {/* Header */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold tracking-wider uppercase">
                <Brain size={13} className="text-purple-400" />
                <span>Deep Self-Guided Inquiry</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                REFLECTION
              </h1>
              <p className="text-lg font-semibold text-purple-300">
                Take a moment to reflect.
              </p>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                Here are some important questions to help you think more deeply about your decision.
              </p>
            </div>

            {/* Information Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-blue-950/30 to-[#0D1424] border border-purple-500/30 backdrop-blur-md flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 mt-0.5">
                <Info size={16} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">
                  There are no right or wrong answers.
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  This is strictly for your own thinking. Write as much or as little as you like. You are not required to fill every field.
                </p>
              </div>
            </div>

            {/* 4 Reflection Question Cards */}
            <div className="space-y-5">
              {REFLECTION_QUESTIONS.map((q, idx) => {
                const answer = activeReflections[q.id] || "";
                return (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    index={idx}
                    value={answer}
                    onChange={(val) => saveReflectionAnswer(q.id, val)}
                  />
                );
              })}
            </div>

            {/* Navigation Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
              <Button
                variant="outline"
                size="md"
                leftIcon={<ArrowLeft size={16} />}
                onClick={() => router.push("/results")}
                className="w-full sm:w-auto text-slate-300 hover:text-white"
              >
                ← Back to Results
              </Button>

              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight size={18} />}
                onClick={handleGenerateFinal}
                className="w-full sm:w-auto px-8 py-3.5 shadow-lg shadow-purple-900/50 hover:shadow-purple-600/50 font-semibold"
              >
                Generate Final Reflection →
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
