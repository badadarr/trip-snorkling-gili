import React from 'react';
import HeroSection from '@/components/public/HeroSection';
import PackageCard from '@/components/public/PackageCard';
import HighlightsSection from '@/components/public/HighlightsSection';
import GalleryGrid from '@/components/public/GalleryGrid';
import TestimonialsSection from '@/components/public/TestimonialsSection';
import FaqAccordion from '@/components/public/FaqAccordion';
import CtaBanner from '@/components/public/CtaBanner';
import { getHero, getPackagesList, getGalleryList, getTestimonialsList, getFaqList, getSettings } from '@/lib/data';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { Sparkles, ArrowRight, ShieldCheck, Camera, Users, Award, Calendar, HelpCircle, Compass, MessageCircle, Ship, CheckCircle2, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const t = await getTranslations();
  const heroData = await getHero();
  const allPackages = await getPackagesList();
  const galleryItems = await getGalleryList();
  const testimonials = await getTestimonialsList();
  const faqs = await getFaqList();
  const settings = await getSettings();

  const waSetting = settings.find((s) => s.key === 'whatsapp_number');
  const whatsappNumber = waSetting?.value || '6282236851307';

  const activePackages = allPackages.filter((p) => p.isActive);

  const isPrivate = (pkg: any) =>
    pkg.priceUnit === 'per_boat' || (!pkg.priceUnit && pkg.price > 500000);

  const publicPackages = activePackages.filter((p) => !isPrivate(p));
  const privatePackages = activePackages.filter((p) => isPrivate(p));

  return (
    <>
      {/* 1. Hero Section */}
      <HeroSection heroData={heroData} />

      {/* 2. Featured Packages Section with Public & Private Categories */}
      <section className="section" id="packages">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <Sparkles size={14} />
              <span>{t('packages.sectionBadge')}</span>
            </div>
            <h2 className="section-title">{t('packages.sectionTitle')}</h2>
            <p className="section-subtitle">
              {t('packages.sectionSubtitle')}
            </p>
          </div>

          {activePackages.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '56px' }}>
              {/* Public Packages */}
              {publicPackages.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '5px 12px',
                          borderRadius: 'var(--radius-full)',
                          background: 'var(--primary-surface)',
                          color: 'var(--primary-ocean)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          marginBottom: '8px',
                          border: '1px solid rgba(0, 180, 216, 0.25)',
                        }}
                      >
                        <Users size={13} />
                        <span>{t('packages.publicBadge')}</span>
                      </div>
                      <h3 style={{ fontSize: '1.45rem', color: 'var(--primary-deep)', margin: 0 }}>
                        {t('packages.publicSectionTitle')}
                      </h3>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Fixed schedule: Morning & Afternoon
                    </span>
                  </div>

                  <div className="grid-3">
                    {publicPackages.slice(0, 3).map((pkg) => (
                      <PackageCard key={pkg.id} pkg={pkg} />
                    ))}
                  </div>
                </div>
              )}

              {/* Private Packages */}
              {privatePackages.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '5px 12px',
                          borderRadius: 'var(--radius-full)',
                          background: '#fef3c7',
                          color: '#b45309',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          marginBottom: '8px',
                          border: '1px solid #fde68a',
                        }}
                      >
                        <Ship size={13} />
                        <span>{t('packages.privateBadge')}</span>
                      </div>
                      <h3 style={{ fontSize: '1.45rem', color: 'var(--primary-deep)', margin: 0 }}>
                        {t('packages.privateSectionTitle')}
                      </h3>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: '#b45309', fontWeight: 600 }}>
                      Max. 4 Pax • Flexible Schedule
                    </span>
                  </div>

                  <div className="grid-3">
                    {privatePackages.slice(0, 3).map((pkg) => (
                      <PackageCard key={pkg.id} pkg={pkg} />
                    ))}
                  </div>
                </div>
              )}

              <div style={{ textAlign: 'center', marginTop: '12px' }}>
                <Link href="/paket" className="btn btn-secondary btn-lg">
                  <span>{t('packages.viewAllPackages')}</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          ) : (
            <div
              className="glass-card"
              style={{
                maxWidth: '680px',
                margin: '0 auto',
                padding: '48px 32px',
                textAlign: 'center',
                borderRadius: '24px',
                border: '1px dashed rgba(0, 180, 216, 0.35)',
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(240, 249, 255, 0.85) 100%)',
                boxShadow: '0 20px 40px -15px rgba(0, 119, 182, 0.08)',
              }}
            >
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'rgba(0, 180, 216, 0.12)',
                  color: 'var(--primary-ocean)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <Compass size={36} />
              </div>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-deep)', marginBottom: '12px', fontWeight: 700 }}>
                {t('packages.noPackagesTitle')}
              </h3>
              <p style={{ fontSize: '0.98rem', color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: '520px', margin: '0 auto 28px' }}>
                {t('packages.noPackagesSubtitle')}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Gili Trawangan Snorkeling Trip! I would like to inquire about snorkeling package availability...')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-whatsapp btn-lg"
                >
                  <MessageCircle size={18} />
                  <span>{t('packages.contactWa')}</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2b. Public vs Private Comparison Section */}
      <section className="section section-alt" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <Compass size={14} />
              <span>GUIDE</span>
            </div>
            <h2 className="section-title">{t('packages.privateVsPublicTitle')}</h2>
            <p className="section-subtitle">
              {t('packages.privateVsPublicSubtitle')}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
            {/* Public Option */}
            <div
              className="glass-card"
              style={{
                padding: '32px 28px',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--primary-surface)', color: 'var(--primary-ocean)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-deep)', margin: 0 }}>
                    {t('packages.compPublicTitle')}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary-ocean)', fontWeight: 600 }}>
                    Budget-Friendly & Social
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
                {t('packages.compPublicDesc')}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-main)', marginTop: 'auto', paddingTop: '16px', borderTop: '1px dashed var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--accent-green)" />
                  <span>Affordable rate charged per person</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--accent-green)" />
                  <span>Fixed schedule: Morning & Afternoon</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--accent-green)" />
                  <span>Ideal for solo travelers & couples</span>
                </div>
              </div>
            </div>

            {/* Private Option */}
            <div
              className="glass-card"
              style={{
                padding: '32px 28px',
                border: '2px solid #fde68a',
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 243, 199, 0.25) 100%)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Ship size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-deep)', margin: 0 }}>
                    {t('packages.compPrivateTitle')}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 600 }}>
                    Exclusive & Flexible
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
                {t('packages.compPrivateDesc')}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-main)', marginTop: 'auto', paddingTop: '16px', borderTop: '1px dashed #fde68a' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--accent-green)" />
                  <span>Exclusive private boat (Max. 4 Pax)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--accent-green)" />
                  <span>Custom & flexible departure timing</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--accent-green)" />
                  <span>Ideal for families & private groups</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 4 Prime Spots Highlight */}
      <HighlightsSection />

      {/* 4. Why Choose Us Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <Award size={14} />
              <span>{t('whyUs.badge')}</span>
            </div>
            <h2 className="section-title">{t('whyUs.title')}</h2>
            <p className="section-subtitle">
              {t('whyUs.subtitle')}
            </p>
          </div>

          <div className="grid-4">
            <div className="glass-card" style={{ padding: '30px 24px', textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background: 'rgba(0, 180, 216, 0.15)',
                  color: 'var(--primary-ocean)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px',
                }}
              >
                <ShieldCheck size={30} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-deep)', marginBottom: '10px' }}>
                {t('whyUs.reason1Title')}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                {t('whyUs.reason1Desc')}
              </p>
            </div>

            <div className="glass-card" style={{ padding: '30px 24px', textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background: 'rgba(255, 183, 3, 0.15)',
                  color: '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px',
                }}
              >
                <Camera size={30} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-deep)', marginBottom: '10px' }}>
                {t('whyUs.reason2Title')}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                {t('whyUs.reason2Desc')}
              </p>
            </div>

            <div className="glass-card" style={{ padding: '30px 24px', textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background: 'rgba(6, 214, 160, 0.15)',
                  color: 'var(--accent-green)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px',
                }}
              >
                <Users size={30} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-deep)', marginBottom: '10px' }}>
                {t('whyUs.reason3Title')}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                {t('whyUs.reason3Desc')}
              </p>
            </div>

            <div className="glass-card" style={{ padding: '30px 24px', textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background: 'rgba(239, 71, 111, 0.15)',
                  color: 'var(--accent-coral)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px',
                }}
              >
                <Calendar size={30} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-deep)', marginBottom: '10px' }}>
                {t('whyUs.reason4Title')}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                {t('whyUs.reason4Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Photo Gallery Section */}
      <section className="section section-alt" id="gallery">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <Camera size={14} />
              <span>{t('gallery.badge')}</span>
            </div>
            <h2 className="section-title">{t('gallery.title')}</h2>
            <p className="section-subtitle">
              {t('gallery.subtitle')}
            </p>
          </div>

          <GalleryGrid items={galleryItems} />

          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link href="/gallery" className="btn btn-secondary">
              <span>{t('gallery.openFullGallery')}</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <TestimonialsSection items={testimonials} />

      {/* 7. FAQ Accordion Section */}
      <section className="section" id="faq">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <HelpCircle size={14} />
              <span>{t('faq.badge')}</span>
            </div>
            <h2 className="section-title">{t('faq.title')}</h2>
            <p className="section-subtitle">
              {t('faq.subtitle')}
            </p>
          </div>

          <FaqAccordion items={faqs} />
        </div>
      </section>

      {/* 8. Call to Action Banner */}
      <CtaBanner whatsappNumber={whatsappNumber} />
    </>
  );
}
