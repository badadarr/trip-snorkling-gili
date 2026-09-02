'use client';

import React, { useState, useEffect, useRef } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Settings,
  ShieldCheck,
  CreditCard,
  Phone,
  LogOut,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

export default function AdminHeader() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<{ name?: string; email?: string } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setAdminUser(data.user);
        }
      })
      .catch((e) => console.warn('Could not fetch admin user:', e));
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const adminName = adminUser?.name || 'Admin Renz';
  const initial = adminName.charAt(0).toUpperCase() || 'A';

  return (
    <header
      style={{
        height: '70px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        position: 'relative',
        zIndex: 40,
      }}
    >
      <div>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Panel Manajemen Konten</span>
        <h4 style={{ fontSize: '1.08rem', color: 'var(--primary-deep)', margin: 0, fontWeight: 700 }}>
          Trip Snorkeling Gili Trawangan
        </h4>
      </div>

      {/* Profile Header with Interactive Dropdown */}
      <div ref={dropdownRef} style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: isDropdownOpen ? 'var(--primary-surface)' : 'transparent',
            border: isDropdownOpen ? '1px solid rgba(0, 180, 216, 0.4)' : '1px solid transparent',
            padding: '6px 10px',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary-ocean) 0%, var(--primary-turquoise) 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.95rem',
              boxShadow: '0 2px 6px rgba(0, 180, 216, 0.25)',
            }}
          >
            {initial}
          </div>
          <div style={{ textAlign: 'left', fontSize: '0.85rem' }}>
            <strong style={{ display: 'block', color: 'var(--primary-deep)', lineHeight: 1.2 }}>
              {adminName}
            </strong>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Superadmin</span>
          </div>
          <ChevronDown
            size={16}
            color="var(--text-muted)"
            style={{
              transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '260px',
              background: '#ffffff',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              border: '1px solid var(--border-light)',
              padding: '8px 0',
              zIndex: 50,
              animation: 'fadeIn 0.15s ease',
            }}
          >
            {/* User Details */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary-deep)' }}>
                {adminName}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {adminUser?.email || 'admin@skt.com'}
              </div>
            </div>

            {/* Menu Links */}
            <div style={{ padding: '6px 0' }}>
              <NextLink
                href="/admin/settings?tab=security"
                onClick={() => setIsDropdownOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 16px',
                  fontSize: '0.85rem',
                  color: 'var(--text-main)',
                  textDecoration: 'none',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-surface)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <ShieldCheck size={16} color="var(--primary-ocean)" />
                <span>Pengaturan Akun & Password</span>
              </NextLink>

              <NextLink
                href="/admin/settings?tab=contact"
                onClick={() => setIsDropdownOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 16px',
                  fontSize: '0.85rem',
                  color: 'var(--text-main)',
                  textDecoration: 'none',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-surface)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Phone size={16} color="var(--primary-ocean)" />
                <span>Pengaturan Kontak & Web</span>
              </NextLink>

              <NextLink
                href="/admin/settings?tab=payment"
                onClick={() => setIsDropdownOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 16px',
                  fontSize: '0.85rem',
                  color: 'var(--text-main)',
                  textDecoration: 'none',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-surface)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <CreditCard size={16} color="var(--primary-ocean)" />
                <span>Kelola QRIS & Rekening</span>
              </NextLink>

              <NextLink
                href="/admin/settings"
                onClick={() => setIsDropdownOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 16px',
                  fontSize: '0.85rem',
                  color: 'var(--text-main)',
                  textDecoration: 'none',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-surface)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Settings size={16} color="var(--primary-ocean)" />
                <span>Semua Pengaturan Sistem</span>
              </NextLink>
            </div>

            {/* Bottom Actions */}
            <div style={{ borderTop: '1px solid var(--border-light)', padding: '6px 0 0 0' }}>
              <NextLink
                href="/"
                target="_blank"
                onClick={() => setIsDropdownOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 16px',
                  fontSize: '0.85rem',
                  color: 'var(--primary-ocean)',
                  textDecoration: 'none',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-surface)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <ExternalLink size={16} />
                <span>Lihat Website Live</span>
              </NextLink>

              <button
                type="button"
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 16px',
                  fontSize: '0.85rem',
                  color: '#ef4444',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <LogOut size={16} />
                <span>Keluar (Logout)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
