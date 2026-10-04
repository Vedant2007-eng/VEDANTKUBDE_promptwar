from typing import Dict, List, Any
from pydantic import BaseModel, Field
from app.schemas.analysis import AgentResult, BlindSpot, ReflectionCoverage
from app.schemas.reflection import AnswerItem, FinalReflectionOutput


class ReportData(BaseModel):
    title: str = "BlindSpot AI — Decision Analysis Report"
    tagline: str = "Think deeper. Decide better."
    generated_at: str

    # Original Inputs
    original_decision: str
    original_reasoning: str

    # Synthesis & Audit
    executive_summary: str
    top_blind_spots: List[BlindSpot]
    risks: List[str]
    challenged_assumptions: List[str]
    missing_information: List[str]
    key_questions: List[str]

    # 15 Perspective Findings
    perspective_findings: Dict[str, AgentResult]

    # User Reflections
    user_reflections: List[AnswerItem]

    # Final Map
    final_insights: FinalReflectionOutput
    reflection_coverage: ReflectionCoverage

    # Non-coercion statement
    final_principle: str = (
        "This analysis is meant to help you think more deeply. "
        "BlindSpot AI never tells you what to choose. "
        "The final decision always belongs to you."
    )
