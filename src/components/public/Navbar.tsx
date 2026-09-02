"use client";

import React, { useState, useEffect, useTransition } from "react";
import { createPortal } from "react-dom";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import LanguageSwitcher, {
  SUPPORTED_LANGUAGES,
  LanguageOption,
} from "@/components/public/LanguageSwitcher";
import {
  Waves,
  Menu,
  X,
  Calendar,
  Lock,
  Home,
  Compass,
  Camera,
  Info,
  HelpCircle,
  MessageCircle,
  ChevronRight,
  Globe,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface NavbarProps {
  whatsappNumber?: string;
}

export default function Navbar({
  whatsappNumber = "6282236851307",
}: NavbarProps) {
  const t = useTranslations("nav");
  const tCta = useTranslations("cta");
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Detect scroll to style navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: t("home"), icon: Home },
    { href: "/paket", label: t("packages"), icon: Compass, badge: "Popular" },
    { href: "/gallery", label: t("gallery"), icon: Camera },
    { href: "/tentang", label: t("about"), icon: Info },
    { href: "/faq", label: t("faq"), icon: HelpCircle },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" || pathname === "";
    return pathname.startsWith(href);
  };

  const handleSwitchLanguage = (lang: LanguageOption) => {
    if (!lang.isAvailable) {
      if (lang.code === "id") {
        toast.info(
          "🇮🇩 Versi Bahasa Indonesia sedang dalam proses pengembangan (In Progress).",
        );
      } else if (lang.code === "de") {
        toast.info("🇩🇪 Deutsche Version ist in Vorbereitung (In Progress).");
      } else if (lang.code === "es") {
        toast.info(
          "🇪🇸 La versión en Español está en desarrollo (In Progress).",
        );
      } else {
        toast.info(`${lang.label} translation is currently in progress.`);
      }
      return;
    }

    if (lang.code === locale || isPending) return;
    startTransition(() => {
      router.replace(pathname, { locale: lang.code as any });
    });
  };

  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, "");
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    locale === "id"
      ? "Halo Admin Trip Snorkeling Gili! Saya ingin bertanya mengenai paket trip."
      : "Hello Admin Gili Snorkeling Trip! I would like to inquire about tour packages.",
  )}`;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        backgroundColor: isScrolled
          ? "rgba(255, 255, 255, 0.96)"
          : "rgba(255, 255, 255, 0.90)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: isScrolled
          ? "1px solid rgba(0, 119, 182, 0.15)"
          : "1px solid rgba(255, 255, 255, 0.6)",
        boxShadow: isScrolled
          ? "0 6px 24px rgba(0, 50, 100, 0.08)"
          : "0 2px 10px rgba(0, 50, 100, 0.02)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "74px",
        }}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background:
                "linear-gradient(135deg, var(--primary-ocean) 0%, var(--primary-turquoise) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0, 119, 182, 0.28)",
              flexShrink: 0,
            }}
          >
            <Waves color="#ffffff" size={22} strokeWidth={2.4} />
          </div>
          <div>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                fontSize: "1.15rem",
                color: "var(--primary-deep)",
                letterSpacing: "-0.02em",
                display: "block",
                lineHeight: 1.1,
              }}
            >
              SNORKELING{" "}
              <span style={{ color: "var(--primary-turquoise)" }}>GILI</span>
            </span>
            <span
              style={{
                fontSize: "0.66rem",
                fontWeight: 600,
                color: "var(--primary-ocean)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                display: "block",
                marginTop: "2px",
              }}
            >
              Gili Trawangan • 3 Gili
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: "none",
            alignItems: "center",
            gap: "24px",
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontWeight: active ? 700 : 600,
                  fontSize: "0.92rem",
                  color: active
                    ? "var(--primary-ocean)"
                    : "var(--primary-deep)",
                  textDecoration: "none",
                  position: "relative",
                  padding: "8px 4px",
                  transition: "color 0.2s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span
                    style={{
                      fontSize: "0.65rem",
                      padding: "1px 6px",
                      borderRadius: "var(--radius-full)",
                      background: "#fef3c7",
                      color: "#b45309",
                      fontWeight: 700,
                    }}
                  >
                    {link.badge}
                  </span>
                )}
                {active && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: "4px",
                      right: "4px",
                      height: "2.5px",
                      borderRadius: "2px",
                      background: "var(--primary-ocean)",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Right Action Area */}
        <div
          style={{
            display: "none",
            alignItems: "center",
            gap: "14px",
          }}
          className="desktop-actions"
        >
          <LanguageSwitcher />

          <Link
            href="/booking"
            className="btn btn-primary btn-sm"
            style={{
              padding: "10px 18px",
              fontSize: "0.88rem",
              boxShadow: "0 4px 14px rgba(0, 180, 216, 0.25)",
            }}
          >
            <Calendar size={15} />
            <span>{t("bookNow")}</span>
          </Link>
        </div>

        {/* Mobile Header Right (Hamburger Button) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          className="mobile-toggle-group"
        >
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              border: "1.5px solid var(--border-light)",
              background: "#ffffff",
              cursor: "pointer",
              color: "var(--primary-deep)",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 8px rgba(0, 50, 100, 0.08)",
            }}
            aria-label="Open navigation menu"
          >
            <Menu size={22} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 📱 MODERN MOBILE SLIDE-OVER DRAWER VIA PORTAL */}
      {/* ========================================================================= */}
      {mounted &&
        mobileMenuOpen &&
        createPortal(
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 999999,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            {/* Backdrop Dimmer */}
            <div
              onClick={() => setMobileMenuOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(10, 37, 64, 0.65)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                animation: "mobileBackdropIn 0.25s ease-out forwards",
              }}
            />

            {/* Slide-over White Card Drawer */}
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "340px",
                height: "100%",
                background: "#ffffff",
                boxShadow: "-12px 0 40px rgba(0, 0, 0, 0.25)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "24px 20px",
                overflowY: "auto",
                zIndex: 10,
                animation:
                  "mobileDrawerSlide 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              }}
            >
              {/* Top Drawer Header with Logo & Close Button */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingBottom: "16px",
                    borderBottom: "1px solid var(--border-light)",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "10px",
                        background:
                          "linear-gradient(135deg, var(--primary-ocean) 0%, var(--primary-turquoise) 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#ffffff",
                      }}
                    >
                      <Waves size={18} />
                    </div>
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: "1rem",
                        color: "var(--primary-deep)",
                      }}
                    >
                      SNORKELING{" "}
                      <span style={{ color: "var(--primary-turquoise)" }}>
                        GILI
                      </span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: "var(--bg-alt)",
                      border: "1px solid var(--border-light)",
                      color: "var(--text-muted)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                    aria-label="Close navigation menu"
                  >
                    <X size={18} strokeWidth={2.5} />
                  </button>
                </div>

                {/* Multilingual Selector Grid */}
                <div style={{ marginBottom: "20px" }}>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Globe size={12} color="var(--primary-ocean)" />
                    <span>Language / Bahasa</span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "6px",
                    }}
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => {
                      const isSelected =
                        locale === lang.code && lang.isAvailable;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => handleSwitchLanguage(lang)}
                          disabled={isPending}
                          style={{
                            padding: "8px 10px",
                            borderRadius: "var(--radius-sm)",
                            border: isSelected
                              ? "1.5px solid var(--primary-ocean)"
                              : "1px solid var(--border-light)",
                            background: isSelected
                              ? "var(--primary-surface)"
                              : "var(--bg-alt)",
                            color: isSelected
                              ? "var(--primary-ocean)"
                              : "var(--primary-deep)",
                            fontWeight: isSelected ? 700 : 500,
                            fontSize: "0.78rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "4px",
                            textAlign: "left",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <span>{lang.flag}</span>
                            <span style={{ fontSize: "0.76rem" }}>
                              {lang.nativeLabel}
                            </span>
                          </div>

                          {lang.statusBadge ? (
                            <span
                              style={{
                                fontSize: "0.6rem",
                                fontWeight: 700,
                                padding: "1px 4px",
                                borderRadius: "var(--radius-full)",
                                background: "#fef3c7",
                                color: "#b45309",
                                lineHeight: 1.2,
                              }}
                            >
                              Soon
                            </span>
                          ) : isSelected ? (
                            <Check
                              size={12}
                              color="var(--primary-ocean)"
                              strokeWidth={2.5}
                            />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Navigation Links List */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {navLinks.map((link) => {
                    const active = isActive(link.href);
                    const IconComponent = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "12px 14px",
                          borderRadius: "var(--radius-sm)",
                          background: active
                            ? "var(--primary-surface)"
                            : "transparent",
                          border: active
                            ? "1px solid rgba(0, 180, 216, 0.25)"
                            : "1px solid transparent",
                          color: active
                            ? "var(--primary-ocean)"
                            : "var(--primary-deep)",
                          textDecoration: "none",
                          fontWeight: active ? 700 : 600,
                          fontSize: "0.98rem",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "8px",
                              background: active
                                ? "rgba(0, 180, 216, 0.15)"
                                : "var(--bg-alt)",
                              color: active
                                ? "var(--primary-ocean)"
                                : "var(--text-muted)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <IconComponent size={16} />
                          </div>
                          <span>{link.label}</span>
                          {link.badge && (
                            <span
                              style={{
                                fontSize: "0.65rem",
                                padding: "1px 6px",
                                borderRadius: "var(--radius-full)",
                                background: "#fef3c7",
                                color: "#b45309",
                                fontWeight: 700,
                              }}
                            >
                              {link.badge}
                            </span>
                          )}
                        </div>
                        <ChevronRight
                          size={16}
                          color={
                            active
                              ? "var(--primary-ocean)"
                              : "var(--border-light)"
                          }
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Quick CTAs & Admin Link */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  paddingTop: "20px",
                  marginTop: "20px",
                  borderTop: "1px solid var(--border-light)",
                }}
              >
                {/* Book Trip Button */}
                <Link
                  href="/booking"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary"
                  style={{
                    width: "100%",
                    padding: "14px",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: "0 6px 20px rgba(0, 180, 216, 0.3)",
                  }}
                >
                  <Calendar size={17} />
                  <span>{t("bookNow")}</span>
                </Link>

                {/* WhatsApp Quick Chat */}
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-whatsapp"
                  style={{
                    width: "100%",
                    padding: "12px",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <MessageCircle size={17} />
                  <span>{tCta("whatsappButton")}</span>
                </a>

                {/* Admin Link */}
                <div style={{ textAlign: "center", marginTop: "2px" }}>
                  <a
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "0.76rem",
                      color: "var(--text-muted)",
                      textDecoration: "none",
                      padding: "4px 10px",
                    }}
                  >
                    <Lock size={12} />
                    <span>{t("admin")} Portal</span>
                  </a>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

      <style jsx global>{`
        @keyframes mobileBackdropIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes mobileDrawerSlide {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        @media (min-width: 960px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-actions {
            display: flex !important;
          }
          .mobile-toggle-group {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
