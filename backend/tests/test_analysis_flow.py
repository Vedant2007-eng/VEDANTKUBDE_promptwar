import asyncio
import pytest
from httpx import ASGITransport, AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_end_to_end_analysis_and_reflection_pipeline():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Step 1: Start analysis
        payload = {
            "decision": "I should invest in this high-growth tech stock.",
            "reasoning": "The revenue doubled in 12 months and customers love the product.",
        }
        start_res = await client.post("/api/analysis/start", json=payload)
        assert start_res.status_code == 202
        start_data = start_res.json()
        analysis_id = start_data["analysis_id"]
        assert analysis_id.startswith("an_")

        # Allow background orchestrator to finish
        await asyncio.sleep(1.0)

        # Step 2: Poll status
        status_res = await client.get(f"/api/analysis/{analysis_id}/status")
        assert status_res.status_code == 200
        status_data = status_res.json()
        assert status_data["analysis_id"] == analysis_id

        # Step 3: Get full analysis
        full_res = await client.get(f"/api/analysis/{analysis_id}")
        assert full_res.status_code == 200
        full_data = full_res.json()
        assert full_data["decision"] == payload["decision"]
        assert len(full_data["blind_spots"]) >= 1

        # Step 4: Submit reflection answers
        reflection_payload = {
            "analysis_id": analysis_id,
            "answers": [
                {
                    "question_id": "q1",
                    "answer": "I audited audited financial filings and found high customer churn.",
                },
                {
                    "question_id": "q4",
                    "answer": "I can only tolerate a 15% drawdown, so I must limit allocation size.",
                },
            ],
        }
        ref_res = await client.post("/api/reflections", json=reflection_payload)
        assert ref_res.status_code == 200
        ref_data = ref_res.json()
        assert "final_reflection" in ref_data
        assert "updated_perspective" in ref_data["final_reflection"]

        # Step 5: Get full report
        report_res = await client.get(f"/api/reports/{analysis_id}")
        assert report_res.status_code == 200
        report_data = report_res.json()
        assert "final_principle" in report_data
        assert "BlindSpot AI" in report_data["title"]
