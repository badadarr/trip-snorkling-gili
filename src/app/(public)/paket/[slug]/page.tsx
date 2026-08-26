import React from 'react';
import { getPackageBySlug, getPackagesList, getSettings } from '@/lib/data';
import { notFound } from 'next/navigation';
import NextLink from 'next/link';
import { Clock, Calendar, CheckCircle2, MapPin, Sparkles, ShieldCheck, Camera, ArrowLeft, MessageCircle, Waves, ChevronRight } from 'lucide-react';
import CtaBanner from '@/components/public/CtaBanner';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PackageDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);

  if (!pkg) {
    notFound();
  }

  const settings = await getSettings();
  const waSetting = settings.find((s) => s.key === 'whatsapp_number');
  const whatsappNumber = waSetting?.value || '6287864551234';

  const includes = pkg.includesId || [];
  const spots = pkg.spotsId || [];

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
            <NextLink href="/" style={{ color: '#90e0ef', textDecoration: 'none' }}>Beranda</NextLink>
            <ChevronRight size={14} />
            <NextLink href="/paket" style={{ color: '#90e0ef', textDecoration: 'none' }}>Paket Snorkeling</NextLink>
            <ChevronRight size={14} />
            <span style={{ color: '#ffffff', fontWeight: 600 }}>{pkg.nameId}</span>
          </div>

          <div style={{ maxWidth: '820px' }}>
            {pkg.tagId && (
              <div className="section-badge badge-gold" style={{ display: 'inline-flex', marginBottom: '16px' }}>
                <Sparkles size={14} />
                <span>{pkg.tagId}</span>
              </div>
            )}
            <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', color: '#ffffff', lineHeight: 1.2, marginBottom: '16px' }}>
              {pkg.nameId}
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.6, marginBottom: '28px' }}>
              {pkg.descriptionId}
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <NextLink href={`/booking?package=${pkg.slug}`} className="btn btn-gold btn-lg">
                <Calendar size={20} />
                <span>Booking Paket Ini</span>
              </NextLink>
              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Halo Admin! Saya tertarik dengan paket ${pkg.nameId}. Mau tanya ketersediaan jadwal...`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp btn-lg"
              >
                <MessageCircle size={20} />
                <span>Chat via WhatsApp</span>
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
                    Durasi Trip
                  </span>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-deep)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <Clock size={16} color="var(--primary-ocean)" />
                    {pkg.durationId || '4 - 5 Jam'}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>
                    Jadwal Berangkat
                  </span>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-deep)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <Calendar size={16} color="var(--primary-ocean)" />
                    {pkg.scheduleId || '09:30 & 13:00'}
                  </span>
                </div>
              </div>

              {/* Snorkeling Spots */}
              {spots.length > 0 && (
                <div style={{ marginBottom: '40px' }}>
                  <h3 style={{ fontSize: '1.45rem', color: 'var(--primary-deep)', marginBottom: '18px' }}>
                    Spot Snorkeling yang Dikunjungi
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
                    Fasilitas & Layanan Termasuk
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
                  HARGA PAKET
                </span>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary-deep)', fontFamily: 'var(--font-heading)' }}>
                    Rp {pkg.price.toLocaleString('id-ID')}
                  </span>
                  <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                    {pkg.price > 500000 ? '/ Perahu (Maks 10 org)' : '/ Orang'}
                  </span>
                </div>

                <div style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                  setara ~<strong>${pkg.priceUsd} USD</strong>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                  <NextLink href={`/booking?package=${pkg.slug}`} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                    <Calendar size={18} />
                    <span>Reservasi Sekarang</span>
                  </NextLink>

                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Halo Admin! Mau booking ${pkg.nameId}...`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-whatsapp btn-lg"
                    style={{ width: '100%' }}
                  >
                    <MessageCircle size={18} />
                    <span>Booking via WhatsApp</span>
                  </a>
                </div>

                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={16} color="var(--accent-green)" />
                    <span>Jaminan Keamanan & Pelampung Standar</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Camera size={16} color="var(--accent-gold)" />
                    <span>Gratis Foto & Video Underwater GoPro</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} color="var(--primary-ocean)" />
                    <span>Pemandu Ramah & Helpful</span>
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
