export interface ManifestSettings {
  companyName?: string;
  subheader?: string;
  phone?: string;
  email?: string;
  address?: string;
  defaultBoat?: string;
  defaultCaptain?: string;
  footerNotes?: string;
  showEquipmentChecklist?: boolean;
  showPickupNotes?: boolean;
  showPrices?: boolean;
  customHtmlTemplate?: string;
  preset?: 'modern' | 'compact' | 'official' | 'custom';
}

export interface ManifestBookingItem {
  id: number;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  packageName: string;
  tripDate: string;
  tripSession: string;
  numberOfPeople: number;
  totalPriceIdr: number;
  status: string;
  pickupLocation?: string | null;
  specialRequests?: string | null;
  createdAt?: string | Date;
}

export interface GenerateManifestOptions {
  bookings: ManifestBookingItem[];
  filterDate?: string;
  filterSession?: string;
  boatName?: string;
  captainName?: string;
  settings?: ManifestSettings;
  presetOverride?: 'modern' | 'compact' | 'official' | 'custom';
}

export const DEFAULT_MANIFEST_SETTINGS: ManifestSettings = {
  companyName: 'TRIP SNORKELING GILI TRAWANGAN',
  subheader: 'Layanan Wisata Snorkeling Terpercaya 3 Gili (Trawangan, Meno, Air)',
  phone: '+62 859-2135-8615 / 6287864551234',
  email: 'info@snorkelinggilitrawangan.com',
  address: 'Jl. Pantai Gili Trawangan (Meeting Point Dermaga Utama), Desa Gili Indah, Lombok Utara',
  defaultBoat: 'Glass Bottom Boat - Dolphin 01',
  defaultCaptain: 'Kapten Rahman / Pemandu Budi',
  footerNotes:
    'PERHATIAN & KESELAMATAN: Seluruh tamu wajib mengenakan life jacket / pelampung selama kapal berlayar. Dilarang menginjak karang dan menyentuh penyu. Simpan barang berharga di tas waterproof. Hubungi kru jika memerlukan bantuan.',
  showEquipmentChecklist: true,
  showPickupNotes: true,
  showPrices: true,
  preset: 'modern',
  customHtmlTemplate: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Manifest Keberangkatan - {{companyName}}</title>
  <style>
    @page { size: A4 landscape; margin: 12mm; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; margin: 0; padding: 0; font-size: 12px; }
    .header { border-bottom: 2px solid #0284c7; padding-bottom: 10px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: flex-start; }
    .title { font-size: 18px; font-weight: 800; color: #0369a1; text-transform: uppercase; margin: 0; }
    .sub { font-size: 11px; color: #64748b; margin-top: 3px; }
    .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 6px; padding: 10px; margin-bottom: 15px; font-size: 11.5px; }
    .meta-item strong { color: #0369a1; display: block; font-size: 10px; text-transform: uppercase; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
    th { background: #0284c7; color: white; text-align: left; padding: 7px 8px; font-size: 11px; border: 1px solid #0284c7; }
    td { padding: 6px 8px; border: 1px solid #cbd5e1; font-size: 11px; vertical-align: middle; }
    tr:nth-child(even) { background: #f8fafc; }
    .status-badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 9.5px; text-transform: uppercase; }
    .status-confirmed { background: #dcfce7; color: #166534; }
    .status-pending { background: #fef3c7; color: #92400e; }
    .footer { margin-top: 20px; font-size: 10.5px; color: #475569; }
    .sign-grid { display: flex; justify-content: space-between; margin-top: 25px; page-break-inside: avoid; }
    .sign-box { width: 200px; text-align: center; border-top: 1px solid #94a3b8; padding-top: 6px; font-size: 11px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="title">{{companyName}}</h1>
      <div class="sub">{{subheader}}</div>
      <div class="sub">{{address}} | Telp: {{phone}}</div>
    </div>
    <div style="text-align: right;">
      <div style="font-size: 14px; font-weight: 800; color: #0284c7;">MANIFEST PENUMPANG</div>
      <div class="sub">Dicetak: {{printDate}}</div>
    </div>
  </div>

  <div class="meta-grid">
    <div class="meta-item"><strong>Tanggal Trip</strong>{{tripDate}}</div>
    <div class="meta-item"><strong>Sesi Keberangkatan</strong>{{tripSession}}</div>
    <div class="meta-item"><strong>Nama Perahu</strong>{{boatName}}</div>
    <div class="meta-item"><strong>Kapten / Pemandu</strong>{{captainName}}</div>
  </div>

  {{bookingsTable}}

  <div style="background: #f1f5f9; padding: 8px 12px; border-radius: 4px; font-size: 10px; color: #475569; margin-top: 10px;">
    <strong>Catatan & Keselamatan:</strong> {{footerNotes}}
  </div>

  <div class="sign-grid">
    <div>
      <div style="height: 45px;"></div>
      <div class="sign-box">Petugas Dermaga / Counter</div>
    </div>
    <div>
      <div style="height: 45px;"></div>
      <div class="sign-box">Kapten Kapal ({{captainName}})</div>
    </div>
  </div>
</body>
</html>`,
};

function formatSessionLabel(s: string) {
  if (s === 'morning') return 'Pagi (09:30 WITA)';
  if (s === 'afternoon') return 'Siang (13:00 WITA)';
  if (s === 'sunset') return 'Sunset (16:00 WITA)';
  if (s === 'all') return 'Semua Sesi';
  return s;
}

export function generateManifestHtml(options: GenerateManifestOptions): string {
  const mergedSettings: ManifestSettings = {
    ...DEFAULT_MANIFEST_SETTINGS,
    ...(options.settings || {}),
  };

  const selectedPreset = options.presetOverride || mergedSettings.preset || 'modern';
  const bookings = options.bookings || [];
  const totalPax = bookings.reduce((sum, b) => sum + (b.numberOfPeople || 1), 0);
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPriceIdr || 0), 0);
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;

  const boatName = options.boatName || mergedSettings.defaultBoat || 'Glass Bottom Boat - Dolphin 01';
  const captainName = options.captainName || mergedSettings.defaultCaptain || 'Kapten Rahman / Pemandu Budi';
  const tripDate = options.filterDate && options.filterDate !== 'all' ? options.filterDate : 'Semua Tanggal';
  const tripSession = formatSessionLabel(options.filterSession || 'all');
  const printDate = new Date().toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  // If custom preset, use customHtmlTemplate and replace tokens
  if (selectedPreset === 'custom' && mergedSettings.customHtmlTemplate) {
    const tableHtml = generateTableRowsHtml(bookings, mergedSettings);
    let html = mergedSettings.customHtmlTemplate;
    html = html.replace(/{{companyName}}/g, escapeHtml(mergedSettings.companyName || ''));
    html = html.replace(/{{subheader}}/g, escapeHtml(mergedSettings.subheader || ''));
    html = html.replace(/{{phone}}/g, escapeHtml(mergedSettings.phone || ''));
    html = html.replace(/{{email}}/g, escapeHtml(mergedSettings.email || ''));
    html = html.replace(/{{address}}/g, escapeHtml(mergedSettings.address || ''));
    html = html.replace(/{{tripDate}}/g, escapeHtml(tripDate));
    html = html.replace(/{{tripSession}}/g, escapeHtml(tripSession));
    html = html.replace(/{{boatName}}/g, escapeHtml(boatName));
    html = html.replace(/{{captainName}}/g, escapeHtml(captainName));
    html = html.replace(/{{totalPax}}/g, String(totalPax));
    html = html.replace(/{{totalBookings}}/g, String(bookings.length));
    html = html.replace(/{{totalRevenue}}/g, `Rp ${totalRevenue.toLocaleString('id-ID')}`);
    html = html.replace(/{{footerNotes}}/g, escapeHtml(mergedSettings.footerNotes || ''));
    html = html.replace(/{{printDate}}/g, escapeHtml(printDate));
    html = html.replace(/{{bookingsTable}}/g, tableHtml);
    return html;
  }

  if (selectedPreset === 'compact') {
    return generateCompactPresetHtml({
      bookings,
      mergedSettings,
      tripDate,
      tripSession,
      boatName,
      captainName,
      totalPax,
      printDate,
    });
  }

  if (selectedPreset === 'official') {
    return generateOfficialPresetHtml({
      bookings,
      mergedSettings,
      tripDate,
      tripSession,
      boatName,
      captainName,
      totalPax,
      totalRevenue,
      confirmedCount,
      pendingCount,
      printDate,
    });
  }

  // Default: 'modern'
  return generateModernPresetHtml({
    bookings,
    mergedSettings,
    tripDate,
    tripSession,
    boatName,
    captainName,
    totalPax,
    totalRevenue,
    confirmedCount,
    pendingCount,
    printDate,
  });
}

function escapeHtml(str: string) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateTableRowsHtml(bookings: ManifestBookingItem[], settings: ManifestSettings): string {
  if (bookings.length === 0) {
    return `<table><thead><tr><th>No</th><th>Kode</th><th>Nama Tamu</th><th>No. HP</th><th>Paket</th><th>Pax</th><th>Status</th></tr></thead><tbody><tr><td colspan="7" style="text-align:center; padding: 20px; color: #64748b;">Tidak ada data reservasi.</td></tr></tbody></table>`;
  }

  const rows = bookings
    .map((b, index) => {
      const statusClass = b.status === 'confirmed' ? 'status-confirmed' : 'status-pending';
      const statusLabel = b.status === 'confirmed' ? 'Terkonfirmasi' : b.status === 'completed' ? 'Selesai' : b.status === 'cancelled' ? 'Batal' : 'Pending';

      return `<tr>
        <td style="text-align: center; width: 30px;">${index + 1}</td>
        <td style="font-weight: 700; font-family: monospace; color: #0369a1;">${escapeHtml(b.bookingCode)}</td>
        <td>
          <div style="font-weight: 600; color: #0f172a;">${escapeHtml(b.customerName)}</div>
          <div style="font-size: 10px; color: #64748b;">${escapeHtml(b.customerPhone)}</div>
        </td>
        <td>${escapeHtml(b.packageName)}</td>
        <td style="text-align: center;">${formatSessionLabel(b.tripSession)}</td>
        <td style="text-align: center; font-weight: 700;">${b.numberOfPeople} Org</td>
        ${settings.showPrices ? `<td style="text-align: right; font-weight: 600;">Rp ${(b.totalPriceIdr || 0).toLocaleString('id-ID')}</td>` : ''}
        ${settings.showPickupNotes ? `<td style="font-size: 10px;">${escapeHtml(b.pickupLocation || '-')}${b.specialRequests ? `<br><em style="color:#0369a1;">Req: ${escapeHtml(b.specialRequests)}</em>` : ''}</td>` : ''}
        ${settings.showEquipmentChecklist ? `<td style="text-align: center; font-size: 10px; color: #64748b;">[ &nbsp; ] Mask [ &nbsp; ] Fin</td>` : ''}
        <td style="text-align: center;"><span class="status-badge ${statusClass}">${statusLabel}</span></td>
      </tr>`;
    })
    .join('');

  return `<table>
    <thead>
      <tr>
        <th>No</th>
        <th>Kode</th>
        <th>Nama Tamu</th>
        <th>Paket Snorkeling</th>
        <th>Sesi</th>
        <th>Pax</th>
        ${settings.showPrices ? '<th>Total Biaya</th>' : ''}
        ${settings.showPickupNotes ? '<th>Pickup & Catatan</th>' : ''}
        ${settings.showEquipmentChecklist ? '<th>Alat Snorkel</th>' : ''}
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>`;
}

// -------------------------------------------------------------
// PRESET 1: MODERN OCEAN (LANDSCAPE)
// -------------------------------------------------------------
function generateModernPresetHtml(data: {
  bookings: ManifestBookingItem[];
  mergedSettings: ManifestSettings;
  tripDate: string;
  tripSession: string;
  boatName: string;
  captainName: string;
  totalPax: number;
  totalRevenue: number;
  confirmedCount: number;
  pendingCount: number;
  printDate: string;
}) {
  const { bookings, mergedSettings, tripDate, tripSession, boatName, captainName, totalPax, totalRevenue, printDate } = data;

  const rows = bookings
    .map((b, idx) => {
      const isConfirmed = b.status === 'confirmed';
      const statusColor = isConfirmed ? '#166534' : '#92400e';
      const statusBg = isConfirmed ? '#dcfce7' : '#fef3c7';

      return `<tr>
        <td style="text-align:center; font-weight: 600; color: #475569;">${idx + 1}</td>
        <td style="font-family: monospace; font-weight: 700; color: #0284c7;">${escapeHtml(b.bookingCode)}</td>
        <td>
          <div style="font-weight: 700; color: #0f172a; font-size: 11.5px;">${escapeHtml(b.customerName)}</div>
          <div style="font-size: 10px; color: #64748b;">${escapeHtml(b.customerPhone)}</div>
        </td>
        <td style="font-size: 11px;">${escapeHtml(b.packageName)}</td>
        <td style="text-align:center; font-size: 10.5px;">${formatSessionLabel(b.tripSession)}</td>
        <td style="text-align:center; font-size: 12px; font-weight: 800; color: #0369a1;">${b.numberOfPeople}</td>
        ${mergedSettings.showPrices ? `<td style="text-align:right; font-weight: 600; font-size: 11px;">Rp ${(b.totalPriceIdr || 0).toLocaleString('id-ID')}</td>` : ''}
        ${mergedSettings.showPickupNotes ? `<td style="font-size: 10px; color: #334155;">${escapeHtml(b.pickupLocation || 'Meeting Point Dermaga')}${b.specialRequests ? `<div style="color: #0284c7; font-style: italic; margin-top: 2px;">Catatan: ${escapeHtml(b.specialRequests)}</div>` : ''}</td>` : ''}
        ${
          mergedSettings.showEquipmentChecklist
            ? `<td style="text-align:center; font-size: 9.5px; color: #475569;">
            <span style="border: 1px solid #94a3b8; padding: 1px 4px; border-radius: 3px; margin-right: 2px;">M: [ &nbsp; ]</span>
            <span style="border: 1px solid #94a3b8; padding: 1px 4px; border-radius: 3px;">F: [ &nbsp; ]</span>
          </td>`
            : ''
        }
        <td style="text-align:center;">
          <span style="background: ${statusBg}; color: ${statusColor}; padding: 2px 7px; border-radius: 4px; font-size: 9.5px; font-weight: 700; text-transform: uppercase;">
            ${b.status}
          </span>
        </td>
        <td style="text-align:center; color: #cbd5e1; font-size: 10px; width: 45px;">[ &nbsp;&nbsp;&nbsp;&nbsp; ]</td>
      </tr>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Manifest Trip Snorkeling - ${escapeHtml(tripDate)}</title>
  <style>
    @page { size: A4 landscape; margin: 10mm 12mm 10mm 12mm; }
    * { box-sizing: border-box; }
    body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; margin: 0; padding: 0; font-size: 11.5px; background: #ffffff; line-height: 1.4; }
    .doc-container { width: 100%; }
    .header-bar { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2.5px solid #0284c7; padding-bottom: 12px; margin-bottom: 14px; }
    .brand-title { font-size: 20px; font-weight: 900; color: #075985; text-transform: uppercase; letter-spacing: 0.5px; margin: 0; }
    .brand-sub { font-size: 11px; color: #0284c7; font-weight: 600; margin-top: 2px; }
    .brand-addr { font-size: 10px; color: #64748b; margin-top: 3px; }
    .doc-badge { text-align: right; }
    .doc-title { font-size: 16px; font-weight: 800; color: #0f172a; text-transform: uppercase; background: #f0f9ff; border: 1px solid #bae6fd; padding: 4px 12px; border-radius: 6px; display: inline-block; }
    .doc-meta { font-size: 10px; color: #64748b; margin-top: 4px; }
    
    .kpi-cards { display: grid; grid-template-columns: 1.2fr 1.2fr 1.5fr 1.5fr 1fr ${mergedSettings.showPrices ? '1.3fr' : ''}; gap: 8px; margin-bottom: 14px; }
    .kpi-item { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 10px; }
    .kpi-label { font-size: 9px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px; }
    .kpi-val { font-size: 12px; font-weight: 800; color: #0369a1; }

    table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
    th { background: #0284c7; color: #ffffff; text-align: left; padding: 6px 8px; font-size: 10.5px; font-weight: 700; border: 1px solid #0284c7; text-transform: uppercase; }
    td { padding: 5px 8px; border: 1px solid #cbd5e1; font-size: 10.5px; vertical-align: middle; }
    tr:nth-child(even) { background: #f8fafc; }

    .footer-section { margin-top: 14px; page-break-inside: avoid; }
    .rules-box { background: #f1f5f9; border-left: 3px solid #0284c7; padding: 6px 10px; font-size: 9.5px; color: #334155; margin-bottom: 14px; border-radius: 0 4px 4px 0; }
    .sign-table { width: 100%; border: none; margin-top: 10px; }
    .sign-table td { border: none; padding: 0; vertical-align: top; background: transparent; }
    .sign-card { width: 220px; text-align: center; }
    .sign-line { border-bottom: 1px solid #94a3b8; height: 48px; margin-bottom: 4px; }
    .sign-title { font-size: 10.5px; font-weight: 700; color: #0f172a; }
    .sign-sub { font-size: 9.5px; color: #64748b; }

    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="doc-container">
    <div class="header-bar">
      <div>
        <h1 class="brand-title">${escapeHtml(mergedSettings.companyName || 'TRIP SNORKELING GILI TRAWANGAN')}</h1>
        <div class="brand-sub">${escapeHtml(mergedSettings.subheader || '')}</div>
        <div class="brand-addr">${escapeHtml(mergedSettings.address || '')} | WA: ${escapeHtml(mergedSettings.phone || '')}</div>
      </div>
      <div class="doc-badge">
        <div class="doc-title">MANIFEST KEBERANGKATAN</div>
        <div class="doc-meta">Waktu Cetak: ${printDate}</div>
      </div>
    </div>

    <div class="kpi-cards">
      <div class="kpi-item">
        <span class="kpi-label">Tanggal Trip</span>
        <span class="kpi-val">${escapeHtml(tripDate)}</span>
      </div>
      <div class="kpi-item">
        <span class="kpi-label">Sesi Jam</span>
        <span class="kpi-val">${escapeHtml(tripSession)}</span>
      </div>
      <div class="kpi-item">
        <span class="kpi-label">Perahu / Boat</span>
        <span class="kpi-val">${escapeHtml(boatName)}</span>
      </div>
      <div class="kpi-item">
        <span class="kpi-label">Kapten / Guide</span>
        <span class="kpi-val">${escapeHtml(captainName)}</span>
      </div>
      <div class="kpi-item" style="background: #e0f2fe; border-color: #7dd3fc;">
        <span class="kpi-label" style="color: #0369a1;">Total Penumpang</span>
        <span class="kpi-val" style="color: #0c4a6e; font-size: 14px;">${totalPax} Org (${bookings.length} Booking)</span>
      </div>
      ${
        mergedSettings.showPrices
          ? `<div class="kpi-item">
        <span class="kpi-label">Total Omset</span>
        <span class="kpi-val">Rp ${totalRevenue.toLocaleString('id-ID')}</span>
      </div>`
          : ''
      }
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 25px; text-align: center;">No</th>
          <th style="width: 80px;">Kode</th>
          <th>Nama Tamu & No. Kontak</th>
          <th>Paket Trip</th>
          <th style="width: 80px; text-align: center;">Sesi</th>
          <th style="width: 45px; text-align: center;">Pax</th>
          ${mergedSettings.showPrices ? '<th style="width: 85px; text-align: right;">Total Biaya</th>' : ''}
          ${mergedSettings.showPickupNotes ? '<th>Lokasi Pickup / Catatan</th>' : ''}
          ${mergedSettings.showEquipmentChecklist ? '<th style="width: 90px; text-align: center;">Ukuran Alat</th>' : ''}
          <th style="width: 75px; text-align: center;">Status</th>
          <th style="width: 45px; text-align: center;">Check</th>
        </tr>
      </thead>
      <tbody>
        ${rows || '<tr><td colspan="11" style="text-align:center; padding: 20px;">Tidak ada penumpang terdaftar untuk filter ini.</td></tr>'}
      </tbody>
    </table>

    <div class="footer-section">
      <div class="rules-box">
        <strong>Standar Operasional & Keselamatan Tamu:</strong> ${escapeHtml(mergedSettings.footerNotes || '')}
      </div>

      <table class="sign-table">
        <tr>
          <td style="width: 33%;">
            <div class="sign-card">
              <div class="sign-sub">Petugas Counter Dermaga</div>
              <div class="sign-line"></div>
              <div class="sign-title">( ___________________ )</div>
            </div>
          </td>
          <td style="width: 33%; text-align: center;">
            <div class="sign-card" style="margin: 0 auto;">
              <div class="sign-sub">Kapten Perahu Snorkeling</div>
              <div class="sign-line"></div>
              <div class="sign-title">${escapeHtml(captainName)}</div>
            </div>
          </td>
          <td style="width: 33%; text-align: right;">
            <div class="sign-card" style="margin-left: auto;">
              <div class="sign-sub">Pengawas Pelabuhan / Syahbandar</div>
              <div class="sign-line"></div>
              <div class="sign-title">( ___________________ )</div>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</body>
</html>`;
}

// -------------------------------------------------------------
// PRESET 2: DERMAGA CHECK-IN COMPACT (PORT CREW)
// -------------------------------------------------------------
function generateCompactPresetHtml(data: {
  bookings: ManifestBookingItem[];
  mergedSettings: ManifestSettings;
  tripDate: string;
  tripSession: string;
  boatName: string;
  captainName: string;
  totalPax: number;
  printDate: string;
}) {
  const { bookings, mergedSettings, tripDate, tripSession, boatName, captainName, totalPax, printDate } = data;

  const rows = bookings
    .map(
      (b, idx) => `<tr>
      <td style="text-align:center; font-weight: bold; width: 25px;">${idx + 1}</td>
      <td style="font-family: monospace; font-weight: 700; width: 75px;">${escapeHtml(b.bookingCode)}</td>
      <td>
        <strong>${escapeHtml(b.customerName)}</strong>
        <span style="color: #64748b; font-size: 9.5px; margin-left: 4px;">(${escapeHtml(b.customerPhone)})</span>
      </td>
      <td style="font-size: 10px;">${escapeHtml(b.packageName)}</td>
      <td style="text-align:center; font-weight: bold; font-size: 11px;">${b.numberOfPeople} Org</td>
      <td style="font-size: 9.5px;">${escapeHtml(b.pickupLocation || 'Counter')}</td>
      <td style="font-size: 9.5px; color: #0284c7;">${escapeHtml(b.specialRequests || '-')}</td>
      <td style="text-align:center; width: 60px;">[ &nbsp;&nbsp; ]</td>
      <td style="text-align:center; width: 60px;">[ &nbsp;&nbsp; ]</td>
      <td style="text-align:center; width: 60px;">[ &nbsp;&nbsp; ]</td>
    </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Checklist Dermaga - ${escapeHtml(tripDate)}</title>
  <style>
    @page { size: A4 portrait; margin: 8mm; }
    body { font-family: Arial, sans-serif; font-size: 10.5px; color: #000; margin: 0; padding: 0; line-height: 1.2; }
    .header { border-bottom: 2px solid #000; padding-bottom: 5px; margin-bottom: 8px; display: flex; justify-content: space-between; }
    .title { font-size: 15px; font-weight: bold; margin: 0; }
    .meta-box { border: 1px solid #000; padding: 5px 8px; margin-bottom: 8px; font-size: 10.5px; display: flex; justify-content: space-between; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #000; padding: 4px 5px; font-size: 10px; }
    th { background: #f0f0f0; text-align: left; }
    .footer { margin-top: 15px; display: flex; justify-content: space-between; }
    .sign { width: 180px; text-align: center; border-top: 1px solid #000; padding-top: 3px; font-weight: bold; margin-top: 30px; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="title">${escapeHtml(mergedSettings.companyName || 'TRIP SNORKELING GILI')} — CHECKLIST DERMAGA</div>
      <div style="font-size: 9.5px;">Telp: ${escapeHtml(mergedSettings.phone || '')} | Cetak: ${printDate}</div>
    </div>
    <div style="text-align: right; font-weight: bold;">
      <div>TOTAL: ${totalPax} PENUMPANG</div>
      <div>${bookings.length} BOOKING</div>
    </div>
  </div>

  <div class="meta-box">
    <div>TGL: ${escapeHtml(tripDate)}</div>
    <div>SESI: ${escapeHtml(tripSession)}</div>
    <div>BOAT: ${escapeHtml(boatName)}</div>
    <div>KAPTEN: ${escapeHtml(captainName)}</div>
  </div>

  <table>
    <thead>
      <tr>
        <th>No</th>
        <th>Kode</th>
        <th>Nama Tamu (No. HP)</th>
        <th>Paket</th>
        <th>Pax</th>
        <th>Pickup Point</th>
        <th>Catatan</th>
        <th style="text-align:center;">Hadir</th>
        <th style="text-align:center;">Masker</th>
        <th style="text-align:center;">Pelampung</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <div class="footer">
    <div>
      <div style="font-size: 9px; max-width: 450px;">
        *Pastikan setiap penumpang telah mengisi absensi hadir dan menerima perlengkapan snorkeling sebelum naik perahu.
      </div>
    </div>
    <div class="sign">
      Kru / Kapten Pelaksana
    </div>
  </div>
</body>
</html>`;
}

// -------------------------------------------------------------
// PRESET 3: OFFICIAL TOUR OPERATOR SHEET (FORMAL LETTERHEAD)
// -------------------------------------------------------------
function generateOfficialPresetHtml(data: {
  bookings: ManifestBookingItem[];
  mergedSettings: ManifestSettings;
  tripDate: string;
  tripSession: string;
  boatName: string;
  captainName: string;
  totalPax: number;
  totalRevenue: number;
  confirmedCount: number;
  pendingCount: number;
  printDate: string;
}) {
  const { bookings, mergedSettings, tripDate, tripSession, boatName, captainName, totalPax, totalRevenue, printDate } = data;

  const rows = bookings
    .map(
      (b, idx) => `<tr>
      <td style="text-align: center;">${idx + 1}</td>
      <td style="font-family: monospace; font-weight: bold;">${escapeHtml(b.bookingCode)}</td>
      <td><strong>${escapeHtml(b.customerName)}</strong><br><span style="font-size: 9.5px; color: #555;">${escapeHtml(b.customerPhone)}</span></td>
      <td>${escapeHtml(b.packageName)}</td>
      <td style="text-align: center;">${b.numberOfPeople} Org</td>
      ${mergedSettings.showPrices ? `<td style="text-align: right;">Rp ${(b.totalPriceIdr || 0).toLocaleString('id-ID')}</td>` : ''}
      <td>${escapeHtml(b.pickupLocation || 'Meeting Point')}</td>
      <td style="text-align: center; text-transform: capitalize;">${b.status}</td>
    </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Laporan Manifest Resmi - ${escapeHtml(tripDate)}</title>
  <style>
    @page { size: A4 landscape; margin: 12mm; }
    body { font-family: 'Times New Roman', serif; font-size: 11.5px; color: #000; margin: 0; padding: 0; line-height: 1.3; }
    .kop { text-align: center; border-bottom: 3px double #000; padding-bottom: 8px; margin-bottom: 12px; }
    .kop-h1 { font-size: 18px; font-weight: bold; text-transform: uppercase; margin: 0; }
    .kop-h2 { font-size: 13px; font-weight: normal; margin: 2px 0; }
    .kop-addr { font-size: 10px; font-style: italic; }
    .doc-head { text-align: center; margin-bottom: 14px; }
    .doc-title { font-size: 14px; font-weight: bold; text-decoration: underline; text-transform: uppercase; }
    .doc-num { font-size: 10px; margin-top: 2px; }
    .info-table { width: 100%; border: none; margin-bottom: 12px; font-size: 11px; }
    .info-table td { border: none; padding: 2px 4px; }
    table.data-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
    table.data-table th, table.data-table td { border: 1px solid #333; padding: 5px 6px; font-size: 10.5px; }
    table.data-table th { background: #eaeaea; text-align: left; }
    .sign-section { margin-top: 20px; display: flex; justify-content: space-between; }
    .sign-box { width: 220px; text-align: center; }
    .sign-space { height: 50px; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="kop">
    <div class="kop-h1">${escapeHtml(mergedSettings.companyName || 'OPERATOR WISATA SNORKELING GILI')}</div>
    <div class="kop-h2">${escapeHtml(mergedSettings.subheader || 'Kepulauan Gili Trawangan, Gili Meno & Gili Air')}</div>
    <div class="kop-addr">${escapeHtml(mergedSettings.address || '')} | Kontak: ${escapeHtml(mergedSettings.phone || '')} | Email: ${escapeHtml(mergedSettings.email || '')}</div>
  </div>

  <div class="doc-head">
    <div class="doc-title">SURAT DAFTAR MANIFEST PENUMPANG TRIP</div>
    <div class="doc-num">Nomor: MNF/${tripDate.replace(/-/g, '')}/${tripSession.substring(0, 3).toUpperCase()}</div>
  </div>

  <table class="info-table">
    <tr>
      <td style="width: 15%; font-weight: bold;">Hari / Tanggal</td>
      <td style="width: 35%;">: ${escapeHtml(tripDate)}</td>
      <td style="width: 15%; font-weight: bold;">Nama Armada / Kapal</td>
      <td style="width: 35%;">: ${escapeHtml(boatName)}</td>
    </tr>
    <tr>
      <td style="font-weight: bold;">Sesi Keberangkatan</td>
      <td>: ${escapeHtml(tripSession)}</td>
      <td style="font-weight: bold;">Kapten / Pemandu</td>
      <td>: ${escapeHtml(captainName)}</td>
    </tr>
    <tr>
      <td style="font-weight: bold;">Total Penumpang</td>
      <td>: <strong>${totalPax} Orang</strong> (${bookings.length} Reservasi)</td>
      ${mergedSettings.showPrices ? `<td style="font-weight: bold;">Total Nilai Transaksi</td><td>: Rp ${totalRevenue.toLocaleString('id-ID')}</td>` : '<td colspan="2"></td>'}
    </tr>
  </table>

  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 30px; text-align: center;">No</th>
        <th style="width: 80px;">No. Registrasi</th>
        <th>Nama Penumpang</th>
        <th>Paket Wisata</th>
        <th style="width: 50px; text-align: center;">Pax</th>
        ${mergedSettings.showPrices ? '<th style="text-align: right;">Total Biaya</th>' : ''}
        <th>Titik Penjemputan</th>
        <th style="width: 70px; text-align: center;">Status</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <div style="font-size: 10px; margin-top: 10px;">
    <strong>Catatan Resmi & Ketentuan:</strong> ${escapeHtml(mergedSettings.footerNotes || '')}
  </div>

  <div class="sign-section">
    <div class="sign-box">
      <div>Mengetahui,</div>
      <div style="font-weight: bold;">Manajemen Operasional</div>
      <div class="sign-space"></div>
      <div>( _____________________ )</div>
    </div>
    <div class="sign-box">
      <div>Gili Trawangan, ${printDate.split(' ')[0]}</div>
      <div style="font-weight: bold;">Nakhoda / Kapten Kapal</div>
      <div class="sign-space"></div>
      <div style="font-weight: bold;">${escapeHtml(captainName)}</div>
    </div>
  </div>
</body>
</html>`;
}
