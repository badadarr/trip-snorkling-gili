'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

import { Waves, Menu, X, Calendar, Lock } from 'lucide-react';

export default function Navbar() {
  const t = useTranslations('nav');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.3s ease',
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.94)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: isScrolled ? '1px solid rgba(0, 119, 182, 0.15)' : '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: isScrolled ? '0 4px 20px rgba(0, 50, 100, 0.06)' : 'none',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
        {/* Brand Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--primary-ocean) 0%, var(--primary-turquoise) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 119, 182, 0.3)',
            }}
          >
            <Waves color="#ffffff" size={26} strokeWidth={2.4} />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1.25rem',
                color: 'var(--primary-deep)',
                letterSpacing: '-0.03em',
                display: 'block',
                lineHeight: 1.1,
              }}
            >
              SNORKELING <span style={{ color: 'var(--primary-turquoise)' }}>GILI</span>
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'var(--primary-ocean)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'block',
              }}
            >
              Gili Trawangan • 3 Gili
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '32px' }} className="desktop-nav">
          <Link
            href="/"
            style={{
              fontWeight: 600,
              fontSize: '0.95rem',
              color: 'var(--primary-deep)',
              transition: 'color 0.2s',
            }}
          >
            {t('home')}
          </Link>
          <Link
            href="/paket"
            style={{
              fontWeight: 600,
              fontSize: '0.95rem',
              color: 'var(--primary-deep)',
              transition: 'color 0.2s',
            }}
          >
            {t('packages')}
          </Link>
          <Link
            href="/gallery"
            style={{
              fontWeight: 600,
              fontSize: '0.95rem',
              color: 'var(--primary-deep)',
              transition: 'color 0.2s',
            }}
          >
            {t('gallery')}
          </Link>
          <Link
            href="/tentang"
            style={{
              fontWeight: 600,
              fontSize: '0.95rem',
              color: 'var(--primary-deep)',
              transition: 'color 0.2s',
            }}
          >
            {t('about')}
          </Link>
          <Link
            href="/faq"
            style={{
              fontWeight: 600,
              fontSize: '0.95rem',
              color: 'var(--primary-deep)',
              transition: 'color 0.2s',
            }}
          >
            {t('faq')}
          </Link>
        </nav>

        {/* Right CTA Area */}
        <div style={{ display: 'none', alignItems: 'center', gap: '16px' }} className="desktop-actions">
          <Link href="/booking" className="btn btn-primary btn-sm">
            <Calendar size={15} />
            {t('bookNow')}
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="mobile-toggle-group">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              border: '1px solid var(--border-light)',
              background: '#ffffff',
              cursor: 'pointer',
              color: 'var(--primary-deep)',
            }}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(10, 37, 64, 0.96)',
            backdropFilter: 'blur(20px)',
            padding: '30px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            zIndex: 99,
            overflowY: 'auto',
          }}
        >
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#ffffff',
              padding: '12px 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {t('home')}
          </Link>
          <Link
            href="/paket"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#ffffff',
              padding: '12px 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {t('packages')}
          </Link>
          <Link
            href="/gallery"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#ffffff',
              padding: '12px 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {t('gallery')}
          </Link>
          <Link
            href="/tentang"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#ffffff',
              padding: '12px 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {t('about')}
          </Link>
          <Link
            href="/faq"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#ffffff',
              padding: '12px 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {t('faq')}
          </Link>
          <a
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.6)',
              padding: '12px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Lock size={16} />
            {t('admin')}
          </a>

          <div style={{ marginTop: '20px' }}>
            <Link
              href="/booking"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-primary"
              style={{ width: '100%', padding: '16px', fontSize: '1.05rem' }}
            >
              <Calendar size={18} />
              {t('bookNow')}
            </Link>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-actions {
            display: flex !important;
          }
          .mobile-toggle-group {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
