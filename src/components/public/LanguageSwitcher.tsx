'use client';

import React, { useTransition, useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Globe, ChevronDown, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [targetLocale, setTargetLocale] = useState<'id' | 'en' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear target locale once transition is done
  useEffect(() => {
    if (!isPending) {
      setTargetLocale(null);
    }
  }, [isPending]);

  const handleLanguageChange = (newLocale: 'id' | 'en') => {
    setIsOpen(false);
    if (newLocale === locale || isPending) return;
    setTargetLocale(newLocale);

    try {
      startTransition(() => {
        router.replace(pathname, { locale: newLocale });
      });
    } catch (err: any) {
      console.error('Failed to switch language:', err);
      toast.error(
        locale === 'id'
          ? 'Gagal beralih bahasa. Silakan periksa koneksi Anda.'
          : 'Failed to switch language. Please check your connection.'
      );
      setTargetLocale(null);
    }
  };

  const languages = [
    {
      code: 'id',
      label: 'Bahasa Indonesia',
      short: 'ID',
      flag: '🇮🇩',
    },
    {
      code: 'en',
      label: 'English',
      short: 'EN',
      flag: '🇬🇧',
    },
  ];

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  return (
    <>
      {/* Global Top Progress Bar during bilingual transition */}
      {isPending && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '3.5px',
            zIndex: 99999,
            overflow: 'hidden',
            background: 'rgba(0, 180, 216, 0.25)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: '100%',
              background:
                'linear-gradient(90deg, #00b4d8 0%, #0077b6 40%, #ffb703 70%, #00b4d8 100%)',
              backgroundSize: '200% 100%',
              animation: 'topProgressSlide 1.1s infinite linear',
              boxShadow: '0 0 12px #00b4d8, 0 0 6px #ffb703',
            }}
          />
        </div>
      )}

      {/* Floating indicator badge for immediate user feedback */}
      {isPending && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 99998,
            background: 'rgba(10, 37, 64, 0.94)',
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: '9999px',
            fontSize: '0.82rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 10px 30px rgba(0, 50, 100, 0.3)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <Loader2
            size={15}
            style={{
              animation: 'spin 0.9s linear infinite',
              color: 'var(--primary-turquoise)',
            }}
          />
          <span>
            {targetLocale === 'id'
              ? 'Memuat Bahasa Indonesia...'
              : 'Switching to English...'}
          </span>
        </div>
      )}

      {/* Dropdown Container */}
      <div
        ref={dropdownRef}
        style={{
          position: 'relative',
          display: 'inline-block',
        }}
      >
        {/* Dropdown Trigger Button */}
        <button
          type="button"
          onClick={() => !isPending && setIsOpen((prev) => !prev)}
          disabled={isPending}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: isOpen || isPending ? '#ffffff' : 'var(--primary-surface)',
            border: isOpen || isPending
              ? '1.5px solid var(--primary-ocean)'
              : '1px solid rgba(0, 119, 182, 0.25)',
            borderRadius: '9999px',
            padding: '6px 12px 6px 10px',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: 'var(--primary-deep)',
            cursor: isPending ? 'wait' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: isOpen
              ? '0 4px 14px rgba(0, 119, 182, 0.15)'
              : '0 1px 3px rgba(0, 50, 100, 0.05)',
          }}
          aria-haspopup="true"
          aria-expanded={isOpen}
          title="Pilih Bahasa / Select Language"
        >
          {isPending ? (
            <Loader2
              size={14}
              style={{
                animation: 'spin 0.9s linear infinite',
                color: 'var(--primary-ocean)',
              }}
            />
          ) : (
            <span style={{ fontSize: '1rem', lineHeight: 1 }}>
              {currentLang.flag}
            </span>
          )}

          <span style={{ letterSpacing: '0.02em' }}>{currentLang.short}</span>

          <ChevronDown
            size={14}
            style={{
              color: 'var(--primary-ocean)',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
              opacity: isPending ? 0.5 : 1,
            }}
          />
        </button>

        {/* Dropdown Menu Popup */}
        {isOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              right: 0,
              minWidth: '170px',
              background: '#ffffff',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 10px 30px rgba(10, 37, 64, 0.16)',
              border: '1px solid rgba(0, 119, 182, 0.18)',
              padding: '6px',
              zIndex: 1000,
              animation: 'dropdownFadeIn 0.15s ease-out',
            }}
          >
            <div
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                padding: '6px 10px 4px 10px',
                letterSpacing: '0.05em',
              }}
            >
              {locale === 'id' ? 'Pilih Bahasa' : 'Select Language'}
            </div>

            {languages.map((lang) => {
              const isSelected = locale === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang.code as 'id' | 'en')}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isSelected ? 'rgba(0, 119, 182, 0.08)' : 'transparent',
                    color: isSelected ? 'var(--primary-ocean)' : 'var(--primary-deep)',
                    fontSize: '0.84rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = '#f8fafc';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.05rem' }}>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </div>

                  {isSelected && (
                    <Check size={14} color="var(--primary-ocean)" strokeWidth={2.5} />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes topProgressSlide {
          0% {
            background-position: 100% 0;
          }
          100% {
            background-position: -100% 0;
          }
        }
        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
