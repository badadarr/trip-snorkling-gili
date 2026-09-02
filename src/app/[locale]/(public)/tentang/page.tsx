import React from 'react';
import { getAbout, getSettings } from '@/lib/data';
import CtaBanner from '@/components/public/CtaBanner';
import { getTranslations } from 'next-intl/server';
import { Waves, ShieldCheck, Heart, Users, Compass } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const t = await getTranslations();
  const about = await getAbout();
  const settings = await getSettings();
  const waSetting = settings.find((s) => s.key === 'whatsapp_number');
  const whatsappNumber = waSetting?.value || '6282236851307';

  const title = about.titleEn || about.titleId || t('about.title');
  const subtitle = about.subtitleEn || about.subtitleId || t('about.subtitle');
  const story = about.storyEn || about.storyId || '';

  const stats = about.stats || [
    { number: '5.000+', labelId: 'Wisatawan Puas', labelEn: 'Happy Snorkelers' },
    { number: '100%', labelId: 'Spot Bergaransi Penyu', labelEn: 'Turtle Spot Guarantee' },
    { number: '8+ Yrs', labelId: 'Pengalaman Bahari', labelEn: 'Years Marine Experience' },
    { number: '4.9/5', labelId: 'Rating Ulasan', labelEn: 'Average Guest Rating' },
  ];

  return (
    <div>
      {/* Header */}
      <section
        style={{
          paddingTop: '80px',
          paddingBottom: '60px',
          background: 'linear-gradient(135deg, var(--primary-deep) 0%, var(--primary-ocean) 100%)',
          color: '#ffffff',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <div className="section-badge badge-white" style={{ display: 'inline-flex', marginBottom: '16px' }}>
            <Waves size={14} />
            <span>{t('about.badge')}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', color: '#ffffff', marginBottom: '16px' }}>
            {title}
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.85)', maxWidth: '680px', margin: '0 auto' }}>
            {subtitle}
          </p>
        </div>
      </section>

      {/* Story & Stats Section */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '50px', alignItems: 'center', marginBottom: '60px' }}>
            {/* Story text */}
            <div>
              <div className="section-badge" style={{ marginBottom: '14px' }}>
                <Compass size={14} />
                <span>{t('about.storyBadge')}</span>
              </div>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--primary-deep)', lineHeight: 1.25, marginBottom: '20px' }}>
                {t('about.storyTitle')}
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-main)', lineHeight: 1.8, marginBottom: '20px' }}>
                {story}
              </p>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                {t('about.storyVision')}
              </p>
            </div>

            {/* Image */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-xl)',
                  height: '420px',
                }}
              >
                <img
                  src={about.imageUrl || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200'}
                  alt="Tentang Trip Snorkeling Gili"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div
            className="glass-card"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '24px',
              padding: '40px 30px',
              textAlign: 'center',
              border: '2px solid var(--primary-turquoise)',
            }}
          >
            {stats.map((stat, i) => (
              <div key={i}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-ocean)', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
                  {stat.number}
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-deep)', marginTop: '8px' }}>
                  {stat.labelEn || stat.labelId}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <ShieldCheck size={14} />
              <span>{t('about.valuesBadge')}</span>
            </div>
            <h2 className="section-title">{t('about.valuesTitle')}</h2>
          </div>

          <div className="grid-3">
            <div className="glass-card" style={{ padding: '30px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'var(--primary-surface)', color: 'var(--primary-ocean)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-deep)', marginBottom: '10px' }}>
                {t('about.val1Title')}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {t('about.val1Desc')}
              </p>
            </div>

            <div className="glass-card" style={{ padding: '30px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(6, 214, 160, 0.15)', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Heart size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-deep)', marginBottom: '10px' }}>
                {t('about.val2Title')}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {t('about.val2Desc')}
              </p>
            </div>

            <div className="glass-card" style={{ padding: '30px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(255, 183, 3, 0.15)', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Users size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-deep)', marginBottom: '10px' }}>
                {t('about.val3Title')}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {t('about.val3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CtaBanner whatsappNumber={whatsappNumber} />
    </div>
  );
}
