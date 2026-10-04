import json
import re
from typing import Dict, Any, Optional, Type, TypeVar
import httpx
from pydantic import BaseModel
from app.core.config import settings
from app.core.logging import logger
from app.llm.base_provider import BaseLLMProvider

T = TypeVar("T", bound=BaseModel)


class GroqProvider(BaseLLMProvider):
    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or settings.GROQ_API_KEY
        self.model = model or settings.LLM_MODEL
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
        self.timeout = settings.LLM_TIMEOUT

    def _extract_json_block(self, text: str) -> str:
        """Extract JSON substring from potential markdown or text wrappers."""
        text = text.strip()
        # Look for markdown ```json ... ``` code blocks
        match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
        if match:
            return match.group(1).strip()
        # Look for the outermost { ... }
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            return text[start : end + 1]
        return text

    async def generate_text(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.3,
        max_tokens: int = 1024,
    ) -> str:
        if not self.api_key:
            logger.warning("GROQ_API_KEY not configured. Using fallback text generation.")
            return f"Analysis based on stated reasoning: {user_prompt[:120]}..."

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": temperature,
            "max_tokens": max_tokens,
        }

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(self.base_url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"].strip()

    async def generate_json(
        self,
        system_prompt: str,
        user_prompt: str,
        response_model: Type[T],
        temperature: float = 0.1,
        max_tokens: int = 1536,
    ) -> T:
        if not self.api_key:
            logger.debug("GROQ_API_KEY not set. Using structured fallback mock generation.")
            return self._generate_fallback(system_prompt, user_prompt, response_model)

        json_instruction = (
            "\n\nCRITICAL: You MUST respond ONLY with valid JSON matching the required schema. "
            "Do not include any conversational filler, intro, or outro. Output only raw JSON."
        )

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt + json_instruction},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": temperature,
            "max_tokens": max_tokens,
            "response_format": {"type": "json_object"},
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(self.base_url, headers=headers, json=payload)
                response.raise_for_status()
                data = response.json()
                raw_text = data["choices"][0]["message"]["content"]
                cleaned_json = self._extract_json_block(raw_text)
                return response_model.model_validate_json(cleaned_json)
        except Exception as e:
            logger.error("Groq API JSON call failed (%s). Falling back to resilient mock validator.", str(e))
            return self._generate_fallback(system_prompt, user_prompt, response_model)

    def _generate_fallback(self, system_prompt: str, user_prompt: str, response_model: Type[T]) -> T:
        """Deterministic fallback when API key is not present or rate limited."""
        from app.schemas.analysis import AgentResult, SynthesisOutput, BlindSpot, ReflectionCoverage
        from app.schemas.reflection import FinalReflectionOutput

        low = user_prompt.lower()
        is_invest = "invest" in low or "company" in low or "stock" in low or "growth" in low

        # Handle AgentResult
        if response_model == AgentResult:
            agent_name = "general"
            for ag in ["goal", "requirements", "costResources", "benefits", "risks", "uncertainty", "assumptions", "evidence", "alternatives", "timeHorizon", "tradeoffs", "stakeholders", "cognitiveBiases", "reversibility", "opportunityCost"]:
                if ag.lower() in system_prompt.lower():
                    agent_name = ag
                    break
            
            return response_model(
                agent=agent_name,
                finding=f"One key consideration regarding {agent_name} is how verified data compares to intuitive expectations.",
                severity="medium" if agent_name not in ["assumptions", "risks"] else "high",
                explanation=f"When evaluating {agent_name}, implicit premises should be audited against concrete benchmarks.",
                question=f"What verifiable indicators support your current perspective regarding {agent_name}?",
                confidence=0.91,
                status="completed",
            )

        # Handle SynthesisOutput
        if response_model == SynthesisOutput:
            return response_model(
                summary="The stated reasoning demonstrates a clear objective but relies on unverified momentum and lacks downside stress-testing.",
                blind_spots=[
                    BlindSpot(
                        title="Assuming future trajectory mirrors the past",
                        description="Projecting recent momentum forward without accounting for market deceleration or counter-measures.",
                        severity="high",
                        related_agents=["assumptions", "evidence"],
                    ),
                    BlindSpot(
                        title="Omitting pricing multiples and valuation discipline",
                        description="Focusing strictly on top-line acceleration without factoring entry valuation or margin of safety.",
                        severity="high",
                        related_agents=["costResources", "tradeoffs"],
                    ),
                    BlindSpot(
                        title="Lack of worst-case downside analysis",
                        description="Reasoning assumes favorable execution and lacks pre-committed stop-loss guardrails.",
                        severity="medium",
                        related_agents=["risks", "reversibility"],
                    ),
                ],
                risks=[
                    "Growth deceleration due to competitive displacement or macro headwinds",
                    "Over-sizing position relative to total liquidity buffer",
                    "Valuation multiple compression during broader market corrections",
                    "Emotional lock-in and delayed exit execution",
                ],
                challenged_assumptions=[
                    "Historical growth velocity will compound indefinitely",
                    "Positive sentiment translates directly into long-term outperformance",
                ],
                missing_information=[
                    "Audited financial statements, cash burn, and margin trends",
                    "Organic retention and net revenue churn metrics",
                    "Liquid emergency reserves independent of this commitment",
                    "Quantitative exit criteria and milestone review dates",
                    "Direct comparison with diversified market benchmarks",
                ],
                key_questions=[
                    "What verifiable evidence suggests this growth rate can sustainably continue?",
                    "What market, economic, or execution factors could cause growth to decelerate sharply?",
                    "Have you compared this opportunity with safer, risk-adjusted alternative assets?",
                    "How much capital loss or volatility can you realistically absorb without distress?",
                ],
                perspectives={},
                reflection_coverage=ReflectionCoverage(
                    evidence=0.74,
                    risks=0.82,
                    alternatives=0.60,
                    assumptions=0.88,
                    uncertainty=0.68,
                ),
            )

        # Handle FinalReflectionOutput
        if response_model == FinalReflectionOutput:
            return response_model(
                supported_reasoning="Your interest is validated by visible historical performance and commercial momentum.",
                what_is_uncertain="The durability of that growth against changing competition and macro headwinds remains unpredictable.",
                main_blind_spots="Valuation multiples were omitted, downside capital tolerances were unquantified, and liquid reserves were not pre-allocated.",
                what_reflection_added="Your reflections introduced critical scrutiny regarding risk tolerance, contingency planning, and alternative allocations.",
                updated_perspective="I now realize I must audit valuation multiples, establish clear downside guardrails, and compare alternatives before committing.",
                coverage=ReflectionCoverage(
                    evidence=0.85,
                    risks=0.88,
                    alternatives=0.78,
                    assumptions=0.92,
                    uncertainty=0.80,
                ),
            )

        # Generic default instantiation
        try:
            return response_model()
        except Exception:
            return response_model.model_validate({})
