'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Edit3, Trash2, X, Star, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';
import ImageUpload from '@/components/admin/ImageUpload';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const initialEmptyTestimonial = {
    name: '',
    origin: '',
    countryCode: 'ID',
    rating: 5,
    tripType: '',
    contentId: '',
    contentEn: '',
    avatarUrl: '',
    isActive: true,
  };

  const [formData, setFormData] = useState(initialEmptyTestimonial);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/testimonials');
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      } else {
        toast.error('Gagal memuat daftar testimoni');
      }
    } catch (e) {
      console.error(e);
      toast.error('Terjadi kesalahan jaringan saat memuat testimoni');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(initialEmptyTestimonial);
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
    if (!formData.name || !formData.contentId) {
      toast.error('Nama dan isi testimoni wajib diisi!');
      return;
    }

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
      } else {
        const res = await fetch('/api/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Gagal menambahkan testimoni');
        toast.success('Testimoni baru berhasil ditambahkan!', { id: toastId });
      }
      fetchTestimonials();
      setIsModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || 'Gagal menyimpan testimoni', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const toastId = toast.loading('Menghapus ulasan testimoni...');
    try {
      const res = await fetch(`/api/testimonials/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus');

      setTestimonials((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      toast.success(`Ulasan dari "${deleteTarget.name}" berhasil dihapus!`, { id: toastId });
      setDeleteTarget(null);
    } catch (e: any) {
      toast.error(e.message || 'Gagal menghapus testimoni', { id: toastId });
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
            Kelola Testimoni Tamu
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Daftar ulasan dan pengalaman wisatawan snorkeling yang tampil di website.
          </p>
        </div>

        <button type="button" onClick={openCreateModal} className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>Tambah Testimoni Baru</span>
        </button>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ padding: '0', background: '#ffffff', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama Tamu</th>
                <th>Asal & Paket</th>
                <th>Rating</th>
                <th>Ulasan</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--primary-ocean)' }}>
                      <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Memuat testimoni...</span>
                    </div>
                  </td>
                </tr>
              ) : testimonials.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    Belum ada testimoni. Klik "Tambah Testimoni Baru" untuk menambahkan ulasan.
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
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              background: 'var(--primary-surface)',
                              color: 'var(--primary-ocean)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                            }}
                          >
                            {item.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <strong style={{ color: 'var(--primary-deep)', fontSize: '0.9rem' }}>{item.name}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.origin}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.82rem', color: 'var(--primary-ocean)', fontWeight: 600 }}>
                        {item.tripType || 'Snorkeling Trip'}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(item.rating || 5)].map((_, i) => (
                          <Star key={i} size={14} fill="var(--accent-gold)" color="var(--accent-gold)" />
                        ))}
                      </div>
                    </td>

                    <td style={{ maxWidth: '320px' }}>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.4 }}>
                        "{item.contentId.length > 90 ? item.contentId.slice(0, 90) + '...' : item.contentId}"
                      </p>
                    </td>

                    <td>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            background: 'var(--primary-surface)',
                            color: 'var(--primary-ocean)',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                          }}
                        >
                          <Edit3 size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            background: '#fee2e2',
                            color: '#b91c1c',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          title="Hapus Testimoni"
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
              maxWidth: '620px',
              maxHeight: '90vh',
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              boxShadow: 'var(--shadow-xl)',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--primary-deep)', margin: 0 }}>
                {editingId ? 'Edit Testimoni' : 'Tambah Testimoni Baru'}
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

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Nama Tamu *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Rian & Amanda"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Kota / Negara Asal</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Jakarta, Indonesia / Sydney, Australia"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Jenis Paket Trip</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Private Glass Bottom Boat"
                    value={formData.tripType}
                    onChange={(e) => setFormData({ ...formData, tripType: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Rating Bintang</label>
                  <select
                    className="form-control"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Bintang - Sempurna)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Bintang - Sangat Bagus)</option>
                    <option value={3}>⭐⭐⭐ (3 Bintang - Cukup)</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Isi Ulasan (Bahasa Indonesia) *</label>
                <textarea
                  className="form-control"
                  placeholder="Cerita pengalaman tamu..."
                  value={formData.contentId}
                  onChange={(e) => setFormData({ ...formData, contentId: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Isi Ulasan (English)</label>
                <textarea
                  className="form-control"
                  placeholder="Guest review in English..."
                  value={formData.contentEn}
                  onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                  rows={3}
                />
              </div>

              <ImageUpload
                label="Foto Profil Tamu (Opsional)"
                value={formData.avatarUrl}
                onChange={(url) => setFormData({ ...formData, avatarUrl: url })}
                required={false}
                helperText="Upload foto profil tamu jika tersedia (JPG, PNG maks 5MB)"
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
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
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Testimoni'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={!!deleteTarget}
        title="Hapus Testimoni Tamu"
        description={`Apakah Anda yakin ingin menghapus ulasan dari "${deleteTarget?.name}"? Ulasan ini tidak akan tampil lagi di website publik.`}
        confirmText="Hapus Testimoni"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
