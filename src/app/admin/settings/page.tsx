'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, Phone, MessageCircle, Mail, MapPin } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

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
      .catch((e) => console.error(e));
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(false);

    try {
      // update each setting
      const promises = Object.entries(settings).map(([key, value]) =>
        fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value }),
        })
      );

      await Promise.all(promises);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div>Memuat pengaturan website...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--primary-deep)', marginBottom: '4px' }}>
            Pengaturan Kontak & Website
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Atur nomor WhatsApp, telepon, email, lokasi meeting point, dan akun sosial media.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 20px',
            borderRadius: 'var(--radius-md)',
            background: '#d1fae5',
            color: '#065f46',
            marginBottom: '24px',
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={20} />
          <span>Pengaturan website berhasil disimpan!</span>
        </div>
      )}

      <div className="glass-card" style={{ padding: '36px', background: '#ffffff' }}>
        <form onSubmit={handleSubmit}>
          {/* WhatsApp & Phone */}
          <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-deep)', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
            Kontak WhatsApp & Telepon
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div className="form-group">
              <label className="form-label">Nomor WhatsApp Utama (Format 62... tanpa + atau spasi) *</label>
              <input
                type="text"
                className="form-control"
                value={settings['whatsapp_number'] || ''}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                placeholder="6287864551234"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Nomor Telepon Hotline</label>
              <input
                type="text"
                className="form-control"
                value={settings['phone'] || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+62 878-6455-1234"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label">Pesan Pembuka Default WhatsApp</label>
            <input
              type="text"
              className="form-control"
              value={settings['whatsapp_message'] || ''}
              onChange={(e) => handleChange('whatsapp_message', e.target.value)}
            />
          </div>

          {/* Location & Email */}
          <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-deep)', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
            Alamat & Email
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
            <div className="form-group">
              <label className="form-label">Email Resmi</label>
              <input
                type="email"
                className="form-control"
                value={settings['email'] || ''}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Lokasi / Alamat Meeting Point</label>
              <input
                type="text"
                className="form-control"
                value={settings['address'] || ''}
                onChange={(e) => handleChange('address', e.target.value)}
              />
            </div>
          </div>

          {/* Social Media Links */}
          <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-deep)', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
            Media Sosial
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div className="form-group">
              <label className="form-label">Link Instagram</label>
              <input
                type="url"
                className="form-control"
                value={settings['instagram_url'] || ''}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Link Facebook</label>
              <input
                type="url"
                className="form-control"
                value={settings['facebook_url'] || ''}
                onChange={(e) => handleChange('facebook_url', e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
            <div className="form-group">
              <label className="form-label">Link TikTok</label>
              <input
                type="url"
                className="form-control"
                value={settings['tiktok_url'] || ''}
                onChange={(e) => handleChange('tiktok_url', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Link Google Maps Meeting Point</label>
              <input
                type="url"
                className="form-control"
                value={settings['google_maps_url'] || ''}
                onChange={(e) => handleChange('google_maps_url', e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="submit" className="btn btn-primary btn-lg">
              <Save size={18} />
              <span>Simpan Semua Pengaturan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
