from typing import List, Optional
from app.agents.reflection_agent import ReflectionAgent
from app.db.repositories.analysis_repository import analysis_repo
from app.db.repositories.reflection_repository import reflection_repo
from app.llm.base_provider import BaseLLMProvider
from app.llm.groq_provider import GroqProvider
from app.schemas.reflection import AnswerItem, FinalReflectionOutput, ReflectionResponse, ReflectionSubmitRequest


class ReflectionService:
    def __init__(self, llm_provider: Optional[BaseLLMProvider] = None):
        self.llm_provider = llm_provider or GroqProvider()
        self.reflection_agent = ReflectionAgent(self.llm_provider)

    async def process_reflections(self, payload: ReflectionSubmitRequest) -> ReflectionResponse:
        """Fetch analysis context, run ReflectionAgent, and save final reflection map."""
        analysis_doc = await analysis_repo.get_by_id(payload.analysis_id)
        if not analysis_doc:
            raise ValueError(f"Analysis ID '{payload.analysis_id}' not found.")

        # Run ReflectionAgent
        final_reflection_output = await self.reflection_agent.reflect(
            decision=analysis_doc.decision,
            reasoning=analysis_doc.reasoning,
            blind_spots=analysis_doc.blind_spots,
            key_questions=analysis_doc.key_questions,
            answers=payload.answers,
        )

        # Save to DB
        return await reflection_repo.save_reflection(
            analysis_id=analysis_doc.id,
            decision_id=analysis_doc.decision_id,
            answers=payload.answers,
            final_reflection=final_reflection_output,
        )

    async def get_reflection(self, analysis_id: str) -> Optional[ReflectionResponse]:
        return await reflection_repo.get_by_analysis_id(analysis_id)


reflection_service = ReflectionService()
