from fastapi import APIRouter
from app.core.config import settings
from app.db.mongodb import db_manager

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("", summary="System Health Check")
async def health_check():
    """Verify backend and database operational status."""
    return {
        "status": "ok",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": "mongodb" if db_manager.is_connected else "in_memory_fallback",
        "llm_provider": "groq" if settings.GROQ_API_KEY else "structured_mock_fallback",
    }
