"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Save,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Loader2,
  Clock,
  Globe,
  Share2,
  CheckCircle2,
  Printer,
  FileCode,
  RotateCcw,
  Sparkles,
  Eye,
  Ship,
  UserCheck,
  Lock,
  Key,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  Upload,
  Trash2,
  Image as ImageIcon,
  Plus,
  Wallet,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { compressAndUpload, QR_COMPRESSION } from "@/lib/compress-image";
import {
  DEFAULT_MANIFEST_SETTINGS,
  generateManifestHtml,
} from "@/lib/manifestTemplate";
import BrandLogo, {
  LOGO_PRESETS,
  LOGO_COLOR_GRADIENTS,
} from "@/components/common/BrandLogo";
import ImageUpload from "@/components/admin/ImageUpload";

import { useSearchParams } from "next/navigation";

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  notes?: string;
  isActive: boolean;
}

/**
 * Reads the bank account list from settings, falling back to the legacy single
 * account keys so existing installations keep their rekening after the upgrade.
 */
function parseBankAccounts(settings: { [key: string]: string }): BankAccount[] {
  const raw = settings["payment_banks"];
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((item: any, index: number) => ({
          id: String(item.id || `bank_${index}`),
          bankName: item.bankName || "",
          accountNumber: item.accountNumber || "",
          accountHolder: item.accountHolder || "",
          notes: item.notes || "",
          isActive: item.isActive !== false,
        }));
      }
    } catch (e) {
      console.warn("Invalid payment_banks value, falling back to legacy keys:", e);
    }
  }

  if (settings["payment_bank_name"] || settings["payment_bank_number"]) {
    return [
      {
        id: "bank_legacy",
        bankName: settings["payment_bank_name"] || "",
        accountNumber: settings["payment_bank_number"] || "",
        accountHolder: settings["payment_bank_holder"] || "",
        notes: settings["payment_bank_notes"] || "",
        isActive: true,
      },
    ];
  }

  return [];
}

export default function AdminSettingsPage() {
  return (
    <React.Suspense
      fallback={<div style={{ padding: "32px" }}>Memuat pengaturan...</div>}
    >
      <AdminSettingsContent />
    </React.Suspense>
  );
}

function AdminSettingsContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as any;

  const [settings, setSettings] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | "branding"
    | "contact"
    | "location"
    | "operations"
    | "social"
    | "payment"
    | "manifest"
    | "security"
  >(
    tabParam &&
      [
        "branding",
        "contact",
        "location",
        "operations",
        "social",
        "payment",
        "manifest",
        "security",
      ].includes(tabParam)
      ? tabParam
      : "branding",
  );
  const [isUploadingQris, setIsUploadingQris] = useState(false);
  const qrisFileInputRef = React.useRef<HTMLInputElement>(null);

  // Sync activeTab when query param changes
  useEffect(() => {
    if (
      tabParam &&
      [
        "branding",
        "contact",
        "location",
        "operations",
        "social",
        "payment",
        "manifest",
        "security",
      ].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Security & Admin Profile State
  const [adminEmail, setAdminEmail] = useState("");
  const [adminName, setAdminName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isChangingPass, setIsChangingPass] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data: any[]) => {
        const map: { [key: string]: string } = {};
        data.forEach((item) => {
          map[item.key] = item.value;
        });
        setSettings(map);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        toast.error("Gagal memuat pengaturan website");
        setLoading(false);
      });

    // Fetch current admin profile info
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setAdminEmail(data.user.email || "");
          setAdminName(data.user.name || "");
        }
      })
      .catch((e) => console.warn("Could not fetch admin profile:", e));
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Social profile links are stored as absolute URLs, but admins commonly paste
  // "instagram.com/..." — normalize instead of rejecting the whole form.
  const SOCIAL_URL_KEYS = [
    "instagram_url",
    "facebook_url",
    "tiktok_url",
    "youtube_url",
    "tripadvisor_url",
    "google_maps_url",
  ];

  const normalizeUrl = (value: string) => {
    const trimmed = (value || "").trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (trimmed.startsWith("//")) return `https:${trimmed}`;
    return `https://${trimmed.replace(/^\/+/, "")}`;
  };

  // --- Bank accounts (multiple) ---
  const createEmptyBank = (): BankAccount => ({
    id: `bank_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    notes: "",
    isActive: true,
  });

  const bankAccounts: BankAccount[] = React.useMemo(
    () => parseBankAccounts(settings),
    [settings],
  );

  const persistBankAccounts = (list: BankAccount[]) => {
    handleChange("payment_banks", JSON.stringify(list));
  };

  const updateBankAccount = (
    id: string,
    field: keyof BankAccount,
    value: string | boolean,
  ) => {
    persistBankAccounts(
      bankAccounts.map((bank) =>
        bank.id === id ? { ...bank, [field]: value } : bank,
      ),
    );
  };

  const addBankAccount = () => {
    persistBankAccounts([...bankAccounts, createEmptyBank()]);
  };

  const removeBankAccount = (id: string) => {
    const remaining = bankAccounts.filter((bank) => bank.id !== id);
    persistBankAccounts(remaining);
    toast.success("Rekening dihapus dari daftar. Klik Simpan untuk menerapkan.");
  };

  const moveBankAccount = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= bankAccounts.length) return;
    const list = [...bankAccounts];
    [list[index], list[target]] = [list[target], list[index]];
    persistBankAccounts(list);
  };

  // Client-side canvas compression for QR code image
  const handleUpdateSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmNewPassword) {
      toast.error("Konfirmasi password baru tidak cocok!");
      return;
    }
    if (newPassword && newPassword.length < 6) {
      toast.error("Password baru minimal 6 karakter!");
      return;
    }

    setIsChangingPass(true);
    const toastId = toast.loading(
      "Memperbarui kredensial akun admin di database...",
    );

    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword: newPassword || undefined,
          email: adminEmail,
          name: adminName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal memperbarui akun");
      }

      toast.success(data.message || "Kredensial admin berhasil diperbarui!", {
        id: toastId,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan saat memperbarui", {
        id: toastId,
      });
    } finally {
      setIsChangingPass(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const toastId = toast.loading("Menyimpan pengaturan website...");

    try {
      const payload = Object.entries(settings).map(([key, value]) => [
        key,
        SOCIAL_URL_KEYS.includes(key) ? normalizeUrl(String(value)) : value,
      ]) as [string, string][];

      // Reflect normalized links back into the form so the admin sees what was stored
      setSettings((prev) => {
        const next = { ...prev };
        payload.forEach(([key, value]) => {
          if (SOCIAL_URL_KEYS.includes(key)) next[key] = value;
        });
        return next;
      });

      const promises = payload.map(([key, value]) =>
        fetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, value }),
        }),
      );

      const results = await Promise.all(promises);
      const allOk = results.every((r) => r.ok);
      if (!allOk) throw new Error("Beberapa pengaturan gagal disimpan");

      toast.success("Pengaturan website berhasil disimpan!", { id: toastId });
    } catch (e: any) {
      toast.error(e.message || "Gagal menyimpan pengaturan", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: "var(--primary-ocean)",
          padding: "40px",
        }}
      >
        <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
        <span>Memuat pengaturan website...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.75rem",
              color: "var(--primary-deep)",
              marginBottom: "4px",
            }}
          >
            Pengaturan Operasional & Website
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Konfigurasi nomor WhatsApp bisnis, lokasi counter dermaga, jadwal
            sesi default, dan integrasi sosial media.
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {[
          {
            key: "branding",
            label: "1. Identitas & Logo Website",
            icon: Sparkles,
          },
          {
            key: "contact",
            label: "2. Kontak & WhatsApp",
            icon: MessageCircle,
          },
          { key: "location", label: "3. Lokasi Dermaga & Maps", icon: MapPin },
          {
            key: "operations",
            label: "4. Jam & Sesi Operasional",
            icon: Clock,
          },
          { key: "social", label: "5. Sosial Media & SEO", icon: Globe },
          {
            key: "payment",
            label: "6. Pembayaran & Mata Uang",
            icon: CreditCard,
          },
          {
            key: "manifest",
            label: "7. Preset & Template Laporan Manifest",
            icon: Printer,
          },
          { key: "security", label: "8. Keamanan & Akun Admin", icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                borderRadius: "var(--radius-sm)",
                border: isActive
                  ? "1px solid var(--primary-ocean)"
                  : "1px solid var(--border-light)",
                background: isActive ? "var(--primary-ocean)" : "#ffffff",
                color: isActive ? "#ffffff" : "var(--text-main)",
                fontSize: "0.88rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Container */}
      <div
        className="glass-card"
        style={{ padding: "32px", background: "#ffffff" }}
      >
        <form onSubmit={handleSubmit}>
          {/* TAB 1: BRANDING & LOGO */}
          {activeTab === "branding" && (
            <div>
              <div style={{ marginBottom: "24px" }}>
                <h3
                  style={{
                    fontSize: "1.15rem",
                    color: "var(--primary-deep)",
                    marginBottom: "6px",
                  }}
                >
                  Identitas, Logo & Nama Website
                </h3>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-muted)",
                    margin: 0,
                  }}
                >
                  Konfigurasi nama brand website, tagline resmi, serta pilih preset logo grafis bahari atau unggah file logo custom Anda.
                </p>
              </div>

              {/* Live Interactive Preview Box */}
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid var(--border-light)",
                  borderRadius: "var(--radius-md)",
                  padding: "20px",
                  marginBottom: "28px",
                }}
              >
                <div
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "var(--primary-ocean)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Eye size={15} />
                  <span>Pratinjau Langsung (Live Preview)</span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}
                >
                  {/* Light Navbar View */}
                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid var(--border-light)",
                      borderRadius: "8px",
                      padding: "16px 20px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--text-muted)",
                        fontWeight: 600,
                        display: "block",
                        marginBottom: "10px",
                      }}
                    >
                      Tampilan di Header Navbar (Mode Terang):
                    </span>
                    <BrandLogo
                      siteName={settings["site_name"] || "SNORKELING GILI"}
                      tagline={settings["tagline"] || "Gili Trawangan • 3 Gili"}
                      logoUrl={settings["site_logo"] || ""}
                      logoType={settings["site_logo_type"] || "preset"}
                      logoPreset={settings["site_logo_preset"] || "waves"}
                      logoColor={settings["site_logo_color"] || "ocean"}
                      variant="light"
                      size="md"
                    />
                  </div>

                  {/* Dark Footer & Sidebar View */}
                  <div
                    style={{
                      background: "var(--primary-deep, #0a192f)",
                      borderRadius: "8px",
                      padding: "16px 20px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.72rem",
                        color: "rgba(255,255,255,0.6)",
                        fontWeight: 600,
                        display: "block",
                        marginBottom: "10px",
                      }}
                    >
                      Tampilan di Footer & Sidebar Admin (Mode Gelap):
                    </span>
                    <BrandLogo
                      siteName={settings["site_name"] || "SNORKELING GILI"}
                      tagline={settings["tagline"] || "Gili Trawangan • 3 Gili"}
                      logoUrl={settings["site_logo"] || ""}
                      logoType={settings["site_logo_type"] || "preset"}
                      logoPreset={settings["site_logo_preset"] || "waves"}
                      logoColor={settings["site_logo_color"] || "ocean"}
                      variant="dark"
                      size="md"
                    />
                  </div>
                </div>
              </div>

              {/* Website Name & Tagline Inputs */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "24px",
                }}
              >
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">
                    Nama Website / Brand Utama <span style={{ color: "#ef4444", fontWeight: 700 }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: SNORKELING GILI"
                    value={settings["site_name"] || ""}
                    onChange={(e) => handleChange("site_name", e.target.value)}
                    required
                  />
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Kata terakhir akan otomatis diberi highlight warna aksen toska yang modern.
                  </span>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">
                    Tagline / Subjudul Brand
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Gili Trawangan • 3 Gili"
                    value={settings["tagline"] || ""}
                    onChange={(e) => handleChange("tagline", e.target.value)}
                  />
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Teks kecil yang tampil tepat di bawah nama website pada navbar dan footer.
                  </span>
                </div>
              </div>

              {/* Logo Selection Mode: Preset vs Custom */}
              <div className="form-group" style={{ marginBottom: "20px" }}>
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Format & Model Logo Website <span style={{ color: "#ef4444", fontWeight: 700 }}>*</span>
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      padding: "12px 14px",
                      borderRadius: "var(--radius-sm)",
                      border: (settings["site_logo_type"] || "preset") === "preset" ? "2px solid var(--primary-ocean)" : "1px solid var(--border-light)",
                      background: (settings["site_logo_type"] || "preset") === "preset" ? "var(--primary-surface)" : "#f8fafc",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="site_logo_type"
                      value="preset"
                      checked={(settings["site_logo_type"] || "preset") === "preset"}
                      onChange={() => handleChange("site_logo_type", "preset")}
                      style={{ marginTop: "3px" }}
                    />
                    <div>
                      <strong style={{ color: "var(--primary-deep)", fontSize: "0.88rem", display: "block" }}>
                        Gunakan Preset Ikon & Tema Warna Bahari
                      </strong>
                      <span style={{ fontSize: "0.76rem", color: "var(--text-muted)", display: "block", marginTop: "2px" }}>
                        Pilihan ikon grafis bahari siap pakai (ombak, kompas, perahu, jangkar, dll) dengan gradien warna modern.
                      </span>
                    </div>
                  </label>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      padding: "12px 14px",
                      borderRadius: "var(--radius-sm)",
                      border: settings["site_logo_type"] === "custom" ? "2px solid var(--primary-ocean)" : "1px solid var(--border-light)",
                      background: settings["site_logo_type"] === "custom" ? "var(--primary-surface)" : "#f8fafc",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="site_logo_type"
                      value="custom"
                      checked={settings["site_logo_type"] === "custom"}
                      onChange={() => handleChange("site_logo_type", "custom")}
                      style={{ marginTop: "3px" }}
                    />
                    <div>
                      <strong style={{ color: "var(--primary-deep)", fontSize: "0.88rem", display: "block" }}>
                        Unggah File Logo Kustom Sendiri
                      </strong>
                      <span style={{ fontSize: "0.76rem", color: "var(--text-muted)", display: "block", marginTop: "2px" }}>
                        Gunakan file gambar logo brand bisnis Anda sendiri (format PNG transparan, WebP, SVG, atau JPG).
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* IF PRESET SELECTED: Show Presets Selection */}
              {(settings["site_logo_type"] || "preset") === "preset" && (
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid var(--border-light)",
                    borderRadius: "var(--radius-md)",
                    padding: "20px",
                    marginBottom: "24px",
                  }}
                >
                  {/* Preset Icons */}
                  <div style={{ marginBottom: "20px" }}>
                    <label className="form-label" style={{ fontWeight: 700, marginBottom: "8px" }}>
                      Pilih Ikon Preset Logo:
                    </label>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                        gap: "10px",
                      }}
                    >
                      {LOGO_PRESETS.map((preset) => {
                        const Icon = preset.icon;
                        const isSelected = (settings["site_logo_preset"] || "waves") === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleChange("site_logo_preset", preset.id)}
                            style={{
                              padding: "12px 10px",
                              borderRadius: "8px",
                              border: isSelected ? "2px solid var(--primary-ocean)" : "1px solid var(--border-light)",
                              background: isSelected ? "var(--primary-surface)" : "#ffffff",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: "8px",
                              cursor: "pointer",
                              transition: "0.15s",
                            }}
                          >
                            <div
                              style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "8px",
                                background: isSelected ? "var(--primary-ocean)" : "rgba(0, 119, 182, 0.08)",
                                color: isSelected ? "#ffffff" : "var(--primary-ocean)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Icon size={20} />
                            </div>
                            <span
                              style={{
                                fontSize: "0.78rem",
                                fontWeight: isSelected ? 700 : 500,
                                color: isSelected ? "var(--primary-deep)" : "var(--text-main)",
                                textAlign: "center",
                              }}
                            >
                              {preset.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Preset Colors */}
                  <div>
                    <label className="form-label" style={{ fontWeight: 700, marginBottom: "8px" }}>
                      Pilih Tema Warna Gradien Logo:
                    </label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                      {Object.entries(LOGO_COLOR_GRADIENTS).map(([colorKey, colorItem]) => {
                        const isSelected = (settings["site_logo_color"] || "ocean") === colorKey;
                        return (
                          <button
                            key={colorKey}
                            type="button"
                            onClick={() => handleChange("site_logo_color", colorKey)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "8px 14px",
                              borderRadius: "6px",
                              border: isSelected ? "2px solid var(--primary-ocean)" : "1px solid var(--border-light)",
                              background: isSelected ? "var(--primary-surface)" : "#ffffff",
                              cursor: "pointer",
                              fontSize: "0.82rem",
                              fontWeight: isSelected ? 700 : 500,
                              color: isSelected ? "var(--primary-deep)" : "var(--text-main)",
                            }}
                          >
                            <span
                              style={{
                                width: "16px",
                                height: "16px",
                                borderRadius: "50%",
                                background: colorItem.gradient,
                                display: "inline-block",
                                flexShrink: 0,
                              }}
                            />
                            <span>{colorItem.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* IF CUSTOM SELECTED: Show ImageUpload */}
              {settings["site_logo_type"] === "custom" && (
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid var(--border-light)",
                    borderRadius: "var(--radius-md)",
                    padding: "20px",
                    marginBottom: "24px",
                  }}
                >
                  <ImageUpload
                    label="Unggah File Logo Kustom"
                    value={settings["site_logo"] || ""}
                    onChange={(url) => handleChange("site_logo", url)}
                    helperText="Upload gambar logo bisnis Anda (format transparan PNG atau WebP disarankan, maks 5MB)"
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CONTACT & WHATSAPP */}
          {activeTab === "contact" && (
            <div>
              <h3
                style={{
                  fontSize: "1.15rem",
                  color: "var(--primary-deep)",
                  marginBottom: "6px",
                }}
              >
                Kontak Langsung & WhatsApp Bisnis
              </h3>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  marginBottom: "20px",
                }}
              >
                Nomor ini akan digunakan sebagai tujuan utama tombol booking dan
                WhatsApp float di website publik.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">
                    Nomor WhatsApp Utama (Format: 628xxx) *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings["whatsapp_number"] || ""}
                    onChange={(e) =>
                      handleChange("whatsapp_number", e.target.value)
                    }
                    placeholder="6287864551234"
                    required
                  />
                  <span
                    style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}
                  >
                    Gunakan awalan 62 tanpa spasi / tanda plus untuk integrasi
                    wa.me
                  </span>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">
                    Nomor Telepon Display Website
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings["phone"] || ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+62 859-2135-8615"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: "20px" }}>
                <label className="form-label">Alamat Email Bisnis</label>
                <input
                  type="email"
                  className="form-control"
                  value={settings["email"] || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="info@snorkelinggilitrawangan.com"
                />
              </div>
            </div>
          )}

          {/* TAB 2: LOCATION & MAPS */}
          {activeTab === "location" && (
            <div>
              <h3
                style={{
                  fontSize: "1.15rem",
                  color: "var(--primary-deep)",
                  marginBottom: "6px",
                }}
              >
                Lokasi Kantor & Meeting Point Dermaga
              </h3>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  marginBottom: "20px",
                }}
              >
                Titik kumpul wisatawan sebelum naik kapal snorkeling di Gili
                Trawangan.
              </p>

              <div className="form-group" style={{ marginBottom: "20px" }}>
                <label className="form-label">
                  Alamat Lengkap Counter / Meeting Point
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={settings["address"] || ""}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Jl. Pantai Gili Trawangan (50 meter utara dermaga kapal cepat), Desa Gili Indah, Lombok Utara"
                />
              </div>

              <div className="form-group" style={{ marginBottom: "20px" }}>
                <label className="form-label">Link Google Maps Lokasi</label>
                <input
                  type="url"
                  className="form-control"
                  value={settings["google_maps_url"] || ""}
                  onChange={(e) =>
                    handleChange("google_maps_url", e.target.value)
                  }
                  placeholder="https://maps.google.com/?q=Gili+Trawangan"
                />
              </div>
            </div>
          )}

          {/* TAB 3: OPERATIONS & SESSIONS */}
          {activeTab === "operations" && (
            <div>
              <h3
                style={{
                  fontSize: "1.15rem",
                  color: "var(--primary-deep)",
                  marginBottom: "6px",
                }}
              >
                Jam Operasional & Sesi Default Keberangkatan
              </h3>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  marginBottom: "20px",
                }}
              >
                Atur jadwal buka counter dan waktu standar keberangkatan perahu.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Jam Operasional Counter</label>
                  <input
                    type="text"
                    className="form-control"
                    value={
                      settings["operating_hours"] ||
                      "07:30 - 18:00 WITA (Setiap Hari)"
                    }
                    onChange={(e) =>
                      handleChange("operating_hours", e.target.value)
                    }
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Jadwal Sesi Pagi Default</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings["morning_session_time"] || "09:30 WITA"}
                    onChange={(e) =>
                      handleChange("morning_session_time", e.target.value)
                    }
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">
                    Jadwal Sesi Siang Default
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings["afternoon_session_time"] || "13:00 WITA"}
                    onChange={(e) =>
                      handleChange("afternoon_session_time", e.target.value)
                    }
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">
                    Jadwal Sesi Sunset Default
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings["sunset_session_time"] || "16:00 WITA"}
                    onChange={(e) =>
                      handleChange("sunset_session_time", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SOCIAL MEDIA & SEO */}
          {activeTab === "social" && (
            <div>
              <h3
                style={{
                  fontSize: "1.15rem",
                  color: "var(--primary-deep)",
                  marginBottom: "6px",
                }}
              >
                Media Sosial & SEO Website
              </h3>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  marginBottom: "20px",
                }}
              >
                Tautan profil sosial media dan meta title halaman publik.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Link Akun Instagram</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings["instagram_url"] || ""}
                    onChange={(e) =>
                      handleChange("instagram_url", e.target.value)
                    }
                    placeholder="instagram.com/tripsnorkelinggili"
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Link Akun TikTok</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings["tiktok_url"] || ""}
                    onChange={(e) => handleChange("tiktok_url", e.target.value)}
                    placeholder="tiktok.com/@tripsnorkelinggili"
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Link Halaman Facebook</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings["facebook_url"] || ""}
                    onChange={(e) =>
                      handleChange("facebook_url", e.target.value)
                    }
                    placeholder="facebook.com/tripsnorkelinggili"
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Link Kanal YouTube</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings["youtube_url"] || ""}
                    onChange={(e) =>
                      handleChange("youtube_url", e.target.value)
                    }
                    placeholder="youtube.com/@tripsnorkelinggili"
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Link TripAdvisor</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings["tripadvisor_url"] || ""}
                    onChange={(e) =>
                      handleChange("tripadvisor_url", e.target.value)
                    }
                    placeholder="tripadvisor.com/..."
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  padding: "12px 14px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--primary-surface)",
                  border: "1px solid rgba(0, 119, 182, 0.2)",
                  fontSize: "0.82rem",
                  color: "var(--text-main)",
                  lineHeight: 1.5,
                }}
              >
                <Share2
                  size={16}
                  color="var(--primary-ocean)"
                  style={{ flexShrink: 0, marginTop: "2px" }}
                />
                <span>
                  Ikon sosial media hanya muncul di footer website untuk kolom
                  yang diisi. Kosongkan kolom untuk menyembunyikan ikonnya.
                  Awalan <strong>https://</strong> ditambahkan otomatis saat
                  disimpan.
                </span>
              </div>
            </div>
          )}

          {/* TAB 5: MANIFEST REPORT PRESETS & TEMPLATES */}
          {activeTab === "manifest" && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: "1.2rem",
                      color: "var(--primary-deep)",
                      margin: 0,
                    }}
                  >
                    Preset Desain & Template Laporan Manifest (PDF & HTML)
                  </h3>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-muted)",
                      margin: "4px 0 0 0",
                    }}
                  >
                    Pilih preset tata letak default, atur teks kop surat,
                    informasi armada, checklist alat, dan sesuaikan template
                    HTML jika diperlukan.
                  </p>
                </div>
              </div>

              {/* Preset Selector Cards */}
              <div style={{ marginBottom: "24px" }}>
                <label
                  className="form-label"
                  style={{
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    marginBottom: "10px",
                    display: "block",
                  }}
                >
                  Pilihan Preset Desain Default:
                </label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "12px",
                  }}
                >
                  {[
                    {
                      id: "modern",
                      name: "Modern Ocean",
                      type: "Landscape (A4)",
                      desc: "Desain modern bernuansa laut lengkap dengan kartu KPI, tabel data, checklist alat & 3 kolom tanda tangan.",
                      icon: Sparkles,
                    },
                    {
                      id: "compact",
                      name: "Dermaga Compact",
                      type: "Portrait (A4)",
                      desc: "Format checklist ringkas & hemat kertas khusus kru lapangan / pelabuhan untuk absensi tamu & alat.",
                      icon: Printer,
                    },
                    {
                      id: "official",
                      name: "Resmi Operator Sheet",
                      type: "Landscape (A4)",
                      desc: "Kop formal klasik dengan nomor surat, tabel standar, klausul asuransi dan tanda tangan manajemen.",
                      icon: UserCheck,
                    },
                    {
                      id: "custom",
                      name: "Custom HTML Template",
                      type: "Kustom Penuh",
                      desc: "Gunakan template HTML kustom bebas dengan placeholder variabel dinamis {{tag}}.",
                      icon: FileCode,
                    },
                  ].map((p) => {
                    const currentPreset =
                      settings["manifest_default_preset"] || "modern";
                    const isSelected = currentPreset === p.id;
                    const Icon = p.icon;
                    return (
                      <div
                        key={p.id}
                        onClick={() =>
                          handleChange("manifest_default_preset", p.id)
                        }
                        style={{
                          border: isSelected
                            ? "2px solid var(--primary-ocean)"
                            : "1px solid var(--border-light)",
                          background: isSelected ? "#f0f9ff" : "#ffffff",
                          borderRadius: "var(--radius-md)",
                          padding: "16px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          boxShadow: isSelected
                            ? "0 4px 12px rgba(2, 132, 199, 0.12)"
                            : "none",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: "8px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <Icon
                                size={16}
                                color={
                                  isSelected
                                    ? "var(--primary-ocean)"
                                    : "#64748b"
                                }
                              />
                              <span
                                style={{
                                  fontWeight: 700,
                                  fontSize: "0.95rem",
                                  color: isSelected
                                    ? "var(--primary-ocean)"
                                    : "var(--primary-deep)",
                                }}
                              >
                                {p.name}
                              </span>
                            </div>
                            <span
                              style={{
                                fontSize: "0.72rem",
                                background: isSelected
                                  ? "var(--primary-ocean)"
                                  : "#e2e8f0",
                                color: isSelected ? "#ffffff" : "#475569",
                                padding: "2px 8px",
                                borderRadius: "var(--radius-full)",
                                fontWeight: 600,
                              }}
                            >
                              {p.type}
                            </span>
                          </div>
                          <p
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--text-muted)",
                              margin: 0,
                              lineHeight: 1.4,
                            }}
                          >
                            {p.desc}
                          </p>
                        </div>
                        {isSelected && (
                          <div
                            style={{
                              marginTop: "12px",
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              color: "var(--primary-ocean)",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <CheckCircle2 size={14} />
                            <span>Preset Terpilih</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Header & Branding Info */}
              <div
                style={{
                  background: "#f8fafc",
                  padding: "20px",
                  borderRadius: "var(--radius-md)",
                  marginBottom: "20px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <h4
                  style={{
                    fontSize: "0.98rem",
                    fontWeight: 700,
                    color: "var(--primary-deep)",
                    marginTop: 0,
                    marginBottom: "14px",
                  }}
                >
                  1. Informasi Kop & Branding Dokumen
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.2fr 1fr",
                    gap: "16px",
                    marginBottom: "14px",
                  }}
                >
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">
                      Nama Perusahaan / Operator di Kop Manifest
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={
                        settings["manifest_company_name"] !== undefined
                          ? settings["manifest_company_name"]
                          : DEFAULT_MANIFEST_SETTINGS.companyName
                      }
                      onChange={(e) =>
                        handleChange("manifest_company_name", e.target.value)
                      }
                      placeholder="TRIP SNORKELING GILI TRAWANGAN"
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">
                      Subheader / Slogan Wisata
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={
                        settings["manifest_subheader"] !== undefined
                          ? settings["manifest_subheader"]
                          : DEFAULT_MANIFEST_SETTINGS.subheader
                      }
                      onChange={(e) =>
                        handleChange("manifest_subheader", e.target.value)
                      }
                      placeholder="Layanan Wisata Snorkeling Terpercaya 3 Gili"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">
                    Kontak WhatsApp & Telepon di Kop Dokumen
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={
                      settings["manifest_contact_info"] !== undefined
                        ? settings["manifest_contact_info"]
                        : settings["phone"] || DEFAULT_MANIFEST_SETTINGS.phone
                    }
                    onChange={(e) =>
                      handleChange("manifest_contact_info", e.target.value)
                    }
                    placeholder="+62 859-2135-8615 / 6287864551234"
                  />
                </div>
              </div>

              {/* Default Armada & Kru */}
              <div
                style={{
                  background: "#f8fafc",
                  padding: "20px",
                  borderRadius: "var(--radius-md)",
                  marginBottom: "20px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <h4
                  style={{
                    fontSize: "0.98rem",
                    fontWeight: 700,
                    color: "var(--primary-deep)",
                    marginTop: 0,
                    marginBottom: "14px",
                  }}
                >
                  2. Armada Default & Petugas Lapangan
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}
                >
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">
                      Nama Perahu / Boat Default
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={
                        settings["manifest_default_boat"] !== undefined
                          ? settings["manifest_default_boat"]
                          : DEFAULT_MANIFEST_SETTINGS.defaultBoat
                      }
                      onChange={(e) =>
                        handleChange("manifest_default_boat", e.target.value)
                      }
                      placeholder="Glass Bottom Boat - Dolphin 01"
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">
                      Nama Kapten / Guide Default
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={
                        settings["manifest_default_captain"] !== undefined
                          ? settings["manifest_default_captain"]
                          : DEFAULT_MANIFEST_SETTINGS.defaultCaptain
                      }
                      onChange={(e) =>
                        handleChange("manifest_default_captain", e.target.value)
                      }
                      placeholder="Kapten Rahman / Pemandu Budi"
                    />
                  </div>
                </div>
              </div>

              {/* Column Visibility Toggles */}
              <div
                style={{
                  background: "#f8fafc",
                  padding: "20px",
                  borderRadius: "var(--radius-md)",
                  marginBottom: "20px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <h4
                  style={{
                    fontSize: "0.98rem",
                    fontWeight: 700,
                    color: "var(--primary-deep)",
                    marginTop: 0,
                    marginBottom: "12px",
                  }}
                >
                  3. Opsi Kolom Tabel Manifest
                </h4>
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                      fontSize: "0.88rem",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={
                        settings["manifest_show_equipment_checklist"] !==
                        "false"
                      }
                      onChange={(e) =>
                        handleChange(
                          "manifest_show_equipment_checklist",
                          e.target.checked ? "true" : "false",
                        )
                      }
                      style={{
                        width: "16px",
                        height: "16px",
                        accentColor: "var(--primary-ocean)",
                      }}
                    />
                    <span>Sediakan Kolom Checklist Alat (Masker & Fin)</span>
                  </label>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                      fontSize: "0.88rem",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={
                        settings["manifest_show_pickup_notes"] !== "false"
                      }
                      onChange={(e) =>
                        handleChange(
                          "manifest_show_pickup_notes",
                          e.target.checked ? "true" : "false",
                        )
                      }
                      style={{
                        width: "16px",
                        height: "16px",
                        accentColor: "var(--primary-ocean)",
                      }}
                    />
                    <span>
                      Tampilkan Kolom Titik Jemput & Catatan Khusus Tamu
                    </span>
                  </label>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                      fontSize: "0.88rem",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={settings["manifest_show_prices"] !== "false"}
                      onChange={(e) =>
                        handleChange(
                          "manifest_show_prices",
                          e.target.checked ? "true" : "false",
                        )
                      }
                      style={{
                        width: "16px",
                        height: "16px",
                        accentColor: "var(--primary-ocean)",
                      }}
                    />
                    <span>Tampilkan Kolom Total Biaya / Omset Transaksi</span>
                  </label>
                </div>
              </div>

              {/* Footer Safety Notes */}
              <div
                style={{
                  background: "#f8fafc",
                  padding: "20px",
                  borderRadius: "var(--radius-md)",
                  marginBottom: "20px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <h4
                  style={{
                    fontSize: "0.98rem",
                    fontWeight: 700,
                    color: "var(--primary-deep)",
                    marginTop: 0,
                    marginBottom: "6px",
                  }}
                >
                  4. Catatan Kaki, Syarat & Ketentuan Keselamatan (Footer)
                </h4>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    marginBottom: "12px",
                  }}
                >
                  Teks himbauan keselamatan laut, instruksi pelampung, atau
                  klausul disclaimer di bagian bawah manifest.
                </p>
                <textarea
                  className="form-control"
                  rows={3}
                  value={
                    settings["manifest_footer_notes"] !== undefined
                      ? settings["manifest_footer_notes"]
                      : DEFAULT_MANIFEST_SETTINGS.footerNotes
                  }
                  onChange={(e) =>
                    handleChange("manifest_footer_notes", e.target.value)
                  }
                  placeholder="Himbauan keselamatan dan peraturan trip..."
                />
              </div>

              {/* Custom HTML Template Editor */}
              <div
                style={{
                  background: "#f8fafc",
                  padding: "20px",
                  borderRadius: "var(--radius-md)",
                  marginBottom: "20px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontSize: "0.98rem",
                        fontWeight: 700,
                        color: "var(--primary-deep)",
                        margin: 0,
                      }}
                    >
                      5. Editor Template HTML Manifest Kustom
                    </h4>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-muted)",
                        margin: "4px 0 0 0",
                      }}
                    >
                      Digunakan saat memilih preset{" "}
                      <strong>"Custom HTML Template"</strong> atau untuk
                      merancang desain dokumen mandiri.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      handleChange(
                        "manifest_custom_html_template",
                        DEFAULT_MANIFEST_SETTINGS.customHtmlTemplate || "",
                      );
                      toast.info(
                        "Template HTML dikembalikan ke standar default.",
                      );
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{
                      fontSize: "0.78rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <RotateCcw size={13} />
                    <span>Reset ke Template Default</span>
                  </button>
                </div>

                {/* Placeholders Cheatsheet */}
                <div
                  style={{
                    background: "#ffffff",
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                    marginBottom: "12px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      color: "var(--primary-navy)",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Variabel Dinamis Yang Didukung:
                  </span>
                  <div
                    style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}
                  >
                    {[
                      "{{companyName}}",
                      "{{subheader}}",
                      "{{phone}}",
                      "{{email}}",
                      "{{address}}",
                      "{{tripDate}}",
                      "{{tripSession}}",
                      "{{boatName}}",
                      "{{captainName}}",
                      "{{totalPax}}",
                      "{{totalBookings}}",
                      "{{totalRevenue}}",
                      "{{bookingsTable}}",
                      "{{footerNotes}}",
                      "{{printDate}}",
                    ].map((tag) => (
                      <code
                        key={tag}
                        style={{
                          background: "#f1f5f9",
                          color: "#0369a1",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          fontSize: "0.75rem",
                          fontFamily: "monospace",
                          fontWeight: 600,
                        }}
                      >
                        {tag}
                      </code>
                    ))}
                  </div>
                </div>

                <textarea
                  className="form-control"
                  rows={12}
                  value={
                    settings["manifest_custom_html_template"] !== undefined
                      ? settings["manifest_custom_html_template"]
                      : DEFAULT_MANIFEST_SETTINGS.customHtmlTemplate
                  }
                  onChange={(e) =>
                    handleChange(
                      "manifest_custom_html_template",
                      e.target.value,
                    )
                  }
                  style={{
                    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                    fontSize: "0.82rem",
                    lineHeight: 1.45,
                    background: "#0f172a",
                    color: "#f8fafc",
                  }}
                  placeholder="<!DOCTYPE html><html>..."
                />
              </div>

              {/* Live Preview Card */}
              <div
                style={{
                  background: "#f8fafc",
                  padding: "20px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontSize: "0.98rem",
                        fontWeight: 700,
                        color: "var(--primary-deep)",
                        margin: 0,
                      }}
                    >
                      Pratinjau Dokumen Langsung (Live Preview)
                    </h4>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-muted)",
                        margin: "2px 0 0 0",
                      }}
                    >
                      Tampilan visual sesuai pengaturan dan preset yang sedang
                      Anda pilih di atas.
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    background: "#64748b",
                    padding: "16px",
                    borderRadius: "6px",
                    overflow: "auto",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <iframe
                    srcDoc={generateManifestHtml({
                      bookings: [
                        {
                          id: 1,
                          bookingCode: "GILI-2026-001",
                          customerName: "Ahmad Fauzi & Rombongan",
                          customerPhone: "+62 812-3456-7890",
                          packageName: "Private Glass Bottom Boat 3 Gili",
                          tripDate: new Date().toISOString().split("T")[0],
                          tripSession: "morning",
                          numberOfPeople: 4,
                          totalPriceIdr: 950000,
                          status: "confirmed",
                          pickupLocation: "Hotel Aston Sunset Gili T",
                          specialRequests: "Lifejacket anak 2 pcs",
                        },
                        {
                          id: 2,
                          bookingCode: "GILI-2026-002",
                          customerName: "Sarah Jenkins",
                          customerPhone: "+61 412 345 678",
                          packageName: "Public Sharing Trip Snorkeling",
                          tripDate: new Date().toISOString().split("T")[0],
                          tripSession: "morning",
                          numberOfPeople: 2,
                          totalPriceIdr: 300000,
                          status: "confirmed",
                          pickupLocation: "Meeting Point Dermaga",
                          specialRequests: "GoPro transfer to iPhone",
                        },
                        {
                          id: 3,
                          bookingCode: "GILI-2026-003",
                          customerName: "Rian Pratama",
                          customerPhone: "+62 878-1122-3344",
                          packageName: "Sunset Snorkeling Turtle Point",
                          tripDate: new Date().toISOString().split("T")[0],
                          tripSession: "morning",
                          numberOfPeople: 3,
                          totalPriceIdr: 450000,
                          status: "pending",
                          pickupLocation: "Villa Ombak",
                          specialRequests: "Fin size 42 & 38",
                        },
                      ],
                      boatName:
                        settings["manifest_default_boat"] ||
                        DEFAULT_MANIFEST_SETTINGS.defaultBoat,
                      captainName:
                        settings["manifest_default_captain"] ||
                        DEFAULT_MANIFEST_SETTINGS.defaultCaptain,
                      settings: {
                        companyName:
                          settings["manifest_company_name"] ||
                          DEFAULT_MANIFEST_SETTINGS.companyName,
                        subheader:
                          settings["manifest_subheader"] ||
                          DEFAULT_MANIFEST_SETTINGS.subheader,
                        phone:
                          settings["manifest_contact_info"] ||
                          settings["phone"] ||
                          DEFAULT_MANIFEST_SETTINGS.phone,
                        email:
                          settings["email"] || DEFAULT_MANIFEST_SETTINGS.email,
                        address:
                          settings["address"] ||
                          DEFAULT_MANIFEST_SETTINGS.address,
                        defaultBoat:
                          settings["manifest_default_boat"] ||
                          DEFAULT_MANIFEST_SETTINGS.defaultBoat,
                        defaultCaptain:
                          settings["manifest_default_captain"] ||
                          DEFAULT_MANIFEST_SETTINGS.defaultCaptain,
                        footerNotes:
                          settings["manifest_footer_notes"] ||
                          DEFAULT_MANIFEST_SETTINGS.footerNotes,
                        showEquipmentChecklist:
                          settings["manifest_show_equipment_checklist"] !==
                          "false",
                        showPickupNotes:
                          settings["manifest_show_pickup_notes"] !== "false",
                        showPrices:
                          settings["manifest_show_prices"] !== "false",
                        customHtmlTemplate:
                          settings["manifest_custom_html_template"] ||
                          DEFAULT_MANIFEST_SETTINGS.customHtmlTemplate,
                        preset:
                          (settings["manifest_default_preset"] as any) ||
                          "modern",
                      },
                      presetOverride:
                        (settings["manifest_default_preset"] as any) ||
                        "modern",
                    })}
                    title="Live Manifest Preview in Settings"
                    style={{
                      width:
                        settings["manifest_default_preset"] === "compact"
                          ? "740px"
                          : "960px",
                      maxWidth: "100%",
                      minHeight: "480px",
                      height: "520px",
                      background: "#ffffff",
                      border: "none",
                      borderRadius: "4px",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PAYMENT METHODS (QRIS & BANK TRANSFER) */}
          {activeTab === "payment" && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "8px",
                }}
              >
                <CreditCard size={22} color="var(--primary-ocean)" />
                <h3
                  style={{
                    fontSize: "1.25rem",
                    color: "var(--primary-deep)",
                    margin: 0,
                  }}
                >
                  Kelola Metode Pembayaran (QRIS & Transfer Bank)
                </h3>
              </div>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  marginBottom: "24px",
                }}
              >
                Atur informasi pembayaran manual yang akan ditampilkan kepada
                tamu saat reservasi online (QRIS Barcode, Nama Bank, Nomor
                Rekening, dan Pemilik Rekening).
              </p>

              {/* 1. QRIS SECTION */}
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid var(--border-light)",
                  borderRadius: "var(--radius-md)",
                  padding: "24px",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "10px",
                        background: "#dbeafe",
                        color: "#1d4ed8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <QrCode size={20} />
                    </div>
                    <div>
                      <h4
                        style={{
                          fontSize: "1rem",
                          color: "var(--primary-deep)",
                          margin: 0,
                          fontWeight: 700,
                        }}
                      >
                        1. Pembayaran QRIS (Scan & Pay)
                      </h4>
                      <span
                        style={{
                          fontSize: "0.78rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        Mendukung semua e-Wallet & Mobile Banking (BCA, Mandiri,
                        GoPay, OVO, Dana, ShopeePay)
                      </span>
                    </div>
                  </div>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                      fontSize: "0.88rem",
                      fontWeight: 600,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={settings["payment_qris_active"] !== "false"}
                      onChange={async (e) => {
                        const newVal = e.target.checked ? "true" : "false";
                        handleChange("payment_qris_active", newVal);
                        try {
                          await fetch("/api/settings", {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              key: "payment_qris_active",
                              value: newVal,
                            }),
                          });
                          toast.success(
                            newVal === "true"
                              ? "Opsi QRIS berhasil diaktifkan!"
                              : "Opsi QRIS berhasil dinonaktifkan!",
                          );
                        } catch (err) {
                          console.warn("Failed to auto-save QRIS toggle:", err);
                        }
                      }}
                      style={{
                        width: "18px",
                        height: "18px",
                        accentColor: "var(--primary-ocean)",
                      }}
                    />
                    <span>Aktifkan Opsi QRIS</span>
                  </label>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {/* Merchant Name */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">
                      Nama Merchant / Akun QRIS
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings["payment_qris_name"] || ""}
                      onChange={(e) =>
                        handleChange("payment_qris_name", e.target.value)
                      }
                      placeholder="e.g. Trip Snorkeling Gili Trawangan"
                    />
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      Nama bisnis yang muncul di aplikasi pembayaran saat tamu
                      scan QR code
                    </span>
                  </div>

                  {/* QRIS Image Uploader */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">
                      Upload Gambar QR Code QRIS
                    </label>
                    <input
                      ref={qrisFileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setIsUploadingQris(true);
                        const toastId = toast.loading(
                          "Mengompres & mengupload barcode QRIS...",
                        );
                        try {
                          // Compress and store the QR in object storage. A
                          // failure throws: previously this fell back to an
                          // inline base64 data URL, which is what filled the
                          // database with image payloads.
                          const finalUrl = await compressAndUpload(
                            file,
                            "/api/upload",
                            QR_COMPRESSION,
                          );

                          // Persist the URL into the settings table
                          handleChange("payment_qris_image", finalUrl);
                          await fetch("/api/settings", {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              key: "payment_qris_image",
                              value: finalUrl,
                            }),
                          });

                          toast.success(
                            "Barcode QRIS berhasil diunggah dan tersimpan aktif!",
                            { id: toastId },
                          );
                        } catch (err: any) {
                          console.error("QRIS Upload error:", err);
                          toast.error(err.message || "Upload gagal", {
                            id: toastId,
                          });
                        } finally {
                          setIsUploadingQris(false);
                          if (qrisFileInputRef.current) {
                            qrisFileInputRef.current.value = "";
                          }
                        }
                      }}
                    />

                    {settings["payment_qris_image"] ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          background: "#ffffff",
                          padding: "10px 14px",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--border-light)",
                        }}
                      >
                        <img
                          src={settings["payment_qris_image"]}
                          alt="QRIS Preview"
                          style={{
                            width: "64px",
                            height: "64px",
                            objectFit: "contain",
                            borderRadius: "6px",
                            border: "1px solid #e2e8f0",
                            background: "#ffffff",
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <span
                            style={{
                              fontSize: "0.82rem",
                              fontWeight: 600,
                              color: "var(--primary-deep)",
                              display: "block",
                            }}
                          >
                            Gambar Barcode Aktif
                          </span>
                          <span
                            style={{
                              fontSize: "0.72rem",
                              color: "var(--text-muted)",
                            }}
                          >
                            QRIS siap discan oleh tamu di halaman reservasi
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            type="button"
                            onClick={() => qrisFileInputRef.current?.click()}
                            disabled={isUploadingQris}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: "6px 10px", fontSize: "0.78rem" }}
                          >
                            Ganti
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              handleChange("payment_qris_image", "");
                              try {
                                await fetch("/api/settings", {
                                  method: "PUT",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    key: "payment_qris_image",
                                    value: "",
                                  }),
                                });
                                toast.success("Barcode QRIS berhasil dihapus");
                              } catch (err) {
                                console.warn(
                                  "Could not auto-delete QRIS setting:",
                                  err,
                                );
                              }
                            }}
                            className="btn btn-danger btn-sm"
                            style={{ padding: "6px 10px", fontSize: "0.78rem" }}
                            title="Hapus Barcode"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => qrisFileInputRef.current?.click()}
                        disabled={isUploadingQris}
                        style={{
                          width: "100%",
                          padding: "24px",
                          borderRadius: "var(--radius-sm)",
                          border: "2px dashed var(--primary-ocean)",
                          background: "#ffffff",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "8px",
                          color: "var(--primary-ocean)",
                        }}
                      >
                        {isUploadingQris ? (
                          <Loader2
                            size={24}
                            style={{ animation: "spin 1s linear infinite" }}
                          />
                        ) : (
                          <Upload size={24} />
                        )}
                        <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>
                          {isUploadingQris
                            ? "Mengupload Gambar..."
                            : "Klik untuk Upload Gambar Barcode QRIS (PNG/JPG)"}
                        </span>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          File akan disimpan dan ditampilkan langsung saat tamu
                          memilih opsi QRIS
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. BANK TRANSFER SECTION */}
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid var(--border-light)",
                  borderRadius: "var(--radius-md)",
                  padding: "24px",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "10px",
                        background: "#fef3c7",
                        color: "#b45309",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h4
                        style={{
                          fontSize: "1rem",
                          color: "var(--primary-deep)",
                          margin: 0,
                          fontWeight: 700,
                        }}
                      >
                        2. Transfer Rekening Bank (Manual Transfer)
                      </h4>
                      <span
                        style={{
                          fontSize: "0.78rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        Informasi rekening tujuan transfer untuk tamu yang
                        memilih metode transfer bank
                      </span>
                    </div>
                  </div>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                      fontSize: "0.88rem",
                      fontWeight: 600,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={settings["payment_bank_active"] !== "false"}
                      onChange={async (e) => {
                        const newVal = e.target.checked ? "true" : "false";
                        handleChange("payment_bank_active", newVal);
                        try {
                          await fetch("/api/settings", {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              key: "payment_bank_active",
                              value: newVal,
                            }),
                          });
                          toast.success(
                            newVal === "true"
                              ? "Opsi Transfer Bank berhasil diaktifkan!"
                              : "Opsi Transfer Bank berhasil dinonaktifkan!",
                          );
                        } catch (err) {
                          console.warn("Failed to auto-save Bank toggle:", err);
                        }
                      }}
                      style={{
                        width: "18px",
                        height: "18px",
                        accentColor: "var(--primary-ocean)",
                      }}
                    />
                    <span>Aktifkan Opsi Transfer Bank</span>
                  </label>
                </div>

                {bankAccounts.length === 0 && (
                  <div
                    style={{
                      padding: "22px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px dashed var(--border-light)",
                      background: "#ffffff",
                      textAlign: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <Building2
                      size={26}
                      color="var(--text-muted)"
                      style={{ marginBottom: "8px" }}
                    />
                    <p
                      style={{
                        fontSize: "0.86rem",
                        color: "var(--text-muted)",
                        margin: 0,
                      }}
                    >
                      Belum ada rekening bank. Tambahkan minimal satu rekening
                      agar opsi transfer bank tampil di halaman booking.
                    </p>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                    marginBottom: "16px",
                  }}
                >
                  {bankAccounts.map((bank, index) => (
                    <div
                      key={bank.id}
                      style={{
                        border: bank.isActive
                          ? "1px solid rgba(0, 119, 182, 0.28)"
                          : "1px dashed var(--border-light)",
                        borderRadius: "var(--radius-sm)",
                        background: bank.isActive ? "#ffffff" : "#f8fafc",
                        padding: "16px 18px",
                        opacity: bank.isActive ? 1 : 0.75,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "10px",
                          flexWrap: "wrap",
                          marginBottom: "14px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontWeight: 700,
                            fontSize: "0.9rem",
                            color: "var(--primary-deep)",
                          }}
                        >
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "24px",
                              height: "24px",
                              borderRadius: "50%",
                              background: "var(--primary-surface)",
                              color: "var(--primary-ocean)",
                              fontSize: "0.75rem",
                            }}
                          >
                            {index + 1}
                          </span>
                          <span>{bank.bankName || "Rekening Baru"}</span>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <label
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              marginRight: "4px",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={bank.isActive}
                              onChange={(e) =>
                                updateBankAccount(
                                  bank.id,
                                  "isActive",
                                  e.target.checked,
                                )
                              }
                              style={{
                                width: "16px",
                                height: "16px",
                                accentColor: "var(--primary-ocean)",
                              }}
                            />
                            <span>Tampilkan</span>
                          </label>

                          <button
                            type="button"
                            onClick={() => moveBankAccount(index, -1)}
                            disabled={index === 0}
                            title="Pindah ke atas"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              padding: "5px 8px",
                              borderRadius: "6px",
                              border: "1px solid var(--border-light)",
                              background: "#ffffff",
                              color: "var(--primary-deep)",
                              cursor: index === 0 ? "not-allowed" : "pointer",
                              opacity: index === 0 ? 0.4 : 1,
                            }}
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveBankAccount(index, 1)}
                            disabled={index === bankAccounts.length - 1}
                            title="Pindah ke bawah"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              padding: "5px 8px",
                              borderRadius: "6px",
                              border: "1px solid var(--border-light)",
                              background: "#ffffff",
                              color: "var(--primary-deep)",
                              cursor:
                                index === bankAccounts.length - 1
                                  ? "not-allowed"
                                  : "pointer",
                              opacity:
                                index === bankAccounts.length - 1 ? 0.4 : 1,
                            }}
                          >
                            <ChevronDown size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeBankAccount(bank.id)}
                            title="Hapus rekening"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              padding: "5px 8px",
                              borderRadius: "6px",
                              border: "1px solid #fecaca",
                              background: "#fef2f2",
                              color: "#dc2626",
                              cursor: "pointer",
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(220px, 1fr))",
                          gap: "14px",
                          marginBottom: "12px",
                        }}
                      >
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label">Nama Bank</label>
                          <input
                            type="text"
                            className="form-control"
                            value={bank.bankName}
                            onChange={(e) =>
                              updateBankAccount(
                                bank.id,
                                "bankName",
                                e.target.value,
                              )
                            }
                            placeholder="e.g. Bank Central Asia (BCA) / Mandiri / BRI"
                          />
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label">Nomor Rekening</label>
                          <input
                            type="text"
                            className="form-control"
                            value={bank.accountNumber}
                            onChange={(e) =>
                              updateBankAccount(
                                bank.id,
                                "accountNumber",
                                e.target.value,
                              )
                            }
                            placeholder="e.g. 8735-0123-4567"
                          />
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label">
                            Nama Pemilik (Atas Nama)
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={bank.accountHolder}
                            onChange={(e) =>
                              updateBankAccount(
                                bank.id,
                                "accountHolder",
                                e.target.value,
                              )
                            }
                            placeholder="e.g. Trip Snorkeling Gili"
                          />
                        </div>
                      </div>

                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">
                          Catatan Khusus Rekening Ini (Opsional)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={bank.notes || ""}
                          onChange={(e) =>
                            updateBankAccount(bank.id, "notes", e.target.value)
                          }
                          placeholder="e.g. Khusus transfer dari luar negeri (SWIFT: CENAIDJA)"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addBankAccount}
                  className="btn btn-secondary btn-sm"
                  style={{ marginBottom: "18px" }}
                >
                  <Plus size={16} />
                  <span>Tambah Rekening Bank</span>
                </button>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">
                    Petunjuk / Catatan Transfer untuk Tamu (Berlaku untuk Semua
                    Rekening)
                  </label>
                  <textarea
                    rows={2}
                    className="form-control"
                    value={settings["payment_bank_notes"] || ""}
                    onChange={(e) =>
                      handleChange("payment_bank_notes", e.target.value)
                    }
                    placeholder="e.g. Mohon cantumkan Kode Booking pada berita transfer. Upload bukti transfer setelah melakukan pembayaran."
                  />
                </div>
              </div>

              {/* Display Currency & Exchange Rates */}
              <div
                style={{
                  border: "1px solid var(--border-light)",
                  borderRadius: "var(--radius-md)",
                  padding: "20px",
                  background: "#f8fafc",
                  marginTop: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "10px",
                      background: "#dcfce7",
                      color: "#15803d",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Wallet size={20} />
                  </div>
                  <div>
                    <h4
                      style={{
                        fontSize: "1rem",
                        color: "var(--primary-deep)",
                        margin: 0,
                        fontWeight: 700,
                      }}
                    >
                      3. Mata Uang Tampilan Website (IDR / USD / EUR)
                    </h4>
                    <span
                      style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}
                    >
                      Tamu dapat mengganti mata uang lewat tombol di navbar.
                      Kurs di bawah hanya dipakai sebagai cadangan jika harga
                      paket belum diisi manual.
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "16px",
                  }}
                >
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">
                      Mata Uang Default Pengunjung Baru
                    </label>
                    <select
                      className="form-control"
                      value={settings["default_currency"] || "USD"}
                      onChange={(e) =>
                        handleChange("default_currency", e.target.value)
                      }
                    >
                      <option value="USD">USD — US Dollar ($)</option>
                      <option value="EUR">EUR — Euro (€)</option>
                      <option value="IDR">IDR — Rupiah (Rp)</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">
                      Kurs Cadangan USD (Rp per $1)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings["currency_usd_rate"] || ""}
                      onChange={(e) =>
                        handleChange(
                          "currency_usd_rate",
                          e.target.value.replace(/[^0-9]/g, ""),
                        )
                      }
                      placeholder="15500"
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">
                      Kurs Cadangan EUR (Rp per €1)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings["currency_eur_rate"] || ""}
                      onChange={(e) =>
                        handleChange(
                          "currency_eur_rate",
                          e.target.value.replace(/[^0-9]/g, ""),
                        )
                      }
                      placeholder="17500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SECURITY & ADMIN ACCOUNT */}
          {activeTab === "security" && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "8px",
                }}
              >
                <ShieldCheck size={22} color="var(--primary-ocean)" />
                <h3
                  style={{
                    fontSize: "1.25rem",
                    color: "var(--primary-deep)",
                    margin: 0,
                  }}
                >
                  Keamanan Akun & Kredensial Admin
                </h3>
              </div>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  marginBottom: "24px",
                }}
              >
                Ubah email login, nama profil admin, serta perbarui password
                akun secara aman di database Neon PostgreSQL (Terenkripsi
                Bcrypt).
              </p>

              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid var(--border-light)",
                  borderRadius: "var(--radius-md)",
                  padding: "24px",
                  marginBottom: "24px",
                }}
              >
                <h4
                  style={{
                    fontSize: "1rem",
                    color: "var(--primary-deep)",
                    marginTop: 0,
                    marginBottom: "16px",
                    fontWeight: 700,
                  }}
                >
                  1. Informasi Profil Admin
                </h4>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                    marginBottom: "16px",
                  }}
                >
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Nama Admin</label>
                    <input
                      type="text"
                      className="form-control"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      placeholder="Admin Trip Snorkeling"
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Email Login Admin *</label>
                    <input
                      type="email"
                      className="form-control"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@skt.com"
                      required
                    />
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid var(--border-light)",
                  borderRadius: "var(--radius-md)",
                  padding: "24px",
                  marginBottom: "24px",
                }}
              >
                <h4
                  style={{
                    fontSize: "1rem",
                    color: "var(--primary-deep)",
                    marginTop: 0,
                    marginBottom: "16px",
                    fontWeight: 700,
                  }}
                >
                  2. Perbarui Password
                </h4>

                <div className="form-group" style={{ marginBottom: "16px" }}>
                  <label className="form-label">
                    Password Saat Ini (Wajib diisi untuk konfirmasi) *
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Masukkan password admin saat ini"
                  />
                  <span
                    style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}
                  >
                    Default awal: admin123
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}
                >
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">
                      Password Baru (Opsional)
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                    />
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      Kosongkan jika hanya ingin mengubah nama/email
                    </span>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Ulangi Password Baru</label>
                    <input
                      type="password"
                      className="form-control"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Ketik ulang password baru"
                    />
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  paddingTop: "12px",
                }}
              >
                <button
                  type="button"
                  onClick={handleUpdateSecurity}
                  disabled={isChangingPass || !currentPassword}
                  className="btn btn-primary btn-lg"
                  style={{
                    opacity: isChangingPass || !currentPassword ? 0.7 : 1,
                    cursor:
                      isChangingPass || !currentPassword
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {isChangingPass ? (
                    <Loader2
                      size={18}
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                  ) : (
                    <Lock size={18} />
                  )}
                  <span>
                    {isChangingPass
                      ? "Memperbarui Akun..."
                      : "Simpan Kredensial Akun"}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Submit Button for Tabs 1-5 */}
          {activeTab !== "security" && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "28px",
                paddingTop: "20px",
                borderTop: "1px solid var(--border-light)",
              }}
            >
              <button
                type="submit"
                disabled={isSaving}
                className="btn btn-primary btn-lg"
                style={{
                  opacity: isSaving ? 0.85 : 1,
                  cursor: isSaving ? "not-allowed" : "pointer",
                }}
              >
                {isSaving ? (
                  <Loader2
                    size={18}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                ) : (
                  <Save size={18} />
                )}
                <span>
                  {isSaving ? "Menyimpan..." : "Simpan Semua Pengaturan"}
                </span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
