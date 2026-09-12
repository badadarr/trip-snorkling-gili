"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { X, ZoomIn, CameraOff, RotateCcw } from "lucide-react";

export interface GalleryItem {
  id: number;
  imageUrl: string;
  titleId: string;
  titleEn: string;
  category?: string | null;
  orderIndex?: number | null;
}

export interface GalleryCategoryItem {
  id: number;
  key: string;
  labelId: string;
  labelEn: string;
  orderIndex?: number | null;
}

interface GalleryGridProps {
  items: GalleryItem[];
  categories?: GalleryCategoryItem[];
}

export default function GalleryGrid({ items, categories }: GalleryGridProps) {
  const t = useTranslations("gallery");
  const locale = useLocale();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  // Build category tabs: "All" + dynamic categories from DB (or fallback to hardcoded)
  const categoryTabs = [
    { key: "all", label: t("all") },
    ...(categories && categories.length > 0
      ? categories.map((c) => ({
          key: c.key,
          label: locale === "id" ? c.labelId : c.labelEn,
        }))
      : [
          { key: "turtles", label: t("turtles") },
          { key: "statues", label: t("statues") },
          { key: "underwater", label: t("underwater") },
          { key: "sunset", label: t("sunset") },
          { key: "boats", label: t("boats") },
        ]),
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
        {categoryTabs.map((cat) => (
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

      {/* Gallery Grid or Empty State Error Handling */}
      {filteredItems.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "56px 24px",
            background: "#ffffff",
            borderRadius: "var(--radius-lg)",
            border: "1px dashed var(--border-light)",
            boxShadow: "var(--shadow-sm)",
            maxWidth: "540px",
            margin: "0 auto 30px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "rgba(0, 180, 216, 0.1)",
              color: "var(--primary-ocean)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
            }}
          >
            <CameraOff size={30} />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <span
              style={{
                display: "inline-block",
                background: "var(--primary-surface)",
                color: "var(--primary-ocean)",
                fontSize: "0.78rem",
                fontWeight: 700,
                padding: "3px 12px",
                borderRadius: "var(--radius-full)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {categoryTabs.find((c) => c.key === activeCategory)?.label || activeCategory}
            </span>
          </div>

          <h3
            style={{
              fontSize: "1.25rem",
              color: "var(--primary-deep)",
              marginBottom: "8px",
              fontWeight: 700,
            }}
          >
            {t("emptyTitle")}
          </h3>

          <p
            style={{
              fontSize: "0.92rem",
              color: "var(--text-muted)",
              lineHeight: 1.6,
              maxWidth: "420px",
              margin: "0 auto 24px",
            }}
          >
            {t("emptyDesc")}
          </p>

          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className="btn btn-primary btn-sm"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 22px",
              borderRadius: "var(--radius-full)",
              fontSize: "0.88rem",
              fontWeight: 600,
            }}
          >
            <RotateCcw size={15} />
            <span>{t("showAll")}</span>
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredItems.map((item, index) => {
            const title =
              locale === "id"
                ? item.titleId || item.titleEn
                : item.titleEn || item.titleId;
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
                  priority={index < 4}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{
                    objectFit: "cover",
                    transition: "transform 0.4s ease",
                  }}
                />

                {/* Category Slug Badge on Photo */}
                {item.category && (
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      zIndex: 2,
                      background: "rgba(10, 25, 47, 0.8)",
                      backdropFilter: "blur(6px)",
                      color: "var(--primary-aqua)",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: "var(--radius-full)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.35)",
                      pointerEvents: "none",
                    }}
                  >
                    {item.category}
                  </div>
                )}
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
      )}

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
                    ? selectedPhoto.titleId || selectedPhoto.titleEn
                    : selectedPhoto.titleEn || selectedPhoto.titleId
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
                    ? selectedPhoto.titleId || selectedPhoto.titleEn
                    : selectedPhoto.titleEn || selectedPhoto.titleId}
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
