import React from 'react';
import PackageCard from '@/components/public/PackageCard';
import CtaBanner from '@/components/public/CtaBanner';
import { getPackagesList, getSettings } from '@/lib/data';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Waves, Compass, MessageCircle, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PackagesPage() {
  const t = await getTranslations();
  const allPackages = await getPackagesList();
  const settings = await getSettings();
  const waSetting = settings.find((s) => s.key === 'whatsapp_number');
  const whatsappNumber = waSetting?.value || '6287864551234';

  const activePackages = allPackages.filter((p) => p.isActive);

  return (
    <div>
      {/* Page Header */}
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
            <span>{t('packages.sectionBadge')}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', color: '#ffffff', marginBottom: '16px' }}>
            {t('packages.allPackagesTitle')}
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.85)', maxWidth: '640px', margin: '0 auto' }}>
            {t('packages.allPackagesSubtitle')}
          </p>
        </div>
      </section>

      {/* Packages Grid or Empty State */}
      <section className="section">
        <div className="container">
          {activePackages.length > 0 ? (
            <div className="grid-3">
              {activePackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          ) : (
            <div
              className="glass-card"
              style={{
                maxWidth: '680px',
                margin: '0 auto',
                padding: '52px 32px',
                textAlign: 'center',
                borderRadius: '24px',
                border: '1px dashed rgba(0, 180, 216, 0.35)',
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 249, 255, 0.85) 100%)',
                boxShadow: '0 20px 40px -15px rgba(0, 119, 182, 0.08)',
              }}
            >
              <div
                style={{
                  width: '76px',
                  height: '76px',
                  borderRadius: '50%',
                  background: 'rgba(0, 180, 216, 0.12)',
                  color: 'var(--primary-ocean)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <Compass size={38} />
              </div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-deep)', marginBottom: '12px', fontWeight: 700 }}>
                {t('packages.noPackagesTitle')}
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: '520px', margin: '0 auto 28px' }}>
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
                <Link href="/" className="btn btn-secondary btn-lg">
                  <ArrowLeft size={18} />
                  <span>{t('nav.home')}</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <CtaBanner whatsappNumber={whatsappNumber} />
    </div>
  );
}
