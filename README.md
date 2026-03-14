# AI Resume Analyzer 🚀

An end-to-end AI-powered resume analysis web application with a premium, glassmorphic dark-theme UI.  
Upload a PDF resume to instantly get a score, extracted skills, Gemini AI suggestions, skill-gap analysis, and actionable career guidance tools including generated cover letters, targeted interview questions, career roadmaps, and side-project ideas.

---

## 🌟 Key Features

The platform goes beyond simple parsing to offer a suite of unique, generative AI tools designed to elevate your career trajectory:

- **AI Resume Scoring & Analysis** — Get a 0–10 score with a visual radar chart, along with actionable, Gemini-powered improvement tips across 5 dimensions.
- **Job Description (JD) Match** — Compare your resume against any job description to instantly identify matched and missing skills.
- **Cover Letter Generator** — Automatically draft a highly tailored, professional cover letter based on your resume and a target job description.
- **Interview Prep Generator** — Receive custom technical and behavioral interview questions specifically designed to challenge the skills listed on your resume.
- **Career Progression Roadmap** — Analyzes your current trajectory to project your next 3 logical career roles, estimating timelines and required skills.
- **Project Idea Generator (Portfolio Analyzer)** — Based on your skill gaps, suggests 3 highly actionable, impressive side-projects (with recommended tech stacks) to build your portfolio.
- **Skill Learning Path** — Pick a missing skill and get a 3-step actionable learning plan with highly-rated resource recommendations.
- **Premium Glassmorphic UI** — A stunning, responsive dark mode interface with smooth micro-animations and vibrant gradient accents.

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| **Frontend**   | React 18, Recharts, react-dropzone, CSS Modules (Custom Design System) |
| **Backend**    | Python 3.11+, FastAPI, Uvicorn      |
| **AI Engine**  | Google Gemini 1.5 Flash             |
| **PDF Parsing**| pdfplumber                          |
| **ML Parsing** | scikit-learn (TF-IDF cosine sim)    |

---

## 📁 Project Structure

```text
resume-analyzer/
├── backend/
│   ├── main.py              # FastAPI app routing & CORS
│   ├── resume_parser.py     # PDF text extraction & NLP parsing
│   ├── analyzer.py          # Resume scoring logic
│   ├── gemini_ai.py         # Gemini API wrapper & Prompt Engineering
│   ├── jd_matcher.py        # Job description comparison
│   ├── requirements.txt
│   └── routers/
│       ├── resume.py        # POST /upload_resume
│       ├── analysis.py      # POST /analyze_resume
│       ├── jd_match.py      # POST /compare_job_description
│       ├── cover_letter.py  # POST /generate_cover_letter
│       ├── interview.py     # POST /generate_interview_questions
│       ├── roadmap.py       # POST /generate_roadmap
│       ├── projects.py      # POST /generate_project_ideas
│       └── learning_path.py # POST /generate_learning_path
│
└── frontend/
    ├── package.json
    └── src/
        ├── App.js           # Root dashboard & state management
        ├── index.css        # Premium Glassmorphic Design System
        ├── utils/api.js     # Axios API wrappers
        └── components/      # React UI Components (UploadCard, ScoreCard, RoadmapCard, etc.)
```

---

## 🚀 Quick Start

### 1. Get a Gemini API Key

1. Go to Google AI Studio: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Create a new key and copy it.

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set your Gemini API key
export GEMINI_API_KEY="your_key_here"   # Windows: set GEMINI_API_KEY=your_key_here

# Start the server
uvicorn main:app --reload --port 8000
```
Backend runs at: **http://localhost:8000**  
Interactive API docs: **http://localhost:8000/docs**

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm start
```
Frontend runs at: **http://localhost:3000**

> Note: The React dev server proxies API requests to the FastAPI backend automatically (configured via the `"proxy"` field in frontend/package.json).

---

## 🔌 API Endpoints Reference

| Method | Endpoint                    | Description                         |
|--------|-----------------------------|-------------------------------------|
| POST   | `/upload_resume/`           | Upload PDF → returns parsed data    |
| POST   | `/analyze_resume/`          | Score resume + Gemini suggestions   |
| POST   | `/compare_job_description/` | JD match + skill gap analysis       |
| POST   | `/generate_cover_letter/`   | Generates tailored cover letter     |
| POST   | `/generate_interview.../`   | Generates technical/behavioral Qs   |
| POST   | `/generate_roadmap/`        | Projects next 3 career roles        |
| POST   | `/generate_project_ideas/`  | Suggests portfolio side-projects    |
| POST   | `/generate_learning_path/`  | 3-step guide to learn missing skills|

---

## ⚠️ Troubleshooting

- **Backend won't start?** Make sure Python 3.11+ is installed and the venv is activated.
- **Gemini returns errors/Empty analysis?** Double-check that `GEMINI_API_KEY` is correctly set in your shell environment where `uvicorn` is running.
- **CORS errors in browser?** Ensure the backend is running on port 8000 and the frontend on port 3000.
- **PDF parsing fails?** Ensure the PDF is not password-protected and is text-based (not a scanned image).

---

## 📄 License

MIT
