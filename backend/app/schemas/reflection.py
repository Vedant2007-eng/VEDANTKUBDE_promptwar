from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from app.schemas.analysis import ReflectionCoverage


class AnswerItem(BaseModel):
    question_id: str = Field(..., description="ID of question being reflected upon (e.g. q1, q2)")
    answer: str = Field(default="", max_length=1500, description="User's reflection text")


class ReflectionSubmitRequest(BaseModel):
    analysis_id: str
    answers: List[AnswerItem]


class FinalReflectionOutput(BaseModel):
    supported_reasoning: str = Field(..., description="Elements of reasoning that hold merit")
    what_is_uncertain: str = Field(..., description="Variables remaining unpredictable")
    main_blind_spots: str = Field(..., description="Summary of core unhedged gaps")
    what_reflection_added: str = Field(..., description="Specific insights gained from reflection answers")
    updated_perspective: str = Field(..., description="Cohesive synthesis of user's updated stance")
    coverage: ReflectionCoverage = Field(default_factory=ReflectionCoverage)


class ReflectionResponse(BaseModel):
    id: str
    analysis_id: str
    decision_id: str
    answers: List[AnswerItem]
    final_reflection: FinalReflectionOutput
    created_at: str
