'use client';

import React, { useState, useEffect } from 'react';
import { X, UserPlus, Calendar, Users, DollarSign, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PackageOption {
  id: number;
  nameId: string;
  price: number;
  priceUsd: number;
  priceUnit?: string | null;
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
  const [pickupLocation, setPickupLocation] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [status, setStatus] = useState<string>('confirmed');
  const [customPrice, setCustomPrice] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  const selectedPkg = packages.find((p) => p.id === selectedPackageId) || packages[0];
  const isPerBoat = selectedPkg ? (selectedPkg.priceUnit === 'per_boat' || (!selectedPkg.priceUnit && selectedPkg.price > 500000)) : false;
  const extraPax = isPerBoat ? Math.max(0, numberOfPeople - 4) : 0;
  const defaultTotal = selectedPkg ? (isPerBoat ? selectedPkg.price + (extraPax * 200000) : selectedPkg.price * numberOfPeople) : 300000;
  const defaultTotalUsd = selectedPkg ? (isPerBoat ? Number((selectedPkg.priceUsd + (extraPax * 13)).toFixed(2)) : Number((selectedPkg.priceUsd * numberOfPeople).toFixed(2))) : 20;
  const finalTotalPrice = customPrice !== null ? customPrice : defaultTotal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!customerName.trim()) newErrors.customerName = 'Nama pelanggan wajib diisi';
    if (!customerPhone.trim()) newErrors.customerPhone = 'Nomor WhatsApp wajib diisi';
    if (!tripDate) newErrors.tripDate = 'Tanggal keberangkatan wajib dipilih';
    if (numberOfPeople < 1) newErrors.numberOfPeople = 'Jumlah peserta minimal 1 orang';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Harap lengkapi semua kolom bertanda merah (*)!');
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    const toastId = toast.loading('Menyimpan data reservasi manual...');

    try {
      const payload = {
        packageId: selectedPkg?.id || null,
        packageName: selectedPkg?.nameId || 'Paket Snorkeling Gili',
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || 'walkin@snorkelinggilitrawangan.com',
        numberOfPeople,
        tripDate,
        tripSession,
        pickupLocation: pickupLocation.trim(),
        specialRequests: specialRequests.trim(),
        totalPriceIdr: finalTotalPrice,
        totalPriceUsd: defaultTotalUsd,
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
              <label className="form-label" style={{ fontSize: '0.85rem' }}>
                Nama Pelanggan <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Contoh: Budi Santoso / John Doe"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  if (errors.customerName) setErrors((prev) => ({ ...prev, customerName: '' }));
                }}
                style={errors.customerName ? { borderColor: '#ef4444', backgroundColor: '#fffbfa' } : {}}
              />
              {errors.customerName && (
                <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                  <AlertCircle size={12} />
                  {errors.customerName}
                </span>
              )}
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>
                Nomor WhatsApp / HP <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="081234567890 / +62..."
                value={customerPhone}
                onChange={(e) => {
                  setCustomerPhone(e.target.value);
                  if (errors.customerPhone) setErrors((prev) => ({ ...prev, customerPhone: '' }));
                }}
                style={errors.customerPhone ? { borderColor: '#ef4444', backgroundColor: '#fffbfa' } : {}}
              />
              {errors.customerPhone && (
                <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                  <AlertCircle size={12} />
                  {errors.customerPhone}
                </span>
              )}
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
              <label className="form-label" style={{ fontSize: '0.85rem' }}>
                Pilihan Paket Snorkeling <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
              </label>
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
                    {pkg.nameId} (Rp {pkg.price.toLocaleString('id-ID')}{pkg.priceUnit === 'per_boat' ? '/boat' : '/org'})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>
                Jumlah Orang <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
              </label>
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
                  if (errors.numberOfPeople) setErrors((prev) => ({ ...prev, numberOfPeople: '' }));
                }}
                style={errors.numberOfPeople ? { borderColor: '#ef4444', backgroundColor: '#fffbfa' } : {}}
              />
              {errors.numberOfPeople && (
                <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                  <AlertCircle size={12} />
                  {errors.numberOfPeople}
                </span>
              )}
            </div>
          </div>

          {/* Date and Session */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>
                Tanggal Keberangkatan <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
              </label>
              <input
                type="date"
                className="form-control"
                value={tripDate}
                onChange={(e) => {
                  setTripDate(e.target.value);
                  if (errors.tripDate) setErrors((prev) => ({ ...prev, tripDate: '' }));
                }}
                style={errors.tripDate ? { borderColor: '#ef4444', backgroundColor: '#fffbfa' } : {}}
              />
              {errors.tripDate && (
                <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                  <AlertCircle size={12} />
                  {errors.tripDate}
                </span>
              )}
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>
                Sesi Waktu <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
              </label>
              <select
                className="form-control"
                value={tripSession}
                onChange={(e) => setTripSession(e.target.value)}
              >
                <option value="morning">Pagi (09:30 WITA) - Rekomendasi Penyu</option>
                <option value="afternoon">Siang (13:00 WITA)</option>
                <option value="sunset">Sore / Sunset (16:00 WITA)</option>
              </select>
            </div>
          </div>

          {/* Status & Custom Price */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>
                Status Reservasi <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
              </label>
              <select
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="confirmed">Confirmed (Terkonfirmasi)</option>
                <option value="pending">Pending (Menunggu DP / Konfirmasi)</option>
                <option value="completed">Completed (Selesai Trip)</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>
                Harga Manual / Diskon (IDR)
              </label>
              <input
                type="number"
                step="5000"
                className="form-control"
                placeholder={`Otomatis: Rp ${defaultTotal.toLocaleString('id-ID')}`}
                value={customPrice !== null ? customPrice : ''}
                onChange={(e) => {
                  const val = e.target.value ? parseInt(e.target.value) : null;
                  setCustomPrice(val);
                }}
              />
            </div>
          </div>

          {/* Pickup & Requests */}
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label" style={{ fontSize: '0.85rem' }}>Titik Kumpul / Hotel Penjemputan (Opsional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="Contoh: Dermaga Gili Trawangan / Hotel Aston Sunset"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label" style={{ fontSize: '0.85rem' }}>Catatan Khusus (Opsional)</label>
            <textarea
              className="form-control"
              placeholder="Contoh: Ada 1 anak usia 4 tahun, butuh pelampung anak"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={2}
              style={{ minHeight: '60px' }}
            />
          </div>

          {/* Total Calculation Preview Box */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(0, 119, 182, 0.06) 0%, rgba(0, 180, 216, 0.1) 100%)',
              border: '1.5px solid rgba(0, 119, 182, 0.2)',
              marginBottom: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>
                Kalkulasi Tarif {isPerBoat ? `(Base 4 Pax Rp ${selectedPkg?.price.toLocaleString('id-ID')}${extraPax > 0 ? ` + ${extraPax} Extra Pax × Rp 200.000` : ''})` : `(${numberOfPeople} Orang × Rp ${selectedPkg?.price.toLocaleString('id-ID')})`}:
              </span>
              <strong style={{ fontSize: '1.25rem', color: 'var(--primary-ocean)' }}>
                Rp {finalTotalPrice.toLocaleString('id-ID')}
              </strong>
              {customPrice !== null && (
                <span style={{ fontSize: '0.75rem', color: '#e67e22', marginLeft: '8px', fontWeight: 600 }}>
                  (Harga Khusus Diterapkan)
                </span>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Estimasi USD</span>
              <strong style={{ fontSize: '1.05rem', color: 'var(--primary-deep)' }}>
                ${defaultTotalUsd} USD
              </strong>
            </div>
          </div>

          {/* Footer Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
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
              {isSubmitting ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Simpan Reservasi</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
