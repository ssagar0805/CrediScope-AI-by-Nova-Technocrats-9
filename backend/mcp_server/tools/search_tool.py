# backend/mcp_server/tools/search_tool.py
"""
Google Search & Fact Check MCP Tool
Combines Custom Search and Fact Check APIs
"""

import asyncio
import logging
from typing import Dict, Any, List

# Import existing services
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '../..'))

from app.services.analysis_engine import (
    google_custom_search,
    factcheck_search,
    wikipedia_lookup
)

logger = logging.getLogger(__name__)

class SearchTool:
    """Google Search and Fact Check tool for MCP"""
    
    def __init__(self):
        self.name = "search_tool"
        self.version = "1.0.0"
    
    async def custom_search(self, query: str, num_results: int = 5) -> Dict[str, Any]:
        """
        Search the web using Google Custom Search API
        
        Args:
            query: Search query
            num_results: Number of results to return (1-10)
            
        Returns:
            Dict containing search results and metadata
        """
        try:
            if not query or not query.strip():
                return {
                    "success": False,
                    "error": "Query cannot be empty",
                    "results": [],
                    "total_results": 0
                }
            
            if num_results < 1 or num_results > 10:
                num_results = 5
            
            # Perform search
            search_results = await google_custom_search(query, num_results)
            
            # Format results
            formatted_results = []
            for result in search_results:
                formatted_results.append({
                    "title": result.get("title", "No title"),
                    "url": result.get("link", ""),
                    "snippet": result.get("snippet", "No description"),
                    "source": result.get("source", result.get("displayLink", "Unknown")),
                    "relevance_score": 1.0  # Could be enhanced with actual scoring
                })
            
            return {
                "success": True,
                "query": query,
                "results": formatted_results,
                "total_results": len(formatted_results),
                "search_time": "real-time"
            }
            
        except Exception as e:
            logger.error(f"Custom search error: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "results": [],
                "total_results": 0
            }
    
    async def factcheck_search(self, query: str, max_results: int = 5) -> Dict[str, Any]:
        """
        Search for fact-check information using Google Fact Check Tools API
        
        Args:
            query: Claim or statement to fact-check
            max_results: Maximum number of fact-check results
            
        Returns:
            Dict containing fact-check results
        """
        try:
            if not query or not query.strip():
                return {
                    "success": False,
                    "error": "Query cannot be empty",
                    "fact_checks": [],
                    "total_found": 0
                }
            
            if max_results < 1 or max_results > 20:
                max_results = 5
            
            # Perform fact-check search
            factcheck_results = await factcheck_search(query, max_results)
            
            # Format results
            formatted_checks = []
            for result in factcheck_results:
                claim_text = result.get("text", "Unknown claim")
                claim_reviews = result.get("claimReview", [])
                
                for review in claim_reviews:
                    publisher = review.get("publisher", {})
                    formatted_checks.append({
                        "claim": claim_text,
                        "publisher_name": publisher.get("name", "Unknown publisher"),
                        "publisher_site": publisher.get("site", ""),
                        "review_date": review.get("reviewDate", ""),
                        "rating": review.get("textualRating", "No rating"),
                        "title": review.get("title", ""),
                        "url": review.get("url", ""),
                        "language_code": review.get("languageCode", "en")
                    })
            
            return {
                "success": True,
                "query": query,
                "fact_checks": formatted_checks,
                "total_found": len(formatted_checks),
                "search_type": "fact_check"
            }
            
        except Exception as e:
            logger.error(f"Fact-check search error: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "fact_checks": [],
                "total_found": 0
            }
    
    async def wikipedia_search(self, query: str) -> Dict[str, Any]:
        """
        Search Wikipedia for information
        
        Args:
            query: Search query for Wikipedia
            
        Returns:
            Dict containing Wikipedia summary
        """
        try:
            if not query or not query.strip():
                return {
                    "success": False,
                    "error": "Query cannot be empty",
                    "summary": "",
                    "url": ""
                }
            
            # Search Wikipedia
            wiki_result = await wikipedia_lookup(query)
            
            if wiki_result:
                return {
                    "success": True,
                    "title": wiki_result.get("title", query),
                    "summary": wiki_result.get("extract", "No summary available"),
                    "url": wiki_result.get("url", ""),
                    "source": "Wikipedia"
                }
            else:
                return {
                    "success": False,
                    "error": "No Wikipedia article found",
                    "summary": "",
                    "url": ""
                }
                
        except Exception as e:
            logger.error(f"Wikipedia search error: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "summary": "",
                "url": ""
            }
    
    async def comprehensive_search(self, query: str) -> Dict[str, Any]:
        """
        Perform comprehensive search combining all search types
        
        Args:
            query: Search query
            
        Returns:
            Dict containing results from all search sources
        """
        try:
            # Run all searches in parallel
            tasks = [
                self.custom_search(query, 3),
                self.factcheck_search(query, 3),
                self.wikipedia_search(query)
            ]
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Process results
            search_result = results[0] if not isinstance(results[0], Exception) else {"success": False, "results": []}
            factcheck_result = results[1] if not isinstance(results[1], Exception) else {"success": False, "fact_checks": []}
            wikipedia_result = results[2] if not isinstance(results[2], Exception) else {"success": False, "summary": ""}
            
            return {
                "success": True,
                "query": query,
                "web_search": search_result,
                "fact_checks": factcheck_result,
                "wikipedia": wikipedia_result,
                "search_types": ["web", "fact_check", "wikipedia"]
            }
            
        except Exception as e:
            logger.error(f"Comprehensive search error: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "query": query
            }

# Global instance
search_tool = SearchTool()

# Convenience functions
async def web_search(query: str, num_results: int = 5) -> List[Dict]:
    """Simple web search that returns just the results"""
    result = await search_tool.custom_search(query, num_results)
    return result.get("results", [])

async def fact_check(query: str) -> List[Dict]:
    """Simple fact check that returns just the fact check results"""
    result = await search_tool.factcheck_search(query)
    return result.get("fact_checks", [])
