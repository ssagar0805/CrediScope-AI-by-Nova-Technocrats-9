# backend/app/services/text_service.py

from app.services.analysis_engine import run_analysis
from app.models import Result

async def analyze_text(text: str, language: str = "en") -> Result:
    """
    Wrapper around analysis_engine for text analysis.
    Returns a Result object formatted for frontend.
    """
    return await run_analysis("text", text, language)
