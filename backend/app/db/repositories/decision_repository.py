from datetime import datetime, timezone
import uuid
from typing import Optional, List, Dict, Any
from app.db.mongodb import db_manager
from app.schemas.decision import DecisionCreate, DecisionResponse


class DecisionRepository:
    COLLECTION = "decisions"

    async def create(self, data: DecisionCreate, user_id: str = "anonymous") -> DecisionResponse:
        now_str = datetime.now(timezone.utc).isoformat()
        decision_id = f"dec_{uuid.uuid4().hex[:12]}"
        doc = {
            "id": decision_id,
            "user_id": user_id,
            "decision": data.decision,
            "reasoning": data.reasoning,
            "created_at": now_str,
            "updated_at": now_str,
        }
        await db_manager.insert_one(self.COLLECTION, doc)
        return DecisionResponse(**doc)

    async def get_by_id(self, decision_id: str) -> Optional[DecisionResponse]:
        doc = await db_manager.find_one(self.COLLECTION, {"id": decision_id})
        if not doc:
            return None
        return DecisionResponse(**doc)

    async def list_all(self, limit: int = 50) -> List[DecisionResponse]:
        docs = await db_manager.find_many(self.COLLECTION, limit=limit)
        return [DecisionResponse(**d) for d in docs]

    async def delete(self, decision_id: str) -> bool:
        return await db_manager.delete_one(self.COLLECTION, {"id": decision_id})


decision_repo = DecisionRepository()
