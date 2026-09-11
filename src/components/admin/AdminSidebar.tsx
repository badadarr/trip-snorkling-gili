'use client';

import React from 'react';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Sparkles,
  Package,
  CalendarCheck,
  Image as ImageIcon,
  MessageSquare,
  HelpCircle,
  Info,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import BrandLogo from '@/components/common/BrandLogo';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [siteSettings, setSiteSettings] = React.useState<{ [key: string]: string }>({});

  React.useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data: any[]) => {
        const map: { [key: string]: string } = {};
        data.forEach((item) => {
          map[item.key] = item.value;
        });
        setSiteSettings(map);
      })
      .catch((e) => console.warn('Sidebar settings fetch error:', e));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const navItems = [
    { href: '/admin', label: 'Dashboard Overview', icon: LayoutDashboard, exact: true },
    { href: '/admin/booking', label: 'Daftar Booking', icon: CalendarCheck },
    { href: '/admin/paket', label: 'Kelola Paket Trip', icon: Package },
    { href: '/admin/hero', label: 'Edit Hero Banner', icon: Sparkles },
    { href: '/admin/gallery', label: 'Kelola Galeri Foto', icon: ImageIcon },
    { href: '/admin/testimoni', label: 'Kelola Testimoni', icon: MessageSquare },
    { href: '/admin/faq', label: 'Kelola FAQ', icon: HelpCircle },
    { href: '/admin/about', label: 'Kelola Tentang Kami', icon: Info },
    { href: '/admin/settings', label: 'Pengaturan Sistem', icon: Settings },
  ];

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: 'var(--primary-deep)',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
      }}
    >
      {/* Brand Header */}
      <div style={{ padding: '20px 18px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <NextLink href="/admin" style={{ display: 'block', textDecoration: 'none' }}>
          <BrandLogo
            siteName={siteSettings.site_name || "ADMIN CMS"}
            tagline={siteSettings.tagline || "Snorkeling Gili"}
            logoUrl={siteSettings.site_logo || ""}
            logoType={siteSettings.site_logo_type || "preset"}
            logoPreset={siteSettings.site_logo_preset || "waves"}
            logoColor={siteSettings.site_logo_color || "ocean"}
            variant="dark"
            size="sm"
          />
        </NextLink>
      </div>

      {/* Navigation List */}
      <nav style={{ padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '6px', flexGrow: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <NextLink
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.9rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#ffffff' : '#94a3b8',
                backgroundColor: isActive ? 'rgba(0, 180, 216, 0.2)' : 'transparent',
                border: isActive ? '1px solid rgba(0, 180, 216, 0.4)' : '1px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <Icon size={18} color={isActive ? 'var(--primary-aqua)' : '#94a3b8'} />
              <span>{item.label}</span>
            </NextLink>
          );
        })}
      </nav>

      {/* Bottom Footer Actions */}
      <div style={{ padding: '16px 14px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <NextLink
          href="/"
          target="_blank"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            color: 'var(--primary-aqua)',
            textDecoration: 'none',
          }}
        >
          <ExternalLink size={16} />
          <span>Lihat Website Live</span>
        </NextLink>

        <button
          type="button"
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            color: '#f87171',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <LogOut size={16} />
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </aside>
  );
}
