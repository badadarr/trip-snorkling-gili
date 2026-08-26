'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Image as ImageIcon, Plus, Trash2, X, CheckCircle2, Loader2, Filter, Eye } from 'lucide-react';
import { toast } from 'sonner';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    imageUrl: '',
    titleId: '',
    titleEn: '',
    category: 'turtles',
    orderIndex: 1,
  });

  const categories = [
    { key: 'all', label: 'Semua Kategori' },
    { key: 'turtles', label: 'Penyu (Turtles)' },
    { key: 'statues', label: 'Patung Bawah Laut' },
    { key: 'underwater', label: 'Karang & Ikan' },
    { key: 'sunset', label: 'Sunset & Pantai' },
    { key: 'boats', label: 'Kapal Glass Bottom' },
  ];

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gallery');
      if (res.ok) {
        const data = await res.json();
        setGallery(data);
      } else {
        toast.error('Gagal memuat galeri foto');
      }
    } catch (e) {
      console.error(e);
      toast.error('Terjadi kesalahan jaringan saat memuat galeri');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const filteredGallery = useMemo(() => {
    if (categoryFilter === 'all') return gallery;
    return gallery.filter((item) => item.category === categoryFilter);
  }, [gallery, categoryFilter]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl || !formData.titleId) {
      toast.error('URL foto dan judul wajib diisi!');
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading('Menambahkan foto ke galeri...');
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Gagal menambahkan foto');
      toast.success('Foto baru berhasil ditambahkan ke galeri!', { id: toastId });
      fetchGallery();
      setIsModalOpen(false);
      setFormData({
        imageUrl: '',
        titleId: '',
        titleEn: '',
        category: 'turtles',
        orderIndex: gallery.length + 1,
      });
    } catch (e: any) {
      toast.error(e.message || 'Gagal menambahkan foto', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const toastId = toast.loading('Menghapus foto dari galeri...');
    try {
      const res = await fetch(`/api/gallery/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus foto');

      setGallery((prev) => prev.filter((g) => g.id !== deleteTarget.id));
      toast.success('Foto berhasil dihapus dari galeri!', { id: toastId });
      setDeleteTarget(null);
    } catch (e: any) {
      toast.error(e.message || 'Gagal menghapus foto', { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
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
            Kelola Galeri Foto Snorkeling
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Upload dan atur dokumentasi bawah air (penyu, patung bask nest, terumbu karang, sunset 3 Gili).
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormData({
              imageUrl: '',
              titleId: '',
              titleEn: '',
              category: 'turtles',
              orderIndex: gallery.length + 1,
            });
            setIsModalOpen(true);
          }}
          className="btn btn-primary btn-sm"
        >
          <Plus size={16} />
          <span>Tambah Foto Baru</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        {categories.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setCategoryFilter(c.key)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              border: categoryFilter === c.key ? '1px solid var(--primary-ocean)' : '1px solid var(--border-light)',
              background: categoryFilter === c.key ? 'var(--primary-ocean)' : '#ffffff',
              color: categoryFilter === c.key ? '#ffffff' : 'var(--text-main)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {c.label} {c.key === 'all' ? `(${gallery.length})` : ''}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--primary-ocean)' }}>
            <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
            <span>Memuat koleksi galeri...</span>
          </div>
        </div>
      ) : filteredGallery.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
          Tidak ada foto pada kategori ini. Klik "Tambah Foto Baru" untuk menambahkan foto dokumentasi.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '20px',
          }}
        >
          {filteredGallery.map((item) => (
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
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.titleEn}</span>
                </div>

                <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
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
                      fontWeight: 600,
                    }}
                  >
                    <Trash2 size={13} />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
            backdropFilter: 'blur(6px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSaving) setIsModalOpen(false);
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '540px',
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--primary-deep)' }}>
                Tambah Foto ke Galeri
              </h2>
              <button
                type="button"
                disabled={isSaving}
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
                  <div style={{ marginTop: '10px', height: '140px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn btn-primary btn-sm"
                  style={{ opacity: isSaving ? 0.85 : 1 }}
                >
                  {isSaving && <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />}
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Foto'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (Replacing window.confirm) */}
      <AdminConfirmModal
        isOpen={!!deleteTarget}
        title="Hapus Foto dari Galeri"
        description={`Apakah Anda yakin ingin menghapus foto "${deleteTarget?.titleId}" dari galeri? Foto ini tidak akan tampil lagi di website publik.`}
        confirmText="Hapus Foto"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
