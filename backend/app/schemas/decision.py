from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class DecisionBase(BaseModel):
    decision: str = Field(..., min_length=3, max_length=1000, description="The decision being considered")
    reasoning: str = Field(default="", max_length=2000, description="User's initial reasoning or thoughts")


class DecisionCreate(DecisionBase):
    pass


class DecisionUpdate(BaseModel):
    decision: Optional[str] = Field(None, min_length=3, max_length=1000)
    reasoning: Optional[str] = Field(None, max_length=2000)


class DecisionResponse(DecisionBase):
    id: str
    user_id: Optional[str] = "anonymous"
    created_at: str
    updated_at: str

    model_config = {"from_attributes": True}


class DecisionListResponse(BaseModel):
    total: int
    decisions: List[DecisionResponse]
