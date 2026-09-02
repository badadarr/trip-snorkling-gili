import React from 'react';
import FaqAccordion from '@/components/public/FaqAccordion';
import CtaBanner from '@/components/public/CtaBanner';
import { getFaqList, getSettings } from '@/lib/data';
import { getTranslations } from 'next-intl/server';
import { HelpCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function FaqPage() {
  const t = await getTranslations('faq');
  const faqs = await getFaqList();
  const settings = await getSettings();
  const waSetting = settings.find((s) => s.key === 'whatsapp_number');
  const whatsappNumber = waSetting?.value || '6282236851307';

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
            <HelpCircle size={14} />
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

      {/* FAQ Accordion Section */}
      <section className="section">
        <div className="container">
          <FaqAccordion items={faqs} />
        </div>
      </section>

      {/* CTA */}
      <CtaBanner whatsappNumber={whatsappNumber} />
    </div>
  );
}
