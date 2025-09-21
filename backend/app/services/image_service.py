# backend/app/services/image_service.py

from app.services.analysis_engine import run_analysis
from app.services.vision_service import vision_service
from app.models import Result
import logging

logger = logging.getLogger(__name__)

async def analyze_image(image_base64: str, language: str = "en") -> Result:
    """Enhanced image analysis using OCR + text analysis"""
    try:
        # Extract text using Vision API
        vision_result = await vision_service.detect_text(image_base64)
        extracted_text = vision_result.get("full_text", "")
        
        if extracted_text.strip():
            # Run text analysis on extracted text
            result = await run_analysis("text", extracted_text, language)
            result.input = f"Image Analysis - Extracted Text: {extracted_text}"
            return result
        else:
            # No text found, use basic image analysis
            return await run_analysis("image", "No text detected in image", language)
            
    except Exception as e:
        logger.error(f"❌ Image analysis failed: {str(e)}")
        return await run_analysis("image", f"Image analysis error: {str(e)}", language)
