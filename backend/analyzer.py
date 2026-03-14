"""
analyzer.py
Scores a parsed resume out of 10 across five dimensions.
Each dimension is worth 2 points → max = 10.
"""

import re

# Verbs that signal strong, result-oriented bullets
ACTION_VERBS = {
    "developed", "designed", "built", "created", "implemented", "led",
    "managed", "architected", "optimised", "optimized", "launched", "delivered",
    "improved", "reduced", "increased", "automated", "integrated", "deployed",
    "collaborated", "coordinated", "mentored", "trained", "presented",
    "researched", "analysed", "analyzed", "engineered", "spearheaded",
    "established", "streamlined", "migrated", "refactored", "tested",
}

# Keywords that ATS systems look for
ATS_KEYWORDS = {
    "agile", "scrum", "kanban", "ci/cd", "devops", "microservices", "api",
    "rest", "sql", "nosql", "cloud", "scalable", "performance", "testing",
    "unit test", "integration", "full stack", "backend", "frontend",
    "machine learning", "data analysis", "leadership", "communication",
}


def _clamp(value: float, lo: float = 0.0, hi: float = 2.0) -> float:
    return max(lo, min(hi, value))


def score_skills(skills: list[str]) -> float:
    """2 pts: scaled by number of recognised skills (max = 15+)."""
    n = len(skills)
    if n >= 15:
        return 2.0
    if n >= 10:
        return 1.7
    if n >= 6:
        return 1.3
    if n >= 3:
        return 1.0
    return 0.5


def score_projects(sections: dict) -> float:
    """2 pts: presence + richness of projects section."""
    proj = sections.get("projects", "")
    if not proj.strip():
        return 0.0
    words = len(proj.split())
    score = 1.0
    if words >= 100:
        score += 0.5
    if words >= 200:
        score += 0.5
    return _clamp(score)


def score_experience(sections: dict) -> float:
    """2 pts: length and depth of experience section."""
    exp = sections.get("experience", "")
    if not exp.strip():
        return 0.0
    words = len(exp.split())
    score = 1.0
    if words >= 150:
        score += 0.5
    if words >= 300:
        score += 0.5
    return _clamp(score)


def score_keywords(text: str) -> float:
    """2 pts: ATS keyword coverage."""
    lower = text.lower()
    matched = sum(1 for kw in ATS_KEYWORDS if kw in lower)
    ratio = matched / len(ATS_KEYWORDS)
    return _clamp(ratio * 2)


def score_format(parsed: dict) -> float:
    """
    2 pts: section completeness + action verb usage.
    0.4 per key section present + bonus for action verbs.
    """
    key_sections = ["experience", "education", "skills", "projects", "summary"]
    section_score = sum(
        0.3 for s in key_sections if parsed.get(f"has_{s}", False)
    )

    raw_text = parsed.get("raw_text", "").lower()
    words = set(re.findall(r"[a-z]+", raw_text))
    verb_hits = len(ACTION_VERBS & words)
    verb_score = min(0.5, verb_hits * 0.05)

    return _clamp(section_score + verb_score)


def compute_score(parsed: dict) -> dict:
    """
    Entry point.  Returns individual dimension scores + final /10 score.
    """
    skills_score     = score_skills(parsed.get("skills", []))
    projects_score   = score_projects(parsed.get("sections", {}))
    experience_score = score_experience(parsed.get("sections", {}))
    keyword_score    = score_keywords(parsed.get("raw_text", ""))
    format_score     = score_format(parsed)

    total = skills_score + projects_score + experience_score + keyword_score + format_score
    final = round(total, 1)

    return {
        "final_score":      final,
        "max_score":        10,
        "breakdown": {
            "skills":      round(skills_score, 2),
            "projects":    round(projects_score, 2),
            "experience":  round(experience_score, 2),
            "keywords":    round(keyword_score, 2),
            "format":      round(format_score, 2),
        },
        "grade": _grade(final),
        "target_score": 8.0,
    }


def _grade(score: float) -> str:
    if score >= 9:  return "Excellent ⭐"
    if score >= 8:  return "Very Good ✅"
    if score >= 6:  return "Good 👍"
    if score >= 4:  return "Needs Work ⚠️"
    return "Poor — Major Revision Needed ❌"
