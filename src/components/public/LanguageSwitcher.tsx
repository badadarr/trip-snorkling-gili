'use client';

import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(0, 119, 182, 0.2)', borderRadius: 'var(--radius-full)', padding: '3px', gap: '3px' }}>
      <button
        type="button"
        onClick={() => setLang('id')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '5px 12px',
          borderRadius: 'var(--radius-full)',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.8rem',
          fontWeight: lang === 'id' ? '700' : '500',
          backgroundColor: lang === 'id' ? 'var(--primary-ocean)' : 'transparent',
          color: lang === 'id' ? '#ffffff' : 'var(--text-main)',
          transition: 'all 0.2s ease',
        }}
      >
        <Globe size={13} />
        ID
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '5px 12px',
          borderRadius: 'var(--radius-full)',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.8rem',
          fontWeight: lang === 'en' ? '700' : '500',
          backgroundColor: lang === 'en' ? 'var(--primary-ocean)' : 'transparent',
          color: lang === 'en' ? '#ffffff' : 'var(--text-main)',
          transition: 'all 0.2s ease',
        }}
      >
        <Globe size={13} />
        EN
      </button>
    </div>
  );
}
