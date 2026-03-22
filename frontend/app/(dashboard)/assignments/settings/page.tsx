'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

function Toggle({ label, defaultOn = true }: { label: string, defaultOn?: boolean }) {
  const [isOn, setIsOn] = useState(defaultOn);
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
      <span style={{ fontSize: '14px', color: '#374151', fontFamily: 'var(--font-primary)' }}>{label}</span>
      <button 
        onClick={() => setIsOn(!isOn)}
        style={{
          width: '44px', height: '24px', borderRadius: '9999px',
          background: isOn ? '#22C55E' : '#E5E7EB',
          position: 'relative', border: 'none', cursor: 'pointer',
          transition: 'background 0.2s'
        }}
      >
        <span style={{
          position: 'absolute', top: '2px', left: isOn ? '22px' : '2px',
          width: '20px', height: '20px', borderRadius: '50%',
          background: '#FFFFFF', transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, login, logout, hydrate } = useAuthStore();
  
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [city, setCity] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    hydrate();
    setMounted(true);
  }, [hydrate]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setSchool(user.schoolName);
      setCity(user.city || '');
    }
  }, [user]);

  if (!mounted) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    login(name, school, city);
    alert('Profile updated successfully!');
  };

  const handleSignOut = () => {
    logout();
    router.replace('/login');
  };

  const initial = name ? name.charAt(0).toUpperCase() : 'T';

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px', maxWidth: '640px' }}>
      
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
            Settings
          </h1>
        </div>
      </div>

      {/* Section 1: Profile Settings */}
      <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '28px', border: '1px solid #F0F0F0', marginBottom: '16px' }}>
        <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: '16px', fontWeight: '600', color: '#181818', marginBottom: '24px' }}>
          Profile
        </h2>
        
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: '#F3E8D8', color: '#C9956B',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', fontWeight: '600', fontFamily: 'var(--font-primary)',
            flexShrink: 0
          }}>
            {initial}
          </div>
          
          <form onSubmit={handleSave} style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontFamily: 'var(--font-primary)', fontSize: '13px', fontWeight: 500, color: '#374151' }}>Teacher Name</label>
              <input type="text" className="form-input" required value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', fontFamily: 'var(--font-primary)', border: '1px solid #E5E7EB', borderRadius: '12px', height: '44px', padding: '0 14px', outline: 'none' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontFamily: 'var(--font-primary)', fontSize: '13px', fontWeight: 500, color: '#374151' }}>School Name</label>
              <input type="text" className="form-input" required value={school} onChange={e => setSchool(e.target.value)} style={{ width: '100%', fontFamily: 'var(--font-primary)', border: '1px solid #E5E7EB', borderRadius: '12px', height: '44px', padding: '0 14px', outline: 'none' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontFamily: 'var(--font-primary)', fontSize: '13px', fontWeight: 500, color: '#374151' }}>City</label>
              <input type="text" className="form-input" value={city} onChange={e => setCity(e.target.value)} style={{ width: '100%', fontFamily: 'var(--font-primary)', border: '1px solid #E5E7EB', borderRadius: '12px', height: '44px', padding: '0 14px', outline: 'none' }} />
            </div>

            <div style={{ marginTop: '8px' }}>
              <button type="submit" className="btn-primary" style={{ padding: '0 24px', height: '40px', fontSize: '14px' }}>Save Changes</button>
            </div>
          </form>
        </div>
      </div>

      {/* Section 2: App Preferences */}
      <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '28px', border: '1px solid #F0F0F0', marginBottom: '16px' }}>
        <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: '16px', fontWeight: '600', color: '#181818', marginBottom: '24px' }}>
          Preferences
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Toggle label="Email notifications" defaultOn={true} />
          <Toggle label="Auto-save drafts" defaultOn={true} />
          <Toggle label="Show difficulty badges" defaultOn={true} />
        </div>
      </div>

      {/* Section 3: Danger Zone */}
      <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '28px', border: '1px solid #F0F0F0' }}>
        <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: '16px', fontWeight: '600', color: '#181818', marginBottom: '12px' }}>
          Account
        </h2>
        <p style={{ fontFamily: 'var(--font-primary)', fontSize: '13px', color: '#6B7280', marginBottom: '20px' }}>
          Sign out from your account on this device
        </p>
        
        <button 
          onClick={handleSignOut}
          className="btn-outline" 
          style={{ borderColor: '#EF4444', color: '#EF4444', height: '40px', padding: '0 20px', fontSize: '14px' }}
        >
          Sign Out
        </button>
      </div>

    </div>
  );
}
