'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(pathname !== '/admin/login');

  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsChecking(false);
      return;
    }

    const verifySession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setIsChecking(false);
            return;
          }
        }
        // Not authenticated on this domain -> redirect to login
        router.push('/admin/login');
      } catch (err) {
        router.push('/admin/login');
      } finally {
        setIsChecking(false);
      }
    };

    verifySession();
  }, [pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isChecking) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 size={36} color="var(--primary-ocean)" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Memverifikasi sesi admin...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
