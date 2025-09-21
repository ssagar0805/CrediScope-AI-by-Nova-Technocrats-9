# backend/app/routes/text_analysis.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.text_service import analyze_text
from app.models import Result

router = APIRouter()

class TextAnalysisRequest(BaseModel):
    content: str
    language: Optional[str] = "en"

@router.post("/analyze/text", response_model=Result)
async def analyze_text_route(request: TextAnalysisRequest):
    """
    Analyze text content for misinformation using Google APIs
    
    - **content**: Text content to analyze
    - **language**: Language hint for better analysis (default: "en")
    """
    try:
        if not request.content or not request.content.strip():
            raise HTTPException(status_code=400, detail="Content cannot be empty")
        
        if len(request.content) > 10000:  # 10KB limit
            raise HTTPException(status_code=400, detail="Content too long (max 10,000 characters)")
        
        # Call real text analysis service
        result = await analyze_text(request.content.strip(), request.language)
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text analysis failed: {str(e)}")

@router.post("/analyze-batch/text")
async def analyze_text_batch(requests: list[TextAnalysisRequest]):
    """
    Batch analyze multiple text contents
    """
    if len(requests) > 10:  # Limit batch size
        raise HTTPException(status_code=400, detail="Too many requests (max 10 per batch)")
    
    results = []
    for req in requests:
        try:
            result = await analyze_text(req.content.strip(), req.language)
            results.append({"success": True, "result": result})
        except Exception as e:
            results.append({"success": False, "error": str(e)})
    
    return {"results": results, "total": len(results)}
