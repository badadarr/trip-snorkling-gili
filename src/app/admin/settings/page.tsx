'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Loader2,
  Clock,
  Globe,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'contact' | 'location' | 'operations' | 'social'>('contact');

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data: any[]) => {
        const map: { [key: string]: string } = {};
        data.forEach((item) => {
          map[item.key] = item.value;
        });
        setSettings(map);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        toast.error('Gagal memuat pengaturan website');
        setLoading(false);
      });
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const toastId = toast.loading('Menyimpan pengaturan website...');

    try {
      const promises = Object.entries(settings).map(([key, value]) =>
        fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value }),
        })
      );

      const results = await Promise.all(promises);
      const allOk = results.every((r) => r.ok);
      if (!allOk) throw new Error('Beberapa pengaturan gagal disimpan');

      toast.success('Pengaturan website berhasil disimpan!', { id: toastId });
    } catch (e: any) {
      toast.error(e.message || 'Gagal menyimpan pengaturan', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-ocean)', padding: '40px' }}>
        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
        <span>Memuat pengaturan website...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--primary-deep)', marginBottom: '4px' }}>
            Pengaturan Operasional & Website
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Konfigurasi nomor WhatsApp bisnis, lokasi counter dermaga, jadwal sesi default, dan integrasi sosial media.
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { key: 'contact', label: '1. Kontak & WhatsApp', icon: MessageCircle },
          { key: 'location', label: '2. Lokasi Dermaga & Maps', icon: MapPin },
          { key: 'operations', label: '3. Jam & Sesi Operasional', icon: Clock },
          { key: 'social', label: '4. Sosial Media & SEO', icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: 'var(--radius-sm)',
                border: isActive ? '1px solid var(--primary-ocean)' : '1px solid var(--border-light)',
                background: isActive ? 'var(--primary-ocean)' : '#ffffff',
                color: isActive ? '#ffffff' : 'var(--text-main)',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Container */}
      <div className="glass-card" style={{ padding: '32px', background: '#ffffff' }}>
        <form onSubmit={handleSubmit}>
          {/* TAB 1: CONTACT & WHATSAPP */}
          {activeTab === 'contact' && (
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-deep)', marginBottom: '6px' }}>
                Kontak Langsung & WhatsApp Bisnis
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Nomor ini akan digunakan sebagai tujuan utama tombol booking dan WhatsApp float di website publik.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">
                    Nomor WhatsApp Utama (Format: 628xxx) *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings['whatsapp_number'] || ''}
                    onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                    placeholder="6287864551234"
                    required
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Gunakan awalan 62 tanpa spasi / tanda plus untuk integrasi wa.me
                  </span>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Nomor Telepon Display Website</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings['phone'] || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+62 859-2135-8615"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Alamat Email Bisnis</label>
                <input
                  type="email"
                  className="form-control"
                  value={settings['email'] || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="info@snorkelinggilitrawangan.com"
                />
              </div>
            </div>
          )}

          {/* TAB 2: LOCATION & MAPS */}
          {activeTab === 'location' && (
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-deep)', marginBottom: '6px' }}>
                Lokasi Kantor & Meeting Point Dermaga
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Titik kumpul wisatawan sebelum naik kapal snorkeling di Gili Trawangan.
              </p>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Alamat Lengkap Counter / Meeting Point</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={settings['address'] || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Jl. Pantai Gili Trawangan (50 meter utara dermaga kapal cepat), Desa Gili Indah, Lombok Utara"
                />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Link Google Maps Lokasi</label>
                <input
                  type="url"
                  className="form-control"
                  value={settings['google_maps_url'] || ''}
                  onChange={(e) => handleChange('google_maps_url', e.target.value)}
                  placeholder="https://maps.google.com/?q=Gili+Trawangan"
                />
              </div>
            </div>
          )}

          {/* TAB 3: OPERATIONS & SESSIONS */}
          {activeTab === 'operations' && (
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-deep)', marginBottom: '6px' }}>
                Jam Operasional & Sesi Default Keberangkatan
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Atur jadwal buka counter dan waktu standar keberangkatan perahu.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Jam Operasional Counter</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings['operating_hours'] || '07:30 - 18:00 WITA (Setiap Hari)'}
                    onChange={(e) => handleChange('operating_hours', e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Jadwal Sesi Pagi Default</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings['morning_session_time'] || '09:30 WITA'}
                    onChange={(e) => handleChange('morning_session_time', e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Jadwal Sesi Siang Default</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings['afternoon_session_time'] || '13:00 WITA'}
                    onChange={(e) => handleChange('afternoon_session_time', e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Jadwal Sesi Sunset Default</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings['sunset_session_time'] || '16:00 WITA'}
                    onChange={(e) => handleChange('sunset_session_time', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SOCIAL MEDIA & SEO */}
          {activeTab === 'social' && (
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-deep)', marginBottom: '6px' }}>
                Media Sosial & SEO Website
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Tautan profil sosial media dan meta title halaman publik.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Link Akun Instagram</label>
                  <input
                    type="url"
                    className="form-control"
                    value={settings['instagram_url'] || ''}
                    onChange={(e) => handleChange('instagram_url', e.target.value)}
                    placeholder="https://instagram.com/tripsnorkelinggili"
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Link Akun TikTok</label>
                  <input
                    type="url"
                    className="form-control"
                    value={settings['tiktok_url'] || ''}
                    onChange={(e) => handleChange('tiktok_url', e.target.value)}
                    placeholder="https://tiktok.com/@tripsnorkelinggili"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Link Halaman Facebook</label>
                  <input
                    type="url"
                    className="form-control"
                    value={settings['facebook_url'] || ''}
                    onChange={(e) => handleChange('facebook_url', e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Link Kanal YouTube</label>
                  <input
                    type="url"
                    className="form-control"
                    value={settings['youtube_url'] || ''}
                    onChange={(e) => handleChange('youtube_url', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '28px',
              paddingTop: '20px',
              borderTop: '1px solid var(--border-light)',
            }}
          >
            <button
              type="submit"
              disabled={isSaving}
              className="btn btn-primary btn-lg"
              style={{
                opacity: isSaving ? 0.85 : 1,
                cursor: isSaving ? 'not-allowed' : 'pointer',
              }}
            >
              {isSaving ? (
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <Save size={18} />
              )}
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
