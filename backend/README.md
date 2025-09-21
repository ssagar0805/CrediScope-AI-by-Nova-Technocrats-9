# CrediScope Backend - FastAPI MVP 

## Overview
Lightweight FastAPI backend for Crediscope misinformation detection platform. This MVP provides core content verification capabilities with mock AI services for rapid development and React frontend integration.

## Features
- ✅ Content verification (text, URL, image)
- ✅ AI analysis with deterministic results  
- ✅ JSON-based local storage
- ✅ CORS configured for React frontend
- ✅ RESTful API with OpenAPI documentation
- ✅ Health monitoring endpoints

## Quick Start

### Prerequisites
- Python 3.8+
- Virtual environment (recommended)

### Installation
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Configuration
```bash
# Copy environment template
cp .env.sample .env

# Edit .env if needed (defaults work for development)
```

### Run Server
```bash
# Simple start
python run.py

# Or direct uvicorn
uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload
```

## API Endpoints

### Core Verification
```
POST /api/v1/verify
- Analyzes text, URL, or image content
- Returns verdict, confidence score, and detailed analysis
```

### Results Retrieval  
```
GET /api/v1/results/{analysis_id}
- Retrieves detailed analysis by ID
```

### Archive/History
```
GET /api/v1/archive?limit=20&user_id=optional
- Returns analysis history
```

### Health Monitoring
```
GET /health
GET /api/v1/health
- Server health status
```

## API Documentation
- Swagger UI: http://localhost:8080/docs
- ReDoc: http://localhost:8080/redoc

## Example Usage

### Text Analysis
```bash
curl -X POST "http://localhost:8080/api/v1/verify" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "content_type=text&content=This is fake news about vaccines"
```

### URL Verification
```bash
curl -X POST "http://localhost:8080/api/v1/verify" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "content_type=url&content=https://bbc.com/news/example"
```

### Image Upload
```bash
curl -X POST "http://localhost:8080/api/v1/verify" \
  -F "content_type=image" \
  -F "content=image_placeholder" \
  -F "file=@image.jpg"
```

## Response Format
```json
{
  "analysis_id": "uuid-string",
  "verdict": "true|false|inconclusive",
  "confidence_score": 0.75,
  "summary": "Analysis summary",
  "processing_time": 2.1,
  "detailed_analysis": {
    "evidence": [],
    "sources": [],
    "gemini_analysis": "AI explanation",
    "vision_analysis": "Image analysis results"
  }
}
```

## Mock AI Services
Current implementation uses deterministic mock services:
- **Text Analysis**: Hash-based verdict assignment
- **Image Analysis**: Placeholder manipulation detection
- **URL Analysis**: Domain reputation scoring

## Storage
- **Type**: Local JSON files
- **Location**: `storage/` directory
- **Files**: `analyses.json`, `results.json`
- **Structure**: Key-value storage with timestamps

## CORS Configuration
Configured for React development servers:
- `http://localhost:3000` (Create React App)
- `http://localhost:5173` (Vite)
- Configurable via `FRONTEND_ORIGIN` environment variable

## Development Notes
- Built for rapid hackathon development
- Mock services provide realistic response patterns
- Ready for real GCP AI service integration
- Structured for easy expansion to full features

## Next Steps (Post-MVP)
- [ ] Integrate real Google Cloud AI services
- [ ] Add Firestore database connection
- [ ] Implement user authentication
- [ ] Add comprehensive error handling
- [ ] Deploy to Google Cloud Run
- [ ] Add rate limiting and caching
