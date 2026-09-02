'use client';

import React from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Calendar, MessageCircle, Sparkles } from 'lucide-react';

export default function CtaBanner({ whatsappNumber }: { whatsappNumber?: string }) {
  const t = useTranslations('cta');
  const phone = whatsappNumber || '6282236851307';

  return (
    <section
      style={{
        paddingTop: '80px',
        paddingBottom: '80px',
        background: 'linear-gradient(135deg, var(--primary-deep) 0%, #004e75 50%, var(--primary-ocean) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(0, 180, 216, 0.15)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <div className="section-badge badge-gold" style={{ display: 'inline-flex', marginBottom: '18px' }}>
            <Sparkles size={14} />
            <span>LIMITED DAILY SLOTS</span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: '#ffffff',
              lineHeight: 1.2,
              marginBottom: '18px',
              fontFamily: 'var(--font-heading)',
            }}
          >
            {t('title')}
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'rgba(255, 255, 255, 0.85)',
              lineHeight: 1.65,
              marginBottom: '36px',
            }}
          >
            {t('subtitle')}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <Link href="/booking" className="btn btn-gold btn-lg">
              <Calendar size={20} />
              <span>{t('bookButton')}</span>
            </Link>

            <a
              href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                'Hello! I would like to inquire about available snorkeling tour slots & reservation.'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp btn-lg"
            >
              <MessageCircle size={20} />
              <span>{t('whatsappButton')}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
