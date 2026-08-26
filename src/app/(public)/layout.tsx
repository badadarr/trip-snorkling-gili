import React from 'react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import WhatsAppButton from '@/components/public/WhatsAppButton';
import { getSettings } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const waSetting = settings.find((s) => s.key === 'whatsapp_number');
  const whatsappNumber = waSetting?.value || '6287864551234';

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh' }}>
        {children}
      </main>
      <Footer siteSettings={settings} />
      <WhatsAppButton whatsappNumber={whatsappNumber} />
    </>
  );
}
