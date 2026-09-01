"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  MessageCircle,
  Trash2,
  RefreshCw,
  Loader2,
  Plus,
  Eye,
  Calendar as CalendarIcon,
  FileSpreadsheet,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import BookingDetailModal from "@/components/admin/BookingDetailModal";
import ManualBookingModal from "@/components/admin/ManualBookingModal";
import ManifestModal from "@/components/admin/ManifestModal";
import { DataTable } from "@/components/admin/DataTable";
import { DataTableColumnHeader } from "@/components/admin/DataTableColumnHeader";
import { ColumnDef } from "@tanstack/react-table";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sessionFilter, setSessionFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all"); // all, today, tomorrow, this_week

  // Modal States
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isManifestModalOpen, setIsManifestModalOpen] = useState(false);

  // Delete Confirm Modal State
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      } else {
        toast.error("Gagal mengambil data reservasi");
      }
    } catch (e) {
      console.error(e);
      toast.error("Terjadi kesalahan jaringan saat memuat booking");
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/packages");
      if (res.ok) {
        const data = await res.json();
        setPackages(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchPackages();
  }, []);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    const toastId = toast.loading(`Mengubah status ke ${newStatus}...`);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Gagal memperbarui status di server");

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)),
      );

      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking((prev: any) => ({ ...prev, status: newStatus }));
      }

      toast.success(`Status berhasil diubah menjadi ${newStatus}!`, {
        id: toastId,
      });
    } catch (e: any) {
      toast.error(e.message || "Gagal mengubah status", { id: toastId });
    }
  };

  const handleUpdateNotes = async (
    id: number,
    specialRequests: string,
    pickupLocation: string,
  ) => {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ specialRequests, pickupLocation }),
    });
    if (!res.ok) throw new Error("Gagal memperbarui catatan");

    setBookings((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, specialRequests, pickupLocation } : b,
      ),
    );

    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking((prev: any) => ({
        ...prev,
        specialRequests,
        pickupLocation,
      }));
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const toastId = toast.loading("Menghapus data reservasi...");
    try {
      const res = await fetch(`/api/bookings/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus reservasi");

      setBookings((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      toast.success(`Reservasi ${deleteTarget.bookingCode} berhasil dihapus!`, {
        id: toastId,
      });
      setDeleteTarget(null);
    } catch (e: any) {
      toast.error(e.message || "Gagal menghapus reservasi", { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  const openDetail = (b: any) => {
    setSelectedBooking(b);
    setIsDetailModalOpen(true);
  };

  // Helper date calculations
  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Search
      const s = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        b.customerName?.toLowerCase().includes(s) ||
        b.bookingCode?.toLowerCase().includes(s) ||
        b.customerPhone?.includes(searchTerm) ||
        b.customerEmail?.toLowerCase().includes(s) ||
        b.packageName?.toLowerCase().includes(s);

      // Status
      const matchesStatus = statusFilter === "all" || b.status === statusFilter;

      // Session
      const matchesSession =
        sessionFilter === "all" || b.tripSession === sessionFilter;

      // Date Filter
      let matchesDate = true;
      if (dateFilter === "today") {
        matchesDate = b.tripDate === todayStr;
      } else if (dateFilter === "tomorrow") {
        matchesDate = b.tripDate === tomorrowStr;
      } else if (dateFilter === "this_week") {
        const tripD = new Date(b.tripDate);
        const now = new Date();
        const diffDays = (tripD.getTime() - now.getTime()) / (1000 * 3600 * 24);
        matchesDate = diffDays >= -1 && diffDays <= 7;
      }

      return matchesSearch && matchesStatus && matchesSession && matchesDate;
    });
  }, [
    bookings,
    searchTerm,
    statusFilter,
    sessionFilter,
    dateFilter,
    todayStr,
    tomorrowStr,
  ]);

  const columnLabels: Record<string, string> = {
    bookingCode: "Kode Booking",
    customerName: "Nama Pelanggan",
    packageName: "Paket Trip",
    tripDate: "Tgl & Sesi",
    numberOfPeople: "Peserta",
    totalPriceIdr: "Total Biaya",
    status: "Status",
  };

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorKey: "bookingCode",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Kode" />
        ),
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => openDetail(row.original)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--primary-ocean)",
              fontSize: "0.88rem",
              fontWeight: 700,
              cursor: "pointer",
              textAlign: "left",
              padding: 0,
              textDecoration: "underline",
            }}
          >
            {row.getValue("bookingCode")}
          </button>
        ),
      },
      {
        accessorKey: "customerName",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Nama Pelanggan" />
        ),
        cell: ({ row }) => (
          <div>
            <div style={{ fontWeight: 600, color: "var(--primary-deep)" }}>
              {row.getValue("customerName")}
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              {row.original.customerPhone}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "packageName",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Paket Trip" />
        ),
        cell: ({ row }) => (
          <span style={{ fontSize: "0.85rem", color: "var(--text-main)", maxWidth: "180px", display: "inline-block" }}>
            {row.getValue("packageName")}
          </span>
        ),
      },
      {
        accessorKey: "tripDate",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Tgl & Sesi" />
        ),
        cell: ({ row }) => {
          const b = row.original;
          return (
            <div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  color: b.tripDate === todayStr ? "var(--primary-ocean)" : "var(--text-main)",
                }}
              >
                {b.tripDate}{" "}
                {b.tripDate === todayStr && (
                  <span style={{ fontSize: "0.7rem", color: "#15803d", fontWeight: 700 }}>
                    (Hari ini)
                  </span>
                )}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "capitalize" }}>
                {b.tripSession === "morning"
                  ? "Pagi (09:30)"
                  : b.tripSession === "afternoon"
                    ? "Siang (13:00)"
                    : b.tripSession === "sunset"
                      ? "Sunset (16:00)"
                      : b.tripSession}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "numberOfPeople",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Peserta" />
        ),
        cell: ({ row }) => (
          <span>
            <strong style={{ color: "var(--primary-deep)" }}>
              {row.getValue("numberOfPeople")}
            </strong>{" "}
            Org
          </span>
        ),
      },
      {
        accessorKey: "totalPriceIdr",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Total Biaya" />
        ),
        cell: ({ row }) => (
          <strong style={{ color: "var(--primary-ocean)", fontSize: "0.88rem" }}>
            Rp {(row.getValue("totalPriceIdr") as number)?.toLocaleString("id-ID")}
          </strong>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          const b = row.original;
          return (
            <select
              value={b.status}
              onChange={(e) => handleUpdateStatus(b.id, e.target.value)}
              style={{
                padding: "4px 8px",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.78rem",
                fontWeight: 700,
                border: "1px solid var(--border-light)",
                background:
                  b.status === "confirmed"
                    ? "#d1fae5"
                    : b.status === "pending"
                      ? "#fef3c7"
                      : b.status === "completed"
                        ? "#e0f2fe"
                        : "#fee2e2",
                color:
                  b.status === "confirmed"
                    ? "#065f46"
                    : b.status === "pending"
                      ? "#b45309"
                      : b.status === "completed"
                        ? "#0369a1"
                        : "#b91c1c",
                cursor: "pointer",
              }}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          );
        },
      },
      {
        id: "actions",
        enableHiding: false,
        header: () => <div style={{ textAlign: "center" }}>Aksi</div>,
        cell: ({ row }) => {
          const b = row.original;
          return (
            <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
              <button
                type="button"
                onClick={() => openDetail(b)}
                style={{
                  padding: "6px 10px",
                  borderRadius: "6px",
                  background: "var(--primary-surface)",
                  color: "var(--primary-ocean)",
                  border: "none",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                }}
                title="Lihat Detail & WhatsApp"
              >
                <Eye size={14} />
                <span>Detail</span>
              </button>

              <a
                href={`https://wa.me/${(b.customerPhone || "").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  `Halo ${b.customerName}! Kami dari Trip Snorkeling Gili mengonfirmasi pesanan Anda (${b.bookingCode}) pada ${b.tripDate}.`,
                )}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "6px",
                  borderRadius: "6px",
                  background: "rgba(37, 211, 102, 0.15)",
                  color: "#15803d",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Kirim Pesan WhatsApp"
              >
                <MessageCircle size={15} />
              </a>

              <button
                type="button"
                onClick={() => setDeleteTarget(b)}
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
                title="Hapus Reservasi"
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        },
      },
    ],
    [todayStr]
  );

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredBookings.length === 0) {
      toast.info("Tidak ada data reservasi untuk diekspor");
      return;
    }

    const headers = [
      "Kode Booking",
      "Nama Tamu",
      "Telepon / WhatsApp",
      "Email",
      "Paket Snorkeling",
      "Tanggal Trip",
      "Sesi",
      "Jumlah Peserta",
      "Total Harga (IDR)",
      "Status",
      "Lokasi Pickup",
      "Catatan Khusus",
      "Tanggal Dibuat",
    ];

    const rows = filteredBookings.map((b) => [
      `"${b.bookingCode || ""}"`,
      `"${(b.customerName || "").replace(/"/g, '""')}"`,
      `"${b.customerPhone || ""}"`,
      `"${b.customerEmail || ""}"`,
      `"${(b.packageName || "").replace(/"/g, '""')}"`,
      `"${b.tripDate || ""}"`,
      `"${b.tripSession || ""}"`,
      b.numberOfPeople || 1,
      b.totalPriceIdr || 0,
      `"${b.status || ""}"`,
      `"${(b.pickupLocation || "").replace(/"/g, '""')}"`,
      `"${(b.specialRequests || "").replace(/"/g, '""')}"`,
      `"${b.createdAt || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `manifest-snorkeling-${dateFilter}-${todayStr}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(
      `Manifest ${filteredBookings.length} penumpang berhasil diekspor!`,
    );
  };

  // Stats calculation
  const totalCount = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const confirmedCount = bookings.filter(
    (b) => b.status === "confirmed",
  ).length;
  const todayPassengers = bookings
    .filter((b) => b.tripDate === todayStr && b.status !== "cancelled")
    .reduce((acc, b) => acc + (b.numberOfPeople || 0), 0);

  return (
    <div>
      {/* Top Header */}
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
            Manajemen Reservasi & Manifest Tamu
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Kelola data pemesanan, konfirmasi WhatsApp, input walk-in dermaga,
            dan ekspor manifest.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={fetchBookings}
            className="btn btn-secondary btn-sm"
            title="Muat ulang data"
          >
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="btn btn-secondary btn-sm"
            style={{
              borderColor: "var(--primary-turquoise)",
              color: "var(--primary-ocean)",
            }}
          >
            <FileSpreadsheet size={15} />
            <span>Ekspor Manifest CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsManifestModalOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{
              borderColor: "var(--primary-ocean)",
              color: "var(--primary-ocean)",
              background: "rgba(2, 132, 199, 0.08)",
            }}
          >
            <Printer size={15} />
            <span>Cetak / Ekspor PDF Manifest</span>
          </button>

          <button
            type="button"
            onClick={() => setIsManualModalOpen(true)}
            className="btn btn-primary btn-sm"
          >
            <Plus size={16} />
            <span>Tambah Booking Manual</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div
          className="glass-card"
          style={{ padding: "16px 20px", background: "#ffffff" }}
        >
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "var(--text-muted)",
              textTransform: "uppercase",
            }}
          >
            Total Reservasi
          </span>
          <div
            style={{
              fontSize: "1.6rem",
              fontWeight: 800,
              color: "var(--primary-deep)",
              marginTop: "4px",
            }}
          >
            {totalCount}
          </div>
        </div>

        <div
          className="glass-card"
          style={{ padding: "16px 20px", background: "#ffffff" }}
        >
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "var(--text-muted)",
              textTransform: "uppercase",
            }}
          >
            Perlu Konfirmasi (Pending)
          </span>
          <div
            style={{
              fontSize: "1.6rem",
              fontWeight: 800,
              color: "#d97706",
              marginTop: "4px",
            }}
          >
            {pendingCount}
          </div>
        </div>

        <div
          className="glass-card"
          style={{ padding: "16px 20px", background: "#ffffff" }}
        >
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "var(--text-muted)",
              textTransform: "uppercase",
            }}
          >
            Terkonfirmasi (Confirmed)
          </span>
          <div
            style={{
              fontSize: "1.6rem",
              fontWeight: 800,
              color: "var(--accent-green)",
              marginTop: "4px",
            }}
          >
            {confirmedCount}
          </div>
        </div>

        <div
          className="glass-card"
          style={{ padding: "16px 20px", background: "#ffffff" }}
        >
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "var(--text-muted)",
              textTransform: "uppercase",
            }}
          >
            Penumpang Hari Ini
          </span>
          <div
            style={{
              fontSize: "1.6rem",
              fontWeight: 800,
              color: "var(--primary-ocean)",
              marginTop: "4px",
            }}
          >
            {todayPassengers}{" "}
            <span
              style={{
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "var(--text-muted)",
              }}
            >
              Org
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div
        className="glass-card"
        style={{
          padding: "16px 20px",
          background: "#ffffff",
          marginBottom: "20px",
          display: "flex",
          gap: "14px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {/* Search input */}
        <div style={{ flex: 1, minWidth: "220px", position: "relative" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Cari nama, kode booking, telepon, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "14px", fontSize: "0.88rem" }}
          />
        </div>

        {/* Date Preset Filter */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <label
            style={{
              fontSize: "0.82rem",
              color: "var(--text-muted)",
              fontWeight: 600,
            }}
          >
            Tgl:
          </label>
          <select
            className="form-control"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              padding: "8px 28px 8px 12px",
              fontSize: "0.85rem",
              width: "auto",
            }}
          >
            <option value="all">Semua Tanggal</option>
            <option value="today">Hari Ini</option>
            <option value="tomorrow">Besok</option>
            <option value="this_week">7 Hari ke Depan</option>
          </select>
        </div>

        {/* Session Filter */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <label
            style={{
              fontSize: "0.82rem",
              color: "var(--text-muted)",
              fontWeight: 600,
            }}
          >
            Sesi:
          </label>
          <select
            className="form-control"
            value={sessionFilter}
            onChange={(e) => setSessionFilter(e.target.value)}
            style={{
              padding: "8px 28px 8px 12px",
              fontSize: "0.85rem",
              width: "auto",
            }}
          >
            <option value="all">Semua Sesi</option>
            <option value="morning">Pagi (09:30)</option>
            <option value="afternoon">Siang (13:00)</option>
            <option value="sunset">Sunset (16:00)</option>
          </select>
        </div>

        {/* Status Pills */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {["all", "pending", "confirmed", "completed", "cancelled"].map(
            (st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: "7px 12px",
                  borderRadius: "var(--radius-sm)",
                  border:
                    statusFilter === st
                      ? "1px solid var(--primary-ocean)"
                      : "1px solid var(--border-light)",
                  background:
                    statusFilter === st ? "var(--primary-ocean)" : "#ffffff",
                  color: statusFilter === st ? "#ffffff" : "var(--text-main)",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {st === "all" ? "Semua" : st}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Main Bookings DataTable */}
      <DataTable
        columns={columns}
        data={filteredBookings}
        loading={loading}
        enableSearch={false}
        columnLabels={columnLabels}
        emptyMessage="Tidak ada data reservasi yang sesuai dengan filter."
        initialPageSize={10}
      />

      {/* Booking Detail Modal */}
      {isDetailModalOpen && (
        <BookingDetailModal
          booking={selectedBooking}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onStatusChange={handleUpdateStatus}
          onUpdateNotes={handleUpdateNotes}
        />
      )}

      {/* Manual Booking Modal */}
      {isManualModalOpen && (
        <ManualBookingModal
          isOpen={isManualModalOpen}
          onClose={() => setIsManualModalOpen(false)}
          onSuccess={fetchBookings}
          packages={packages}
        />
      )}

      {/* Manifest Print & Export Modal */}
      {isManifestModalOpen && (
        <ManifestModal
          isOpen={isManifestModalOpen}
          onClose={() => setIsManifestModalOpen(false)}
          bookings={bookings}
          currentDateFilter={dateFilter}
          currentSessionFilter={sessionFilter}
        />
      )}

      {/* Delete Confirmation Modal (Replacing window.confirm) */}
      <AdminConfirmModal
        isOpen={!!deleteTarget}
        title="Hapus Data Reservasi"
        description={`Apakah Anda yakin ingin menghapus data reservasi ${deleteTarget?.bookingCode} atas nama "${deleteTarget?.customerName}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Reservasi"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
