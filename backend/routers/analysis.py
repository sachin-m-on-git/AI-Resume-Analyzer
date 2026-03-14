"""
routers/analysis.py
POST /analyze_resume — scores a parsed resume and fetches Gemini suggestions.
Expects JSON body: { "parsed": <parsed resume dict> }
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from analyzer import compute_score
from gemini_ai import get_improvement_suggestions, get_ats_score

router = APIRouter()


class AnalyzeRequest(BaseModel):
    parsed: dict  # The full parsed dict returned by upload_resume


@router.post("/")
async def analyze_resume(body: AnalyzeRequest):
    parsed = body.parsed

    if not parsed.get("raw_text"):
        raise HTTPException(status_code=400, detail="No text extracted from resume.")

    # 1. Compute numerical score
    score_result = compute_score(parsed)

    # 2. Gemini improvement suggestions
    try:
        suggestions = get_improvement_suggestions(parsed["raw_text"])
    except Exception as e:
        suggestions = f"Could not generate suggestions: {e}"

    # 3. ATS compatibility score
    try:
        ats = get_ats_score(parsed["raw_text"])
    except Exception as e:
        ats = {"ats_score": None, "issues": [], "missing_keywords": []}

    return {
        "score":       score_result,
        "suggestions": suggestions,
        "ats":         ats,
        "skills":      parsed.get("skills", []),
        "keywords":    parsed.get("keywords", []),
        "sections":    {k: bool(v) for k, v in parsed.get("sections", {}).items()},
    }
