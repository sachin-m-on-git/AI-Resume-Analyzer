/**
 * ScoreCard.jsx
 * Displays the resume score breakdown using Recharts.
 */

import React from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts';
import { Award } from 'lucide-react';

export default function ScoreCard({ scoreData }) {
  if (!scoreData) return null;

  const { final_score, max_score, breakdown, grade } = scoreData;
  const pct = (final_score / max_score) * 100;
  const color = pct >= 80 ? 'var(--success)' : pct >= 60 ? 'var(--warning)' : 'var(--danger)';

  const radarData = Object.entries(breakdown).map(([key, val]) => ({
    subject: key.charAt(0).toUpperCase() + key.slice(1),
    score: val,
    fullMark: 2,
  }));

  return (
    <div className="card animate-fade-up" style={{ animationDelay: '80ms' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
        <div style={iconBox(color)}><Award size={18} /></div>
        <div>
          <h2 style={sectionTitle}>Resume Score</h2>
          <p style={subtitle}>Rated across 5 dimensions</p>
        </div>
      </div>

      {/* Big score ring */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{
          position: 'relative', display: 'inline-flex',
          alignItems: 'center', justifyContent: 'center',
          width: 120, height: 120,
        }}>
          <svg width="120" height="120" style={{ position: 'absolute', top: 0, left: 0 }}>
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--surface2)" strokeWidth="10" />
            <circle
              cx="60" cy="60" r="52" fill="none"
              stroke={color} strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 52}`}
              strokeDashoffset={`${2 * Math.PI * 52 * (1 - pct / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div style={{ textAlign: 'center', zIndex: 1 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color }}>{final_score}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>/10</span>
          </div>
        </div>
        <p style={{ marginTop: '0.5rem', fontWeight: 600, color, fontSize: '0.9rem' }}>{grade}</p>
        {final_score < 8 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 4 }}>
            Target: <strong style={{ color: 'var(--success)' }}>8.0 / 10</strong>
          </p>
        )}
      </div>

      {/* Radar chart */}
      <ResponsiveContainer width="100%" height={200}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
          <Radar
            name="Score" dataKey="score"
            stroke={color} fill={color} fillOpacity={0.25}
          />
          <Tooltip
            contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }}
            labelStyle={{ color: 'var(--text)' }}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Breakdown bars */}
      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {Object.entries(breakdown).map(([key, val]) => (
          <div key={key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, fontSize: '0.8rem' }}>
              <span style={{ textTransform: 'capitalize', color: 'var(--text-muted)' }}>{key}</span>
              <span style={{ fontWeight: 600 }}>{val}/2</span>
            </div>
            <div style={{ background: 'var(--surface2)', borderRadius: 99, height: 6 }}>
              <div style={{
                width: `${(val / 2) * 100}%`, height: '100%',
                background: color, borderRadius: 99,
                transition: 'width 0.8s ease',
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const sectionTitle = { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text)' };
const subtitle = { color: 'var(--text-muted)', fontSize: '0.8rem' };
const iconBox = (color) => ({
  background: `${color}22`, color, borderRadius: '10px', padding: '8px',
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
});
