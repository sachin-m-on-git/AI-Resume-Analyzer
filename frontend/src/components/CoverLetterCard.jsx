import React, { useState } from 'react';
import { FileText, Copy, Loader, Edit3, CheckCircle } from 'lucide-react';
import { generateCoverLetter } from '../utils/api';

export default function CoverLetterCard({ resumeText, defaultJobDescription = "" }) {
  const [jobDescription, setJobDescription] = useState(defaultJobDescription);
  const [coverLetter, setCoverLetter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await generateCoverLetter(resumeText, jobDescription);
      setCoverLetter(result);
    } catch (err) {
      setError('Failed to generate cover letter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (coverLetter) {
      navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="card animate-fade-up stagger-2">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
        <div style={iconBox('var(--accent)')}><FileText size={20} /></div>
        <h2 style={sectionTitle}>Cover Letter Generator</h2>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Target Job Description (Optional)
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here to tailor the cover letter..."
          style={{
            width: '100%', minHeight: '80px', padding: '0.75rem',
            background: 'var(--surface2)', border: '1px solid var(--border)',
            borderRadius: '12px', color: 'var(--text)', fontSize: '0.9rem',
            fontFamily: 'var(--font-body)', resize: 'vertical'
          }}
        />
      </div>

      <button
        className="btn-primary"
        onClick={handleGenerate}
        disabled={loading}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
      >
        {loading ? (
          <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</>
        ) : (
          <><Edit3 size={18} /> Generate Cover Letter</>
        )}
      </button>

      {error && (
        <div style={{ marginTop: '1rem', color: 'var(--danger)', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {coverLetter && !loading && (
        <div style={{ marginTop: '1.5rem', animation: 'fadeUp 0.3s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Generated Letter
            </span>
            <button
              onClick={handleCopy}
              style={{
                background: 'none', border: 'none', color: copied ? 'var(--success)' : 'var(--text-muted)',
                display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', cursor: 'pointer', transition: 'color 0.2s',
              }}
            >
              {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div style={{
            background: 'rgba(15, 23, 42, 0.4)', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '1.25rem',
            fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text)',
            whiteSpace: 'pre-wrap', maxHeight: '400px', overflowY: 'auto'
          }}>
            {coverLetter}
          </div>
        </div>
      )}
    </div>
  );
}

const sectionTitle = {
  fontFamily: 'var(--font-display)',
  fontWeight: 700,
  fontSize: '1.1rem',
  color: 'var(--text)',
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
