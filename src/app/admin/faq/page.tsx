"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  HelpCircle,
  Plus,
  Edit3,
  Trash2,
  X,
  Loader2,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import { DataTable } from "@/components/admin/DataTable";
import { DataTableColumnHeader } from "@/components/admin/DataTableColumnHeader";
import { ColumnDef } from "@tanstack/react-table";

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    questionId: "",
    questionEn: "",
    answerId: "",
    answerEn: "",
    category: "general",
    orderIndex: 1,
    isActive: true,
  });

  const categories = [
    { key: "all", label: "Semua Kategori" },
    { key: "general", label: "Umum & Lokasi" },
    { key: "booking", label: "Reservasi & Pembayaran" },
    { key: "equipment", label: "Alat & Fasilitas" },
    { key: "safety", label: "Keamanan & Cuaca" },
  ];

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/faq");
      if (res.ok) {
        const data = await res.json();
        setFaqs(data);
      } else {
        toast.error("Gagal memuat daftar FAQ");
      }
    } catch (e) {
      console.error(e);
      toast.error("Terjadi kesalahan jaringan saat memuat FAQ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const filteredFaqs = useMemo(() => {
    if (categoryFilter === "all") return faqs;
    return faqs.filter((f) => f.category === categoryFilter);
  }, [faqs, categoryFilter]);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      questionId: "",
      questionEn: "",
      answerId: "",
      answerEn: "",
      category: "general",
      orderIndex: faqs.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setFormData({
      questionId: item.questionId,
      questionEn: item.questionEn || "",
      answerId: item.answerId,
      answerEn: item.answerEn || "",
      category: item.category || "general",
      orderIndex: item.orderIndex || 1,
      isActive: item.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.questionId || !formData.answerId) {
      toast.error("Pertanyaan dan jawaban wajib diisi!");
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading(
      editingId ? "Menyimpan perubahan FAQ..." : "Menambahkan FAQ baru...",
    );
    try {
      if (editingId) {
        const res = await fetch(`/api/faq/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Gagal memperbarui FAQ");
        toast.success("FAQ berhasil diperbarui!", { id: toastId });
      } else {
        const res = await fetch("/api/faq", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Gagal menambahkan FAQ");
        toast.success("FAQ baru berhasil ditambahkan!", { id: toastId });
      }
      fetchFaqs();
      setIsModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || "Gagal menyimpan FAQ", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const toastId = toast.loading("Menghapus FAQ...");
    try {
      const res = await fetch(`/api/faq/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus");

      setFaqs((prev) => prev.filter((f) => f.id !== deleteTarget.id));
      toast.success("Pertanyaan FAQ berhasil dihapus!", { id: toastId });
      setDeleteTarget(null);
    } catch (e: any) {
      toast.error(e.message || "Gagal menghapus", { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  const columnLabels: Record<string, string> = {
    questionId: "Pertanyaan",
    answerId: "Jawaban",
    category: "Kategori",
  };

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorKey: "questionId",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Pertanyaan" />
        ),
        cell: ({ row }) => {
          const f = row.original;
          return (
            <div style={{ minWidth: "260px", maxWidth: "340px" }}>
              <strong
                style={{
                  color: "var(--primary-deep)",
                  fontSize: "0.92rem",
                  display: "block",
                  lineHeight: 1.45,
                }}
              >
                {f.questionId}
              </strong>
              <span
                style={{
                  fontSize: "0.78rem",
                  color: "var(--text-muted)",
                  display: "block",
                  marginTop: "4px",
                  lineHeight: 1.4,
                }}
              >
                {f.questionEn}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "answerId",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Jawaban" />
        ),
        cell: ({ row }) => {
          const ans = (row.getValue("answerId") as string) || "";
          return (
            <div style={{ minWidth: "320px", maxWidth: "480px" }}>
              <p
                style={{
                  fontSize: "0.86rem",
                  color: "var(--text-main)",
                  margin: 0,
                  lineHeight: 1.55,
                }}
              >
                {ans}
              </p>
            </div>
          );
        },
      },
      {
        accessorKey: "category",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Kategori" />
        ),
        cell: ({ row }) => {
          const cat = (row.getValue("category") as string) || "General";
          return (
            <div style={{ minWidth: "120px" }}>
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "12px",
                  background: "rgba(0, 119, 182, 0.08)",
                  color: "var(--primary-ocean)",
                  border: "1px solid rgba(0, 119, 182, 0.2)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  display: "inline-block",
                }}
              >
                {cat}
              </span>
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
          const f = row.original;
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
                onClick={() => openEditModal(f)}
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
                title="Edit FAQ"
              >
                <Edit3 size={14} />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(f)}
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
                title="Hapus FAQ"
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
            Kelola Tanya Jawab (FAQ)
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Kelola daftar pertanyaan dan jawaban seputar trip snorkeling 3 Gili.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="btn btn-primary btn-sm"
        >
          <Plus size={16} />
          <span>Tambah FAQ Baru</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {categories.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setCategoryFilter(c.key)}
            style={{
              padding: "8px 16px",
              borderRadius: "var(--radius-sm)",
              border:
                categoryFilter === c.key
                  ? "1px solid var(--primary-ocean)"
                  : "1px solid var(--border-light)",
              background:
                categoryFilter === c.key ? "var(--primary-ocean)" : "#ffffff",
              color: categoryFilter === c.key ? "#ffffff" : "var(--text-main)",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {c.label} {c.key === "all" ? `(${faqs.length})` : ""}
          </button>
        ))}
      </div>

      {/* FAQ DataTable */}
      <DataTable
        columns={columns}
        data={filteredFaqs}
        loading={loading}
        searchPlaceholder="Cari pertanyaan atau jawaban..."
        columnLabels={columnLabels}
        emptyMessage="Tidak ada FAQ pada kategori ini."
        initialPageSize={10}
      />

      {/* Modal FAQ */}
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
                {editingId ? "Edit FAQ" : "Tambah FAQ Baru"}
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
              <div className="form-group" style={{ marginBottom: "14px" }}>
                <label className="form-label">Kategori Pertanyaan</label>
                <select
                  className="form-control"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value="general">Umum & Lokasi (General)</option>
                  <option value="booking">
                    Reservasi & Pembayaran (Booking)
                  </option>
                  <option value="equipment">
                    Alat & Fasilitas (Equipment)
                  </option>
                  <option value="safety">Keamanan & Cuaca (Safety)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: "14px" }}>
                <label className="form-label">
                  Pertanyaan (Bahasa Indonesia) *
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Contoh: Apakah pemula yang tidak bisa berenang bisa ikut?"
                  value={formData.questionId}
                  onChange={(e) =>
                    setFormData({ ...formData, questionId: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: "14px" }}>
                <label className="form-label">Pertanyaan (English)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Can non-swimmers or beginners join the trip?"
                  value={formData.questionEn}
                  onChange={(e) =>
                    setFormData({ ...formData, questionEn: e.target.value })
                  }
                />
              </div>

              <div className="form-group" style={{ marginBottom: "14px" }}>
                <label className="form-label">
                  Jawaban (Bahasa Indonesia) *
                </label>
                <textarea
                  className="form-control"
                  placeholder="Penjelasan lengkap..."
                  value={formData.answerId}
                  onChange={(e) =>
                    setFormData({ ...formData, answerId: e.target.value })
                  }
                  rows={3}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: "20px" }}>
                <label className="form-label">Jawaban (English)</label>
                <textarea
                  className="form-control"
                  placeholder="Detailed answer in English..."
                  value={formData.answerEn}
                  onChange={(e) =>
                    setFormData({ ...formData, answerEn: e.target.value })
                  }
                  rows={3}
                />
              </div>

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
                  <span>{isSaving ? "Menyimpan..." : "Simpan FAQ"}</span>
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
