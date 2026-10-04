import json
from typing import Dict, Any, List
from app.core.logging import logger
from app.llm.base_provider import BaseLLMProvider
from app.schemas.analysis import AgentResult, SynthesisOutput
from app.utils.prompts import SYNTHESIS_SYSTEM_PROMPT


class SynthesisAgent:
    def __init__(self, llm_provider: BaseLLMProvider):
        self.llm_provider = llm_provider
        self.system_prompt = SYNTHESIS_SYSTEM_PROMPT

    async def synthesize(
        self,
        decision: str,
        reasoning: str,
        agent_results: Dict[str, AgentResult],
    ) -> SynthesisOutput:
        """Combine 15 agent findings into ranked blind spots, risks, assumptions, and executive summary."""
        # Format agent findings concisely
        findings_summary = []
        for agent_id, result in agent_results.items():
            findings_summary.append(
                f"- Perspective [{agent_id.upper()}]: Finding: \"{result.finding}\" | "
                f"Severity: {result.severity} | Key Question: \"{result.question}\""
            )

        user_content = (
            f"TARGET DECISION:\n\"{decision}\"\n\n"
            f"STATED REASONING:\n\"{reasoning}\"\n\n"
            f"15 PERSPECTIVE AUDIT FINDINGS:\n" + "\n".join(findings_summary) + "\n\n"
            "Please synthesize these into ranked top blind spots, risks, challenged assumptions, "
            "missing context items, key questions, and reflection coverage."
        )

        try:
            logger.info("SynthesisAgent starting cross-perspective synthesis...")
            output = await self.llm_provider.generate_json(
                system_prompt=self.system_prompt,
                user_prompt=user_content,
                response_model=SynthesisOutput,
            )
            # Attach individual perspective findings
            output.perspectives = {k: v.model_dump() for k, v in agent_results.items()}
            logger.info("SynthesisAgent completed successfully with %d blind spots", len(output.blind_spots))
            return output
        except Exception as e:
            logger.error("SynthesisAgent failed (%s), returning fallback synthesis", str(e))
            from app.llm.groq_provider import GroqProvider
            return GroqProvider()._generate_fallback(self.system_prompt, user_content, SynthesisOutput)
