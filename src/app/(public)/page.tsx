import React from 'react';
import HeroSection from '@/components/public/HeroSection';
import PackageCard from '@/components/public/PackageCard';
import HighlightsSection from '@/components/public/HighlightsSection';
import GalleryGrid from '@/components/public/GalleryGrid';
import TestimonialsSection from '@/components/public/TestimonialsSection';
import FaqAccordion from '@/components/public/FaqAccordion';
import CtaBanner from '@/components/public/CtaBanner';
import { getHero, getPackagesList, getGalleryList, getTestimonialsList, getFaqList, getSettings } from '@/lib/data';
import NextLink from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Camera, Users, Award, Calendar, HelpCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
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
              <span>PILIHAN PAKET TRIP</span>
            </div>
            <h2 className="section-title">Paket Snorkeling Trip 3 Gili Terbaik</h2>
            <p className="section-subtitle">
              Pilihan tour lengkap untuk solo traveler, pasangan, hingga keluarga & rombongan dengan harga transparan dan fasilitas lengkap.
            </p>
          </div>

          <div className="grid-3">
            {featuredPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <NextLink href="/paket" className="btn btn-secondary btn-lg">
              <span>Lihat Semua Paket Snorkeling</span>
              <ArrowRight size={18} />
            </NextLink>
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
              <span>KEUNGGULAN KAMI</span>
            </div>
            <h2 className="section-title">Mengapa Memilih Trip Snorkeling Bersama Kami?</h2>
            <p className="section-subtitle">
              Kepuasan, kenyamanan, dan keselamatan petualangan bahari Anda di 3 Gili adalah dedikasi utama kami.
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
                Pemandu Berlisensi & Aman
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                Pemandu lokal berpengalaman dan berlisensi dengan pelampung standar keselamatan untuk segala usia.
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
                Free Foto/Video GoPro HD
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                Dokumentasi bawah air dengan kamera GoPro kualitas tinggi tanpa biaya tambahan, langsung dibagikan.
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
                Armada Glass Bottom Nyaman
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                Kapal bersih dengan kaca transparan di lantai untuk melihat ikan tanpa harus langsung basah.
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
                Booking Mudah & Fleksibel
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                Pesan instan secara online atau lewat WhatsApp dengan pilihan bayar di tempat atau transfer.
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
              <span>GALERI FOTO</span>
            </div>
            <h2 className="section-title">Dokumentasi Petualangan Tamu Kami</h2>
            <p className="section-subtitle">
              Momen nyata dari keseruan berenang bersama penyu, foto di patung bawah air, dan keindahan pulau 3 Gili.
            </p>
          </div>

          <GalleryGrid items={galleryItems} />

          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <NextLink href="/gallery" className="btn btn-secondary">
              <span>Buka Galeri Lengkap</span>
              <ArrowRight size={16} />
            </NextLink>
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
              <span>FAQ</span>
            </div>
            <h2 className="section-title">Pertanyaan yang Sering Diajukan</h2>
            <p className="section-subtitle">
              Semua info yang perlu Anda ketahui sebelum memulai snorkeling trip di Gili Trawangan.
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
