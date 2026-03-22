'use client';

import type { JobProgressEvent } from '@/types';

interface Props {
  progress: JobProgressEvent | null;
  title: string;
}

const STEPS = [
  { status: 'queued', label: 'Job queued', pct: 5 },
  { status: 'processing', label: 'Starting generation', pct: 20 },
  { status: 'generating', label: 'Generating questions', pct: 50 },
  { status: 'structuring', label: 'Structuring paper', pct: 75 },
  { status: 'saving', label: 'Saving to database', pct: 90 },
  { status: 'completed', label: 'Done!', pct: 100 },
];

function SparkleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 4L15.8 10.2L22 12L15.8 13.8L14 20L12.2 13.8L6 12L12.2 10.2L14 4Z"
        fill="#E8500A" />
      <path d="M22 4L22.9 6.1L25 7L22.9 7.9L22 10L21.1 7.9L19 7L21.1 6.1L22 4Z"
        fill="#FDBA74" />
      <path d="M6 18L6.6 19.4L8 20L6.6 20.6L6 22L5.4 20.6L4 20L5.4 19.4L6 18Z"
        fill="#FDBA74" />
    </svg>
  );
}

export default function ProcessingState({ progress, title }: Props) {
  const pct = progress?.progress ?? 5;
  const message = progress?.message ?? 'Initializing...';

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '500px', padding: '40px 20px',
    }} className="animate-fade-in">

      <div style={{ position: 'relative', marginBottom: '28px' }}>
        <div style={{
          position: 'absolute', inset: '-8px',
          borderRadius: '9999px',
          background: 'rgba(232,80,10,0.1)',
        }} className="animate-ping" />
        <div style={{
          width: '72px', height: '72px',
          borderRadius: '9999px',
          background: '#FFF8F5',
          border: '2px solid rgba(232,80,10,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <SparkleIcon />
        </div>
      </div>

      <h2 style={{
        fontFamily: 'var(--font-primary)',
        fontSize: '20px', fontWeight: '600',
        color: '#181818', letterSpacing: '-0.03em',
        marginBottom: '8px',
      }}>
        Generating Question Paper
      </h2>

      <p style={{
        fontFamily: 'var(--font-primary)',
        fontSize: '14px', color: '#6B7280',
        textAlign: 'center', maxWidth: '320px',
        lineHeight: '1.6', marginBottom: '28px',
      }}>
        AI is creating a customized paper for{' '}
        <span style={{ fontWeight: '600', color: '#181818' }}>{title}</span>
      </p>

      <div style={{ width: '100%', maxWidth: '360px', marginBottom: '10px' }}>
        <div className="progress-track" style={{ height: '6px' }}>
          <div
            className="progress-fill"
            style={{
              width: `${pct}%`,
              background: '#E8500A',
              transition: 'width 700ms ease-out',
            }}
          />
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        fontFamily: 'var(--font-primary)', fontSize: '13px', color: '#6B7280',
        marginBottom: '32px',
      }}>
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="animate-spin">
          <circle cx="6.5" cy="6.5" r="5" stroke="rgba(107,114,128,0.3)" strokeWidth="2" />
          <path d="M6.5 1.5C6.5 1.5 10 1.5 11.5 5" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span>{message}</span>
        <span style={{ fontWeight: '600', color: '#181818' }}>{pct}%</span>
      </div>

      <div style={{
        display: 'flex', flexDirection: 'column', gap: '10px',
        width: '100%', maxWidth: '280px',
      }}>
        {STEPS.map((step) => {
          const done = pct >= step.pct;
          const current = progress?.status === step.status;
          return (
            <div key={step.status} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              fontFamily: 'var(--font-primary)',
              fontSize: '13px',
              color: done ? '#181818' : '#D1D5DB',
              transition: 'color 300ms',
            }}>

              <div style={{
                width: '18px', height: '18px',
                borderRadius: '9999px',
                flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done ? '#22C55E' : current ? '#E8500A' : '#E5E7EB',
                transition: 'background 300ms',
              }}>
                {done ? (
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : current ? (
                  <div style={{
                    width: '6px', height: '6px',
                    borderRadius: '9999px', background: 'white',
                  }} className="animate-pulse-dot" />
                ) : null}
              </div>
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>

    </div>
  );
}