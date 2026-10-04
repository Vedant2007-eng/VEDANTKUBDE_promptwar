from datetime import datetime, timezone
import uuid
from typing import Optional, List, Dict, Any
from app.db.mongodb import db_manager
from app.schemas.reflection import AnswerItem, FinalReflectionOutput, ReflectionResponse


class ReflectionRepository:
    COLLECTION = "reflections"

    async def save_reflection(
        self,
        analysis_id: str,
        decision_id: str,
        answers: List[AnswerItem],
        final_reflection: FinalReflectionOutput,
    ) -> ReflectionResponse:
        reflection_id = f"ref_{uuid.uuid4().hex[:12]}"
        now_str = datetime.now(timezone.utc).isoformat()
        doc = {
            "id": reflection_id,
            "analysis_id": analysis_id,
            "decision_id": decision_id,
            "answers": [a.model_dump() for a in answers],
            "final_reflection": final_reflection.model_dump(),
            "created_at": now_str,
        }
        await db_manager.insert_one(self.COLLECTION, doc)
        return ReflectionResponse(
            id=reflection_id,
            analysis_id=analysis_id,
            decision_id=decision_id,
            answers=answers,
            final_reflection=final_reflection,
            created_at=now_str,
        )

    async def get_by_analysis_id(self, analysis_id: str) -> Optional[ReflectionResponse]:
        doc = await db_manager.find_one(self.COLLECTION, {"analysis_id": analysis_id})
        if not doc:
            return None
        return ReflectionResponse(
            id=doc["id"],
            analysis_id=doc["analysis_id"],
            decision_id=doc.get("decision_id", ""),
            answers=[AnswerItem(**a) for a in doc.get("answers", [])],
            final_reflection=FinalReflectionOutput(**doc["final_reflection"]),
            created_at=doc["created_at"],
        )


reflection_repo = ReflectionRepository()
