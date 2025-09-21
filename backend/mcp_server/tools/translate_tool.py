# backend/mcp_server/tools/translate_tool.py
"""
Google Translate MCP Tool
Standalone translation functionality that can be used independently or via MCP
"""

import asyncio
import logging
from typing import Dict, Any, Optional

# Import existing translation service
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '../..'))

from app.services.translation_service import translation_service

logger = logging.getLogger(__name__)

class TranslateTool:
    """Google Translate API tool for MCP"""
    
    def __init__(self):
        self.name = "translate_tool"
        self.version = "1.0.0"
        
    async def translate_text(
        self, 
        text: str, 
        target_language: str = "en",
        source_language: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Translate text between languages using Google Translate API
        
        Args:
            text: Text to translate
            target_language: Target language code (e.g., 'en', 'es', 'fr')
            source_language: Source language code (optional, auto-detect if None)
            
        Returns:
            Dict containing translation result and metadata
        """
        try:
            # Validate input
            if not text or not text.strip():
                return {
                    "success": False,
                    "error": "Text cannot be empty",
                    "translated_text": "",
                    "detected_language": None
                }
            
            if len(text) > 5000:
                return {
                    "success": False,
                    "error": "Text too long (max 5000 characters)",
                    "translated_text": "",
                    "detected_language": None
                }
            
            # Perform translation
            translated_text = await translation_service.translate_text(
                text, target_language, source_language
            )
            
            # Detect source language if not provided
            detected_language = source_language
            if not source_language:
                detected_language = await translation_service.detect_language(text)
            
            return {
                "success": True,
                "translated_text": translated_text,
                "source_language": detected_language,
                "target_language": target_language,
                "original_text": text,
                "character_count": len(text)
            }
            
        except Exception as e:
            logger.error(f"Translation error: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "translated_text": text,  # Fallback to original
                "detected_language": None
            }
    
    async def detect_language(self, text: str) -> Dict[str, Any]:
        """
        Detect the language of input text
        
        Args:
            text: Text to analyze
            
        Returns:
            Dict containing detected language and confidence
        """
        try:
            if not text or not text.strip():
                return {
                    "success": False,
                    "error": "Text cannot be empty",
                    "detected_language": None,
                    "confidence": 0.0
                }
            
            detected_language = await translation_service.detect_language(text)
            
            return {
                "success": True,
                "detected_language": detected_language,
                "text_sample": text[:100] + "..." if len(text) > 100 else text,
                "character_count": len(text)
            }
            
        except Exception as e:
            logger.error(f"Language detection error: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "detected_language": "en",  # Fallback
                "confidence": 0.0
            }
    
    async def batch_translate(
        self,
        texts: list,
        target_language: str = "en",
        source_language: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Translate multiple texts in batch
        
        Args:
            texts: List of texts to translate
            target_language: Target language code
            source_language: Source language code (optional)
            
        Returns:
            Dict containing batch translation results
        """
        try:
            if not texts or len(texts) == 0:
                return {
                    "success": False,
                    "error": "No texts provided",
                    "results": []
                }
            
            if len(texts) > 10:
                return {
                    "success": False,
                    "error": "Too many texts (max 10 per batch)",
                    "results": []
                }
            
            # Use existing batch translation
            translated_texts = await translation_service.translate_batch(
                texts, target_language, source_language
            )
            
            # Format results
            results = []
            for i, (original, translated) in enumerate(zip(texts, translated_texts)):
                results.append({
                    "index": i,
                    "original": original,
                    "translated": translated,
                    "source_language": source_language,
                    "target_language": target_language
                })
            
            return {
                "success": True,
                "batch_size": len(texts),
                "results": results,
                "target_language": target_language
            }
            
        except Exception as e:
            logger.error(f"Batch translation error: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "results": []
            }

# Global instance
translate_tool = TranslateTool()

# Convenience functions for direct use
async def translate_text(text: str, target: str = "en", source: Optional[str] = None) -> str:
    """Simple translation function that returns just the translated text"""
    result = await translate_tool.translate_text(text, target, source)
    return result.get("translated_text", text)

async def detect_language(text: str) -> str:
    """Simple language detection that returns just the language code"""
    result = await translate_tool.detect_language(text)
    return result.get("detected_language", "en")
