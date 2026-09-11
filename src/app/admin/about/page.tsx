'use client';

import React, { useState, useEffect } from 'react';
import { Info, Save, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import ImageUpload from '@/components/admin/ImageUpload';
import AdminLanguageTabs from '@/components/admin/AdminLanguageTabs';

export default function AdminAboutPage() {
  const [activeLang, setActiveLang] = useState<'id' | 'en'>('id');
  const [formData, setFormData] = useState({
    titleId: '',
    titleEn: '',
    subtitleId: '',
    subtitleEn: '',
    storyId: '',
    storyEn: '',
    imageUrl: '',
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch('/api/about')
      .then((res) => res.json())
      .then((data) => {
        setFormData(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        toast.error('Gagal memuat konten Tentang Kami');
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titleId?.trim()) {
      setActiveLang('id');
      toast.error('Judul utama halaman (Bahasa Indonesia) wajib diisi');
      return;
    }
    if (!formData.storyId?.trim()) {
      setActiveLang('id');
      toast.error('Cerita & nilai dedikasi (Bahasa Indonesia) wajib diisi');
      return;
    }
    if (!formData.titleEn?.trim()) {
      setActiveLang('en');
      toast.error('Judul utama halaman (English) wajib diisi');
      return;
    }
    if (!formData.storyEn?.trim()) {
      setActiveLang('en');
      toast.error('Cerita & nilai dedikasi (English) wajib diisi');
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading('Menyimpan perubahan Tentang Kami...');

    try {
      const res = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Gagal menyimpan');
      toast.success('Perubahan halaman Tentang Kami berhasil disimpan!', { id: toastId });
    } catch (e: any) {
      toast.error(e.message || 'Gagal menyimpan perubahan', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-ocean)' }}>
        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
        <span>Memuat data tentang kami...</span>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--primary-deep)', marginBottom: '4px' }}>
            Edit Halaman Tentang Kami
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Ubah cerita dedikasi bisnis, visi pelestarian laut, dan profil usaha.
          </p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '36px', background: '#ffffff' }}>
        <form onSubmit={handleSubmit}>
          {/* Language Switcher Tabs */}
          <AdminLanguageTabs
            activeLang={activeLang}
            onChange={setActiveLang}
            hasErrorId={!formData.titleId?.trim() || !formData.storyId?.trim()}
            hasErrorEn={!formData.titleEn?.trim() || !formData.storyEn?.trim()}
          />

          {activeLang === 'id' ? (
            <>
              {/* Title ID */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">
                  Judul Utama Halaman (ID) <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Contoh: Dedikasi Kami untuk Wisata Snorkeling Berkelanjutan"
                  value={formData.titleId || ''}
                  onChange={(e) => setFormData({ ...formData, titleId: e.target.value })}
                  required
                />
              </div>

              {/* Subtitle ID */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Subjudul Halaman (ID)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Contoh: Menghubungkan Anda dengan Keindahan Alami 3 Gili Lombok Sejak 2018"
                  value={formData.subtitleId || ''}
                  onChange={(e) => setFormData({ ...formData, subtitleId: e.target.value })}
                />
              </div>

              {/* Story ID */}
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">
                  Cerita & Nilai Dedikasi (Bahasa Indonesia) <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
                </label>
                <textarea
                  className="form-control"
                  rows={6}
                  placeholder="Cerita latar belakang tim, pemandu lokal terpercaya, dan komitmen menjaga kelestarian terumbu karang..."
                  value={formData.storyId || ''}
                  onChange={(e) => setFormData({ ...formData, storyId: e.target.value })}
                  required
                />
              </div>
            </>
          ) : (
            <>
              {/* Title EN */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">
                  Judul Utama Halaman (EN) <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Our Passion for Sustainable Snorkeling Adventures"
                  value={formData.titleEn || ''}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  required
                />
              </div>

              {/* Subtitle EN */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Subjudul Halaman (EN)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Connecting You with the Pristine Marine Wonders of 3 Gili Since 2018"
                  value={formData.subtitleEn || ''}
                  onChange={(e) => setFormData({ ...formData, subtitleEn: e.target.value })}
                />
              </div>

              {/* Story EN */}
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">
                  Cerita & Nilai Dedikasi (English) <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
                </label>
                <textarea
                  className="form-control"
                  rows={6}
                  placeholder="Story about your local captain team, safety guidelines, and coral reef conservation efforts..."
                  value={formData.storyEn || ''}
                  onChange={(e) => setFormData({ ...formData, storyEn: e.target.value })}
                  required
                />
              </div>
            </>
          )}

          {/* Documentation Team / Boat Image Upload (Shared) */}
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '24px', marginTop: '10px' }}>
            <ImageUpload
              label="Foto Dokumentasi Perahu / Tim"
              value={formData.imageUrl || ''}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              helperText="Upload foto armada kapal atau tim pemandu (JPG, PNG, WebP maks 10MB)"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '28px' }}>
            <button
              type="submit"
              disabled={isSaving}
              className="btn btn-primary btn-lg"
              style={{ opacity: isSaving ? 0.85 : 1, cursor: isSaving ? 'not-allowed' : 'pointer' }}
            >
              {isSaving ? (
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <Save size={18} />
              )}
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
