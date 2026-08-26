'use client';

import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { Compass, Sparkles, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function HighlightsSection() {
  const { t, lang } = useLanguage();

  const highlights = [
    {
      title: t.highlights.spot1Title,
      desc: t.highlights.spot1Desc,
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop',
      tag: 'Gili Meno',
      depth: '2 - 4 Meter',
    },
    {
      title: t.highlights.spot2Title,
      desc: t.highlights.spot2Desc,
      image: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=1200&auto=format&fit=crop',
      tag: 'Bask Nest Meno',
      depth: '3 - 5 Meter',
    },
    {
      title: t.highlights.spot3Title,
      desc: t.highlights.spot3Desc,
      image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=1200&auto=format&fit=crop',
      tag: 'Gili Air',
      depth: '1.5 - 3 Meter',
    },
    {
      title: t.highlights.spot4Title,
      desc: t.highlights.spot4Desc,
      image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=1200&auto=format&fit=crop',
      tag: 'Gili Trawangan Waters',
      depth: 'Sunset Spot',
    },
  ];

  return (
    <section className="section section-alt">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <Compass size={14} />
            <span>{t.highlights.badge}</span>
          </div>
          <h2 className="section-title">{t.highlights.title}</h2>
          <p className="section-subtitle">{t.highlights.subtitle}</p>
        </div>

        {/* Highlights Grid */}
        <div className="grid-4">
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ position: 'relative', height: '200px', width: '100%' }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(10, 37, 64, 0.85)',
                    backdropFilter: 'blur(8px)',
                    color: 'var(--primary-aqua)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <MapPin size={11} />
                  <span>{item.tag}</span>
                </div>
              </div>

              <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--primary-deep)' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
