"""
main.py — FastAPI entry point for AI Resume Analyzer
Registers all routes and sets up CORS for local dev.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import resume, analysis, jd_match, cover_letter, interview, roadmap, projects, learning_path

app = FastAPI(
    title="AI Resume Analyzer API",
    description="Analyze resumes with NLP + Gemini AI",
    version="1.0.0",
)

# Allow requests from the React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(resume.router,   prefix="/upload_resume",        tags=["Upload"])
app.include_router(analysis.router, prefix="/analyze_resume",       tags=["Analysis"])
app.include_router(jd_match.router, prefix="/compare_job_description", tags=["JD Match"])
app.include_router(cover_letter.router, prefix="/generate_cover_letter", tags=["Cover Letter"])
app.include_router(interview.router, prefix="/generate_interview_questions", tags=["Interview Prep"])
app.include_router(roadmap.router, prefix="/generate_roadmap", tags=["Career Roadmap"])
app.include_router(projects.router, prefix="/generate_project_ideas", tags=["Project Ideas"])
app.include_router(learning_path.router, prefix="/generate_learning_path", tags=["Learning Path"])


@app.get("/")
def root():
    return {"message": "AI Resume Analyzer API is running 🚀"}
