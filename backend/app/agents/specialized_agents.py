from app.agents.base_agent import BaseAgent
from app.llm.base_provider import BaseLLMProvider


class GoalAgent(BaseAgent):
    def __init__(self, llm_provider: BaseLLMProvider):
        super().__init__(
            agent_id="goal",
            name="Goal",
            category="Strategic",
            llm_provider=llm_provider,
        )


class RequirementsAgent(BaseAgent):
    def __init__(self, llm_provider: BaseLLMProvider):
        super().__init__(
            agent_id="requirements",
            name="Requirements",
            category="Strategic",
            llm_provider=llm_provider,
        )


class CostAgent(BaseAgent):
    def __init__(self, llm_provider: BaseLLMProvider):
        super().__init__(
            agent_id="costResources",
            name="Cost / Resources",
            category="Resources & Risks",
            llm_provider=llm_provider,
        )


class BenefitsAgent(BaseAgent):
    def __init__(self, llm_provider: BaseLLMProvider):
        super().__init__(
            agent_id="benefits",
            name="Benefits / Expected Value",
            category="Strategic",
            llm_provider=llm_provider,
        )


class RisksAgent(BaseAgent):
    def __init__(self, llm_provider: BaseLLMProvider):
        super().__init__(
            agent_id="risks",
            name="Risks",
            category="Resources & Risks",
            llm_provider=llm_provider,
        )


class UncertaintyAgent(BaseAgent):
    def __init__(self, llm_provider: BaseLLMProvider):
        super().__init__(
            agent_id="uncertainty",
            name="Uncertainty",
            category="Resources & Risks",
            llm_provider=llm_provider,
        )


class AssumptionsAgent(BaseAgent):
    def __init__(self, llm_provider: BaseLLMProvider):
        super().__init__(
            agent_id="assumptions",
            name="Assumptions",
            category="Validation",
            llm_provider=llm_provider,
        )


class EvidenceAgent(BaseAgent):
    def __init__(self, llm_provider: BaseLLMProvider):
        super().__init__(
            agent_id="evidence",
            name="Evidence",
            category="Validation",
            llm_provider=llm_provider,
        )


class AlternativesAgent(BaseAgent):
    def __init__(self, llm_provider: BaseLLMProvider):
        super().__init__(
            agent_id="alternatives",
            name="Alternatives",
            category="Validation",
            llm_provider=llm_provider,
        )


class TimeHorizonAgent(BaseAgent):
    def __init__(self, llm_provider: BaseLLMProvider):
        super().__init__(
            agent_id="timeHorizon",
            name="Time Horizon",
            category="Systemic & Future",
            llm_provider=llm_provider,
        )


class TradeoffsAgent(BaseAgent):
    def __init__(self, llm_provider: BaseLLMProvider):
        super().__init__(
            agent_id="tradeoffs",
            name="Trade-offs",
            category="Systemic & Future",
            llm_provider=llm_provider,
        )


class StakeholdersAgent(BaseAgent):
    def __init__(self, llm_provider: BaseLLMProvider):
        super().__init__(
            agent_id="stakeholders",
            name="Stakeholders / Other People",
            category="Systemic & Future",
            llm_provider=llm_provider,
        )


class CognitiveBiasAgent(BaseAgent):
    def __init__(self, llm_provider: BaseLLMProvider):
        super().__init__(
            agent_id="cognitiveBiases",
            name="Cognitive Biases",
            category="Validation",
            llm_provider=llm_provider,
        )


class ReversibilityAgent(BaseAgent):
    def __init__(self, llm_provider: BaseLLMProvider):
        super().__init__(
            agent_id="reversibility",
            name="Reversibility",
            category="Systemic & Future",
            llm_provider=llm_provider,
        )


class OpportunityCostAgent(BaseAgent):
    def __init__(self, llm_provider: BaseLLMProvider):
        super().__init__(
            agent_id="opportunityCost",
            name="Opportunity Cost",
            category="Resources & Risks",
            llm_provider=llm_provider,
        )
