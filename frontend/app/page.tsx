'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, hydrate } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    hydrate();
    setIsMounted(true);
  }, [hydrate]);

  useEffect(() => {
    if (isMounted) {
      if (isAuthenticated) {
        router.replace('/assignments');
      } else {
        router.replace('/login');
      }
    }
  }, [isMounted, isAuthenticated, router]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #EEEEEE, #DADADA)' }}>
      {/* Optional loading state */}
    </div>
  );
}