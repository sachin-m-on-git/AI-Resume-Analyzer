/**
 * JDMatchCard.jsx
 * Let users paste a job description and compare it with their resume.
 * Shows matched/missing skills + an alignment score bar.
 */

import React, { useState } from 'react';
import { Target, Loader } from 'lucide-react';
import { compareJD } from '../utils/api';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell,
} from 'recharts';

export default function JDMatchCard({ resumeSkills, resumeText, onMissingSkills }) {
  const [jobTitle, setJobTitle] = useState('');
  const [jdText, setJDText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCompare() {
    if (!jdText.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await compareJD(resumeSkills, resumeText, jobTitle, jdText);
      setResult(data);
      if (onMissingSkills && data.missing_skills) {
        onMissingSkills(data.missing_skills);
      }
    } catch (e) {
      setError('Comparison failed. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }

  const chartData = result ? [
    { name: 'Skill Match', value: result.skill_match_pct, color: 'var(--accent)' },
    { name: 'Semantic',    value: result.semantic_score,  color: 'var(--accent2)' },
    { name: 'Alignment',  value: result.alignment_score,  color: 'var(--success)' },
  ] : [];

  return (
    <div className="card animate-fade-up" style={{ animationDelay: '240ms' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
        <div style={iconBox}><Target size={18} /></div>
        <div>
          <h2 style={sectionTitle}>Job Description Match</h2>
          <p style={subtitle}>Find skill gaps for your target role</p>
        </div>
      </div>

      {/* Inputs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
        <input
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Job title (e.g. Senior React Developer)"
          style={inputStyle}
        />
        <textarea
          value={jdText}
          onChange={(e) => setJDText(e.target.value)}
          placeholder="Paste the full job description here…"
          rows={5}
          style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
        />
      </div>

      <button className="btn-primary" onClick={handleCompare} disabled={loading || !jdText.trim()} style={{ width: '100%' }}>
        {loading ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Analysing…
          </span>
        ) : 'Compare →'}
      </button>

      {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '0.75rem' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: '1.5rem' }}>
          {/* Score bars */}
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={chartData} layout="vertical" barSize={16}>
              <XAxis type="number" domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} width={85} />
              <Tooltip
                formatter={(v) => [`${v.toFixed(1)}%`]}
                contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '1.25rem' }}>
            {/* Matched */}
            <div>
              <p style={labelStyle}>✅ Matched Skills ({result.matched_skills.length})</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '6px' }}>
                {result.matched_skills.length > 0
                  ? result.matched_skills.map((s) => <span key={s} className="badge badge-green">{s}</span>)
                  : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>None</span>
                }
              </div>
            </div>
            {/* Missing */}
            <div>
              <p style={labelStyle}>❌ Missing Skills ({result.missing_skills.length})</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '6px' }}>
                {result.missing_skills.length > 0
                  ? result.missing_skills.map((s) => <span key={s} className="badge badge-red">{s}</span>)
                  : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>None — great fit!</span>
                }
              </div>
            </div>
          </div>
        </div>
      )}
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
const inputStyle = {
  background: 'var(--surface2)', border: '1px solid var(--border)',
  borderRadius: '10px', padding: '0.65rem 1rem',
  color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: '0.88rem',
  outline: 'none', width: '100%',
};
const labelStyle = {
  fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)',
  textTransform: 'uppercase', letterSpacing: '0.05em',
};
