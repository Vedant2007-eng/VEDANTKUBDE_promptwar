import pytest
from app.agents import (
    GoalAgent,
    RequirementsAgent,
    CostAgent,
    BenefitsAgent,
    RisksAgent,
    UncertaintyAgent,
    AssumptionsAgent,
    EvidenceAgent,
    AlternativesAgent,
    TimeHorizonAgent,
    TradeoffsAgent,
    StakeholdersAgent,
    CognitiveBiasAgent,
    ReversibilityAgent,
    OpportunityCostAgent,
)
from app.llm.groq_provider import GroqProvider
from app.schemas.analysis import AgentResult


@pytest.mark.asyncio
async def test_all_15_agents_produce_valid_structured_output():
    provider = GroqProvider()
    agents = [
        GoalAgent(provider),
        RequirementsAgent(provider),
        CostAgent(provider),
        BenefitsAgent(provider),
        RisksAgent(provider),
        UncertaintyAgent(provider),
        AssumptionsAgent(provider),
        EvidenceAgent(provider),
        AlternativesAgent(provider),
        TimeHorizonAgent(provider),
        TradeoffsAgent(provider),
        StakeholdersAgent(provider),
        CognitiveBiasAgent(provider),
        ReversibilityAgent(provider),
        OpportunityCostAgent(provider),
    ]

    assert len(agents) == 15

    decision = "I should accept this new startup job offer."
    reasoning = "It pays 25% more and the team is fast-moving."

    for agent in agents:
        result: AgentResult = await agent.analyze(decision, reasoning)
        assert result.agent == agent.agent_id
        assert result.severity in ["low", "medium", "high"]
        assert len(result.finding) > 5
        assert len(result.question) > 5
        assert 0.0 <= result.confidence <= 1.0
