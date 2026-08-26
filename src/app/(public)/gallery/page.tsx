import React from 'react';
import GalleryGrid from '@/components/public/GalleryGrid';
import CtaBanner from '@/components/public/CtaBanner';
import { getGalleryList, getSettings } from '@/lib/data';
import { Camera } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const galleryItems = await getGalleryList();
  const settings = await getSettings();
  const waSetting = settings.find((s) => s.key === 'whatsapp_number');
  const whatsappNumber = waSetting?.value || '6287864551234';

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
            <Camera size={14} />
            <span>DOKUMENTASI FOTO</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', color: '#ffffff', marginBottom: '16px' }}>
            Galeri Snorkeling 3 Gili
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.85)', maxWidth: '640px', margin: '0 auto' }}>
            Lihat keindahan bawah laut Gili Trawangan, Gili Meno, dan Gili Air yang diabadikan oleh tim kami dan tamu-tamu kami.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section">
        <div className="container">
          <GalleryGrid items={galleryItems} />
        </div>
      </section>

      {/* CTA */}
      <CtaBanner whatsappNumber={whatsappNumber} />
    </div>
  );
}
