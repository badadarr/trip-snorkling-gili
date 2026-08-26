import React from 'react';
import Link from 'next/link';
import { Home, Compass } from 'lucide-react';

export default function RootNotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: '#f8fafc',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '480px',
          width: '100%',
          padding: '40px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '4rem', color: '#0077b6', margin: '0 0 10px 0', fontWeight: 800 }}>404</h1>
        <h2 style={{ fontSize: '1.4rem', color: '#0a2540', marginBottom: '12px' }}>Halaman Tidak Ditemukan</h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.6 }}>
          Halaman yang Anda tuju tidak tersedia atau tautan sudah kadaluarsa.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            backgroundColor: '#0077b6',
            color: '#ffffff',
            borderRadius: '10px',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          <Home size={18} />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    </div>
  );
}
