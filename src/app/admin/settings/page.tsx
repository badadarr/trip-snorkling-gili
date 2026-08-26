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
} from "lucide-react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const toastId = toast.loading("Menyimpan pengaturan website...");

    try {
      const promises = Object.entries(settings).map(([key, value]) =>
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
        }}
      >
        <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
        <span>Memuat pengaturan website...</span>
      </div>
    );
  }

  return (
    <div>
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
            Pengaturan Kontak & Website
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Atur nomor WhatsApp, telepon, email, lokasi meeting point, dan akun
            sosial media.
          </p>
        </div>
      </div>

      <div
        className="glass-card"
        style={{ padding: "36px", background: "#ffffff" }}
      >
        <form onSubmit={handleSubmit}>
          {/* WhatsApp & Phone */}
          <h3
            style={{
              fontSize: "1.15rem",
              color: "var(--primary-deep)",
              marginBottom: "16px",
              borderBottom: "1px solid var(--border-light)",
              paddingBottom: "8px",
            }}
          >
            Kontak Langsung & WhatsApp
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <div className="form-group">
              <label className="form-label">
                Nomor WhatsApp Utama (Format: 628xxx)
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
            </div>

            <div className="form-group">
              <label className="form-label">Nomor Telepon Display</label>
              <input
                type="text"
                className="form-control"
                value={settings["phone"] || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+62 859-2135-8615"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "28px" }}>
            <label className="form-label">Alamat Email Bisnis</label>
            <input
              type="email"
              className="form-control"
              value={settings["email"] || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="info@snorkelinggilitrawangan.com"
            />
          </div>

          {/* Meeting Point Address */}
          <h3
            style={{
              fontSize: "1.15rem",
              color: "var(--primary-deep)",
              marginBottom: "16px",
              borderBottom: "1px solid var(--border-light)",
              paddingBottom: "8px",
            }}
          >
            Lokasi & Meeting Point
          </h3>

          <div className="form-group" style={{ marginBottom: "28px" }}>
            <label className="form-label">
              Alamat Lengkap Kantor / Meeting Point
            </label>
            <textarea
              className="form-control"
              rows={3}
              value={settings["address"] || ""}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Jl. Pantai Gili Trawangan..."
            />
          </div>

          {/* Social Media & Maps */}
          <h3
            style={{
              fontSize: "1.15rem",
              color: "var(--primary-deep)",
              marginBottom: "16px",
              borderBottom: "1px solid var(--border-light)",
              paddingBottom: "8px",
            }}
          >
            Social Media & Google Maps
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <div className="form-group">
              <label className="form-label">Link Instagram</label>
              <input
                type="url"
                className="form-control"
                value={settings["instagram_url"] || ""}
                onChange={(e) => handleChange("instagram_url", e.target.value)}
                placeholder="https://instagram.com/..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Link Facebook</label>
              <input
                type="url"
                className="form-control"
                value={settings["facebook_url"] || ""}
                onChange={(e) => handleChange("facebook_url", e.target.value)}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "28px",
            }}
          >
            <div className="form-group">
              <label className="form-label">Link TikTok</label>
              <input
                type="url"
                className="form-control"
                value={settings["tiktok_url"] || ""}
                onChange={(e) => handleChange("tiktok_url", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Link Google Maps Meeting Point
              </label>
              <input
                type="url"
                className="form-control"
                value={settings["google_maps_url"] || ""}
                onChange={(e) =>
                  handleChange("google_maps_url", e.target.value)
                }
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "20px",
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
        </form>
      </div>
    </div>
  );
}
