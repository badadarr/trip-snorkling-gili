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
          <span>PAGE NOT FOUND</span>
        </div>

        <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-deep)', marginBottom: '12px' }}>
          Lost in the Gili Islands?
        </h2>

        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '30px' }}>
          The page or snorkeling tour you are looking for does not exist or has been relocated. Let's return to the home page to explore our premier spots.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-primary">
            <Home size={16} />
            <span>Back to Home</span>
          </Link>
          <Link href="/paket" className="btn btn-secondary">
            <Sparkles size={16} />
            <span>View Tour Packages</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
