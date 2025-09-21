from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from typing import Optional
import base64
import uuid
import json
import asyncio
import re

from pydantic import BaseModel
from app.models import Result  # ✅ FIXED: Using Result instead of AnalysisResponse
from app.services.analysis_engine import run_analysis  # ✅ FIXED: Direct import from analysis_engine
from app.database import storage

router = APIRouter()

class VerifyRequest(BaseModel):
    content_type: str
    content: str
    language: Optional[str] = "en"
    user_id: Optional[str] = None

@router.post("/verify", response_model=Result)  # ✅ FIXED: Using Result response model
async def verify_content(request: VerifyRequest):
    content_type = request.content_type
    content = request.content
    language = request.language
    user_id = request.user_id

    if content_type not in {"text", "url", "image"}:
        raise HTTPException(status_code=400, detail="Invalid content_type.")

    # ✅ FIXED: Proper image handling
    if content_type == "image":
        try:
            # Validate base64 and keep as-is for analysis_engine
            base64.b64decode(content)  # Just validate, don't re-encode
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid base64 image data")

    try:
        # ✅ FIXED: Call real analysis_engine instead of mock services
        result = await run_analysis(content_type, content, language)
        
        # ✅ FIXED: Store Result object directly (no transformation needed)
        storage.save_analysis(result.id, {
            "analysis_id": result.id,
            "content_type": content_type,
            "content": "[IMAGE]" if content_type == "image" else content[:500],
            "language": language,
            "user_id": user_id,
            "verdict": result.verdict.label,
            "confidence_score": result.verdict.confidence,
            "summary": result.verdict.summary,
            "processing_time": result.audit.get("processing_time", "0s"),
            "result": result.dict()  # Store complete Result object
        })
        
        return result  # ✅ FIXED: Return Result object directly
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def split_lines(text: str) -> list:
    raw = re.split(r'[\r\n]+', text)
    return [line.strip() for line in raw if line.strip()]

@router.post("/verify-stream")
async def verify_content_stream(request: Request):
    body = await request.json()
    content = body.get("content", "")
    language = body.get("language", "en")
    content_type = body.get("content_type", "text")  # ✅ ADDED: content_type support

    async def event_stream():
        try:
            yield f"data: {json.dumps({'type':'message','content':'🚀 Starting analysis...'})}\n\n"
            await asyncio.sleep(1)
            
            yield f"data: {json.dumps({'type':'message','content':'🧠 Analyzing content...'})}\n\n"
            
            # ✅ FIXED: Use real analysis_engine
            result = await run_analysis(content_type, content, language)
            
            await asyncio.sleep(0.5)

            # ✅ FIXED: Extract data from Result object structure
            sections = [
                ("verdict", f"🎯 Verdict: {result.verdict.label}"),
                ("analysis", "🧠 Quick Analysis"),
                ("evidence", "🔍 Evidence Found"),
                ("checklist", "📋 Verification Checklist"),
            ]

            for key, title in sections:
                yield f"data: {json.dumps({'type':'section_start','section':key,'title':title})}\n\n"
                await asyncio.sleep(0.5)
                
                if key == "verdict":
                    yield f"data: {json.dumps({'type':'line','section':key,'content':f'Confidence: {result.verdict.confidence}%'})}\n\n"
                    yield f"data: {json.dumps({'type':'line','section':key,'content':result.verdict.summary})}\n\n"
                elif key == "analysis":
                    lines = split_lines(result.quick_analysis)
                    for line in lines:
                        yield f"data: {json.dumps({'type':'line','section':key,'content':line})}\n\n"
                        await asyncio.sleep(0.15)
                elif key == "evidence":
                    for evidence in result.evidence[:3]:  # Show top 3 evidence
                        yield f"data: {json.dumps({'type':'line','section':key,'content':f'{evidence.source}: {evidence.snippet[:100]}...'})}\n\n"
                        await asyncio.sleep(0.15)
                elif key == "checklist":
                    for item in result.checklist[:3]:  # Show top 3 checklist items
                        yield f"data: {json.dumps({'type':'line','section':key,'content':f'✓ {item.point}'})}\n\n"
                        await asyncio.sleep(0.15)
                
                yield f"data: {json.dumps({'type':'section_end','section':key})}\n\n"
                await asyncio.sleep(1)

            yield f"data: {json.dumps({'type':'complete','content':'✅ Analysis complete!'})}\n\n"
            
        except Exception as e:
            print(f"🚨 Streaming error: {e}")
            yield f"data: {json.dumps({'type':'error','content':str(e)})}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control":"no-cache",
            "Connection":"keep-alive",
            "Access-Control-Allow-Origin":"*"
        }
    )

@router.get("/results/{analysis_id}")
async def get_analysis_results(analysis_id: str):
    res = storage.get_analysis(analysis_id)
    if not res:
        raise HTTPException(status_code=404, detail="Not found")
    return res

@router.get("/archive")
async def get_archive(limit: int = 20, user_id: Optional[str] = None):
    entries = storage.get_all_analyses(limit)
    if user_id:
        entries = [e for e in entries if e.get("user_id") == user_id]
    return {"analyses": entries, "total": len(entries)}
