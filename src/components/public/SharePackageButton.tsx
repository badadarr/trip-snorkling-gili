"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Share2, Link2, Check, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { routing } from "@/i18n/routing";

interface SharePackageButtonProps {
  slug: string;
  packageName: string;
  /** "icon" = compact square button (cards), "full" = full-width labelled button (detail page) */
  variant?: "icon" | "full";
  label?: string;
}

export default function SharePackageButton({
  slug,
  packageName,
  variant = "icon",
  label = "Share",
}: SharePackageButtonProps) {
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // The absolute URL needs window.location, so it is built when the user acts
  const buildShareUrl = () => {
    const prefix =
      locale === routing.defaultLocale && routing.localePrefix === "as-needed"
        ? ""
        : `/${locale}`;
    return `${window.location.origin}${prefix}/paket/${slug}`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const shareText = `${packageName} — Snorkeling Trip Gili Trawangan`;

  const handleShareClick = async () => {
    // Prefer the native share sheet (mobile); fall back to the dropdown menu
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: packageName,
          text: shareText,
          url: buildShareUrl(),
        });
        return;
      } catch (err) {
        // User dismissed the native sheet — do not open the fallback menu
        if (err instanceof Error && err.name === "AbortError") return;
        console.warn("Native share unavailable, using fallback menu:", err);
      }
    }
    setIsOpen((prev) => !prev);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildShareUrl());
      setCopied(true);
      toast.success("Package link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn("Clipboard write failed:", e);
      toast.error("Could not copy the link. Please copy it manually.");
    }
    setIsOpen(false);
  };

  const openShareWindow = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer,width=640,height=620");
    setIsOpen(false);
  };

  const FacebookMark = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );

  const XMark = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.9 2.5h3.3l-7.2 8.2 8.5 11.2h-6.7l-5.2-6.9-6 6.9H2.3l7.7-8.8L1.9 2.5h6.8l4.7 6.3 5.5-6.3Zm-1.2 17.6h1.8L7.4 4.3H5.4l12.3 15.8Z" />
    </svg>
  );

  const menuItems = [
    {
      key: "copy",
      icon: copied ? Check : Link2,
      label: copied ? "Link copied!" : "Copy link",
      onClick: handleCopy,
      color: copied ? "#059669" : "var(--primary-deep)",
    },
    {
      key: "whatsapp",
      icon: MessageCircle,
      label: "Share via WhatsApp",
      onClick: () =>
        openShareWindow(
          `https://wa.me/?text=${encodeURIComponent(
            `${shareText}\n${buildShareUrl()}`,
          )}`,
        ),
      color: "#25d366",
    },
    {
      key: "facebook",
      icon: FacebookMark,
      label: "Share on Facebook",
      onClick: () =>
        openShareWindow(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(buildShareUrl())}`,
        ),
      color: "#1877f2",
    },
    {
      key: "x",
      icon: XMark,
      label: "Share on X",
      onClick: () =>
        openShareWindow(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(buildShareUrl())}`,
        ),
      color: "var(--primary-deep)",
    },
  ];

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "relative",
        display: variant === "full" ? "block" : "inline-block",
        width: variant === "full" ? "100%" : undefined,
      }}
    >
      <button
        type="button"
        onClick={handleShareClick}
        aria-label={`Share ${packageName}`}
        title={`Share ${packageName}`}
        className={variant === "full" ? "btn btn-secondary" : undefined}
        style={
          variant === "full"
            ? { width: "100%" }
            : {
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "38px",
                height: "38px",
                padding: 0,
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-light)",
                background: "#ffffff",
                color: "var(--primary-ocean)",
                cursor: "pointer",
                flexShrink: 0,
                transition: "all 0.2s ease",
              }
        }
      >
        <Share2 size={variant === "full" ? 18 : 16} />
        {variant === "full" && <span>{label}</span>}
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            right: 0,
            minWidth: "210px",
            background: "#ffffff",
            borderRadius: "var(--radius-md)",
            boxShadow: "0 10px 30px rgba(10, 37, 64, 0.18)",
            border: "1px solid rgba(0, 119, 182, 0.18)",
            padding: "6px",
            zIndex: 1000,
            animation: "dropdownFadeIn 0.15s ease-out",
          }}
        >
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              padding: "6px 10px 4px 10px",
              letterSpacing: "0.05em",
            }}
          >
            Share this package
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                type="button"
                onClick={item.onClick}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "9px 10px",
                  borderRadius: "8px",
                  border: "none",
                  background: "transparent",
                  color: item.color,
                  fontSize: "0.84rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f8fafc";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
