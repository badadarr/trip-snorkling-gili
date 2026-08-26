import React from 'react';
import PackageCard from '@/components/public/PackageCard';
import CtaBanner from '@/components/public/CtaBanner';
import { getPackagesList, getSettings } from '@/lib/data';
import { getTranslations } from 'next-intl/server';
import { Waves } from 'lucide-react';

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

      {/* Packages Grid */}
      <section className="section">
        <div className="container">
          <div className="grid-3">
            {activePackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CtaBanner whatsappNumber={whatsappNumber} />
    </div>
  );
}
