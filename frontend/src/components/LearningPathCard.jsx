import React, { useState } from 'react';
import { BookOpen, Loader, SearchCode, ArrowRight } from 'lucide-react';
import { generateLearningPath } from '../utils/api';

export default function LearningPathCard({ currentSkills, suggestedSkills = [] }) {
  const [missingSkill, setMissingSkill] = useState('');
  const [learningPath, setLearningPath] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!missingSkill.trim()) return;
    setLoading(true);
    setError('');
    setLearningPath(null);
    try {
      const result = await generateLearningPath(missingSkill.trim(), currentSkills);
      setLearningPath(result);
    } catch (err) {
      setError('Failed to generate learning path. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card animate-fade-up stagger-4">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
        <div style={iconBox('var(--success)')}><BookOpen size={20} /></div>
        <h2 style={sectionTitle}>Skill Learning Path</h2>
      </div>
      
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
        Missing a key skill or want to discover something new? Enter it below to get a 3-step actionable guide to master it.
      </p>

      {/* Input section */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <SearchCode size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="e.g. Docker, GraphQL, System Design" 
            value={missingSkill}
            onChange={(e) => setMissingSkill(e.target.value)}
            style={{ 
              width: '100%', padding: '0.65rem 1rem 0.65rem 2.25rem', 
              background: 'var(--surface2)', border: '1px solid var(--border)', 
              borderRadius: '8px', color: 'var(--text)', outline: 'none',
              fontSize: '0.9rem' 
            }} 
          />
        </div>
        <button
          className="btn-primary"
          onClick={handleGenerate}
          disabled={loading || !missingSkill.trim()}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'var(--success)' }}
        >
          {loading ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <ArrowRight size={16} />}
          Plan
        </button>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '8px' }}>
          {suggestedSkills.length > 0 ? 'From JD Match:' : 'Popular Skills to Explore:'}
        </span>
        <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '6px', verticalAlign: 'middle' }}>
          {(suggestedSkills.length > 0 ? suggestedSkills : ['Docker', 'System Design', 'React', 'AWS', 'GraphQL']).map((skill, index) => (
            <button 
              key={index}
              onClick={() => setMissingSkill(skill)}
              style={{
                background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)',
                color: 'var(--success)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem',
                cursor: 'pointer', transition: 'all 0.2s ease', hover: { background: 'rgba(34, 197, 94, 0.2)' }
              }}
            >
              + {skill}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ marginTop: '0.5rem', color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</div>
      )}

      {/* Results */}
      {learningPath && !loading && (
        <div style={{ animation: 'fadeUp 0.3s ease', marginTop: '1.5rem', position: 'relative' }}>
          {/* Vertical connecting line */}
          <div style={{
            position: 'absolute', top: '24px', bottom: '24px', left: '23px',
            width: '2px', background: 'var(--border)', zIndex: 0
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
            {learningPath.steps.map((step, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '16px' }}>
                
                {/* Step indicator */}
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: 'var(--surface)', border: `2px solid var(--success)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, color: 'var(--success)', flexShrink: 0,
                  boxShadow: '0 0 10px rgba(34, 197, 94, 0.2)'
                }}>
                  {idx + 1}
                </div>

                {/* Content */}
                <div style={{
                  background: 'var(--surface2)', border: '1px solid var(--border)',
                  borderRadius: '16px', padding: '1.25rem', flex: 1,
                  transition: 'transform 0.2s', cursor: 'default'
                }} className="hover:border-success">
                  
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)', marginBottom: '0.5rem' }}>
                    {step.title}
                  </h3>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {step.description}
                  </p>

                  <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Recommended Resources:
                    </span>
                    <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem', color: 'var(--success)', fontSize: '0.85rem' }}>
                      {step.resources?.map((res, i) => (
                        <li key={i} style={{ marginBottom: '4px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>{res}</span>
                        </li>
                      ))}
                    </ul>
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
  background: `${color}15`, color, borderRadius: '12px', padding: '8px',
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
});
