"use client";

import React, { useState } from "react";
import { Sparkles, HelpCircle, CheckCircle2 } from "lucide-react";
import { ReflectionQuestion } from "@/types/decision";

interface QuestionCardProps {
  question: ReflectionQuestion;
  index: number;
  value: string;
  onChange: (value: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  value,
  onChange,
}) => {
  const maxLength = 500;
  const currentLength = value ? value.length : 0;
  const isFilled = currentLength > 0;

  const sparkSnippets = [
    "I haven't verified if...",
    "One major risk I should prepare for is...",
    "An alternative path could be...",
    "My absolute boundary on this is...",
  ];

  const handleSparkIdea = () => {
    const snippet = sparkSnippets[index % sparkSnippets.length];
    if (!value) {
      onChange(snippet + " ");
    } else {
      onChange(value + " " + snippet + " ");
    }
  };

  return (
    <div
      className={`rounded-2xl p-5 sm:p-6 transition-all duration-300 ${
        isFilled
          ? "bg-[#0D1424]/90 border border-purple-500/35 shadow-lg shadow-purple-950/20"
          : "bg-[#0D1424]/70 border border-white/[0.08] hover:border-white/20"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300 font-mono text-xs font-bold border border-purple-500/30">
            0{index + 1}
          </span>
          <span className="text-xs font-bold tracking-wider uppercase text-purple-400">
            Focus: {question.suggestedFocus}
          </span>
        </div>

        {isFilled && (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle2 size={13} />
            <span>Reflected</span>
          </span>
        )}
      </div>

      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mb-1.5">
        {question.question}
      </h3>

      <p className="text-xs sm:text-sm text-slate-400 mb-4 leading-relaxed">
        {question.helper}
      </p>

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= maxLength) {
              onChange(e.target.value);
            }
          }}
          placeholder="Type your thoughts here... (Take your time, there are no right or wrong answers)"
          rows={4}
          className="w-full rounded-xl bg-[#070B14] border border-white/10 p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all resize-y"
          aria-label={question.question}
        />

        <div className="flex items-center justify-between mt-2 text-xs">
          <button
            type="button"
            onClick={handleSparkIdea}
            className="flex items-center gap-1 text-[11px] font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <Sparkles size={12} />
            <span>Spark an idea</span>
          </button>

          <span
            className={`font-mono text-xs ${
              currentLength >= maxLength
                ? "text-red-400 font-semibold"
                : currentLength > 400
                ? "text-amber-400"
                : "text-slate-500"
            }`}
          >
            {currentLength} / {maxLength}
          </span>
        </div>
      </div>
    </div>
  );
};
