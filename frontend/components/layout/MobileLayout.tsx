'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

function IconBack() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M12.5 15L7.5 10L12.5 5" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconHome({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 8.5L10 3L17 8.5V17C17 17.5523 16.5523 18 16 18H13V13H7V18H4C3.44772 18 3 17.5523 3 17V8.5Z"
        stroke={active ? '#FFFFFF' : 'rgba(255,255,255,0.5)'}
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        fill={active ? 'rgba(255,255,255,0.2)' : 'none'}
      />
    </svg>
  );
}

function IconGroups({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="8" cy="7" r="3" stroke={active ? '#FFFFFF' : 'rgba(255,255,255,0.5)'} strokeWidth="1.5" />
      <path d="M2 17C2 13.6863 4.68629 11 8 11C11.3137 11 14 13.6863 14 17"
        stroke={active ? '#FFFFFF' : 'rgba(255,255,255,0.5)'} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="15" cy="7" r="2.5" stroke={active ? '#FFFFFF' : 'rgba(255,255,255,0.5)'} strokeWidth="1.3" />
      <path d="M17 11.5C18.1 12.1 18.8 13.3 18.8 15"
        stroke={active ? '#FFFFFF' : 'rgba(255,255,255,0.5)'} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function IconLibrary({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 3V17M7 3V17" stroke={active ? '#FFFFFF' : 'rgba(255,255,255,0.5)'} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 4L16.5 6.5C16.8 6.6 17 6.86 17 7.17V15.5C17 15.9 16.6 16.2 16.2 16.06L7 13V4Z"
        stroke={active ? '#FFFFFF' : 'rgba(255,255,255,0.5)'} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function IconToolkit({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 3L11.8 8.2L17 10L11.8 11.8L10 17L8.2 11.8L3 10L8.2 8.2L10 3Z"
        stroke={active ? '#FFFFFF' : 'rgba(255,255,255,0.5)'}
        strokeWidth="1.5" strokeLinejoin="round"
        fill={active ? 'rgba(255,255,255,0.2)' : 'none'}
      />
    </svg>
  );
}

function IconAssignments({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="4" y="2" width="12" height="16" rx="2" stroke={active ? '#FFFFFF' : 'rgba(255,255,255,0.5)'} strokeWidth="1.5" />
      <path d="M7 6H13M7 10H13M7 14H10" stroke={active ? '#FFFFFF' : 'rgba(255,255,255,0.5)'} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const tabs = [
  { label: 'Home', href: '/assignments', Icon: IconHome },
  { label: 'Assignments', href: '/assignments/groups', Icon: IconAssignments },
  { label: 'Library', href: '/assignments/library', Icon: IconLibrary },
  { label: 'AI Toolkit', href: '/assignments/toolkit', Icon: IconToolkit },
];

function IconBellMobile() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 3C10 3 7 5 7 9V13L5 14V15H15V14L13 13V9C13 5 10 3 10 3Z"
        stroke="#181818" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 15.5C8.5 16.3 9.17 17 10 17C10.83 17 11.5 16.3 11.5 15.5"
        stroke="#181818" strokeWidth="1.3" />
    </svg>
  );
}

function IconHamburger() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 5H17M3 10H17M3 15H17" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

interface Props { children: React.ReactNode; }

export default function MobileLayout({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [optimisticActive, setOptimisticActive] = useState<string | null>(null);

  useEffect(() => {
    setOptimisticActive(null);
  }, [pathname]);

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: '#E5E7EB',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>

      {/* Floating Pill Topbar */}
      <header style={{
        position: 'fixed',
        top: '16px',
        left: '16px',
        right: '16px',
        height: '60px',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px 0 20px',
        background: '#FFFFFF',
        borderRadius: '30px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <img 
            src="/Gemini_Generated_Image_gs6b88gs6b88gs6b.png" 
            alt="VedaAI Logo" 
            style={{ height: '32px', width: 'auto', objectFit: 'contain', borderRadius: '8px' }} 
          />
          <span style={{
            fontFamily: 'var(--font-primary)', fontSize: '20px',
            fontWeight: '800', color: '#181818', letterSpacing: '-0.05em',
            transform: 'translateY(-1px)'
          }}>
            VedaAI
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={{
            position: 'relative', width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', background: 'transparent', cursor: 'pointer',
          }}>
            <IconBellMobile />
            <span style={{
              position: 'absolute', top: '5px', right: '5px',
              width: '7px', height: '7px', borderRadius: '9999px',
              background: '#EF4444', border: '1.5px solid #FFFFFF',
            }} />
          </button>

          <div style={{
            width: '30px', height: '30px', borderRadius: '9999px',
            background: '#F3E8D8', overflow: 'hidden', color: '#C9956B',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: 'bold'
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'T'}
          </div>

          <button style={{
            width: '32px', height: '32px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            border: 'none', background: 'transparent', cursor: 'pointer',
          }} onClick={() => setDrawerOpen(true)}>
            <IconHamburger />
          </button>
        </div>
      </header>
      
      {/* Drawer Overlay */}
      {drawerOpen && (
        <div 
          onClick={() => setDrawerOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            zIndex: 99, transition: 'opacity 0.3s'
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed', left: 0, top: 0, bottom: 0, width: '280px',
        background: '#FFFFFF', zIndex: 100,
        transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', flexDirection: 'column',
        boxShadow: drawerOpen ? '4px 0 24px rgba(0,0,0,0.1)' : 'none'
      }}>
        <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <img 
            src="/Gemini_Generated_Image_gs6b88gs6b88gs6b.png" 
            alt="VedaAI Logo" 
            style={{ height: '36px', width: 'auto', objectFit: 'contain', borderRadius: '8px' }} 
          />
          <span style={{ 
            fontFamily: 'var(--font-primary)', fontSize: '24px', 
            fontWeight: '800', color: '#181818', letterSpacing: '-0.05em',
            transform: 'translateY(-2px)'
          }}>
            VedaAI
          </span>
          </div>
          <button onClick={() => setDrawerOpen(false)} style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6B7280' }}>&times;</button>
        </div>

        <nav style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          <Link href="/assignments" onClick={() => setDrawerOpen(false)} className={`nav-item${pathname === '/assignments' ? ' active' : ''}`}>
            Home
          </Link>
          <Link href="/assignments/groups" onClick={() => setDrawerOpen(false)} className={`nav-item${pathname.includes('/groups') ? ' active' : ''}`}>
            Assignments
          </Link>
          <Link href="/assignments" onClick={() => setDrawerOpen(false)} className={`nav-item${pathname.includes('/create') || pathname.includes('/view') ? ' active' : ''}`}>
            Dashboard View
          </Link>
          <Link href="/assignments/toolkit" onClick={() => setDrawerOpen(false)} className={`nav-item${pathname.includes('/toolkit') ? ' active' : ''}`}>
            AI Teacher's Toolkit
          </Link>
          <Link href="/assignments/library" onClick={() => setDrawerOpen(false)} className={`nav-item${pathname.includes('/library') ? ' active' : ''}`}>
            My Library
          </Link>
          <Link href="/assignments/settings" onClick={() => setDrawerOpen(false)} className={`nav-item${pathname.includes('/settings') ? ' active' : ''}`}>
            Settings
          </Link>
        </nav>

        <div style={{ padding: '20px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
            borderRadius: '12px', background: '#F9F9F9', border: '1px solid #F0F0F0'
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%', background: '#F3E8D8',
              color: '#C9956B', fontSize: '16px', fontWeight: '600',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'T'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#181818', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.schoolName || 'Delhi Public School'}
              </span>
              <span style={{ fontSize: '12px', color: '#6B7280', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.city || 'Bokaro'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <main style={{
        marginTop: '90px',
        marginBottom: '100px',
        padding: '0 16px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {pathname !== '/assignments' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <button 
              onClick={() => router.back()}
              style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#E5E7EB', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
               <IconBack />
            </button>
            <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#181818', fontFamily: 'var(--font-primary)', transform: 'translateY(1px)' }}>
              {pathname.includes('/create') ? 'Create Assignment' : pathname.includes('/groups') ? 'Assignments' : pathname.includes('/toolkit') ? "AI Teacher's Toolkit" : pathname.includes('/library') ? 'My Library' : 'Assignments'}
            </h1>
          </div>
        )}
        {children}
      </main>

      {/* Floating Action Button (+ Create) */}
      {(pathname === '/assignments' || pathname.includes('/groups')) && (
        <Link href="/assignments/create" style={{
          position: 'fixed',
          bottom: '100px',
          right: '24px',
          zIndex: 40,
        }}>
          <button style={{
            width: '48px', height: '48px',
            borderRadius: '50%',
            background: '#FFFFFF',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 4V16M4 10H16" stroke="#E8500A" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </Link>
      )}

      {/* Floating Pill Bottom Nav */}
      <div style={{
        position: 'fixed',
        bottom: '16px',
        left: '16px',
        right: '16px',
        height: '64px',
        zIndex: 50,
        background: '#181818',
        borderRadius: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 8px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      }}>
        {tabs.map(({ label, href, Icon }) => {
          const active = pathname === href || (href === '/assignments' && pathname === href) || (href !== '/assignments' && pathname.startsWith(href));
          const finalActive = optimisticActive === label || (!optimisticActive && active);

          return (
            <Link key={label} href={href} 
              onClick={() => setOptimisticActive(label)}
              style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '4px',
                padding: '8px 16px',
                borderRadius: '24px',
                background: finalActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                textDecoration: 'none',
                transition: 'background 150ms',
              }}>
              <Icon active={finalActive} />
              <span style={{
                fontFamily: 'var(--font-primary)',
                fontSize: '10px',
                fontWeight: finalActive ? '500' : '400',
                color: finalActive ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
              }}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}