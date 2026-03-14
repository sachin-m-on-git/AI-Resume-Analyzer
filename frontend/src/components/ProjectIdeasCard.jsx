import React, { useState } from 'react';
import { Code, Loader, Terminal, Star } from 'lucide-react';
import { generateProjectIdeas } from '../utils/api';

export default function ProjectIdeasCard({ skills, resumeText }) {
  const [projects, setProjects] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await generateProjectIdeas(skills, resumeText);
      setProjects(result);
    } catch (err) {
      setError('Failed to generate project ideas. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card animate-fade-up stagger-5">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
        <div style={iconBox('var(--accent2)')}><Code size={20} /></div>
        <h2 style={sectionTitle}>Portfolio Analyzer (Project Ideas)</h2>
      </div>
      
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
        Missing skills holding you back? Get 3 custom, impressive side-projects to build your portfolio and fill those gaps.
      </p>

      {!projects && (
        <button
          className="btn-primary"
          onClick={handleGenerate}
          disabled={loading}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--accent2)' }}
        >
          {loading ? (
            <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> Brainstorming...</>
          ) : (
            <><Terminal size={18} /> Generate Portfolio Projects</>
          )}
        </button>
      )}

      {error && (
        <div style={{ marginTop: '1rem', color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</div>
      )}

      {projects && !loading && (
        <div style={{ animation: 'fadeUp 0.3s ease', display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
          {projects.map((proj, idx) => (
            <div key={idx} style={{
              background: 'var(--surface2)', border: '1px solid var(--border)',
              borderRadius: '16px', padding: '1.25rem', position: 'relative', overflow: 'hidden'
            }}>
              {/* Highlight ribbon */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--accent2)' }} />

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '0.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)' }}>
                  {proj.title}
                </h3>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
                {proj.description}
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
                {proj.tech_stack?.map((tech, i) => (
                  <span key={i} style={{
                    background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text)',
                    padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500, border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    {tech}
                  </span>
                ))}
              </div>

              {/* Reason */}
              <div style={{
                background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '8px', padding: '0.75rem', display: 'flex', gap: '8px', alignItems: 'flex-start'
              }}>
                <Star size={14} color="var(--accent2)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '0.8rem', color: 'var(--text)', lineHeight: 1.4 }}>
                  <strong style={{ color: 'var(--accent2)' }}>Why build this: </strong>
                  {proj.reason}
                </p>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const sectionTitle = { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' };
const iconBox = (color) => ({
  background: `${color}22`, color, borderRadius: '12px', padding: '8px',
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
});
