'use client';

import React, { useState, useEffect } from 'react';
import { Sunrise, Sun, Sunset, Clock, Check, Hourglass, CalendarClock } from 'lucide-react';

interface SessionTimePickerProps {
  value: string;
  onChange: (val: string) => void;
  label?: React.ReactNode;
  locale?: string;
  error?: string;
  packageType?: 'public' | 'private';
  departureTime?: string;
  onDepartureTimeChange?: (time: string) => void;
  duration?: string;
  onDurationChange?: (dur: string) => void;
}

export default function SessionTimePicker({
  value,
  onChange,
  label,
  error,
  packageType = 'public',
  departureTime = '09:30 AM',
  onDepartureTimeChange,
  duration = '4 - 5 Hours (Standard)',
  onDurationChange,
}: SessionTimePickerProps) {
  const isPrivate = packageType === 'private';

  const publicSessions = [
    {
      id: 'morning',
      title: 'Morning Session',
      timeDesc: 'Fixed Departure',
      icon: <Sunrise size={18} />,
    },
    {
      id: 'afternoon',
      title: 'Afternoon Session',
      timeDesc: 'Fixed Departure',
      icon: <Sun size={18} />,
    },
  ];

  const privateSessions = [
    {
      id: 'morning',
      title: 'Morning Session',
      timeDesc: '08:00 AM - 11:30 AM',
      defaultTime: '09:30 AM',
      presets: ['08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM'],
      icon: <Sunrise size={18} />,
    },
    {
      id: 'afternoon',
      title: 'Afternoon Session',
      timeDesc: '12:30 PM - 03:00 PM',
      defaultTime: '01:30 PM',
      presets: ['12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM'],
      icon: <Sun size={18} />,
    },
    {
      id: 'sunset',
      title: 'Sunset Tour',
      timeDesc: '03:00 PM - 04:30 PM',
      defaultTime: '03:30 PM',
      presets: ['03:00 PM', '03:30 PM', '04:00 PM'],
      icon: <Sunset size={18} />,
    },
    {
      id: 'custom',
      title: 'Custom Departure Time',
      timeDesc: 'Any Time (07:00 - 16:30)',
      defaultTime: '08:30 AM',
      presets: ['07:30 AM', '08:30 AM', '11:00 AM', '02:30 PM', '04:00 PM'],
      icon: <Clock size={18} />,
    },
  ];

  const durationOptions = [
    '2 - 2.5 Hours',
    '3 - 3.5 Hours',
    '4 - 5 Hours (Standard)',
    '6 - 7 Hours (Full Day)',
  ];

  const currentSessionConfig = isPrivate
    ? privateSessions.find((s) => s.id === value) || privateSessions[0]
    : publicSessions.find((s) => s.id === value) || publicSessions[0];

  // Auto ensure valid selection when switching between public and private
  useEffect(() => {
    if (!isPrivate) {
      if (value !== 'morning' && value !== 'afternoon') {
        onChange('morning');
      }
    }
  }, [isPrivate]);

  const handleSessionClick = (sessId: string) => {
    onChange(sessId);
    if (isPrivate && onDepartureTimeChange) {
      const config = privateSessions.find((s) => s.id === sessId);
      if (config) {
        onDepartureTimeChange(config.defaultTime);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 1. Main Session Cards */}
      <div>
        {label && <label className="form-label">{label}</label>}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isPrivate
              ? 'repeat(auto-fit, minmax(135px, 1fr))'
              : 'repeat(2, 1fr)',
            gap: '8px',
          }}
        >
          {(isPrivate ? privateSessions : publicSessions).map((sess) => {
            const isSelected = value === sess.id;
            return (
              <button
                key={sess.id}
                type="button"
                onClick={() => handleSessionClick(sess.id)}
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
                  {isPrivate && (
                    <span
                      style={{
                        display: 'block',
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                        fontWeight: 500,
                        marginTop: '2px',
                      }}
                    >
                      {sess.timeDesc}
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

      {/* 2. PRIVATE ONLY: Duration & Departure Time Configurator */}
      {isPrivate && (
        <div
          style={{
            background: 'var(--primary-surface)',
            border: '1px solid rgba(0, 180, 216, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          {/* Trip Duration */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <label
                style={{
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  color: 'var(--primary-navy)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  margin: 0,
                }}
              >
                <Hourglass size={15} color="var(--primary-ocean)" />
                <span>Trip Duration</span>
              </label>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--primary-ocean)',
                  background: '#ffffff',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(0, 180, 216, 0.3)',
                }}
              >
                {duration}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
              }}
            >
              {durationOptions.map((dur) => {
                const isSelected = duration === dur;
                return (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => onDurationChange && onDurationChange(dur)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-full)',
                      border: isSelected ? '1.5px solid var(--primary-ocean)' : '1px solid var(--border-light)',
                      background: isSelected ? 'var(--primary-ocean)' : '#ffffff',
                      color: isSelected ? '#ffffff' : 'var(--primary-deep)',
                      fontSize: '0.78rem',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {dur}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Departure Time */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <label
                style={{
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  color: 'var(--primary-navy)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  margin: 0,
                }}
              >
                <CalendarClock size={15} color="var(--primary-ocean)" />
                <span>Departure Time (WITA)</span>
              </label>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#b45309',
                  background: '#fef3c7',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid #fde68a',
                }}
              >
                {departureTime} WITA
              </span>
            </div>

            {/* Departure Time Presets */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                marginBottom: '8px',
              }}
            >
              {((('presets' in currentSessionConfig) ? (currentSessionConfig as any).presets : ['09:00 AM', '09:30 AM', '01:30 PM', '03:30 PM']) as string[]).map((preset: string) => {
                const isSelected = departureTime === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => onDepartureTimeChange && onDepartureTimeChange(preset)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: 'var(--radius-sm)',
                      border: isSelected ? '1.5px solid var(--primary-ocean)' : '1px solid var(--border-light)',
                      background: isSelected ? 'var(--primary-ocean)' : '#ffffff',
                      color: isSelected ? '#ffffff' : 'var(--primary-deep)',
                      fontSize: '0.78rem',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {preset}
                  </button>
                );
              })}
            </div>

            {/* Custom Time Input helper */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                Or select exact time:
              </span>
              <input
                type="text"
                value={departureTime}
                placeholder="e.g. 08:45 AM"
                onChange={(e) => onDepartureTimeChange && onDepartureTimeChange(e.target.value)}
                style={{
                  width: '120px',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  background: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--primary-deep)',
                }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                (07:00 AM - 04:30 PM)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
