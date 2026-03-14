from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import gemini_ai

router = APIRouter()

class RoadmapRequest(BaseModel):
    skills: List[str]
    experience_text: str = ""

class RoadmapStep(BaseModel):
    title: str
    timeline: str
    description: str
    skills_to_acquire: List[str]

class RoadmapResponse(BaseModel):
    roadmap: List[RoadmapStep]

@router.post("/", response_model=RoadmapResponse)
async def generate_career_roadmap(req: RoadmapRequest):
    if not req.skills and not req.experience_text:
        raise HTTPException(status_code=400, detail="Skills or experience text required.")
    
    try:
        roadmap_data = gemini_ai.generate_career_roadmap(req.skills, req.experience_text)
        return RoadmapResponse(**roadmap_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
