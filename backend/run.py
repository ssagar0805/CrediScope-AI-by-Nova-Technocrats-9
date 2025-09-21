#!/usr/bin/env python3
"""
TruthLens FastAPI Server Launcher
Quick start script for development environment
"""

import uvicorn
import os
from app.config import settings

def main():
    """Launch the FastAPI server with proper configuration"""
    print("🚀 Starting TruthLens FastAPI Server...")
    print(f"📡 Server will run on: http://0.0.0.0:{settings.PORT}")
    print(f"📖 API Documentation: http://localhost:{settings.PORT}/docs")
    print(f"🔍 Health Check: http://localhost:{settings.PORT}/health")
    print(f"🌐 CORS enabled for: {settings.FRONTEND_ORIGIN}")
    print("-" * 50)
    
    # Run server with configuration from settings
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",  # Allow external connections
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info" if settings.DEBUG else "warning"
    )

if __name__ == "__main__":
    main()