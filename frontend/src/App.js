/**
 * App.js
 * Root component — orchestrates the full resume analysis workflow.
 *
 * State flow:
 *  file selected → upload → parse → analyse → render dashboard
 *
 * Re-evaluation: user uploads a second PDF; previous score is preserved
 * so the ReEvalCard can show improvement.
 */

import React, { useState, useCallback } from 'react';
import { Loader, Zap, RefreshCw } from 'lucide-react';

import UploadCard     from './components/UploadCard';
import ScoreCard      from './components/ScoreCard';
import SkillsCard     from './components/SkillsCard';
import SuggestionsPanel from './components/SuggestionsPanel';
import JDMatchCard    from './components/JDMatchCard';
import ReEvalCard     from './components/ReEvalCard';
import SectionsCard   from './components/SectionsCard';
import CoverLetterCard from './components/CoverLetterCard';
import InterviewPrepCard from './components/InterviewPrepCard';
import RoadmapCard    from './components/RoadmapCard';
import ProjectIdeasCard from './components/ProjectIdeasCard';
import LearningPathCard from './components/LearningPathCard';

import { uploadResume, analyzeResume } from './utils/api';

// ── Status states ─────────────────────────────────────────────────────────────
const STATUS = {
  IDLE:      'idle',
  UPLOADING: 'uploading',
  ANALYSING: 'analysing',
  DONE:      'done',
  ERROR:     'error',
};

