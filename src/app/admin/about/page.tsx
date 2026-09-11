'use client';

import React, { useState, useEffect } from 'react';
import {
  Info,
  Save,
  CheckCircle2,
  Loader2,
  BarChart3,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import ImageUpload from '@/components/admin/ImageUpload';
import AdminLanguageTabs from '@/components/admin/AdminLanguageTabs';

interface AboutStat {
  number: string;
  labelId: string;
  labelEn: string;
}

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
    stats: [] as AboutStat[],
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch('/api/about')
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          ...data,
          stats: Array.isArray(data?.stats) ? data.stats : [],
        });
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        toast.error('Gagal memuat konten Tentang Kami');
        setLoading(false);
      });
  }, []);

  // --- Statistik ringkas (tampil di kotak angka halaman Tentang Kami) ---
  const stats: AboutStat[] = formData.stats || [];

  const setStats = (list: AboutStat[]) =>
    setFormData((prev) => ({ ...prev, stats: list }));

  const updateStat = (index: number, field: keyof AboutStat, value: string) =>
    setStats(
      stats.map((stat, i) => (i === index ? { ...stat, [field]: value } : stat)),
    );

  const addStat = () =>
    setStats([...stats, { number: '', labelId: '', labelEn: '' }]);

  const removeStat = (index: number) =>
    setStats(stats.filter((_, i) => i !== index));

  const moveStat = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= stats.length) return;
    const list = [...stats];
    [list[index], list[target]] = [list[target], list[index]];
    setStats(list);
  };

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

    const payload = {
      ...formData,
      stats: (formData.stats || []).filter(
        (stat) => stat.number.trim() || stat.labelId.trim() || stat.labelEn.trim(),
      ),
    };

    try {
      const res = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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

          {/* Statistik Ringkas (Shared across languages) */}
          <div
            style={{
              borderTop: '1px solid var(--border-light)',
              paddingTop: '24px',
              marginTop: '10px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                flexWrap: 'wrap',
                marginBottom: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'var(--primary-surface)',
                    color: 'var(--primary-ocean)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: '1rem',
                      color: 'var(--primary-deep)',
                      margin: 0,
                      fontWeight: 700,
                    }}
                  >
                    Statistik Ringkas
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Kotak angka di halaman Tentang Kami (mis. 5.000+ Wisatawan Puas).
                    Angka dipakai untuk kedua bahasa, labelnya terpisah.
                  </span>
                </div>
              </div>
            </div>

            {stats.length === 0 && (
              <div
                style={{
                  padding: '22px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px dashed var(--border-light)',
                  background: '#f8fafc',
                  textAlign: 'center',
                  marginBottom: '14px',
                  fontSize: '0.86rem',
                  color: 'var(--text-muted)',
                }}
              >
                Belum ada statistik. Kotak angka tidak akan tampil di halaman
                Tentang Kami sampai Anda menambahkannya.
              </div>
            )}

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '14px',
              }}
            >
              {stats.map((stat, index) => (
                <div
                  key={index}
                  style={{
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    background: '#ffffff',
                    padding: '14px 16px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      flexWrap: 'wrap',
                      marginBottom: '12px',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: 'var(--primary-deep)',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'var(--primary-surface)',
                          color: 'var(--primary-ocean)',
                          fontSize: '0.75rem',
                        }}
                      >
                        {index + 1}
                      </span>
                      <span>{stat.number || 'Statistik Baru'}</span>
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => moveStat(index, -1)}
                        disabled={index === 0}
                        title="Pindah ke atas"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '5px 8px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-light)',
                          background: '#ffffff',
                          color: 'var(--primary-deep)',
                          cursor: index === 0 ? 'not-allowed' : 'pointer',
                          opacity: index === 0 ? 0.4 : 1,
                        }}
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveStat(index, 1)}
                        disabled={index === stats.length - 1}
                        title="Pindah ke bawah"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '5px 8px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-light)',
                          background: '#ffffff',
                          color: 'var(--primary-deep)',
                          cursor:
                            index === stats.length - 1 ? 'not-allowed' : 'pointer',
                          opacity: index === stats.length - 1 ? 0.4 : 1,
                        }}
                      >
                        <ChevronDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeStat(index)}
                        title="Hapus statistik"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '5px 8px',
                          borderRadius: '6px',
                          border: '1px solid #fecaca',
                          background: '#fef2f2',
                          color: '#dc2626',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                      gap: '12px',
                    }}
                  >
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Angka</label>
                      <input
                        type="text"
                        className="form-control"
                        value={stat.number}
                        onChange={(e) => updateStat(index, 'number', e.target.value)}
                        placeholder="e.g. 5.000+ / 100% / 4.9/5"
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Label (Indonesia)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={stat.labelId}
                        onChange={(e) => updateStat(index, 'labelId', e.target.value)}
                        placeholder="e.g. Wisatawan Puas"
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Label (English)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={stat.labelEn}
                        onChange={(e) => updateStat(index, 'labelEn', e.target.value)}
                        placeholder="e.g. Happy Snorkelers"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addStat}
              className="btn btn-secondary btn-sm"
            >
              <Plus size={16} />
              <span>Tambah Statistik</span>
            </button>
          </div>

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
