"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  MessageSquare,
  Plus,
  Edit3,
  Trash2,
  X,
  Star,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import ImageUpload from "@/components/admin/ImageUpload";
import { DataTable } from "@/components/admin/DataTable";
import { DataTableColumnHeader } from "@/components/admin/DataTableColumnHeader";
import { ColumnDef } from "@tanstack/react-table";

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
    name: "",
    origin: "",
    countryCode: "ID",
    rating: 5,
    tripType: "",
    contentId: "",
    contentEn: "",
    avatarUrl: "",
    isActive: true,
  };

  const [formData, setFormData] = useState(initialEmptyTestimonial);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/testimonials");
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      } else {
        toast.error("Gagal memuat daftar testimoni");
      }
    } catch (e) {
      console.error(e);
      toast.error("Terjadi kesalahan jaringan saat memuat testimoni");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const openCreateModal = () => {
    setEditingId(null);
    setErrors({});
    setFormData(initialEmptyTestimonial);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setErrors({});
    setFormData({
      name: item.name,
      origin: item.origin || "",
      countryCode: item.countryCode || "ID",
      rating: item.rating || 5,
      tripType: item.tripType || "",
      contentId: item.contentId,
      contentEn: item.contentEn,
      avatarUrl: item.avatarUrl || "",
      isActive: item.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Nama tamu wajib diisi";
    if (!formData.contentId.trim()) newErrors.contentId = "Isi ulasan (Bahasa Indonesia) wajib diisi";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Harap lengkapi semua kolom bertanda merah (*)");
      return;
    }

    setErrors({});
    setIsSaving(true);
    const toastId = toast.loading(
      editingId
        ? "Menyimpan perubahan testimoni..."
        : "Menambahkan testimoni baru...",
    );
    try {
      if (editingId) {
        const res = await fetch(`/api/testimonials/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Gagal memperbarui testimoni");
        toast.success("Testimoni berhasil diperbarui!", { id: toastId });
      } else {
        const res = await fetch("/api/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Gagal menambahkan testimoni");
        toast.success("Testimoni baru berhasil ditambahkan!", { id: toastId });
      }
      fetchTestimonials();
      setIsModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || "Gagal menyimpan testimoni", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const toastId = toast.loading("Menghapus ulasan testimoni...");
    try {
      const res = await fetch(`/api/testimonials/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus");

      setTestimonials((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      toast.success(`Ulasan dari "${deleteTarget.name}" berhasil dihapus!`, {
        id: toastId,
      });
      setDeleteTarget(null);
    } catch (e: any) {
      toast.error(e.message || "Gagal menghapus testimoni", { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  const columnLabels: Record<string, string> = {
    name: "Nama Tamu",
    tripType: "Asal & Paket",
    rating: "Rating",
    contentId: "Ulasan",
  };

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Nama Tamu" />
        ),
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                minWidth: "200px",
              }}
            >
              {item.avatarUrl ? (
                <img
                  src={item.avatarUrl}
                  alt={item.name}
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    flexShrink: 0,
                    border: "1px solid var(--border-light)",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    background: "rgba(0, 119, 182, 0.08)",
                    color: "var(--primary-ocean)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "1rem",
                    flexShrink: 0,
                    border: "1px solid rgba(0, 119, 182, 0.2)",
                  }}
                >
                  {item.name ? item.name.charAt(0).toUpperCase() : "?"}
                </div>
              )}
              <div>
                <strong
                  style={{
                    color: "var(--primary-deep)",
                    fontSize: "0.92rem",
                    display: "block",
                  }}
                >
                  {item.name}
                </strong>
                <div
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--text-muted)",
                    marginTop: "2px",
                  }}
                >
                  {item.origin}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "tripType",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Asal & Paket" />
        ),
        cell: ({ row }) => (
          <div style={{ minWidth: "160px" }}>
            <span
              style={{
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "var(--primary-ocean)",
                background: "rgba(0, 119, 182, 0.06)",
                padding: "4px 10px",
                borderRadius: "6px",
                border: "1px solid rgba(0, 119, 182, 0.15)",
                display: "inline-block",
              }}
            >
              {row.getValue("tripType") || "Snorkeling Trip"}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "rating",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Rating" />
        ),
        cell: ({ row }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "3px",
              minWidth: "120px",
            }}
          >
            {[...Array(Number(row.getValue("rating")) || 5)].map((_, i) => (
              <Star key={i} size={15} fill="#ffb703" color="#ffb703" />
            ))}
          </div>
        ),
      },
      {
        accessorKey: "contentId",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Ulasan" />
        ),
        cell: ({ row }) => {
          const text = (row.getValue("contentId") as string) || "";
          return (
            <div style={{ minWidth: "300px", maxWidth: "460px" }}>
              <p
                style={{
                  fontSize: "0.86rem",
                  color: "var(--text-main)",
                  margin: 0,
                  lineHeight: 1.55,
                  fontStyle: "italic",
                }}
              >
                "{text}"
              </p>
            </div>
          );
        },
      },
      {
        id: "actions",
        enableHiding: false,
        header: () => (
          <div
            style={{
              textAlign: "right",
              paddingRight: "6px",
              fontWeight: 700,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#475569",
            }}
          >
            Aksi
          </div>
        ),
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "6px",
                minWidth: "120px",
              }}
            >
              <button
                type="button"
                onClick={() => openEditModal(item)}
                style={{
                  height: "34px",
                  padding: "0 12px",
                  borderRadius: "8px",
                  background: "#f0f9ff",
                  color: "#0077b6",
                  border: "1px solid #bae6fd",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#e0f2fe";
                  e.currentTarget.style.borderColor = "#7dd3fc";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f0f9ff";
                  e.currentTarget.style.borderColor = "#bae6fd";
                }}
                title="Edit Testimoni"
              >
                <Edit3 size={14} />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(item)}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "8px",
                  background: "#fff1f2",
                  color: "#e11d48",
                  border: "1px solid #fecdd3",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#ffe4e6";
                  e.currentTarget.style.borderColor = "#fda4af";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff1f2";
                  e.currentTarget.style.borderColor = "#fecdd3";
                }}
                title="Hapus Testimoni"
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <div>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.75rem",
              color: "var(--primary-deep)",
              marginBottom: "4px",
            }}
          >
            Kelola Testimoni Tamu
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Daftar ulasan dan pengalaman wisatawan snorkeling yang tampil di
            website.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="btn btn-primary btn-sm"
        >
          <Plus size={16} />
          <span>Tambah Testimoni Baru</span>
        </button>
      </div>

      {/* Testimonials DataTable */}
      <DataTable
        columns={columns}
        data={testimonials}
        loading={loading}
        searchPlaceholder="Cari nama tamu, asal, ulasan..."
        columnLabels={columnLabels}
        emptyMessage="Belum ada testimoni. Klik 'Tambah Testimoni Baru' untuk menambahkan ulasan."
        initialPageSize={10}
      />

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(10, 25, 47, 0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSaving)
              setIsModalOpen(false);
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "620px",
              maxHeight: "90vh",
              background: "#ffffff",
              borderRadius: "var(--radius-lg)",
              padding: "28px",
              boxShadow: "var(--shadow-xl)",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <h2
                style={{
                  fontSize: "1.3rem",
                  color: "var(--primary-deep)",
                  margin: 0,
                }}
              >
                {editingId ? "Edit Testimoni" : "Tambah Testimoni Baru"}
              </h2>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginBottom: "14px",
                }}
              >
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">
                    Nama Tamu <span style={{ color: "#ef4444", fontWeight: 700 }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Rian & Amanda"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    style={errors.name ? { borderColor: "#ef4444", backgroundColor: "#fffbfa" } : {}}
                  />
                  {errors.name && (
                    <span style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "4px", display: "block", fontWeight: 500 }}>
                      {errors.name}
                    </span>
                  )}
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Kota / Negara Asal</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Jakarta, Indonesia / Sydney, Australia"
                    value={formData.origin}
                    onChange={(e) =>
                      setFormData({ ...formData, origin: e.target.value })
                    }
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginBottom: "14px",
                }}
              >
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Jenis Paket Trip</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Private Glass Bottom Boat"
                    value={formData.tripType}
                    onChange={(e) =>
                      setFormData({ ...formData, tripType: e.target.value })
                    }
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Rating Bintang</label>
                  <select
                    className="form-control"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rating: parseInt(e.target.value) || 5,
                      })
                    }
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Bintang - Sempurna)</option>
                    <option value={4}>
                      ⭐⭐⭐⭐ (4 Bintang - Sangat Bagus)
                    </option>
                    <option value={3}>⭐⭐⭐ (3 Bintang - Cukup)</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: "14px" }}>
                <label className="form-label">
                  Isi Ulasan (Bahasa Indonesia) <span style={{ color: "#ef4444", fontWeight: 700 }}>*</span>
                </label>
                <textarea
                  className="form-control"
                  placeholder="Cerita pengalaman tamu..."
                  value={formData.contentId}
                  onChange={(e) => {
                    setFormData({ ...formData, contentId: e.target.value });
                    if (errors.contentId) setErrors((prev) => ({ ...prev, contentId: "" }));
                  }}
                  rows={3}
                  style={errors.contentId ? { borderColor: "#ef4444", backgroundColor: "#fffbfa" } : {}}
                />
                {errors.contentId && (
                  <span style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "4px", display: "block", fontWeight: 500 }}>
                    {errors.contentId}
                  </span>
                )}
              </div>

              <div className="form-group" style={{ marginBottom: "14px" }}>
                <label className="form-label">Isi Ulasan (English)</label>
                <textarea
                  className="form-control"
                  placeholder="Guest review in English..."
                  value={formData.contentEn}
                  onChange={(e) =>
                    setFormData({ ...formData, contentEn: e.target.value })
                  }
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

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
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
                  {isSaving && (
                    <Loader2
                      size={15}
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                  )}
                  <span>{isSaving ? "Menyimpan..." : "Simpan Testimoni"}</span>
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
