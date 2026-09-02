import React from 'react';
import { getBookingsList, getPackagesList, getGalleryList, getTestimonialsList, getSettings } from '@/lib/data';
import NextLink from 'next/link';
import {
  CalendarCheck,
  Clock,
  Package,
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  MessageCircle,
  TrendingUp,
  Plus,
  Eye,
  Users,
  Anchor,
  Compass,
  FileSpreadsheet,
  AlertCircle,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const bookings = await getBookingsList();
  const packages = await getPackagesList();
  const gallery = await getGalleryList();
  const testimonials = await getTestimonialsList();
  const settings = await getSettings();

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
  const totalRevenue = confirmedBookings.reduce((acc, b) => acc + (b.totalPriceIdr || 0), 0);
  const totalRevenueUsd = confirmedBookings.reduce((acc, b) => acc + (b.totalPriceUsd || 0), 0);

  // Today's trips
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTrips = bookings.filter((b) => b.tripDate === todayStr && b.status !== 'cancelled');
  const todayMorningTrips = todayTrips.filter((b) => b.tripSession === 'morning');
  const todayAfternoonTrips = todayTrips.filter((b) => b.tripSession === 'afternoon' || b.tripSession === 'sunset');
  const todayTotalPassengers = todayTrips.reduce((acc, b) => acc + (b.numberOfPeople || 0), 0);

  const waSetting = settings.find((s) => s.key === 'whatsapp_number');
  const whatsappNumber = waSetting?.value || '6282236851307';

  return (
    <div>
      {/* Top Welcome Title & Quick Actions */}
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
            Dashboard Operasional Trip
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Pantau keberangkatan kapal hari ini, reservasi masuk, dan kelola paket snorkeling 3 Gili.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <NextLink href="/admin/booking" className="btn btn-secondary btn-sm">
            <FileSpreadsheet size={15} />
            <span>Kelola Booking & Manifest</span>
          </NextLink>
          <NextLink href="/admin/paket" className="btn btn-primary btn-sm">
            <Plus size={15} />
            <span>Tambah Paket Trip</span>
          </NextLink>
          <NextLink href="/" target="_blank" className="btn btn-secondary btn-sm">
            <Eye size={15} />
            <span>Website Live</span>
          </NextLink>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {/* Penumpang Hari Ini */}
        <div className="glass-card" style={{ padding: '20px', background: '#ffffff', borderLeft: '4px solid var(--primary-ocean)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Penumpang Hari Ini
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'var(--primary-surface)', color: 'var(--primary-ocean)' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary-deep)' }}>
            {todayTotalPassengers} <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-muted)' }}>Orang</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--primary-ocean)', fontWeight: 600, display: 'block', marginTop: '4px' }}>
            {todayTrips.length} Rombongan Keberangkatan
          </span>
        </div>

        {/* Booking Pending Follow-up */}
        <div className="glass-card" style={{ padding: '20px', background: '#ffffff', borderLeft: '4px solid #d97706' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Booking Pending
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', background: '#fef3c7', color: '#d97706' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#d97706' }}>
            {pendingBookings.length}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
            Butuh konfirmasi via WhatsApp
          </span>
        </div>

        {/* Total Terkonfirmasi */}
        <div className="glass-card" style={{ padding: '20px', background: '#ffffff', borderLeft: '4px solid var(--accent-green)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Booking Confirmed
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(6, 214, 160, 0.15)', color: 'var(--accent-green)' }}>
              <CalendarCheck size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary-deep)' }}>
            {confirmedBookings.length} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ {totalBookings} total</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--accent-green)', fontWeight: 600, display: 'block', marginTop: '4px' }}>
            {Math.round((confirmedBookings.length / (totalBookings || 1)) * 100)}% Rasio Konversi
          </span>
        </div>

        {/* Total Omset */}
        <div className="glass-card" style={{ padding: '20px', background: '#ffffff', borderLeft: '4px solid #00b4d8' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Estimasi Omset
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(0, 180, 216, 0.15)', color: 'var(--primary-ocean)' }}>
              <Sparkles size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary-ocean)' }}>
            Rp {totalRevenue.toLocaleString('id-ID')}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
            {totalRevenueUsd > 0 ? `+ $${totalRevenueUsd} USD` : 'Dari booking confirmed'}
          </span>
        </div>
      </div>

      {/* Two Columns: Today's Departure Schedule & Pending Follow-up Queue */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '28px' }}>
        {/* Today's Departures Schedule */}
        <div className="glass-card" style={{ padding: '24px', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ padding: '6px', borderRadius: '8px', background: 'var(--primary-surface)', color: 'var(--primary-ocean)' }}>
                <Anchor size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--primary-deep)', margin: 0 }}>
                  Jadwal Keberangkatan Hari Ini
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Tanggal: <strong>{todayStr}</strong> ({todayTotalPassengers} Penumpang)
                </span>
              </div>
            </div>

            <NextLink href="/admin/booking" className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
              <span>Buka Manifest</span>
            </NextLink>
          </div>

          {todayTrips.length === 0 ? (
            <div
              style={{
                padding: '30px 20px',
                textAlign: 'center',
                background: '#f8fafc',
                borderRadius: 'var(--radius-sm)',
                border: '1px dashed var(--border-light)',
                color: 'var(--text-muted)',
                fontSize: '0.88rem',
              }}
            >
              Belum ada jadwal keberangkatan untuk hari ini.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {todayTrips.map((b) => (
                <div
                  key={b.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    background: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--primary-deep)' }}>
                        {b.customerName}
                      </strong>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: b.tripSession === 'morning' ? '#e0f2fe' : '#fef3c7',
                          color: b.tripSession === 'morning' ? '#0369a1' : '#b45309',
                          fontWeight: 700,
                        }}
                      >
                        {b.tripSession === 'morning' ? 'Pagi (09:30)' : 'Siang (13:00)'}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {b.packageName} • <strong>{b.numberOfPeople} Org</strong>
                    </span>
                  </div>

                  <a
                    href={`https://wa.me/${(b.customerPhone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Halo Kak ${b.customerName}! Kami dari Trip Snorkeling Gili mengingatkan jadwal keberangkatan Anda hari ini (${b.bookingCode}) pada sesi ${b.tripSession === 'morning' ? 'Pagi 09:30' : 'Siang 13:00'}. Mohon tiba di counter dermaga 15 menit sebelum kapal bertolak ya.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      background: 'rgba(37, 211, 102, 0.15)',
                      color: '#15803d',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      textDecoration: 'none',
                    }}
                  >
                    <MessageCircle size={14} />
                    <span>WA Tamu</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Booking Follow-up Queue */}
        <div className="glass-card" style={{ padding: '24px', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ padding: '6px', borderRadius: '8px', background: '#fef3c7', color: '#d97706' }}>
                <Clock size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--primary-deep)', margin: 0 }}>
                  Antrean Booking Pending
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {pendingBookings.length} reservasi perlu konfirmasi
                </span>
              </div>
            </div>

            <NextLink href="/admin/booking" className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
              <span>Lihat Semua</span>
            </NextLink>
          </div>

          {pendingBookings.length === 0 ? (
            <div
              style={{
                padding: '30px 20px',
                textAlign: 'center',
                background: '#f0fdf4',
                borderRadius: 'var(--radius-sm)',
                border: '1px dashed #bbf7d0',
                color: '#15803d',
                fontSize: '0.88rem',
              }}
            >
              Semua reservasi telah terkonfirmasi! Tidak ada antrean pending.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pendingBookings.slice(0, 4).map((b) => (
                <div
                  key={b.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--primary-deep)', display: 'block' }}>
                      {b.customerName}
                    </strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {b.tripDate} • {b.numberOfPeople} Org • Rp {b.totalPriceIdr?.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <a
                    href={`https://wa.me/${(b.customerPhone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Halo ${b.customerName}! Kami dari Trip Snorkeling Gili Trawangan ingin mengonfirmasi pesanan trip snorkeling Anda dengan kode ${b.bookingCode} untuk tanggal ${b.tripDate}...`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      background: 'rgba(37, 211, 102, 0.15)',
                      color: '#15803d',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      textDecoration: 'none',
                    }}
                  >
                    <MessageCircle size={14} />
                    <span>Follow Up</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Bookings Full Table */}
      <div className="glass-card" style={{ padding: '24px', background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-deep)', margin: 0 }}>
              Daftar Reservasi Terbaru
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Riwayat reservasi masuk dari form website publik & walk-in
            </span>
          </div>

          <NextLink href="/admin/booking" className="btn btn-secondary btn-sm">
            <span>Lihat Semua ({totalBookings})</span>
            <ArrowRight size={14} />
          </NextLink>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama Pelanggan</th>
                <th>Paket Trip</th>
                <th>Tgl & Sesi</th>
                <th>Peserta</th>
                <th>Total</th>
                <th>Status</th>
                <th>Aksi Cepat</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 6).map((b) => (
                <tr key={b.id}>
                  <td>
                    <strong style={{ color: 'var(--primary-ocean)', fontSize: '0.85rem' }}>
                      {b.bookingCode}
                    </strong>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--primary-deep)' }}>{b.customerName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{b.customerPhone}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem' }}>{b.packageName}</span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{b.tripDate}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                      {b.tripSession || 'Pagi'}
                    </div>
                  </td>
                  <td>{b.numberOfPeople} Org</td>
                  <td>
                    <strong style={{ color: 'var(--text-main)' }}>
                      Rp {b.totalPriceIdr?.toLocaleString('id-ID')}
                    </strong>
                  </td>
                  <td>
                    <span className={`status-badge status-${b.status}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <NextLink
                        href="/admin/booking"
                        style={{
                          padding: '5px 10px',
                          borderRadius: '6px',
                          background: 'var(--primary-surface)',
                          color: 'var(--primary-ocean)',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                      >
                        Detail
                      </NextLink>
                      <a
                        href={`https://wa.me/${(b.customerPhone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Halo ${b.customerName}! Kami dari Trip Snorkeling Gili mengonfirmasi pesanan ${b.bookingCode}...`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          padding: '5px 8px',
                          borderRadius: '6px',
                          background: 'rgba(37, 211, 102, 0.15)',
                          color: '#15803d',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title="Chat WhatsApp"
                      >
                        <MessageCircle size={14} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
