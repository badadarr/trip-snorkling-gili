'use client';

import React, { useState, useEffect } from 'react';
import { Info, Save, CheckCircle2 } from 'lucide-react';

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
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/about')
      .then((res) => res.json())
      .then((data) => {
        setFormData(data);
        setLoading(false);
      })
      .catch((e) => console.error(e));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div>Memuat data tentang kami...</div>;
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
          <span>Perubahan data Tentang Kami berhasil disimpan!</span>
        </div>
      )}

      <div className="glass-card" style={{ padding: '36px', background: '#ffffff' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div className="form-group">
              <label className="form-label">Judul Utama (ID) *</label>
              <input
                type="text"
                className="form-control"
                value={formData.titleId || ''}
                onChange={(e) => setFormData({ ...formData, titleId: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Judul Utama (EN) *</label>
              <input
                type="text"
                className="form-control"
                value={formData.titleEn || ''}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div className="form-group">
              <label className="form-label">Subjudul (ID)</label>
              <input
                type="text"
                className="form-control"
                value={formData.subtitleId || ''}
                onChange={(e) => setFormData({ ...formData, subtitleId: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Subjudul (EN)</label>
              <input
                type="text"
                className="form-control"
                value={formData.subtitleEn || ''}
                onChange={(e) => setFormData({ ...formData, subtitleEn: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Cerita / Profil Usaha (Bahasa Indonesia) *</label>
            <textarea
              className="form-control"
              value={formData.storyId || ''}
              onChange={(e) => setFormData({ ...formData, storyId: e.target.value })}
              rows={5}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cerita / Profil Usaha (English) *</label>
            <textarea
              className="form-control"
              value={formData.storyEn || ''}
              onChange={(e) => setFormData({ ...formData, storyEn: e.target.value })}
              rows={5}
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
            <button type="submit" className="btn btn-primary btn-lg">
              <Save size={18} />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
