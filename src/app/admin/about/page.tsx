'use client';

import React, { useState, useEffect } from 'react';
import { Info, Save, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminAboutPage() {
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
          {/* Main Titles */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div className="form-group">
              <label className="form-label">Judul Utama Halaman (ID)</label>
              <input
                type="text"
                className="form-control"
                value={formData.titleId || ''}
                onChange={(e) => setFormData({ ...formData, titleId: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Judul Utama Halaman (EN)</label>
              <input
                type="text"
                className="form-control"
                value={formData.titleEn || ''}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Subtitles */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div className="form-group">
              <label className="form-label">Subjudul Halaman (ID)</label>
              <input
                type="text"
                className="form-control"
                value={formData.subtitleId || ''}
                onChange={(e) => setFormData({ ...formData, subtitleId: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Subjudul Halaman (EN)</label>
              <input
                type="text"
                className="form-control"
                value={formData.subtitleEn || ''}
                onChange={(e) => setFormData({ ...formData, subtitleEn: e.target.value })}
              />
            </div>
          </div>

          {/* Story ID */}
          <div className="form-group">
            <label className="form-label">Cerita & Nilai Dedikasi (Bahasa Indonesia)</label>
            <textarea
              className="form-control"
              rows={4}
              value={formData.storyId || ''}
              onChange={(e) => setFormData({ ...formData, storyId: e.target.value })}
              required
            />
          </div>

          {/* Story EN */}
          <div className="form-group">
            <label className="form-label">Cerita & Nilai Dedikasi (English)</label>
            <textarea
              className="form-control"
              rows={4}
              value={formData.storyEn || ''}
              onChange={(e) => setFormData({ ...formData, storyEn: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">URL Foto Dokumentasi Perahu / Tim</label>
            <input
              type="url"
              className="form-control"
              value={formData.imageUrl || ''}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
            {formData.imageUrl && (
              <div style={{ marginTop: '12px', height: '180px', borderRadius: '8px', overflow: 'hidden' }}>
                <img src={formData.imageUrl} alt="About preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
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
