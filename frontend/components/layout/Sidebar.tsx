'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAssignmentStore } from '@/store/assignmentStore';
import { useAuthStore } from '@/store/authStore';

function IconHome() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 6.5L8 2L14 6.5V13.5C14 13.7761 13.7761 14 13.5 14H10V10H6V14H2.5C2.22386 14 2 13.7761 2 13.5V6.5Z"
        stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconGroups() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="6" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1.5 13.5C1.5 11.0147 3.51472 9 6 9C8.48528 9 10.5 11.0147 10.5 13.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="11.5" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M13 9.5C13.9282 10.0359 14.5 11.0491 14.5 12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
function IconAssignments() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="1.5" width="10" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5.5 5.5H10.5M5.5 8H10.5M5.5 10.5H8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
function IconToolkit() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9" y="1.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="1.5" y="9" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <path d="M11.75 9V14.5M9 11.75H14.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
function IconLibrary() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 2.5V13.5M6 2.5V13.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M6 3L13.1056 5.05279C13.3526 5.12361 13.5 5.35254 13.5 5.60948V12.3905C13.5 12.7164 13.1875 12.9398 12.8944 12.8278L6 10.5V3Z"
        stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}
function IconSettings() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 1.5V3M8 13V14.5M1.5 8H3M13 8H14.5M3.22183 3.22183L4.28249 4.28249M11.7175 11.7175L12.7782 12.7782M3.22183 12.7782L4.28249 11.7175M11.7175 4.28249L12.7782 3.22183"
        stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 3V13M3 8H13" stroke="#E8500A" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function VedaLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#E8500A" />
      <path d="M9 10L14 22L16 17L18 22L23 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const navItems = [
  { label: 'Home',                 href: '/assignments',          Icon: IconHome        },
  { label: 'My Groups',            href: '/assignments/groups',   Icon: IconGroups      },
  { label: 'Assignments',          href: '/assignments',          Icon: IconAssignments },
  { label: "AI Teacher's Toolkit", href: '/assignments/toolkit',  Icon: IconToolkit     },
  { label: 'My Library',           href: '/assignments/library',  Icon: IconLibrary     },
];

export default function Sidebar() {
  const pathname = usePathname();
  const assignments = useAssignmentStore((s) => s.assignments);
  const { user } = useAuthStore();
  
  const [optimisticActive, setOptimisticActive] = useState<string | null>(null);

  useEffect(() => {
    setOptimisticActive(null);
  }, [pathname]);

  return (
    <aside className="sidebar">

      <div style={{ display: 'flex', flexDirection: 'column' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
          <img 
            src="/Gemini_Generated_Image_gs6b88gs6b88gs6b.png" 
            alt="VedaAI Logo" 
            style={{ height: '40px', width: 'auto', objectFit: 'contain', borderRadius: '8px' }} 
          />
          <span style={{
            fontFamily: 'var(--font-primary)',
            fontSize: '28px',
            fontWeight: '800',
            color: '#181818',
            letterSpacing: '-0.05em',
            transform: 'translateY(-2px)',
          }}>
            VedaAI
          </span>
        </div>

        <Link href="/assignments/create" className="btn-sidebar-cta" style={{ marginBottom: '32px' }}>
          <IconPlus />
          <span>Create Assignment</span>
        </Link>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map(({ label, href, Icon }) => {
            const active =
              label === 'Home'                 ? pathname === '/assignments'
              : label === 'Assignments'        ? pathname.includes('/create') || pathname.includes('/view')
              : label === 'My Groups'          ? pathname.includes('/groups')
              : label === "AI Teacher's Toolkit" ? pathname.includes('/toolkit')
              : label === 'My Library'         ? pathname.includes('/library')
              : false;

            const finalActive = optimisticActive === label || (!optimisticActive && active);

            return (
              <Link
                key={label}
                href={href}
                className={`nav-item${finalActive ? ' active' : ''}`}
                onClick={() => setOptimisticActive(label)}
              >
                <Icon />
                <span style={{ flex: 1 }}>{label}</span>
                {label === 'Assignments' && assignments.length > 0 && (
                  <span style={{
                    background: '#E8500A',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: '600',
                    borderRadius: '9999px',
                    padding: '1px 7px',
                    minWidth: '20px',
                    textAlign: 'center',
                  }}>
                    {assignments.length}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>

        <Link 
          href="/assignments/settings" 
          className={`nav-item${(optimisticActive === 'Settings' || (!optimisticActive && pathname.includes('/settings'))) ? ' active' : ''}`}
          onClick={() => setOptimisticActive('Settings')}
        >
          <IconSettings />
          <span>Settings</span>
        </Link>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 12px',
          borderRadius: '12px',
          background: '#F9F9F9',
          border: '1px solid #F0F0F0',
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '9999px',
            background: '#F3E8D8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0,
            color: '#C9956B',
            fontWeight: '600',
            fontSize: '16px'
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'T'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
            <span style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#181818',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {user?.schoolName || 'Delhi Public School'}
            </span>
            <span style={{
              fontSize: '12px',
              color: '#6B7280',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {user?.city || 'Bokaro Steel City'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}