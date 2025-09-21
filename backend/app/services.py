# backend/app/services.py
"""
Real Services - Replaces all mock data with actual analysis_engine integration
"""

import time
from typing import Dict, Any
from app.services.analysis_engine import run_analysis
from app.models import Result

class AnalysisEngine:
    """Real analysis orchestrator using analysis_engine pipelines"""
    
    async def process_content(self, content_type: str, content: str, language: str = "en") -> Result:
        """
        Process content using real Google APIs through analysis_engine
        Returns Result object that matches frontend expectations
        """
        start_time = time.time()
        
        try:
            # ✅ FIXED: Call real analysis pipelines instead of mock services
            result = await run_analysis(content_type, content, language)
            
            # ✅ FIXED: Add processing time to audit
            processing_time = round(time.time() - start_time, 2)
            result.audit["processing_time"] = f"{processing_time}s"
            result.audit["analyst"] = "CrediScope AI"
            result.audit["content_type"] = content_type
            result.audit["language"] = language
            
            return result
            
        except Exception as e:
            # ✅ FIXED: Fallback Result for errors (using proper models)
            from app.models import Verdict, IntelligenceReport, EducationalChecklistItem
            from datetime import datetime
            import uuid
            
            processing_time = round(time.time() - start_time, 2)
            
            # Create fallback Result with proper error handling
            fallback_result = Result(
                id=str(uuid.uuid4()),
                input=content[:100] if content_type != "image" else "[IMAGE]",
                domain="Error",
                verdict=Verdict(
                    label="⚠️ Caution",
                    confidence=0,
                    summary=f"Analysis failed: {str(e)[:200]}"
                ),
                quick_analysis="Analysis could not be completed due to technical issues. Please try again.",
                evidence=[],
                checklist=[
                    EducationalChecklistItem(
                        point="Technical issue occurred",
                        explanation="The analysis service encountered an error. Please verify your input and try again."
                    ),
                    EducationalChecklistItem(
                        point="Check network connectivity", 
                        explanation="Ensure you have a stable internet connection for API calls."
                    )
                ],
                intelligence=IntelligenceReport(),
                audit={
                    "analysis_time": datetime.utcnow().isoformat(),
                    "processing_time": f"{processing_time}s",
                    "analyst": "CrediScope AI", 
                    "error": str(e),
                    "status": "failed",
                    "content_type": content_type,
                    "language": language
                }
            )
            
            return fallback_result

    def process_content_sync(self, content_type: str, content: str, language: str = "en") -> Result:
        """
        Synchronous wrapper for backwards compatibility
        Uses asyncio.run to execute async process_content
        """
        import asyncio
        
        try:
            # ✅ FIXED: Run async function synchronously for legacy code
            return asyncio.run(self.process_content(content_type, content, language))
        except RuntimeError as e:
            if "asyncio.run() cannot be called from a running event loop" in str(e):
                # Handle case where we're already in an event loop
                import asyncio
                loop = asyncio.get_event_loop()
                return loop.run_until_complete(self.process_content(content_type, content, language))
            else:
                raise

# ✅ FIXED: Global analysis engine instance (maintains interface)
analysis_engine = AnalysisEngine()
