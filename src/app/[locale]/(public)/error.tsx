'use client';

import React, { useEffect } from 'react';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Public page error:', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
      }}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: '560px',
          width: '100%',
          padding: '40px 30px',
          textAlign: 'center',
          border: '1px solid rgba(239, 71, 111, 0.3)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(239, 71, 111, 0.12)',
            color: 'var(--accent-coral)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <AlertTriangle size={32} />
        </div>

        <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-deep)', marginBottom: '12px' }}>
          Terjadi Kendala Memuat Data
        </h2>

        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '28px' }}>
          Maaf, terjadi kesalahan teknis saat mengambil data dari server. Jangan khawatir, Anda dapat mencoba memuat ulang halaman atau kembali ke beranda.
        </p>

        {error?.message && process.env.NODE_ENV === 'development' && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#ef476f',
              fontSize: '0.8rem',
              textAlign: 'left',
              fontFamily: 'monospace',
              marginBottom: '24px',
              overflowX: 'auto',
            }}
          >
            {error.message}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => reset()}
            className="btn btn-primary"
          >
            <RefreshCw size={16} />
            <span>Coba Lagi</span>
          </button>

          <Link href="/" className="btn btn-secondary">
            <Home size={16} />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
