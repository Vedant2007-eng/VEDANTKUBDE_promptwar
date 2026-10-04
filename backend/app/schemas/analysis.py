from typing import Dict, List, Literal, Optional, Any
from pydantic import BaseModel, Field


SeverityLevel = Literal["low", "medium", "high"]
AnalysisStatus = Literal["pending", "analyzing", "completed", "failed"]


class AgentResult(BaseModel):
    agent: str = Field(..., description="Unique agent identifier (e.g. goal, risks, assumptions)")
    finding: str = Field(..., description="Key observation or critical finding")
    severity: SeverityLevel = Field(default="medium", description="Evaluated severity or impact")
    explanation: str = Field(..., description="In-depth rationale behind the finding")
    question: str = Field(..., description="Targeted question to stimulate user reflection")
    confidence: float = Field(default=0.85, ge=0.0, le=1.0, description="Confidence metric (0.0 to 1.0)")
    status: Literal["completed", "failed", "pending", "analyzing"] = "completed"
    error: Optional[str] = None


class BlindSpot(BaseModel):
    title: str = Field(..., description="Concise title of the blind spot")
    description: str = Field(..., description="Detailed explanation of the cognitive gap")
    severity: SeverityLevel = Field(default="medium")
    related_agents: List[str] = Field(default_factory=list, description="Associated perspective agents")


class ReflectionCoverage(BaseModel):
    evidence: float = Field(default=0.68, ge=0.0, le=1.0, description="Breadth of empirical evidence examined")
    risks: float = Field(default=0.72, ge=0.0, le=1.0, description="Breadth of downside risk scenarios evaluated")
    alternatives: float = Field(default=0.55, ge=0.0, le=1.0, description="Breadth of competing alternatives compared")
    assumptions: float = Field(default=0.80, ge=0.0, le=1.0, description="Breadth of implicit assumptions audited")
    uncertainty: float = Field(default=0.62, ge=0.0, le=1.0, description="Breadth of unknown variables separated")


class SynthesisOutput(BaseModel):
    summary: str = Field(..., description="Concise executive synthesis of reasoning")
    blind_spots: List[BlindSpot] = Field(default_factory=list)
    risks: List[str] = Field(default_factory=list)
    challenged_assumptions: List[str] = Field(default_factory=list)
    missing_information: List[str] = Field(default_factory=list)
    key_questions: List[str] = Field(default_factory=list)
    perspectives: Dict[str, Any] = Field(default_factory=dict)
    reflection_coverage: ReflectionCoverage = Field(default_factory=ReflectionCoverage)


class AnalysisStartRequest(BaseModel):
    decision: str = Field(..., min_length=3, max_length=1000)
    reasoning: str = Field(default="", max_length=2000)


class AnalysisStartResponse(BaseModel):
    analysis_id: str
    decision_id: str
    status: AnalysisStatus = "analyzing"


class AnalysisStatusResponse(BaseModel):
    analysis_id: str
    status: AnalysisStatus
    completed_agents: int
    total_agents: int
    progress: int  # 0 to 100
    current_agent: Optional[str] = None
    error: Optional[str] = None


class AnalysisResponse(BaseModel):
    id: str
    decision_id: str
    decision: str
    reasoning: str
    status: AnalysisStatus
    completed_agents: int = 15
    total_agents: int = 15
    progress: int = 100

    agent_results: Dict[str, AgentResult] = Field(default_factory=dict)
    blind_spots: List[BlindSpot] = Field(default_factory=list)
    risks: List[str] = Field(default_factory=list)
    challenged_assumptions: List[str] = Field(default_factory=list)
    missing_information: List[str] = Field(default_factory=list)
    key_questions: List[str] = Field(default_factory=list)
    summary: str = ""
    reflection_coverage: ReflectionCoverage = Field(default_factory=ReflectionCoverage)

    created_at: str
    completed_at: Optional[str] = None
