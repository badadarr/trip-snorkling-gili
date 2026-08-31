'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { PackageData } from './PackageCard';
import { Calendar, CheckCircle2, MessageCircle, ArrowLeft, Loader2, Compass } from 'lucide-react';
import { toast } from 'sonner';
import CustomSelect from '@/components/ui/CustomSelect';
import ModernDatePicker from '@/components/ui/ModernDatePicker';
import SessionTimePicker from '@/components/ui/SessionTimePicker';

interface BookingFormProps {
  packagesList: PackageData[];
  initialSlug?: string;
  whatsappNumber?: string;
}

export default function BookingForm({ packagesList, initialSlug, whatsappNumber }: BookingFormProps) {
  const locale = useLocale();
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Find currently selected package
  const currentPackage = packagesList.find((p) => p.slug === selectedPkgSlug) || packagesList[0];

  // Set default tripDate to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    setTripDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  // Compute estimated total
  const computePrice = () => {
    if (!currentPackage) return { idr: 0, usd: 0 };
    if (currentPackage.price > 500000) {
      return {
        idr: currentPackage.price,
        usd: currentPackage.priceUsd,
      };
    } else {
      return {
        idr: currentPackage.price * numberOfPeople,
        usd: currentPackage.priceUsd * numberOfPeople,
      };
    }
  };

  const totals = computePrice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPackage) return;
    setErrorMsg('');
    setIsSubmitting(true);
    const toastId = toast.loading(locale === 'id' ? 'Sedang memproses reservasi...' : 'Processing your reservation...');

    try {
      const payload = {
        packageId: currentPackage.id,
        packageName: locale === 'id' ? currentPackage.nameId : currentPackage.nameEn,
        customerName,
        customerEmail,
        customerPhone,
        numberOfPeople: Number(numberOfPeople),
        tripDate,
        tripSession,
        pickupLocation,
        specialRequests,
        totalPriceIdr: totals.idr,
        totalPriceUsd: totals.usd,
        status: 'pending',
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(locale === 'id' ? 'Gagal mengirim pemesanan. Silakan coba lagi.' : 'Failed to submit reservation. Please try again.');
      }

      const data = await res.json();
      toast.success(
        locale === 'id' ? 'Booking berhasil dikirim! Silakan konfirmasi via WhatsApp.' : 'Booking submitted successfully! Please confirm via WhatsApp.',
        { id: toastId }
      );
      setSubmittedBooking(data.booking || payload);
    } catch (err: any) {
      const msg = err.message || (locale === 'id' ? 'Terjadi kesalahan sistem' : 'System error occurred');
      setErrorMsg(msg);
      toast.error(msg, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppBookingUrl = (booking: any) => {
    const packageName = locale === 'id' ? currentPackage?.nameId : currentPackage?.nameEn;
    const msg = `Halo Admin Trip Snorkeling Gili Trawangan!
Saya telah melakukan booking online dengan detail:
- Kode Booking: *${booking.bookingCode || 'ONLINE-BOOKING'}*
- Paket: *${packageName}*
- Nama: *${customerName}*
- Tanggal Trip: *${tripDate}*
- Sesi: *${tripSession}*
- Peserta: *${numberOfPeople} Orang*
- Total Biaya: *Rp ${totals.idr.toLocaleString('id-ID')}* (${totals.usd ? `$${totals.usd}` : ''})
${pickupLocation ? `- Lokasi: ${pickupLocation}\n` : ''}${specialRequests ? `- Catatan: ${specialRequests}\n` : ''}
Mohon konfirmasi ketersediaan slot dan meeting point. Terima kasih!`;

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
            marginBottom: '28px',
            border: '1px solid rgba(0, 180, 216, 0.2)',
          }}
        >
          <h4 style={{ fontSize: '0.95rem', color: 'var(--primary-navy)', marginBottom: '12px' }}>
            {t('summaryTitle')}:
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
            <div><strong>{locale === 'id' ? 'Paket' : 'Package'}:</strong> {locale === 'id' ? currentPackage?.nameId : currentPackage?.nameEn}</div>
            <div><strong>{locale === 'id' ? 'Nama' : 'Name'}:</strong> {customerName}</div>
            <div><strong>{locale === 'id' ? 'Tanggal' : 'Date'}:</strong> {tripDate} ({tripSession})</div>
            <div><strong>{locale === 'id' ? 'Peserta' : 'Guests'}:</strong> {numberOfPeople} {locale === 'id' ? 'Orang' : 'Pax'}</div>
            <div><strong>{locale === 'id' ? 'Total Biaya' : 'Total'}:</strong> Rp {totals.idr.toLocaleString('id-ID')} (${totals.usd})</div>
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
              label={`${t('selectPackage')} *`}
              value={selectedPkgSlug}
              onChange={(val) => setSelectedPkgSlug(val)}
              options={packagesList.map((pkg) => ({
                value: pkg.slug,
                label: locale === 'id' ? pkg.nameId : pkg.nameEn,
                subtitle: locale === 'id'
                  ? `Rp ${pkg.price.toLocaleString('id-ID')} / ${pkg.durationId || '4-5 Jam'}`
                  : `$${pkg.priceUsd} USD / ${pkg.durationEn || '4-5 Hours'}`,
                badge: pkg.isFeatured ? (locale === 'id' ? 'Populer' : 'Popular') : undefined,
              }))}
            />
          </div>

          {/* 2. Customer Name */}
          <div className="form-group">
            <label className="form-label">{t('fullName')} *</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                placeholder={t('fullNamePlaceholder')}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* 3. Customer Email & Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">{t('email')} *</label>
              <input
                type="email"
                className="form-control"
                placeholder={t('emailPlaceholder')}
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t('phone')} *</label>
              <input
                type="tel"
                className="form-control"
                placeholder={t('phonePlaceholder')}
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
              />
            </div>
          </div>

          {/* 4. Number of People & Modern Date Picker */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">{t('pax')} *</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setNumberOfPeople((prev) => Math.max(1, prev - 1))}
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
                  max="50"
                  className="form-control"
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{ textAlign: 'center', fontWeight: 700 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setNumberOfPeople((prev) => Math.min(50, prev + 1))}
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
            </div>

            <div className="form-group">
              <ModernDatePicker
                label={`${t('tripDate')} *`}
                value={tripDate}
                onChange={(d) => setTripDate(d)}
                locale={locale}
              />
            </div>
          </div>

          {/* 5. Session Time Selection Cards */}
          <div className="form-group">
            <SessionTimePicker
              label={`${t('session')} *`}
              value={tripSession}
              onChange={(s) => setTripSession(s)}
              locale={locale}
            />
          </div>

          {/* 6. Pickup Location (Optional) */}
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

          {/* 7. Special Requests */}
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
                {locale === 'id' ? 'RINGKASAN PAKET' : 'PACKAGE SUMMARY'}
              </div>
            </div>

            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-deep)', marginBottom: '8px' }}>
              {locale === 'id' ? currentPackage.nameId : currentPackage.nameEn}
            </h3>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: 1.5 }}>
              {locale === 'id' ? currentPackage.descriptionId : currentPackage.descriptionEn}
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
                  {currentPackage.price > 500000
                    ? (locale === 'id' ? 'Tarif Private Boat' : 'Private Boat Rate')
                    : `${locale === 'id' ? 'Harga per Orang' : 'Rate per Person'} (${numberOfPeople}x)`}
                </span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                  Rp {currentPackage.price.toLocaleString('id-ID')}
                </span>
              </div>
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
                    Rp {totals.idr.toLocaleString('id-ID')}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    approx. ${totals.usd} USD
                  </div>
                </div>
              </div>
            </div>

            {/* What's Included */}
            {currentPackage.includesId && (
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-navy)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  {tPkg('includes')}:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {(locale === 'id' ? currentPackage.includesId : (currentPackage.includesEn || currentPackage.includesId)).slice(0, 4).map((inc, i) => (
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
              {locale === 'id' ? 'Mau Konsultasi Dulu?' : 'Prefer Quick Chat?'}
            </h4>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
            {locale === 'id'
              ? 'Ada pertanyaan seputar cuaca, rute penjemputan dari Lombok, atau permintaan khusus? Hubungi tim kami langsung via WhatsApp.'
              : 'Have special questions regarding weather, speedboat transfer from Lombok, or customized routes? Chat directly with our local coordinator.'}
          </p>
          <a
            href={`https://wa.me/${phoneTarget.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              locale === 'id'
                ? `Halo Admin Trip Snorkeling Gili Trawangan! Saya mau tanya informasi paket snorkeling...`
                : `Hello! I would like to ask some questions about your Gili snorkeling packages.`
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
