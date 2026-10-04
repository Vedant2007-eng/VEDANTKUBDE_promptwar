from typing import List
from fastapi import APIRouter, HTTPException, status
from app.db.repositories.decision_repository import decision_repo
from app.schemas.decision import DecisionCreate, DecisionResponse, DecisionListResponse

router = APIRouter(prefix="/decisions", tags=["Decisions"])


@router.get("", response_model=DecisionListResponse, summary="List Stored Decisions")
async def list_decisions(limit: int = 50):
    """List historical decisions stored in the system."""
    decisions = await decision_repo.list_all(limit=limit)
    return DecisionListResponse(total=len(decisions), decisions=decisions)


@router.get("/{decision_id}", response_model=DecisionResponse, summary="Get Single Decision")
async def get_decision(decision_id: str):
    """Retrieve details of a specific decision."""
    doc = await decision_repo.get_by_id(decision_id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Decision '{decision_id}' not found.",
        )
    return doc


@router.delete("/{decision_id}", summary="Delete Decision")
async def delete_decision(decision_id: str):
    """Delete a decision from history."""
    deleted = await decision_repo.delete(decision_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Decision '{decision_id}' not found.",
        )
    return {"status": "deleted", "id": decision_id}
