'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAssignmentStore } from '@/store/assignmentStore';
import { useAuthStore } from '@/store/authStore';
import AssignmentCard from '@/components/assignments/AssignmentCard';
import EmptyState from '@/components/assignments/EmptyState';
import AssignmentsSkeleton from '@/components/assignments/AssignmentsSkeleton';

function IconFilter() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1.5 3.5H12.5M3.5 7H10.5M5.5 10.5H8.5" stroke="#6B7280" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="6" cy="6" r="4.5" stroke="#9CA3AF" strokeWidth="1.3" />
      <path d="M9.5 9.5L12.5 12.5" stroke="#9CA3AF" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 3V13M3 8H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function AssignmentsPage() {
  const { assignments, isLoading, fetchAssignments } = useAssignmentStore();
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');

  useEffect(() => { fetchAssignments(); }, [fetchAssignments]);

  const filtered = assignments.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  const total = assignments.length;
  const completed = assignments.filter(a => a.status === 'completed').length;
  const pending = assignments.filter(a => a.status === 'pending' || a.status === 'processing').length;

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="animate-fade-in" style={{ position: 'relative' }}>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-primary)', fontSize: '22px', fontWeight: '600', color: '#181818', marginBottom: '4px' }}>
          {greeting}, {user?.name || 'Teacher'}! 👋
        </h1>
        <p style={{ fontFamily: 'var(--font-primary)', fontSize: '13px', color: '#6B7280', marginBottom: '20px' }}>
          {today}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #F0F0F0', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '28px', fontWeight: '700', color: '#181818', fontFamily: 'var(--font-primary)' }}>{total}</span>
            <span style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'var(--font-primary)' }}>Total Assignments</span>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #F0F0F0', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '28px', fontWeight: '700', color: '#181818', fontFamily: 'var(--font-primary)' }}>{completed}</span>
            <span style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'var(--font-primary)' }}>Completed</span>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #F0F0F0', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '28px', fontWeight: '700', color: '#181818', fontFamily: 'var(--font-primary)' }}>{pending}</span>
            <span style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'var(--font-primary)' }}>Pending</span>
          </div>

        </div>
      </div>

      {isLoading ? (
        <AssignmentsSkeleton />
      ) : assignments.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                width: '8px', height: '8px', borderRadius: '9999px',
                background: '#22C55E', display: 'inline-block', flexShrink: 0,
              }} className="animate-pulse-dot" />
              <h2 style={{
                fontFamily: 'var(--font-primary)', fontSize: '20px',
                fontWeight: '600', color: '#181818', letterSpacing: '-0.03em',
              }}>
                Assignments
              </h2>
            </div>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px',
          }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', borderRadius: '10px',
              border: '1px solid #E5E7EB', background: '#FFFFFF',
              fontFamily: 'var(--font-primary)', fontSize: '13px',
              color: '#6B7280', cursor: 'pointer',
            }}>
              <IconFilter />
              Filter By
            </button>

            <div style={{ flex: 1, position: 'relative' }}>
              <div style={{
                position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
              }}>
                <IconSearch />
              </div>
              <input
                type="text"
                placeholder="Search Assignment"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%', height: '38px', padding: '0 14px 0 36px',
                  border: '1px solid #E5E7EB', borderRadius: '10px',
                  fontFamily: 'var(--font-primary)', fontSize: '13px', color: '#181818',
                  background: '#FFFFFF', outline: 'none',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = '#181818')}
                onBlur={e => (e.currentTarget.style.borderColor = '#E5E7EB')}
              />
            </div>
          </div>

          <div className="assignments-grid">
            {filtered.map(a => (
              <AssignmentCard key={a._id} assignment={a} />
            ))}
          </div>

          <div style={{
            position: 'fixed', bottom: 0, left: 'var(--topbar-left, 327px)', right: '24px',
            height: '73px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 20, background: 'linear-gradient(to bottom, rgba(234,234,234,0) 0%, rgba(218,218,218,1) 100%)',
            backdropFilter: 'blur(2px)',
          }}>
            <Link href="/assignments/create">
              <button className="btn-primary" style={{ fontSize: '15px', gap: '6px' }}>
                <IconPlus />
                Create Assignment
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}