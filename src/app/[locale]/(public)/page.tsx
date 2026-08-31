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
import { Sparkles, ArrowRight, ShieldCheck, Camera, Users, Award, Calendar, HelpCircle, Compass, MessageCircle } from 'lucide-react';

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
  const whatsappNumber = waSetting?.value || '6287864551234';

  const featuredPackages = allPackages.filter((p) => p.isActive);

  return (
    <>
      {/* 1. Hero Section */}
      <HeroSection heroData={heroData} />

      {/* 2. Featured Packages Section */}
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

          {featuredPackages.length > 0 ? (
            <>
              <div className="grid-3">
                {featuredPackages.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>

              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <Link href="/paket" className="btn btn-secondary btn-lg">
                  <span>{t('packages.viewAllPackages')}</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </>
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