export default function App() {
  const [file, setFile]           = useState(null);
  const [status, setStatus]       = useState(STATUS.IDLE);
  const [errorMsg, setErrorMsg]   = useState('');

  // Analysis results
  const [parsed, setParsed]       = useState(null);
  const [analysis, setAnalysis]   = useState(null);

  // Cross-component state
  const [missingJDSkills, setMissingJDSkills] = useState([]);

  // Re-evaluation: keep previous score
  const [prevScore, setPrevScore] = useState(null);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleFileSelected = useCallback((selectedFile) => {
    setFile(selectedFile);
    setStatus(STATUS.IDLE);
    setErrorMsg('');
  }, []);

  const handleClear = useCallback(() => {
    setFile(null);
    setStatus(STATUS.IDLE);
    setErrorMsg('');
    // Keep analysis visible for reference
  }, []);

  const handleReset = () => {
    setFile(null);
    setParsed(null);
    setAnalysis(null);
    setPrevScore(null);
    setMissingJDSkills([]);
    setStatus(STATUS.IDLE);
    setErrorMsg('');
  };

  const handleAnalyse = async () => {
    if (!file) return;

    // Save current score before re-analysis
    if (analysis?.score?.final_score != null) {
      setPrevScore(analysis.score.final_score);
    }

    setStatus(STATUS.UPLOADING);
    setErrorMsg('');

    try {
      // 1. Upload + parse PDF
      const uploadResult = await uploadResume(file);
      setParsed(uploadResult.parsed);
      setStatus(STATUS.ANALYSING);

      // 2. Score + Gemini suggestions
      const analysisResult = await analyzeResume(uploadResult.parsed);
      setAnalysis(analysisResult);
      setStatus(STATUS.DONE);
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err?.response?.data?.detail ||
        'Analysis failed. Make sure the backend is running on http://localhost:8000'
      );
      setStatus(STATUS.ERROR);
    }
  };

  // ── Derived state ────────────────────────────────────────────────────────────
  const isLoading  = status === STATUS.UPLOADING || status === STATUS.ANALYSING;
  const isDone     = status === STATUS.DONE;
  const showReEval = isDone && prevScore != null && prevScore !== analysis?.score?.final_score;

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', padding: '0 0 4rem' }}>

      {/* ── Nav bar ── */}
      <header style={{
        borderBottom: '1px solid var(--border)',
        padding: '1rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(11,13,17,0.85)', backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #4f8ef7, #7c5cfc)',
            borderRadius: '10px', padding: '6px 10px',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem',
            color: '#fff', letterSpacing: '-0.02em',
          }}>
            AI
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>
            Resume Analyzer
          </span>
        </div>

        {isDone && (
          <button className="btn-secondary" onClick={handleReset} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
            <RefreshCw size={14} /> Start Over
          </button>
        )}
      </header>

      {/* ── Hero (shown before analysis) ── */}
      {!isDone && (
        <div style={{ textAlign: 'center', padding: '3.5rem 1rem 2rem' }}>
          <div style={{
            display: 'inline-block', background: 'rgba(79,142,247,0.1)',
            border: '1px solid rgba(79,142,247,0.2)',
            borderRadius: '99px', padding: '4px 14px',
            fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent)',
            textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem',
          }}>
            Powered by Google Gemini
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            lineHeight: 1.15, marginBottom: '1rem',
            background: 'linear-gradient(135deg, #e8ecf4 30%, #6b7a99)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Analyse & Elevate<br />Your Resume
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7, fontSize: '0.95rem' }}>
            Upload your PDF resume. Get an AI-powered score, actionable suggestions,
            a professional summary, and a job-description match report — in seconds.
          </p>
        </div>
      )}

      {/* ── Main content ── */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 10 }}>

        {/* Upload + action row */}
        {!isDone && (
          <div style={{ maxWidth: '520px', margin: '0 auto' }}>
            <UploadCard
              file={file}
              onFileSelected={handleFileSelected}
              onClear={handleClear}
              uploading={isLoading}
            />

            {file && !isLoading && (
              <button
                className="btn-primary"
                onClick={handleAnalyse}
                style={{ width: '100%', marginTop: '1rem', padding: '0.85rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Zap size={18} /> Analyse Resume
              </button>
            )}

            {isLoading && (
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: 'var(--accent)' }}>
                  <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
                  <span style={{ fontWeight: 600 }}>
                    {status === STATUS.UPLOADING ? 'Uploading & parsing PDF…' : 'Running AI analysis…'}
                  </span>
                </div>
              </div>
            )}

            {status === STATUS.ERROR && (
              <div style={{ marginTop: '1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '1rem', color: 'var(--danger)', fontSize: '0.87rem' }}>
                ⚠️ {errorMsg}
              </div>
            )}
          </div>
        )}

        {/* ── Dashboard (shown after analysis) ── */}
        {isDone && analysis && parsed && (
          <>
            {/* Top row: re-upload for re-evaluation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem' }}>
                Analysis Dashboard
              </h2>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {/* Re-upload (re-evaluation) */}
                <label style={{ cursor: 'pointer' }}>
                  <input
                    type="file" accept=".pdf" style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        handleFileSelected(e.target.files[0]);
                        // Immediately trigger analysis
                        setTimeout(() => handleAnalyse(), 100);
                      }
                    }}
                  />
                  <span className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
                    <RefreshCw size={14} /> Re-evaluate
                  </span>
                </label>
              </div>
            </div>

            {/* Re-eval card */}
            {showReEval && (
              <div style={{ marginBottom: '1.5rem' }}>
                <ReEvalCard previousScore={prevScore} currentScore={analysis.score.final_score} />
              </div>
            )}

            {/* Grid layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
              <ScoreCard    scoreData={analysis.score} />
              <SkillsCard   skills={analysis.skills} keywords={analysis.keywords} />
              <SectionsCard parsed={parsed} />
            </div>

            {/* Full-width suggestions */}
            <div style={{ marginTop: '1.25rem' }}>
              <SuggestionsPanel suggestions={analysis.suggestions} ats={analysis.ats} />
            </div>

            {/* JD match and Cover Letter (2 columns layout) */}
            <div style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.25rem' }}>
              <JDMatchCard resumeSkills={analysis.skills} resumeText={parsed.raw_text} onMissingSkills={setMissingJDSkills} />
              <CoverLetterCard resumeText={parsed.raw_text} />
            </div>

            {/* Interview Prep and Roadmap (2 columns layout) */}
            <div style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.25rem' }}>
              <InterviewPrepCard skills={analysis.skills} resumeText={parsed.raw_text} />
              <RoadmapCard skills={analysis.skills} resumeText={parsed.raw_text} />
            </div>

            {/* Project Ideas and Learning Path */}
            <div style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.25rem' }}>
              <ProjectIdeasCard skills={analysis.skills} resumeText={parsed.raw_text} />
              <LearningPathCard currentSkills={analysis.skills} suggestedSkills={missingJDSkills} />
            </div>
          </>
        )}
      </main>

      {/* Spin keyframe injected inline */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
