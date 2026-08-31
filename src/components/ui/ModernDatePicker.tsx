'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Zap, ArrowRight, FastForward } from 'lucide-react';

interface ModernDatePickerProps {
  value: string;
  onChange: (dateStr: string) => void;
  label?: string;
  locale?: string;
}

export default function ModernDatePicker({
  value,
  onChange,
  label,
}: ModernDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const parsedDate = value ? new Date(value + 'T00:00:00') : new Date();
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1)
  );

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const formatDisplay = (dateString: string) => {
    if (!dateString) return 'Select trip date...';
    const d = new Date(dateString + 'T00:00:00');
    if (isNaN(d.getTime())) return dateString;
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
    return `${dayName}, ${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectDate = (dayNum: number) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(dayNum).padStart(2, '0');
    onChange(`${year}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const setPreset = (daysFromNow: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    setCurrentMonth(new Date(d.getFullYear(), d.getMonth(), 1));
    onChange(str);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {label && <label className="form-label">{label}</label>}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 16px',
          background: '#ffffff',
          border: isOpen ? '1.5px solid var(--primary-ocean)' : '1px solid var(--border-light)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.95rem',
          color: value ? 'var(--primary-deep)' : 'var(--text-muted)',
          fontWeight: value ? 600 : 400,
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <Calendar size={18} color="var(--primary-ocean)" style={{ flexShrink: 0 }} />
        <span>{formatDisplay(value)}</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            zIndex: 160,
            width: '310px',
            background: '#ffffff',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
            padding: '16px',
          }}
        >
          {/* Quick Presets */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
            {[
              { days: 1, label: 'Tomorrow', icon: <Zap size={12} /> },
              { days: 2, label: '2 Days', icon: <ArrowRight size={12} /> },
              { days: 7, label: 'Next Week', icon: <FastForward size={12} /> },
            ].map((p) => (
              <button
                key={p.days}
                type="button"
                onClick={() => setPreset(p.days)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-light)',
                  background: '#f8fafc',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {p.icon}
                <span>{p.label}</span>
              </button>
            ))}
          </div>

          {/* Month Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <button
              type="button"
              onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
              style={{
                width: '28px', height: '28px', borderRadius: '6px', border: '1px solid var(--border-light)',
                background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--primary-deep)' }}>
              {monthNames[month]} {year}
            </span>
            <button
              type="button"
              onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
              style={{
                width: '28px', height: '28px', borderRadius: '6px', border: '1px solid var(--border-light)',
                background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', textAlign: 'center', marginBottom: '6px' }}>
            {dayNames.map((d, i) => (
              <span key={i} style={{ fontSize: '0.72rem', fontWeight: 600, color: i === 0 ? 'var(--accent-coral)' : 'var(--text-muted)', padding: '4px 0' }}>
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', textAlign: 'center' }}>
            {Array.from({ length: firstDayIndex }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: totalDaysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateCheck = new Date(year, month, dayNum);
              dateCheck.setHours(0, 0, 0, 0);
              const isPast = dateCheck < today;
              const slotStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isSelected = value === slotStr;
              const isToday = dateCheck.getTime() === today.getTime();

              return (
                <button
                  key={dayNum}
                  type="button"
                  disabled={isPast}
                  onClick={() => selectDate(dayNum)}
                  style={{
                    height: '32px',
                    borderRadius: '6px',
                    border: isToday && !isSelected ? '1px solid var(--primary-ocean)' : 'none',
                    background: isSelected ? 'var(--primary-ocean)' : 'transparent',
                    color: isSelected ? '#fff' : isPast ? '#d1d5db' : 'var(--text-main)',
                    fontWeight: isSelected || isToday ? 700 : 500,
                    fontSize: '0.84rem',
                    cursor: isPast ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
