import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      <AdminSidebar />
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header
          style={{
            height: '70px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
          }}
        >
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Panel Manajemen Konten</span>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-deep)', margin: 0 }}>
              Trip Snorkeling Gili Trawangan
            </h4>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-surface)', color: 'var(--primary-ocean)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
              A
            </div>
            <div style={{ fontSize: '0.85rem' }}>
              <strong style={{ display: 'block', color: 'var(--primary-deep)' }}>Admin Renz</strong>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Superadmin</span>
            </div>
          </div>
        </header>

        <main style={{ padding: '32px', flexGrow: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
