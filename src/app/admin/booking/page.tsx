'use client';

import React, { useState, useEffect } from 'react';
import { CalendarCheck, MessageCircle, Trash2, CheckCircle2, XCircle, Clock, Search, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (e) {
      console.error(e);
      toast.error('Gagal memuat data booking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    const toastId = toast.loading(`Mengubah status reservasi ke ${newStatus}...`);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Gagal memperbarui status');
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
      toast.success(`Status berhasil diubah menjadi ${newStatus}!`, { id: toastId });
    } catch (e: any) {
      toast.error(e.message || 'Gagal mengubah status', { id: toastId });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data reservasi ini?')) return;
    setDeletingId(id);
    const toastId = toast.loading('Menghapus data reservasi...');
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus');
      setBookings((prev) => prev.filter((b) => b.id !== id));
      toast.success('Data reservasi berhasil dihapus!', { id: toastId });
    } catch (e: any) {
      toast.error(e.message || 'Gagal menghapus', { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerPhone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--primary-deep)', marginBottom: '4px' }}>
            Kelola Daftar Reservasi Booking
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Daftar lengkap pemesanan trip yang masuk melalui form website.
          </p>
        </div>
        <button type="button" onClick={fetchBookings} className="btn btn-secondary btn-sm">
          <RefreshCw size={15} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div
        className="glass-card"
        style={{
          padding: '16px 20px',
          background: '#ffffff',
          marginBottom: '24px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Cari berdasarkan nama, kode booking, nomor telepon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '16px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'pending', 'confirmed', 'cancelled'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                border: statusFilter === st ? '1px solid var(--primary-ocean)' : '1px solid var(--border-light)',
                background: statusFilter === st ? 'var(--primary-ocean)' : '#ffffff',
                color: statusFilter === st ? '#ffffff' : 'var(--text-main)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {st === 'all' ? 'Semua Status' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="glass-card" style={{ padding: '0', background: '#ffffff', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama Pelanggan</th>
                <th>Paket</th>
                <th>Tgl & Sesi</th>
                <th>Peserta</th>
                <th>Total Biaya</th>
                <th>Catatan / Lokasi</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '40px' }}>
                    Memuat data reservasi...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    Tidak ada data reservasi yang sesuai.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <strong style={{ color: 'var(--primary-ocean)', fontSize: '0.88rem' }}>
                        {b.bookingCode}
                      </strong>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--primary-deep)' }}>{b.customerName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{b.customerPhone}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{b.customerEmail}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.88rem' }}>{b.packageName}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{b.tripDate}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{b.tripSession}</div>
                    </td>
                    <td>
                      <strong>{b.numberOfPeople}</strong> Org
                    </td>
                    <td>
                      <strong style={{ color: 'var(--primary-deep)' }}>
                        Rp {b.totalPriceIdr?.toLocaleString('id-ID')}
                      </strong>
                    </td>
                    <td style={{ maxWidth: '180px' }}>
                      {b.pickupLocation && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--primary-ocean)' }}>
                          📍 {b.pickupLocation}
                        </div>
                      )}
                      {b.specialRequests && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          "{b.specialRequests}"
                        </div>
                      )}
                    </td>
                    <td>
                      <select
                        value={b.status}
                        onChange={(e) => handleUpdateStatus(b.id, e.target.value)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          border: '1px solid var(--border-light)',
                          background: b.status === 'confirmed' ? '#d1fae5' : b.status === 'pending' ? '#fef3c7' : '#fee2e2',
                          color: b.status === 'confirmed' ? '#065f46' : b.status === 'pending' ? '#b45309' : '#b91c1c',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <a
                          href={`https://wa.me/${b.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Halo ${b.customerName}! Kami dari Trip Snorkeling Gili Trawangan ingin mengonfirmasi booking Anda (${b.bookingCode}) pada tanggal ${b.tripDate}...`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            background: 'rgba(37, 211, 102, 0.15)',
                            color: '#15803d',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          title="Chat via WhatsApp"
                        >
                          <MessageCircle size={15} />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDelete(b.id)}
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            background: '#fee2e2',
                            color: '#b91c1c',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          title="Hapus Reservasi"
                        >
                          <Trash2 size={15} />
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
    </div>
  );
}
