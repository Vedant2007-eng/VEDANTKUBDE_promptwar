export type PerspectiveId =
  | "goal"
  | "requirements"
  | "costResources"
  | "benefits"
  | "risks"
  | "uncertainty"
  | "assumptions"
  | "evidence"
  | "alternatives"
  | "timeHorizon"
  | "tradeoffs"
  | "stakeholders"
  | "cognitiveBiases"
  | "reversibility"
  | "opportunityCost";

export type AgentStatus = "Pending" | "Analyzing..." | "Completed";

export type SeverityLevel = "low" | "medium" | "high";

export interface AgentStructuredOutput {
  finding: string;
  severity: SeverityLevel;
  explanation: string;
  question: string;
  confidence: number;
}

export interface AgentMeta {
  id: PerspectiveId;
  name: string;
  number: number;
  category: "Strategic" | "Resources & Risks" | "Validation" | "Systemic & Future";
  iconName: string;
  description: string;
}

export interface BlindSpotItem {
  id: string;
  title: string;
  severity: SeverityLevel;
  explanation: string;
  relatedPerspective: string;
}

export interface ReflectionQuestion {
  id: string;
  question: string;
  helper: string;
  suggestedFocus: string;
}

export interface DecisionAnalysisMap {
  goal: string;
  requirements: string;
  costResources: string;
  benefits: string;
  risks: string;
  uncertainty: string;
  assumptions: string;
  evidence: string;
  alternatives: string;
  timeHorizon: string;
  tradeoffs: string;
  stakeholders: string;
  cognitiveBiases: string;
  reversibility: string;
  opportunityCost: string;
}

export interface DecisionMetrics {
  blindSpotsCount: number;
  risksCount: number;
  assumptionsCount: number;
  missingInfoCount: number;
}

export interface ReflectionCoverage {
  evidence: number;
  risks: number;
  alternatives: number;
  assumptions: number;
  uncertainty: number;
}

export interface KeyInsights {
  supportedReasoning: string;
  whatIsUncertain: string;
  mainBlindSpots: string;
  whatReflectionAdded: string;
}

export interface DecisionData {
  id: string;
  createdAt: number;
  title?: string;
  decision: string;
  reasoning: string;
  analysis: DecisionAnalysisMap;
  detailedAnalysis: Record<PerspectiveId, AgentStructuredOutput>;
  blindSpots: BlindSpotItem[];
  questions: string[];
  reflections: Record<string, string>;
  coverage: ReflectionCoverage;
  metrics: DecisionMetrics;
  insights?: KeyInsights;
  updatedPerspective?: string;
}

export interface ExampleDecision {
  title: string;
  category: string;
  decision: string;
  reasoning: string;
}
