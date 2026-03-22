'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, hydrate } = useAuthStore();
  
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [city, setCity] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    hydrate();
    setIsMounted(true);
  }, [hydrate]);

  useEffect(() => {
    if (isMounted && isAuthenticated) {
      router.push('/assignments');
    }
  }, [isMounted, isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !school) return;
    login(name, school, city);
    router.push('/assignments');
  };

  // Prevent flash of login screen if already authenticated
  if (!isMounted || isAuthenticated) {
    return null;
  }

  return (
    <div className="animate-fade-in" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #EEEEEE, #DADADA)',
      padding: '24px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        padding: '36px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
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

        <h2 style={{
          fontFamily: 'var(--font-primary)',
          fontSize: '18px',
          fontWeight: 600,
          color: '#181818',
          letterSpacing: '-0.02em',
          marginBottom: '8px',
          textAlign: 'center'
        }}>
          Welcome Back
        </h2>
        <p style={{
          fontFamily: 'var(--font-primary)',
          fontSize: '14px',
          color: '#6B7280',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          Sign in to your teacher account
        </p>

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontFamily: 'var(--font-primary)', fontSize: '13px', fontWeight: 500, color: '#374151' }}>
              Teacher Name
            </label>
            <input 
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="form-input"
              style={{ fontFamily: 'var(--font-primary)', width: '100%', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontFamily: 'var(--font-primary)', fontSize: '13px', fontWeight: 500, color: '#374151' }}>
              School Name
            </label>
            <input 
              type="text"
              required
              value={school}
              onChange={e => setSchool(e.target.value)}
              placeholder="e.g. Delhi Public School"
              className="form-input"
              style={{ fontFamily: 'var(--font-primary)', width: '100%', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontFamily: 'var(--font-primary)', fontSize: '13px', fontWeight: 500, color: '#374151' }}>
              City <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(Optional)</span>
            </label>
            <input 
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="e.g. Bokaro Steel City"
              className="form-input"
              style={{ fontFamily: 'var(--font-primary)', width: '100%', outline: 'none' }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px', fontSize: '15px' }}>
            Sign In &rarr;
          </button>
        </form>
      </div>
    </div>
  );
}
