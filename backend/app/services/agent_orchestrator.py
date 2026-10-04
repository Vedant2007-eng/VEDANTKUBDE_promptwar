import asyncio
from typing import Dict, List, Any, Optional
from app.core.config import settings
from app.core.logging import logger
from app.db.repositories.analysis_repository import analysis_repo
from app.llm.base_provider import BaseLLMProvider
from app.llm.groq_provider import GroqProvider
from app.schemas.analysis import AgentResult
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


class AgentOrchestrator:
    def __init__(self, llm_provider: Optional[BaseLLMProvider] = None):
        self.llm_provider = llm_provider or GroqProvider()
        self.max_concurrency = settings.MAX_CONCURRENT_AGENTS
        self._init_agents()

    def _init_agents(self):
        self.agents = [
            GoalAgent(self.llm_provider),
            RequirementsAgent(self.llm_provider),
            CostAgent(self.llm_provider),
            BenefitsAgent(self.llm_provider),
            RisksAgent(self.llm_provider),
            UncertaintyAgent(self.llm_provider),
            AssumptionsAgent(self.llm_provider),
            EvidenceAgent(self.llm_provider),
            AlternativesAgent(self.llm_provider),
            TimeHorizonAgent(self.llm_provider),
            TradeoffsAgent(self.llm_provider),
            StakeholdersAgent(self.llm_provider),
            CognitiveBiasAgent(self.llm_provider),
            ReversibilityAgent(self.llm_provider),
            OpportunityCostAgent(self.llm_provider),
        ]

    async def run_all_agents(
        self,
        analysis_id: str,
        decision: str,
        reasoning: str,
    ) -> Dict[str, AgentResult]:
        """Execute all 15 agents with controlled concurrency and live DB progress tracking."""
        semaphore = asyncio.Semaphore(self.max_concurrency)
        total_agents = len(self.agents)
        completed_count = 0
        results: Dict[str, AgentResult] = {}
        lock = asyncio.Lock()

        async def _run_single(agent):
            nonlocal completed_count
            async with semaphore:
                # Update current analyzing agent
                await analysis_repo.update_progress(
                    analysis_id=analysis_id,
                    completed_agents=completed_count,
                    total_agents=total_agents,
                    current_agent=agent.name,
                )

                # Run individual agent analysis
                res = await agent.analyze(decision, reasoning)

                async with lock:
                    results[agent.agent_id] = res
                    completed_count += 1
                    await analysis_repo.update_agent_result(analysis_id, agent.agent_id, res)
                    await analysis_repo.update_progress(
                        analysis_id=analysis_id,
                        completed_agents=completed_count,
                        total_agents=total_agents,
                        current_agent=agent.name,
                    )

        logger.info("Orchestrator launching %d agents (max concurrency=%d)...", total_agents, self.max_concurrency)
        tasks = [_run_single(agent) for agent in self.agents]
        await asyncio.gather(*tasks, return_exceptions=True)
        logger.info("Orchestrator completed all %d agents for analysis %s.", len(results), analysis_id)
        return results
