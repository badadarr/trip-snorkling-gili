'use client';

import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Trash2, X, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    imageUrl: '',
    titleId: '',
    titleEn: '',
    category: 'underwater',
    orderIndex: 1,
  });

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gallery');
      if (res.ok) {
        const data = await res.json();
        setGallery(data);
      }
    } catch (e) {
      console.error(e);
      toast.error('Gagal memuat galeri');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const toastId = toast.loading('Menambahkan foto ke galeri...');
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Gagal menambahkan foto');
      toast.success('Foto baru berhasil ditambahkan!', { id: toastId });
      fetchGallery();
      setIsModalOpen(false);
      setFormData({
        imageUrl: '',
        titleId: '',
        titleEn: '',
        category: 'underwater',
        orderIndex: 1,
      });
    } catch (e: any) {
      toast.error(e.message || 'Gagal menambahkan foto', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus foto ini dari galeri?')) return;
    setDeletingId(id);
    const toastId = toast.loading('Menghapus foto...');
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus foto');
      setGallery((prev) => prev.filter((g) => g.id !== id));
      toast.success('Foto berhasil dihapus dari galeri!', { id: toastId });
    } catch (e: any) {
      toast.error(e.message || 'Gagal menghapus foto', { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--primary-deep)', marginBottom: '4px' }}>
            Kelola Galeri Foto
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Upload dan atur foto dokumentasi snorkeling, penyu, patung, dan sunset 3 Gili.
          </p>
        </div>
        <button type="button" onClick={() => setIsModalOpen(true)} className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>Tambah Foto Baru</span>
        </button>
      </div>

      {/* Gallery Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '20px',
        }}
      >
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            Memuat galeri...
          </div>
        ) : (
          gallery.map((item) => (
            <div
              key={item.id}
              className="glass-card"
              style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ height: '180px', width: '100%', position: 'relative' }}>
                <img
                  src={item.imageUrl}
                  alt={item.titleId}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: 'rgba(10, 37, 64, 0.85)',
                    color: 'var(--primary-aqua)',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  {item.category}
                </span>
              </div>

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--primary-deep)', marginBottom: '4px' }}>
                    {item.titleId}
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.titleEn}</span>
                </div>

                <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: '#fee2e2',
                      color: '#b91c1c',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.8rem',
                    }}
                  >
                    <Trash2 size={13} />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Add Photo */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(10, 25, 47, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '540px',
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '30px',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-deep)' }}>
                Tambah Foto ke Galeri
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">URL Foto / Gambar *</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  required
                />
                {formData.imageUrl && (
                  <div style={{ marginTop: '10px', height: '140px', borderRadius: '8px', overflow: 'hidden' }}>
                    <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Judul Foto (Bahasa Indonesia) *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Contoh: Berenang Bersama Penyu di Gili Meno"
                  value={formData.titleId}
                  onChange={(e) => setFormData({ ...formData, titleId: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Judul Foto (English) *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Swimming with Wild Turtles at Gili Meno"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Kategori Foto</label>
                <select
                  className="form-control"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="turtles">Penyu (Turtles)</option>
                  <option value="statues">Patung Bawah Laut (Statues)</option>
                  <option value="underwater">Terumbu Karang & Ikan (Underwater)</option>
                  <option value="sunset">Sunset & Suasana Laut (Sunset)</option>
                  <option value="boats">Armada Kapal Glass Bottom (Boats)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Foto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
