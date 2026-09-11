"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Waves, MapPin, Phone, Mail, MessageCircle, Lock, Globe } from "lucide-react";
import BrandLogo from "@/components/common/BrandLogo";

export default function Footer({
  siteSettings,
  packages = [],
}: {
  siteSettings?: any[];
  packages?: any[];
}) {
  const tNav = useTranslations("nav");
  const tFooter = useTranslations("footer");

  const getSetting = (key: string, fallback: string) => {
    if (!siteSettings) return fallback;
    const found = siteSettings.find((s) => s.key === key);
    return found?.value || fallback;
  };

  const siteName = getSetting("site_name", "SNORKELING GILI");
  const siteTagline = getSetting("tagline", "Gili Trawangan • 3 Gili");
  const siteLogo = getSetting("site_logo", "");
  const siteLogoType = getSetting("site_logo_type", "preset");
  const siteLogoPreset = getSetting("site_logo_preset", "waves");
  const siteLogoColor = getSetting("site_logo_color", "ocean");

  const whatsapp = getSetting("whatsapp_number", "6282236851307");
  const phone = getSetting("phone", "+62 822-3685-1307");
  const email = getSetting("email", "info@snorkelinggilitrawangan.com");
  const address = getSetting(
    "address",
    "Jl. Pantai Gili Trawangan, Pemenang, Lombok Utara, NTB, Indonesia",
  );

  // Social profiles are optional: only the links filled in by admin are rendered
  const socialLinks = [
    { key: "instagram", label: "Instagram", url: getSetting("instagram_url", "") },
    { key: "facebook", label: "Facebook", url: getSetting("facebook_url", "") },
    { key: "tiktok", label: "TikTok", url: getSetting("tiktok_url", "") },
    { key: "youtube", label: "YouTube", url: getSetting("youtube_url", "") },
    { key: "tripadvisor", label: "TripAdvisor", url: getSetting("tripadvisor_url", "") },
  ].filter((item) => item.url.trim() !== "");

  const socialIconStyle: React.CSSProperties = {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.1)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    transition: "transform 0.2s",
  };

  const renderSocialIcon = (key: string) => {
    switch (key) {
      case "instagram":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
          </svg>
        );
      case "facebook":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
        );
      case "tiktok":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 1 1 .77-5.06V9.68a5.67 5.67 0 0 0-.77-.05 5.68 5.68 0 1 0 5.68 5.68V8.9a7.35 7.35 0 0 0 4.28 1.38V7.19a4.28 4.28 0 0 1-3.22-1.37Z" />
          </svg>
        );
      case "youtube":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23 12s0-3.5-.45-5.17a2.9 2.9 0 0 0-2.04-2.05C18.85 4.33 12 4.33 12 4.33s-6.85 0-8.51.45A2.9 2.9 0 0 0 1.45 6.83C1 8.5 1 12 1 12s0 3.5.45 5.17a2.9 2.9 0 0 0 2.04 2.05c1.66.45 8.51.45 8.51.45s6.85 0 8.51-.45a2.9 2.9 0 0 0 2.04-2.05C23 15.5 23 12 23 12ZM9.8 15.3V8.7l5.7 3.3-5.7 3.3Z" />
          </svg>
        );
      default:
        return <Globe size={18} />;
    }
  };

  return (
    <footer
      style={{
        backgroundColor: "var(--primary-deep)",
        color: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top Banner Wave SVG */}
      <div
        style={{
          width: "100%",
          overflow: "hidden",
          lineHeight: 0,
          fill: "#ffffff",
        }}
      >
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{
            position: "relative",
            display: "block",
            width: "calc(100% + 1.3px)",
            height: "40px",
          }}
        >
          <path
            d="M0,0 C150,90 350,-40 500,40 C650,120 900,10 1200,40 L1200,0 L0,0 Z"
            fill="#ffffff"
          ></path>
        </svg>
      </div>

      <div
        className="container"
        style={{ paddingTop: "50px", paddingBottom: "50px" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "40px",
            marginBottom: "50px",
          }}
        >
          {/* Column 1: Brand & Bio */}
          <div>
            <div style={{ marginBottom: "20px" }}>
              <BrandLogo
                siteName={siteName}
                tagline={siteTagline}
                logoUrl={siteLogo}
                logoType={siteLogoType}
                logoPreset={siteLogoPreset}
                logoColor={siteLogoColor}
                variant="dark"
                size="md"
              />
            </div>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "0.9rem",
                lineHeight: "1.7",
                marginBottom: "20px",
              }}
            >
              {tFooter("aboutText")}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  background: "rgba(37, 211, 102, 0.2)",
                  color: "#25d366",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(37, 211, 102, 0.4)",
                  transition: "transform 0.2s",
                }}
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
              {socialLinks.map((item) => (
                <a
                  key={item.key}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  style={socialIconStyle}
                  aria-label={item.label}
                  title={item.label}
                >
                  {renderSocialIcon(item.key)}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4
              style={{
                color: "#ffffff",
                fontSize: "1.05rem",
                marginBottom: "20px",
                letterSpacing: "-0.01em",
              }}
            >
              {tFooter("quickLinks")}
            </h4>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <li>
                <Link
                  href="/"
                  style={{
                    color: "#94a3b8",
                    fontSize: "0.9rem",
                    transition: "color 0.2s",
                  }}
                >
                  {tNav("home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/paket"
                  style={{
                    color: "#94a3b8",
                    fontSize: "0.9rem",
                    transition: "color 0.2s",
                  }}
                >
                  {tNav("packages")}
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  style={{
                    color: "#94a3b8",
                    fontSize: "0.9rem",
                    transition: "color 0.2s",
                  }}
                >
                  {tNav("gallery")}
                </Link>
              </li>
              <li>
                <Link
                  href="/tentang"
                  style={{
                    color: "#94a3b8",
                    fontSize: "0.9rem",
                    transition: "color 0.2s",
                  }}
                >
                  {tNav("about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  style={{
                    color: "#94a3b8",
                    fontSize: "0.9rem",
                    transition: "color 0.2s",
                  }}
                >
                  {tNav("faq")}
                </Link>
              </li>
              <li>
                <Link
                  href="/booking"
                  style={{
                    color: "var(--primary-turquoise)",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                >
                  {tNav("bookNow")} →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Featured Tours */}
          <div>
            <h4
              style={{
                color: "#ffffff",
                fontSize: "1.05rem",
                marginBottom: "20px",
                letterSpacing: "-0.01em",
              }}
            >
              {tFooter("popularTours")}
            </h4>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {packages && packages.length > 0 ? (
                packages.slice(0, 5).map((pkg) => (
                  <li key={pkg.id || pkg.slug}>
                    <Link
                      href={`/paket/${pkg.slug}`}
                      style={{ color: "#94a3b8", fontSize: "0.9rem" }}
                    >
                      {pkg.nameEn || pkg.nameId}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link
                      href="/paket/public-sharing-trip-3-gili"
                      style={{ color: "#94a3b8", fontSize: "0.9rem" }}
                    >
                      Public Sharing Trip (3 Gili)
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/paket/private-glass-bottom-boat"
                      style={{ color: "#94a3b8", fontSize: "0.9rem" }}
                    >
                      Private Glass Bottom Boat
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/paket/sunset-snorkeling-private-tour"
                      style={{ color: "#94a3b8", fontSize: "0.9rem" }}
                    >
                      Sunset Snorkeling Tour
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/paket/speed-boat-snorkeling-lombok-gili"
                      style={{ color: "#94a3b8", fontSize: "0.9rem" }}
                    >
                      Speedboat Lombok - 3 Gili
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Column 4: Contact & Meeting Point */}
          <div>
            <h4
              style={{
                color: "#ffffff",
                fontSize: "1.05rem",
                marginBottom: "20px",
                letterSpacing: "-0.01em",
              }}
            >
              {tFooter("contactUs")}
            </h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <MapPin
                  size={18}
                  color="var(--primary-turquoise)"
                  style={{ flexShrink: 0, marginTop: "3px" }}
                />
                <span
                  style={{
                    color: "#94a3b8",
                    fontSize: "0.88rem",
                    lineHeight: "1.5",
                  }}
                >
                  {address}
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <Phone
                  size={18}
                  color="var(--primary-turquoise)"
                  style={{ flexShrink: 0 }}
                />
                <a
                  href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                  style={{ color: "#94a3b8", fontSize: "0.88rem" }}
                >
                  {phone}
                </a>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <Mail
                  size={18}
                  color="var(--primary-turquoise)"
                  style={{ flexShrink: 0 }}
                />
                <a
                  href={`mailto:${email}`}
                  style={{ color: "#94a3b8", fontSize: "0.88rem" }}
                >
                  {email}
                </a>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <MessageCircle
                  size={18}
                  color="#25d366"
                  style={{ flexShrink: 0 }}
                />
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "#25d366",
                    fontWeight: 600,
                    fontSize: "0.88rem",
                  }}
                >
                  WhatsApp: +{whatsapp}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0 }}>
            © {new Date().getFullYear()} Trip Snorkeling Gili Trawangan.{" "}
            {tFooter("rights")}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <a
              href="/admin"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "#64748b",
                fontSize: "0.8rem",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
            >
              <Lock size={13} />
              Admin Portal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
