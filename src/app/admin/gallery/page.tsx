'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Image as ImageIcon, Plus, Trash2, X, CheckCircle2, Loader2, Filter, Eye, SlidersHorizontal, Tag, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';
import AdminSectionHeaderModal from '@/components/admin/AdminSectionHeaderModal';
import AdminLanguageTabs from '@/components/admin/AdminLanguageTabs';
import ImageUpload from '@/components/admin/ImageUpload';

interface GalleryCategory {
  id: number;
  key: string;
  labelId: string;
  labelEn: string;
  orderIndex?: number | null;
}

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formTab, setFormTab] = useState<'id' | 'en'>('id');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Dynamic categories
  const [dbCategories, setDbCategories] = useState<GalleryCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Category management modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [catLangTab, setCatLangTab] = useState<'id' | 'en'>('id');
  const [editingCategory, setEditingCategory] = useState<GalleryCategory | null>(null);
  const [categoryErrors, setCategoryErrors] = useState<Record<string, string>>({});
  const [categoryForm, setCategoryForm] = useState({ key: '', labelId: '', labelEn: '', orderIndex: 0 });
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState<GalleryCategory | null>(null);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);

  const [formData, setFormData] = useState({
    imageUrl: '',
    titleId: '',
    titleEn: '',
    category: 'turtles',
    orderIndex: 1,
  });

  // Fetch categories from API
  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await fetch('/api/gallery-categories');
      if (res.ok) {
        const data = await res.json();
        setDbCategories(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Build categories list for filter and dropdown
  const allFilterCategories = useMemo(() => [
    { key: 'all', label: 'Semua Kategori' },
    ...dbCategories.map((c) => ({ key: c.key, label: c.labelId })),
  ], [dbCategories]);

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
    fetchCategories();
  }, []);

  const filteredGallery = useMemo(() => {
    if (categoryFilter === 'all') return gallery;
    return gallery.filter((item) => item.category === categoryFilter);
  }, [gallery, categoryFilter]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.imageUrl.trim()) newErrors.imageUrl = 'Unggah foto galeri wajib diisi';
    if (!formData.titleId.trim()) {
      newErrors.titleId = 'Judul foto (Bahasa Indonesia) wajib diisi';
      setFormTab('id');
    } else if (!formData.titleEn.trim()) {
      newErrors.titleEn = 'Judul foto (English) wajib diisi';
      setFormTab('en');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Harap lengkapi semua kolom bertanda merah (*)');
      return;
    }

    setErrors({});
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
        category: dbCategories.length > 0 ? dbCategories[0].key : 'turtles',
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

  // Category CRUD handlers
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!categoryForm.key.trim()) {
      errs.key = 'Slug / Key kategori wajib diisi';
    }
    if (!categoryForm.labelId.trim()) {
      errs.labelId = 'Label (Bahasa Indonesia) wajib diisi';
      setCatLangTab('id');
    } else if (!categoryForm.labelEn.trim()) {
      errs.labelEn = 'Label (English) wajib diisi';
      setCatLangTab('en');
    }

    if (Object.keys(errs).length > 0) {
      setCategoryErrors(errs);
      toast.error('Harap lengkapi semua kolom kategori');
      return;
    }

    setCategoryErrors({});
    setIsSavingCategory(true);
    const toastId = toast.loading(
      editingCategory ? 'Menyimpan perubahan kategori...' : 'Menambahkan kategori baru...'
    );
    try {
      if (editingCategory) {
        const res = await fetch(`/api/gallery-categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryForm),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Gagal memperbarui kategori');
        }

        toast.success('Kategori berhasil diperbarui!', { id: toastId });
      } else {
        const res = await fetch('/api/gallery-categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...categoryForm,
            orderIndex: dbCategories.length + 1,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Gagal menambahkan kategori');
        }

        toast.success('Kategori baru berhasil ditambahkan!', { id: toastId });
      }

      fetchCategories();
      setEditingCategory(null);
      setCategoryForm({ key: '', labelId: '', labelEn: '', orderIndex: 0 });
    } catch (e: any) {
      toast.error(e.message || 'Gagal menyimpan kategori', { id: toastId });
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleConfirmDeleteCategory = async () => {
    if (!deleteCategoryTarget) return;
    setIsDeletingCategory(true);
    const toastId = toast.loading('Menghapus kategori...');
    try {
      const res = await fetch(`/api/gallery-categories/${deleteCategoryTarget.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus kategori');

      toast.success('Kategori berhasil dihapus!', { id: toastId });
      fetchCategories();
      setDeleteCategoryTarget(null);
    } catch (e: any) {
      toast.error(e.message || 'Gagal menghapus kategori', { id: toastId });
    } finally {
      setIsDeletingCategory(false);
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setIsCategoryModalOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Tag size={16} />
            <span>Kelola Kategori</span>
          </button>

          <button
            type="button"
            onClick={() => setIsHeaderModalOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <SlidersHorizontal size={16} />
            <span>Kelola Judul & Header Seksi</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFormData({
                imageUrl: '',
                titleId: '',
                titleEn: '',
                category: dbCategories.length > 0 ? dbCategories[0].key : 'turtles',
                orderIndex: gallery.length + 1,
              });
              setFormTab('id');
              setIsModalOpen(true);
            }}
            className="btn btn-primary btn-sm"
          >
            <Plus size={16} />
            <span>Tambah Foto Baru</span>
          </button>
        </div>
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
        {allFilterCategories.map((c) => (
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
        <div
          style={{
            textAlign: 'center',
            padding: '50px 20px',
            background: '#ffffff',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--border-light)',
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'rgba(0, 180, 216, 0.1)',
              color: 'var(--primary-ocean)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
            }}
          >
            <ImageIcon size={26} />
          </div>
          <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-deep)', marginBottom: '6px', fontWeight: 700 }}>
            Tidak Ada Foto di Kategori Ini
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 16px' }}>
            Belum ada foto yang diunggah dengan kategori ini. Anda dapat mengunggah foto baru atau menampilkan semua kategori.
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {categoryFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setCategoryFilter('all')}
                className="btn btn-secondary btn-sm"
              >
                Lihat Semua Kategori
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  category: categoryFilter !== 'all' ? categoryFilter : (dbCategories[0]?.key || 'turtles'),
                }));
                setIsModalOpen(true);
              }}
              className="btn btn-primary btn-sm"
            >
              <Plus size={14} />
              <span>Tambah Foto ke Kategori Ini</span>
            </button>
          </div>
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
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <ImageUpload
                  label="Unggah Foto Galeri"
                  value={formData.imageUrl}
                  onChange={(url) => {
                    setFormData({ ...formData, imageUrl: url });
                    if (errors.imageUrl) setErrors((prev) => ({ ...prev, imageUrl: '' }));
                  }}
                  required
                  helperText="Upload foto spot 3 Gili, penyu, patung bawah laut, dll (JPG, PNG, WebP maks 10MB)"
                />
                {errors.imageUrl && (
                  <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block', fontWeight: 500 }}>
                    {errors.imageUrl}
                  </span>
                )}
              </div>

              {/* Bilingual Title Switcher */}
              <div style={{ marginTop: '6px', marginBottom: '14px' }}>
                <AdminLanguageTabs
                  activeLang={formTab}
                  onChange={setFormTab}
                  hasErrorId={Boolean(errors.titleId)}
                  hasErrorEn={Boolean(errors.titleEn)}
                />

                {formTab === 'id' ? (
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">
                      Judul Foto (Bahasa Indonesia) <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: Berenang Bersama Penyu di Gili Meno"
                      value={formData.titleId}
                      onChange={(e) => {
                        setFormData({ ...formData, titleId: e.target.value });
                        if (errors.titleId) setErrors((prev) => ({ ...prev, titleId: '' }));
                      }}
                      style={errors.titleId ? { borderColor: '#ef4444', backgroundColor: '#fffbfa' } : {}}
                    />
                    {errors.titleId && (
                      <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block', fontWeight: 500 }}>
                        {errors.titleId}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">
                      Judul Foto (English) <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Swimming with Wild Turtles at Gili Meno"
                      value={formData.titleEn}
                      onChange={(e) => {
                        setFormData({ ...formData, titleEn: e.target.value });
                        if (errors.titleEn) setErrors((prev) => ({ ...prev, titleEn: '' }));
                      }}
                      style={errors.titleEn ? { borderColor: '#ef4444', backgroundColor: '#fffbfa' } : {}}
                    />
                    {errors.titleEn && (
                      <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block', fontWeight: 500 }}>
                        {errors.titleEn}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">
                  Kategori Foto <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
                </label>
                <select
                  className="form-control"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {dbCategories.map((cat) => (
                    <option key={cat.key} value={cat.key}>
                      {cat.labelId} ({cat.labelEn})
                    </option>
                  ))}
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

      {/* Modal Manage Categories */}
      {isCategoryModalOpen && (
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
            if (e.target === e.currentTarget) {
              setIsCategoryModalOpen(false);
              setEditingCategory(null);
              setCategoryForm({ key: '', labelId: '', labelEn: '', orderIndex: 0 });
              setCategoryErrors({});
            }
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '600px',
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              boxShadow: 'var(--shadow-xl)',
              maxHeight: '85vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', color: 'var(--primary-deep)', marginBottom: '4px' }}>
                  Kelola Kategori Galeri
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                  Kelola kategori foto galeri. Kategori baru akan langsung muncul di filter website publik dan form upload foto.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  setEditingCategory(null);
                  setCategoryForm({ key: '', labelId: '', labelEn: '', orderIndex: 0 });
                  setCategoryErrors({});
                }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Existing categories list */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--primary-deep)', marginBottom: '12px', fontWeight: 700 }}>
                Kategori Saat Ini ({dbCategories.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {dbCategories.map((cat) => (
                  <div
                    key={cat.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-sm)',
                      border: editingCategory?.id === cat.id ? '2px solid var(--primary-ocean)' : '1px solid var(--border-light)',
                      background: editingCategory?.id === cat.id ? 'var(--primary-surface)' : '#fafafa',
                      transition: '0.2s',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            background: 'var(--primary-surface)',
                            color: 'var(--primary-ocean)',
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                          }}
                        >
                          {cat.key}
                        </span>
                        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--primary-deep)' }}>
                          {cat.labelId}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
                        EN: {cat.labelEn}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCategory(cat);
                          setCategoryForm({
                            key: cat.key,
                            labelId: cat.labelId,
                            labelEn: cat.labelEn,
                            orderIndex: cat.orderIndex || 0,
                          });
                          setCategoryErrors({});
                        }}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: '#e0f2fe',
                          color: '#0369a1',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        <Pencil size={12} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteCategoryTarget(cat)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: '#fee2e2',
                          color: '#b91c1c',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        <Trash2 size={12} />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
                {dbCategories.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Belum ada kategori. Tambahkan kategori pertama di bawah.
                  </div>
                )}
              </div>
            </div>

            {/* Add / Edit category form */}
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h4 style={{ fontSize: '0.92rem', color: 'var(--primary-deep)', margin: 0, fontWeight: 700 }}>
                  {editingCategory ? `Edit Kategori: ${editingCategory.labelId}` : 'Tambah Kategori Baru'}
                </h4>
                {editingCategory && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCategory(null);
                      setCategoryForm({ key: '', labelId: '', labelEn: '', orderIndex: 0 });
                      setCategoryErrors({});
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary-ocean)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    + Mode Tambah Baru
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveCategory}>
                {/* Key (Slug) Field */}
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>
                    Slug / Key Kategori <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: panorama (huruf kecil & tanpa spasi)"
                    value={categoryForm.key}
                    onChange={(e) => {
                      const val = e.target.value.toLowerCase().replace(/\s+/g, '-');
                      setCategoryForm({ ...categoryForm, key: val });
                      if (categoryErrors.key) setCategoryErrors((prev) => ({ ...prev, key: '' }));
                    }}
                    style={{
                      fontSize: '0.85rem',
                      borderColor: categoryErrors.key ? '#ef4444' : undefined,
                      backgroundColor: categoryErrors.key ? '#fffbfa' : undefined,
                    }}
                  />
                  {categoryErrors.key && (
                    <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block', fontWeight: 500 }}>
                      {categoryErrors.key}
                    </span>
                  )}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                    Slug ini dipertahankan sebagai penanda kategori pada setiap photo dan filter URL.
                  </span>
                </div>

                {/* Bilingual Tabs Switcher */}
                <div style={{ marginBottom: '14px' }}>
                  <AdminLanguageTabs
                    activeLang={catLangTab}
                    onChange={setCatLangTab}
                    hasErrorId={Boolean(categoryErrors.labelId)}
                    hasErrorEn={Boolean(categoryErrors.labelEn)}
                  />

                  {catLangTab === 'id' ? (
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.82rem' }}>
                        Nama Kategori (Bahasa Indonesia) <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: Panorama Laut"
                        value={categoryForm.labelId}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCategoryForm((prev) => ({
                            ...prev,
                            labelId: val,
                            key: editingCategory || prev.key ? prev.key : val.toLowerCase().trim().replace(/[^a-z0-9]/g, '-'),
                          }));
                          if (categoryErrors.labelId) setCategoryErrors((prev) => ({ ...prev, labelId: '' }));
                        }}
                        style={{
                          fontSize: '0.85rem',
                          borderColor: categoryErrors.labelId ? '#ef4444' : undefined,
                          backgroundColor: categoryErrors.labelId ? '#fffbfa' : undefined,
                        }}
                      />
                      {categoryErrors.labelId && (
                        <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block', fontWeight: 500 }}>
                          {categoryErrors.labelId}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.82rem' }}>
                        Nama Kategori (English) <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Ocean Panorama"
                        value={categoryForm.labelEn}
                        onChange={(e) => {
                          setCategoryForm({ ...categoryForm, labelEn: e.target.value });
                          if (categoryErrors.labelEn) setCategoryErrors((prev) => ({ ...prev, labelEn: '' }));
                        }}
                        style={{
                          fontSize: '0.85rem',
                          borderColor: categoryErrors.labelEn ? '#ef4444' : undefined,
                          backgroundColor: categoryErrors.labelEn ? '#fffbfa' : undefined,
                        }}
                      />
                      {categoryErrors.labelEn && (
                        <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block', fontWeight: 500 }}>
                          {categoryErrors.labelEn}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                  {editingCategory && (
                    <button
                      type="button"
                      disabled={isSavingCategory}
                      onClick={() => {
                        setEditingCategory(null);
                        setCategoryForm({ key: '', labelId: '', labelEn: '', orderIndex: 0 });
                        setCategoryErrors({});
                      }}
                      className="btn btn-secondary btn-sm"
                    >
                      Batal Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSavingCategory}
                    className="btn btn-primary btn-sm"
                    style={{ opacity: isSavingCategory ? 0.85 : 1 }}
                  >
                    {isSavingCategory && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
                    <span>{isSavingCategory ? 'Menyimpan...' : (editingCategory ? 'Simpan Perubahan' : 'Tambah Kategori')}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Photo Confirmation Modal */}
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

      {/* Delete Category Confirmation Modal */}
      <AdminConfirmModal
        isOpen={!!deleteCategoryTarget}
        title="Hapus Kategori Galeri"
        description={`Apakah Anda yakin ingin menghapus kategori "${deleteCategoryTarget?.labelId}" (${deleteCategoryTarget?.key})? Foto-foto dengan kategori ini tidak akan otomatis terhapus, tetapi filter kategori ini tidak akan muncul lagi di website.`}
        confirmText="Hapus Kategori"
        variant="danger"
        isLoading={isDeletingCategory}
        onConfirm={handleConfirmDeleteCategory}
        onClose={() => setDeleteCategoryTarget(null)}
      />

      {/* Header Settings Modal */}
      <AdminSectionHeaderModal
        isOpen={isHeaderModalOpen}
        onClose={() => setIsHeaderModalOpen(false)}
        sectionTitle="Pengaturan Header Seksi Galeri Foto"
        sectionDescription="Kelola badge, judul utama, dan subjudul bagian galeri foto & video bawah air di halaman utama website."
        badgeKeyId="gallery_badge_id"
        badgeKeyEn="gallery_badge_en"
        titleKeyId="gallery_title_id"
        titleKeyEn="gallery_title_en"
        subtitleKeyId="gallery_subtitle_id"
        subtitleKeyEn="gallery_subtitle_en"
        defaults={{
          badgeId: "GALERI FOTO & VIDEO",
          badgeEn: "PHOTO & VIDEO GALLERY",
          titleId: "Momen Seru di Bawah Air",
          titleEn: "Captivating Underwater Moments",
          subtitleId:
            "Dokumentasi nyata keseruan para tamu kami saat berenang bersama penyu liar dan menikmati keindahan terumbu karang 3 Gili.",
          subtitleEn:
            "Real underwater memories captured while swimming with sea turtles and exploring vibrant coral reefs across the 3 Gili islands.",
        }}
      />
    </div>
  );
}
