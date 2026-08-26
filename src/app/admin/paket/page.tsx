'use client';

import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit3, Trash2, CheckCircle2, Sparkles, X, Eye } from 'lucide-react';

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    slug: '',
    nameId: '',
    nameEn: '',
    tagId: 'Paling Populer',
    tagEn: 'Most Popular',
    descriptionId: '',
    descriptionEn: '',
    price: 150000,
    priceUsd: 10,
    durationId: '4 - 5 Jam',
    durationEn: '4 - 5 Hours',
    scheduleId: '09:30 & 13:00 WITA',
    scheduleEn: '09:30 AM & 01:00 PM',
    spotsText: 'Turtle Point, Bask Nest Statues, Coral Garden',
    includesText: 'Peralatan Snorkeling, Life Jacket, Guide, Free GoPro HD, Air Mineral',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200',
    isFeatured: true,
    isActive: true,
  });

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/packages');
      if (res.ok) {
        const data = await res.json();
        setPackages(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      slug: `paket-${Date.now()}`,
      nameId: '',
      nameEn: '',
      tagId: 'Paket Populer',
      tagEn: 'Popular Tour',
      descriptionId: '',
      descriptionEn: '',
      price: 150000,
      priceUsd: 10,
      durationId: '4 - 5 Jam',
      durationEn: '4 - 5 Hours',
      scheduleId: '09:30 & 13:00 WITA',
      scheduleEn: '09:30 AM & 01:00 PM',
      spotsText: 'Turtle Point (Gili Meno), Bask Nest Statues, Blue Coral Garden',
      includesText: 'Perahu, Peralatan Snorkeling, Life Jacket, Guide, Free GoPro HD',
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200',
      isFeatured: false,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (pkg: any) => {
    setEditingId(pkg.id);
    setFormData({
      slug: pkg.slug,
      nameId: pkg.nameId,
      nameEn: pkg.nameEn,
      tagId: pkg.tagId || '',
      tagEn: pkg.tagEn || '',
      descriptionId: pkg.descriptionId,
      descriptionEn: pkg.descriptionEn,
      price: pkg.price,
      priceUsd: pkg.priceUsd,
      durationId: pkg.durationId || '',
      durationEn: pkg.durationEn || '',
      scheduleId: pkg.scheduleId || '',
      scheduleEn: pkg.scheduleEn || '',
      spotsText: Array.isArray(pkg.spotsId) ? pkg.spotsId.join(', ') : '',
      includesText: Array.isArray(pkg.includesId) ? pkg.includesId.join(', ') : '',
      imageUrl: pkg.imageUrl,
      isFeatured: !!pkg.isFeatured,
      isActive: pkg.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      spotsId: formData.spotsText.split(',').map((s) => s.trim()).filter(Boolean),
      spotsEn: formData.spotsText.split(',').map((s) => s.trim()).filter(Boolean),
      includesId: formData.includesText.split(',').map((s) => s.trim()).filter(Boolean),
      includesEn: formData.includesText.split(',').map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/packages/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          fetchPackages();
          setIsModalOpen(false);
        }
      } else {
        const res = await fetch('/api/packages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          fetchPackages();
          setIsModalOpen(false);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus paket trip ini secara permanen?')) return;
    try {
      const res = await fetch(`/api/packages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPackages((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--primary-deep)', marginBottom: '4px' }}>
            Kelola Paket Snorkeling Trip
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Tambah paket baru, ubah harga IDR & USD, atur spot dan fasilitas yang termasuk.
          </p>
        </div>
        <button type="button" onClick={openCreateModal} className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>Tambah Paket Baru</span>
        </button>
      </div>

      {/* Packages Table */}
      <div className="glass-card" style={{ padding: '0', background: '#ffffff', overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Paket</th>
              <th>Harga (IDR / USD)</th>
              <th>Durasi & Jadwal</th>
              <th>Tag / Badge</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                  Memuat data paket...
                </td>
              </tr>
            ) : (
              packages.map((pkg) => (
                <tr key={pkg.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={pkg.imageUrl}
                        alt={pkg.nameId}
                        style={{ width: '56px', height: '42px', borderRadius: '6px', objectFit: 'cover' }}
                      />
                      <div>
                        <strong style={{ color: 'var(--primary-deep)', fontSize: '0.92rem' }}>
                          {pkg.nameId}
                        </strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{pkg.nameEn}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--primary-ocean)' }}>
                      Rp {pkg.price?.toLocaleString('id-ID')}
                    </strong>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>${pkg.priceUsd} USD</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem' }}>{pkg.durationId}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pkg.scheduleId}</div>
                  </td>
                  <td>
                    {pkg.tagId ? (
                      <span className="section-badge badge-gold" style={{ fontSize: '0.72rem', padding: '3px 8px', margin: 0 }}>
                        {pkg.tagId}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <span className={`status-badge ${pkg.isActive ? 'status-confirmed' : 'status-cancelled'}`}>
                      {pkg.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => openEditModal(pkg)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: 'var(--primary-surface)',
                          color: 'var(--primary-ocean)',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                        }}
                      >
                        <Edit3 size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(pkg.id)}
                        style={{
                          padding: '6px',
                          borderRadius: '6px',
                          background: '#fee2e2',
                          color: '#b91c1c',
                          border: 'none',
                          cursor: 'pointer',
                        }}
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

      {/* Modal Edit / Create */}
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
              maxWidth: '720px',
              maxHeight: '90vh',
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              overflowY: 'auto',
              padding: '30px',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-deep)' }}>
                {editingId ? 'Edit Paket Snorkeling' : 'Tambah Paket Snorkeling Baru'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Nama Paket (Bahasa Indonesia) *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.nameId}
                    onChange={(e) => setFormData({ ...formData, nameId: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nama Paket (English) *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Slug URL (Unik) *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tag Badge (e.g. Paling Populer)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.tagId}
                    onChange={(e) => setFormData({ ...formData, tagId: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Harga IDR (Rupiah) *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Harga USD ($) *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.priceUsd}
                    onChange={(e) => setFormData({ ...formData, priceUsd: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Durasi (e.g. 4 - 5 Jam)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.durationId}
                    onChange={(e) => setFormData({ ...formData, durationId: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Jadwal Keberangkatan</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.scheduleId}
                    onChange={(e) => setFormData({ ...formData, scheduleId: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Deskripsi Singkat (Bahasa Indonesia) *</label>
                <textarea
                  className="form-control"
                  value={formData.descriptionId}
                  onChange={(e) => setFormData({ ...formData, descriptionId: e.target.value })}
                  rows={2}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Deskripsi Singkat (English) *</label>
                <textarea
                  className="form-control"
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  rows={2}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Spot Snorkeling (Pisahkan dengan koma)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Turtle Point, Statue Meno, Blue Coral Garden"
                  value={formData.spotsText}
                  onChange={(e) => setFormData({ ...formData, spotsText: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Fasilitas Termasuk (Pisahkan dengan koma)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Perahu, Masker Snorkel, Life Jacket, GoPro HD"
                  value={formData.includesText}
                  onChange={(e) => setFormData({ ...formData, includesText: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">URL Foto Gambar Thumbnail *</label>
                <input
                  type="url"
                  className="form-control"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '24px', margin: '20px 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  <span>Tampilkan sebagai Paket Populer (Featured)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>Status Aktif (Tampil di website)</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Simpan Perubahan' : 'Tambahkan Paket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
