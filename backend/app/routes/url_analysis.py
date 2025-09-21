# backend/app/routes/url_analysis.py

from fastapi import APIRouter, HTTPException
from app.services.url_service import analyze_url
from app.services.safe_browsing_service import check_url_safety
from app.models import Result

router = APIRouter()

@router.post("/analyze/url", response_model=Result)
async def analyze_url_route(payload: dict):
    """
    Endpoint for analyzing URLs.
    Expects JSON: { "url": "http://example.com", "language": "en" }
    """
    try:
        url = payload.get("url")
        language = payload.get("language", "en")

        if not url:
            raise HTTPException(status_code=400, detail="url is required")

        # ✅ Step 1: Run Safe Browsing check
        safety_report = await check_url_safety(url)

        # ✅ Step 2: Run analysis pipeline
        result = await analyze_url(url, language)

        # ✅ Step 3: Attach safe browsing results to audit
        result.audit["safe_browsing"] = safety_report

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
