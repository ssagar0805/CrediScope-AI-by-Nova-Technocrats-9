# backend/app/services/vision_service.py

import os
import base64
import aiohttp
import logging
from typing import Optional, Dict, Any, List, Tuple
from io import BytesIO

logger = logging.getLogger(__name__)

# Environment configuration
VISION_API_KEY = os.getenv("VISION_API_KEY") or os.getenv("GOOGLE_VISION_API_KEY")
VISION_API_URL = "https://vision.googleapis.com/v1/images:annotate"

class VisionService:
    """Google Cloud Vision API wrapper service"""
    
    def __init__(self):
        self.api_key = VISION_API_KEY
        self.base_url = VISION_API_URL
        
    async def detect_text(self, image_base64: str, max_results: int = 50) -> Dict[str, Any]:
        """
        Extract text from image using OCR (Optical Character Recognition)
        
        Args:
            image_base64 (str): Base64 encoded image data
            max_results (int): Maximum number of text annotations to return
            
        Returns:
            Dict: OCR results with extracted text and bounding boxes
        """
        if not self.api_key:
            logger.warning("Vision API key not configured")
            return {"texts": [], "full_text": "", "error": "API key not configured"}
            
        if not image_base64:
            return {"texts": [], "full_text": "", "error": "No image data provided"}
            
        try:
            # Prepare the request payload
            request_payload = {
                "requests": [
                    {
                        "image": {"content": image_base64},
                        "features": [
                            {
                                "type": "TEXT_DETECTION",
                                "maxResults": max_results
                            }
                        ]
                    }
                ]
            }
            
            url = f"{self.base_url}?key={self.api_key}"
            
            async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=30)) as session:
                async with session.post(url, json=request_payload) as response:
                    if response.status == 200:
                        data = await response.json()
                        return self._process_text_detection_response(data)
                    else:
                        error_text = await response.text()
                        logger.error(f"Vision API error: HTTP {response.status} - {error_text}")
                        return {"texts": [], "full_text": "", "error": f"HTTP {response.status}"}
                        
        except Exception as e:
            logger.error(f"Text detection error: {str(e)}")
            return {"texts": [], "full_text": "", "error": str(e)}
    
    async def detect_labels(self, image_base64: str, max_results: int = 10) -> Dict[str, Any]:
        """
        Detect objects, places, activities, animal species, products, and more in images
        
        Args:
            image_base64 (str): Base64 encoded image data
            max_results (int): Maximum number of labels to return
            
        Returns:
            Dict: Labels with confidence scores
        """
        if not self.api_key:
            logger.warning("Vision API key not configured")
            return {"labels": [], "error": "API key not configured"}
            
        try:
            request_payload = {
                "requests": [
                    {
                        "image": {"content": image_base64},
                        "features": [
                            {
                                "type": "LABEL_DETECTION",
                                "maxResults": max_results
                            }
                        ]
                    }
                ]
            }
            
            url = f"{self.base_url}?key={self.api_key}"
            
            async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=20)) as session:
                async with session.post(url, json=request_payload) as response:
                    if response.status == 200:
                        data = await response.json()
                        return self._process_label_detection_response(data)
                    else:
                        error_text = await response.text()
                        logger.error(f"Label detection error: HTTP {response.status} - {error_text}")
                        return {"labels": [], "error": f"HTTP {response.status}"}
                        
        except Exception as e:
            logger.error(f"Label detection error: {str(e)}")
            return {"labels": [], "error": str(e)}
    
    async def detect_safe_search(self, image_base64: str) -> Dict[str, Any]:
        """
        Detect explicit content in images (adult, spoof, medical, violence, racy)
        
        Args:
            image_base64 (str): Base64 encoded image data
            
        Returns:
            Dict: Safe search annotations with likelihood scores
        """
        if not self.api_key:
            logger.warning("Vision API key not configured")
            return {"safe_search": {}, "error": "API key not configured"}
            
        try:
            request_payload = {
                "requests": [
                    {
                        "image": {"content": image_base64},
                        "features": [
                            {
                                "type": "SAFE_SEARCH_DETECTION",
                                "maxResults": 1
                            }
                        ]
                    }
                ]
            }
            
            url = f"{self.base_url}?key={self.api_key}"
            
            async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=15)) as session:
                async with session.post(url, json=request_payload) as response:
                    if response.status == 200:
                        data = await response.json()
                        return self._process_safe_search_response(data)
                    else:
                        error_text = await response.text()
                        logger.error(f"Safe search error: HTTP {response.status} - {error_text}")
                        return {"safe_search": {}, "error": f"HTTP {response.status}"}
                        
        except Exception as e:
            logger.error(f"Safe search error: {str(e)}")
            return {"safe_search": {}, "error": str(e)}
    
    async def comprehensive_analysis(self, image_base64: str) -> Dict[str, Any]:
        """
        Perform comprehensive image analysis (text, labels, safe search)
        
        Args:
            image_base64 (str): Base64 encoded image data
            
        Returns:
            Dict: Combined analysis results
        """
        if not self.api_key:
            logger.warning("Vision API key not configured")
            return {"error": "API key not configured"}
            
        try:
            request_payload = {
                "requests": [
                    {
                        "image": {"content": image_base64},
                        "features": [
                            {"type": "TEXT_DETECTION", "maxResults": 20},
                            {"type": "LABEL_DETECTION", "maxResults": 10},
                            {"type": "SAFE_SEARCH_DETECTION", "maxResults": 1}
                        ]
                    }
                ]
            }
            
            url = f"{self.base_url}?key={self.api_key}"
            
            async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=30)) as session:
                async with session.post(url, json=request_payload) as response:
                    if response.status == 200:
                        data = await response.json()
                        return self._process_comprehensive_response(data)
                    else:
                        error_text = await response.text()
                        logger.error(f"Comprehensive analysis error: HTTP {response.status} - {error_text}")
                        return {"error": f"HTTP {response.status}"}
                        
        except Exception as e:
            logger.error(f"Comprehensive analysis error: {str(e)}")
            return {"error": str(e)}
    
    def _process_text_detection_response(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process text detection API response"""
        try:
            responses = data.get("responses", [])
            if not responses:
                return {"texts": [], "full_text": "", "error": "No response data"}
                
            response = responses[0]
            text_annotations = response.get("textAnnotations", [])
            
            if not text_annotations:
                return {"texts": [], "full_text": "", "confidence": 0.0}
            
            # First annotation is usually the full text
            full_text = text_annotations[0].get("description", "") if text_annotations else ""
            
            # Process individual text elements (skip first which is full text)
            texts = []
            for annotation in text_annotations[1:]:
                text_info = {
                    "text": annotation.get("description", ""),
                    "confidence": annotation.get("confidence", 0.0),
                    "bounding_box": self._extract_bounding_box(annotation.get("boundingPoly", {}))
                }
                texts.append(text_info)
            
            return {
                "texts": texts,
                "full_text": full_text.strip(),
                "total_words": len(texts),
                "confidence": text_annotations[0].get("confidence", 0.0) if text_annotations else 0.0
            }
            
        except Exception as e:
            logger.error(f"Error processing text detection response: {str(e)}")
            return {"texts": [], "full_text": "", "error": str(e)}
    
    def _process_label_detection_response(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process label detection API response"""
        try:
            responses = data.get("responses", [])
            if not responses:
                return {"labels": [], "error": "No response data"}
                
            response = responses[0]
            label_annotations = response.get("labelAnnotations", [])
            
            labels = []
            for annotation in label_annotations:
                label_info = {
                    "description": annotation.get("description", ""),
                    "score": annotation.get("score", 0.0),
                    "confidence": annotation.get("score", 0.0)  # Score is confidence for labels
                }
                labels.append(label_info)
            
            return {
                "labels": labels,
                "total_labels": len(labels)
            }
            
        except Exception as e:
            logger.error(f"Error processing label detection response: {str(e)}")
            return {"labels": [], "error": str(e)}
    
    def _process_safe_search_response(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process safe search API response"""
        try:
            responses = data.get("responses", [])
            if not responses:
                return {"safe_search": {}, "error": "No response data"}
                
            response = responses[0]
            safe_search = response.get("safeSearchAnnotation", {})
            
            return {
                "safe_search": {
                    "adult": safe_search.get("adult", "UNKNOWN"),
                    "spoof": safe_search.get("spoof", "UNKNOWN"),
                    "medical": safe_search.get("medical", "UNKNOWN"),
                    "violence": safe_search.get("violence", "UNKNOWN"),
                    "racy": safe_search.get("racy", "UNKNOWN")
                },
                "is_safe": self._is_content_safe(safe_search)
            }
            
        except Exception as e:
            logger.error(f"Error processing safe search response: {str(e)}")
            return {"safe_search": {}, "error": str(e)}
    
    def _process_comprehensive_response(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process comprehensive analysis API response"""
        try:
            text_result = self._process_text_detection_response(data)
            label_result = self._process_label_detection_response(data)
            safe_search_result = self._process_safe_search_response(data)
            
            return {
                "text_analysis": text_result,
                "label_analysis": label_result,
                "safe_search_analysis": safe_search_result,
                "summary": {
                    "has_text": bool(text_result.get("full_text", "")),
                    "text_length": len(text_result.get("full_text", "")),
                    "label_count": len(label_result.get("labels", [])),
                    "is_safe": safe_search_result.get("is_safe", True)
                }
            }
            
        except Exception as e:
            logger.error(f"Error processing comprehensive response: {str(e)}")
            return {"error": str(e)}
    
    def _extract_bounding_box(self, bounding_poly: Dict[str, Any]) -> Dict[str, int]:
        """Extract bounding box coordinates from polygon"""
        try:
            vertices = bounding_poly.get("vertices", [])
            if len(vertices) >= 4:
                return {
                    "x1": vertices[0].get("x", 0),
                    "y1": vertices[0].get("y", 0),
                    "x2": vertices[2].get("x", 0),
                    "y2": vertices[2].get("y", 0)
                }
        except Exception:
            pass
        return {"x1": 0, "y1": 0, "x2": 0, "y2": 0}
    
    def _is_content_safe(self, safe_search: Dict[str, str]) -> bool:
        """Determine if content is safe based on safe search results"""
        dangerous_levels = ["LIKELY", "VERY_LIKELY"]
        
        return not any(
            safe_search.get(category, "UNKNOWN") in dangerous_levels
            for category in ["adult", "violence", "racy"]
        )

# Global vision service instance
vision_service = VisionService()

# Convenience functions for direct import
async def detect_text_from_image(image_base64: str) -> str:
    """Extract text from image and return as string"""
    result = await vision_service.detect_text(image_base64)
    return result.get("full_text", "")

async def analyze_image_comprehensive(image_base64: str) -> Dict[str, Any]:
    """Perform comprehensive image analysis"""
    return await vision_service.comprehensive_analysis(image_base64)

async def detect_image_labels(image_base64: str) -> List[str]:
    """Get list of detected labels from image"""
    result = await vision_service.detect_labels(image_base64)
    return [label.get("description", "") for label in result.get("labels", [])]

async def check_image_safety(image_base64: str) -> bool:
    """Check if image content is safe"""
    result = await vision_service.detect_safe_search(image_base64)
    return result.get("is_safe", True)
