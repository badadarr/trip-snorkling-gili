'use client';

import React from 'react';
import { Sunrise, Sun, Sunset, Clock, Check } from 'lucide-react';

interface SessionTimePickerProps {
  value: string;
  onChange: (val: string) => void;
  label?: React.ReactNode;
  locale?: string;
  error?: string;
  packageType?: 'public' | 'private';
}

export default function SessionTimePicker({
  value,
  onChange,
  label,
  error,
  packageType,
}: SessionTimePickerProps) {
  const allSessions = [
    {
      id: 'morning',
      title: 'Morning Session',
      time: '09:30 AM WITA',
      icon: <Sunrise size={18} />,
      showFor: ['public', 'private'],
    },
    {
      id: 'afternoon',
      title: 'Afternoon Session',
      time: '01:00 PM WITA',
      icon: <Sun size={18} />,
      showFor: ['public', 'private'],
    },
    {
      id: 'sunset',
      title: 'Sunset Tour',
      time: '03:30 PM WITA',
      icon: <Sunset size={18} />,
      showFor: ['private'],
    },
    {
      id: 'flexible',
      title: 'Flexible / Custom',
      time: 'Custom Time',
      icon: <Clock size={18} />,
      showFor: ['private'],
    },
  ];

  // Filter sessions based on package type
  const sessions = packageType
    ? allSessions.filter((s) => s.showFor.includes(packageType))
    : allSessions;

  // If current value is not in filtered sessions, auto-select first available
  React.useEffect(() => {
    if (packageType && value) {
      const isValid = sessions.some((s) => s.id === value);
      if (!isValid && sessions.length > 0) {
        onChange(sessions[0].id);
      }
    }
  }, [packageType]);

  return (
    <div>
      {label && <label className="form-label">{label}</label>}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '8px',
        }}
      >
        {sessions.map((sess) => {
          const isSelected = value === sess.id;
          return (
            <button
              key={sess.id}
              type="button"
              onClick={() => onChange(sess.id)}
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                border: isSelected
                  ? '2px solid var(--primary-ocean)'
                  : error
                    ? '1.5px solid #ef4444'
                    : '1px solid var(--border-light)',
                background: isSelected ? 'var(--primary-surface)' : error ? '#fffbfa' : '#ffffff',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  color: isSelected ? 'var(--primary-ocean)' : 'var(--text-muted)',
                  flexShrink: 0,
                }}
              >
                {isSelected ? <Check size={18} strokeWidth={2.5} /> : sess.icon}
              </div>

              <div>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: isSelected ? 'var(--primary-ocean)' : 'var(--primary-deep)',
                  }}
                >
                  {sess.title}
                </span>
                {/* Hide specific time for public packages, only show for private */}
                {(packageType !== 'public') && (
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      fontWeight: 500,
                    }}
                  >
                    {sess.time}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      {error && (
        <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block', fontWeight: 500 }}>
          {error}
        </span>
      )}
    </div>
  );
}
