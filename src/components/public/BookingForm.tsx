'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { PackageData } from './PackageCard';
import { Calendar, CheckCircle2, MessageCircle, ArrowLeft, Loader2, Compass, AlertCircle, CreditCard, Upload, Image as ImageIcon, QrCode, Building2, Info } from 'lucide-react';
import { toast } from 'sonner';
import CustomSelect from '@/components/ui/CustomSelect';
import ModernDatePicker from '@/components/ui/ModernDatePicker';
import SessionTimePicker from '@/components/ui/SessionTimePicker';
import { formatIdr, formatUsd } from '@/lib/format';

interface BookingFormProps {
  packagesList: PackageData[];
  initialSlug?: string;
  whatsappNumber?: string;
}

export default function BookingForm({ packagesList, initialSlug, whatsappNumber }: BookingFormProps) {
  const t = useTranslations('booking');
  const tPkg = useTranslations('packages');
  const tCta = useTranslations('cta');
  const phoneTarget = whatsappNumber || '6287864551234';

  const [selectedPkgSlug, setSelectedPkgSlug] = useState<string>(
    initialSlug || (packagesList.length > 0 ? packagesList[0].slug : '')
  );
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(2);
  const [tripDate, setTripDate] = useState('');
  const [tripSession, setTripSession] = useState('morning');
  const [pickupLocation, setPickupLocation] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bank_transfer'>('qris');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Payment proof upload state
  const [paymentProofUrl, setPaymentProofUrl] = useState('');
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const proofInputRef = useRef<HTMLInputElement>(null);

  // Find currently selected package
  const currentPackage = packagesList.find((p) => p.slug === selectedPkgSlug) || packagesList[0];

  // Determine if current package is private (per_boat) or public (per_person)
  const isPrivatePackage = currentPackage
    ? (currentPackage.priceUnit === 'per_boat' || (!currentPackage.priceUnit && currentPackage.price > 500000))
    : false;

  const packageType: 'public' | 'private' = isPrivatePackage ? 'private' : 'public';

  // Max pax for private = 4 (but allow more with warning)
  const PRIVATE_MAX_PAX = 4;

  // Set default tripDate to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    setTripDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  // Reset pax when switching packages
  useEffect(() => {
    if (isPrivatePackage && numberOfPeople > PRIVATE_MAX_PAX) {
      // Don't reset — just show warning
    }
  }, [selectedPkgSlug]);

  // Compute estimated total based on priceUnit
  const computePrice = () => {
    if (!currentPackage) return { idr: 0, usd: 0, boatsCount: 1, isPerBoat: false };
    const isPerBoat = isPrivatePackage;
    if (isPerBoat) {
      // Private: flat rate per boat, extra charge message shown separately
      return {
        idr: currentPackage.price,
        usd: Number(currentPackage.priceUsd.toFixed(2)),
        boatsCount: 1,
        isPerBoat: true,
      };
    } else {
      return {
        idr: currentPackage.price * numberOfPeople,
        usd: Number((currentPackage.priceUsd * numberOfPeople).toFixed(2)),
        boatsCount: 1,
        isPerBoat: false,
      };
    }
  };

  const totals = computePrice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!selectedPkgSlug) newErrors.package = 'Harap pilih salah satu paket snorkeling / Please select a package';
    if (!customerName.trim()) newErrors.customerName = 'Nama lengkap wajib diisi / Full name is required';
    if (!customerEmail.trim()) {
      newErrors.customerEmail = 'Alamat email wajib diisi / Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
      newErrors.customerEmail = 'Format email tidak valid / Invalid email address';
    }
    if (!customerPhone.trim()) {
      newErrors.customerPhone = 'Nomor WhatsApp wajib diisi / WhatsApp number is required';
    } else if (customerPhone.replace(/[^0-9]/g, '').length < 7) {
      newErrors.customerPhone = 'Nomor telepon minimal 7 digit / Phone number min. 7 digits';
    }
    if (!tripDate) newErrors.tripDate = 'Tanggal keberangkatan wajib dipilih / Trip date is required';
    if (!tripSession) newErrors.tripSession = 'Sesi waktu trip wajib dipilih / Session is required';
    if (numberOfPeople < 1) newErrors.numberOfPeople = 'Jumlah peserta minimal 1 orang / Min. 1 guest';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorMsg('Harap lengkapi semua kolom wajib bertanda merah (*)');
      toast.error('Harap lengkapi semua kolom wajib bertanda merah (*)!');
      return;
    }

    if (!currentPackage) return;
    setErrors({});
    setErrorMsg('');
    setIsSubmitting(true);
    const toastId = toast.loading('Memproses reservasi Anda / Processing reservation...');

    try {
      const payload = {
        packageId: currentPackage.id,
        packageName: currentPackage.nameEn || currentPackage.nameId,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        numberOfPeople: Number(numberOfPeople),
        tripDate,
        tripSession,
        pickupLocation: pickupLocation.trim(),
        specialRequests: specialRequests.trim(),
        totalPriceIdr: totals.idr,
        totalPriceUsd: totals.usd,
        paymentMethod,
        status: 'pending',
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to submit reservation. Please try again.');
      }

      const data = await res.json();
      toast.success(
        'Booking submitted successfully! Please confirm via WhatsApp.',
        { id: toastId }
      );
      setSubmittedBooking(data.booking || payload);
    } catch (err: any) {
      const msg = err.message || 'An unexpected error occurred';
      setErrorMsg(msg);
      toast.error(msg, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle payment proof upload
  const handlePaymentProofUpload = async (file: File) => {
    setIsUploadingProof(true);
    const toastId = toast.loading(t('paymentProofUploading'));

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (submittedBooking?.id) {
        formData.append('bookingId', String(submittedBooking.id));
      }

      const res = await fetch('/api/bookings/upload-proof', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Upload failed');
      }

      const data = await res.json();
      setPaymentProofUrl(data.url);

      // Update booking with proof URL
      if (submittedBooking?.id) {
        await fetch(`/api/bookings/${submittedBooking.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...submittedBooking,
            paymentProofUrl: data.url,
          }),
        }).catch(() => {}); // Best effort update
      }

      toast.success(t('paymentProofSuccess'), { id: toastId });
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload payment proof', { id: toastId });
    } finally {
      setIsUploadingProof(false);
    }
  };

  const getWhatsAppBookingUrl = (booking: any) => {
    const packageName = currentPackage?.nameEn || currentPackage?.nameId;
    const tripType = isPrivatePackage ? 'Private' : 'Public';
    const msg = `Hello Admin Gili Trawangan Snorkeling Trip!
I have submitted an online booking with the following details:
- Booking Code: *${booking.bookingCode || 'ONLINE-BOOKING'}*
- Package: *${packageName}* (${tripType})
- Name: *${customerName}*
- Trip Date: *${tripDate}*
- Session: *${tripSession}*
- Guests: *${numberOfPeople} Person(s)*
- Payment Method: *${paymentMethod === 'qris' ? 'QRIS' : 'Bank Transfer'}*
- Total Price: *${totals.usd ? `$${totals.usd} USD` : ''}* (~ Rp ${totals.idr.toLocaleString('id-ID')})
${numberOfPeople > PRIVATE_MAX_PAX && isPrivatePackage ? `⚠️ Note: ${numberOfPeople} guests (exceeds max 4 pax, additional charges may apply)\n` : ''}${pickupLocation ? `- Pickup/Location: ${pickupLocation}\n` : ''}${specialRequests ? `- Special Request: ${specialRequests}\n` : ''}
Please confirm slot availability and payment details. Thank you!`;

    return `https://wa.me/${phoneTarget.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`;
  };

  if (submittedBooking) {
    const waUrl = getWhatsAppBookingUrl(submittedBooking);

    return (
      <div
        className="glass-card"
        style={{
          maxWidth: '680px',
          margin: '0 auto',
          padding: '40px 30px',
          textAlign: 'center',
          border: '2px solid var(--accent-green)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(6, 214, 160, 0.15)',
            color: 'var(--accent-green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <CheckCircle2 size={36} strokeWidth={2.4} />
        </div>

        <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-deep)', marginBottom: '12px' }}>
          {t('successTitle')}
        </h2>

        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
          {t('successDesc')}
          <strong style={{ color: 'var(--primary-ocean)', fontSize: '1.15rem', display: 'block', marginTop: '6px' }}>
            {submittedBooking.bookingCode || 'GILI-SUCCESS'}
          </strong>
        </p>

        <div
          style={{
            background: 'var(--primary-surface)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            textAlign: 'left',
            marginBottom: '20px',
            border: '1px solid rgba(0, 180, 216, 0.2)',
          }}
        >
          <h4 style={{ fontSize: '0.95rem', color: 'var(--primary-navy)', marginBottom: '12px' }}>
            {t('summaryTitle')}:
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
            <div><strong>Package:</strong> {currentPackage?.nameEn || currentPackage?.nameId} ({isPrivatePackage ? 'Private' : 'Public'})</div>
            <div><strong>Name:</strong> {customerName}</div>
            <div><strong>Date:</strong> {tripDate} ({tripSession})</div>
            <div><strong>Guests:</strong> {numberOfPeople} Person(s) {isPrivatePackage && numberOfPeople > PRIVATE_MAX_PAX ? '⚠️ Extra charge applies' : ''}</div>
            <div><strong>Payment:</strong> {paymentMethod === 'qris' ? 'QRIS' : 'Bank Transfer'}</div>
            <div><strong>Total:</strong> ${totals.usd} USD (~ Rp {totals.idr.toLocaleString('id-ID')})</div>
          </div>
        </div>

        {/* Payment Method & Upload Proof Section */}
        <div
          style={{
            background: '#fffbeb',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            textAlign: 'left',
            marginBottom: '20px',
            border: '1px solid #fde68a',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <CreditCard size={20} color="#b45309" />
            <h4 style={{ fontSize: '0.95rem', color: '#92400e', margin: 0 }}>
              {t('paymentMethodTitle')}
            </h4>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
            <div
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                border: paymentMethod === 'qris' ? '2px solid #d97706' : '1px solid #e5e7eb',
                background: paymentMethod === 'qris' ? '#fef3c7' : '#ffffff',
                textAlign: 'center',
              }}
            >
              <QrCode size={24} color="#b45309" style={{ margin: '0 auto 6px' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#92400e' }}>QRIS</div>
              <div style={{ fontSize: '0.72rem', color: '#a16207' }}>Scan & Pay</div>
            </div>
            <div
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                border: paymentMethod === 'bank_transfer' ? '2px solid #d97706' : '1px solid #e5e7eb',
                background: paymentMethod === 'bank_transfer' ? '#fef3c7' : '#ffffff',
                textAlign: 'center',
              }}
            >
              <Building2 size={24} color="#b45309" style={{ margin: '0 auto 6px' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#92400e' }}>Bank Transfer</div>
              <div style={{ fontSize: '0.72rem', color: '#a16207' }}>Manual Transfer</div>
            </div>
          </div>

          <p style={{ fontSize: '0.82rem', color: '#a16207', marginBottom: '16px', lineHeight: 1.5 }}>
            {t('paymentMethodDesc')}
          </p>

          {/* Upload Payment Proof */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
              border: '1px dashed #d97706',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Upload size={16} color="#b45309" />
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#92400e' }}>
                {t('paymentProofTitle')}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#a16207', marginBottom: '12px', lineHeight: 1.4 }}>
              {t('paymentProofDesc')}
            </p>

            {paymentProofUrl ? (
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-sm)',
                    background: '#d1fae5',
                    color: '#065f46',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    marginBottom: '8px',
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>{t('paymentProofSuccess')}</span>
                </div>
                {paymentProofUrl.startsWith('data:') ? null : (
                  <div>
                    <img
                      src={paymentProofUrl}
                      alt="Payment proof"
                      style={{
                        maxWidth: '200px',
                        maxHeight: '150px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid #e5e7eb',
                        marginTop: '8px',
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  ref={proofInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePaymentProofUpload(file);
                  }}
                />
                <button
                  type="button"
                  disabled={isUploadingProof}
                  onClick={() => proofInputRef.current?.click()}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid #d97706',
                    background: '#fef3c7',
                    color: '#92400e',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: isUploadingProof ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    opacity: isUploadingProof ? 0.7 : 1,
                  }}
                >
                  {isUploadingProof ? (
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <ImageIcon size={16} />
                  )}
                  <span>{isUploadingProof ? t('paymentProofUploading') : t('paymentProofUpload')}</span>
                </button>
                <p style={{ fontSize: '0.72rem', color: '#a16207', textAlign: 'center', fontStyle: 'italic' }}>
                  {t('paymentProofOptional')}
                </p>
              </div>
            )}
          </div>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
          {t('successNote')}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-whatsapp btn-lg"
            style={{ width: '100%' }}
          >
            <MessageCircle size={20} />
            <span>{t('chatWaNow')}</span>
          </a>

          <Link href="/" className="btn btn-secondary">
            <ArrowLeft size={16} />
            <span>{t('backHome')}</span>
          </Link>
        </div>
      </div>
    );
  }

  if (packagesList.length === 0) {
    return (
      <div
        className="glass-card"
        style={{
          maxWidth: '640px',
          margin: '0 auto',
          padding: '48px 32px',
          textAlign: 'center',
          borderRadius: '24px',
          border: '1px dashed rgba(0, 180, 216, 0.35)',
        }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'rgba(0, 180, 216, 0.12)',
            color: 'var(--primary-ocean)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
          }}
        >
          <Compass size={36} />
        </div>
        <h2 style={{ fontSize: '1.45rem', color: 'var(--primary-deep)', marginBottom: '12px', fontWeight: 700 }}>
          {tPkg('noPackagesBookingTitle')}
        </h2>
        <p style={{ fontSize: '0.98rem', color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: '480px', margin: '0 auto 28px' }}>
          {tPkg('noPackagesBookingSubtitle')}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '320px', margin: '0 auto' }}>
          <a
            href={`https://wa.me/${phoneTarget.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Halo Trip Snorkeling Gili! Saya ingin berkonsultasi & memesan trip snorkeling...')}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-whatsapp btn-lg"
            style={{ width: '100%' }}
          >
            <MessageCircle size={20} />
            <span>{tPkg('contactWa')}</span>
          </a>
          <Link href="/" className="btn btn-secondary" style={{ width: '100%' }}>
            <ArrowLeft size={16} />
            <span>{t('backHome')}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
      {/* Left Column: Form Controls */}
      <div className="glass-card" style={{ padding: '36px 30px' }}>
        <form onSubmit={handleSubmit}>
          {errorMsg && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                background: '#fee2e2',
                color: '#b91c1c',
                marginBottom: '20px',
                fontSize: '0.9rem',
              }}
            >
              {errorMsg}
            </div>
          )}

          {/* 1. Custom Package Dropdown */}
          <div className="form-group">
            <CustomSelect
              label={
                <>
                  {t('selectPackage')} <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
                </>
              }
              value={selectedPkgSlug}
              onChange={(val) => {
                setSelectedPkgSlug(val);
                if (errors.package) setErrors((prev) => ({ ...prev, package: '' }));
              }}
              error={errors.package}
              options={packagesList.map((pkg) => {
                const isPkgPrivate = pkg.priceUnit === 'per_boat' || (!pkg.priceUnit && pkg.price > 500000);
                return {
                  value: pkg.slug,
                  label: pkg.nameEn || pkg.nameId,
                  subtitle: `$${pkg.priceUsd} USD / ${pkg.durationEn || pkg.durationId || '4-5 Hours'} (~Rp ${pkg.price.toLocaleString('id-ID')}) • ${isPkgPrivate ? 'Private' : 'Public'}`,
                  badge: pkg.isFeatured ? 'Popular' : isPkgPrivate ? 'Private' : undefined,
                };
              })}
            />
          </div>

          {/* Package Type Indicator */}
          {currentPackage && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                background: isPrivatePackage ? 'rgba(217, 119, 6, 0.08)' : 'var(--primary-surface)',
                border: isPrivatePackage ? '1px solid rgba(217, 119, 6, 0.2)' : '1px solid rgba(0, 180, 216, 0.2)',
                marginBottom: '16px',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: isPrivatePackage ? '#b45309' : 'var(--primary-ocean)',
              }}
            >
              <Info size={14} />
              <span>
                {isPrivatePackage
                  ? `🔒 Private Trip — Max. ${PRIVATE_MAX_PAX} Pax • Flexible Schedule`
                  : '👥 Public Shared Trip — Per Person • Fixed Schedule'}
              </span>
            </div>
          )}

          {/* 2. Customer Name */}
          <div className="form-group">
            <label className="form-label">
              {t('fullName')} <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                placeholder={t('fullNamePlaceholder')}
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  if (errors.customerName) setErrors((prev) => ({ ...prev, customerName: '' }));
                }}
                style={errors.customerName ? { borderColor: '#ef4444', backgroundColor: '#fffbfa' } : {}}
              />
            </div>
            {errors.customerName && (
              <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                <AlertCircle size={12} />
                {errors.customerName}
              </span>
            )}
          </div>

          {/* 3. Customer Email & Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">
                {t('email')} <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
              </label>
              <input
                type="email"
                className="form-control"
                placeholder={t('emailPlaceholder')}
                value={customerEmail}
                onChange={(e) => {
                  setCustomerEmail(e.target.value);
                  if (errors.customerEmail) setErrors((prev) => ({ ...prev, customerEmail: '' }));
                }}
                style={errors.customerEmail ? { borderColor: '#ef4444', backgroundColor: '#fffbfa' } : {}}
              />
              {errors.customerEmail && (
                <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                  <AlertCircle size={12} />
                  {errors.customerEmail}
                </span>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">
                {t('phone')} <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
              </label>
              <input
                type="tel"
                className="form-control"
                placeholder={t('phonePlaceholder')}
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

          {/* 4. Number of People & Modern Date Picker */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">
                {t('pax')} <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setNumberOfPeople((prev) => {
                      const nextVal = Math.max(1, prev - 1);
                      if (errors.numberOfPeople) setErrors((err) => ({ ...err, numberOfPeople: '' }));
                      return nextVal;
                    });
                  }}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    background: '#ffffff',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'var(--primary-deep)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={isPrivatePackage ? PRIVATE_MAX_PAX : 50}
                  className="form-control"
                  value={numberOfPeople}
                  onChange={(e) => {
                    const val = Math.max(1, parseInt(e.target.value) || 1);
                    setNumberOfPeople(isPrivatePackage ? Math.min(PRIVATE_MAX_PAX, val) : val);
                    if (errors.numberOfPeople) setErrors((prev) => ({ ...prev, numberOfPeople: '' }));
                  }}
                  style={{
                    textAlign: 'center',
                    fontWeight: 700,
                    ...(errors.numberOfPeople ? { borderColor: '#ef4444', backgroundColor: '#fffbfa' } : {}),
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setNumberOfPeople((prev) => {
                      const max = isPrivatePackage ? PRIVATE_MAX_PAX : 50;
                      const nextVal = Math.min(max, prev + 1);
                      if (errors.numberOfPeople) setErrors((err) => ({ ...err, numberOfPeople: '' }));
                      return nextVal;
                    });
                  }}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    background: '#ffffff',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'var(--primary-deep)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  +
                </button>
              </div>
              {errors.numberOfPeople && (
                <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                  <AlertCircle size={12} />
                  {errors.numberOfPeople}
                </span>
              )}
              {/* Private: Max 4 Pax info */}
              {isPrivatePackage && (
                <div
                  style={{
                    marginTop: '6px',
                    fontSize: '0.75rem',
                    color: '#b45309',
                    background: '#fffbeb',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: '1px solid #fde68a',
                  }}
                >
                  <AlertCircle size={13} />
                  <span>
                    Max. {PRIVATE_MAX_PAX} Pax per private trip. <strong>{t('extraChargeWarning')}</strong>
                  </span>
                </div>
              )}
            </div>

            <div className="form-group">
              <ModernDatePicker
                label={
                  <>
                    {t('tripDate')} <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
                  </>
                }
                value={tripDate}
                onChange={(d) => {
                  setTripDate(d);
                  if (errors.tripDate) setErrors((prev) => ({ ...prev, tripDate: '' }));
                }}
                error={errors.tripDate}
                locale="en"
              />
            </div>
          </div>

          {/* 5. Session Time Selection Cards */}
          <div className="form-group">
            <SessionTimePicker
              label={
                <>
                  {t('session')} <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
                </>
              }
              value={tripSession}
              onChange={(s) => {
                setTripSession(s);
                if (errors.tripSession) setErrors((prev) => ({ ...prev, tripSession: '' }));
              }}
              error={errors.tripSession}
              locale="en"
              packageType={packageType}
            />
          </div>

          {/* 6. Payment Method Selection */}
          <div className="form-group">
            <label className="form-label">
              {t('paymentMethodTitle')} <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setPaymentMethod('qris')}
                style={{
                  padding: '14px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: paymentMethod === 'qris' ? '2px solid var(--primary-ocean)' : '1px solid var(--border-light)',
                  background: paymentMethod === 'qris' ? 'var(--primary-surface)' : '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                }}
              >
                <QrCode size={22} color={paymentMethod === 'qris' ? 'var(--primary-ocean)' : 'var(--text-muted)'} />
                <div>
                  <span style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: paymentMethod === 'qris' ? 'var(--primary-ocean)' : 'var(--primary-deep)' }}>QRIS</span>
                  <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>Scan & Pay</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('bank_transfer')}
                style={{
                  padding: '14px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: paymentMethod === 'bank_transfer' ? '2px solid var(--primary-ocean)' : '1px solid var(--border-light)',
                  background: paymentMethod === 'bank_transfer' ? 'var(--primary-surface)' : '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                }}
              >
                <Building2 size={22} color={paymentMethod === 'bank_transfer' ? 'var(--primary-ocean)' : 'var(--text-muted)'} />
                <div>
                  <span style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: paymentMethod === 'bank_transfer' ? 'var(--primary-ocean)' : 'var(--primary-deep)' }}>Bank Transfer</span>
                  <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>Manual Transfer</span>
                </div>
              </button>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.4 }}>
              {t('paymentMethodDesc')}
            </p>
          </div>

          {/* 7. Pickup Location (Optional) */}
          <div className="form-group">
            <label className="form-label">{t('pickup')}</label>
            <input
              type="text"
              className="form-control"
              placeholder={t('pickupPlaceholder')}
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            />
          </div>

          {/* 8. Special Requests */}
          <div className="form-group">
            <label className="form-label">{t('notes')}</label>
            <textarea
              className="form-control"
              placeholder={t('notesPlaceholder')}
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '10px', opacity: isSubmitting ? 0.85 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <Calendar size={18} />
            )}
            <span>{isSubmitting ? t('submitting') : t('submitBtn')}</span>
          </button>
        </form>
      </div>

      {/* Right Column: Live Summary & Direct WhatsApp alternative */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Selected Package Preview Card */}
        {currentPackage && (
          <div className="glass-card" style={{ padding: '28px', border: '1px solid var(--primary-turquoise)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ padding: '6px 12px', background: 'var(--primary-surface)', color: 'var(--primary-ocean)', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700 }}>
                PACKAGE SUMMARY
              </div>
              <div
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  background: isPrivatePackage ? '#fef3c7' : '#dbeafe',
                  color: isPrivatePackage ? '#92400e' : '#1e40af',
                  border: isPrivatePackage ? '1px solid #fde68a' : '1px solid #93c5fd',
                }}
              >
                {isPrivatePackage ? '🔒 PRIVATE' : '👥 PUBLIC'}
              </div>
            </div>

            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-deep)', marginBottom: '8px' }}>
              {currentPackage.nameEn || currentPackage.nameId}
            </h3>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: 1.5 }}>
              {currentPackage.descriptionEn || currentPackage.descriptionId}
            </p>

            {/* Price Breakdown */}
            <div
              style={{
                background: 'var(--bg-alt)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                marginBottom: '20px',
                border: '1px solid var(--border-light)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>
                  {isPrivatePackage
                    ? `Private Trip (Max ${PRIVATE_MAX_PAX} Pax)`
                    : `Rate per Person (${numberOfPeople}x)`}
                </span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                  {formatUsd(totals.usd)} <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>({formatIdr(totals.idr)})</span>
                </span>
              </div>
              {isPrivatePackage && (
                <div style={{ fontSize: '0.75rem', color: '#b45309', marginBottom: '8px', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={12} />
                  <span>{t('extraChargeWarning')}</span>
                </div>
              )}
              <div
                style={{
                  borderTop: '1px dashed var(--border-light)',
                  paddingTop: '10px',
                  marginTop: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <span style={{ fontWeight: 700, color: 'var(--primary-deep)', fontSize: '0.95rem' }}>
                  {t('estimatedTotal')}
                </span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-ocean)', fontFamily: 'var(--font-heading)' }}>
                    {formatUsd(totals.usd)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    approx. {formatIdr(totals.idr)}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods Info */}
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-navy)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                {t('paymentMethodTitle')}:
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: 'var(--radius-sm)', background: '#f0fdf4', border: '1px solid rgba(21, 128, 61, 0.2)', fontSize: '0.78rem', fontWeight: 600, color: '#15803d' }}>
                  <QrCode size={13} />
                  <span>QRIS</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: 'var(--radius-sm)', background: '#f0fdf4', border: '1px solid rgba(21, 128, 61, 0.2)', fontSize: '0.78rem', fontWeight: 600, color: '#15803d' }}>
                  <Building2 size={13} />
                  <span>Bank Transfer</span>
                </div>
              </div>
            </div>

            {/* What's Included */}
            {(currentPackage.includesEn || currentPackage.includesId) && (
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-navy)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  {tPkg('includes')}:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {((currentPackage.includesEn && currentPackage.includesEn.length > 0) ? currentPackage.includesEn : (currentPackage.includesId || [])).slice(0, 4).map((inc, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      <CheckCircle2 size={14} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Direct WhatsApp Quick Booking Box */}
        <div
          className="glass-card"
          style={{
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.08) 0%, rgba(0, 180, 216, 0.08) 100%)',
            border: '1px solid rgba(37, 211, 102, 0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <MessageCircle size={22} color="#25d366" />
            <h4 style={{ fontSize: '1rem', color: 'var(--primary-deep)' }}>
              Prefer Quick Chat?
            </h4>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
            Have special questions regarding weather, speedboat transfer from Lombok, or customized routes? Chat directly with our local coordinator.
          </p>
          <a
            href={`https://wa.me/${phoneTarget.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              `Hello! I would like to ask some questions about your Gili tour packages.`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-whatsapp btn-sm"
            style={{ width: '100%' }}
          >
            <MessageCircle size={16} />
            <span>{tCta('whatsappButton')}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
