'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { HelpCircle, Plus, Edit3, Trash2, X, Loader2, Filter } from 'lucide-react';
import { toast } from 'sonner';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    questionId: '',
    questionEn: '',
    answerId: '',
    answerEn: '',
    category: 'general',
    orderIndex: 1,
    isActive: true,
  });

  const categories = [
    { key: 'all', label: 'Semua Kategori' },
    { key: 'general', label: 'Umum & Lokasi' },
    { key: 'booking', label: 'Reservasi & Pembayaran' },
    { key: 'equipment', label: 'Alat & Fasilitas' },
    { key: 'safety', label: 'Keamanan & Cuaca' },
  ];

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/faq');
      if (res.ok) {
        const data = await res.json();
        setFaqs(data);
      } else {
        toast.error('Gagal memuat daftar FAQ');
      }
    } catch (e) {
      console.error(e);
      toast.error('Terjadi kesalahan jaringan saat memuat FAQ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const filteredFaqs = useMemo(() => {
    if (categoryFilter === 'all') return faqs;
    return faqs.filter((f) => f.category === categoryFilter);
  }, [faqs, categoryFilter]);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      questionId: '',
      questionEn: '',
      answerId: '',
      answerEn: '',
      category: 'general',
      orderIndex: faqs.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setFormData({
      questionId: item.questionId,
      questionEn: item.questionEn || '',
      answerId: item.answerId,
      answerEn: item.answerEn || '',
      category: item.category || 'general',
      orderIndex: item.orderIndex || 1,
      isActive: item.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.questionId || !formData.answerId) {
      toast.error('Pertanyaan dan jawaban wajib diisi!');
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading(editingId ? 'Menyimpan perubahan FAQ...' : 'Menambahkan FAQ baru...');
    try {
      if (editingId) {
        const res = await fetch(`/api/faq/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Gagal memperbarui FAQ');
        toast.success('FAQ berhasil diperbarui!', { id: toastId });
      } else {
        const res = await fetch('/api/faq', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Gagal menambahkan FAQ');
        toast.success('FAQ baru berhasil ditambahkan!', { id: toastId });
      }
      fetchFaqs();
      setIsModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || 'Gagal menyimpan FAQ', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const toastId = toast.loading('Menghapus FAQ...');
    try {
      const res = await fetch(`/api/faq/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus');

      setFaqs((prev) => prev.filter((f) => f.id !== deleteTarget.id));
      toast.success('Pertanyaan FAQ berhasil dihapus!', { id: toastId });
      setDeleteTarget(null);
    } catch (e: any) {
      toast.error(e.message || 'Gagal menghapus', { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {/* Header */}
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
            Kelola Tanya Jawab (FAQ)
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Daftar pertanyaan yang sering diajukan wisatawan terkait rute snorkeling, alat, dan prosedur trip.
          </p>
        </div>

        <button type="button" onClick={openCreateModal} className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>Tambah FAQ Baru</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
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
            {c.label} {c.key === 'all' ? `(${faqs.length})` : ''}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card" style={{ padding: '0', background: '#ffffff', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Pertanyaan</th>
                <th>Jawaban</th>
                <th>Kategori</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--primary-ocean)' }}>
                      <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Memuat daftar FAQ...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredFaqs.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    Tidak ada FAQ pada kategori ini.
                  </td>
                </tr>
              ) : (
                filteredFaqs.map((f) => (
                  <tr key={f.id}>
                    <td style={{ maxWidth: '300px' }}>
                      <strong style={{ color: 'var(--primary-deep)', fontSize: '0.9rem', display: 'block' }}>
                        {f.questionId}
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{f.questionEn}</span>
                    </td>

                    <td style={{ maxWidth: '360px' }}>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.45 }}>
                        {f.answerId.length > 100 ? f.answerId.slice(0, 100) + '...' : f.answerId}
                      </p>
                    </td>

                    <td>
                      <span className="section-badge" style={{ fontSize: '0.72rem', padding: '3px 8px', margin: 0 }}>
                        {f.category || 'General'}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button
                          type="button"
                          onClick={() => openEditModal(f)}
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
                          onClick={() => setDeleteTarget(f)}
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
                          title="Hapus FAQ"
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

      {/* Modal FAQ */}
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
                {editingId ? 'Edit FAQ' : 'Tambah FAQ Baru'}
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
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Kategori Pertanyaan</label>
                <select
                  className="form-control"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="general">Umum & Lokasi (General)</option>
                  <option value="booking">Reservasi & Pembayaran (Booking)</option>
                  <option value="equipment">Alat & Fasilitas (Equipment)</option>
                  <option value="safety">Keamanan & Cuaca (Safety)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Pertanyaan (Bahasa Indonesia) *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Contoh: Apakah pemula yang tidak bisa berenang bisa ikut?"
                  value={formData.questionId}
                  onChange={(e) => setFormData({ ...formData, questionId: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Pertanyaan (English)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Can non-swimmers or beginners join the trip?"
                  value={formData.questionEn}
                  onChange={(e) => setFormData({ ...formData, questionEn: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Jawaban (Bahasa Indonesia) *</label>
                <textarea
                  className="form-control"
                  placeholder="Penjelasan lengkap..."
                  value={formData.answerId}
                  onChange={(e) => setFormData({ ...formData, answerId: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Jawaban (English)</label>
                <textarea
                  className="form-control"
                  placeholder="Detailed answer in English..."
                  value={formData.answerEn}
                  onChange={(e) => setFormData({ ...formData, answerEn: e.target.value })}
                  rows={3}
                />
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
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan FAQ'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={!!deleteTarget}
        title="Hapus FAQ"
        description={`Apakah Anda yakin ingin menghapus pertanyaan "${deleteTarget?.questionId}"?`}
        confirmText="Hapus FAQ"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
