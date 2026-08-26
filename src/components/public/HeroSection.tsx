'use client';

import React from 'react';
import NextLink from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import { Sparkles, Calendar, Compass, ShieldCheck, Camera, Users, Award, ChevronRight } from 'lucide-react';

interface HeroProps {
  heroData?: {
    badgeId?: string | null;
    badgeEn?: string | null;
    titleId: string;
    titleEn: string;
    subtitleId?: string | null;
    subtitleEn?: string | null;
    backgroundImage?: string | null;
    ctaTextId?: string | null;
    ctaTextEn?: string | null;
    ctaLink?: string | null;
    secondaryCtaId?: string | null;
    secondaryCtaEn?: string | null;
    secondaryCtaLink?: string | null;
  };
}

export default function HeroSection({ heroData }: HeroProps) {
  const { lang, t } = useLanguage();

  const badge = lang === 'id' ? (heroData?.badgeId || t.hero.popularTag) : (heroData?.badgeEn || t.hero.popularTag);
  const title = lang === 'id' ? (heroData?.titleId || t.hero.mainHeading) : (heroData?.titleEn || t.hero.mainHeading);
  const subtitle = lang === 'id' ? (heroData?.subtitleId || t.hero.subHeading) : (heroData?.subtitleEn || t.hero.subHeading);
  const ctaText = lang === 'id' ? (heroData?.ctaTextId || t.hero.ctaBook) : (heroData?.ctaTextEn || t.hero.ctaBook);
  const secondaryCtaText = lang === 'id' ? (heroData?.secondaryCtaId || t.hero.ctaPackages) : (heroData?.secondaryCtaEn || t.hero.ctaPackages);
  const bgImage = heroData?.backgroundImage || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop';

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '80px',
        paddingBottom: '100px',
        overflow: 'hidden',
        background: `linear-gradient(180deg, rgba(10, 37, 64, 0.72) 0%, rgba(7, 59, 76, 0.85) 100%), url('${bgImage}') center/cover no-repeat fixed`,
      }}
    >
      {/* Shimmer light effect overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 30%, rgba(0, 180, 216, 0.25) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <div style={{ maxWidth: '880px', margin: '0 auto' }}>
          {/* Badge */}
          <div className="section-badge badge-gold" style={{ display: 'inline-flex', marginBottom: '22px' }}>
            <Sparkles size={15} />
            <span>{badge}</span>
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.15,
              marginBottom: '22px',
              textShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
              letterSpacing: '-0.03em',
            }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: 1.65,
              marginBottom: '36px',
              maxWidth: '740px',
              marginLeft: 'auto',
              marginRight: 'auto',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
            }}
          >
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              flexWrap: 'wrap',
              marginBottom: '50px',
            }}
          >
            <NextLink href={heroData?.ctaLink || '/booking'} className="btn btn-gold btn-lg">
              <Calendar size={20} />
              {ctaText}
            </NextLink>

            <NextLink href={heroData?.secondaryCtaLink || '/paket'} className="btn btn-outline-white btn-lg">
              <Compass size={20} />
              {secondaryCtaText}
            </NextLink>
          </div>

          {/* Trust Guarantees Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '14px',
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: 'var(--radius-lg)',
              padding: '18px 24px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(0, 180, 216, 0.25)', color: '#48cae4', flexShrink: 0 }}>
                <ShieldCheck size={20} />
              </div>
              <span style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.3 }}>
                {t.hero.feature1}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(255, 183, 3, 0.25)', color: '#ffd166', flexShrink: 0 }}>
                <Camera size={20} />
              </div>
              <span style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.3 }}>
                {t.hero.feature2}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(6, 214, 160, 0.25)', color: '#06d6a0', flexShrink: 0 }}>
                <Award size={20} />
              </div>
              <span style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.3 }}>
                {t.hero.feature3}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(239, 71, 111, 0.25)', color: '#ff85a1', flexShrink: 0 }}>
                <Users size={20} />
              </div>
              <span style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.3 }}>
                {t.hero.feature4}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Divider */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          overflow: 'hidden',
          lineHeight: 0,
          transform: 'rotate(180deg)',
        }}
      >
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: 'relative', display: 'block', width: 'calc(100% + 1.3px)', height: '40px' }}>
          <path d="M0,0 C150,90 350,-40 500,40 C650,120 900,10 1200,40 L1200,0 L0,0 Z" fill="#ffffff"></path>
        </svg>
      </div>
    </section>
  );
}
