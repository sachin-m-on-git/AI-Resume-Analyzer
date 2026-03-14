"""
routers/summary.py
POST /generate_summary — generates a professional 2-line summary via Gemini.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from gemini_ai import generate_professional_summary

router = APIRouter()


class SummaryRequest(BaseModel):
    skills: list[str]
    projects: str = ""
    experience: str = ""


@router.post("/")
async def generate_summary(body: SummaryRequest):
    try:
        summary = generate_professional_summary(
            skills=body.skills,
            projects=body.projects,
            experience=body.experience,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"summary": summary}
