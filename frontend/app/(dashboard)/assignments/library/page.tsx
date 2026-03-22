'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAssignmentStore } from '@/store/assignmentStore';
import AssignmentCard from '@/components/assignments/AssignmentCard';

export default function LibraryPage() {
  const { assignments, fetchAssignments, isLoading } = useAssignmentStore();
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const completed = assignments.filter(a => a.status === 'completed');
  
  const filtered = completed.filter(a => {
    if (filter === 'All') return true;
    return a.subject === filter;
  });

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{
            width: '8px', height: '8px', borderRadius: '9999px',
            background: '#22C55E', display: 'inline-block', flexShrink: 0,
          }} className="animate-pulse-dot" />
          <h1 style={{
            fontFamily: 'var(--font-primary)', fontSize: '20px',
            fontWeight: '600', color: '#181818', letterSpacing: '-0.03em',
          }}>
            My Library
          </h1>
        </div>
        <p style={{
          fontFamily: 'var(--font-primary)', fontSize: '13px',
          color: '#6B7280', marginLeft: '16px',
        }}>
          All your generated question papers
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        {['All', 'Science', 'Mathematics', 'English'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 14px', borderRadius: '9999px', border: '1px solid #E5E7EB',
              background: filter === f ? '#181818' : '#FFFFFF',
              color: filter === f ? '#FFFFFF' : '#374151',
              fontSize: '13px', fontWeight: '500', fontFamily: 'var(--font-primary)',
              cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><div className="animate-spin" style={{ width: '24px', height: '24px', border: '2px solid #E5E7EB', borderTopColor: '#181818', borderRadius: '50%' }} /></div>
      ) : completed.length === 0 ? (
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px dashed #E5E7EB', padding: '60px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📚</div>
          <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: '16px', fontWeight: '600', color: '#181818', marginBottom: '4px' }}>No question papers yet</h3>
          <p style={{ fontFamily: 'var(--font-primary)', fontSize: '13px', color: '#6B7280', marginBottom: '20px' }}>Create your first assignment to build your library</p>
          <Link href="/assignments/create">
            <button className="btn-primary" style={{ padding: '0 20px', height: '40px', fontSize: '14px' }}>Create Assignment</button>
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280', fontSize: '14px', fontFamily: 'var(--font-primary)' }}>
          No papers found for {filter}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: '12px',
        }}>
          {filtered.map(a => (
            <AssignmentCard key={a._id} assignment={a} />
          ))}
        </div>
      )}
    </div>
  );
}
