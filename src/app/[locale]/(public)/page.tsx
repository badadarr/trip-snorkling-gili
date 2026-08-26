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
import { Sparkles, ArrowRight, ShieldCheck, Camera, Users, Award, Calendar, HelpCircle } from 'lucide-react';

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
