'use client';

import React from 'react';
import { Sunrise, Sun, Sunset, Clock, Check } from 'lucide-react';

interface SessionTimePickerProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  locale?: string;
}

export default function SessionTimePicker({
  value,
  onChange,
  label,
  locale = 'id',
}: SessionTimePickerProps) {
  const isId = locale === 'id';

  const sessions = [
    {
      id: 'morning',
      title: isId ? 'Sesi Pagi' : 'Morning',
      time: '09:30 WITA',
      icon: <Sunrise size={18} />,
    },
    {
      id: 'afternoon',
      title: isId ? 'Sesi Siang' : 'Afternoon',
      time: '13:00 WITA',
      icon: <Sun size={18} />,
    },
    {
      id: 'sunset',
      title: isId ? 'Sunset Trip' : 'Sunset',
      time: '15:30 WITA',
      icon: <Sunset size={18} />,
    },
    {
      id: 'flexible',
      title: isId ? 'Fleksibel' : 'Flexible',
      time: isId ? 'Bebas' : 'Custom',
      icon: <Clock size={18} />,
    },
  ];

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
                border: isSelected ? '2px solid var(--primary-ocean)' : '1px solid var(--border-light)',
                background: isSelected ? 'var(--primary-surface)' : '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textAlign: 'left',
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
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
