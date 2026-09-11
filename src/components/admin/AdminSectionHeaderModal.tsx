'use client';

import React, { useState, useEffect } from 'react';
import { X, SlidersHorizontal, Sparkles, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

export interface AdminSectionHeaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionTitle: string;
  sectionDescription: string;
  badgeKeyId: string;
  badgeKeyEn: string;
  titleKeyId: string;
  titleKeyEn: string;
  subtitleKeyId: string;
  subtitleKeyEn: string;
  defaults: {
    badgeId: string;
    badgeEn: string;
    titleId: string;
    titleEn: string;
    subtitleId: string;
    subtitleEn: string;
  };
  onSuccess?: () => void;
}

export default function AdminSectionHeaderModal({
  isOpen,
  onClose,
  sectionTitle,
  sectionDescription,
  badgeKeyId,
  badgeKeyEn,
  titleKeyId,
  titleKeyEn,
  subtitleKeyId,
  subtitleKeyEn,
  defaults,
  onSuccess,
}: AdminSectionHeaderModalProps) {
  const [activeTab, setActiveTab] = useState<'id' | 'en'>('id');
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    badgeId: defaults.badgeId,
    badgeEn: defaults.badgeEn,
    titleId: defaults.titleId,
    titleEn: defaults.titleEn,
    subtitleId: defaults.subtitleId,
    subtitleEn: defaults.subtitleEn,
  });

  useEffect(() => {
    if (!isOpen) return;

    // Fetch existing settings from API
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        const map: Record<string, string> = {};
        if (Array.isArray(data)) {
          data.forEach((s: any) => {
            if (s.key && s.value !== undefined) {
              map[s.key] = s.value;
            }
          });
        }
        setFormData({
          badgeId: map[badgeKeyId] || defaults.badgeId,
          badgeEn: map[badgeKeyEn] || defaults.badgeEn,
          titleId: map[titleKeyId] || defaults.titleId,
          titleEn: map[titleKeyEn] || defaults.titleEn,
          subtitleId: map[subtitleKeyId] || defaults.subtitleId,
          subtitleEn: map[subtitleKeyEn] || defaults.subtitleEn,
        });
      })
      .catch((err) => {
        console.error('Gagal memuat pengaturan header seksi:', err);
      });
  }, [isOpen, badgeKeyId, badgeKeyEn, titleKeyId, titleKeyEn, subtitleKeyId, subtitleKeyEn, defaults]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const toastId = toast.loading('Menyimpan judul & deskripsi seksi...');

    try {
      const payload = {
        settings: {
          [badgeKeyId]: formData.badgeId,
          [badgeKeyEn]: formData.badgeEn,
          [titleKeyId]: formData.titleId,
          [titleKeyEn]: formData.titleEn,
          [subtitleKeyId]: formData.subtitleId,
          [subtitleKeyEn]: formData.subtitleEn,
        },
      };

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Gagal menyimpan pengaturan');

      toast.success('Judul & deskripsi seksi berhasil diperbarui!', { id: toastId });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan perubahan', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSaving) {
          onClose();
        }
      }}
    >
      <div
        className="glass-card"
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '28px',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '20px',
            borderBottom: '1px solid var(--border-light)',
            paddingBottom: '14px',
          }}
        >
          <div>
            <h3
              style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                color: 'var(--primary-deep)',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <SlidersHorizontal size={20} color="var(--primary-ocean)" />
              <span>{sectionTitle}</span>
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {sectionDescription}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Language Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '20px',
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: '8px',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('id')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'id' ? '#ffffff' : 'transparent',
              color: activeTab === 'id' ? 'var(--primary-deep)' : 'var(--text-muted)',
              fontWeight: activeTab === 'id' ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'id' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Bahasa Indonesia (ID)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('en')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'en' ? '#ffffff' : 'transparent',
              color: activeTab === 'en' ? 'var(--primary-deep)' : 'var(--text-muted)',
              fontWeight: activeTab === 'en' ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'en' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            English (EN)
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit}>
          {activeTab === 'id' ? (
            <>
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Badge / Label Atas (ID)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Contoh: PAKET PILIHAN"
                  value={formData.badgeId}
                  onChange={(e) => setFormData({ ...formData, badgeId: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Judul Utama Seksi (ID)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Contoh: Pilihan Paket Snorkeling 3 Gili"
                  value={formData.titleId}
                  onChange={(e) => setFormData({ ...formData, titleId: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Subjudul / Deskripsi Seksi (ID)</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Deskripsi pendukung seksi..."
                  value={formData.subtitleId}
                  onChange={(e) => setFormData({ ...formData, subtitleId: e.target.value })}
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Badge / Top Label (EN)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Example: FEATURED PACKAGES"
                  value={formData.badgeEn}
                  onChange={(e) => setFormData({ ...formData, badgeEn: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Section Title (EN)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Example: 3 Gili Snorkeling Tour Packages"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Section Subtitle / Description (EN)</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Supporting section description..."
                  value={formData.subtitleEn}
                  onChange={(e) => setFormData({ ...formData, subtitleEn: e.target.value })}
                />
              </div>
            </>
          )}

          {/* Live Preview Box */}
          <div
            style={{
              background: '#f8fafc',
              borderRadius: '10px',
              padding: '16px',
              marginBottom: '20px',
              border: '1px solid var(--border-light)',
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: '10px',
              }}
            >
              Pratinjau Tampilan ({activeTab === 'id' ? 'Bahasa Indonesia' : 'English'})
            </div>
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  background: 'rgba(0, 119, 182, 0.1)',
                  color: 'var(--primary-ocean)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  marginBottom: '8px',
                }}
              >
                <Sparkles size={12} />
                <span>
                  {activeTab === 'id'
                    ? formData.badgeId || defaults.badgeId
                    : formData.badgeEn || defaults.badgeEn}
                </span>
              </span>
              <h4
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--primary-deep)',
                  marginBottom: '6px',
                }}
              >
                {activeTab === 'id'
                  ? formData.titleId || defaults.titleId
                  : formData.titleEn || defaults.titleEn}
              </h4>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  maxWidth: '500px',
                  margin: '0 auto',
                  lineHeight: 1.5,
                }}
              >
                {activeTab === 'id'
                  ? formData.subtitleId || defaults.subtitleId
                  : formData.subtitleEn || defaults.subtitleEn}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
            }}
          >
            <button
              type="button"
              disabled={isSaving}
              onClick={onClose}
              className="btn btn-secondary btn-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="btn btn-primary btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                opacity: isSaving ? 0.85 : 1,
              }}
            >
              {isSaving ? (
                <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <Save size={15} />
              )}
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Pengaturan Header'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
