'use client';

import React from 'react';

interface AdminLanguageTabsProps {
  activeLang: 'id' | 'en';
  onChange: (lang: 'id' | 'en') => void;
  hasErrorId?: boolean;
  hasErrorEn?: boolean;
  style?: React.CSSProperties;
}

export default function AdminLanguageTabs({
  activeLang,
  onChange,
  hasErrorId = false,
  hasErrorEn = false,
  style,
}: AdminLanguageTabsProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        background: 'rgb(241, 245, 249)',
        padding: '4px',
        borderRadius: '8px',
        ...style,
      }}
    >
      <button
        type="button"
        onClick={() => onChange('id')}
        style={{
          flex: 1,
          padding: '8px 12px',
          borderRadius: '6px',
          border: 'none',
          background: activeLang === 'id' ? '#ffffff' : 'transparent',
          color: activeLang === 'id' ? 'var(--primary-deep)' : 'var(--text-muted)',
          fontWeight: activeLang === 'id' ? 700 : 500,
          fontSize: '0.85rem',
          cursor: 'pointer',
          boxShadow: activeLang === 'id' ? 'rgba(0, 0, 0, 0.1) 0px 1px 3px' : 'none',
          transition: '0.15s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
        }}
      >
        <span>Bahasa Indonesia (ID)</span>
        {hasErrorId && (
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              display: 'inline-block',
            }}
          />
        )}
      </button>

      <button
        type="button"
        onClick={() => onChange('en')}
        style={{
          flex: 1,
          padding: '8px 12px',
          borderRadius: '6px',
          border: 'none',
          background: activeLang === 'en' ? '#ffffff' : 'transparent',
          color: activeLang === 'en' ? 'var(--primary-deep)' : 'var(--text-muted)',
          fontWeight: activeLang === 'en' ? 700 : 500,
          fontSize: '0.85rem',
          cursor: 'pointer',
          boxShadow: activeLang === 'en' ? 'rgba(0, 0, 0, 0.1) 0px 1px 3px' : 'none',
          transition: '0.15s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
        }}
      >
        <span>English (EN)</span>
        {hasErrorEn && (
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              display: 'inline-block',
            }}
          />
        )}
      </button>
    </div>
  );
}
