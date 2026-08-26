'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Printer,
  Download,
  Copy,
  Layout,
  Check,
  FileCode,
  Calendar,
  Clock,
  Ship,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  ManifestBookingItem,
  ManifestSettings,
  DEFAULT_MANIFEST_SETTINGS,
  generateManifestHtml,
} from '@/lib/manifestTemplate';

interface ManifestModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: ManifestBookingItem[];
  currentDateFilter?: string;
  currentSessionFilter?: string;
}

export default function ManifestModal({
  isOpen,
  onClose,
  bookings,
  currentDateFilter = 'all',
  currentSessionFilter = 'all',
}: ManifestModalProps) {
  const [settings, setSettings] = useState<ManifestSettings>(DEFAULT_MANIFEST_SETTINGS);
  const [preset, setPreset] = useState<'modern' | 'compact' | 'official' | 'custom'>('modern');
  const [boatName, setBoatName] = useState('Glass Bottom Boat - Dolphin 01');
  const [captainName, setCaptainName] = useState('Kapten Rahman / Pemandu Budi');
  const [filterDate, setFilterDate] = useState(currentDateFilter);
  const [filterSession, setFilterSession] = useState(currentSessionFilter);
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Fetch settings from API
  useEffect(() => {
    if (!isOpen) return;

    fetch('/api/settings')
      .then((res) => res.json())
      .then((data: any[]) => {
        if (!Array.isArray(data)) return;
        const map: { [key: string]: string } = {};
        data.forEach((item) => {
          map[item.key] = item.value;
        });

        const loadedSettings: ManifestSettings = {
          companyName: map['manifest_company_name'] || DEFAULT_MANIFEST_SETTINGS.companyName,
          subheader: map['manifest_subheader'] || DEFAULT_MANIFEST_SETTINGS.subheader,
          phone: map['manifest_contact_info'] || map['phone'] || DEFAULT_MANIFEST_SETTINGS.phone,
          email: map['email'] || DEFAULT_MANIFEST_SETTINGS.email,
          address: map['address'] || DEFAULT_MANIFEST_SETTINGS.address,
          defaultBoat: map['manifest_default_boat'] || DEFAULT_MANIFEST_SETTINGS.defaultBoat,
          defaultCaptain: map['manifest_default_captain'] || DEFAULT_MANIFEST_SETTINGS.defaultCaptain,
          footerNotes: map['manifest_footer_notes'] || DEFAULT_MANIFEST_SETTINGS.footerNotes,
          showEquipmentChecklist: map['manifest_show_equipment_checklist'] !== 'false',
          showPickupNotes: map['manifest_show_pickup_notes'] !== 'false',
          showPrices: map['manifest_show_prices'] !== 'false',
          customHtmlTemplate: map['manifest_custom_html_template'] || DEFAULT_MANIFEST_SETTINGS.customHtmlTemplate,
          preset: (map['manifest_default_preset'] as any) || 'modern',
        };

        setSettings(loadedSettings);
        setPreset(loadedSettings.preset || 'modern');
        if (loadedSettings.defaultBoat) setBoatName(loadedSettings.defaultBoat);
        if (loadedSettings.defaultCaptain) setCaptainName(loadedSettings.defaultCaptain);
      })
      .catch((e) => {
        console.error('Failed to fetch manifest settings', e);
      });
  }, [isOpen]);

  useEffect(() => {
    setFilterDate(currentDateFilter);
    setFilterSession(currentSessionFilter);
  }, [currentDateFilter, currentSessionFilter]);

  if (!isOpen) return null;

  // Filter bookings according to active modal filters
  const filteredBookings = bookings.filter((b) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Date
    let matchesDate = true;
    if (filterDate === 'today') {
      matchesDate = b.tripDate === todayStr;
    } else if (filterDate === 'tomorrow') {
      matchesDate = b.tripDate === tomorrowStr;
    } else if (filterDate !== 'all') {
      matchesDate = b.tripDate === filterDate;
    }

    // Session
    const matchesSession = filterSession === 'all' || b.tripSession === filterSession;

    return matchesDate && matchesSession;
  });

  const generatedHtml = generateManifestHtml({
    bookings: filteredBookings,
    filterDate: filterDate,
    filterSession: filterSession,
    boatName: boatName,
    captainName: captainName,
    settings: settings,
    presetOverride: preset,
  });

  // Action: Print / Save to PDF
  const handlePrint = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.focus();
        iframeRef.current.contentWindow.print();
      } catch (err) {
        // Fallback open window
        const win = window.open('', '_blank');
        if (win) {
          win.document.write(generatedHtml);
          win.document.close();
          win.focus();
          win.print();
        }
      }
    }
  };

  // Action: Download HTML file
  const handleDownloadHtml = () => {
    const blob = new Blob([generatedHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const todayStr = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `manifest-snorkeling-${preset}-${filterDate || 'all'}-${todayStr}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('File template HTML manifest berhasil diunduh!');
  };

  // Action: Copy HTML
  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(generatedHtml);
      setCopied(true);
      toast.success('Kode HTML manifest berhasil disalin ke clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      toast.error('Gagal menyalin HTML');
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(10, 25, 47, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '1200px',
          height: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f0f9ff 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'var(--primary-ocean)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Printer size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-deep)', margin: 0 }}>
                Cetak & Ekspor Manifest Tamu (PDF / HTML)
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                Pilih preset layout, sesuaikan nama armada/kapten, cetak ke PDF atau simpan template .html
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Toolbar & Controls */}
        <div
          style={{
            padding: '12px 24px',
            background: '#ffffff',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            gap: '14px',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          {/* Preset Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-navy)' }}>
              Preset Desain:
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[
                { id: 'modern', label: 'Modern Ocean', icon: Sparkles },
                { id: 'compact', label: 'Dermaga Compact', icon: Layout },
                { id: 'official', label: 'Resmi Operator', icon: UserCheck },
                { id: 'custom', label: 'Custom HTML', icon: FileCode },
              ].map((p) => {
                const isSelected = preset === p.id;
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPreset(p.id as any)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: isSelected ? '1px solid var(--primary-ocean)' : '1px solid var(--border-light)',
                      background: isSelected ? 'var(--primary-ocean)' : '#ffffff',
                      color: isSelected ? '#ffffff' : 'var(--text-main)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <Icon size={13} />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Boat & Captain Quick Inputs */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Ship size={14} color="var(--primary-ocean)" />
              <input
                type="text"
                placeholder="Nama Perahu"
                value={boatName}
                onChange={(e) => setBoatName(e.target.value)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-light)',
                  fontSize: '0.8rem',
                  width: '180px',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <UserCheck size={14} color="var(--primary-ocean)" />
              <input
                type="text"
                placeholder="Nama Kapten / Guide"
                value={captainName}
                onChange={(e) => setCaptainName(e.target.value)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-light)',
                  fontSize: '0.8rem',
                  width: '180px',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} color="var(--primary-ocean)" />
              <select
                value={filterSession}
                onChange={(e) => setFilterSession(e.target.value)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-light)',
                  fontSize: '0.8rem',
                }}
              >
                <option value="all">Semua Sesi</option>
                <option value="morning">Pagi (09:30)</option>
                <option value="afternoon">Siang (13:00)</option>
                <option value="sunset">Sunset (16:00)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Document Preview */}
        <div
          style={{
            flex: 1,
            background: '#64748b',
            padding: '16px',
            overflow: 'auto',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <iframe
            ref={iframeRef}
            srcDoc={generatedHtml}
            title="Manifest Preview"
            style={{
              width: preset === 'compact' ? '760px' : '1000px',
              maxWidth: '100%',
              minHeight: '650px',
              height: '100%',
              background: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
            }}
          />
        </div>

        {/* Bottom Actions Bar */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--border-light)',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Menampilkan <strong>{filteredBookings.length}</strong> reservasi (
            <strong>
              {filteredBookings.reduce((sum, b) => sum + (b.numberOfPeople || 1), 0)}
            </strong>{' '}
            penumpang)
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={handleCopyHtml}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {copied ? <Check size={15} color="var(--accent-green)" /> : <Copy size={15} />}
              <span>{copied ? 'Tersalin!' : 'Salin HTML'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadHtml}
              className="btn btn-secondary btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                borderColor: 'var(--primary-turquoise)',
                color: 'var(--primary-ocean)',
              }}
            >
              <Download size={15} />
              <span>Unduh Template .HTML</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px' }}
            >
              <Printer size={16} />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
