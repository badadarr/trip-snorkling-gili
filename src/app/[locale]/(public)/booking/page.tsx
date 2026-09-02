import React from 'react';
import BookingForm from '@/components/public/BookingForm';
import { getPackagesList, getSettings } from '@/lib/data';
import { getTranslations } from 'next-intl/server';
import { Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ package?: string }>;
}

export default async function BookingPage({ searchParams }: PageProps) {
  const t = await getTranslations('booking');
  const params = await searchParams;
  const packagesList = await getPackagesList();
  const settings = await getSettings();

  const waSetting = settings.find((s) => s.key === 'whatsapp_number');
  const whatsappNumber = waSetting?.value || '6282236851307';

  const activePackages = packagesList.filter((p) => p.isActive);

  return (
    <div>
      {/* Header */}
      <section
        style={{
          paddingTop: '80px',
          paddingBottom: '50px',
          background: 'linear-gradient(135deg, var(--primary-deep) 0%, var(--primary-ocean) 100%)',
          color: '#ffffff',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <div className="section-badge badge-white" style={{ display: 'inline-flex', marginBottom: '16px' }}>
            <Calendar size={14} />
            <span>{t('badge')}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', color: '#ffffff', marginBottom: '16px' }}>
            {t('title')}
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.85)', maxWidth: '640px', margin: '0 auto' }}>
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Form Container */}
      <section className="section section-alt">
        <div className="container">
          <BookingForm
            packagesList={activePackages}
            initialSlug={params.package}
            whatsappNumber={whatsappNumber}
            siteSettings={settings}
          />
        </div>
      </section>
    </div>
  );
}
