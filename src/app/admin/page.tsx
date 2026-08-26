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
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const bookings = await getBookingsList();
  const packages = await getPackagesList();
  const gallery = await getGalleryList();
  const testimonials = await getTestimonialsList();
  const settings = await getSettings();

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
  const totalRevenue = bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((acc, b) => acc + (b.totalPriceIdr || 0), 0);

  const waSetting = settings.find((s) => s.key === 'whatsapp_number');
  const whatsappNumber = waSetting?.value || '6287864551234';

  return (
    <div>
      {/* Top Welcome Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--primary-deep)', marginBottom: '4px' }}>
            Dashboard Overview
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Pantau reservasi masuk, kelola paket snorkeling, dan atur konten website.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <NextLink href="/admin/paket" className="btn btn-primary btn-sm">
            <Plus size={16} />
            <span>Tambah Paket Trip</span>
          </NextLink>
          <NextLink href="/" target="_blank" className="btn btn-secondary btn-sm">
            <Eye size={16} />
            <span>Preview Web</span>
          </NextLink>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '36px',
        }}
      >
        <div className="glass-card" style={{ padding: '22px', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Reservasi
            </span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'var(--primary-surface)', color: 'var(--primary-ocean)' }}>
              <CalendarCheck size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-deep)', fontFamily: 'var(--font-heading)' }}>
            {totalBookings}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--accent-green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <TrendingUp size={13} /> {confirmedBookings} Terkonfirmasi
          </span>
        </div>

        <div className="glass-card" style={{ padding: '22px', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Booking Pending
            </span>
            <div style={{ padding: '8px', borderRadius: '10px', background: '#fef3c7', color: '#d97706' }}>
              <Clock size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#d97706', fontFamily: 'var(--font-heading)' }}>
            {pendingBookings}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
            Perlu konfirmasi WhatsApp
          </span>
        </div>

        <div className="glass-card" style={{ padding: '22px', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Paket Snorkeling Aktif
            </span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(6, 214, 160, 0.15)', color: 'var(--accent-green)' }}>
              <Package size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-deep)', fontFamily: 'var(--font-heading)' }}>
            {packages.length}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
            {packages.filter((p) => p.isFeatured).length} Paket Populer
          </span>
        </div>

        <div className="glass-card" style={{ padding: '22px', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Estimasi Omset
            </span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(0, 180, 216, 0.15)', color: 'var(--primary-ocean)' }}>
              <Sparkles size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-ocean)', fontFamily: 'var(--font-heading)' }}>
            Rp {totalRevenue.toLocaleString('id-ID')}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
            Dari booking terkonfirmasi
          </span>
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div className="glass-card" style={{ padding: '28px', background: '#ffffff', marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-deep)' }}>
              Daftar Reservasi Terbaru
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Klik tombol WhatsApp untuk follow up atau ubah status reservasi
            </span>
          </div>
          <NextLink href="/admin/booking" className="btn btn-secondary btn-sm">
            <span>Lihat Semua Booking</span>
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
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map((b) => (
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
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.tripSession || 'Pagi'}</div>
                  </td>
                  <td>{b.numberOfPeople} Org</td>
                  <td>
                    <strong style={{ color: 'var(--text-main)' }}>
                      Rp {b.totalPriceIdr.toLocaleString('id-ID')}
                    </strong>
                  </td>
                  <td>
                    <span className={`status-badge status-${b.status}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <a
                      href={`https://wa.me/${b.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Halo ${b.customerName}! Kami dari Trip Snorkeling Gili Trawangan mengonfirmasi pesanan Anda dengan kode ${b.bookingCode}...`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(37, 211, 102, 0.15)',
                        color: '#15803d',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      <MessageCircle size={14} />
                      <span>Chat WA</span>
                    </a>
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
