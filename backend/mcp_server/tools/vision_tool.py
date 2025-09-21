# backend/mcp_server/tools/vision_tool.py
"""
Google Vision API MCP Tool
Comprehensive image analysis capabilities
"""

import asyncio
import base64
import logging
from typing import Dict, Any, List, Optional

# Import existing vision service
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '../..'))

from app.services.vision_service import vision_service

logger = logging.getLogger(__name__)

class VisionTool:
    """Google Vision API tool for MCP"""
    
    def __init__(self):
        self.name = "vision_tool"
        self.version = "1.0.0"
    
    async def extract_text(self, image_base64: str, max_results: int = 20) -> Dict[str, Any]:
        """
        Extract text from images using Google Vision API OCR
        
        Args:
            image_base64: Base64 encoded image data
            max_results: Maximum number of text annotations
            
        Returns:
            Dict containing extracted text and metadata
        """
        try:
            if not image_base64:
                return {
                    "success": False,
                    "error": "No image data provided",
                    "text": "",
                    "word_count": 0
                }
            
            # Validate base64 format
            try:
                base64.b64decode(image_base64)
            except Exception:
                return {
                    "success": False,
                    "error": "Invalid base64 image data",
                    "text": "",
                    "word_count": 0
                }
            
            # Perform OCR
            result = await vision_service.detect_text(image_base64, max_results)
            
            if result.get("error"):
                return {
                    "success": False,
                    "error": result["error"],
                    "text": "",
                    "word_count": 0
                }
            
            full_text = result.get("full_text", "")
            texts = result.get("texts", [])
            confidence = result.get("confidence", 0.0)
            
            return {
                "success": True,
                "text": full_text,
                "word_count": len(full_text.split()) if full_text else 0,
                "character_count": len(full_text),
                "confidence": confidence,
                "individual_texts": len(texts),
                "has_text": bool(full_text.strip())
            }
            
        except Exception as e:
            logger.error(f"Text extraction error: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "text": "",
                "word_count": 0
            }
    
    async def detect_labels(self, image_base64: str, max_results: int = 10) -> Dict[str, Any]:
        """
        Detect objects and labels in images using Google Vision API
        
        Args:
            image_base64: Base64 encoded image data
            max_results: Maximum number of labels to return
            
        Returns:
            Dict containing detected labels and confidence scores
        """
        try:
            if not image_base64:
                return {
                    "success": False,
                    "error": "No image data provided",
                    "labels": [],
                    "total_labels": 0
                }
            
            # Perform label detection
            result = await vision_service.detect_labels(image_base64, max_results)
            
            if result.get("error"):
                return {
                    "success": False,
                    "error": result["error"],
                    "labels": [],
                    "total_labels": 0
                }
            
            labels = result.get("labels", [])
            
            # Format labels with categories
            formatted_labels = []
            for label in labels:
                formatted_labels.append({
                    "description": label.get("description", "Unknown"),
                    "confidence": round(label.get("score", 0.0), 3),
                    "category": self._categorize_label(label.get("description", ""))
                })
            
            return {
                "success": True,
                "labels": formatted_labels,
                "total_labels": len(formatted_labels),
                "top_label": formatted_labels[0] if formatted_labels else None,
                "high_confidence_labels": [l for l in formatted_labels if l["confidence"] > 0.8]
            }
            
        except Exception as e:
            logger.error(f"Label detection error: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "labels": [],
                "total_labels": 0
            }
    
    async def check_safe_search(self, image_base64: str) -> Dict[str, Any]:
        """
        Check image content safety using Google Vision API
        
        Args:
            image_base64: Base64 encoded image data
            
        Returns:
            Dict containing safety analysis results
        """
        try:
            if not image_base64:
                return {
                    "success": False,
                    "error": "No image data provided",
                    "is_safe": True,
                    "safety_scores": {}
                }
            
            # Perform safe search detection
            result = await vision_service.detect_safe_search(image_base64)
            
            if result.get("error"):
                return {
                    "success": False,
                    "error": result["error"],
                    "is_safe": True,  # Default to safe on error
                    "safety_scores": {}
                }
            
            safe_search = result.get("safe_search", {})
            is_safe = result.get("is_safe", True)
            
            # Convert likelihood scores to numeric values
            safety_scores = {}
            likelihood_map = {
                "VERY_UNLIKELY": 1,
                "UNLIKELY": 2, 
                "POSSIBLE": 3,
                "LIKELY": 4,
                "VERY_LIKELY": 5,
                "UNKNOWN": 0
            }
            
            for category, likelihood in safe_search.items():
                safety_scores[category] = {
                    "likelihood": likelihood,
                    "score": likelihood_map.get(likelihood, 0),
                    "risk_level": self._get_risk_level(likelihood)
                }
            
            return {
                "success": True,
                "is_safe": is_safe,
                "safety_scores": safety_scores,
                "overall_safety": "SAFE" if is_safe else "UNSAFE",
                "warnings": self._generate_safety_warnings(safety_scores)
            }
            
        except Exception as e:
            logger.error(f"Safe search error: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "is_safe": True,
                "safety_scores": {}
            }
    
    async def comprehensive_analysis(self, image_base64: str) -> Dict[str, Any]:
        """
        Perform comprehensive image analysis combining all Vision API features
        
        Args:
            image_base64: Base64 encoded image data
            
        Returns:
            Dict containing all analysis results
        """
        try:
            if not image_base64:
                return {
                    "success": False,
                    "error": "No image data provided",
                    "analysis": {}
                }
            
            # Run all analyses in parallel
            tasks = [
                self.extract_text(image_base64, 15),
                self.detect_labels(image_base64, 8),
                self.check_safe_search(image_base64)
            ]
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Process results
            text_result = results[0] if not isinstance(results[0], Exception) else {"success": False, "text": ""}
            label_result = results[1] if not isinstance(results[1], Exception) else {"success": False, "labels": []}
            safety_result = results[2] if not isinstance(results[2], Exception) else {"success": False, "is_safe": True}
            
            # Generate comprehensive summary
            analysis_summary = {
                "has_text": text_result.get("has_text", False),
                "text_length": text_result.get("character_count", 0),
                "object_count": label_result.get("total_labels", 0),
                "is_safe": safety_result.get("is_safe", True),
                "analysis_quality": self._assess_analysis_quality(text_result, label_result, safety_result)
            }
            
            return {
                "success": True,
                "text_analysis": text_result,
                "label_analysis": label_result,
                "safety_analysis": safety_result,
                "summary": analysis_summary,
                "recommendations": self._generate_recommendations(text_result, label_result, safety_result)
            }
            
        except Exception as e:
            logger.error(f"Comprehensive analysis error: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "analysis": {}
            }
    
    def _categorize_label(self, description: str) -> str:
        """Categorize detected labels into broad categories"""
        description_lower = description.lower()
        
        if any(word in description_lower for word in ["person", "people", "human", "man", "woman", "child"]):
            return "people"
        elif any(word in description_lower for word in ["car", "vehicle", "truck", "bike", "transport"]):
            return "vehicle"
        elif any(word in description_lower for word in ["animal", "dog", "cat", "bird", "pet"]):
            return "animal"
        elif any(word in description_lower for word in ["food", "drink", "meal", "restaurant"]):
            return "food"
        elif any(word in description_lower for word in ["building", "house", "architecture", "structure"]):
            return "building"
        elif any(word in description_lower for word in ["nature", "tree", "plant", "flower", "landscape"]):
            return "nature"
        else:
            return "object"
    
    def _get_risk_level(self, likelihood: str) -> str:
        """Convert likelihood to risk level"""
        risk_map = {
            "VERY_UNLIKELY": "VERY_LOW",
            "UNLIKELY": "LOW", 
            "POSSIBLE": "MEDIUM",
            "LIKELY": "HIGH",
            "VERY_LIKELY": "VERY_HIGH",
            "UNKNOWN": "UNKNOWN"
        }
        return risk_map.get(likelihood, "UNKNOWN")
    
    def _generate_safety_warnings(self, safety_scores: Dict) -> List[str]:
        """Generate safety warnings based on scores"""
        warnings = []
        
        for category, data in safety_scores.items():
            if data.get("score", 0) >= 4:  # LIKELY or VERY_LIKELY
                warnings.append(f"High {category.lower()} content detected")
            elif data.get("score", 0) >= 3:  # POSSIBLE
                warnings.append(f"Possible {category.lower()} content detected")
        
        return warnings
    
    def _assess_analysis_quality(self, text_result: Dict, label_result: Dict, safety_result: Dict) -> str:
        """Assess overall quality of the analysis"""
        quality_score = 0
        
        # Text analysis quality
        if text_result.get("success") and text_result.get("has_text"):
            quality_score += 30
        
        # Label analysis quality
        if label_result.get("success") and label_result.get("total_labels", 0) > 0:
            quality_score += 40
        
        # Safety analysis quality
        if safety_result.get("success"):
            quality_score += 30
        
        if quality_score >= 80:
            return "HIGH"
        elif quality_score >= 60:
            return "MEDIUM" 
        else:
            return "LOW"
    
    def _generate_recommendations(self, text_result: Dict, label_result: Dict, safety_result: Dict) -> List[str]:
        """Generate analysis recommendations"""
        recommendations = []
        
        if text_result.get("has_text"):
            recommendations.append("Consider fact-checking the extracted text")
        
        if label_result.get("total_labels", 0) > 5:
            recommendations.append("Image contains multiple objects - verify context")
        
        if not safety_result.get("is_safe"):
            recommendations.append("Exercise caution - potentially inappropriate content detected")
        
        if not text_result.get("has_text") and label_result.get("total_labels", 0) == 0:
            recommendations.append("Limited analysis results - image may be low quality or abstract")
        
        return recommendations

# Global instance
vision_tool = VisionTool()

# Convenience functions
async def extract_text_from_image(image_base64: str) -> str:
    """Simple text extraction that returns just the text"""
    result = await vision_tool.extract_text(image_base64)
    return result.get("text", "")

async def detect_image_objects(image_base64: str) -> List[str]:
    """Simple object detection that returns just the labels"""
    result = await vision_tool.detect_labels(image_base64)
    return [label.get("description", "") for label in result.get("labels", [])]
