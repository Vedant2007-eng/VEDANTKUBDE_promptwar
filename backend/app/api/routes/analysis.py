from typing import Dict, List
from fastapi import APIRouter, HTTPException, status
from app.core.security import sanitize_input
from app.schemas.analysis import (
    AnalysisStartRequest,
    AnalysisStartResponse,
    AnalysisResponse,
    AnalysisStatusResponse,
    AgentResult,
    BlindSpot,
)
from app.services.analysis_service import analysis_service
from app.services.reflection_service import reflection_service

router = APIRouter(prefix="/analysis", tags=["Analysis"])


@router.post(
    "/start",
    response_model=AnalysisStartResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Start Multi-Perspective Decision Analysis",
)
async def start_analysis(payload: AnalysisStartRequest):
    """Initiate a 15-agent perspective examination on the given decision and reasoning."""
    cleaned_decision = sanitize_input(payload.decision)
    cleaned_reasoning = sanitize_input(payload.reasoning)

    if not cleaned_decision:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Decision statement cannot be empty.",
        )

    return await analysis_service.start_analysis(
        AnalysisStartRequest(decision=cleaned_decision, reasoning=cleaned_reasoning)
    )


@router.get(
    "/{analysis_id}",
    response_model=AnalysisResponse,
    summary="Get Complete Analysis Results",
)
async def get_analysis(analysis_id: str):
    """Retrieve full analysis status, individual agent outputs, and synthesis."""
    result = await analysis_service.get_analysis(analysis_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Analysis session '{analysis_id}' not found.",
        )
    return result


@router.get(
    "/{analysis_id}/status",
    response_model=AnalysisStatusResponse,
    summary="Get Real-Time Analysis Progress",
)
async def get_analysis_status(analysis_id: str):
    """Poll the real-time progress and status of running perspective agents."""
    status_res = await analysis_service.get_status(analysis_id)
    if not status_res:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Analysis session '{analysis_id}' not found.",
        )
    return status_res


@router.get(
    "/{analysis_id}/agents",
    response_model=Dict[str, AgentResult],
    summary="Get All 15 Agent Outputs",
)
async def get_agent_results(analysis_id: str):
    """Retrieve individual structured findings from all 15 agents."""
    agents = await analysis_service.get_agents(analysis_id)
    return agents


@router.get(
    "/{analysis_id}/blind-spots",
    response_model=List[BlindSpot],
    summary="Get Top Ranked Blind Spots",
)
async def get_blind_spots(analysis_id: str):
    """Retrieve synthesized and ranked blind spots."""
    return await analysis_service.get_blind_spots(analysis_id)


@router.get(
    "/{analysis_id}/questions",
    response_model=List[str],
    summary="Get Reflection Questions",
)
async def get_questions(analysis_id: str):
    """Retrieve the core questions recommended for user reflection."""
    return await analysis_service.get_questions(analysis_id)


@router.get(
    "/{analysis_id}/final",
    summary="Get Final Insights & Decision Map",
)
async def get_final_insights(analysis_id: str):
    """Retrieve final synthesis, user reflections, and updated perspective."""
    reflection_res = await reflection_service.get_reflection(analysis_id)
    if not reflection_res:
        # Fallback to analysis summary if reflection has not been submitted yet
        analysis_doc = await analysis_service.get_analysis(analysis_id)
        if not analysis_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Analysis '{analysis_id}' not found.",
            )
        return {
            "analysis_id": analysis_id,
            "decision": analysis_doc.decision,
            "reasoning": analysis_doc.reasoning,
            "status": analysis_doc.status,
            "summary": analysis_doc.summary,
            "blind_spots": analysis_doc.blind_spots,
            "coverage": analysis_doc.reflection_coverage,
            "final_reflection": None,
        }
    return reflection_res
