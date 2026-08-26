'use client';

import React, { useState, useEffect } from 'react';
import { X, UserPlus, Calendar, Users, DollarSign, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface PackageOption {
  id: number;
  nameId: string;
  price: number;
  priceUsd: number;
}

interface ManualBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  packages: PackageOption[];
}

export default function ManualBookingModal({
  isOpen,
  onClose,
  onSuccess,
  packages,
}: ManualBookingModalProps) {
  // Format today's date YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState<number>(packages[0]?.id || 1);
  const [numberOfPeople, setNumberOfPeople] = useState<number>(2);
  const [tripDate, setTripDate] = useState<string>(todayStr);
  const [tripSession, setTripSession] = useState<string>('morning');
  const [pickupLocation, setPickupLocation] = useState<string>('Dermaga Utama Gili Trawangan (Counter)');
  const [specialRequests, setSpecialRequests] = useState<string>('Booking Walk-in langsung di lokasi');
  const [status, setStatus] = useState<string>('confirmed');
  const [customPrice, setCustomPrice] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const selectedPkg = packages.find((p) => p.id === selectedPackageId) || packages[0];
  const defaultTotal = selectedPkg ? selectedPkg.price * numberOfPeople : 300000;
  const finalTotalPrice = customPrice !== null ? customPrice : defaultTotal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !tripDate) {
      toast.error('Nama pelanggan, nomor telepon, dan tanggal wajib diisi!');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Menyimpan data reservasi manual...');

    try {
      const payload = {
        packageId: selectedPkg?.id || null,
        packageName: selectedPkg?.nameId || 'Paket Snorkeling Gili',
        customerName,
        customerPhone,
        customerEmail: customerEmail || 'walkin@snorkelinggilitrawangan.com',
        numberOfPeople,
        tripDate,
        tripSession,
        pickupLocation,
        specialRequests,
        totalPriceIdr: finalTotalPrice,
        totalPriceUsd: selectedPkg ? selectedPkg.priceUsd * numberOfPeople : 20,
        status,
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menyimpan booking');
      }

      toast.success('Reservasi walk-in berhasil ditambahkan!', { id: toastId });
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan saat menyimpan booking', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(10, 25, 47, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          padding: '28px',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'var(--primary-surface)',
                color: 'var(--primary-ocean)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UserPlus size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-deep)', margin: 0 }}>
                Tambah Booking Manual / Walk-in
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Catat pemesanan langsung tamu dermaga atau via telepon/WA manual
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Customer Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>Nama Pelanggan *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Contoh: Budi Santoso / John Doe"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>Nomor WhatsApp / HP *</label>
              <input
                type="text"
                className="form-control"
                placeholder="081234567890 / +62..."
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label" style={{ fontSize: '0.85rem' }}>Email (Opsional)</label>
            <input
              type="email"
              className="form-control"
              placeholder="budi@example.com (opsional)"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
          </div>

          {/* Package and People */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr', gap: '16px', marginBottom: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>Pilihan Paket Snorkeling *</label>
              <select
                className="form-control"
                value={selectedPackageId}
                onChange={(e) => {
                  setSelectedPackageId(Number(e.target.value));
                  setCustomPrice(null);
                }}
              >
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.nameId} (Rp {pkg.price.toLocaleString('id-ID')}/org)
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>Jumlah Orang *</label>
              <input
                type="number"
                min={1}
                max={50}
                className="form-control"
                value={numberOfPeople}
                onChange={(e) => {
                  const val = Math.max(1, parseInt(e.target.value) || 1);
                  setNumberOfPeople(val);
                  setCustomPrice(null);
                }}
                required
              />
            </div>
          </div>

          {/* Date and Session */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>Tanggal Keberangkatan *</label>
              <input
                type="date"
                className="form-control"
                value={tripDate}
                onChange={(e) => setTripDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>Sesi Trip *</label>
              <select
                className="form-control"
                value={tripSession}
                onChange={(e) => setTripSession(e.target.value)}
              >
                <option value="morning">Sesi Pagi (09:30 WITA)</option>
                <option value="afternoon">Sesi Siang (13:00 WITA)</option>
                <option value="sunset">Sesi Sunset (16:00 WITA)</option>
              </select>
            </div>
          </div>

          {/* Pricing & Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>Total Tagihan IDR (Rp)</label>
              <input
                type="number"
                className="form-control"
                value={finalTotalPrice}
                onChange={(e) => setCustomPrice(parseInt(e.target.value) || 0)}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Default: {numberOfPeople} org x Rp {selectedPkg?.price.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>Status Awal</label>
              <select
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="confirmed">Confirmed (Lunas / DP)</option>
                <option value="pending">Pending (Belum Bayar)</option>
                <option value="completed">Completed (Selesai Trip)</option>
              </select>
            </div>
          </div>

          {/* Pickup & Notes */}
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label" style={{ fontSize: '0.85rem' }}>Titik Kumpul / Lokasi Pickup</label>
            <input
              type="text"
              className="form-control"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '22px' }}>
            <label className="form-label" style={{ fontSize: '0.85rem' }}>Catatan Khusus</label>
            <textarea
              className="form-control"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={2}
              style={{ minHeight: '60px' }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="btn btn-secondary btn-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-sm"
              style={{ opacity: isSubmitting ? 0.8 : 1 }}
            >
              {isSubmitting && <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />}
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Reservasi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
