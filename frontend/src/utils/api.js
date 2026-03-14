/**
 * api.js
 * Centralised Axios calls to the FastAPI backend.
 * The React dev server proxies /api/* to http://localhost:8000
 * (configured via package.json "proxy" field).
 */

import axios from 'axios';

const BASE = ''; // uses CRA proxy — set to http://localhost:8000 for production

export async function uploadResume(file) {
  const form = new FormData();
  form.append('file', file);
  const { data } = await axios.post(`${BASE}/upload_resume/`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data; // { file_id, filename, parsed }
}

export async function analyzeResume(parsed) {
  const { data } = await axios.post(`${BASE}/analyze_resume/`, { parsed });
  return data; // { score, suggestions, ats, skills, keywords, sections }
}


export async function compareJD(resumeSkills, resumeText, jobTitle, jobDescription) {
  const { data } = await axios.post(`${BASE}/compare_job_description/`, {
    resume_skills: resumeSkills,
    resume_text: resumeText,
    job_title: jobTitle,
    job_description: jobDescription,
  });
  return data; // { matched_skills, missing_skills, skill_match_pct, alignment_score, ... }
}

export async function generateCoverLetter(resumeText, jobDescription) {
  const { data } = await axios.post(`${BASE}/generate_cover_letter/`, {
    resume_text: resumeText,
    job_description: jobDescription,
  });
  return data.cover_letter;
}

export async function generateInterviewQuestions(skills, experienceText) {
  const { data } = await axios.post(`${BASE}/generate_interview_questions/`, {
    skills: skills,
    experience_text: experienceText,
  });
  return data; // { technical_questions, behavioral_questions }
}

export async function generateRoadmap(skills, experienceText) {
  const { data } = await axios.post(`${BASE}/generate_roadmap/`, {
    skills: skills,
    experience_text: experienceText,
  });
  return data.roadmap; // Array of steps
}

export async function generateProjectIdeas(skills, experienceText) {
  const { data } = await axios.post(`${BASE}/generate_project_ideas/`, {
    skills: skills,
    experience_text: experienceText,
  });
  return data.projects; // Array of ideas
}

export async function generateLearningPath(missingSkill, currentSkills) {
  const { data } = await axios.post(`${BASE}/generate_learning_path/`, {
    missing_skill: missingSkill,
    current_skills: currentSkills,
  });
  return data; // { skill, steps: Array of steps }
}

