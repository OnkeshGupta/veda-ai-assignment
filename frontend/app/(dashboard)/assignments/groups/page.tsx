'use client';
import { useState } from 'react';

function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 3V13M3 8H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function GroupsPage() {
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const sampleGroups = [
    { id: 1, name: 'Grade 8 - Science', students: 32, subject: 'Science', status: 'Active' },
    { id: 2, name: 'Grade 10 - Mathematics', students: 28, subject: 'Mathematics', status: 'Active' },
    { id: 3, name: 'Grade 6 - English', students: 35, subject: 'English', status: 'Active' },
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              width: '8px', height: '8px', borderRadius: '9999px',
              background: '#22C55E', display: 'inline-block', flexShrink: 0,
            }} className="animate-pulse-dot" />
            <h1 style={{
              fontFamily: 'var(--font-primary)', fontSize: '20px',
              fontWeight: '600', color: '#181818', letterSpacing: '-0.03em',
            }}>
              My Groups
            </h1>
          </div>
          <p style={{
            fontFamily: 'var(--font-primary)', fontSize: '13px',
            color: '#6B7280', marginLeft: '16px',
          }}>
            Manage your classes and student groups
          </p>
        </div>

        <button 
          className="btn-primary" 
          onClick={() => setIsCreateModalOpen(true)}
          style={{ fontSize: '13px', padding: '0 16px', height: '38px', gap: '6px' }}
        >
          <IconPlus />
          Create Group
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {sampleGroups.map(g => (
          <div 
            key={g.id} 
            className="assignment-card" 
            style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
            onClick={() => setSelectedGroup(g)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: '16px', fontWeight: '600', color: '#181818' }}>
                {g.name}
              </h3>
              <span style={{ background: '#DCFCE7', color: '#166534', fontSize: '11px', fontWeight: '500', padding: '2px 8px', borderRadius: '9999px' }}>
                {g.status}
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#6B7280', fontFamily: 'var(--font-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 7C8.65685 7 10 5.65685 10 4C10 2.34315 8.65685 1 7 1C5.34315 1 4 2.34315 4 4C4 5.65685 5.34315 7 7 7Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2.33331 13C2.33331 10.4227 4.42265 8.33333 6.99998 8.33333V8.33333C9.57731 8.33333 11.6666 10.4227 11.6666 13V13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {g.students} Students
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.33331 3.5V11.6667C2.33331 12.311 2.85565 12.8333 3.49998 12.8333H10.5C11.1443 12.8333 11.6666 12.311 11.6666 11.6667V3.5C11.6666 2.85567 11.1443 2.33333 10.5 2.33333H3.49998C2.85565 2.33333 2.33331 2.85567 2.33331 3.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.66669 5.83333H9.33335M4.66669 8.16667H7.00002" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {g.subject}
              </div>
            </div>
            
            <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #F0F0F0' }}>
              <button style={{ background: 'transparent', border: 'none', color: '#181818', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'var(--font-primary)' }}>
                View Group Details &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedGroup && (
        <div 
          onClick={() => setSelectedGroup(null)}
          style={{ 
            position: 'fixed', inset: 0, zIndex: 100, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' 
          }}
        >
          <div 
            className="animate-slide-up" 
            onClick={e => e.stopPropagation()} 
            style={{ 
              width: '100%', maxWidth: '400px', background: '#FFFFFF', 
              borderRadius: '20px', padding: '24px', position: 'relative',
              boxShadow: '0 24px 48px rgba(0,0,0,0.1)' 
            }}
          >
            <button 
              onClick={() => setSelectedGroup(null)} 
              style={{ 
                position: 'absolute', top: '16px', right: '16px', 
                background: 'transparent', border: 'none', 
                cursor: 'pointer', fontSize: '24px', color: '#9CA3AF' 
              }}
            >
              &times;
            </button>
            
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#181818', marginBottom: '8px', fontFamily: 'var(--font-primary)' }}>
              {selectedGroup.name}
            </h2>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
              <span className="badge-easy">{selectedGroup.status}</span>
              <span style={{ fontSize: '11px', fontWeight: '500', color: '#4B5563', padding: '2px 8px', background: '#F3F4F6', borderRadius: '999px' }}>
                {selectedGroup.subject}
              </span>
            </div>
            
            <div style={{ border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px', marginBottom: '8px' }}>
              <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9CA3AF', marginBottom: '16px', fontWeight: '600' }}>
                Group Overview
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#4B5563', fontWeight: '500' }}>Total Students</span>
                  <span style={{ fontSize: '15px', fontWeight: '600', color: '#181818' }}>{selectedGroup.students}</span>
                </div>
                <div style={{ height: '1px', background: '#F0F0F0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#4B5563', fontWeight: '500' }}>Assignments Sent</span>
                  <span style={{ fontSize: '15px', fontWeight: '600', color: '#181818' }}>14</span>
                </div>
                <div style={{ height: '1px', background: '#F0F0F0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#4B5563', fontWeight: '500' }}>Average Class Score</span>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#166534' }}>82%</span>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: '#6B7280', textAlign: 'center', marginTop: '20px', lineHeight: '1.5' }}>
              Detailed student analytics and assignment tracking will be available in the next release.
            </p>
          </div>
        </div>
      )}

      {isCreateModalOpen && (
        <div 
          onClick={() => setIsCreateModalOpen(false)}
          style={{ 
            position: 'fixed', inset: 0, zIndex: 100, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' 
          }}
        >
          <div 
            className="animate-slide-up" 
            onClick={e => e.stopPropagation()} 
            style={{ 
              width: '100%', maxWidth: '400px', background: '#FFFFFF', 
              borderRadius: '20px', padding: '24px', position: 'relative',
              boxShadow: '0 24px 48px rgba(0,0,0,0.1)' 
            }}
          >
            <button 
              onClick={() => setIsCreateModalOpen(false)} 
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '24px', color: '#9CA3AF' }}
            >
              &times;
            </button>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#181818', marginBottom: '16px', fontFamily: 'var(--font-primary)' }}>
              Create New Group
            </h2>
            <p style={{ fontSize: '14px', color: '#4B5563', marginBottom: '24px', lineHeight: '1.5' }}>
              The group creation and student roster importing tools will be fully available in the upcoming release. Stay tuned!
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="btn-primary"
                style={{ height: '40px', padding: '0 20px', fontSize: '14px' }}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
