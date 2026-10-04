from datetime import datetime, timezone
import uuid
from typing import Optional, List, Dict, Any
from app.db.mongodb import db_manager
from app.schemas.analysis import AnalysisResponse, AnalysisStatus, AgentResult, BlindSpot, ReflectionCoverage


class AnalysisRepository:
    COLLECTION = "analyses"

    async def create_initial(self, decision_id: str, decision: str, reasoning: str) -> str:
        analysis_id = f"an_{uuid.uuid4().hex[:12]}"
        now_str = datetime.now(timezone.utc).isoformat()
        doc = {
            "id": analysis_id,
            "decision_id": decision_id,
            "decision": decision,
            "reasoning": reasoning,
            "status": "analyzing",
            "completed_agents": 0,
            "total_agents": 15,
            "progress": 0,
            "agent_results": {},
            "blind_spots": [],
            "risks": [],
            "challenged_assumptions": [],
            "missing_information": [],
            "key_questions": [],
            "summary": "",
            "reflection_coverage": ReflectionCoverage().model_dump(),
            "created_at": now_str,
            "completed_at": None,
        }
        await db_manager.insert_one(self.COLLECTION, doc)
        return analysis_id

    async def get_by_id(self, analysis_id: str) -> Optional[AnalysisResponse]:
        doc = await db_manager.find_one(self.COLLECTION, {"id": analysis_id})
        if not doc:
            return None
        return AnalysisResponse(**doc)

    async def update_progress(self, analysis_id: str, completed_agents: int, total_agents: int, current_agent: Optional[str] = None):
        progress = int((completed_agents / max(total_agents, 1)) * 100)
        await db_manager.update_one(
            self.COLLECTION,
            {"id": analysis_id},
            {
                "completed_agents": completed_agents,
                "total_agents": total_agents,
                "progress": progress,
                "current_agent": current_agent,
            }
        )

    async def update_agent_result(self, analysis_id: str, agent_id: str, result: AgentResult):
        doc = await db_manager.find_one(self.COLLECTION, {"id": analysis_id})
        if doc:
            results = doc.get("agent_results", {})
            results[agent_id] = result.model_dump()
            await db_manager.update_one(
                self.COLLECTION,
                {"id": analysis_id},
                {"agent_results": results}
            )

    async def complete_analysis(self, analysis_id: str, synthesis_data: Dict[str, Any]):
        now_str = datetime.now(timezone.utc).isoformat()
        update_payload = {
            "status": "completed",
            "progress": 100,
            "completed_agents": 15,
            "completed_at": now_str,
            "summary": synthesis_data.get("summary", ""),
            "blind_spots": [b.model_dump() if hasattr(b, "model_dump") else b for b in synthesis_data.get("blind_spots", [])],
            "risks": synthesis_data.get("risks", []),
            "challenged_assumptions": synthesis_data.get("challenged_assumptions", []),
            "missing_information": synthesis_data.get("missing_information", []),
            "key_questions": synthesis_data.get("key_questions", []),
            "reflection_coverage": synthesis_data.get("reflection_coverage", ReflectionCoverage()).model_dump()
            if hasattr(synthesis_data.get("reflection_coverage"), "model_dump")
            else synthesis_data.get("reflection_coverage", {}),
        }
        await db_manager.update_one(self.COLLECTION, {"id": analysis_id}, update_payload)

    async def mark_failed(self, analysis_id: str, error_message: str):
        await db_manager.update_one(
            self.COLLECTION,
            {"id": analysis_id},
            {"status": "failed", "error": error_message}
        )


analysis_repo = AnalysisRepository()
