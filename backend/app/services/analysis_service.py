import asyncio
from typing import Dict, Any, Optional, List
from app.core.logging import logger
from app.db.repositories.analysis_repository import analysis_repo
from app.db.repositories.decision_repository import decision_repo
from app.schemas.decision import DecisionCreate
from app.schemas.analysis import (
    AnalysisStartRequest,
    AnalysisStartResponse,
    AnalysisResponse,
    AnalysisStatusResponse,
    AgentResult,
    BlindSpot,
)
from app.services.agent_orchestrator import AgentOrchestrator
from app.services.synthesis_service import synthesis_service


class AnalysisService:
    def __init__(self):
        self.orchestrator = AgentOrchestrator()

    async def start_analysis(self, payload: AnalysisStartRequest, user_id: str = "anonymous") -> AnalysisStartResponse:
        """Create decision, initialize analysis session, and dispatch 15 agents in background."""
        # 1. Create decision in DB
        decision_doc = await decision_repo.create(
            DecisionCreate(decision=payload.decision, reasoning=payload.reasoning),
            user_id=user_id,
        )

        # 2. Create initial analysis state in DB
        analysis_id = await analysis_repo.create_initial(
            decision_id=decision_doc.id,
            decision=payload.decision,
            reasoning=payload.reasoning,
        )

        # 3. Spawn background execution of 15 agents + synthesis
        asyncio.create_task(
            self._run_full_analysis_pipeline(
                analysis_id=analysis_id,
                decision_id=decision_doc.id,
                decision=payload.decision,
                reasoning=payload.reasoning,
            )
        )

        return AnalysisStartResponse(
            analysis_id=analysis_id,
            decision_id=decision_doc.id,
            status="analyzing",
        )

    async def _run_full_analysis_pipeline(
        self,
        analysis_id: str,
        decision_id: str,
        decision: str,
        reasoning: str,
    ):
        try:
            logger.info("Starting background analysis pipeline for %s...", analysis_id)
            # Step A: Run 15 agents
            agent_results = await self.orchestrator.run_all_agents(
                analysis_id=analysis_id,
                decision=decision,
                reasoning=reasoning,
            )

            # Step B: Run Synthesis Agent
            await synthesis_service.execute_synthesis(
                analysis_id=analysis_id,
                decision=decision,
                reasoning=reasoning,
                agent_results=agent_results,
            )
            logger.info("Background analysis pipeline completed for %s.", analysis_id)
        except Exception as e:
            logger.error("Analysis pipeline failed for %s: %s", analysis_id, str(e))
            await analysis_repo.mark_failed(analysis_id, str(e))

    async def get_analysis(self, analysis_id: str) -> Optional[AnalysisResponse]:
        return await analysis_repo.get_by_id(analysis_id)

    async def get_status(self, analysis_id: str) -> Optional[AnalysisStatusResponse]:
        doc = await analysis_repo.get_by_id(analysis_id)
        if not doc:
            return None
        return AnalysisStatusResponse(
            analysis_id=doc.id,
            status=doc.status,
            completed_agents=doc.completed_agents,
            total_agents=doc.total_agents,
            progress=doc.progress,
        )

    async def get_agents(self, analysis_id: str) -> Dict[str, AgentResult]:
        doc = await analysis_repo.get_by_id(analysis_id)
        if not doc:
            return {}
        return doc.agent_results

    async def get_blind_spots(self, analysis_id: str) -> List[BlindSpot]:
        doc = await analysis_repo.get_by_id(analysis_id)
        if not doc:
            return []
        return doc.blind_spots

    async def get_questions(self, analysis_id: str) -> List[str]:
        doc = await analysis_repo.get_by_id(analysis_id)
        if not doc:
            return []
        return doc.key_questions


analysis_service = AnalysisService()
