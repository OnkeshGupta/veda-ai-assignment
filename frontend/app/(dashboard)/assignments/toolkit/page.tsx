'use client';

import Link from 'next/link';

export default function ToolkitPage() {
  const tools = [
    {
      id: 1, emoji: '📝', name: 'Question Paper Generator',
      desc: 'Generate structured question papers from any topic using AI',
      active: true, link: '/assignments/create', btnText: 'Create Now'
    },
    {
      id: 2, emoji: '📊', name: 'Auto Grader',
      desc: 'Automatically grade student submissions with AI feedback',
      active: false, link: '#', btnText: 'Coming Soon'
    },
    {
      id: 3, emoji: '🎯', name: 'Rubric Builder',
      desc: 'Build detailed marking rubrics for any assignment type',
      active: false, link: '#', btnText: 'Coming Soon'
    },
    {
      id: 4, emoji: '📚', name: 'Study Material Generator',
      desc: 'Generate comprehensive study notes and summaries',
      active: false, link: '#', btnText: 'Coming Soon'
    },
    {
      id: 5, emoji: '🔍', name: 'Plagiarism Detector',
      desc: 'Check student submissions for originality',
      active: false, link: '#', btnText: 'Coming Soon'
    },
    {
      id: 6, emoji: '💬', name: 'Student Feedback Assistant',
      desc: 'Generate personalized feedback for each student',
      active: false, link: '#', btnText: 'Coming Soon'
    }
  ];

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
            AI Teacher's Toolkit
          </h1>
        </div>
        <p style={{
          fontFamily: 'var(--font-primary)', fontSize: '13px',
          color: '#6B7280', marginLeft: '16px',
        }}>
          AI-powered tools to enhance your teaching
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {tools.map(tool => (
          <div key={tool.id} style={{
            background: '#FFFFFF', borderRadius: '16px', border: '1px solid #F0F0F0',
            padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px',
            position: 'relative', opacity: tool.active ? 1 : 0.7,
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            {!tool.active && (
              <span style={{
                position: 'absolute', top: '20px', right: '20px',
                background: '#F3F4F6', color: '#9CA3AF', fontSize: '10px',
                fontWeight: '600', padding: '2px 8px', borderRadius: '9999px',
                fontFamily: 'var(--font-primary)'
              }}>
                Coming Soon
              </span>
            )}
            
            <div style={{ fontSize: '32px', marginBottom: '4px' }}>{tool.emoji}</div>
            
            <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: '16px', fontWeight: '600', color: '#181818' }}>
              {tool.name}
            </h3>
            
            <p style={{ fontFamily: 'var(--font-primary)', fontSize: '13px', color: '#6B7280', lineHeight: '1.5', minHeight: '40px' }}>
              {tool.desc}
            </p>
            
            <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
              {tool.active ? (
                <Link href={tool.link}>
                  <button className="btn-outline" style={{ height: '36px', padding: '0 16px', fontSize: '13px' }}>
                    {tool.btnText}
                  </button>
                </Link>
              ) : (
                <button className="btn-outline" disabled style={{ height: '36px', padding: '0 16px', fontSize: '13px', cursor: 'not-allowed', color: '#9CA3AF', borderColor: '#E5E7EB' }}>
                  {tool.btnText}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
