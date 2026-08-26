'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Edit3, Trash2, X, Star, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    origin: 'Jakarta, Indonesia',
    countryCode: 'ID',
    rating: 5,
    tripType: 'Private Glass Bottom Boat',
    contentId: '',
    contentEn: '',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400',
    isActive: true,
  });

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/testimonials');
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      }
    } catch (e) {
      console.error(e);
      toast.error('Gagal memuat daftar testimoni');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      origin: 'Jakarta, Indonesia',
      countryCode: 'ID',
      rating: 5,
      tripType: 'Private Glass Bottom Boat',
      contentId: '',
      contentEn: '',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      origin: item.origin || '',
      countryCode: item.countryCode || 'ID',
      rating: item.rating || 5,
      tripType: item.tripType || '',
      contentId: item.contentId,
      contentEn: item.contentEn,
      avatarUrl: item.avatarUrl || '',
      isActive: item.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const toastId = toast.loading(editingId ? 'Menyimpan perubahan testimoni...' : 'Menambahkan testimoni baru...');
    try {
      if (editingId) {
        const res = await fetch(`/api/testimonials/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Gagal memperbarui testimoni');
        toast.success('Testimoni berhasil diperbarui!', { id: toastId });
        fetchTestimonials();
        setIsModalOpen(false);
      } else {
        const res = await fetch('/api/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Gagal menambahkan testimoni');
        toast.success('Testimoni baru berhasil ditambahkan!', { id: toastId });
        fetchTestimonials();
        setIsModalOpen(false);
      }
    } catch (e: any) {
      toast.error(e.message || 'Gagal menyimpan testimoni', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus ulasan tamu ini?')) return;
    setDeletingId(id);
    const toastId = toast.loading('Menghapus ulasan...');
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus');
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      toast.success('Ulasan berhasil dihapus!', { id: toastId });
    } catch (e: any) {
      toast.error(e.message || 'Gagal menghapus', { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--primary-deep)', marginBottom: '4px' }}>
            Kelola Testimoni Tamu
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Daftar ulasan dan pengalaman wisatawan yang tampil di website.
          </p>
        </div>
        <button type="button" onClick={openCreateModal} className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>Tambah Testimoni Baru</span>
        </button>
      </div>

      <div className="glass-card" style={{ padding: '0', background: '#ffffff', overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nama Tamu</th>
              <th>Asal & Paket</th>
              <th>Rating</th>
              <th>Ulasan (ID)</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>
                  Memuat testimoni...
                </td>
              </tr>
            ) : (
              testimonials.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {item.avatarUrl ? (
                        <img
                          src={item.avatarUrl}
                          alt={item.name}
                          style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--primary-surface)', color: 'var(--primary-ocean)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                          {item.name.charAt(0)}
                        </div>
                      )}
                      <strong>{item.name}</strong>
                    </div>
                  </td>
                  <td>
                    <div>{item.origin}</div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--primary-ocean)' }}>{item.tripType}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <Star key={i} size={14} fill="var(--accent-gold)" color="var(--accent-gold)" />
                      ))}
                    </div>
                  </td>
                  <td style={{ maxWidth: '300px' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0 }}>
                      "{item.contentId.length > 80 ? item.contentId.slice(0, 80) + '...' : item.contentId}"
                    </p>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        style={{ padding: '6px 12px', borderRadius: '6px', background: 'var(--primary-surface)', color: 'var(--primary-ocean)', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        style={{ padding: '6px', borderRadius: '6px', background: '#fee2e2', color: '#b91c1c', border: 'none', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Add / Edit */}
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
              maxWidth: '600px',
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '30px',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-deep)' }}>
                {editingId ? 'Edit Testimoni' : 'Tambah Testimoni Baru'}
              </h2>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Nama Tamu *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Kota / Negara Asal</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Jenis Trip yang Diambil</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.tripType}
                    onChange={(e) => setFormData({ ...formData, tripType: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Rating Bintang (1 - 5)</label>
                  <select
                    className="form-control"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Bintang)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Bintang)</option>
                    <option value={3}>⭐⭐⭐ (3 Bintang)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Isi Ulasan (Bahasa Indonesia) *</label>
                <textarea
                  className="form-control"
                  value={formData.contentId}
                  onChange={(e) => setFormData({ ...formData, contentId: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Isi Ulasan (English) *</label>
                <textarea
                  className="form-control"
                  value={formData.contentEn}
                  onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">URL Foto Profil Avatar (Opsional)</label>
                <input
                  type="url"
                  className="form-control"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Testimoni
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
