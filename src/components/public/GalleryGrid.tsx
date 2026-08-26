"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { X, ZoomIn } from "lucide-react";

export interface GalleryItem {
  id: number;
  imageUrl: string;
  titleId: string;
  titleEn: string;
  category?: string | null;
  orderIndex?: number | null;
}

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const locale = useLocale();
  const t = useTranslations("gallery");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const categories = [
    { key: "all", label: t("all") },
    { key: "turtles", label: t("turtles") },
    { key: "statues", label: t("statues") },
    { key: "underwater", label: t("underwater") },
    { key: "sunset", label: t("sunset") },
    { key: "boats", label: t("boats") },
  ];

  const filteredItems =
    activeCategory === "all"
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <div>
      {/* Category Filter Tabs */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "36px",
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setActiveCategory(cat.key)}
            style={{
              padding: "8px 18px",
              borderRadius: "var(--radius-full)",
              border:
                activeCategory === cat.key
                  ? "1px solid var(--primary-ocean)"
                  : "1px solid var(--border-light)",
              background:
                activeCategory === cat.key ? "var(--primary-ocean)" : "#ffffff",
              color:
                activeCategory === cat.key ? "#ffffff" : "var(--text-main)",
              fontSize: "0.88rem",
              fontWeight: activeCategory === cat.key ? "700" : "500",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredItems.map((item) => {
          const title = locale === "id" ? item.titleId : item.titleEn;
          return (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              style={{
                position: "relative",
                height: "240px",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: "var(--shadow-sm)",
              }}
              className="gallery-item-wrap"
            >
              <Image
                src={item.imageUrl}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{
                  objectFit: "cover",
                  transition: "transform 0.4s ease",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "linear-gradient(to top, rgba(10, 37, 64, 0.85) 0%, transparent 60%)",
                  opacity: 0.9,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "16px",
                  transition: "opacity 0.2s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      color: "#ffffff",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                    }}
                  >
                    {title}
                  </span>
                  <div
                    style={{
                      padding: "6px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.2)",
                      color: "#ffffff",
                    }}
                  >
                    <ZoomIn size={14} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(10, 25, 47, 0.92)",
            backdropFilter: "blur(12px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "900px",
              width: "100%",
              background: "#0d2137",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              boxShadow: "var(--shadow-xl)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                zIndex: 10,
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "rgba(0, 0, 0, 0.6)",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Close photo preview"
            >
              <X size={20} />
            </button>

            <div
              style={{
                position: "relative",
                width: "100%",
                height: "65vh",
                maxHeight: "600px",
              }}
            >
              <Image
                src={selectedPhoto.imageUrl}
                alt={
                  locale === "id"
                    ? selectedPhoto.titleId
                    : selectedPhoto.titleEn
                }
                fill
                sizes="(max-width: 900px) 100vw, 900px"
                style={{
                  objectFit: "contain",
                }}
              />
            </div>

            <div
              style={{
                padding: "20px 24px",
                background: "rgba(13, 33, 55, 0.95)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h4
                  style={{
                    color: "#ffffff",
                    fontSize: "1.1rem",
                    marginBottom: "4px",
                  }}
                >
                  {locale === "id"
                    ? selectedPhoto.titleId
                    : selectedPhoto.titleEn}
                </h4>
                <span
                  style={{
                    color: "var(--primary-aqua)",
                    fontSize: "0.8rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Spot: {selectedPhoto.category || "Gili Islands"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
