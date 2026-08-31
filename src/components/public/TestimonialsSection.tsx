'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Star, Sparkles, MapPin } from 'lucide-react';

export interface TestimonialItem {
  id: number;
  name: string;
  origin?: string | null;
  countryCode?: string | null;
  rating?: number | null;
  tripType?: string | null;
  contentId: string;
  contentEn: string;
  avatarUrl?: string | null;
  isActive?: boolean | null;
}

export default function TestimonialsSection({ items }: { items: TestimonialItem[] }) {
  const t = useTranslations('testimonials');

  return (
    <section className="section section-alt">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <Sparkles size={14} />
            <span>{t('badge')}</span>
          </div>
          <h2 className="section-title">{t('title')}</h2>
          <p className="section-subtitle">{t('subtitle')}</p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid-3">
          {items.map((item) => {
            const review = item.contentId;
            const ratingCount = item.rating || 5;

            return (
              <div
                key={item.id}
                className="glass-card"
                style={{
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                }}
              >
                <div>
                  {/* Rating Stars */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }}>
                    {[...Array(ratingCount)].map((_, i) => (
                      <Star key={i} size={16} fill="var(--accent-gold)" color="var(--accent-gold)" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.65, fontStyle: 'italic', marginBottom: '20px' }}>
                    "{review}"
                  </p>
                </div>

                {/* Author Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                  {item.avatarUrl ? (
                    <img
                      src={item.avatarUrl}
                      alt={item.name}
                      style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        background: 'var(--primary-surface)',
                        color: 'var(--primary-ocean)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                      }}
                    >
                      {item.name.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--primary-deep)', marginBottom: '2px' }}>
                      {item.name}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <MapPin size={12} color="var(--primary-ocean)" />
                      <span>{item.origin || 'Visitor'}</span>
                    </div>
                    {item.tripType && (
                      <span style={{ display: 'inline-block', fontSize: '0.72rem', color: 'var(--primary-ocean)', fontWeight: 600, marginTop: '2px' }}>
                        {item.tripType}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
