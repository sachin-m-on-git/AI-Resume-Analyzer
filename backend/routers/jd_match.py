"""
routers/jd_match.py
POST /compare_job_description — compares resume skills against a job description.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from jd_matcher import compute_match

router = APIRouter()


class JDMatchRequest(BaseModel):
    resume_skills: list[str]
    resume_text: str
    job_title: str = ""
    job_description: str


@router.post("/")
async def compare_job_description(body: JDMatchRequest):
    if not body.job_description.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")

    result = compute_match(
        resume_skills=body.resume_skills,
        jd_text=body.job_description,
        resume_text=body.resume_text,
    )

    return {
        "job_title": body.job_title,
        **result,
    }
