from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import gemini_ai

router = APIRouter()

class ProjectIdeasRequest(BaseModel):
    skills: List[str]
    experience_text: str = ""

class ProjectIdea(BaseModel):
    title: str
    description: str
    tech_stack: List[str]
    reason: str

class ProjectIdeasResponse(BaseModel):
    projects: List[ProjectIdea]

@router.post("/", response_model=ProjectIdeasResponse)
async def generate_project_ideas(req: ProjectIdeasRequest):
    if not req.skills and not req.experience_text:
        raise HTTPException(status_code=400, detail="Skills or experience text required.")
    
    try:
        ideas_data = gemini_ai.generate_project_ideas(req.skills, req.experience_text)
        return ProjectIdeasResponse(**ideas_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
