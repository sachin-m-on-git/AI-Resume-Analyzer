from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import gemini_ai

router = APIRouter()

class CoverLetterRequest(BaseModel):
    resume_text: str
    job_description: str = ""

class CoverLetterResponse(BaseModel):
    cover_letter: str

@router.post("/", response_model=CoverLetterResponse)
async def generate_cover_letter(req: CoverLetterRequest):
    if not req.resume_text:
        raise HTTPException(status_code=400, detail="Resume text is required.")
    
    try:
        cover_letter_text = gemini_ai.generate_cover_letter(req.resume_text, req.job_description)
        return CoverLetterResponse(cover_letter=cover_letter_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
