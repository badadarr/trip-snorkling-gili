'use client';

import React, { useState, useEffect } from 'react';
import { HelpCircle, Plus, Edit3, Trash2, X } from 'lucide-react';

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    questionId: '',
    questionEn: '',
    answerId: '',
    answerEn: '',
    category: 'general',
    orderIndex: 1,
    isActive: true,
  });

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/faq');
      if (res.ok) {
        const data = await res.json();
        setFaqs(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

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
      questionEn: item.questionEn,
      answerId: item.answerId,
      answerEn: item.answerEn,
      category: item.category || 'general',
      orderIndex: item.orderIndex || 1,
      isActive: item.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await fetch(`/api/faq/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          fetchFaqs();
          setIsModalOpen(false);
        }
      } else {
        const res = await fetch('/api/faq', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          fetchFaqs();
          setIsModalOpen(false);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus pertanyaan FAQ ini?')) return;
    try {
      const res = await fetch(`/api/faq/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFaqs((prev) => prev.filter((f) => f.id !== id));
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
            Kelola Pertanyaan FAQ
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Daftar tanya jawab umum yang memudahkan calon wisatawan.
          </p>
        </div>
        <button type="button" onClick={openCreateModal} className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>Tambah FAQ Baru</span>
        </button>
      </div>

      <div className="glass-card" style={{ padding: '0', background: '#ffffff', overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Pertanyaan (ID & EN)</th>
              <th>Jawaban (ID)</th>
              <th>Kategori</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '40px' }}>
                  Memuat FAQ...
                </td>
              </tr>
            ) : (
              faqs.map((f) => (
                <tr key={f.id}>
                  <td style={{ maxWidth: '280px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--primary-deep)' }}>{f.questionId}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{f.questionEn}</div>
                  </td>
                  <td style={{ maxWidth: '340px' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                      {f.answerId.length > 90 ? f.answerId.slice(0, 90) + '...' : f.answerId}
                    </p>
                  </td>
                  <td>
                    <span className="section-badge" style={{ fontSize: '0.72rem', padding: '3px 8px', margin: 0 }}>
                      {f.category || 'General'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => openEditModal(f)}
                        style={{ padding: '6px 12px', borderRadius: '6px', background: 'var(--primary-surface)', color: 'var(--primary-ocean)', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(f.id)}
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
              maxWidth: '620px',
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '30px',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-deep)' }}>
                {editingId ? 'Edit FAQ' : 'Tambah FAQ Baru'}
              </h2>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Pertanyaan (Bahasa Indonesia) *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.questionId}
                  onChange={(e) => setFormData({ ...formData, questionId: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Pertanyaan (English) *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.questionEn}
                  onChange={(e) => setFormData({ ...formData, questionEn: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Jawaban (Bahasa Indonesia) *</label>
                <textarea
                  className="form-control"
                  value={formData.answerId}
                  onChange={(e) => setFormData({ ...formData, answerId: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Jawaban (English) *</label>
                <textarea
                  className="form-control"
                  value={formData.answerEn}
                  onChange={(e) => setFormData({ ...formData, answerEn: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
