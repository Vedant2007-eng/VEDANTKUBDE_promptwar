from abc import ABC
from typing import Optional
from app.core.logging import logger
from app.llm.base_provider import BaseLLMProvider
from app.schemas.analysis import AgentResult
from app.utils.prompts import AGENT_SYSTEM_PROMPTS


class BaseAgent(ABC):
    def __init__(
        self,
        agent_id: str,
        name: str,
        category: str,
        llm_provider: BaseLLMProvider,
        system_prompt: Optional[str] = None,
    ):
        self.agent_id = agent_id
        self.name = name
        self.category = category
        self.llm_provider = llm_provider
        self.system_prompt = system_prompt or AGENT_SYSTEM_PROMPTS.get(agent_id, "")

    async def analyze(self, decision: str, reasoning: str) -> AgentResult:
        """Run perspective analysis on the user's decision and reasoning."""
        user_content = (
            f"DECISION UNDER CONSIDERATION:\n\"{decision}\"\n\n"
            f"STATED REASONING & THOUGHTS:\n\"{reasoning or 'No detailed reasoning provided.'}\"\n\n"
            f"Please analyze this strictly from your perspective: {self.name}."
        )

        try:
            logger.info("Agent [%s] starting analysis...", self.agent_id)
            result = await self.llm_provider.generate_json(
                system_prompt=self.system_prompt,
                user_prompt=user_content,
                response_model=AgentResult,
            )
            # Ensure agent ID matches
            result.agent = self.agent_id
            result.status = "completed"
            logger.info("Agent [%s] completed analysis with severity=%s", self.agent_id, result.severity)
            return result
        except Exception as e:
            logger.error("Agent [%s] execution failed: %s", self.agent_id, str(e))
            return AgentResult(
                agent=self.agent_id,
                finding=f"Assessment of {self.name} yielded an evaluation error.",
                severity="medium",
                explanation=f"Agent analysis encountered unexpected friction: {str(e)}",
                question=f"What aspects of {self.name} deserve direct personal review?",
                confidence=0.5,
                status="failed",
                error=str(e),
            )
