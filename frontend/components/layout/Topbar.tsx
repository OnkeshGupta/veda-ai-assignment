'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useAssignmentStore } from '@/store/assignmentStore';

function IconGrid() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="1" y="1" width="5.5" height="5.5" rx="1" stroke="#9CA3AF" strokeWidth="1.2" />
      <rect x="8.5" y="1" width="5.5" height="5.5" rx="1" stroke="#9CA3AF" strokeWidth="1.2" />
      <rect x="1" y="8.5" width="5.5" height="5.5" rx="1" stroke="#9CA3AF" strokeWidth="1.2" />
      <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1" stroke="#9CA3AF" strokeWidth="1.2" />
    </svg>
  );
}
function IconBack() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 3L5 8L10 13" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 2C9 2 5 4 5 9V13L3 14V15H15V14L13 13V9C13 4 9 2 9 2Z"
        stroke="#6B7280" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 15.5C7.5 16.3284 8.17157 17 9 17C9.82843 17 10.5 16.3284 10.5 15.5"
        stroke="#6B7280" strokeWidth="1.3" />
    </svg>
  );
}
function IconChevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#6B7280" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconExit() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 13.5H3.5C2.67157 13.5 2 12.8284 2 12V4C2 3.17157 2.67157 2.5 3.5 2.5H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10.5 11.5L14 8L10.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 8H5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function getBreadcrumb(pathname: string): string {
  if (pathname.includes('/create')) return 'Create Assignment';
  if (pathname.includes('/view')) return 'View Assignment';
  if (pathname === '/assignments') return 'Assignment';
  return 'Assignment';
}

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { assignments } = useAssignmentStore();
  const label = getBreadcrumb(pathname);
  const showBack = pathname !== '/assignments';

  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [allRead, setAllRead] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'T';

  return (
    <header className="topbar">
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {showBack && (
          <button style={{
            width: '28px', height: '28px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            borderRadius: '8px', border: 'none', background: 'transparent',
            cursor: 'pointer',
          }} onClick={() => router.back()}>
            <IconBack />
          </button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <IconGrid />
          <span style={{
            fontSize: '14px',
            color: '#6B7280',
            fontFamily: 'var(--font-primary)',
            fontWeight: '400',
          }}>
            {label}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

        <div style={{ position: 'relative' }} ref={notifRef}>
          <button style={{
            position: 'relative', width: '34px', height: '34px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '9999px', border: 'none', background: 'transparent',
            cursor: 'pointer',
          }} onClick={() => setShowNotifs(!showNotifs)}>
            <IconBell />
            {!allRead && assignments.length > 0 && (
              <span style={{
                position: 'absolute', top: '6px', right: '7px',
                width: '7px', height: '7px',
                borderRadius: '9999px', background: '#EF4444',
                border: '1.5px solid white',
              }} />
            )}
          </button>

          {showNotifs && (
            <div className="animate-fade-in" style={{
              position: 'absolute', right: '0', top: '48px',
              background: '#FFFFFF', border: '1px solid #F0F0F0',
              borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
              width: '320px', zIndex: 200, fontFamily: 'var(--font-primary)'
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px 16px 12px'
              }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#181818' }}>Notifications</span>
                <button 
                  style={{ fontSize: '12px', color: '#E8500A', background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => setAllRead(true)}
                >
                  Mark all read
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '320px', overflowY: 'auto' }}>
                {assignments.length > 0 ? assignments.map((a) => {
                  const isCompleted = a.status === 'completed';
                  const title = isCompleted ? 'Question paper ready' : 'Assignment processing';
                  const dotColor = allRead ? '#22C55E' : (isCompleted ? '#22C55E' : '#E8500A');
                  const timeString = new Date(a.createdAt).toLocaleDateString() + ' ' + new Date(a.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                  
                  return (
                    <div 
                      key={a._id}
                      style={{ padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer' }} 
                      onClick={() => {
                        setShowNotifs(false);
                        router.push(`/assignments/${a._id}/view`);
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F9F9F9'} 
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ width: '8px', height: '8px', borderRadius: '4px', background: dotColor, marginTop: '6px', flexShrink: 0 }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: '#181818' }}>{title}</span>
                        <span style={{ fontSize: '12px', color: '#6B7280' }}>{a.title}</span>
                        <span style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>{timeString}</span>
                      </div>
                    </div>
                  );
                }) : (
                  <div style={{ padding: '24px 16px', textAlign: 'center', fontSize: '13px', color: '#6B7280' }}>
                    No new notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div style={{ position: 'relative' }} ref={profileRef}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '4px 8px 4px 4px',
            borderRadius: '9999px', border: 'none', background: 'transparent',
            cursor: 'pointer',
          }} onClick={() => setShowProfile(!showProfile)}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '9999px',
              background: '#F3E8D8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', color: '#C9956B', fontSize: '14px', fontWeight: '600'
            }}>
              {initial}
            </div>
            <span style={{
              fontSize: '14px', fontWeight: '500',
              color: '#181818', fontFamily: 'var(--font-primary)',
            }}>
              {user?.name || 'Teacher'}
            </span>
            <IconChevron />
          </button>

          {showProfile && (
            <div className="animate-fade-in" style={{
              position: 'absolute', right: '0', top: '48px',
              background: '#FFFFFF', border: '1px solid #F0F0F0',
              borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
              minWidth: '220px', zIndex: 200, fontFamily: 'var(--font-primary)',
              padding: '8px 0'
            }}>
              
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#181818' }}>{user?.name || 'Teacher'}</span>
                <span style={{ fontSize: '12px', color: '#6B7280' }}>{user?.schoolName || 'Your School'}</span>
                {user?.city && <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{user.city}</span>}
                <div style={{ marginTop: '6px' }}>
                  <span style={{ background: '#F3F4F6', color: '#6B7280', fontSize: '11px', padding: '2px 8px', borderRadius: '9999px', fontWeight: 500 }}>
                    {user?.role || 'Teacher'}
                  </span>
                </div>
              </div>

              <div style={{ height: '1px', background: '#F0F0F0', margin: '4px 0' }} />

              <button 
                onClick={handleLogout}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 16px', background: 'transparent', border: 'none',
                  cursor: 'pointer', color: '#EF4444', fontSize: '14px', fontFamily: 'var(--font-primary)'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#FFF5F5'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <IconExit />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// Need Link for notifications
import Link from 'next/link';