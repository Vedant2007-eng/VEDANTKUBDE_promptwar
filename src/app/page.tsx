"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, 
  Sparkles, 
  Lightbulb, 
  ShieldCheck, 
  BrainCircuit, 
  Layers, 
  Compass, 
  Check, 
  Eye,
  Activity
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { useDecision } from "@/context/DecisionContext";
import { EXAMPLE_DECISIONS } from "@/data/mockAnalysis";

export default function InputPage() {
  const router = useRouter();
  const { 
    decisionInput, 
    setDecisionInput, 
    reasoningInput, 
    setReasoningInput, 
    startAnalysis 
  } = useDecision();

  const [activeExampleIndex, setActiveExampleIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelectExample = (index: number) => {
    const example = EXAMPLE_DECISIONS[index];
    setActiveExampleIndex(index);
    setDecisionInput(example.decision);
    setReasoningInput(example.reasoning);
    setError(null);
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decisionInput.trim()) {
      setError("Please describe the decision you are considering.");
      return;
    }

    startAnalysis(decisionInput, reasoningInput);
    router.push("/analyze");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold tracking-wider uppercase animate-in fade-in duration-300">
            <Sparkles size={13} className="text-cyan-400" />
            <span>AI THINKING COMPANION</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Think deeper. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-300">
              Decide better.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            An AI that finds what you might be missing before you make an important decision —{" "}
            <span className="text-purple-300 font-semibold underline decoration-purple-500/40 underline-offset-4">
              without deciding for you.
            </span>
          </p>
        </section>

        {/* Main Input Card */}
        <section className="relative">
          {/* Subtle background glow */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-600/30 via-blue-600/20 to-cyan-600/30 opacity-40 blur-xl pointer-events-none" />

          <div className="relative rounded-3xl bg-[#0D1424]/90 border border-white/10 p-6 sm:p-10 backdrop-blur-xl shadow-2xl shadow-purple-950/40">
            <form onSubmit={handleAnalyze} className="space-y-6">
              {/* Field 1: Decision */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="decision-input"
                    className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300 text-xs font-mono">
                      1
                    </span>
                    What decision are you thinking about?
                  </label>
                </div>
                <p className="text-xs sm:text-sm text-slate-400">
                  Describe the decision or situation you&apos;re considering.
                </p>
                <textarea
                  id="decision-input"
                  value={decisionInput}
                  onChange={(e) => {
                    setDecisionInput(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="I'm thinking about..."
                  rows={3}
                  className="w-full rounded-2xl bg-[#070B14] border border-white/15 p-4 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all shadow-inner resize-y"
                  required
                />
              </div>

              {/* Field 2: Reasoning */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="reasoning-input"
                    className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300 text-xs font-mono">
                      2
                    </span>
                    Why are you leaning this way?
                  </label>
                </div>
                <p className="text-xs sm:text-sm text-slate-400">
                  Share your current reasoning, thoughts, or concerns.
                </p>
                <textarea
                  id="reasoning-input"
                  value={reasoningInput}
                  onChange={(e) => setReasoningInput(e.target.value)}
                  placeholder="I think this because..."
                  rows={4}
                  className="w-full rounded-2xl bg-[#070B14] border border-white/15 p-4 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all shadow-inner resize-y"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs sm:text-sm text-red-300 font-medium">
                  {error}
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                  <span>15 AI perspectives stress-test your logic</span>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  variant="primary"
                  rightIcon={<ArrowRight size={18} />}
                  className="w-full sm:w-auto px-8 py-4 text-base font-semibold shadow-purple-900/50 hover:shadow-purple-600/50"
                >
                  Analyze My Thinking →
                </Button>
              </div>
            </form>

            {/* Example Decisions Section */}
            <div id="examples" className="mt-10 pt-8 border-t border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb size={16} className="text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Or test with an example decision:
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {EXAMPLE_DECISIONS.map((ex, idx) => {
                  const isSelected = activeExampleIndex === idx;
                  return (
                    <button
                      key={ex.title}
                      type="button"
                      onClick={() => handleSelectExample(idx)}
                      className={`text-xs sm:text-sm font-medium px-3.5 py-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? "bg-purple-600/20 border-purple-400 text-purple-200 shadow-sm shadow-purple-900/40"
                          : "bg-[#10182A] border-white/10 text-slate-300 hover:border-purple-400/30 hover:bg-[#152038] hover:text-white"
                      }`}
                    >
                      {isSelected && <Check size={14} className="text-cyan-400" />}
                      <span>&ldquo;{ex.title}&rdquo;</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="mt-16 sm:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0D1424]/60 border border-white/10 backdrop-blur-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 mb-4">
              <Eye size={20} />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">
              15 Cognitive Perspectives
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Examines costs, reversibility, evidence, cognitive biases, alternatives, and opportunity cost in parallel.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0D1424]/60 border border-white/10 backdrop-blur-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 mb-4">
              <BrainCircuit size={20} />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">
              Zero Automated Decisions
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Never tells you what to do. Asks penetrating questions that force you to reflect on unexamined risks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0D1424]/60 border border-white/10 backdrop-blur-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 mb-4">
              <Compass size={20} />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">
              Final Decision Map
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Synthesizes your answers into a structured decision brief, reflection coverage score, and updated perspective.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
