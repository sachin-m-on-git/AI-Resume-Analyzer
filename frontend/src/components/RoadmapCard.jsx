import React, { useState } from 'react';
import { Map, Loader, ArrowRight, Target } from 'lucide-react';
import { generateRoadmap } from '../utils/api';

export default function RoadmapCard({ skills, resumeText }) {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await generateRoadmap(skills, resumeText);
      setRoadmap(result);
    } catch (err) {
      setError('Failed to generate career roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card animate-fade-up stagger-4">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
        <div style={iconBox('var(--accent)')}><Map size={20} /></div>
        <h2 style={sectionTitle}>Career Progression Roadmap</h2>
      </div>
      
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
        AI-projected next steps in your career based on your current trajectory and experience.
      </p>

      {!roadmap && (
        <button
          className="btn-primary"
          onClick={handleGenerate}
          disabled={loading}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {loading ? (
            <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> Mapping Future...</>
          ) : (
            <><Target size={18} /> Generate 3-Step Roadmap</>
          )}
        </button>
      )}

      {error && (
        <div style={{ marginTop: '1rem', color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</div>
      )}

      {roadmap && !loading && (
        <div style={{ animation: 'fadeUp 0.3s ease', marginTop: '1.5rem', position: 'relative' }}>
          {/* Vertical connecting line */}
          <div style={{
            position: 'absolute', top: '24px', bottom: '24px', left: '23px',
            width: '2px', background: 'var(--border)', zIndex: 0
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
            {roadmap.map((step, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '16px' }}>
                
                {/* Step indicator */}
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: 'var(--surface)', border: `2px solid var(--accent)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, color: 'var(--accent)', flexShrink: 0,
                  boxShadow: '0 0 10px rgba(56, 189, 248, 0.2)'
                }}>
                  {idx + 1}
                </div>

                {/* Content */}
                <div style={{
                  background: 'var(--surface2)', border: '1px solid var(--border)',
                  borderRadius: '16px', padding: '1.25rem', flex: 1,
                  transition: 'transform 0.2s', cursor: 'default'
                }} className="hover:border-accent">
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>
                      {step.title}
                    </h3>
                    <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>
                      {step.timeline}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {step.description}
                  </p>

                  <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Skills to Acquire:
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '0.5rem' }}>
                      {step.skills_to_acquire?.map((skill, i) => (
                        <span key={i} style={{
                          background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent)',
                          padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 500, border: '1px solid rgba(56, 189, 248, 0.2)'
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
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
