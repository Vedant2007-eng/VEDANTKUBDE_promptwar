"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  DecisionData, 
  KeyInsights, 
  ReflectionCoverage 
} from "@/types/decision";
import { 
  calculateCoverage, 
  generateInsights, 
  generateUpdatedPerspective, 
  mockAnalysis 
} from "@/data/mockAnalysis";
import { 
  startBackendAnalysis, 
  fetchFullBackendAnalysis, 
  submitBackendReflections 
} from "@/lib/api";

interface DecisionContextType {
  decisionInput: string;
  reasoningInput: string;
  setDecisionInput: (val: string) => void;
  setReasoningInput: (val: string) => void;
  
  currentDecision: DecisionData | null;
  savedDecisions: DecisionData[];
  
  startAnalysis: (decision?: string, reasoning?: string) => Promise<DecisionData>;
  saveReflectionAnswer: (questionId: string, answer: string) => void;
  finalizeDecision: () => Promise<void>;
  resetDecision: () => void;
  loadDecision: (decision: DecisionData) => void;
  deleteSavedDecision: (id: string) => void;
  
  isAnalyzing: boolean;
  setIsAnalyzing: (val: boolean) => void;
  
  activeStep: number;
  setActiveStep: (step: number) => void;
  
  theme: "dark" | "midnight";
  toggleTheme: () => void;
}

const DecisionContext = createContext<DecisionContextType | undefined>(undefined);

const STORAGE_KEY_CURRENT = "blindspot_current_decision";
const STORAGE_KEY_SAVED = "blindspot_saved_decisions";
const STORAGE_KEY_THEME = "blindspot_theme";

export const DecisionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [decisionInput, setDecisionInput] = useState<string>("");
  const [reasoningInput, setReasoningInput] = useState<string>("");
  const [currentDecision, setCurrentDecision] = useState<DecisionData | null>(null);
  const [savedDecisions, setSavedDecisions] = useState<DecisionData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [theme, setTheme] = useState<"dark" | "midnight">("dark");
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const storedCurrent = localStorage.getItem(STORAGE_KEY_CURRENT);
      if (storedCurrent) {
        const parsed = JSON.parse(storedCurrent) as DecisionData;
        setCurrentDecision(parsed);
        setDecisionInput(parsed.decision);
        setReasoningInput(parsed.reasoning);
      }

      const storedSaved = localStorage.getItem(STORAGE_KEY_SAVED);
      if (storedSaved) {
        setSavedDecisions(JSON.parse(storedSaved));
      }

      const storedTheme = localStorage.getItem(STORAGE_KEY_THEME) as "dark" | "midnight";
      if (storedTheme) {
        setTheme(storedTheme);
      }
    } catch (e) {
      console.error("Failed to hydrate decision storage", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save current decision
  useEffect(() => {
    if (!isHydrated) return;
    try {
      if (currentDecision) {
        localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(currentDecision));
      } else {
        localStorage.removeItem(STORAGE_KEY_CURRENT);
      }
    } catch (e) {
      console.error("Failed to store current decision", e);
    }
  }, [currentDecision, isHydrated]);

  // Save list of decisions
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(savedDecisions));
    } catch (e) {
      console.error("Failed to store saved decisions", e);
    }
  }, [savedDecisions, isHydrated]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "midnight" : "dark";
    setTheme(next);
    localStorage.setItem(STORAGE_KEY_THEME, next);
  };

  const startAnalysis = async (decisionOverride?: string, reasoningOverride?: string): Promise<DecisionData> => {
    const d = (decisionOverride ?? decisionInput).trim();
    const r = (reasoningOverride ?? reasoningInput).trim();
    
    setIsAnalyzing(true);

    // 1. Attempt backend API analysis
    let analysisResult: DecisionData | null = null;
    const backendStart = await startBackendAnalysis(d, r);

    if (backendStart?.analysis_id) {
      // Fetch full backend analysis
      analysisResult = await fetchFullBackendAnalysis(backendStart.analysis_id);
    }

    // 2. Fallback to resilient client engine if backend is starting or offline
    if (!analysisResult) {
      analysisResult = mockAnalysis(d, r);
    }

    setCurrentDecision(analysisResult);
    setIsAnalyzing(false);
    setActiveStep(2);
    return analysisResult;
  };

  const saveReflectionAnswer = (questionId: string, answer: string) => {
    if (!currentDecision) return;

    const updatedReflections = {
      ...currentDecision.reflections,
      [questionId]: answer,
    };

    const newCoverage = calculateCoverage(updatedReflections);

    const updatedData: DecisionData = {
      ...currentDecision,
      reflections: updatedReflections,
      coverage: newCoverage,
    };

    // Recompute insights and updated perspective
    updatedData.insights = generateInsights(updatedData);
    updatedData.updatedPerspective = generateUpdatedPerspective(updatedData);

    setCurrentDecision(updatedData);
  };

  const finalizeDecision = async () => {
    if (!currentDecision) return;

    // 1. Attempt backend reflection synthesis
    let backendResult: {
      insights: KeyInsights;
      updatedPerspective: string;
      coverage: ReflectionCoverage;
    } | null = null;

    if (currentDecision.id && !currentDecision.id.startsWith("dec-")) {
      backendResult = await submitBackendReflections(
        currentDecision.id,
        currentDecision.reflections || {}
      );
    }

    const insights = backendResult?.insights || generateInsights(currentDecision);
    const updatedPerspective = backendResult?.updatedPerspective || generateUpdatedPerspective(currentDecision);
    const coverage = backendResult?.coverage || currentDecision.coverage;

    const finalized: DecisionData = {
      ...currentDecision,
      insights,
      updatedPerspective,
      coverage,
    };

    setCurrentDecision(finalized);
    setActiveStep(5);

    // Persist to savedDecisions
    setSavedDecisions((prev) => {
      const filtered = prev.filter((item) => item.id !== finalized.id);
      return [finalized, ...filtered];
    });
  };

  const resetDecision = () => {
    setCurrentDecision(null);
    setDecisionInput("");
    setReasoningInput("");
    setActiveStep(1);
    try {
      localStorage.removeItem(STORAGE_KEY_CURRENT);
    } catch {}
  };

  const loadDecision = (decision: DecisionData) => {
    setCurrentDecision(decision);
    setDecisionInput(decision.decision);
    setReasoningInput(decision.reasoning);
  };

  const deleteSavedDecision = (id: string) => {
    setSavedDecisions((prev) => prev.filter((item) => item.id !== id));
    if (currentDecision?.id === id) {
      resetDecision();
    }
  };

  return (
    <DecisionContext.Provider
      value={{
        decisionInput,
        reasoningInput,
        setDecisionInput,
        setReasoningInput,
        currentDecision,
        savedDecisions,
        startAnalysis,
        saveReflectionAnswer,
        finalizeDecision,
        resetDecision,
        loadDecision,
        deleteSavedDecision,
        isAnalyzing,
        setIsAnalyzing,
        activeStep,
        setActiveStep,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </DecisionContext.Provider>
  );
};

export const useDecision = () => {
  const context = useContext(DecisionContext);
  if (!context) {
    throw new Error("useDecision must be used within a DecisionProvider");
  }
  return context;
};
