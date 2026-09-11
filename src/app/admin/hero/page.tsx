'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Save, CheckCircle2, Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import ImageUpload from '@/components/admin/ImageUpload';
import AdminLanguageTabs from '@/components/admin/AdminLanguageTabs';

export default function AdminHeroPage() {
  const [activeLang, setActiveLang] = useState<'id' | 'en'>('id');
  const [formData, setFormData] = useState({
    badgeId: '',
    badgeEn: '',
    titleId: '',
    titleEn: '',
    subtitleId: '',
    subtitleEn: '',
    backgroundImage: '',
    ctaTextId: '',
    ctaTextEn: '',
    ctaLink: '',
    secondaryCtaId: '',
    secondaryCtaEn: '',
    secondaryCtaLink: '',
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch('/api/hero')
      .then((res) => res.json())
      .then((data) => {
        setFormData(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        toast.error('Gagal memuat konten Hero');
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleId?.trim()) {
      setActiveLang('id');
      toast.error('Judul utama H1 (Bahasa Indonesia) wajib diisi');
      return;
    }
    if (!formData.titleEn?.trim()) {
      setActiveLang('en');
      toast.error('Judul utama H1 (English) wajib diisi');
      return;
    }
    setIsSaving(true);
    const toastId = toast.loading('Menyimpan perubahan Hero Banner...');

    try {
      const res = await fetch('/api/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Gagal menyimpan');
      toast.success('Perubahan Hero Banner berhasil disimpan!', { id: toastId });
    } catch (e: any) {
      toast.error(e.message || 'Gagal menyimpan perubahan', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div>Memuat data hero banner...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--primary-deep)', marginBottom: '4px' }}>
            Edit Konten Hero Banner
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Ubah judul utama, tagline bilingual, foto latar belakang, dan tombol aksi di halaman depan.
          </p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '36px', background: '#ffffff' }}>
        <form onSubmit={handleSubmit}>
          {/* Language Switcher Tabs */}
          <AdminLanguageTabs
            activeLang={activeLang}
            onChange={setActiveLang}
            hasErrorId={!formData.titleId?.trim()}
            hasErrorEn={!formData.titleEn?.trim()}
          />

          {activeLang === 'id' ? (
            <>
              {/* Badge Tag ID */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Badge Tag (Bahasa Indonesia)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Contoh: BEST SNORKELING TRIP IN GILI"
                  value={formData.badgeId || ''}
                  onChange={(e) => setFormData({ ...formData, badgeId: e.target.value })}
                />
              </div>

              {/* Main Title H1 ID */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">
                  Judul Utama H1 (Bahasa Indonesia) <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
                </label>
                <textarea
                  className="form-control"
                  placeholder="Contoh: Jelajahi Keindahan Bawah Laut 3 Gili Lombok"
                  value={formData.titleId || ''}
                  onChange={(e) => setFormData({ ...formData, titleId: e.target.value })}
                  rows={2}
                  required
                />
              </div>

              {/* Subtitle ID */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Deskripsi / Subjudul (Bahasa Indonesia)</label>
                <textarea
                  className="form-control"
                  placeholder="Deskripsi singkat yang tampil di bawah judul hero..."
                  value={formData.subtitleId || ''}
                  onChange={(e) => setFormData({ ...formData, subtitleId: e.target.value })}
                  rows={3}
                />
              </div>

              {/* CTA Text ID */}
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Teks Tombol Utama (ID)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Contoh: Booking Trip Sekarang"
                  value={formData.ctaTextId || ''}
                  onChange={(e) => setFormData({ ...formData, ctaTextId: e.target.value })}
                />
              </div>
            </>
          ) : (
            <>
              {/* Badge Tag EN */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Badge Tag (English)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. BEST SNORKELING TRIP IN GILI"
                  value={formData.badgeEn || ''}
                  onChange={(e) => setFormData({ ...formData, badgeEn: e.target.value })}
                />
              </div>

              {/* Main Title H1 EN */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">
                  Judul Utama H1 (English) <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
                </label>
                <textarea
                  className="form-control"
                  placeholder="e.g. Discover Underwater Wonders of 3 Gili Islands"
                  value={formData.titleEn || ''}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  rows={2}
                  required
                />
              </div>

              {/* Subtitle EN */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Deskripsi / Subjudul (English)</label>
                <textarea
                  className="form-control"
                  placeholder="Short subtitle description displayed under the hero title..."
                  value={formData.subtitleEn || ''}
                  onChange={(e) => setFormData({ ...formData, subtitleEn: e.target.value })}
                  rows={3}
                />
              </div>

              {/* CTA Text EN */}
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Teks Tombol Utama (EN)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Book Your Snorkeling Trip"
                  value={formData.ctaTextEn || ''}
                  onChange={(e) => setFormData({ ...formData, ctaTextEn: e.target.value })}
                />
              </div>
            </>
          )}

          {/* Background Image Upload (Shared across languages) */}
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '24px', marginTop: '10px' }}>
            <ImageUpload
              label="Foto Latar Belakang (Hero Background Image)"
              value={formData.backgroundImage || ''}
              onChange={(url) => setFormData({ ...formData, backgroundImage: url })}
              helperText="Upload foto lanskap pemandangan laut / sunset 3 Gili (JPG, PNG, WebP maks 10MB)"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px' }}>
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
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan Hero'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
