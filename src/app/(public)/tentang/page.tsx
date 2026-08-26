import React from 'react';
import { getAbout, getSettings } from '@/lib/data';
import CtaBanner from '@/components/public/CtaBanner';
import { Waves, Award, ShieldCheck, Heart, Users, MapPin, Compass } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const about = await getAbout();
  const settings = await getSettings();
  const waSetting = settings.find((s) => s.key === 'whatsapp_number');
  const whatsappNumber = waSetting?.value || '6287864551234';

  const stats = about.stats || [
    { number: '5.000+', labelId: 'Wisatawan Puas', labelEn: 'Happy Snorkelers' },
    { number: '100%', labelId: 'Spot Bergaransi Penyu', labelEn: 'Turtle Spot Guarantee' },
    { number: '8+ Thn', labelId: 'Pengalaman Bahari', labelEn: 'Years Marine Experience' },
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
            <span>TENTANG KAMI</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', color: '#ffffff', marginBottom: '16px' }}>
            {about.titleId || 'Tentang Trip Snorkeling Gili Trawangan'}
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.85)', maxWidth: '680px', margin: '0 auto' }}>
            {about.subtitleId || 'Penyedia Wisata Snorkeling Terpercaya & Berpengalaman di 3 Gili'}
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
                <span>CERITA & DEDIKASI KAMI</span>
              </div>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--primary-deep)', lineHeight: 1.25, marginBottom: '20px' }}>
                Menghubungkan Anda dengan Keajaiban Bawah Laut Nusantara
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-main)', lineHeight: 1.8, marginBottom: '20px' }}>
                {about.storyId}
              </p>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                Kami percaya bahwa snorkeling bukan sekadar melihat ikan dan penyu, melainkan merasakan kedamaian dan membangun kesadaran bersama untuk menjaga kelestarian terumbu karang kepulauan Gili bagi generasi mendatang.
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
                  {stat.labelId}
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
              <span>NILAI UTAMA KAMI</span>
            </div>
            <h2 className="section-title">Komitmen Pelayanan Kami</h2>
          </div>

          <div className="grid-3">
            <div className="glass-card" style={{ padding: '30px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'var(--primary-surface)', color: 'var(--primary-ocean)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-deep)', marginBottom: '10px' }}>Keselamatan Adalah Prioritas</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Setiap perahu dilengkapi pelampung terstandarisasi, kotak P3K bahari, dan pemandu bersertifikasi keselamatan air.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '30px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(6, 214, 160, 0.15)', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Heart size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-deep)', marginBottom: '10px' }}>Konservasi & Ramah Karang</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Kami mengedukasi wisatawan agar tidak menyentuh atau menginjak terumbu karang dan tidak mengganggu penyu di habitat aslinya.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '30px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(255, 183, 3, 0.15)', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Users size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-deep)', marginBottom: '10px' }}>Pemberdayaan Warga Lokal</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                100% kapten kapal dan kru kami adalah putra daerah asli pulau Gili yang ramah dan berpengetahuan luas.
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
