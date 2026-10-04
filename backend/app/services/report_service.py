from datetime import datetime, timezone
from typing import Optional
from app.db.repositories.analysis_repository import analysis_repo
from app.db.repositories.reflection_repository import reflection_repo
from app.schemas.report import ReportData
from app.schemas.reflection import FinalReflectionOutput


class ReportService:
    async def generate_report(self, analysis_id: str) -> Optional[ReportData]:
        analysis_doc = await analysis_repo.get_by_id(analysis_id)
        if not analysis_doc:
            return None

        reflection_doc = await reflection_repo.get_by_analysis_id(analysis_id)

        final_insights = (
            reflection_doc.final_reflection
            if reflection_doc
            else FinalReflectionOutput(
                supported_reasoning="Initial reasoning demonstrates valid motivation.",
                what_is_uncertain="External and long-term variables remain unhedged.",
                main_blind_spots="Key downside scenarios and valuation multiples were unaddressed.",
                what_reflection_added="Pending user self-reflection.",
                updated_perspective="I will verify key premises and evaluate risk-adjusted alternatives.",
                coverage=analysis_doc.reflection_coverage,
            )
        )

        user_reflections = reflection_doc.answers if reflection_doc else []

        return ReportData(
            generated_at=datetime.now(timezone.utc).isoformat(),
            original_decision=analysis_doc.decision,
            original_reasoning=analysis_doc.reasoning,
            executive_summary=analysis_doc.summary or "Multi-perspective evaluation of reasoning.",
            top_blind_spots=analysis_doc.blind_spots,
            risks=analysis_doc.risks,
            challenged_assumptions=analysis_doc.challenged_assumptions,
            missing_information=analysis_doc.missing_information,
            key_questions=analysis_doc.key_questions,
            perspective_findings=analysis_doc.agent_results,
            user_reflections=user_reflections,
            final_insights=final_insights,
            reflection_coverage=analysis_doc.reflection_coverage,
        )


report_service = ReportService()
