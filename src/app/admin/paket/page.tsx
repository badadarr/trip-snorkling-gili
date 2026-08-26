'use client';

import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  Sparkles,
  X,
  Eye,
  Loader2,
  Copy,
  ToggleLeft,
  ToggleRight,
  Star,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Quick suggestion chips
  const spotSuggestions = [
    'Turtle Point (Gili Meno)',
    'Patung Bawah Air (Bask Nest)',
    'Blue Coral Garden (Gili Air)',
    'Sunset Point Gili Trawangan',
    'Shark Point (Gili Trawangan)',
  ];

  const includeSuggestions = [
    'Perahu Glass Bottom Boat',
    'Masker & Snorkel Gear',
    'Life Jacket (Pelampung)',
    'Pemandu Snorkeling Berpengalaman',
    'Dokumentasi Foto & Video GoPro HD',
    'Air Mineral Dingin',
    'Roti untuk Pakan Ikan',
  ];

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
    spots: ['Turtle Point (Gili Meno)', 'Patung Bawah Air (Bask Nest)', 'Blue Coral Garden (Gili Air)'],
    includes: ['Perahu Glass Bottom Boat', 'Masker & Snorkel Gear', 'Life Jacket (Pelampung)', 'Pemandu Snorkeling Berpengalaman', 'Dokumentasi Foto & Video GoPro HD'],
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200',
    isFeatured: true,
    isActive: true,
  });

  const [newSpotInput, setNewSpotInput] = useState('');
  const [newIncludeInput, setNewIncludeInput] = useState('');

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/packages');
      if (res.ok) {
        const data = await res.json();
        setPackages(data);
      } else {
        toast.error('Gagal memuat daftar paket');
      }
    } catch (e) {
      console.error(e);
      toast.error('Terjadi kesalahan jaringan saat memuat paket');
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
      spots: ['Turtle Point (Gili Meno)', 'Patung Bawah Air (Bask Nest)', 'Blue Coral Garden (Gili Air)'],
      includes: ['Perahu Glass Bottom Boat', 'Masker & Snorkel Gear', 'Life Jacket (Pelampung)', 'Pemandu Snorkeling Berpengalaman', 'Dokumentasi Foto & Video GoPro HD'],
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200',
      isFeatured: false,
      isActive: true,
    });
    setNewSpotInput('');
    setNewIncludeInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (pkg: any) => {
    setEditingId(pkg.id);
    const spots = Array.isArray(pkg.spotsId)
      ? pkg.spotsId
      : typeof pkg.spotsId === 'string'
      ? pkg.spotsId.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];

    const includes = Array.isArray(pkg.includesId)
      ? pkg.includesId
      : typeof pkg.includesId === 'string'
      ? pkg.includesId.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];

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
      spots: spots.length > 0 ? spots : ['Turtle Point (Gili Meno)', 'Patung Bawah Air (Bask Nest)'],
      includes: includes.length > 0 ? includes : ['Masker & Snorkel', 'Life Jacket', 'GoPro HD'],
      imageUrl: pkg.imageUrl,
      isFeatured: !!pkg.isFeatured,
      isActive: pkg.isActive !== false,
    });
    setNewSpotInput('');
    setNewIncludeInput('');
    setIsModalOpen(true);
  };

  const handleDuplicate = (pkg: any) => {
    setEditingId(null);
    const spots = Array.isArray(pkg.spotsId) ? pkg.spotsId : [];
    const includes = Array.isArray(pkg.includesId) ? pkg.includesId : [];

    setFormData({
      slug: `${pkg.slug}-copy-${Date.now().toString().slice(-4)}`,
      nameId: `${pkg.nameId} (Salinan)`,
      nameEn: `${pkg.nameEn} (Copy)`,
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
      spots: [...spots],
      includes: [...includes],
      imageUrl: pkg.imageUrl,
      isFeatured: false,
      isActive: true,
    });
    setIsModalOpen(true);
    toast.info('Paket berhasil diduplikasi. Silakan edit dan simpan.');
  };

  const handleQuickToggleActive = async (pkg: any) => {
    const newStatus = !pkg.isActive;
    try {
      const res = await fetch(`/api/packages/${pkg.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...pkg, isActive: newStatus }),
      });
      if (!res.ok) throw new Error('Gagal mengubah status');
      setPackages((prev) =>
        prev.map((p) => (p.id === pkg.id ? { ...p, isActive: newStatus } : p))
      );
      toast.success(`Paket ${pkg.nameId} ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}!`);
    } catch (e: any) {
      toast.error(e.message || 'Gagal mengubah status');
    }
  };

  const handleQuickToggleFeatured = async (pkg: any) => {
    const newFeatured = !pkg.isFeatured;
    try {
      const res = await fetch(`/api/packages/${pkg.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...pkg, isFeatured: newFeatured }),
      });
      if (!res.ok) throw new Error('Gagal mengubah status featured');
      setPackages((prev) =>
        prev.map((p) => (p.id === pkg.id ? { ...p, isFeatured: newFeatured } : p))
      );
      toast.success(`Status Popular/Featured ${pkg.nameId} berhasil diperbarui!`);
    } catch (e: any) {
      toast.error(e.message || 'Gagal mengubah status');
    }
  };

  // Add & Remove Spot Chips
  const handleAddSpot = (spotName: string) => {
    const trimmed = spotName.trim();
    if (!trimmed || formData.spots.includes(trimmed)) return;
    setFormData((prev) => ({ ...prev, spots: [...prev.spots, trimmed] }));
    setNewSpotInput('');
  };

  const handleRemoveSpot = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      spots: prev.spots.filter((_, i) => i !== indexToRemove),
    }));
  };

  // Add & Remove Include Chips
  const handleAddInclude = (includeName: string) => {
    const trimmed = includeName.trim();
    if (!trimmed || formData.includes.includes(trimmed)) return;
    setFormData((prev) => ({ ...prev, includes: [...prev.includes, trimmed] }));
    setNewIncludeInput('');
  };

  const handleRemoveInclude = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const toastId = toast.loading(editingId ? 'Menyimpan perubahan paket...' : 'Menambahkan paket baru...');

    const payload = {
      ...formData,
      spotsId: formData.spots,
      spotsEn: formData.spots,
      includesId: formData.includes,
      includesEn: formData.includes,
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/packages/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Gagal memperbarui paket');
        toast.success('Paket snorkeling berhasil diperbarui!', { id: toastId });
      } else {
        const res = await fetch('/api/packages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Gagal menambahkan paket');
        toast.success('Paket snorkeling baru berhasil ditambahkan!', { id: toastId });
      }
      fetchPackages();
      setIsModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || 'Terjadi kesalahan saat menyimpan', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const toastId = toast.loading('Menghapus paket...');
    try {
      const res = await fetch(`/api/packages/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus paket');

      setPackages((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      toast.success(`Paket "${deleteTarget.nameId}" berhasil dihapus!`, { id: toastId });
      setDeleteTarget(null);
    } catch (e: any) {
      toast.error(e.message || 'Gagal menghapus paket', { id: toastId });
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
            Kelola Paket Snorkeling Trip
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Atur harga IDR/USD, spot destinasi 3 Gili, fasilitas include, dan status tampil paket.
          </p>
        </div>

        <button type="button" onClick={openCreateModal} className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>Tambah Paket Baru</span>
        </button>
      </div>

      {/* Packages Table */}
      <div className="glass-card" style={{ padding: '0', background: '#ffffff', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Paket Trip</th>
                <th>Harga (IDR / USD)</th>
                <th>Durasi & Jadwal</th>
                <th>Spot & Fasilitas</th>
                <th>Featured</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--primary-ocean)' }}>
                      <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Memuat data paket trip...</span>
                    </div>
                  </td>
                </tr>
              ) : packages.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    Belum ada paket snorkeling. Klik "Tambah Paket Baru" untuk membuat.
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
                          style={{ width: '56px', height: '42px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }}
                        />
                        <div>
                          <strong style={{ color: 'var(--primary-deep)', fontSize: '0.92rem', display: 'block' }}>
                            {pkg.nameId}
                          </strong>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{pkg.nameEn}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <strong style={{ color: 'var(--primary-ocean)', fontSize: '0.92rem' }}>
                        Rp {pkg.price?.toLocaleString('id-ID')}
                      </strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>${pkg.priceUsd} USD</div>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{pkg.durationId}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pkg.scheduleId}</div>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-main)' }}>
                        <strong>{Array.isArray(pkg.spotsId) ? pkg.spotsId.length : 0} Spot</strong> Destinasi
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {Array.isArray(pkg.includesId) ? pkg.includesId.length : 0} Fasilitas Include
                      </div>
                    </td>

                    <td>
                      <button
                        type="button"
                        onClick={() => handleQuickToggleFeatured(pkg)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: pkg.isFeatured ? '#d97706' : 'var(--text-muted)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                        }}
                        title="Klik untuk toggle Featured"
                      >
                        <Star size={16} fill={pkg.isFeatured ? '#ffb703' : 'none'} />
                        <span>{pkg.isFeatured ? 'Ya' : 'Tidak'}</span>
                      </button>
                    </td>

                    <td>
                      <button
                        type="button"
                        onClick={() => handleQuickToggleActive(pkg)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          border: 'none',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          background: pkg.isActive ? '#d1fae5' : '#fee2e2',
                          color: pkg.isActive ? '#065f46' : '#b91c1c',
                        }}
                      >
                        {pkg.isActive ? '● Aktif' : '○ Nonaktif'}
                      </button>
                    </td>

                    <td>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        {/* Duplicate */}
                        <button
                          type="button"
                          onClick={() => handleDuplicate(pkg)}
                          style={{
                            padding: '6px 8px',
                            borderRadius: '6px',
                            background: '#f1f5f9',
                            color: 'var(--text-main)',
                            border: '1px solid var(--border-light)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.78rem',
                          }}
                          title="Duplikasi Paket Ini"
                        >
                          <Copy size={13} />
                          <span>Klon</span>
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => openEditModal(pkg)}
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

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(pkg)}
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
                          title="Hapus Paket"
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

      {/* Create / Edit Modal */}
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
              maxWidth: '760px',
              maxHeight: '90vh',
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              overflowY: 'auto',
              padding: '30px',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '8px', borderRadius: '10px', background: 'var(--primary-surface)', color: 'var(--primary-ocean)' }}>
                  <Package size={20} />
                </div>
                <h2 style={{ fontSize: '1.3rem', color: 'var(--primary-deep)', margin: 0 }}>
                  {editingId ? 'Edit Paket Snorkeling' : 'Tambah Paket Snorkeling Baru'}
                </h2>
              </div>

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
              {/* Name ID & EN */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Nama Paket (Bahasa Indonesia) *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Snorkeling Sharing Glass Bottom Boat"
                    value={formData.nameId}
                    onChange={(e) => setFormData({ ...formData, nameId: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Nama Paket (English) *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Public Glass Bottom Boat Snorkeling Tour"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Slug and Tag */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Slug URL (Unik) *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Tag / Badge (e.g. Paling Populer)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.tagId}
                    onChange={(e) => setFormData({ ...formData, tagId: e.target.value })}
                  />
                </div>
              </div>

              {/* Price IDR & USD */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Harga IDR (Rupiah) *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
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

              {/* Duration and Schedule */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Durasi Trip (e.g. 4 - 5 Jam)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.durationId}
                    onChange={(e) => setFormData({ ...formData, durationId: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Jadwal Keberangkatan</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.scheduleId}
                    onChange={(e) => setFormData({ ...formData, scheduleId: e.target.value })}
                  />
                </div>
              </div>

              {/* Spot List Chips Management */}
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Spot Snorkeling Destinasi</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                  {formData.spots.map((spot, idx) => (
                    <span
                      key={idx}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '5px 10px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--primary-surface)',
                        color: 'var(--primary-ocean)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        border: '1px solid rgba(0, 180, 216, 0.3)',
                      }}
                    >
                      <span>📍 {spot}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpot(idx)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex' }}
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tambah spot baru (contoh: Coral Garden Gili Air)..."
                    value={newSpotInput}
                    onChange={(e) => setNewSpotInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSpot(newSpotInput);
                      }
                    }}
                    style={{ fontSize: '0.85rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSpot(newSpotInput)}
                    className="btn btn-secondary btn-sm"
                  >
                    + Tambah
                  </button>
                </div>

                {/* Quick Add Suggestions */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Saran Cepat:</span>
                  {spotSuggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleAddSpot(s)}
                      style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-light)',
                        background: '#f8fafc',
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                      }}
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Includes Chips Management */}
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Fasilitas Termasuk (Inclusions)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                  {formData.includes.map((inc, idx) => (
                    <span
                      key={idx}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '5px 10px',
                        borderRadius: 'var(--radius-full)',
                        background: '#f0fdf4',
                        color: '#15803d',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        border: '1px solid rgba(21, 128, 61, 0.3)',
                      }}
                    >
                      <span>✓ {inc}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInclude(idx)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex' }}
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tambah fasilitas (contoh: Pakan Ikan)..."
                    value={newIncludeInput}
                    onChange={(e) => setNewIncludeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddInclude(newIncludeInput);
                      }
                    }}
                    style={{ fontSize: '0.85rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddInclude(newIncludeInput)}
                    className="btn btn-secondary btn-sm"
                  >
                    + Tambah
                  </button>
                </div>

                {/* Quick Inclusions Suggestions */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Saran Cepat:</span>
                  {includeSuggestions.map((inc) => (
                    <button
                      key={inc}
                      type="button"
                      onClick={() => handleAddInclude(inc)}
                      style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-light)',
                        background: '#f8fafc',
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                      }}
                    >
                      + {inc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description ID & EN */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Deskripsi Singkat (Bahasa Indonesia) *</label>
                  <textarea
                    className="form-control"
                    value={formData.descriptionId}
                    onChange={(e) => setFormData({ ...formData, descriptionId: e.target.value })}
                    rows={2}
                    required
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Deskripsi Singkat (English) *</label>
                  <textarea
                    className="form-control"
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    rows={2}
                    required
                  />
                </div>
              </div>

              {/* Image URL with live preview */}
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">URL Foto Gambar Thumbnail *</label>
                <input
                  type="url"
                  className="form-control"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  required
                />
                {formData.imageUrl && (
                  <div style={{ marginTop: '10px', height: '120px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                    <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              {/* Checkboxes for featured & active */}
              <div style={{ display: 'flex', gap: '24px', margin: '20px 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  <span>Tampilkan sebagai Paket Populer (Featured)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>Status Aktif (Tampil di website publik)</span>
                </label>
              </div>

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
                  <span>{isSaving ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambahkan Paket'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (Replacing window.confirm) */}
      <AdminConfirmModal
        isOpen={!!deleteTarget}
        title="Hapus Paket Snorkeling"
        description={`Apakah Anda yakin ingin menghapus paket "${deleteTarget?.nameId}" secara permanen? Paket ini tidak akan lagi muncul di website publik.`}
        confirmText="Hapus Paket"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
