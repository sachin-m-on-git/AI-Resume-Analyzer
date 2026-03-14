/**
 * SectionsCard.jsx
 * Shows which standard resume sections were detected with tick/cross indicators.
 */

import React from 'react';
import { LayoutList } from 'lucide-react';

const STANDARD_SECTIONS = [
  { key: 'summary',        label: 'Professional Summary' },
  { key: 'experience',     label: 'Work Experience' },
  { key: 'education',      label: 'Education' },
  { key: 'skills',         label: 'Skills' },
  { key: 'projects',       label: 'Projects' },
  { key: 'certifications', label: 'Certifications' },
];

export default function SectionsCard({ parsed }) {
  if (!parsed) return null;

  return (
    <div className="card animate-fade-up" style={{ animationDelay: '140ms' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
        <div style={iconBox}><LayoutList size={18} /></div>
        <div>
          <h2 style={sectionTitle}>Section Completeness</h2>
          <p style={subtitle}>Key resume sections detected</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {STANDARD_SECTIONS.map(({ key, label }) => {
          const present = parsed[`has_${key}`] || false;
          return (
            <div key={key} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'var(--surface2)', borderRadius: '8px', padding: '0.6rem 0.9rem',
            }}>
              <span style={{ fontSize: '0.87rem', color: present ? 'var(--text)' : 'var(--text-muted)' }}>{label}</span>
              <span style={{
                fontSize: '0.75rem', fontWeight: 700,
                color: present ? 'var(--success)' : 'var(--danger)',
              }}>
                {present ? '✓ Found' : '✗ Missing'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const sectionTitle = { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text)' };
const subtitle = { color: 'var(--text-muted)', fontSize: '0.8rem' };
const iconBox = {
  background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)',
  borderRadius: '12px', padding: '8px',
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
};
