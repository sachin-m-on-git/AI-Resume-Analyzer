from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import gemini_ai

router = APIRouter()

class LearningPathRequest(BaseModel):
    missing_skill: str
    current_skills: List[str] = []

class LearningStep(BaseModel):
    title: str
    description: str
    resources: List[str]

class LearningPathResponse(BaseModel):
    skill: str
    steps: List[LearningStep]

@router.post("/", response_model=LearningPathResponse)
async def generate_learning_path(req: LearningPathRequest):
    if not req.missing_skill:
        raise HTTPException(status_code=400, detail="A missing skill is required to generate a learning path.")
    
    try:
        path_data = gemini_ai.generate_learning_path(req.missing_skill, req.current_skills)
        return LearningPathResponse(**path_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
