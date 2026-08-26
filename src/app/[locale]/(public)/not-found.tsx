import React from 'react';
import { Link } from '@/i18n/navigation';
import { Compass, Home, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        textAlign: 'center',
      }}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: '560px',
          width: '100%',
          padding: '50px 30px',
        }}
      >
        <div
          style={{
            fontSize: '5rem',
            fontWeight: 900,
            fontFamily: 'var(--font-heading)',
            color: 'var(--primary-ocean)',
            lineHeight: 1,
            marginBottom: '10px',
          }}
        >
          404
        </div>

        <div className="section-badge" style={{ display: 'inline-flex', marginBottom: '16px' }}>
          <Compass size={14} />
          <span>HALAMAN TIDAK DITEMUKAN</span>
        </div>

        <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-deep)', marginBottom: '12px' }}>
          Tersesat di Kepulauan Gili?
        </h2>

        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '30px' }}>
          Halaman atau paket snorkeling yang Anda cari tidak ditemukan atau telah dipindahkan. Mari kembali ke beranda untuk menjelajahi spot terbaik kami.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-primary">
            <Home size={16} />
            <span>Kembali ke Beranda</span>
          </Link>
          <Link href="/paket" className="btn btn-secondary">
            <Sparkles size={16} />
            <span>Lihat Paket Trip</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
