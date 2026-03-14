"""
gemini_ai.py
Thin wrapper around the Google Gemini generative AI API.
All prompts live here so they are easy to tune.
"""

import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

# Configure once from environment variable (set GEMINI_API_KEY in your shell)
_API_KEY = os.getenv("GEMINI_API_KEY", "")
genai.configure(api_key=_API_KEY)

# Change this line in your gemini_ai.py
MODEL_NAME = "gemini-3-flash-preview"


def _model() -> genai.GenerativeModel:
    return genai.GenerativeModel(MODEL_NAME)


# ── Improvement Suggestions ──────────────────────────────────────────────────

SUGGESTION_PROMPT = """\
You are an expert career coach and resume reviewer.

Carefully read the resume text below and provide SPECIFIC, ACTIONABLE improvement suggestions covering:
1. Professional summary (clarity, impact)
2. Skills section (gaps, presentation)
3. Project descriptions (depth, quantification)
4. Use of strong action verbs
5. Formatting and readability (ATS compatibility)

For each area, list 2–3 concrete suggestions. Be direct and practical.

RESUME TEXT:
{resume_text}
"""


def get_improvement_suggestions(resume_text: str) -> str:
    """Call Gemini and return structured improvement suggestions."""
    prompt = SUGGESTION_PROMPT.format(resume_text=resume_text[:6000])  # token guard
    response = _model().generate_content(prompt)
    return response.text



# ── ATS Score Feedback ────────────────────────────────────────────────────────

ATS_PROMPT = """\
You are an ATS (Applicant Tracking System) expert.

Review the resume text and provide:
1. An ATS compatibility score from 0–100.
2. The top 3 ATS formatting issues.
3. 3 keywords that are missing but commonly required.

Reply in this exact JSON format (no markdown fences):
{{"ats_score": <number>, "issues": ["...", "...", "..."], "missing_keywords": ["...", "...", "..."]}}

RESUME TEXT:
{resume_text}
"""


def get_ats_score(resume_text: str) -> dict:
    """Return ATS score + issues as a parsed dict."""
    import json
    prompt = ATS_PROMPT.format(resume_text=resume_text[:4000])
    response = _model().generate_content(prompt)
    try:
        return json.loads(response.text.strip())
    except json.JSONDecodeError:
        # Fallback if Gemini doesn't obey the JSON instruction
        return {
            "ats_score": None,
            "issues": [],
            "missing_keywords": [],
            "raw": response.text,
        }

# ── Cover Letter Generator ──────────────────────────────────────────────────

COVER_LETTER_PROMPT = """\
You are an expert career counselor and professional resume writer.

Generate a highly professional, tailored cover letter based on the provided resume text.
If a job description is provided, heavily tailor the cover letter to highlight why the candidate is a perfect fit for that specific role.
If no job description is provided, write a strong, versatile general cover letter highlighting the candidate's top achievements.

The cover letter should have:
1. A strong opening statement.
2. 1-2 body paragraphs highlighting quantifiable achievements and relevant skills.
3. A confident closing statement and call to action.

Do not include placeholder brackets like [Your Name] unless absolutely necessary; try to extract the user's name from the resume if possible.

RESUME TEXT:
{resume_text}

JOB DESCRIPTION (Optional):
{job_description}
"""

def generate_cover_letter(resume_text: str, job_description: str = "") -> str:
    """Return a generated cover letter."""
    prompt = COVER_LETTER_PROMPT.format(
        resume_text=resume_text[:6000],
        job_description=job_description[:3000] if job_description else "None provided."
    )
    response = _model().generate_content(prompt)
    return response.text.strip()


# ── Interview Questions Generator ───────────────────────────────────────────

INTERVIEW_PREP_PROMPT = """\
You are an expert technical recruiter and hiring manager.

Based on the candidate's skills and experience provided below, generate a targeted list of interview questions to help them prepare.

Provide exactly:
1. 3 Technical Questions challenging their specific stated skills.
2. 2 Behavioral Questions based on their experience level.

For each question, provide a brief "context" on what the interviewer is looking for in the answer.

Reply in this exact JSON format (no markdown fences):
{{
  "technical_questions": [
    {{"question": "...", "context": "..."}},
    ...
  ],
  "behavioral_questions": [
    {{"question": "...", "context": "..."}},
    ...
  ]
}}

SKILLS: {skills}
EXPERIENCE TEXT: {experience}
"""

