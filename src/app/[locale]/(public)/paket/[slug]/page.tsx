import React from 'react';
import { getPackageBySlug, getSettings } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { Clock, Calendar, CheckCircle2, Sparkles, ShieldCheck, Camera, MessageCircle, ChevronRight } from 'lucide-react';
import CtaBanner from '@/components/public/CtaBanner';
import { formatIdr, formatUsd } from '@/lib/format';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PackageDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const t = await getTranslations();
  const pkg = await getPackageBySlug(slug);

  if (!pkg) {
    notFound();
  }

  const settings = await getSettings();
  const waSetting = settings.find((s) => s.key === 'whatsapp_number');
  const whatsappNumber = waSetting?.value || '6282236851307';

  const name = pkg.nameEn || pkg.nameId;
  const tag = pkg.tagEn || pkg.tagId;
  const description = pkg.descriptionEn || pkg.descriptionId;
  const duration = pkg.durationEn || pkg.durationId || '4 - 5 Hours';
  const schedule = pkg.scheduleEn || pkg.scheduleId || '09:30 AM & 01:00 PM';
  const includes = (pkg.includesEn && pkg.includesEn.length > 0) ? pkg.includesEn : (pkg.includesId || []);
  const spots = (pkg.spotsEn && pkg.spotsEn.length > 0) ? pkg.spotsEn : (pkg.spotsId || []);
  const isPrivate = pkg.priceUnit === 'per_boat' || (!pkg.priceUnit && pkg.price > 500000);

  return (
    <div>
      {/* Hero Header */}
      <section
        style={{
          position: 'relative',
          paddingTop: '80px',
          paddingBottom: '80px',
          background: `linear-gradient(180deg, rgba(10, 37, 64, 0.8) 0%, rgba(7, 59, 76, 0.9) 100%), url('${pkg.imageUrl}') center/cover no-repeat`,
          color: '#ffffff',
        }}
      >
        <div className="container">
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#90e0ef', marginBottom: '20px' }}>
            <Link href="/" style={{ color: '#90e0ef', textDecoration: 'none' }}>{t('nav.home')}</Link>
            <ChevronRight size={14} />
            <Link href="/paket" style={{ color: '#90e0ef', textDecoration: 'none' }}>{t('nav.packages')}</Link>
            <ChevronRight size={14} />
            <span style={{ color: '#ffffff', fontWeight: 600 }}>{name}</span>
          </div>

          <div style={{ maxWidth: '820px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  background: isPrivate ? '#fef3c7' : 'rgba(255, 255, 255, 0.2)',
                  color: isPrivate ? '#92400e' : '#ffffff',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  backdropFilter: 'blur(4px)',
                }}
              >
                <span>{isPrivate ? t('packages.privateBadge') : t('packages.publicBadge')}</span>
              </div>
              {tag && (
                <div className="section-badge badge-gold" style={{ display: 'inline-flex' }}>
                  <Sparkles size={14} />
                  <span>{tag}</span>
                </div>
              )}
            </div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', color: '#ffffff', lineHeight: 1.2, marginBottom: '16px' }}>
              {name}
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.6, marginBottom: '28px' }}>
              {description}
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link href={`/booking?package=${pkg.slug}`} className="btn btn-gold btn-lg">
                <Calendar size={20} />
                <span>{t('packages.bookThisPackage')}</span>
              </Link>
              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hello Admin! I am interested in booking the ${name} package. Inquiring about schedule & availability...`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp btn-lg"
              >
                <MessageCircle size={20} />
                <span>{t('packages.bookViaWa')}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Detail Content Section */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
            {/* Left Column: Itinerary & Inclusions */}
            <div>
              {/* Quick Info Bar */}
              <div
                className="glass-card"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '16px',
                  padding: '20px',
                  marginBottom: '36px',
                  border: '1px solid var(--primary-turquoise)',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>
                    {t('packages.duration')}
                  </span>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-deep)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <Clock size={16} color="var(--primary-ocean)" />
                    {duration}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>
                    {t('packages.schedule')}
                  </span>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-deep)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <Calendar size={16} color="var(--primary-ocean)" />
                    {schedule}
                  </span>
                </div>
              </div>

              {/* Snorkeling Spots */}
              {spots.length > 0 && (
                <div style={{ marginBottom: '40px' }}>
                  <h3 style={{ fontSize: '1.45rem', color: 'var(--primary-deep)', marginBottom: '18px' }}>
                    {t('packages.visitedSpots')}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {spots.map((spot, i) => (
                      <div
                        key={i}
                        className="glass-card"
                        style={{
                          padding: '16px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                        }}
                      >
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'var(--primary-surface)',
                            color: 'var(--primary-ocean)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {i + 1}
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--primary-deep)', fontSize: '0.95rem' }}>
                          {spot}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inclusions */}
              {includes.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '1.45rem', color: 'var(--primary-deep)', marginBottom: '18px' }}>
                    {t('packages.includedFacilities')}
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                    {includes.map((inc, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem', color: 'var(--text-main)' }}>
                        <CheckCircle2 size={18} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Pricing & Booking Widget */}
            <div>
              <div
                className="glass-card"
                style={{
                  padding: '36px 30px',
                  position: 'sticky',
                  top: '100px',
                  border: '2px solid var(--primary-ocean)',
                  boxShadow: 'var(--shadow-lg)',
                }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-ocean)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
                  {t('packages.packagePricing')}
                </span>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary-deep)', fontFamily: 'var(--font-heading)' }}>
                    {formatUsd(pkg.priceUsd)}
                  </span>
                  <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                    {(pkg.priceUnit === 'per_boat' || (!pkg.priceUnit && pkg.price > 500000)) ? t('packages.perBoat') : t('packages.perPerson')}
                  </span>
                </div>

                <div style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: isPrivate ? '10px' : '24px' }}>
                  approx. {formatIdr(pkg.price)}
                </div>

                {isPrivate && (
                  <div
                    style={{
                      padding: '8px 12px',
                      background: '#fffbeb',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid #fde68a',
                      fontSize: '0.78rem',
                      color: '#b45309',
                      marginBottom: '20px',
                      lineHeight: 1.4,
                    }}
                  >
                    Max. 4 Pax. Additional charges apply for more than 4 guests.
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                  <Link href={`/booking?package=${pkg.slug}`} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                    <Calendar size={18} />
                    <span>{t('packages.reserveNow')}</span>
                  </Link>

                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello Admin! I would like to book the ${name} package...`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-whatsapp btn-lg"
                    style={{ width: '100%' }}
                  >
                    <MessageCircle size={18} />
                    <span>{t('packages.bookViaWa')}</span>
                  </a>
                </div>

                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={16} color="var(--accent-green)" />
                    <span>{t('packages.safetyGuarantee')}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Camera size={16} color="var(--accent-gold)" />
                    <span>{t('packages.freeGoPro')}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} color="var(--primary-ocean)" />
                    <span>{t('packages.friendlyGuide')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CtaBanner whatsappNumber={whatsappNumber} />
    </div>
  );
}
