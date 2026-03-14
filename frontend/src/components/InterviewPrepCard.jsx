import React, { useState } from 'react';
import { MessageSquare, Loader, Eye } from 'lucide-react';
import { generateInterviewQuestions } from '../utils/api';

export default function InterviewPrepCard({ skills, resumeText }) {
  const [prepData, setPrepData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await generateInterviewQuestions(skills, resumeText);
      setPrepData(result);
    } catch (err) {
      setError('Failed to generate interview questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card animate-fade-up stagger-3">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
        <div style={iconBox('var(--accent2)')}><MessageSquare size={20} /></div>
        <h2 style={sectionTitle}>Interview Preparation</h2>
      </div>
      
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
        Generate personalized technical and behavioral interview questions based on your resume.
      </p>

      {!prepData && (
        <button
          className="btn-primary"
          onClick={handleGenerate}
          disabled={loading}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--accent2)' }}
        >
          {loading ? (
            <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> Generating Questions...</>
          ) : (
            <>Generate Practice Questions</>
          )}
        </button>
      )}

      {error && (
        <div style={{ marginTop: '1rem', color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</div>
      )}

      {prepData && !loading && (
        <div style={{ animation: 'fadeUp 0.3s ease', display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
          
          {/* Technical Section */}
          <div>
            <h3 style={subHeader}>Technical Questions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '0.75rem' }}>
              {prepData.technical_questions?.map((q, i) => (
                <QuestionItem key={i} question={q.question} context={q.context} index={i + 1} color="var(--accent)" />
              ))}
            </div>
          </div>

          {/* Behavioral Section */}
          <div>
            <h3 style={subHeader}>Behavioral Questions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '0.75rem' }}>
              {prepData.behavioral_questions?.map((q, i) => (
                <QuestionItem key={i} question={q.question} context={q.context} index={i + 1} color="var(--accent2)" />
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

function QuestionItem({ question, context, index, color }) {
  const [showContext, setShowContext] = useState(false);

  return (
    <div style={{
      background: 'var(--surface2)', border: '1px solid var(--border)',
      borderRadius: '12px', padding: '1rem', transition: 'all 0.2s',
      position: 'relative', overflow: 'hidden'
    }}>
       <div style={{
          position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: color, opacity: 0.6
        }} />
      <div style={{ paddingLeft: '8px' }}>
        <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '0.5rem', lineHeight: 1.4 }}>
          <span style={{ color: color, marginRight: '6px' }}>Q{index}.</span>
          {question}
        </p>
        
        <button
          onClick={() => setShowContext(!showContext)}
          style={{
            background: 'none', border: 'none', color: 'var(--text-muted)',
            display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem',
            cursor: 'pointer', padding: 0, marginTop: '0.5rem'
          }}
        >
          <Eye size={14} /> {showContext ? 'Hide Context' : 'Why ask this?'}
        </button>

        {showContext && (
          <div style={{
            marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(0,0,0,0.2)',
            borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-muted)',
            borderLeft: `2px solid ${color}`, animation: 'fadeUp 0.2s ease'
          }}>
            <strong style={{ color: 'var(--text)' }}>Interviewer Concept: </strong> {context}
          </div>
        )}
      </div>
    </div>
  );
}

const sectionTitle = {
  fontFamily: 'var(--font-display)',
  fontWeight: 700,
  fontSize: '1.1rem',
  color: 'var(--text)',
};

const subHeader = {
  fontSize: '0.85rem',
  color: 'var(--text-muted)',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  borderBottom: '1px solid var(--border)',
  paddingBottom: '0.5rem'
};

const iconBox = (color) => ({
  background: `${color}22`,
  color,
  borderRadius: '12px',
  padding: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});
