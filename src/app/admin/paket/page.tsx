"use client";

import React, { useState, useEffect } from "react";
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
  MapPin,
  User,
  Ship,
  Clock,
  DollarSign,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import ImageUpload from "@/components/admin/ImageUpload";
import { formatIdr, formatUsd } from "@/lib/format";

export default function AdminPackagesPage() {
  const router = useRouter();
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
    "Turtle Point (Gili Meno)",
    "Patung Bawah Air (Bask Nest)",
    "Blue Coral Garden (Gili Air)",
    "Sunset Point Gili Trawangan",
    "Shark Point (Gili Trawangan)",
  ];

  const includeSuggestions = [
    "Perahu Glass Bottom Boat",
    "Masker & Snorkel Gear",
    "Life Jacket (Pelampung)",
    "Pemandu Snorkeling Berpengalaman",
    "Dokumentasi Foto & Video GoPro HD",
    "Air Mineral Dingin",
    "Roti untuk Pakan Ikan",
  ];

  // Helper to convert 24h "09:30" to 12h "09:30 AM"
  const formatTimeTo12Hour = (timeStr: string): string => {
    if (!timeStr) return "";
    const [hStr, mStr] = timeStr.split(":");
    const h = parseInt(hStr, 10);
    const m = mStr || "00";
    if (isNaN(h)) return timeStr;
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    const padHour = hour12 < 10 ? `0${hour12}` : `${hour12}`;
    return `${padHour}:${m} ${ampm}`;
  };

  // Initial clean form state
  const initialEmptyPackage = {
    slug: "",
    nameId: "",
    nameEn: "",
    tagId: "",
    tagEn: "",
    descriptionId: "",
    descriptionEn: "",
    price: 0,
    priceUsd: 0,
    priceUnit: "per_person",
    durationId: "",
    durationEn: "",
    scheduleId: "",
    scheduleEn: "",
    spots: [] as string[],
    includes: [] as string[],
    imageUrl: "",
    isFeatured: false,
    isActive: true,
  };

  const [formData, setFormData] = useState(initialEmptyPackage);
  const [newSpotInput, setNewSpotInput] = useState("");
  const [newIncludeInput, setNewIncludeInput] = useState("");

  // Structured time & duration pickers state
  const [usdInputStr, setUsdInputStr] = useState<string>("");
  const [timePicker1, setTimePicker1] = useState("09:30");
  const [timePicker2, setTimePicker2] = useState("13:30");
  const [hasSecondSlot, setHasSecondSlot] = useState(false);
  const [isScheduleFlexible, setIsScheduleFlexible] = useState(false);

  const [durationHoursMin, setDurationHoursMin] = useState(4);
  const [durationHoursMax, setDurationHoursMax] = useState(5);
  const [durationIsFlexible, setDurationIsFlexible] = useState(false);

  const updateScheduleFromTimes = (
    t1: string,
    t2: string,
    has2: boolean,
    flex: boolean,
  ) => {
    if (flex) {
      setFormData((prev) => ({
        ...prev,
        scheduleId: "Waktu keberangkatan bebas (Fleksibel)",
        scheduleEn: "Flexible departure time (On Request)",
      }));
      return;
    }

    if (!t1) return;

    if (has2 && t2) {
      const t1En = formatTimeTo12Hour(t1);
      const t2En = formatTimeTo12Hour(t2);
      setFormData((prev) => ({
        ...prev,
        scheduleId: `${t1} & ${t2} WITA`,
        scheduleEn: `${t1En} & ${t2En} WITA`,
      }));
    } else {
      const t1En = formatTimeTo12Hour(t1);
      setFormData((prev) => ({
        ...prev,
        scheduleId: `${t1} WITA`,
        scheduleEn: `${t1En} WITA`,
      }));
    }
  };

  const updateDurationFromHours = (
    minH: number,
    maxH: number,
    flex: boolean,
  ) => {
    const flexId = flex ? " (Fleksibel)" : "";
    const flexEn = flex ? " (Flexible)" : "";
    if (maxH && maxH > minH) {
      setFormData((prev) => ({
        ...prev,
        durationId: `${minH} - ${maxH} Jam${flexId}`,
        durationEn: `${minH} - ${maxH} Hours${flexEn}`,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        durationId: `${minH} Jam${flexId}`,
        durationEn: `${minH} Hours${flexEn}`,
      }));
    }
  };

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/packages");
      if (res.ok) {
        const data = await res.json();
        setPackages(data);
      } else {
        toast.error("Gagal memuat daftar paket");
      }
    } catch (e) {
      console.error(e);
      toast.error("Terjadi kesalahan jaringan saat memuat paket");
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
      ...initialEmptyPackage,
    });
    setUsdInputStr("");
    setTimePicker1("09:30");
    setTimePicker2("13:30");
    setHasSecondSlot(false);
    setIsScheduleFlexible(false);
    setDurationHoursMin(4);
    setDurationHoursMax(5);
    setDurationIsFlexible(false);
    setNewSpotInput("");
    setNewIncludeInput("");
    setIsModalOpen(true);
  };

  const openEditModal = (pkg: any) => {
    setEditingId(pkg.id);
    const spots = Array.isArray(pkg.spotsId)
      ? pkg.spotsId
      : typeof pkg.spotsId === "string"
        ? pkg.spotsId
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [];

    const includes = Array.isArray(pkg.includesId)
      ? pkg.includesId
      : typeof pkg.includesId === "string"
        ? pkg.includesId
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [];

    setUsdInputStr(pkg.priceUsd ? String(pkg.priceUsd) : "");

    setFormData({
      slug: pkg.slug,
      nameId: pkg.nameId,
      nameEn: pkg.nameEn,
      tagId: pkg.tagId || "",
      tagEn: pkg.tagEn || "",
      descriptionId: pkg.descriptionId,
      descriptionEn: pkg.descriptionEn,
      price: pkg.price,
      priceUsd: pkg.priceUsd,
      priceUnit:
        pkg.priceUnit || (pkg.price > 500000 ? "per_boat" : "per_person"),
      durationId: pkg.durationId || "",
      durationEn: pkg.durationEn || "",
      scheduleId: pkg.scheduleId || "",
      scheduleEn: pkg.scheduleEn || "",
      spots:
        spots.length > 0
          ? spots
          : ["Turtle Point (Gili Meno)", "Patung Bawah Air (Bask Nest)"],
      includes:
        includes.length > 0
          ? includes
          : ["Masker & Snorkel", "Life Jacket", "GoPro HD"],
      imageUrl: pkg.imageUrl,
      isFeatured: !!pkg.isFeatured,
      isActive: pkg.isActive !== false,
    });
    setNewSpotInput("");
    setNewIncludeInput("");
    setIsModalOpen(true);
  };

  const handleDuplicate = (pkg: any) => {
    setEditingId(null);
    const spots = Array.isArray(pkg.spotsId) ? pkg.spotsId : [];
    const includes = Array.isArray(pkg.includesId) ? pkg.includesId : [];

    setUsdInputStr(pkg.priceUsd ? String(pkg.priceUsd) : "");

    setFormData({
      slug: `${pkg.slug}-copy-${Date.now().toString().slice(-4)}`,
      nameId: `${pkg.nameId} (Salinan)`,
      nameEn: `${pkg.nameEn} (Copy)`,
      tagId: pkg.tagId || "",
      tagEn: pkg.tagEn || "",
      descriptionId: pkg.descriptionId,
      descriptionEn: pkg.descriptionEn,
      price: pkg.price,
      priceUsd: pkg.priceUsd,
      priceUnit:
        pkg.priceUnit || (pkg.price > 500000 ? "per_boat" : "per_person"),
      durationId: pkg.durationId || "",
      durationEn: pkg.durationEn || "",
      scheduleId: pkg.scheduleId || "",
      scheduleEn: pkg.scheduleEn || "",
      spots: [...spots],
      includes: [...includes],
      imageUrl: pkg.imageUrl,
      isFeatured: false,
      isActive: true,
    });
    setNewSpotInput("");
    setNewIncludeInput("");
    setIsModalOpen(true);
    toast.info("Paket berhasil diduplikasi. Silakan edit dan simpan.");
  };

  const handleQuickToggleActive = async (pkg: any) => {
    const newStatus = !pkg.isActive;
    try {
      const res = await fetch(`/api/packages/${pkg.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...pkg, isActive: newStatus }),
      });
      if (!res.ok) throw new Error("Gagal mengubah status");
      setPackages((prev) =>
        prev.map((p) => (p.id === pkg.id ? { ...p, isActive: newStatus } : p)),
      );
      toast.success(
        `Paket ${pkg.nameId} ${newStatus ? "diaktifkan" : "dinonaktifkan"}!`,
      );
    } catch (e: any) {
      toast.error(e.message || "Gagal mengubah status");
    }
  };

  const handleQuickToggleFeatured = async (pkg: any) => {
    const newFeatured = !pkg.isFeatured;
    try {
      const res = await fetch(`/api/packages/${pkg.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...pkg, isFeatured: newFeatured }),
      });
      if (!res.ok) throw new Error("Gagal mengubah status featured");
      setPackages((prev) =>
        prev.map((p) =>
          p.id === pkg.id ? { ...p, isFeatured: newFeatured } : p,
        ),
      );
      toast.success(
        `Status Popular/Featured ${pkg.nameId} berhasil diperbarui!`,
      );
    } catch (e: any) {
      toast.error(e.message || "Gagal mengubah status");
    }
  };

  // Add & Remove Spot Chips
  const handleAddSpot = (spotName: string) => {
    const trimmed = spotName.trim();
    if (!trimmed || formData.spots.includes(trimmed)) return;
    setFormData((prev) => ({ ...prev, spots: [...prev.spots, trimmed] }));
    setNewSpotInput("");
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
    setNewIncludeInput("");
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
    const toastId = toast.loading(
      editingId ? "Menyimpan perubahan paket..." : "Menambahkan paket baru...",
    );

    const payload = {
      ...formData,
      tagId: formData.tagId?.trim() || "",
      tagEn: formData.tagEn?.trim() || formData.tagId?.trim() || "",
      spotsId: formData.spots,
      spotsEn: formData.spots,
      includesId: formData.includes,
      includesEn: formData.includes,
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/packages/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.status === 401) {
          toast.error(
            "Sesi admin berakhir atau belum login. Mengalihkan ke login...",
            { id: toastId },
          );
          router.push("/admin/login");
          return;
        }
        if (!res.ok) throw new Error("Gagal memperbarui paket");
        toast.success("Paket snorkeling berhasil diperbarui!", { id: toastId });
      } else {
        const res = await fetch("/api/packages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.status === 401) {
          toast.error(
            "Sesi admin berakhir atau belum login. Mengalihkan ke login...",
            { id: toastId },
          );
          router.push("/admin/login");
          return;
        }
        if (!res.ok) throw new Error("Gagal menambahkan paket");
        toast.success("Paket snorkeling baru berhasil ditambahkan!", {
          id: toastId,
        });
      }
      fetchPackages();
      setIsModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || "Terjadi kesalahan saat menyimpan", {
        id: toastId,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const toastId = toast.loading("Menghapus paket...");
    try {
      const res = await fetch(`/api/packages/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus paket");

      setPackages((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      toast.success(`Paket "${deleteTarget.nameId}" berhasil dihapus!`, {
        id: toastId,
      });
      setDeleteTarget(null);
    } catch (e: any) {
      toast.error(e.message || "Gagal menghapus paket", { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

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
            Kelola Paket Snorkeling Trip
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Atur harga IDR/USD, spot destinasi 3 Gili, fasilitas include, dan
            status tampil paket.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="btn btn-primary btn-sm"
        >
          <Plus size={16} />
          <span>Tambah Paket Baru</span>
        </button>
      </div>

      {/* Packages Table */}
      <div
        className="glass-card"
        style={{ padding: "0", background: "#ffffff", overflow: "hidden" }}
      >
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Paket Trip</th>
                <th>Harga (IDR / USD)</th>
                <th>Durasi & Jadwal</th>
                <th>Spot & Fasilitas</th>
                <th>Featured</th>
                <th>Status</th>
                <th style={{ textAlign: "center" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{ textAlign: "center", padding: "40px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        color: "var(--primary-ocean)",
                      }}
                    >
                      <Loader2
                        size={20}
                        style={{ animation: "spin 1s linear infinite" }}
                      />
                      <span>Memuat data paket trip...</span>
                    </div>
                  </td>
                </tr>
              ) : packages.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "var(--text-muted)",
                    }}
                  >
                    Belum ada paket snorkeling. Klik "Tambah Paket Baru" untuk
                    membuat.
                  </td>
                </tr>
              ) : (
                packages.map((pkg) => (
                  <tr key={pkg.id}>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <img
                          src={pkg.imageUrl}
                          alt={pkg.nameId}
                          style={{
                            width: "56px",
                            height: "42px",
                            borderRadius: "6px",
                            objectFit: "cover",
                            flexShrink: 0,
                          }}
                        />
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                            <strong
                              style={{
                                color: "var(--primary-deep)",
                                fontSize: "0.92rem",
                              }}
                            >
                              {pkg.nameId}
                            </strong>
                            {(pkg.tagId || pkg.tagEn) && (
                              <span
                                style={{
                                  fontSize: "0.68rem",
                                  padding: "1px 6px",
                                  borderRadius: "var(--radius-full)",
                                  background: "#fef3c7",
                                  color: "#b45309",
                                  fontWeight: 700,
                                }}
                              >
                                {pkg.tagId || pkg.tagEn}
                              </span>
                            )}
                          </div>
                          <span
                            style={{
                              fontSize: "0.78rem",
                              color: "var(--text-muted)",
                              display: "block",
                            }}
                          >
                            {pkg.nameEn}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          flexWrap: "wrap",
                        }}
                      >
                        <strong
                          style={{
                            color: "var(--primary-ocean)",
                            fontSize: "0.92rem",
                          }}
                        >
                          Rp {pkg.price?.toLocaleString("id-ID")}
                        </strong>
                        <span
                          style={{
                            fontSize: "0.72rem",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            background:
                              pkg.priceUnit === "per_boat"
                                ? "#ede9fe"
                                : "#e0f2fe",
                            color:
                              pkg.priceUnit === "per_boat"
                                ? "#6d28d9"
                                : "#0369a1",
                            fontWeight: 700,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          {pkg.priceUnit === "per_boat" ? (
                            <Ship size={12} />
                          ) : (
                            <User size={12} />
                          )}
                          <span>
                            {pkg.priceUnit === "per_boat"
                              ? "Per Boat"
                              : "Per Orang"}
                          </span>
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "0.78rem",
                          color: "var(--text-muted)",
                          marginTop: "2px",
                        }}
                      >
                        ${pkg.priceUsd} USD{" "}
                        {pkg.priceUnit === "per_boat" ? "/ boat" : "/ person"}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                        {pkg.durationId}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        {pkg.scheduleId}
                      </div>
                    </td>

                    <td>
                      <div
                        style={{
                          fontSize: "0.78rem",
                          color: "var(--text-main)",
                        }}
                      >
                        <strong>
                          {Array.isArray(pkg.spotsId) ? pkg.spotsId.length : 0}{" "}
                          Spot
                        </strong>{" "}
                        Destinasi
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        {Array.isArray(pkg.includesId)
                          ? pkg.includesId.length
                          : 0}{" "}
                        Fasilitas Include
                      </div>
                    </td>

                    <td>
                      <button
                        type="button"
                        onClick={() => handleQuickToggleFeatured(pkg)}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          color: pkg.isFeatured
                            ? "#d97706"
                            : "var(--text-muted)",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                        }}
                        title="Klik untuk toggle Featured"
                      >
                        <Star
                          size={16}
                          fill={pkg.isFeatured ? "#ffb703" : "none"}
                        />
                        <span>{pkg.isFeatured ? "Ya" : "Tidak"}</span>
                      </button>
                    </td>

                    <td>
                      <button
                        type="button"
                        onClick={() => handleQuickToggleActive(pkg)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "var(--radius-full)",
                          border: "none",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          background: pkg.isActive ? "#d1fae5" : "#fee2e2",
                          color: pkg.isActive ? "#065f46" : "#b91c1c",
                        }}
                      >
                        {pkg.isActive ? "● Aktif" : "○ Nonaktif"}
                      </button>
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: "6px",
                          justifyContent: "center",
                        }}
                      >
                        {/* Duplicate */}
                        <button
                          type="button"
                          onClick={() => handleDuplicate(pkg)}
                          style={{
                            padding: "6px 8px",
                            borderRadius: "6px",
                            background: "#f1f5f9",
                            color: "var(--text-main)",
                            border: "1px solid var(--border-light)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "0.78rem",
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
                            padding: "6px 10px",
                            borderRadius: "6px",
                            background: "var(--primary-surface)",
                            color: "var(--primary-ocean)",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "0.78rem",
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
                            padding: "6px",
                            borderRadius: "6px",
                            background: "#fee2e2",
                            color: "#b91c1c",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
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
              maxWidth: "760px",
              maxHeight: "90vh",
              background: "#ffffff",
              borderRadius: "var(--radius-lg)",
              overflowY: "auto",
              padding: "30px",
              boxShadow: "var(--shadow-xl)",
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
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    padding: "8px",
                    borderRadius: "10px",
                    background: "var(--primary-surface)",
                    color: "var(--primary-ocean)",
                  }}
                >
                  <Package size={20} />
                </div>
                <h2
                  style={{
                    fontSize: "1.3rem",
                    color: "var(--primary-deep)",
                    margin: 0,
                  }}
                >
                  {editingId
                    ? "Edit Paket Snorkeling"
                    : "Tambah Paket Snorkeling Baru"}
                </h2>
              </div>

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
              {/* Name ID & EN */}
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
                    Nama Paket (Bahasa Indonesia) *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Snorkeling Sharing Glass Bottom Boat"
                    value={formData.nameId}
                    onChange={(e) =>
                      setFormData({ ...formData, nameId: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFormData({ ...formData, nameEn: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Slug URL */}
              <div className="form-group" style={{ marginBottom: "14px" }}>
                <label className="form-label">Slug URL (Unik) *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="contoh: zubaidah-trip-snorkling"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  required
                />
              </div>

              {/* Tag / Badge ID & EN */}
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
                    Tag / Badge (Bahasa Indonesia)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="contoh: Paling Populer / Best Value"
                    value={formData.tagId}
                    onChange={(e) => {
                      const val = e.target.value;
                      const prevTagId = formData.tagId;
                      // Auto-sync tagEn if tagEn is empty or was in sync with tagId
                      const shouldSync = !formData.tagEn || formData.tagEn === prevTagId;
                      setFormData({
                        ...formData,
                        tagId: val,
                        tagEn: shouldSync ? val : formData.tagEn,
                      });
                    }}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Tag / Badge (English)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Most Popular / Best Value"
                    value={formData.tagEn}
                    onChange={(e) =>
                      setFormData({ ...formData, tagEn: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Formatted Price IDR & USD */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginBottom: "16px",
                }}
              >
                <div className="form-group" style={{ margin: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "6px",
                    }}
                  >
                    <label className="form-label" style={{ margin: 0 }}>
                      Harga IDR (Rupiah) *
                    </label>
                    {formData.price > 0 && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "var(--primary-ocean)",
                        }}
                      >
                        {formatIdr(formData.price)}
                      </span>
                    )}
                  </div>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--text-muted)",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                      }}
                    >
                      Rp
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      style={{ paddingLeft: "38px", fontWeight: 600 }}
                      placeholder="150.000"
                      value={
                        formData.price
                          ? new Intl.NumberFormat("id-ID").format(
                              formData.price,
                            )
                          : ""
                      }
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9]/g, "");
                        const num = raw ? parseInt(raw, 10) : 0;
                        let newUsd = formData.priceUsd;
                        if (
                          (formData.priceUsd === 0 || !formData.priceUsd) &&
                          num > 0
                        ) {
                          const approx = Number((num / 15500).toFixed(2));
                          newUsd = approx;
                          setUsdInputStr(String(approx));
                        }
                        setFormData({
                          ...formData,
                          price: num,
                          priceUsd: newUsd,
                        });
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "6px",
                    }}
                  >
                    <label className="form-label" style={{ margin: 0 }}>
                      Harga USD ($) *
                    </label>
                    {formData.priceUsd > 0 && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "#059669",
                        }}
                      >
                        {formatUsd(formData.priceUsd)}
                      </span>
                    )}
                  </div>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--text-muted)",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                      }}
                    >
                      $
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      style={{ paddingLeft: "28px", fontWeight: 600 }}
                      placeholder="44.30"
                      value={usdInputStr}
                      onChange={(e) => {
                        let raw = e.target.value;
                        // Allow digits, comma, and period
                        raw = raw.replace(/[^0-9.,]/g, "");
                        // Limit to at most 1 decimal separator
                        const separatorIndex = raw.search(/[.,]/);
                        if (separatorIndex !== -1) {
                          const before = raw.slice(0, separatorIndex + 1);
                          const after = raw
                            .slice(separatorIndex + 1)
                            .replace(/[.,]/g, "");
                          raw = before + after;
                        }
                        setUsdInputStr(raw);
                        const parsed = parseFloat(raw.replace(",", "."));
                        setFormData({
                          ...formData,
                          priceUsd: isNaN(parsed) ? 0 : parsed,
                        });
                      }}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Unit (Per Person vs Per Boat) */}
              <div className="form-group" style={{ marginBottom: "18px" }}>
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Satuan Tarif / Skema Perhitungan Harga *
                </label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      padding: "12px 14px",
                      borderRadius: "var(--radius-sm)",
                      border:
                        formData.priceUnit === "per_person"
                          ? "2px solid var(--primary-ocean)"
                          : "1px solid var(--border-light)",
                      background:
                        formData.priceUnit === "per_person"
                          ? "var(--primary-surface)"
                          : "#f8fafc",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="priceUnit"
                      value="per_person"
                      checked={formData.priceUnit === "per_person"}
                      onChange={() =>
                        setFormData({ ...formData, priceUnit: "per_person" })
                      }
                      style={{ marginTop: "3px" }}
                    />
                    <div>
                      <strong
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "0.88rem",
                          color: "var(--primary-deep)",
                        }}
                      >
                        <User size={15} color="var(--primary-ocean)" />
                        <span>Per Orang (Per Person)</span>
                      </strong>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                          lineHeight: 1.3,
                          display: "block",
                          marginTop: "2px",
                        }}
                      >
                        Tarif dikalikan jumlah peserta (Public Sharing Trip).
                      </span>
                    </div>
                  </label>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      padding: "12px 14px",
                      borderRadius: "var(--radius-sm)",
                      border:
                        formData.priceUnit === "per_boat"
                          ? "2px solid var(--primary-ocean)"
                          : "1px solid var(--border-light)",
                      background:
                        formData.priceUnit === "per_boat"
                          ? "var(--primary-surface)"
                          : "#f8fafc",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="priceUnit"
                      value="per_boat"
                      checked={formData.priceUnit === "per_boat"}
                      onChange={() =>
                        setFormData({ ...formData, priceUnit: "per_boat" })
                      }
                      style={{ marginTop: "3px" }}
                    />
                    <div>
                      <strong
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "0.88rem",
                          color: "var(--primary-deep)",
                        }}
                      >
                        <Ship size={15} color="var(--primary-ocean)" />
                        <span>Per Perahu (Per Boat / Private)</span>
                      </strong>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                          lineHeight: 1.3,
                          display: "block",
                          marginTop: "2px",
                        }}
                      >
                        Harga flat rombongan satu perahu (Private Boat).
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Interactive Duration & Departure Schedule Controls */}
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid var(--border-light)",
                  borderRadius: "var(--radius-md)",
                  padding: "16px",
                  marginBottom: "18px",
                }}
              >
                {/* 1. Durasi Trip Section */}
                <div style={{ marginBottom: "18px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <label
                      className="form-label"
                      style={{
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontWeight: 700,
                      }}
                    >
                      <Clock size={15} color="var(--primary-ocean)" />
                      <span>Durasi Trip Snorkeling *</span>
                    </label>
                    {formData.durationId && (
                      <span
                        style={{
                          fontSize: "0.78rem",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background: "#e0f2fe",
                          color: "var(--primary-ocean)",
                          fontWeight: 700,
                        }}
                      >
                        {formData.durationId} ({formData.durationEn})
                      </span>
                    )}
                  </div>

                  {/* Preset Duration Buttons */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                      marginBottom: "10px",
                    }}
                  >
                    {[
                      { label: "2 - 2.5 Jam", min: 2, max: 2.5, flex: false },
                      { label: "3 - 3.5 Jam", min: 3, max: 3.5, flex: false },
                      {
                        label: "4 - 5 Jam (Standar)",
                        min: 4,
                        max: 5,
                        flex: false,
                      },
                      {
                        label: "4 - 5 Jam (Fleksibel)",
                        min: 4,
                        max: 5,
                        flex: true,
                      },
                      {
                        label: "6 - 7 Jam (Full Day)",
                        min: 6,
                        max: 7,
                        flex: false,
                      },
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setDurationHoursMin(preset.min);
                          setDurationHoursMax(preset.max);
                          setDurationIsFlexible(preset.flex);
                          updateDurationFromHours(
                            preset.min,
                            preset.max,
                            preset.flex,
                          );
                        }}
                        style={{
                          padding: "5px 10px",
                          borderRadius: "6px",
                          border: formData.durationId.startsWith(
                            `${preset.min}`,
                          )
                            ? "1.5px solid var(--primary-ocean)"
                            : "1px solid var(--border-light)",
                          background: formData.durationId.startsWith(
                            `${preset.min}`,
                          )
                            ? "var(--primary-surface)"
                            : "#ffffff",
                          color: formData.durationId.startsWith(`${preset.min}`)
                            ? "var(--primary-ocean)"
                            : "var(--text-main)",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Custom Hours Pickers */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      background: "#ffffff",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid var(--border-light)",
                    }}
                  >
                    <span
                      style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                    >
                      Atur Manual:
                    </span>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      max="12"
                      className="form-control"
                      style={{
                        width: "80px",
                        padding: "4px 8px",
                        fontSize: "0.85rem",
                      }}
                      value={durationHoursMin}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 1;
                        setDurationHoursMin(val);
                        updateDurationFromHours(
                          val,
                          durationHoursMax,
                          durationIsFlexible,
                        );
                      }}
                    />
                    <span
                      style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                    >
                      s/d
                    </span>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      max="12"
                      className="form-control"
                      style={{
                        width: "80px",
                        padding: "4px 8px",
                        fontSize: "0.85rem",
                      }}
                      value={durationHoursMax}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 1;
                        setDurationHoursMax(val);
                        updateDurationFromHours(
                          durationHoursMin,
                          val,
                          durationIsFlexible,
                        );
                      }}
                    />
                    <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                      Jam
                    </span>

                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginLeft: "auto",
                        fontSize: "0.78rem",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={durationIsFlexible}
                        onChange={(e) => {
                          setDurationIsFlexible(e.target.checked);
                          updateDurationFromHours(
                            durationHoursMin,
                            durationHoursMax,
                            e.target.checked,
                          );
                        }}
                      />
                      <span>+ Opsi Fleksibel</span>
                    </label>
                  </div>
                </div>

                {/* 2. Jadwal Keberangkatan (Time Picker) Section */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <label
                      className="form-label"
                      style={{
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontWeight: 700,
                      }}
                    >
                      <Calendar size={15} color="var(--primary-ocean)" />
                      <span>Jadwal Jam Keberangkatan *</span>
                    </label>
                    {formData.scheduleId && (
                      <span
                        style={{
                          fontSize: "0.78rem",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background: "#fef3c7",
                          color: "#b45309",
                          fontWeight: 700,
                        }}
                      >
                        {formData.scheduleId}
                      </span>
                    )}
                  </div>

                  {/* Preset Schedule Chips */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                      marginBottom: "10px",
                    }}
                  >
                    {[
                      {
                        label: "Pagi: 09:00 WITA",
                        t1: "09:00",
                        t2: "",
                        has2: false,
                        flex: false,
                      },
                      {
                        label: "Pagi: 09:30 WITA",
                        t1: "09:30",
                        t2: "",
                        has2: false,
                        flex: false,
                      },
                      {
                        label: "Siang: 13:30 WITA",
                        t1: "13:30",
                        t2: "",
                        has2: false,
                        flex: false,
                      },
                      {
                        label: "Sunset: 15:30 WITA",
                        t1: "15:30",
                        t2: "",
                        has2: false,
                        flex: false,
                      },
                      {
                        label: "2 Sesi: 09:30 & 13:30 WITA",
                        t1: "09:30",
                        t2: "13:30",
                        has2: true,
                        flex: false,
                      },
                      {
                        label: "Bebas / Fleksibel (Private)",
                        t1: "",
                        t2: "",
                        has2: false,
                        flex: true,
                      },
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setTimePicker1(preset.t1 || "09:30");
                          setTimePicker2(preset.t2 || "13:30");
                          setHasSecondSlot(preset.has2);
                          setIsScheduleFlexible(preset.flex);
                          updateScheduleFromTimes(
                            preset.t1,
                            preset.t2,
                            preset.has2,
                            preset.flex,
                          );
                        }}
                        style={{
                          padding: "5px 10px",
                          borderRadius: "6px",
                          border: formData.scheduleId.includes(
                            preset.t1 || "Fleksibel",
                          )
                            ? "1.5px solid #d97706"
                            : "1px solid var(--border-light)",
                          background: formData.scheduleId.includes(
                            preset.t1 || "Fleksibel",
                          )
                            ? "#fffbeb"
                            : "#ffffff",
                          color: formData.scheduleId.includes(
                            preset.t1 || "Fleksibel",
                          )
                            ? "#b45309"
                            : "var(--text-main)",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Time Inputs Picker */}
                  {!isScheduleFlexible ? (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: "12px",
                        background: "#ffffff",
                        padding: "10px 12px",
                        borderRadius: "6px",
                        border: "1px solid var(--border-light)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                          Jam Sesi 1:
                        </span>
                        <input
                          type="time"
                          className="form-control"
                          style={{
                            width: "125px",
                            padding: "4px 8px",
                            fontSize: "0.85rem",
                          }}
                          value={timePicker1}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTimePicker1(val);
                            updateScheduleFromTimes(
                              val,
                              timePicker2,
                              hasSecondSlot,
                              false,
                            );
                          }}
                        />
                      </div>

                      {hasSecondSlot && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                            Jam Sesi 2:
                          </span>
                          <input
                            type="time"
                            className="form-control"
                            style={{
                              width: "125px",
                              padding: "4px 8px",
                              fontSize: "0.85rem",
                            }}
                            value={timePicker2}
                            onChange={(e) => {
                              const val = e.target.value;
                              setTimePicker2(val);
                              updateScheduleFromTimes(
                                timePicker1,
                                val,
                                true,
                                false,
                              );
                            }}
                          />
                        </div>
                      )}

                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                          fontWeight: 600,
                        }}
                      >
                        (WITA / GMT+8)
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          const next = !hasSecondSlot;
                          setHasSecondSlot(next);
                          updateScheduleFromTimes(
                            timePicker1,
                            timePicker2,
                            next,
                            false,
                          );
                        }}
                        style={{
                          marginLeft: "auto",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          border: "1px solid var(--border-light)",
                          background: hasSecondSlot
                            ? "#fee2e2"
                            : "var(--primary-surface)",
                          color: hasSecondSlot
                            ? "#b91c1c"
                            : "var(--primary-ocean)",
                          fontSize: "0.76rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {hasSecondSlot ? "- Hapus Sesi 2" : "+ Tambah Sesi 2"}
                      </button>
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: "8px 12px",
                        background: "#fffbeb",
                        borderRadius: "6px",
                        fontSize: "0.8rem",
                        color: "#b45309",
                        fontWeight: 600,
                      }}
                    >
                      Waktu Keberangkatan Bebas & Fleksibel (Private Boat
                      On-Demand)
                    </div>
                  )}
                </div>
              </div>

              {/* Spot List Chips Management */}
              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label className="form-label">Spot Snorkeling Destinasi</label>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "8px",
                  }}
                >
                  {formData.spots.map((spot, idx) => (
                    <span
                      key={idx}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "5px 10px",
                        borderRadius: "var(--radius-full)",
                        background: "var(--primary-surface)",
                        color: "var(--primary-ocean)",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        border: "1px solid rgba(0, 180, 216, 0.3)",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <MapPin size={12} />
                        <span>{spot}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpot(idx)}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: "#ef4444",
                          display: "flex",
                        }}
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tambah spot baru (contoh: Coral Garden Gili Air)..."
                    value={newSpotInput}
                    onChange={(e) => setNewSpotInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSpot(newSpotInput);
                      }
                    }}
                    style={{ fontSize: "0.85rem" }}
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
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                    marginTop: "8px",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}
                  >
                    Saran Cepat:
                  </span>
                  {spotSuggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleAddSpot(s)}
                      style={{
                        padding: "2px 8px",
                        borderRadius: "6px",
                        border: "1px solid var(--border-light)",
                        background: "#f8fafc",
                        fontSize: "0.72rem",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                      }}
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Includes Chips Management */}
              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label className="form-label">
                  Fasilitas Termasuk (Inclusions)
                </label>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "8px",
                  }}
                >
                  {formData.includes.map((inc, idx) => (
                    <span
                      key={idx}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "5px 10px",
                        borderRadius: "var(--radius-full)",
                        background: "#f0fdf4",
                        color: "#15803d",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        border: "1px solid rgba(21, 128, 61, 0.3)",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Check size={12} />
                        <span>{inc}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInclude(idx)}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: "#ef4444",
                          display: "flex",
                        }}
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tambah fasilitas (contoh: Pakan Ikan)..."
                    value={newIncludeInput}
                    onChange={(e) => setNewIncludeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddInclude(newIncludeInput);
                      }
                    }}
                    style={{ fontSize: "0.85rem" }}
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
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                    marginTop: "8px",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}
                  >
                    Saran Cepat:
                  </span>
                  {includeSuggestions.map((inc) => (
                    <button
                      key={inc}
                      type="button"
                      onClick={() => handleAddInclude(inc)}
                      style={{
                        padding: "2px 8px",
                        borderRadius: "6px",
                        border: "1px solid var(--border-light)",
                        background: "#f8fafc",
                        fontSize: "0.72rem",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                      }}
                    >
                      + {inc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description ID & EN */}
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
                    Deskripsi Singkat (Bahasa Indonesia) *
                  </label>
                  <textarea
                    className="form-control"
                    placeholder="Contoh: Paket hemat snorkeling sharing 3 Gili mengunjungi patung bawah air..."
                    value={formData.descriptionId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        descriptionId: e.target.value,
                      })
                    }
                    rows={2}
                    required
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">
                    Deskripsi Singkat (English) *
                  </label>
                  <textarea
                    className="form-control"
                    placeholder="e.g. Budget-friendly public sharing boat trip visiting underwater statues..."
                    value={formData.descriptionEn}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        descriptionEn: e.target.value,
                      })
                    }
                    rows={2}
                    required
                  />
                </div>
              </div>

              {/* Image Upload with live preview & drag-drop */}
              <ImageUpload
                label="Foto / Thumbnail Paket Snorkeling"
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                required
                helperText="Upload foto pemandangan trip atau perahu (JPG, PNG, WebP maks 10MB)"
              />

              {/* Checkboxes for featured & active */}
              <div style={{ display: "flex", gap: "24px", margin: "20px 0" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    fontSize: "0.88rem",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData({ ...formData, isFeatured: e.target.checked })
                    }
                  />
                  <span>Tampilkan sebagai Paket Populer (Featured)</span>
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    fontSize: "0.88rem",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                  />
                  <span>Status Aktif (Tampil di website publik)</span>
                </label>
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
                  <span>
                    {isSaving
                      ? "Menyimpan..."
                      : editingId
                        ? "Simpan Perubahan"
                        : "Tambahkan Paket"}
                  </span>
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
