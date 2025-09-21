from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Union, Any
from datetime import datetime
import uuid

# 🔹 Evidence shown in Evidence Grid
class Evidence(BaseModel):
    source: str
    snippet: str
    reliability: float = Field(..., ge=0, le=1, description="0–1 reliability score")
    url: Optional[str] = None  # ✅ FIXED: Added missing url field

# 🔹 Educational checklist (after evidence grid)
class EducationalChecklistItem(BaseModel):
    point: str
    explanation: str

# 🔹 Flexible Intelligence report (expands if user clicks "View Full Report")
class IntelligenceReport(BaseModel):
    political: Optional[str] = None
    financial: Optional[str] = None
    psychological: Optional[str] = None
    scientific: Optional[str] = None
    philosophical: Optional[str] = None
    geopolitical: Optional[str] = None
    technical: Optional[str] = None

# 🔹 Verdict with breakdown
class Verdict(BaseModel):
    label: str = Field(..., description="✅ Verified, ❌ False, ⚠️ Caution")
    confidence: int = Field(..., ge=0, le=100, description="Confidence percentage")
    summary: str = Field(..., description="One-line summary")
    breakdown: Optional[Dict[str, int]] = Field(
        default_factory=dict,
        description="Breakdown: fact_checks, credibility, consensus, etc."
    )

# 🔹 Main Analysis Result (returned to frontend)
class Result(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    input: str
    domain: str
    verdict: Verdict
    quick_analysis: str
    evidence: List[Evidence]
    checklist: List[EducationalChecklistItem]
    intelligence: IntelligenceReport
    audit: Dict[str, Any] = Field(
        default_factory=lambda: {
            "analysis_time": datetime.utcnow().isoformat(),
            "analyst": "CrediScope AI"
        }
    )
