'use client';

import { useState } from 'react';
import type { AssessmentResult, Assignment } from '@/types';

interface Props {
  result: AssessmentResult;
  assignment: Assignment;
}

import { pdf } from '@react-pdf/renderer';
import { QuestionPaperPDF } from './QuestionPaperPDF';

function IconDownload() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 2V9M7 9L4.5 6.5M7 9L9.5 6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 11H12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconSpinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
      <circle cx="7" cy="7" r="5.5" stroke="rgba(24,24,24,0.2)" strokeWidth="1.5" />
      <path d="M7 1.5C10.5 1.5 12.5 4 12.5 7" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}

export default function PDFDownloadButton({ result, assignment }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    if (loading) return;
    setLoading(true);
    try {
      const blob = await pdf(<QuestionPaperPDF result={result} assignment={assignment} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${assignment.title.replace(/\s+/g, '_')}_question_paper.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        background: '#FFFFFF',
        color: '#181818',
        border: 'none',
        borderRadius: '8px',
        fontFamily: 'var(--font-primary)',
        fontSize: '13px',
        fontWeight: '500',
        cursor: loading ? 'not-allowed' : 'pointer',
        width: 'fit-content',
        transition: 'background 150ms',
        opacity: loading ? 0.7 : 1,
      }}
      onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#F0F0F0'; }}
      onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF'; }}
    >
      {loading ? <IconSpinner /> : <IconDownload />}
      {loading ? 'Generating...' : 'Download as PDF'}
    </button>
  );
}