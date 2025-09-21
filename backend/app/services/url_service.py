# backend/app/services/url_service.py

from app.services.analysis_engine import run_analysis
from app.models import Result

async def analyze_url(url: str, language: str = "en") -> Result:
    """
    Wrapper around analysis_engine for URL analysis.
    Returns a Result object formatted for frontend.
    """
    return await run_analysis("url", url, language)
