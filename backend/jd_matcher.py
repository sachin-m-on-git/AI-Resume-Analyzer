"""
jd_matcher.py
Compares the skills in a resume against those in a job description.
Uses scikit-learn TF-IDF cosine similarity for overall alignment score.
"""

import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from resume_parser import TECHNICAL_SKILLS


def extract_jd_skills(jd_text: str) -> set[str]:
    """Find technical skills mentioned in the job description."""
    lower = jd_text.lower()
    return {skill for skill in TECHNICAL_SKILLS if skill in lower}


def compute_match(resume_skills: list[str], jd_text: str, resume_text: str) -> dict:
    """
    Compare resume skills vs job description.
    Returns matched skills, missing skills, and a percentage score.
    """
    resume_skill_set = set(s.lower() for s in resume_skills)
    jd_skills = extract_jd_skills(jd_text)

    matched = resume_skill_set & jd_skills
    missing = jd_skills - resume_skill_set

    # Percentage match based on required JD skills
    if jd_skills:
        skill_match_pct = round(len(matched) / len(jd_skills) * 100, 1)
    else:
        skill_match_pct = 0.0

    # Semantic similarity using TF-IDF cosine
    semantic_score = _semantic_similarity(resume_text, jd_text)

    # Weighted alignment score (70 % skill match, 30 % semantic)
    alignment_score = round(skill_match_pct * 0.7 + semantic_score * 30, 1)

    return {
        "matched_skills":    sorted(matched),
        "missing_skills":    sorted(missing),
        "required_skills":   sorted(jd_skills),
        "skill_match_pct":   skill_match_pct,
        "semantic_score":    round(semantic_score * 100, 1),
        "alignment_score":   min(alignment_score, 100.0),
    }


def _semantic_similarity(text_a: str, text_b: str) -> float:
    """Return cosine similarity [0-1] between two text blobs via TF-IDF."""
    # Guard: need at least 5 words per doc
    if len(text_a.split()) < 5 or len(text_b.split()) < 5:
        return 0.0
    try:
        vec = TfidfVectorizer(stop_words="english", max_features=500)
        tfidf_matrix = vec.fit_transform([text_a, text_b])
        score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return float(score)
    except Exception:
        return 0.0
