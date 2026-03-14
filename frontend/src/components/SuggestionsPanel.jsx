/**
 * SuggestionsPanel.jsx
 * Renders the Gemini-generated improvement suggestions as formatted markdown.
 */

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export default function SuggestionsPanel({ suggestions, ats }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="card animate-fade-up" style={{ animationDelay: '160ms' }}>
      {/* Header */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: open ? '1.25rem' : 0, cursor: 'pointer' }}
        onClick={() => setOpen((o) => !o)}
      >
        <div style={iconBox}><Sparkles size={18} /></div>
        <div style={{ flex: 1 }}>
          <h2 style={sectionTitle}>AI Improvement Suggestions</h2>
          <p style={subtitle}>Powered by Google Gemini</p>
        </div>
        {open ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
      </div>

      {open && (
        <>
          {/* Suggestions */}
          <div style={{
            background: 'var(--surface2)', borderRadius: '10px',
            padding: '1rem 1.25rem', marginBottom: ats ? '1.25rem' : 0,
            fontSize: '0.88rem', lineHeight: 1.75,
            color: 'var(--text)',
            maxHeight: '420px', overflowY: 'auto',
          }}>
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, margin: '0.75rem 0 0.25rem', color: 'var(--accent)' }}>{children}</h3>,
                h2: ({ children }) => <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, margin: '0.75rem 0 0.25rem', color: 'var(--accent)' }}>{children}</h4>,
                h3: ({ children }) => <h5 style={{ fontWeight: 700, margin: '0.5rem 0 0.2rem', color: 'var(--accent)' }}>{children}</h5>,
                ul: ({ children }) => <ul style={{ paddingLeft: '1.2rem', margin: '0.3rem 0' }}>{children}</ul>,
                li: ({ children }) => <li style={{ marginBottom: '4px' }}>{children}</li>,
                strong: ({ children }) => <strong style={{ color: 'var(--text)', fontWeight: 700 }}>{children}</strong>,
                p: ({ children }) => <p style={{ marginBottom: '0.5rem' }}>{children}</p>,
              }}
            >
              {suggestions || '_No suggestions generated yet._'}
            </ReactMarkdown>
          </div>

          {/* ATS section */}
          {ats && (
            <div style={{ background: 'var(--surface2)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>ATS Compatibility</p>
                {ats.ats_score != null && (
                  <span style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem',
                    color: ats.ats_score >= 70 ? 'var(--success)' : ats.ats_score >= 50 ? 'var(--warning)' : 'var(--danger)',
                  }}>
                    {ats.ats_score}/100
                  </span>
                )}
              </div>

              {ats.issues?.length > 0 && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Issues</p>
                  {ats.issues.map((issue, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '4px', fontSize: '0.83rem' }}>
                      <span style={{ color: 'var(--danger)', marginTop: 2 }}>⚠</span>
                      <span>{issue}</span>
                    </div>
                  ))}
                </div>
              )}

              {ats.missing_keywords?.length > 0 && (
                <>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Suggested Keywords</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {ats.missing_keywords.map((kw, i) => (
                      <span key={i} className="badge badge-yellow">{kw}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

const sectionTitle = { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text)' };
const subtitle = { color: 'var(--text-muted)', fontSize: '0.8rem' };
const iconBox = {
  background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent2)',
  borderRadius: '12px', padding: '8px',
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
};
