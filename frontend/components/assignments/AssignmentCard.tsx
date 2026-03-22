'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Assignment } from '@/types';
import { formatDate } from '@/lib/utils';
import { useAssignmentStore } from '@/store/assignmentStore';

function IconThreeDot() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="3.5" r="1.2" fill="#9CA3AF" />
      <circle cx="8" cy="8" r="1.2" fill="#9CA3AF" />
      <circle cx="8" cy="12.5" r="1.2" fill="#9CA3AF" />
    </svg>
  );
}

interface Props { assignment: Assignment; }

export default function AssignmentCard({ assignment }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { deleteAssignment } = useAssignmentStore();

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleView(e: React.MouseEvent) {
    router.push(`/assignments/${assignment._id}/view`);
    setOpen(false);
  }

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (confirm('Delete this assignment?')) {
      await deleteAssignment(assignment._id);
    }
    setOpen(false);
  }

  return (
    <div
      className="assignment-card"
      onClick={handleView}
    >

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <h3 style={{
          fontFamily: 'var(--font-primary)',
          fontSize: '16px',
          fontWeight: '600',
          color: '#181818',
          letterSpacing: '-0.02em',
          lineHeight: '1.3',
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {assignment.title}
        </h3>

        <div ref={menuRef} style={{ position: 'relative', flexShrink: 0 }}>
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }}
            style={{
              width: '28px', height: '28px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '8px', border: 'none', background: 'transparent',
              cursor: 'pointer',
            }}
          >
            <IconThreeDot />
          </button>

          {open && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 'auto',
                bottom: '32px',
                zIndex: 100,
                background: '#FFFFFF',
                border: '1px solid #F0F0F0',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
                overflow: 'hidden',
                minWidth: '160px',
              }}
              className="animate-fade-in"
            >
              <button
                onClick={handleView}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  padding: '10px 16px', background: 'none', border: 'none',
                  fontFamily: 'var(--font-primary)', fontSize: '14px',
                  color: '#181818', cursor: 'pointer', textAlign: 'left',
                  fontWeight: '400',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F9F9F9')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                View Assignment
              </button>
              <button
                onClick={handleDelete}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  padding: '10px 16px', background: 'none', border: 'none',
                  fontFamily: 'var(--font-primary)', fontSize: '14px',
                  color: '#EF4444', cursor: 'pointer', textAlign: 'left',
                  fontWeight: '400',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#FFF5F5')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginTop: '24px',
        fontFamily: 'var(--font-primary)',
        fontSize: '13px',
        color: '#6B7280',
      }}>
        <span>
          <span style={{ fontWeight: '500', color: '#9CA3AF' }}>Assigned on : </span>
          {formatDate(assignment.createdAt)}
        </span>
        <span>
          <span style={{ fontWeight: '500', color: '#9CA3AF' }}>Due : </span>
          {formatDate(assignment.dueDate)}
        </span>
      </div>
    </div>
  );
}