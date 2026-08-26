'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Waves, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import NextLink from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@snorkelinggilitrawangan.com');
  const [password, setPassword] = useState('AdminSnorkeling2026!');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login gagal');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Email atau password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'var(--primary-deep)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 999,
        background: 'linear-gradient(135deg, #0a192f 0%, #0d3b66 50%, #0077b6 100%)',
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '40px 32px',
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--primary-ocean) 0%, var(--primary-turquoise) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              boxShadow: '0 8px 20px rgba(0, 119, 182, 0.3)',
            }}
          >
            <Waves color="#ffffff" size={28} strokeWidth={2.4} />
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-deep)', marginBottom: '6px' }}>
            Admin Portal
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Trip Snorkeling Gili Trawangan
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              background: '#fee2e2',
              color: '#b91c1c',
              marginBottom: '20px',
              fontSize: '0.88rem',
            }}
          >
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Admin</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '10px' }}
          >
            <Lock size={18} />
            <span>{loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}</span>
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
          <NextLink href="/" style={{ fontSize: '0.85rem', color: 'var(--primary-ocean)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span>← Kembali ke Website Publik</span>
          </NextLink>
        </div>
      </div>
    </div>
  );
}
