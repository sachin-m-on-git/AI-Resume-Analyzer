"""
resume_parser.py
Extracts raw text from PDF and parses it into structured sections
using regex heuristics + a predefined technical-skill list.
"""

import re
import pdfplumber
from pathlib import Path


# ── Predefined skill vocabulary ─────────────────────────────────────────────
TECHNICAL_SKILLS = {
    # Languages
    "python", "java", "javascript", "typescript", "c++", "c#", "go", "rust",
    "kotlin", "swift", "ruby", "php", "scala", "r", "matlab", "sql",
    # Web
    "react", "next.js", "vue", "angular", "html", "css", "tailwind",
    "bootstrap", "node.js", "express", "django", "fastapi", "flask",
    "graphql", "rest", "soap",
    # Data / ML / AI
    "machine learning", "deep learning", "nlp", "computer vision",
    "tensorflow", "pytorch", "keras", "scikit-learn", "pandas", "numpy",
    "matplotlib", "seaborn", "hugging face", "langchain", "openai",
    # Cloud / DevOps
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ansible",
    "ci/cd", "github actions", "jenkins", "linux", "bash",
    # Databases
    "mysql", "postgresql", "mongodb", "redis", "sqlite", "elasticsearch",
    "firebase", "supabase",
    # Tools
    "git", "github", "jira", "figma", "postman", "vscode",
}

# Section header patterns (case-insensitive)
SECTION_PATTERNS = {
    "experience":  r"(work experience|professional experience|employment|experience)",
    "education":   r"(education|academic background|qualifications)",
    "skills":      r"(skills|technical skills|core competencies|technologies)",
    "projects":    r"(projects|personal projects|academic projects|portfolio)",
    "summary":     r"(summary|objective|profile|about me|professional summary)",
    "certifications": r"(certifications?|licenses?|credentials?)",
    "awards":      r"(awards?|honours?|achievements?|accomplishments?)",
}


def extract_text_from_pdf(file_path: str) -> str:
    """Return the full raw text from every page of a PDF."""
    text_pages = []
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_pages.append(page_text)
    return "\n".join(text_pages)


def detect_sections(text: str) -> dict[str, str]:
    """
    Split raw text into named sections by scanning for header keywords.
    Returns a dict  { section_name -> section_text }.
    """
    lines = text.split("\n")
    sections: dict[str, list[str]] = {"header": []}
    current_section = "header"

    for line in lines:
        stripped = line.strip()
        matched_section = None

        for section_name, pattern in SECTION_PATTERNS.items():
            if re.search(pattern, stripped, re.IGNORECASE) and len(stripped) < 60:
                matched_section = section_name
                break

        if matched_section:
            current_section = matched_section
            sections.setdefault(current_section, [])
        else:
            sections.setdefault(current_section, []).append(line)

    return {k: "\n".join(v).strip() for k, v in sections.items()}


def extract_skills(text: str) -> list[str]:
    """Find known technical skills present in the resume text."""
    lower_text = text.lower()
    found = [skill for skill in TECHNICAL_SKILLS if skill in lower_text]
    return sorted(set(found))


def extract_emails(text: str) -> list[str]:
    return re.findall(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}", text)


def extract_phone(text: str) -> str | None:
    match = re.search(r"(\+?\d[\d\s\-().]{7,}\d)", text)
    return match.group(1).strip() if match else None


def extract_keywords(text: str, top_n: int = 20) -> list[str]:
    """Simple keyword extraction: most frequent non-stop-words (≥4 chars)."""
    STOP = {
        "this", "that", "with", "from", "have", "been", "were", "they",
        "their", "also", "will", "into", "than", "more", "over", "some",
        "such", "when", "which", "your", "about", "using", "based", "team",
        "work", "able", "good", "make", "used", "each", "year", "month",
    }
    words = re.findall(r"[a-zA-Z]{4,}", text.lower())
    freq: dict[str, int] = {}
    for w in words:
        if w not in STOP:
            freq[w] = freq.get(w, 0) + 1
    sorted_words = sorted(freq, key=freq.get, reverse=True)  # type: ignore
    return sorted_words[:top_n]


def parse_resume(file_path: str) -> dict:
    """Full pipeline: PDF → text → structured data."""
    raw_text = extract_text_from_pdf(file_path)
    sections = detect_sections(raw_text)
    skills = extract_skills(raw_text)
    emails = extract_emails(raw_text)
    phone = extract_phone(raw_text)
    keywords = extract_keywords(raw_text)

    return {
        "raw_text": raw_text,
        "sections": sections,
        "skills": skills,
        "contact": {"emails": emails, "phone": phone},
        "keywords": keywords,
        "has_experience":      bool(sections.get("experience", "").strip()),
        "has_education":       bool(sections.get("education", "").strip()),
        "has_projects":        bool(sections.get("projects", "").strip()),
        "has_summary":         bool(sections.get("summary", "").strip()),
        "has_certifications":  bool(sections.get("certifications", "").strip()),
    }
