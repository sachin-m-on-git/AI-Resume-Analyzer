from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import gemini_ai
import json

router = APIRouter()

class InterviewPrepRequest(BaseModel):
    skills: List[str]
    experience_text: str = ""

class InterviewQuestion(BaseModel):
    question: str
    context: str

class InterviewPrepResponse(BaseModel):
    technical_questions: List[InterviewQuestion]
    behavioral_questions: List[InterviewQuestion]

@router.post("/", response_model=InterviewPrepResponse)
async def generate_interview_questions(req: InterviewPrepRequest):
    if not req.skills and not req.experience_text:
        raise HTTPException(status_code=400, detail="Skills or experience text required.")
    
    try:
        questions_data = gemini_ai.generate_interview_questions(req.skills, req.experience_text)
        return InterviewPrepResponse(**questions_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
