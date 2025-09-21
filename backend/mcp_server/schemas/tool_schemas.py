# backend/mcp_server/schemas/tool_schemas.py
"""
MCP Tool Schemas for Google APIs
Defines all tools that will be exposed through the MCP server
"""

from typing import Dict, Any, List

# MCP Tool Schema Structure based on Model Context Protocol specification
TOOL_SCHEMAS = {
    "translate_text": {
        "name": "translate_text",
        "description": "Translate text between languages using Google Translate API",
        "inputSchema": {
            "type": "object",
            "properties": {
                "text": {
                    "type": "string",
                    "description": "Text to translate",
                    "maxLength": 5000
                },
                "target_language": {
                    "type": "string", 
                    "description": "Target language code (e.g., 'en', 'es', 'fr')",
                    "default": "en"
                },
                "source_language": {
                    "type": "string",
                    "description": "Source language code (optional, auto-detect if not provided)",
                    "default": None
                }
            },
            "required": ["text"]
        }
    },
    
    "detect_language": {
        "name": "detect_language",
        "description": "Detect the language of input text",
        "inputSchema": {
            "type": "object",
            "properties": {
                "text": {
                    "type": "string",
                    "description": "Text to analyze for language detection",
                    "maxLength": 1000
                }
            },
            "required": ["text"]
        }
    },
    
    "search_factcheck": {
        "name": "search_factcheck",
        "description": "Search for fact-check information using Google Fact Check Tools API",
        "inputSchema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Claim or statement to fact-check",
                    "maxLength": 500
                },
                "max_results": {
                    "type": "integer",
                    "description": "Maximum number of fact-check results",
                    "minimum": 1,
                    "maximum": 20,
                    "default": 5
                }
            },
            "required": ["query"]
        }
    },
    
    "custom_search": {
        "name": "custom_search", 
        "description": "Search the web using Google Custom Search API",
        "inputSchema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Search query",
                    "maxLength": 200
                },
                "num_results": {
                    "type": "integer",
                    "description": "Number of search results to return",
                    "minimum": 1,
                    "maximum": 10,
                    "default": 5
                }
            },
            "required": ["query"]
        }
    },
    
    "analyze_perspective": {
        "name": "analyze_perspective",
        "description": "Analyze text for toxicity and manipulation using Google Perspective API", 
        "inputSchema": {
            "type": "object",
            "properties": {
                "text": {
                    "type": "string",
                    "description": "Text to analyze for toxicity",
                    "maxLength": 3000
                },
                "attributes": {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "enum": ["TOXICITY", "SEVERE_TOXICITY", "INSULT", "PROFANITY", "THREAT"]
                    },
                    "description": "Perspective attributes to analyze",
                    "default": ["TOXICITY", "SEVERE_TOXICITY"]
                }
            },
            "required": ["text"]
        }
    },
    
    "vision_extract_text": {
        "name": "vision_extract_text",
        "description": "Extract text from images using Google Vision API OCR",
        "inputSchema": {
            "type": "object", 
            "properties": {
                "image_base64": {
                    "type": "string",
                    "description": "Base64 encoded image data"
                },
                "max_results": {
                    "type": "integer",
                    "description": "Maximum number of text annotations",
                    "minimum": 1,
                    "maximum": 50,
                    "default": 20
                }
            },
            "required": ["image_base64"]
        }
    },
    
    "vision_detect_labels": {
        "name": "vision_detect_labels",
        "description": "Detect objects and labels in images using Google Vision API",
        "inputSchema": {
            "type": "object",
            "properties": {
                "image_base64": {
                    "type": "string", 
                    "description": "Base64 encoded image data"
                },
                "max_results": {
                    "type": "integer",
                    "description": "Maximum number of labels to return",
                    "minimum": 1,
                    "maximum": 20,
                    "default": 10
                }
            },
            "required": ["image_base64"]
        }
    },
    
    "vertex_analyze": {
        "name": "vertex_analyze",
        "description": "Generate AI analysis using Google Vertex AI/Gemini",
        "inputSchema": {
            "type": "object",
            "properties": {
                "prompt": {
                    "type": "string",
                    "description": "Analysis prompt for the AI model",
                    "maxLength": 8000
                },
                "max_tokens": {
                    "type": "integer",
                    "description": "Maximum output tokens",
                    "minimum": 50,
                    "maximum": 2000,
                    "default": 512
                },
                "context": {
                    "type": "object",
                    "description": "Additional context data for analysis",
                    "default": {}
                }
            },
            "required": ["prompt"]
        }
    }
}

def get_tool_schema(tool_name: str) -> Dict[str, Any]:
    """Get schema for a specific tool"""
    return TOOL_SCHEMAS.get(tool_name)

def get_all_tool_schemas() -> Dict[str, Dict[str, Any]]:
    """Get all available tool schemas"""
    return TOOL_SCHEMAS

def list_tool_names() -> List[str]:
    """Get list of all available tool names"""
    return list(TOOL_SCHEMAS.keys())

def validate_tool_exists(tool_name: str) -> bool:
    """Check if a tool schema exists"""
    return tool_name in TOOL_SCHEMAS
