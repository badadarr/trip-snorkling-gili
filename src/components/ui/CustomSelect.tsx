'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  subtitle?: string;
  badge?: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = 'Pilih opsi...',
  label,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {label && <label className="form-label">{label}</label>}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: '#ffffff',
          border: isOpen ? '1.5px solid var(--primary-ocean)' : '1px solid var(--border-light)',
          borderRadius: 'var(--radius-sm)',
          color: selectedOption ? 'var(--primary-deep)' : 'var(--text-muted)',
          fontSize: '0.95rem',
          fontWeight: selectedOption ? 600 : 400,
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', display: 'block' }}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.subtitle && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400, display: 'block' }}>
              {selectedOption.subtitle}
            </span>
          )}
        </div>

        <ChevronDown
          size={18}
          color="var(--text-muted)"
          style={{
            flexShrink: 0,
            marginLeft: '8px',
            transition: 'transform 0.15s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 150,
            background: '#ffffff',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-light)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
            maxHeight: '260px',
            overflowY: 'auto',
            padding: '4px',
          }}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <div
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: isSelected ? 'var(--primary-surface)' : 'transparent',
                  color: isSelected ? 'var(--primary-ocean)' : 'var(--text-main)',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.92rem',
                }}
              >
                <div style={{ overflow: 'hidden' }}>
                  <span style={{ display: 'block' }}>{option.label}</span>
                  {option.subtitle && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400, display: 'block' }}>
                      {option.subtitle}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  {option.badge && (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        background: 'rgba(0, 119, 182, 0.08)',
                        color: 'var(--primary-ocean)',
                      }}
                    >
                      {option.badge}
                    </span>
                  )}
                  {isSelected && <Check size={16} color="var(--primary-ocean)" strokeWidth={2.5} />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
