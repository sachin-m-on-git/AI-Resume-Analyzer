/**
 * SummaryCard.jsx
 * Allows the user to generate a Gemini-powered professional summary
 * and copy it to clipboard.
 */

import React, { useState } from 'react';
import { FileText, Copy, Check, Loader } from 'lucide-react';
import { generateSummary } from '../utils/api';

export default function SummaryCard({ skills, sections }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate() {
    setLoading(true);
    setError('');
    try {
      const result = await generateSummary(
        skills,
        sections?.projects || '',
        sections?.experience || '',
      );
      setSummary(result);
    } catch (e) {
      setError('Failed to generate summary. Check your API key and backend.');
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="card animate-fade-up" style={{ animationDelay: '200ms' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
        <div style={iconBox}><FileText size={18} /></div>
        <div style={{ flex: 1 }}>
          <h2 style={sectionTitle}>Professional Summary</h2>
          <p style={subtitle}>AI-generated 2-line summary</p>
        </div>
        <button className="btn-primary" onClick={handleGenerate} disabled={loading} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
          {loading ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : 'Generate'}
        </button>
      </div>

      {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{error}</p>}

      {summary ? (
        <div style={{ position: 'relative' }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: '12px', padding: '1.25rem 1.5rem',
            fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text)',
            fontStyle: 'italic', backdropFilter: 'blur(8px)',
          }}>
            "{summary}"
          </div>
          <button
            onClick={handleCopy}
            style={{
              position: 'absolute', top: '10px', right: '10px',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '8px', padding: '4px 8px',
              display: 'flex', alignItems: 'center', gap: '4px',
              color: 'var(--text-muted)', fontSize: '0.75rem',
            }}
          >
            {copied ? <Check size={12} color="var(--success)" /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      ) : (
        <div style={{
          background: 'var(--surface2)', borderRadius: '10px', padding: '1.5rem',
          textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem',
        }}>
          Click <strong style={{ color: 'var(--text)' }}>Generate</strong> to create your professional summary
        </div>
      )}
    </div>
  );
}

const sectionTitle = { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text)' };
const subtitle = { color: 'var(--text-muted)', fontSize: '0.8rem' };
const iconBox = {
  background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)',
  borderRadius: '12px', padding: '8px',
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
};
