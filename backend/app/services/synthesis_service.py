from typing import Dict, Any, Optional
from app.agents.synthesis_agent import SynthesisAgent
from app.db.repositories.analysis_repository import analysis_repo
from app.llm.base_provider import BaseLLMProvider
from app.llm.groq_provider import GroqProvider
from app.schemas.analysis import AgentResult, SynthesisOutput


class SynthesisService:
    def __init__(self, llm_provider: Optional[BaseLLMProvider] = None):
        self.llm_provider = llm_provider or GroqProvider()
        self.synthesis_agent = SynthesisAgent(self.llm_provider)

    async def execute_synthesis(
        self,
        analysis_id: str,
        decision: str,
        reasoning: str,
        agent_results: Dict[str, AgentResult],
    ) -> SynthesisOutput:
        """Run synthesis on 15 agent outputs and persist results."""
        synthesis_output = await self.synthesis_agent.synthesize(
            decision=decision,
            reasoning=reasoning,
            agent_results=agent_results,
        )

        # Save to database
        await analysis_repo.complete_analysis(analysis_id, synthesis_output.model_dump())
        return synthesis_output


synthesis_service = SynthesisService()
