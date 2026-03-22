'use client';

import Link from 'next/link';

function EmptyIllustration() {
  return (
    <svg width="220" height="180" viewBox="0 0 220 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="110" cy="95" r="70" fill="#E8E8EC" />

      <rect x="125" y="30" width="52" height="66" rx="6" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
      <rect x="132" y="42" width="28" height="3" rx="1.5" fill="#D1D5DB" />
      <rect x="132" y="49" width="22" height="2.5" rx="1.25" fill="#E5E7EB" />
      <rect x="132" y="55" width="26" height="2.5" rx="1.25" fill="#E5E7EB" />
      <rect x="132" y="61" width="20" height="2.5" rx="1.25" fill="#E5E7EB" />

      <rect x="153" y="35" width="8" height="5" rx="1" fill="#E5E7EB" />
      <rect x="163" y="35" width="8" height="5" rx="1" fill="#E5E7EB" />

      <g transform="translate(62, 28) rotate(-20, 20, 20)">
        <path d="M8 36 Q6 38 7 40 L9 38 Z" fill="#374151" />
        <rect x="7.5" y="10" width="5" height="28" rx="1" fill="#6B7280" />
        <rect x="7.5" y="8" width="5" height="4" rx="0.5" fill="#9CA3AF" />
        <path d="M8 36 L12 36 L10 42 Z" fill="#374151" />
      </g>

      <rect x="68" y="44" width="68" height="82" rx="8" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1.5" />
      <rect x="78" y="56" width="36" height="3.5" rx="1.75" fill="#D1D5DB" />
      <rect x="78" y="64" width="30" height="2.5" rx="1.25" fill="#E5E7EB" />
      <rect x="78" y="70" width="40" height="2.5" rx="1.25" fill="#E5E7EB" />
      <rect x="78" y="76" width="28" height="2.5" rx="1.25" fill="#E5E7EB" />
      <rect x="78" y="82" width="34" height="2.5" rx="1.25" fill="#E5E7EB" />
      <rect x="78" y="88" width="22" height="2.5" rx="1.25" fill="#E5E7EB" />

      <circle cx="122" cy="108" r="26" fill="white" stroke="#D1D5DB" strokeWidth="2" />
      <circle cx="122" cy="108" r="20" fill="white" />

      <circle cx="122" cy="108" r="14" fill="#FEE2E2" />
      <path d="M115 101L129 115M129 101L115 115" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />

      <line x1="140" y1="126" x2="152" y2="138" stroke="#9CA3AF" strokeWidth="4" strokeLinecap="round" />

      <g transform="translate(52, 82)">
        <path d="M6 0L7.2 4.8L12 6L7.2 7.2L6 12L4.8 7.2L0 6L4.8 4.8Z" fill="#93C5FD" />
      </g>

      <g transform="translate(72, 136)">
        <path d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z" fill="#BFDBFE" />
      </g>

      <circle cx="166" cy="112" r="5" fill="#93C5FD" />
    </svg>
  );
}

export default function EmptyState() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '678px',
      width: '100%',
    }} className="animate-fade-in">

      <EmptyIllustration />

      <h2 style={{
        fontFamily: 'var(--font-primary)',
        fontSize: '20px',
        fontWeight: '600',
        color: '#181818',
        marginTop: '8px',
        letterSpacing: '-0.03em',
      }}>
        No assignments yet
      </h2>

      <p style={{
        fontFamily: 'var(--font-primary)',
        fontSize: '14px',
        color: '#6B7280',
        textAlign: 'center',
        maxWidth: '380px',
        marginTop: '10px',
        lineHeight: '1.6',
        fontWeight: '400',
      }}>
        Create your first assignment to start collecting and grading student
        submissions. You can set up rubrics, define marking criteria, and let AI
        assist with grading.
      </p>

      <Link href="/assignments/create" style={{ marginTop: '28px' }}>
        <button className="btn-primary">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3V13M3 8H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Create Your First Assignment
        </button>
      </Link>
    </div>
  );
}