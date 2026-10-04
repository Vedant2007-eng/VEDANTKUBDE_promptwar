from typing import List, Dict, Any
from app.core.logging import logger
from app.llm.base_provider import BaseLLMProvider
from app.schemas.analysis import AgentResult, BlindSpot
from app.schemas.reflection import AnswerItem, FinalReflectionOutput
from app.utils.prompts import REFLECTION_SYSTEM_PROMPT


class ReflectionAgent:
    def __init__(self, llm_provider: BaseLLMProvider):
        self.llm_provider = llm_provider
        self.system_prompt = REFLECTION_SYSTEM_PROMPT

    async def reflect(
        self,
        decision: str,
        reasoning: str,
        blind_spots: List[BlindSpot],
        key_questions: List[str],
        answers: List[AnswerItem],
    ) -> FinalReflectionOutput:
        """Synthesize user's reflection answers against the original decision and identified blind spots."""
        blind_spots_text = "\n".join([f"- {bs.title}: {bs.description}" for bs in blind_spots])
        questions_text = "\n".join([f"- {q}" for q in key_questions])
        answers_text = "\n".join([f"- Q[{a.question_id}]: \"{a.answer or 'No answer submitted'}\"" for a in answers])

        user_content = (
            f"ORIGINAL DECISION:\n\"{decision}\"\n\n"
            f"ORIGINAL REASONING:\n\"{reasoning}\"\n\n"
            f"IDENTIFIED BLIND SPOTS:\n{blind_spots_text}\n\n"
            f"KEY QUESTIONS EXPLORED:\n{questions_text}\n\n"
            f"USER'S REFLECTION ANSWERS:\n{answers_text}\n\n"
            "Please analyze how the user's reasoning evolved, summarize what the reflections added, "
            "and craft their updated perspective paragraph."
        )

        try:
            logger.info("ReflectionAgent starting post-reflection synthesis...")
            output = await self.llm_provider.generate_json(
                system_prompt=self.system_prompt,
                user_prompt=user_content,
                response_model=FinalReflectionOutput,
            )
            logger.info("ReflectionAgent completed successfully.")
            return output
        except Exception as e:
            logger.error("ReflectionAgent failed (%s), returning fallback final reflection", str(e))
            from app.llm.groq_provider import GroqProvider
            return GroqProvider()._generate_fallback(self.system_prompt, user_content, FinalReflectionOutput)
