# backend/mcp_server/server.py
"""
CrediScope MCP Server - Main Implementation (CORRECTED)
Exposes Google APIs as MCP tools following Model Context Protocol
"""

import asyncio
import json
import logging
from typing import Any, Dict, List, Optional, Sequence
from datetime import datetime

# MCP SDK imports
try:
    from mcp.server.fastmcp import FastMCP
except ImportError:
    print("⚠️  MCP SDK not installed. Install with: pip install mcp")
    FastMCP = None

# Import Google API services (reuse existing implementations)
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.services.translation_service import translation_service
from app.services.vision_service import vision_service
from app.services.analysis_engine import (
    factcheck_search,
    google_custom_search, 
    perspective_score,
    vertex_analyze
)

logger = logging.getLogger(__name__)

class CrediScopeMCPServer:
    """MCP Server for CrediScope Google APIs"""
    
    def __init__(self, name: str = "crediscope-mcp"):
        """Initialize MCP server with Google API tools"""
        self.name = name
        self.tools_registered = False
        self.registered_tools = []  # Track registered tools manually
        
        if FastMCP is None:
            raise ImportError("MCP SDK required. Install with: pip install mcp")
            
        # Initialize FastMCP server
        self.mcp = FastMCP(name)
        self._register_tools()
    
    def _register_tools(self):
        """Register all Google API tools with MCP server"""
        if self.tools_registered:
            return
            
        # Register translation tools
        self._register_translation_tools()
        
        # Register search and fact-check tools  
        self._register_search_tools()
        
        # Register vision tools
        self._register_vision_tools()
        
        # Register AI analysis tools
        self._register_ai_tools()
        
        self.tools_registered = True
        logger.info(f"Registered {len(self.registered_tools)} MCP tools")
    
    def _register_translation_tools(self):
        """Register Google Translate API tools"""
        
        @self.mcp.tool()
        async def translate_text(
            text: str,
            target_language: str = "en", 
            source_language: Optional[str] = None
        ) -> str:
            """Translate text between languages using Google Translate API"""
            try:
                result = await translation_service.translate_text(
                    text, target_language, source_language
                )
                return f"Translation: {result}"
            except Exception as e:
                return f"Translation error: {str(e)}"
        
        @self.mcp.tool()
        async def detect_language(text: str) -> str:
            """Detect the language of input text"""
            try:
                result = await translation_service.detect_language(text)
                return f"Detected language: {result}"
            except Exception as e:
                return f"Language detection error: {str(e)}"
        
        # Track registered tools
        self.registered_tools.extend(["translate_text", "detect_language"])
    
    def _register_search_tools(self):
        """Register search and fact-check tools"""
        
        @self.mcp.tool()
        async def search_factcheck(query: str, max_results: int = 5) -> str:
            """Search for fact-check information using Google Fact Check Tools API"""
            try:
                results = await factcheck_search(query, max_results)
                if not results:
                    return "No fact-check results found"
                
                formatted = []
                for result in results[:max_results]:
                    text = result.get('text', 'Unknown claim')
                    reviews = result.get('claimReview', [])
                    if reviews:
                        review = reviews[0]
                        publisher = review.get('publisher', {}).get('name', 'Unknown')
                        rating = review.get('textualRating', 'No rating')
                        formatted.append(f"Claim: {text}\nPublisher: {publisher}\nRating: {rating}")
                
                return "\n\n".join(formatted) if formatted else "No detailed fact-check information available"
            except Exception as e:
                return f"Fact-check search error: {str(e)}"
        
        @self.mcp.tool()
        async def custom_search(query: str, num_results: int = 5) -> str:
            """Search the web using Google Custom Search API"""
            try:
                results = await google_custom_search(query, num_results)
                if not results:
                    return "No search results found"
                
                formatted = []
                for result in results[:num_results]:
                    title = result.get('title', 'No title')
                    link = result.get('link', 'No link')  
                    snippet = result.get('snippet', 'No description')
                    formatted.append(f"Title: {title}\nURL: {link}\nDescription: {snippet}")
                
                return "\n\n".join(formatted)
            except Exception as e:
                return f"Search error: {str(e)}"
        
        # Track registered tools
        self.registered_tools.extend(["search_factcheck", "custom_search"])
    
    def _register_vision_tools(self):
        """Register Google Vision API tools"""
        
        @self.mcp.tool()
        async def vision_extract_text(image_base64: str, max_results: int = 20) -> str:
            """Extract text from images using Google Vision API OCR"""
            try:
                result = await vision_service.detect_text(image_base64, max_results)
                
                full_text = result.get('full_text', '')
                if full_text:
                    return f"Extracted text: {full_text}"
                else:
                    return "No text found in image"
            except Exception as e:
                return f"Vision OCR error: {str(e)}"
        
        @self.mcp.tool()
        async def vision_detect_labels(image_base64: str, max_results: int = 10) -> str:
            """Detect objects and labels in images using Google Vision API"""
            try:
                result = await vision_service.detect_labels(image_base64, max_results)
                
                labels = result.get('labels', [])
                if labels:
                    formatted = []
                    for label in labels[:max_results]:
                        desc = label.get('description', 'Unknown')
                        score = label.get('score', 0)
                        formatted.append(f"{desc} ({score:.2f})")
                    return f"Detected labels: {', '.join(formatted)}"
                else:
                    return "No labels detected in image"
            except Exception as e:
                return f"Vision label detection error: {str(e)}"
        
        # Track registered tools
        self.registered_tools.extend(["vision_extract_text", "vision_detect_labels"])
    
    def _register_ai_tools(self):
        """Register AI analysis tools"""
        
        @self.mcp.tool()
        async def analyze_perspective(
            text: str, 
            attributes: List[str] = ["TOXICITY", "SEVERE_TOXICITY"]
        ) -> str:
            """Analyze text for toxicity and manipulation using Google Perspective API"""
            try:
                result = await perspective_score(text)
                
                if not result:
                    return "No toxicity analysis available"
                
                formatted = []
                for attr_name, attr_data in result.items():
                    if isinstance(attr_data, dict) and 'summaryScore' in attr_data:
                        score = attr_data['summaryScore'].get('value', 0)
                        formatted.append(f"{attr_name}: {score:.3f}")
                
                return f"Toxicity analysis: {', '.join(formatted)}" if formatted else "Analysis completed"
            except Exception as e:
                return f"Perspective analysis error: {str(e)}"
        
        @self.mcp.tool()
        async def vertex_analyze(
            prompt: str,
            max_tokens: int = 512,
            context: Dict[str, Any] = None
        ) -> str:
            """Generate AI analysis using Google Vertex AI/Gemini"""
            try:
                # Enhance prompt with context if provided
                enhanced_prompt = prompt
                if context:
                    enhanced_prompt = f"Context: {json.dumps(context)}\n\nPrompt: {prompt}"
                
                result = await vertex_analyze(enhanced_prompt, max_tokens)
                
                # Extract response from various possible formats
                if isinstance(result, dict):
                    if 'predictions' in result and result['predictions']:
                        response = result['predictions'][0]
                        if isinstance(response, dict):
                            return response.get('content', str(response))
                        return str(response)
                    elif 'content' in result:
                        return str(result['content'])
                    else:
                        return str(result)
                
                return str(result)
            except Exception as e:
                return f"Vertex AI analysis error: {str(e)}"
        
        # Track registered tools
        self.registered_tools.extend(["analyze_perspective", "vertex_analyze"])
    
    def get_tool_list(self) -> List[str]:
        """Get list of all registered tools"""
        return self.registered_tools.copy()  # Return copy of our manual tracking
    
    def get_tool_info(self) -> Dict[str, Any]:
        """Get information about all registered tools"""
        tools_info = {}
        for tool_name in self.registered_tools:
            tools_info[tool_name] = {
                "name": tool_name,
                "description": f"Google API tool: {tool_name}",
                "registered": True
            }
        return tools_info
    
    def get_server_info(self) -> Dict[str, Any]:
        """Get server information"""
        return {
            "name": self.name,
            "version": "1.0.0",
            "tools_count": len(self.registered_tools),
            "tools": self.get_tool_list(),
            "status": "running" if self.tools_registered else "initializing",
            "timestamp": datetime.utcnow().isoformat()
        }

# Global MCP server instance
mcp_server = CrediScopeMCPServer()

# Convenience function to get the server
def get_mcp_server() -> CrediScopeMCPServer:
    """Get the global MCP server instance"""
    return mcp_server
