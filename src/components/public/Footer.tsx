'use client';

import React from 'react';
import NextLink from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import { Waves, MapPin, Phone, Mail, MessageCircle, ShieldCheck, Camera, Sparkles, Lock, Compass, Share2 } from 'lucide-react';

export default function Footer({ siteSettings }: { siteSettings?: any[] }) {
  const { t, lang } = useLanguage();

  const getSetting = (key: string, fallback: string) => {
    if (!siteSettings) return fallback;
    const found = siteSettings.find((s) => s.key === key);
    return found?.value || fallback;
  };

  const whatsapp = getSetting('whatsapp_number', '6287864551234');
  const phone = getSetting('phone', '+62 878-6455-1234');
  const email = getSetting('email', 'info@snorkelinggilitrawangan.com');
  const address = getSetting('address', 'Jl. Pantai Gili Trawangan, Pemenang, Lombok Utara, NTB, Indonesia');

  return (
    <footer style={{ backgroundColor: 'var(--primary-deep)', color: '#ffffff', position: 'relative', overflow: 'hidden' }}>
      {/* Top Banner Wave SVG */}
      <div style={{ width: '100%', overflow: 'hidden', lineHeight: 0, fill: '#ffffff' }}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: 'relative', display: 'block', width: 'calc(100% + 1.3px)', height: '40px' }}>
          <path d="M0,0 C150,90 350,-40 500,40 C650,120 900,10 1200,40 L1200,0 L0,0 Z" fill="#ffffff"></path>
        </svg>
      </div>

      <div className="container" style={{ paddingTop: '50px', paddingBottom: '50px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px', marginBottom: '50px' }}>
          {/* Column 1: Brand & Bio */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, var(--primary-ocean) 0%, var(--primary-turquoise) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Waves color="#ffffff" size={24} strokeWidth={2.4} />
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', color: '#ffffff', display: 'block' }}>
                  SNORKELING <span style={{ color: 'var(--primary-turquoise)' }}>GILI</span>
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--primary-aqua)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Gili Trawangan • 3 Gili
                </span>
              </div>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.7', marginBottom: '20px' }}>
              {t.footer.aboutText}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(37, 211, 102, 0.2)',
                  color: '#25d366',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(37, 211, 102, 0.4)',
                  transition: 'transform 0.2s',
                }}
              >
                <MessageCircle size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'transform 0.2s',
                }}
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'transform 0.2s',
                }}
                aria-label="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '20px', letterSpacing: '-0.01em' }}>
              {t.footer.quickLinks}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>
                <NextLink href="/" style={{ color: '#94a3b8', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                  {t.nav.home}
                </NextLink>
              </li>
              <li>
                <NextLink href="/paket" style={{ color: '#94a3b8', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                  {t.nav.packages}
                </NextLink>
              </li>
              <li>
                <NextLink href="/gallery" style={{ color: '#94a3b8', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                  {t.nav.gallery}
                </NextLink>
              </li>
              <li>
                <NextLink href="/tentang" style={{ color: '#94a3b8', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                  {t.nav.about}
                </NextLink>
              </li>
              <li>
                <NextLink href="/faq" style={{ color: '#94a3b8', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                  {t.nav.faq}
                </NextLink>
              </li>
              <li>
                <NextLink href="/booking" style={{ color: 'var(--primary-turquoise)', fontWeight: 600, fontSize: '0.9rem' }}>
                  {t.nav.bookNow} →
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Column 3: Featured Tours */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '20px', letterSpacing: '-0.01em' }}>
              {t.footer.popularTours}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>
                <NextLink href="/paket/public-sharing-trip-3-gili" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                  Public Sharing Trip (3 Gili)
                </NextLink>
              </li>
              <li>
                <NextLink href="/paket/private-glass-bottom-boat" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                  Private Glass Bottom Boat
                </NextLink>
              </li>
              <li>
                <NextLink href="/paket/sunset-snorkeling-private-tour" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                  Sunset Snorkeling Tour
                </NextLink>
              </li>
              <li>
                <NextLink href="/paket/speed-boat-snorkeling-lombok-gili" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                  Speedboat Lombok - 3 Gili
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Meeting Point */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '20px', letterSpacing: '-0.01em' }}>
              {t.footer.contactUs}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={18} color="var(--primary-turquoise)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.5' }}>
                  {address}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} color="var(--primary-turquoise)" style={{ flexShrink: 0 }} />
                <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                  {phone}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={18} color="var(--primary-turquoise)" style={{ flexShrink: 0 }} />
                <a href={`mailto:${email}`} style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                  {email}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageCircle size={18} color="#25d366" style={{ flexShrink: 0 }} />
                <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" style={{ color: '#25d366', fontWeight: 600, fontSize: '0.88rem' }}>
                  WhatsApp: +{whatsapp}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
            © {new Date().getFullYear()} Trip Snorkeling Gili Trawangan. {t.footer.rights}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <NextLink
              href="/admin"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#64748b',
                fontSize: '0.8rem',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
            >
              <Lock size={13} />
              Admin Portal
            </NextLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
