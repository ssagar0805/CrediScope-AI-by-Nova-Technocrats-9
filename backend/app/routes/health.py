# backend/app/routes/health.py

from fastapi import APIRouter, status, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
from datetime import datetime
import asyncio
import time
import os

router = APIRouter()

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    version: str
    uptime: str
    checks: Dict[str, Any]

class ServiceCheck(BaseModel):
    status: str
    response_time: float
    message: Optional[str] = None

async def check_google_apis() -> ServiceCheck:
    """Check if Google APIs are accessible"""
    start_time = time.time()
    
    try:
        # Test Google Translate API
        import aiohttp
        
        api_key = os.getenv("TRANSLATION_API_KEY")
        if not api_key:
            return ServiceCheck(
                status="warning",
                response_time=0.0,
                message="Translation API key not configured"
            )
        
        url = f"https://translation.googleapis.com/language/translate/v2/languages?key={api_key}"
        
        async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=5)) as session:
            async with session.get(url) as resp:
                if resp.status == 200:
                    return ServiceCheck(
                        status="healthy",
                        response_time=round(time.time() - start_time, 3),
                        message="Google APIs accessible"
                    )
                else:
                    return ServiceCheck(
                        status="unhealthy",
                        response_time=round(time.time() - start_time, 3),
                        message=f"API returned status {resp.status}"
                    )
                    
    except Exception as e:
        return ServiceCheck(
            status="unhealthy",
            response_time=round(time.time() - start_time, 3),
            message=f"API check failed: {str(e)}"
        )

async def check_analysis_engine() -> ServiceCheck:
    """Check if analysis engine is working"""
    start_time = time.time()
    
    try:
        from app.services.analysis_engine import run_analysis
        
        # Test with minimal content
        test_result = await run_analysis("text", "test content", "en")
        
        return ServiceCheck(
            status="healthy",
            response_time=round(time.time() - start_time, 3),
            message="Analysis engine responsive"
        )
        
    except Exception as e:
        return ServiceCheck(
            status="unhealthy", 
            response_time=round(time.time() - start_time, 3),
            message=f"Analysis engine error: {str(e)}"
        )

async def check_storage() -> ServiceCheck:
    """Check if storage system is working"""
    start_time = time.time()
    
    try:
        from app.database import storage
        
        # Test storage operations
        test_id = "health_check_test"
        test_data = {"status": "test", "timestamp": datetime.utcnow().isoformat()}
        
        # Test save and retrieve
        success = storage.save_analysis(test_id, test_data)
        if success:
            retrieved = storage.get_analysis(test_id)
            if retrieved:
                return ServiceCheck(
                    status="healthy",
                    response_time=round(time.time() - start_time, 3),
                    message="Storage system operational"
                )
        
        return ServiceCheck(
            status="unhealthy",
            response_time=round(time.time() - start_time, 3),
            message="Storage operations failed"
        )
        
    except Exception as e:
        return ServiceCheck(
            status="unhealthy",
            response_time=round(time.time() - start_time, 3),
            message=f"Storage error: {str(e)}"
        )

# App start time for uptime calculation
app_start_time = time.time()

@router.get("/health", response_model=HealthResponse, status_code=status.HTTP_200_OK)
async def comprehensive_health_check():
    """
    Comprehensive health check endpoint
    
    Checks:
    - Google APIs accessibility
    - Analysis engine functionality  
    - Storage system operations
    - Overall system status
    """
    
    start_time = time.time()
    
    # Run all checks in parallel
    google_check, analysis_check, storage_check = await asyncio.gather(
        check_google_apis(),
        check_analysis_engine(), 
        check_storage(),
        return_exceptions=True
    )
    
    # Handle any exceptions
    checks = {}
    
    if isinstance(google_check, ServiceCheck):
        checks["google_apis"] = google_check.dict()
    else:
        checks["google_apis"] = {"status": "error", "message": str(google_check)}
    
    if isinstance(analysis_check, ServiceCheck):
        checks["analysis_engine"] = analysis_check.dict()
    else:
        checks["analysis_engine"] = {"status": "error", "message": str(analysis_check)}
        
    if isinstance(storage_check, ServiceCheck):
        checks["storage"] = storage_check.dict()
    else:
        checks["storage"] = {"status": "error", "message": str(storage_check)}
    
    # Determine overall status
    all_statuses = [check.get("status", "error") for check in checks.values()]
    
    if all(s == "healthy" for s in all_statuses):
        overall_status = "healthy"
    elif any(s == "unhealthy" for s in all_statuses):
        overall_status = "unhealthy"
    else:
        overall_status = "degraded"
    
    # Calculate uptime
    uptime_seconds = time.time() - app_start_time
    uptime_str = f"{int(uptime_seconds // 3600)}h {int((uptime_seconds % 3600) // 60)}m {int(uptime_seconds % 60)}s"
    
    response = HealthResponse(
        status=overall_status,
        timestamp=datetime.utcnow().isoformat(),
        version="1.0.0",
        uptime=uptime_str,
        checks=checks
    )
    
    # Return appropriate HTTP status
    if overall_status == "healthy":
        return response
    elif overall_status == "degraded":
        return response  # Still 200 but with warnings
    else:
        # Return 503 Service Unavailable for unhealthy
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=response.dict()
        )

@router.get("/health/live", status_code=status.HTTP_200_OK)
async def liveness_probe():
    """
    Kubernetes liveness probe endpoint
    Simple check to verify the application is running
    """
    return {"status": "alive", "timestamp": datetime.utcnow().isoformat()}

@router.get("/health/ready", status_code=status.HTTP_200_OK) 
async def readiness_probe():
    """
    Kubernetes readiness probe endpoint
    Check if application is ready to receive traffic
    """
    
    try:
        # Quick check of critical components
        from app.services.analysis_engine import run_analysis
        
        # Very lightweight test
        return {
            "status": "ready",
            "timestamp": datetime.utcnow().isoformat(),
            "message": "Application ready to receive traffic"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={"status": "not_ready", "error": str(e)}
        )

@router.get("/health/simple")
async def simple_health_check():
    """Simple health check for load balancers"""
    return {"status": "ok"}
