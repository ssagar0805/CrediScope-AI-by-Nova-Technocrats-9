# backend/app/routes/image_analysis.py

import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.image_service import analyze_image
from app.models import Result

router = APIRouter()
logger = logging.getLogger(__name__)

class ImageAnalysisRequest(BaseModel):
    image_base64: str
    language: str = "en"

@router.post("/analyze/image", response_model=Result)
async def analyze_image_route(payload: ImageAnalysisRequest):
    """
    🔥 ENHANCED: Image analysis endpoint with proper validation
    Expects JSON: { "image_base64": "data:image/jpeg;base64,/9j/4AA...", "language": "en" }
    """
    try:
        logger.info("📡 Image analysis request received")
        
        if not payload.image_base64:
            raise HTTPException(status_code=400, detail="image_base64 is required")
        
        # Remove data URL prefix if present (data:image/jpeg;base64,)
        image_data = payload.image_base64
        if "," in image_data:
            image_data = image_data.split(",", 1)[1]
        
        logger.info(f"🖼️ Processing image analysis (language: {payload.language})")
        result = await analyze_image(image_data, payload.language)
        
        logger.info(f"✅ Image analysis complete: {result.verdict.label}")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Image analysis endpoint error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Image analysis failed: {str(e)}")
