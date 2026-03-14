"""
routers/resume.py
POST /upload_resume — accepts a PDF, saves it temporarily, parses it, and returns structured data.
"""

import os, uuid, shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from resume_parser import parse_resume

router = APIRouter()
UPLOAD_DIR = "/tmp/resume_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/")
async def upload_resume(file: UploadFile = File(...)):
    # Validate file type
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    # Save to temp location
    file_id = str(uuid.uuid4())
    dest = os.path.join(UPLOAD_DIR, f"{file_id}.pdf")
    with open(dest, "wb") as out:
        shutil.copyfileobj(file.file, out)

    # Parse the resume
    try:
        parsed = parse_resume(dest)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF parsing failed: {e}")

    return {
        "file_id":   file_id,
        "filename":  file.filename,
        "parsed":    parsed,
    }
