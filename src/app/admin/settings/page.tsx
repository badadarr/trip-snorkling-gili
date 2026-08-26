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
  Printer,
  FileCode,
  RotateCcw,
  Sparkles,
  Eye,
  Ship,
  UserCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { DEFAULT_MANIFEST_SETTINGS, generateManifestHtml } from '@/lib/manifestTemplate';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'contact' | 'location' | 'operations' | 'social' | 'manifest'>('contact');

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
          { key: 'manifest', label: '5. Preset & Template Laporan Manifest', icon: Printer },
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

          {/* TAB 5: MANIFEST REPORT PRESETS & TEMPLATES */}
          {activeTab === 'manifest' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-deep)', margin: 0 }}>
                    Preset Desain & Template Laporan Manifest (PDF & HTML)
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                    Pilih preset tata letak default, atur teks kop surat, informasi armada, checklist alat, dan sesuaikan template HTML jika diperlukan.
                  </p>
                </div>
              </div>

              {/* Preset Selector Cards */}
              <div style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '10px', display: 'block' }}>
                  Pilihan Preset Desain Default:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                  {[
                    {
                      id: 'modern',
                      name: 'Modern Ocean',
                      type: 'Landscape (A4)',
                      desc: 'Desain modern bernuansa laut lengkap dengan kartu KPI, tabel data, checklist alat & 3 kolom tanda tangan.',
                      icon: Sparkles,
                    },
                    {
                      id: 'compact',
                      name: 'Dermaga Compact',
                      type: 'Portrait (A4)',
                      desc: 'Format checklist ringkas & hemat kertas khusus kru lapangan / pelabuhan untuk absensi tamu & alat.',
                      icon: Printer,
                    },
                    {
                      id: 'official',
                      name: 'Resmi Operator Sheet',
                      type: 'Landscape (A4)',
                      desc: 'Kop formal klasik dengan nomor surat, tabel standar, klausul asuransi dan tanda tangan manajemen.',
                      icon: UserCheck,
                    },
                    {
                      id: 'custom',
                      name: 'Custom HTML Template',
                      type: 'Kustom Penuh',
                      desc: 'Gunakan template HTML kustom bebas dengan placeholder variabel dinamis {{tag}}.',
                      icon: FileCode,
                    },
                  ].map((p) => {
                    const currentPreset = settings['manifest_default_preset'] || 'modern';
                    const isSelected = currentPreset === p.id;
                    const Icon = p.icon;
                    return (
                      <div
                        key={p.id}
                        onClick={() => handleChange('manifest_default_preset', p.id)}
                        style={{
                          border: isSelected ? '2px solid var(--primary-ocean)' : '1px solid var(--border-light)',
                          background: isSelected ? '#f0f9ff' : '#ffffff',
                          borderRadius: 'var(--radius-md)',
                          padding: '16px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          boxShadow: isSelected ? '0 4px 12px rgba(2, 132, 199, 0.12)' : 'none',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Icon size={16} color={isSelected ? 'var(--primary-ocean)' : '#64748b'} />
                              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: isSelected ? 'var(--primary-ocean)' : 'var(--primary-deep)' }}>
                                {p.name}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.72rem', background: isSelected ? 'var(--primary-ocean)' : '#e2e8f0', color: isSelected ? '#ffffff' : '#475569', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                              {p.type}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                            {p.desc}
                          </p>
                        </div>
                        {isSelected && (
                          <div style={{ marginTop: '12px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-ocean)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={14} />
                            <span>Preset Terpilih</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Header & Branding Info */}
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--primary-deep)', marginTop: 0, marginBottom: '14px' }}>
                  1. Informasi Kop & Branding Dokumen
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', marginBottom: '14px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Nama Perusahaan / Operator di Kop Manifest</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings['manifest_company_name'] !== undefined ? settings['manifest_company_name'] : DEFAULT_MANIFEST_SETTINGS.companyName}
                      onChange={(e) => handleChange('manifest_company_name', e.target.value)}
                      placeholder="TRIP SNORKELING GILI TRAWANGAN"
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Subheader / Slogan Wisata</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings['manifest_subheader'] !== undefined ? settings['manifest_subheader'] : DEFAULT_MANIFEST_SETTINGS.subheader}
                      onChange={(e) => handleChange('manifest_subheader', e.target.value)}
                      placeholder="Layanan Wisata Snorkeling Terpercaya 3 Gili"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Kontak WhatsApp & Telepon di Kop Dokumen</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings['manifest_contact_info'] !== undefined ? settings['manifest_contact_info'] : (settings['phone'] || DEFAULT_MANIFEST_SETTINGS.phone)}
                    onChange={(e) => handleChange('manifest_contact_info', e.target.value)}
                    placeholder="+62 859-2135-8615 / 6287864551234"
                  />
                </div>
              </div>

              {/* Default Armada & Kru */}
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--primary-deep)', marginTop: 0, marginBottom: '14px' }}>
                  2. Armada Default & Petugas Lapangan
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Nama Perahu / Boat Default</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings['manifest_default_boat'] !== undefined ? settings['manifest_default_boat'] : DEFAULT_MANIFEST_SETTINGS.defaultBoat}
                      onChange={(e) => handleChange('manifest_default_boat', e.target.value)}
                      placeholder="Glass Bottom Boat - Dolphin 01"
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Nama Kapten / Guide Default</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings['manifest_default_captain'] !== undefined ? settings['manifest_default_captain'] : DEFAULT_MANIFEST_SETTINGS.defaultCaptain}
                      onChange={(e) => handleChange('manifest_default_captain', e.target.value)}
                      placeholder="Kapten Rahman / Pemandu Budi"
                    />
                  </div>
                </div>
              </div>

              {/* Column Visibility Toggles */}
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--primary-deep)', marginTop: 0, marginBottom: '12px' }}>
                  3. Opsi Kolom Tabel Manifest
                </h4>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                    <input
                      type="checkbox"
                      checked={settings['manifest_show_equipment_checklist'] !== 'false'}
                      onChange={(e) => handleChange('manifest_show_equipment_checklist', e.target.checked ? 'true' : 'false')}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--primary-ocean)' }}
                    />
                    <span>Sediakan Kolom Checklist Alat (Masker & Fin)</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                    <input
                      type="checkbox"
                      checked={settings['manifest_show_pickup_notes'] !== 'false'}
                      onChange={(e) => handleChange('manifest_show_pickup_notes', e.target.checked ? 'true' : 'false')}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--primary-ocean)' }}
                    />
                    <span>Tampilkan Kolom Titik Jemput & Catatan Khusus Tamu</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                    <input
                      type="checkbox"
                      checked={settings['manifest_show_prices'] !== 'false'}
                      onChange={(e) => handleChange('manifest_show_prices', e.target.checked ? 'true' : 'false')}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--primary-ocean)' }}
                    />
                    <span>Tampilkan Kolom Total Biaya / Omset Transaksi</span>
                  </label>
                </div>
              </div>

              {/* Footer Safety Notes */}
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--primary-deep)', marginTop: 0, marginBottom: '6px' }}>
                  4. Catatan Kaki, Syarat & Ketentuan Keselamatan (Footer)
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Teks himbauan keselamatan laut, instruksi pelampung, atau klausul disclaimer di bagian bawah manifest.
                </p>
                <textarea
                  className="form-control"
                  rows={3}
                  value={settings['manifest_footer_notes'] !== undefined ? settings['manifest_footer_notes'] : DEFAULT_MANIFEST_SETTINGS.footerNotes}
                  onChange={(e) => handleChange('manifest_footer_notes', e.target.value)}
                  placeholder="Himbauan keselamatan dan peraturan trip..."
                />
              </div>

              {/* Custom HTML Template Editor */}
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--primary-deep)', margin: 0 }}>
                      5. Editor Template HTML Manifest Kustom
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                      Digunakan saat memilih preset <strong>"Custom HTML Template"</strong> atau untuk merancang desain dokumen mandiri.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      handleChange('manifest_custom_html_template', DEFAULT_MANIFEST_SETTINGS.customHtmlTemplate || '');
                      toast.info('Template HTML dikembalikan ke standar default.');
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <RotateCcw size={13} />
                    <span>Reset ke Template Default</span>
                  </button>
                </div>

                {/* Placeholders Cheatsheet */}
                <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--primary-navy)', display: 'block', marginBottom: '6px' }}>
                    Variabel Dinamis Yang Didukung:
                  </span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {[
                      '{{companyName}}',
                      '{{subheader}}',
                      '{{phone}}',
                      '{{email}}',
                      '{{address}}',
                      '{{tripDate}}',
                      '{{tripSession}}',
                      '{{boatName}}',
                      '{{captainName}}',
                      '{{totalPax}}',
                      '{{totalBookings}}',
                      '{{totalRevenue}}',
                      '{{bookingsTable}}',
                      '{{footerNotes}}',
                      '{{printDate}}',
                    ].map((tag) => (
                      <code
                        key={tag}
                        style={{
                          background: '#f1f5f9',
                          color: '#0369a1',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontFamily: 'monospace',
                          fontWeight: 600,
                        }}
                      >
                        {tag}
                      </code>
                    ))}
                  </div>
                </div>

                <textarea
                  className="form-control"
                  rows={12}
                  value={settings['manifest_custom_html_template'] !== undefined ? settings['manifest_custom_html_template'] : DEFAULT_MANIFEST_SETTINGS.customHtmlTemplate}
                  onChange={(e) => handleChange('manifest_custom_html_template', e.target.value)}
                  style={{
                    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                    fontSize: '0.82rem',
                    lineHeight: 1.45,
                    background: '#0f172a',
                    color: '#f8fafc',
                  }}
                  placeholder="<!DOCTYPE html><html>..."
                />
              </div>

              {/* Live Preview Card */}
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--primary-deep)', margin: 0 }}>
                      Pratinjau Dokumen Langsung (Live Preview)
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                      Tampilan visual sesuai pengaturan dan preset yang sedang Anda pilih di atas.
                    </p>
                  </div>
                </div>

                <div style={{ background: '#64748b', padding: '16px', borderRadius: '6px', overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
                  <iframe
                    srcDoc={generateManifestHtml({
                      bookings: [
                        {
                          id: 1,
                          bookingCode: 'GILI-2026-001',
                          customerName: 'Ahmad Fauzi & Rombongan',
                          customerPhone: '+62 812-3456-7890',
                          packageName: 'Private Glass Bottom Boat 3 Gili',
                          tripDate: new Date().toISOString().split('T')[0],
                          tripSession: 'morning',
                          numberOfPeople: 4,
                          totalPriceIdr: 950000,
                          status: 'confirmed',
                          pickupLocation: 'Hotel Aston Sunset Gili T',
                          specialRequests: 'Lifejacket anak 2 pcs',
                        },
                        {
                          id: 2,
                          bookingCode: 'GILI-2026-002',
                          customerName: 'Sarah Jenkins',
                          customerPhone: '+61 412 345 678',
                          packageName: 'Public Sharing Trip Snorkeling',
                          tripDate: new Date().toISOString().split('T')[0],
                          tripSession: 'morning',
                          numberOfPeople: 2,
                          totalPriceIdr: 300000,
                          status: 'confirmed',
                          pickupLocation: 'Meeting Point Dermaga',
                          specialRequests: 'GoPro transfer to iPhone',
                        },
                        {
                          id: 3,
                          bookingCode: 'GILI-2026-003',
                          customerName: 'Rian Pratama',
                          customerPhone: '+62 878-1122-3344',
                          packageName: 'Sunset Snorkeling Turtle Point',
                          tripDate: new Date().toISOString().split('T')[0],
                          tripSession: 'morning',
                          numberOfPeople: 3,
                          totalPriceIdr: 450000,
                          status: 'pending',
                          pickupLocation: 'Villa Ombak',
                          specialRequests: 'Fin size 42 & 38',
                        },
                      ],
                      boatName: settings['manifest_default_boat'] || DEFAULT_MANIFEST_SETTINGS.defaultBoat,
                      captainName: settings['manifest_default_captain'] || DEFAULT_MANIFEST_SETTINGS.defaultCaptain,
                      settings: {
                        companyName: settings['manifest_company_name'] || DEFAULT_MANIFEST_SETTINGS.companyName,
                        subheader: settings['manifest_subheader'] || DEFAULT_MANIFEST_SETTINGS.subheader,
                        phone: settings['manifest_contact_info'] || settings['phone'] || DEFAULT_MANIFEST_SETTINGS.phone,
                        email: settings['email'] || DEFAULT_MANIFEST_SETTINGS.email,
                        address: settings['address'] || DEFAULT_MANIFEST_SETTINGS.address,
                        defaultBoat: settings['manifest_default_boat'] || DEFAULT_MANIFEST_SETTINGS.defaultBoat,
                        defaultCaptain: settings['manifest_default_captain'] || DEFAULT_MANIFEST_SETTINGS.defaultCaptain,
                        footerNotes: settings['manifest_footer_notes'] || DEFAULT_MANIFEST_SETTINGS.footerNotes,
                        showEquipmentChecklist: settings['manifest_show_equipment_checklist'] !== 'false',
                        showPickupNotes: settings['manifest_show_pickup_notes'] !== 'false',
                        showPrices: settings['manifest_show_prices'] !== 'false',
                        customHtmlTemplate: settings['manifest_custom_html_template'] || DEFAULT_MANIFEST_SETTINGS.customHtmlTemplate,
                        preset: (settings['manifest_default_preset'] as any) || 'modern',
                      },
                      presetOverride: (settings['manifest_default_preset'] as any) || 'modern',
                    })}
                    title="Live Manifest Preview in Settings"
                    style={{
                      width: settings['manifest_default_preset'] === 'compact' ? '740px' : '960px',
                      maxWidth: '100%',
                      minHeight: '480px',
                      height: '520px',
                      background: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                    }}
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
