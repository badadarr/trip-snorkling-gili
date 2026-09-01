"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  MessageCircle,
  Calendar,
  User,
  MapPin,
  Copy,
  Check,
  Send,
  Edit2,
  Loader2,
  RotateCcw,
  CreditCard,
  QrCode,
  Building2,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";

interface BookingItem {
  id: number;
  bookingCode: string;
  packageId?: number;
  packageName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  numberOfPeople: number;
  tripDate: string;
  tripSession: string;
  pickupLocation?: string;
  specialRequests?: string;
  totalPriceIdr: number;
  totalPriceUsd?: number;
  paymentMethod?: string;
  paymentProofUrl?: string;
  status: string;
  createdAt?: string;
}

interface BookingDetailModalProps {
  booking: BookingItem | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: number, newStatus: string) => Promise<void>;
  onUpdateNotes?: (
    id: number,
    specialRequests: string,
    pickupLocation: string,
  ) => Promise<void>;
}

export default function BookingDetailModal({
  booking,
  isOpen,
  onClose,
  onStatusChange,
  onUpdateNotes,
}: BookingDetailModalProps) {
  const [activeTemplate, setActiveTemplate] = useState<
    "confirm" | "reminder" | "meeting" | "cancel"
  >("confirm");
  const [customMessage, setCustomMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [pickupLoc, setPickupLoc] = useState("");
  const [notes, setNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Sync state when booking changes
  useEffect(() => {
    if (booking) {
      setPickupLoc(booking.pickupLocation || "");
      setNotes(booking.specialRequests || "");
    }
  }, [booking]);

  // Clean phone number for wa.me link (replace non-digits, replace leading 0 with 62)
  const cleanPhone = (phone: string) => {
    let p = phone.replace(/[^0-9]/g, "");
    if (p.startsWith("0")) {
      p = "62" + p.substring(1);
    }
    return p;
  };

  const phoneForWa = cleanPhone(booking?.customerPhone || "");

  // Templates Generator
  const generateTemplateText = (
    tpl: "confirm" | "reminder" | "meeting" | "cancel",
  ) => {
    if (!booking) return "";

    const sessionName =
      booking.tripSession === "morning"
        ? "Sesi Pagi (09:30 WITA)"
        : booking.tripSession === "afternoon"
          ? "Sesi Siang (13:00 WITA)"
          : booking.tripSession === "sunset"
            ? "Sesi Sunset (16:00 WITA)"
            : booking.tripSession;

    switch (tpl) {
      case "confirm":
        return `Halo Kak *${booking.customerName}*! 👋\n\nTerima kasih telah memesan trip snorkeling bersama kami di *Trip Snorkeling Gili Trawangan*.\n\nBerikut rincian reservasi Anda:\n📋 *Kode Booking:* ${booking.bookingCode}\n🚤 *Paket Trip:* ${booking.packageName}\n📅 *Tanggal:* ${booking.tripDate}\n⏰ *Sesi:* ${sessionName}\n👥 *Jumlah Peserta:* ${booking.numberOfPeople} Orang\n💰 *Total Biaya:* Rp ${booking.totalPriceIdr?.toLocaleString("id-ID")}\n\n📍 *Titik Kumpul:* Dermaga Utama Snorkeling Gili Trawangan\nMohon hadir 15-20 menit sebelum jadwal keberangkatan untuk persiapan alat & briefing keselamatan.\n\nApakah jadwal di atas sudah sesuai, Kak?`;

      case "reminder":
        return `Halo Kak *${booking.customerName}*! 🌊\n\nPengingat ramah untuk trip snorkeling Anda besok:\n📋 *Kode:* ${booking.bookingCode}\n📅 *Tanggal:* ${booking.tripDate}\n⏰ *Waktu:* ${sessionName}\n🚤 *Paket:* ${booking.packageName}\n\n🎒 *Yang perlu dibawa:* Pakaian renang, handuk, kacamata hitam, sunscreen ramah terumbu karang.\nMasker snorkeling, life jacket, pemandu, dan dokumentasi GoPro sudah kami siapkan!\n\nSampai jumpa di lokasi besok pagi/siang, Kak!`;

      case "meeting":
        return `Halo Kak *${booking.customerName}*! 📍\n\nBerikut panduan titik kumpul (Meeting Point) untuk trip snorkeling kode *${booking.bookingCode}*:\n\n📌 *Lokasi:* Counter Trip Snorkeling Gili (Dekat Dermaga Utama Gili Trawangan)\n🗺️ *Google Maps:* https://maps.google.com/?q=Gili+Trawangan+Harbour\n⏰ *Waktu Berkumpul:* 15-20 menit sebelum jadwal (${sessionName})\n\nJika ada kendala menemukan lokasi, kakak bisa langsung hubungi kami di nomor ini ya.`;

      case "cancel":
        return `Halo Kak *${booking.customerName}*,\n\nKami menginformasikan bahwa reservasi snorkeling dengan kode *${booking.bookingCode}* untuk tanggal *${booking.tripDate}* telah dibatalkan.\n\nJika ada pertanyaan lebih lanjut atau ingin menjadwalkan ulang trip di lain waktu, jangan ragu untuk menghubungi kami kembali.\n\nTerima kasih!`;

      default:
        return "";
    }
  };

  // Initialize or update message when template or booking changes
  useEffect(() => {
    if (booking) {
      setCustomMessage(generateTemplateText(activeTemplate));
    }
  }, [activeTemplate, booking]);

  const handleSelectTemplate = (
    tpl: "confirm" | "reminder" | "meeting" | "cancel",
  ) => {
    setActiveTemplate(tpl);
    setCustomMessage(generateTemplateText(tpl));
  };

  const handleResetTemplate = () => {
    setCustomMessage(generateTemplateText(activeTemplate));
    toast.info("Pesan dikembalikan ke template awal.");
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(customMessage);
    setCopied(true);
    toast.success("Pesan WhatsApp disalin ke clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const url = `https://wa.me/${phoneForWa}?text=${encodeURIComponent(customMessage)}`;
    window.open(url, "_blank");
  };

  const handleStatusChangeInternal = async (status: string) => {
    if (!booking) return;
    setIsUpdatingStatus(true);
    try {
      await onStatusChange(booking.id, status);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!booking || !onUpdateNotes) return;
    setIsSavingNotes(true);
    try {
      await onUpdateNotes(booking.id, notes, pickupLoc);
      setIsEditingNotes(false);
      toast.success("Catatan & penjemputan berhasil diperbarui!");
    } catch (e: any) {
      toast.error(e.message || "Gagal menyimpan catatan");
    } finally {
      setIsSavingNotes(false);
    }
  };

  if (!isOpen || !booking) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(10, 25, 47, 0.75)",
        backdropFilter: "blur(6px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "840px",
          maxHeight: "90vh",
          backgroundColor: "#ffffff",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-xl)",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "20px 28px",
            borderBottom: "1px solid var(--border-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#ffffff",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h2
                style={{
                  fontSize: "1.25rem",
                  color: "var(--primary-deep)",
                  margin: 0,
                }}
              >
                Rincian Reservasi:{" "}
                <span style={{ color: "var(--primary-ocean)" }}>
                  {booking.bookingCode}
                </span>
              </h2>
              <span className={`status-badge status-${booking.status}`}>
                {booking.status}
              </span>
            </div>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Dipesan pada{" "}
              {booking.createdAt
                ? new Date(booking.createdAt).toLocaleString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "-"}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "6px",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: "24px 28px",
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: "24px",
          }}
        >
          {/* Left Column: Booking Info */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {/* Status Workflow Action */}
            <div
              style={{
                padding: "16px",
                borderRadius: "var(--radius-md)",
                background: "var(--primary-surface)",
                border: "1px solid rgba(0, 180, 216, 0.2)",
              }}
            >
              <label
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: "var(--primary-deep)",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                STATUS RESERVASI
              </label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {[
                  {
                    key: "pending",
                    label: "Pending",
                    bg: "#fef3c7",
                    text: "#b45309",
                  },
                  {
                    key: "confirmed",
                    label: "Confirmed",
                    bg: "#d1fae5",
                    text: "#065f46",
                  },
                  {
                    key: "completed",
                    label: "Completed",
                    bg: "#e0f2fe",
                    text: "#0369a1",
                  },
                  {
                    key: "cancelled",
                    label: "Cancelled",
                    bg: "#fee2e2",
                    text: "#b91c1c",
                  },
                ].map((st) => (
                  <button
                    key={st.key}
                    type="button"
                    disabled={isUpdatingStatus || booking.status === st.key}
                    onClick={() => handleStatusChangeInternal(st.key)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "var(--radius-sm)",
                      border:
                        booking.status === st.key
                          ? `2px solid ${st.text}`
                          : "1px solid var(--border-light)",
                      backgroundColor:
                        booking.status === st.key ? st.bg : "#ffffff",
                      color: st.text,
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      cursor: booking.status === st.key ? "default" : "pointer",
                      opacity: isUpdatingStatus ? 0.7 : 1,
                      transition: "all 0.15s ease",
                    }}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Details Card */}
            <div
              className="glass-card"
              style={{ padding: "18px", background: "#ffffff" }}
            >
              <h4
                style={{
                  fontSize: "0.92rem",
                  color: "var(--primary-deep)",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <User size={16} color="var(--primary-ocean)" />
                <span>Informasi Tamu</span>
              </h4>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  fontSize: "0.88rem",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "var(--text-muted)" }}>Nama:</span>
                  <strong style={{ color: "var(--primary-deep)" }}>
                    {booking.customerName}
                  </strong>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "var(--text-muted)" }}>
                    WhatsApp / HP:
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <strong>{booking.customerPhone}</strong>
                    <a
                      href={`https://wa.me/${phoneForWa}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#15803d", display: "flex" }}
                      title="Buka Chat WhatsApp"
                    >
                      <MessageCircle size={15} />
                    </a>
                  </div>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "var(--text-muted)" }}>Email:</span>
                  <span>{booking.customerEmail || "-"}</span>
                </div>
              </div>
            </div>

            {/* Trip Details Card */}
            <div
              className="glass-card"
              style={{ padding: "18px", background: "#ffffff" }}
            >
              <h4
                style={{
                  fontSize: "0.92rem",
                  color: "var(--primary-deep)",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Calendar size={16} color="var(--primary-ocean)" />
                <span>Rincian Paket & Waktu Trip</span>
              </h4>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  fontSize: "0.88rem",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "var(--text-muted)" }}>
                    Paket Snorkeling:
                  </span>
                  <strong
                    style={{
                      color: "var(--primary-deep)",
                      textAlign: "right",
                      maxWidth: "60%",
                    }}
                  >
                    {booking.packageName}
                  </strong>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "var(--text-muted)" }}>
                    Tanggal Keberangkatan:
                  </span>
                  <strong style={{ color: "var(--primary-ocean)" }}>
                    {booking.tripDate}
                  </strong>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "var(--text-muted)" }}>Sesi Trip:</span>
                  <span
                    style={{ textTransform: "capitalize", fontWeight: 600 }}
                  >
                    {booking.tripSession === "morning"
                      ? "Pagi (09:30)"
                      : booking.tripSession === "afternoon"
                        ? "Siang (13:00)"
                        : booking.tripSession === "sunset"
                          ? "Sunset (16:00)"
                          : booking.tripSession}
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "var(--text-muted)" }}>
                    Jumlah Peserta:
                  </span>
                  <strong>{booking.numberOfPeople} Orang</strong>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: "10px",
                    borderTop: "1px dashed var(--border-light)",
                    marginTop: "4px",
                  }}
                >
                  <span
                    style={{ fontWeight: 700, color: "var(--primary-deep)" }}
                  >
                    Total Tagihan:
                  </span>
                  <strong
                    style={{
                      fontSize: "1.1rem",
                      color: "var(--primary-ocean)",
                    }}
                  >
                    Rp {booking.totalPriceIdr?.toLocaleString("id-ID")}
                  </strong>
                </div>
              </div>
            </div>

            {/* Payment Method & Proof of Transfer Card */}
            <div
              className="glass-card"
              style={{ padding: "18px", background: "#ffffff" }}
            >
              <h4
                style={{
                  fontSize: "0.92rem",
                  color: "var(--primary-deep)",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <CreditCard size={16} color="var(--primary-ocean)" />
                <span>Metode & Bukti Pembayaran</span>
              </h4>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  fontSize: "0.88rem",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <span style={{ color: "var(--text-muted)" }}>Metode:</span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "3px 10px",
                      borderRadius: "6px",
                      background: booking.paymentMethod === "bank_transfer" ? "#ede9fe" : "#fef3c7",
                      color: booking.paymentMethod === "bank_transfer" ? "#6d28d9" : "#b45309",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                    }}
                  >
                    {booking.paymentMethod === "bank_transfer" ? (
                      <>
                        <Building2 size={13} />
                        <span>Bank Transfer</span>
                      </>
                    ) : (
                      <>
                        <QrCode size={13} />
                        <span>QRIS</span>
                      </>
                    )}
                  </span>
                </div>

                <div>
                  <span style={{ color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
                    Bukti Transfer / Bayar:
                  </span>
                  {booking.paymentProofUrl ? (
                    <div>
                      <a
                        href={booking.paymentProofUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "inline-block",
                          position: "relative",
                          borderRadius: "8px",
                          overflow: "hidden",
                          border: "1px solid var(--border-light)",
                        }}
                      >
                        <img
                          src={booking.paymentProofUrl}
                          alt="Bukti pembayaran"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "180px",
                            objectFit: "contain",
                            display: "block",
                          }}
                        />
                      </a>
                      <a
                        href={booking.paymentProofUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "0.78rem",
                          color: "var(--primary-ocean)",
                          marginTop: "6px",
                          fontWeight: 600,
                        }}
                      >
                        <ExternalLink size={12} />
                        <span>Buka Gambar Ukuran Penuh</span>
                      </a>
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: "10px",
                        borderRadius: "6px",
                        background: "#f8fafc",
                        border: "1px dashed var(--border-light)",
                        color: "var(--text-muted)",
                        fontSize: "0.8rem",
                        fontStyle: "italic",
                        textAlign: "center",
                      }}
                    >
                      Belum ada bukti pembayaran yang diunggah
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Notes & Pickup Location with Edit */}
            <div
              className="glass-card"
              style={{ padding: "18px", background: "#ffffff" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <h4
                  style={{
                    fontSize: "0.92rem",
                    color: "var(--primary-deep)",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <MapPin size={16} color="var(--primary-ocean)" />
                  <span>Lokasi Penjemputan & Catatan</span>
                </h4>
                {!isEditingNotes ? (
                  <button
                    type="button"
                    onClick={() => setIsEditingNotes(true)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--primary-ocean)",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Edit2 size={12} />
                    <span>Edit</span>
                  </button>
                ) : null}
              </div>

              {!isEditingNotes ? (
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-main)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>
                      Titik Kumpul / Pickup:{" "}
                    </span>
                    <span>
                      {booking.pickupLocation || "Dermaga Utama Gili Trawangan"}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>
                      Permintaan Khusus:{" "}
                    </span>
                    <span
                      style={{
                        fontStyle: booking.specialRequests
                          ? "normal"
                          : "italic",
                      }}
                    >
                      {booking.specialRequests || "Tidak ada catatan khusus"}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Lokasi penjemputan..."
                    value={pickupLoc}
                    onChange={(e) => setPickupLoc(e.target.value)}
                    style={{ padding: "8px 12px", fontSize: "0.85rem" }}
                  />
                  <textarea
                    className="form-control"
                    placeholder="Catatan khusus..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    style={{
                      padding: "8px 12px",
                      fontSize: "0.85rem",
                      minHeight: "60px",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "8px",
                    }}
                  >
                    <button
                      type="button"
                      disabled={isSavingNotes}
                      onClick={() => setIsEditingNotes(false)}
                      style={{
                        padding: "5px 12px",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--border-light)",
                        background: "#ffffff",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                      }}
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      disabled={isSavingNotes}
                      onClick={handleSaveNotes}
                      className="btn btn-primary btn-sm"
                      style={{ padding: "5px 14px", fontSize: "0.8rem" }}
                    >
                      {isSavingNotes && (
                        <Loader2
                          size={13}
                          style={{ animation: "spin 1s linear infinite" }}
                        />
                      )}
                      <span>Simpan</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: WhatsApp Message Generator */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#f8fafc",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-light)",
              padding: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "14px",
              }}
            >
              <div
                style={{
                  padding: "6px",
                  borderRadius: "8px",
                  background: "rgba(37, 211, 102, 0.15)",
                  color: "#15803d",
                }}
              >
                <MessageCircle size={18} />
              </div>
              <div>
                <h4
                  style={{
                    fontSize: "0.95rem",
                    color: "var(--primary-deep)",
                    margin: 0,
                  }}
                >
                  Generator Pesan WhatsApp
                </h4>
                <span
                  style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}
                >
                  Pilih template dan kirim langsung ke {booking.customerPhone}
                </span>
              </div>
            </div>

            {/* Template Selector Tabs */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "6px",
                marginBottom: "12px",
              }}
            >
              {[
                { key: "confirm", label: "1. Konfirmasi" },
                { key: "reminder", label: "2. Reminder H-1" },
                { key: "meeting", label: "3. Titik Kumpul" },
                { key: "cancel", label: "4. Pembatalan" },
              ].map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => handleSelectTemplate(t.key as any)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: "var(--radius-sm)",
                    border:
                      activeTemplate === t.key
                        ? "1.5px solid #15803d"
                        : "1px solid var(--border-light)",
                    backgroundColor:
                      activeTemplate === t.key
                        ? "rgba(37, 211, 102, 0.15)"
                        : "#ffffff",
                    color:
                      activeTemplate === t.key ? "#15803d" : "var(--text-main)",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.15s ease",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Editable Message Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "6px",
              }}
            >
              <span
                style={{
                  fontSize: "0.78rem",
                  color: "var(--text-muted)",
                  fontWeight: 600,
                }}
              >
                Draft Pesan (Bisa Diedit):
              </span>
              <button
                type="button"
                onClick={handleResetTemplate}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--primary-ocean)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: 0,
                }}
                title="Kembalikan ke teks template default"
              >
                <RotateCcw size={12} />
                <span>Reset Template</span>
              </button>
            </div>

            {/* Editable Textarea Box */}
            <textarea
              className="form-control"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Ketik atau sesuaikan pesan WhatsApp di sini..."
              style={{
                flexGrow: 1,
                minHeight: "230px",
                fontSize: "0.83rem",
                fontFamily: "monospace",
                lineHeight: 1.5,
                color: "#1e293b",
                padding: "12px",
                borderRadius: "var(--radius-sm)",
                marginBottom: "16px",
                resize: "vertical",
              }}
            />

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={handleCopyText}
                style={{
                  flex: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-light)",
                  backgroundColor: "#ffffff",
                  color: "var(--text-main)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {copied ? (
                  <Check size={16} color="#15803d" />
                ) : (
                  <Copy size={16} />
                )}
                <span>{copied ? "Tersalin" : "Salin Pesan"}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenWhatsApp}
                style={{
                  flex: 1.3,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  backgroundColor: "#25d366",
                  color: "#ffffff",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(37, 211, 102, 0.3)",
                }}
              >
                <Send size={15} />
                <span>Buka di WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
