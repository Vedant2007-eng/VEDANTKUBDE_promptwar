"use client";

import React, { useState } from "react";
import { Edit3, Check, X, Sparkles, MessageSquareQuote } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDecision } from "@/context/DecisionContext";

interface DecisionCardProps {
  decision: string;
  reasoning: string;
  allowEdit?: boolean;
  className?: string;
  onEdited?: (newDecision: string, newReasoning: string) => void;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({
  decision,
  reasoning,
  allowEdit = true,
  className = "",
  onEdited,
}) => {
  const { setDecisionInput, setReasoningInput, startAnalysis } = useDecision();
  const [isEditing, setIsEditing] = useState(false);
  const [editDecisionText, setEditDecisionText] = useState(decision);
  const [editReasoningText, setEditReasoningText] = useState(reasoning);

  const handleSave = () => {
    if (editDecisionText.trim()) {
      setDecisionInput(editDecisionText);
      setReasoningInput(editReasoningText);
      if (onEdited) {
        onEdited(editDecisionText, editReasoningText);
      } else {
        startAnalysis(editDecisionText, editReasoningText);
      }
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditDecisionText(decision);
    setEditReasoningText(reasoning);
    setIsEditing(false);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#10182A]/90 to-[#0D1424]/90 border border-purple-500/25 p-5 sm:p-6 backdrop-blur-xl shadow-xl shadow-purple-950/20 ${className}`}
    >
      {/* Decorative gradient corner glow */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-purple-600/15 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <MessageSquareQuote size={15} />
          </span>
          <span className="text-xs font-bold tracking-wider uppercase text-purple-400">
            Target Decision Under Examination
          </span>
        </div>

        {allowEdit && !isEditing && (
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Edit3 size={14} />}
            onClick={() => {
              setEditDecisionText(decision);
              setEditReasoningText(reasoning);
              setIsEditing(true);
            }}
            className="text-xs text-slate-400 hover:text-purple-300 hover:bg-purple-500/10 -mt-1 -mr-1"
          >
            Edit
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4 pt-1 animate-in fade-in duration-200">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Decision
            </label>
            <textarea
              value={editDecisionText}
              onChange={(e) => setEditDecisionText(e.target.value)}
              className="w-full rounded-xl bg-[#070B14] border border-purple-500/40 p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Reasoning & Assumptions
            </label>
            <textarea
              value={editReasoningText}
              onChange={(e) => setEditReasoningText(e.target.value)}
              className="w-full rounded-xl bg-[#070B14] border border-purple-500/40 p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<X size={14} />}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Check size={14} />}
              onClick={handleSave}
            >
              Update & Re-evaluate
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
            &ldquo;{decision}&rdquo;
          </h2>
          {reasoning && (
            <p className="text-sm text-slate-300 leading-relaxed bg-[#070B14]/60 p-3 rounded-xl border border-white/5">
              <span className="text-xs font-semibold text-slate-400 block mb-0.5">
                Current Stated Reasoning:
              </span>
              {reasoning}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
