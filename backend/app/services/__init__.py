# backend/app/services/__init__.py

# Import real services that actually exist in your files
from .text_service import analyze_text
from .url_service import analyze_url
from .image_service import analyze_image
from .translation_service import (
    translation_service,
    detect_language,
    translate_text,
    translate_batch
)
from .vision_service import (
    vision_service,
    detect_text_from_image,
    analyze_image_comprehensive,
    detect_image_labels,
    check_image_safety
)
from .safe_browsing_service import check_url_safety

# Import the main analysis engine
from .analysis_engine import run_analysis

# Import the updated services.py (with real AnalysisEngine)
from ..services import analysis_engine

__all__ = [
    # Core analysis functions
    "run_analysis",
    "analyze_text",
    "analyze_url", 
    "analyze_image",
    
    # Translation services
    "translation_service",
    "detect_language",
    "translate_text",
    "translate_batch",
    
    # Vision services
    "vision_service",
    "detect_text_from_image",
    "analyze_image_comprehensive",
    "detect_image_labels",
    "check_image_safety",
    
    # Other services
    "check_url_safety",
    "analysis_engine",
]
