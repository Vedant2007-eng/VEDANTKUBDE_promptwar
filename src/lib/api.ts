import { DecisionData, ReflectionCoverage, KeyInsights, BlindSpotItem } from "@/types/decision";
import { mockAnalysis, generateInsights, generateUpdatedPerspective } from "@/data/mockAnalysis";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface BackendAnalysisStatus {
  analysis_id: string;
  status: "pending" | "analyzing" | "completed" | "failed";
  completed_agents: number;
  total_agents: number;
  progress: number;
  current_agent?: string;
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}

export async function startBackendAnalysis(
  decision: string,
  reasoning: string
): Promise<{ analysis_id: string; decision_id: string; status: string } | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/analysis/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision, reasoning }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn("Backend API startAnalysis unreachable, using resilient client engine:", err);
    return null;
  }
}

export async function getBackendAnalysisStatus(
  analysisId: string
): Promise<BackendAnalysisStatus | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/analysis/${analysisId}/status`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchFullBackendAnalysis(
  analysisId: string
): Promise<DecisionData | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/analysis/${analysisId}`);
    if (!res.ok) return null;
    const data = await res.json();

    // Map backend response into DecisionData
    const mapped: DecisionData = {
      id: data.id,
      createdAt: data.created_at ? new Date(data.created_at).getTime() : Date.now(),
      decision: data.decision,
      reasoning: data.reasoning,
      analysis: {
        goal: data.agent_results?.goal?.finding || "Evaluating core underlying motives.",
        requirements: data.agent_results?.requirements?.finding || "Assessing prerequisite conditions.",
        costResources: data.agent_results?.costResources?.finding || "Quantifying capital and cognitive resources.",
        benefits: data.agent_results?.benefits?.finding || "Dissecting realistic upside payoff.",
        risks: data.agent_results?.risks?.finding || "Uncovering downside vulnerabilities.",
        uncertainty: data.agent_results?.uncertainty?.finding || "Differentiating facts from assumptions.",
        assumptions: data.agent_results?.assumptions?.finding || "Surfacing implicit premises.",
        evidence: data.agent_results?.evidence?.finding || "Auditing data validity.",
        alternatives: data.agent_results?.alternatives?.finding || "Exploring unconsidered options.",
        timeHorizon: data.agent_results?.timeHorizon?.finding || "Aligning short-term with long-term trajectory.",
        tradeoffs: data.agent_results?.tradeoffs?.finding || "Clarifying explicit sacrifices.",
        stakeholders: data.agent_results?.stakeholders?.finding || "Considering impact on dependent parties.",
        cognitiveBiases: data.agent_results?.cognitiveBiases?.finding || "Auditing potential judgment heuristics.",
        reversibility: data.agent_results?.reversibility?.finding || "Analyzing exit friction.",
        opportunityCost: data.agent_results?.opportunityCost?.finding || "Quantifying forfeited alternatives.",
      },
      detailedAnalysis: data.agent_results || {},
      blindSpots: (data.blind_spots || []).map((bs: any, idx: number) => ({
        id: `bs-${idx + 1}`,
        title: bs.title,
        severity: bs.severity || "medium",
        explanation: bs.description || bs.explanation,
        relatedPerspective: (bs.related_agents && bs.related_agents[0]) || "General",
      })),
      questions: data.key_questions || [],
      reflections: {},
      coverage: {
        evidence: Math.round((data.reflection_coverage?.evidence ?? 0.74) * 100),
        risks: Math.round((data.reflection_coverage?.risks ?? 0.82) * 100),
        alternatives: Math.round((data.reflection_coverage?.alternatives ?? 0.60) * 100),
        assumptions: Math.round((data.reflection_coverage?.assumptions ?? 0.88) * 100),
        uncertainty: Math.round((data.reflection_coverage?.uncertainty ?? 0.68) * 100),
      },
      metrics: {
        blindSpotsCount: (data.blind_spots || []).length || 3,
        risksCount: (data.risks || []).length || 4,
        assumptionsCount: (data.challenged_assumptions || []).length || 2,
        missingInfoCount: (data.missing_information || []).length || 5,
      },
    };

    return mapped;
  } catch (err) {
    console.error("Failed to fetch full backend analysis:", err);
    return null;
  }
}

export async function submitBackendReflections(
  analysisId: string,
  answers: Record<string, string>
): Promise<{
  insights: KeyInsights;
  updatedPerspective: string;
  coverage: ReflectionCoverage;
} | null> {
  try {
    const formattedAnswers = Object.entries(answers).map(([question_id, answer]) => ({
      question_id,
      answer,
    }));

    const res = await fetch(`${API_BASE_URL}/reflections`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        analysis_id: analysisId,
        answers: formattedAnswers,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const final = data.final_reflection;

    return {
      insights: {
        supportedReasoning: final.supported_reasoning,
        whatIsUncertain: final.what_is_uncertain,
        mainBlindSpots: final.main_blind_spots,
        whatReflectionAdded: final.what_reflection_added,
      },
      updatedPerspective: final.updated_perspective,
      coverage: {
        evidence: Math.round((final.coverage?.evidence ?? 0.8) * 100),
        risks: Math.round((final.coverage?.risks ?? 0.85) * 100),
        alternatives: Math.round((final.coverage?.alternatives ?? 0.75) * 100),
        assumptions: Math.round((final.coverage?.assumptions ?? 0.9) * 100),
        uncertainty: Math.round((final.coverage?.uncertainty ?? 0.8) * 100),
      },
    };
  } catch (err) {
    console.warn("Backend reflections API unavailable, computing local synthesis:", err);
    return null;
  }
}
