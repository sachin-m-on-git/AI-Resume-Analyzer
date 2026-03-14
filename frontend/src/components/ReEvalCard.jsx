/**
 * ReEvalCard.jsx
 * Shows previous vs new score when user uploads an improved resume.
 */

import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function ReEvalCard({ previousScore, currentScore }) {
  if (!previousScore || !currentScore) return null;

  const diff = (currentScore - previousScore).toFixed(1);
  const improved = diff > 0;
  const pct = previousScore > 0
    ? Math.abs(((currentScore - previousScore) / previousScore) * 100).toFixed(1)
    : 0;

  return (
    <div className="card animate-fade-up" style={{
      animationDelay: '280ms',
      border: `1px solid ${improved ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
        <div style={{ background: improved ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: improved ? 'var(--success)' : 'var(--danger)', borderRadius: '10px', padding: '8px', display: 'flex' }}>
          <TrendingUp size={18} />
        </div>
        <div>
          <h2 style={sectionTitle}>Re-Evaluation</h2>
          <p style={subtitle}>Score comparison after revision</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '1rem', textAlign: 'center' }}>
        {/* Previous */}
        <div style={{ background: 'var(--surface2)', borderRadius: '12px', padding: '1rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: 4 }}>PREVIOUS</p>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: 'var(--text)' }}>
            {previousScore}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/10</span>
          </p>
        </div>

        {/* Arrow */}
        <div style={{ color: improved ? 'var(--success)' : 'var(--danger)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem' }}>
          {improved ? '▲' : '▼'}
        </div>

        {/* New */}
        <div style={{ background: improved ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', borderRadius: '12px', padding: '1rem', border: `1px solid ${improved ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}` }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: 4 }}>NEW</p>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: improved ? 'var(--success)' : 'var(--danger)' }}>
            {currentScore}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/10</span>
          </p>
        </div>
      </div>

      <p style={{ textAlign: 'center', marginTop: '1rem', fontWeight: 700, fontSize: '0.9rem', color: improved ? 'var(--success)' : 'var(--danger)' }}>
        {improved ? `+${diff} points — ${pct}% improvement 🎉` : `${diff} points — keep refining!`}
      </p>

      {currentScore < 8 && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 6 }}>
          Goal: <strong style={{ color: 'var(--success)' }}>8.0 / 10</strong> — you need {(8 - currentScore).toFixed(1)} more points
        </p>
      )}
    </div>
  );
}

const sectionTitle = { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text)' };
const subtitle = { color: 'var(--text-muted)', fontSize: '0.8rem' };
