from fastapi import APIRouter, HTTPException, status
from app.schemas.reflection import ReflectionSubmitRequest, ReflectionResponse
from app.services.reflection_service import reflection_service

router = APIRouter(prefix="/reflections", tags=["Reflections"])


@router.post("", response_model=ReflectionResponse, summary="Submit User Reflection Answers")
async def submit_reflection(payload: ReflectionSubmitRequest):
    """Submit reflection question answers and generate post-reflection insights."""
    try:
        return await reflection_service.process_reflections(payload)
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(ve))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Reflection processing failed: {str(e)}",
        )


@router.get("/{analysis_id}", response_model=ReflectionResponse, summary="Get Reflection Data")
async def get_reflection(analysis_id: str):
    """Retrieve saved reflection answers and final synthesis for an analysis."""
    doc = await reflection_service.get_reflection(analysis_id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reflection for analysis '{analysis_id}' not found.",
        )
    return doc
