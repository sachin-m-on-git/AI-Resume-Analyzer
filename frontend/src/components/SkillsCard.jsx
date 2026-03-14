/**
 * SkillsCard.jsx
 * Displays extracted skills as colourful badges.
 */

import React from 'react';
import { Cpu } from 'lucide-react';

export default function SkillsCard({ skills = [], keywords = [] }) {
  return (
    <div className="card animate-fade-up" style={{ animationDelay: '120ms' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
        <div style={iconBox}><Cpu size={18} /></div>
        <div>
          <h2 style={sectionTitle}>Extracted Skills</h2>
          <p style={subtitle}>{skills.length} technical skills detected</p>
        </div>
      </div>

      {skills.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No recognised skills found.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.25rem' }}>
          {skills.map((s) => (
            <span key={s} className="badge badge-blue">{s}</span>
          ))}
        </div>
      )}

      {keywords.length > 0 && (
        <>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            Top Keywords
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {keywords.slice(0, 15).map((k) => (
              <span key={k} className="badge badge-purple">{k}</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const sectionTitle = { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text)' };
const subtitle = { color: 'var(--text-muted)', fontSize: '0.8rem' };
const iconBox = {
  background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent)',
  borderRadius: '12px', padding: '8px',
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
};
