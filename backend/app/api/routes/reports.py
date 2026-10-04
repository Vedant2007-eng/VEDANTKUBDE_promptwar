from fastapi import APIRouter, HTTPException, status
from app.schemas.report import ReportData
from app.services.report_service import report_service

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/{analysis_id}", response_model=ReportData, summary="Get Full Structured Decision Report")
async def get_report(analysis_id: str):
    """Generate structured decision brief data suitable for downloads, printing, and export."""
    report = await report_service.generate_report(analysis_id)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Analysis '{analysis_id}' not found.",
        )
    return report
