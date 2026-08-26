'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (newLocale: 'id' | 'en') => {
    if (newLocale === locale) return;
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '9999px',
        padding: '3px 4px',
        gap: '2px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '6px', paddingRight: '2px', color: '#ffffff' }}>
        <Globe size={14} />
      </div>

      <button
        type="button"
        onClick={() => handleLanguageChange('id')}
        style={{
          padding: '4px 10px',
          borderRadius: '9999px',
          fontSize: '0.78rem',
          fontWeight: 700,
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          background: locale === 'id' ? '#ffffff' : 'transparent',
          color: locale === 'id' ? 'var(--primary-deep)' : 'rgba(255, 255, 255, 0.85)',
          boxShadow: locale === 'id' ? '0 2px 6px rgba(0, 0, 0, 0.15)' : 'none',
        }}
      >
        ID
      </button>

      <button
        type="button"
        onClick={() => handleLanguageChange('en')}
        style={{
          padding: '4px 10px',
          borderRadius: '9999px',
          fontSize: '0.78rem',
          fontWeight: 700,
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          background: locale === 'en' ? '#ffffff' : 'transparent',
          color: locale === 'en' ? 'var(--primary-deep)' : 'rgba(255, 255, 255, 0.85)',
          boxShadow: locale === 'en' ? '0 2px 6px rgba(0, 0, 0, 0.15)' : 'none',
        }}
      >
        EN
      </button>
    </div>
  );
}
