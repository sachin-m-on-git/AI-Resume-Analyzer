/**
 * UploadCard.jsx
 * Drag-and-drop PDF upload zone.
 * Calls onFileSelected(file) when the user picks a PDF.
 */

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, X } from 'lucide-react';

export default function UploadCard({ file, onFileSelected, onClear, uploading }) {
  const onDrop = useCallback((accepted) => {
    if (accepted[0]) onFileSelected(accepted[0]);
  }, [onFileSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div className="card animate-fade-up" style={{ animationDelay: '0ms' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
        <div style={iconBox('var(--accent)')}><UploadCloud size={20} /></div>
        <div>
          <h2 style={sectionTitle}>Upload Resume</h2>
          <p style={subtitle}>PDF format · max 10 MB</p>
        </div>
      </div>

      {/* Drop zone */}
      {!file ? (
        <div
          {...getRootProps()}
          style={{
            border: `2px dashed ${isDragActive ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: '16px',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            background: isDragActive ? 'var(--accent-glow)' : 'var(--surface2)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <input {...getInputProps()} />
          <UploadCloud size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text)', fontWeight: 600, marginBottom: 4 }}>
            {isDragActive ? 'Drop it here!' : 'Drag & drop your PDF here'}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            or <span style={{ color: 'var(--accent)', fontWeight: 600 }}>click to browse</span>
          </p>
        </div>
      ) : (
        /* File selected */
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          background: 'var(--surface2)', borderRadius: '16px',
          padding: '1rem 1.25rem', border: '1px solid var(--border)',
        }}>
          <div style={iconBox('var(--success)')}><FileText size={20} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {file.name}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
          {!uploading && (
            <button onClick={onClear} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex' }}>
              <X size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const sectionTitle = {
  fontFamily: 'var(--font-display)',
  fontWeight: 700,
  fontSize: '1rem',
  color: 'var(--text)',
};
const subtitle = { color: 'var(--text-muted)', fontSize: '0.8rem' };
const iconBox = (color) => ({
  background: `${color}22`,
  color,
  borderRadius: '10px',
  padding: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});
