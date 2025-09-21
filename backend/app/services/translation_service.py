# backend/app/services/translation_service.py

import os
import aiohttp
import logging
from typing import Optional, Dict, Any, List

logger = logging.getLogger(__name__)

# Environment configuration (CORRECTED)
TRANSLATION_API_KEY = os.getenv("TRANSLATION_API_KEY")  # Matches your .env
TRANSLATION_API_URL = "https://translation.googleapis.com/language/translate/v2"

class TranslationService:
    """Google Cloud Translation API wrapper service"""
    
    def __init__(self):
        self.api_key = TRANSLATION_API_KEY
        self.base_url = TRANSLATION_API_URL
        
    def _get_headers(self) -> Dict[str, str]:
        """Get common headers for all API requests"""
        return {
            "X-Goog-Api-Key": self.api_key,  # ✅ FIXED: Use header authentication
            "Content-Type": "application/json"
        }
        
    async def detect_language(self, text: str) -> Optional[str]:
        """
        Detect language of given text using Google Translate API
        
        Args:
            text (str): Text to detect language for
            
        Returns:
            str: ISO 639-1 language code (e.g., 'en', 'es', 'fr') or None if failed
        """
        if not self.api_key:
            logger.warning("Translation API key not configured")
            return "en"  # Default fallback
            
        if not text or not text.strip():
            return "en"
            
        try:
            url = f"{self.base_url}/detect"
            
            # ✅ FIXED: Remove API key from payload, use headers instead
            payload = {
                "q": text[:1000]  # Limit text length for detection
            }
            
            headers = self._get_headers()
            
            async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=10)) as session:
                async with session.post(url, json=payload, headers=headers) as response:
                    if response.status == 200:
                        data = await response.json()
                        detections = data.get("data", {}).get("detections", [])
                        
                        if detections and isinstance(detections[0], list) and detections[0]:
                            detected_lang = detections[0][0].get("language", "en")
                            confidence = detections[0][0].get("confidence", 0.0)
                            
                            logger.info(f"Detected language: {detected_lang} (confidence: {confidence})")
                            return detected_lang
                            
                    else:
                        logger.error(f"Language detection failed: HTTP {response.status}")
                        error_data = await response.text()
                        logger.error(f"Error details: {error_data}")
                        
        except Exception as e:
            logger.error(f"Language detection error: {str(e)}")
            
        return "en"  # Default fallback
    
    async def translate_text(self, text: str, target_language: str = "en", source_language: Optional[str] = None) -> str:
        """
        Translate text to target language using Google Translate API
        
        Args:
            text (str): Text to translate
            target_language (str): Target language code (default: "en")
            source_language (str): Source language code (optional, auto-detect if None)
            
        Returns:
            str: Translated text or original text if translation fails
        """
        if not self.api_key:
            logger.warning("Translation API key not configured")
            return text
            
        if not text or not text.strip():
            return text
            
        # Skip translation if source and target are the same
        if source_language and source_language == target_language:
            return text
            
        try:
            url = self.base_url
            
            # ✅ FIXED: Remove API key from payload, use headers instead
            payload = {
                "q": text,
                "target": target_language,
                "format": "text"
            }
            
            if source_language:
                payload["source"] = source_language
            
            headers = self._get_headers()
            
            async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=15)) as session:
                async with session.post(url, json=payload, headers=headers) as response:
                    if response.status == 200:
                        data = await response.json()
                        translations = data.get("data", {}).get("translations", [])
                        
                        if translations:
                            translated_text = translations[0].get("translatedText", text)
                            detected_source = translations[0].get("detectedSourceLanguage")
                            
                            logger.info(f"Translation successful: {detected_source or source_language} -> {target_language}")
                            return translated_text
                            
                    else:
                        logger.error(f"Translation failed: HTTP {response.status}")
                        error_data = await response.text()
                        logger.error(f"Error details: {error_data}")
                        
        except Exception as e:
            logger.error(f"Translation error: {str(e)}")
            
        return text  # Return original text if translation fails
    
    async def translate_batch(self, texts: List[str], target_language: str = "en", source_language: Optional[str] = None) -> List[str]:
        """
        Translate multiple texts in a single API call
        
        Args:
            texts (List[str]): List of texts to translate
            target_language (str): Target language code
            source_language (str): Source language code (optional)
            
        Returns:
            List[str]: List of translated texts
        """
        if not self.api_key:
            logger.warning("Translation API key not configured")
            return texts
            
        if not texts:
            return []
            
        # Limit batch size
        if len(texts) > 100:
            logger.warning("Batch size too large, processing first 100 items")
            texts = texts[:100]
            
        try:
            url = self.base_url
            
            # ✅ FIXED: Remove API key from payload, use headers instead
            payload = {
                "q": texts,
                "target": target_language,
                "format": "text"
            }
            
            if source_language:
                payload["source"] = source_language
            
            headers = self._get_headers()
            
            async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=30)) as session:
                async with session.post(url, json=payload, headers=headers) as response:
                    if response.status == 200:
                        data = await response.json()
                        translations = data.get("data", {}).get("translations", [])
                        
                        translated_texts = [t.get("translatedText", texts[i]) for i, t in enumerate(translations)]
                        logger.info(f"Batch translation successful: {len(translated_texts)} texts translated")
                        return translated_texts
                        
                    else:
                        logger.error(f"Batch translation failed: HTTP {response.status}")
                        error_data = await response.text()
                        logger.error(f"Error details: {error_data}")
                        
        except Exception as e:
            logger.error(f"Batch translation error: {str(e)}")
            
        return texts  # Return original texts if translation fails
    
    async def get_supported_languages(self) -> Dict[str, Any]:
        """
        Get list of supported languages from Google Translate API
        
        Returns:
            Dict: Language codes and names
        """
        if not self.api_key:
            return {"languages": []}
            
        try:
            url = f"{self.base_url}/languages"
            
            # ✅ FIXED: Use URL parameters for GET request, but still use headers for auth
            params = {"target": "en"}
            headers = self._get_headers()
            
            async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=10)) as session:
                async with session.get(url, params=params, headers=headers) as response:
                    if response.status == 200:
                        return await response.json()
                    else:
                        logger.error(f"Get languages failed: HTTP {response.status}")
                        error_data = await response.text()
                        logger.error(f"Error details: {error_data}")
                        
        except Exception as e:
            logger.error(f"Failed to get supported languages: {str(e)}")
            
        return {"languages": []}

# Global translation service instance
translation_service = TranslationService()

# Convenience functions for direct import
async def detect_language(text: str) -> Optional[str]:
    """Detect language of text"""
    return await translation_service.detect_language(text)

async def translate_text(text: str, target: str = "en", source: Optional[str] = None) -> str:
    """Translate text to target language"""
    return await translation_service.translate_text(text, target, source)

async def translate_batch(texts: List[str], target: str = "en", source: Optional[str] = None) -> List[str]:
    """Translate multiple texts"""
    return await translation_service.translate_batch(texts, target, source)