def generate_interview_questions(skills: list[str], experience_text: str) -> dict:
    """Return generated interview questions as structured JSON."""
    import json
    prompt = INTERVIEW_PREP_PROMPT.format(
        skills=", ".join(skills) if skills else "None specified",
        experience=experience_text[:4000] if experience_text else "None specified"
    )
    response = _model().generate_content(prompt)
    try:
        return json.loads(response.text.strip())
    except json.JSONDecodeError:
        # Fallback if Gemini fails JSON
        return {
            "technical_questions": [{"question": "Failed to parse questions", "context": response.text[:200]}],
            "behavioral_questions": []
        }

# ── Career Progression Roadmap ───────────────────────────────────────────────

ROADMAP_PROMPT = """\
You are an expert career strategist and executive coach.

Analyze the candidate's current skills and experience. Project their next 3 logical career steps/titles (e.g., from Junior Developer -> Mid-level Developer -> Senior Developer -> Engineering Manager).

For each of the 3 steps, provide:
1. The target job title.
2. Estimated timeline to achieve it (e.g., "1-2 years").
3. A brief description of the responsibilities.
4. 3 specific new skills they need to acquire to reach this level.

Reply in this exact JSON format (no markdown fences):
{{
  "roadmap": [
    {{
      "title": "...",
      "timeline": "...",
      "description": "...",
      "skills_to_acquire": ["...", "...", "..."]
    }},
    ... (total 3 items)
  ]
}}

SKILLS: {skills}
EXPERIENCE TEXT: {experience}
"""

def generate_career_roadmap(skills: list[str], experience_text: str) -> dict:
    """Return an array of roadmap steps as structured JSON."""
    import json
    prompt = ROADMAP_PROMPT.format(
        skills=", ".join(skills) if skills else "None specified",
        experience=experience_text[:4000] if experience_text else "None specified"
    )
    response = _model().generate_content(prompt)
    try:
        return json.loads(response.text.strip())
    except json.JSONDecodeError:
        return {"roadmap": []}


# ── Project Idea Generator ──────────────────────────────────────────────────

PROJECTS_PROMPT = """\
You are an expert technical lead and portfolio reviewer.

Based on the candidate's skills and experience, suggest 3 highly actionable, impressive side-projects they could build to elevate their portfolio and fill potential skill gaps. Do NOT suggest generic projects like checking an API or a simple to-do app. They should be advanced, portfolio-worthy projects.

For each project, provide:
1. A catchy project title.
2. A brief description (what it does and the problem it solves).
3. The recommended tech stack (a list of 3-5 specific technologies).
4. The exact reason why this project is recommended for this specific candidate (e.g., "Demonstrates system design" or "Fills your gap in Cloud deployment").

Reply in this exact JSON format (no markdown fences):
{{
  "projects": [
    {{
      "title": "...",
      "description": "...",
      "tech_stack": ["...", "...", "..."],
      "reason": "..."
    }},
    ... (total 3 items)
  ]
}}

SKILLS: {skills}
EXPERIENCE TEXT: {experience}
"""

def generate_project_ideas(skills: list[str], experience_text: str) -> dict:
    """Return an array of project ideas as structured JSON."""
    import json
    prompt = PROJECTS_PROMPT.format(
        skills=", ".join(skills) if skills else "None specified",
        experience=experience_text[:4000] if experience_text else "None specified"
    )
    response = _model().generate_content(prompt)
    try:
        return json.loads(response.text.strip())
    except json.JSONDecodeError:
        return {"projects": []}

# ── Skill Learning Path Generator ───────────────────────────────────────────

LEARNING_PATH_PROMPT = """\
You are an expert technical instructor and career mentor.

The user is missing a specific skill or keyword from their resume: "{missing_skill}".
Given their current skills: {current_skills}, create a highly actionable, step-by-step learning path to acquire this missing skill.

Provide exactly 3 logical steps (e.g., Fundamentals -> Practical Application -> Advanced Concepts).
For each step, include:
1. A step title.
2. A brief, practical description of what they need to learn and do.
3. 2-3 specific, highly-rated resources (e.g., specific documentations, notable courses, or concepts to Google).

Reply in this exact JSON format (no markdown fences):
{{
  "skill": "{missing_skill}",
  "steps": [
    {{
      "title": "...",
      "description": "...",
      "resources": ["...", "...", "..."]
    }},
    ... (total 3 items)
  ]
}}
"""

def generate_learning_path(missing_skill: str, current_skills: list[str]) -> dict:
    """Return an array of learning steps as structured JSON."""
    import json
    prompt = LEARNING_PATH_PROMPT.format(
        missing_skill=missing_skill,
        current_skills=", ".join(current_skills) if current_skills else "None specified"
    )
    response = _model().generate_content(prompt)
    try:
        return json.loads(response.text.strip())
    except json.JSONDecodeError:
        return {"skill": missing_skill, "steps": []}



