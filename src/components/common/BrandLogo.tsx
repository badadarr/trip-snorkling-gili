'use client';

import React from 'react';
import { Waves, Compass, Ship, Anchor, Fish, Sparkles } from 'lucide-react';

export interface BrandLogoProps {
  siteName?: string;
  tagline?: string;
  logoUrl?: string;
  logoType?: 'preset' | 'custom' | string;
  logoPreset?: 'waves' | 'compass' | 'ship' | 'anchor' | 'fish' | 'sparkles' | string;
  logoColor?: 'ocean' | 'turquoise' | 'sunset' | 'deep_ocean' | 'emerald' | string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const LOGO_PRESETS = [
  { id: 'waves', name: 'Ombak Laut', icon: Waves },
  { id: 'compass', name: 'Kompas Petualang', icon: Compass },
  { id: 'ship', name: 'Perahu Boat', icon: Ship },
  { id: 'anchor', name: 'Jangkar Bahari', icon: Anchor },
  { id: 'fish', name: 'Ikan & Terumbu', icon: Fish },
  { id: 'sparkles', name: 'Eksklusif / Bintang', icon: Sparkles },
];

export const LOGO_COLOR_GRADIENTS: Record<string, { label: string; gradient: string }> = {
  ocean: {
    label: 'Biru Laut Tropis',
    gradient: 'linear-gradient(135deg, var(--primary-ocean, #0077b6) 0%, var(--primary-turquoise, #00b4d8) 100%)',
  },
  turquoise: {
    label: 'Toska Segar',
    gradient: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
  },
  sunset: {
    label: 'Sunset Jingga',
    gradient: 'linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)',
  },
  deep_ocean: {
    label: 'Samudra Dalam',
    gradient: 'linear-gradient(135deg, #03045e 0%, #0077b6 100%)',
  },
  emerald: {
    label: 'Laguna Hijau',
    gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
  },
};

export default function BrandLogo({
  siteName = 'SNORKELING GILI',
  tagline = 'Gili Trawangan • 3 Gili',
  logoUrl = '',
  logoType = 'preset',
  logoPreset = 'waves',
  logoColor = 'ocean',
  variant = 'light',
  size = 'md',
  showTagline = true,
}: BrandLogoProps) {
  // Dimension configuration based on size
  const dimensions = {
    sm: { box: 32, icon: 18, titleSize: '0.95rem', subSize: '0.6rem' },
    md: { box: 40, icon: 22, titleSize: '1.15rem', subSize: '0.66rem' },
    lg: { box: 50, icon: 26, titleSize: '1.35rem', subSize: '0.74rem' },
  }[size] || { box: 40, icon: 22, titleSize: '1.15rem', subSize: '0.66rem' };

  // Determine active icon
  const presetItem = LOGO_PRESETS.find((p) => p.id === logoPreset) || LOGO_PRESETS[0];
  const IconComponent = presetItem.icon;

  // Determine active gradient
  const gradientInfo = LOGO_COLOR_GRADIENTS[logoColor] || LOGO_COLOR_GRADIENTS.ocean;

  // Split siteName so the last word can have a stylish highlight
  const words = (siteName || 'SNORKELING GILI').trim().split(/\s+/);
  const firstPart = words.length > 1 ? words.slice(0, -1).join(' ') : words[0];
  const lastPart = words.length > 1 ? words[words.length - 1] : '';

  const isCustomImage = logoType === 'custom' && logoUrl && logoUrl.trim() !== '';

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size === 'sm' ? '8px' : '11px' }}>
      {/* Logo Graphic or Preset Badge */}
      {isCustomImage ? (
        <div
          style={{
            width: `${dimensions.box}px`,
            height: `${dimensions.box}px`,
            borderRadius: size === 'sm' ? '8px' : '12px',
            overflow: 'hidden',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: variant === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#ffffff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
            border: variant === 'dark' ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.08)',
          }}
        >
          <img
            src={logoUrl}
            alt={siteName}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      ) : (
        <div
          style={{
            width: `${dimensions.box}px`,
            height: `${dimensions.box}px`,
            borderRadius: size === 'sm' ? '8px' : '12px',
            background: gradientInfo.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 119, 182, 0.28)',
            flexShrink: 0,
          }}
        >
          <IconComponent color="#ffffff" size={dimensions.icon} strokeWidth={2.4} />
        </div>
      )}

      {/* Brand Text */}
      <div>
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            fontSize: dimensions.titleSize,
            color: variant === 'dark' ? '#ffffff' : 'var(--primary-deep)',
            letterSpacing: '-0.02em',
            display: 'block',
            lineHeight: 1.1,
            textTransform: 'uppercase',
          }}
        >
          {firstPart}{' '}
          {lastPart && (
            <span style={{ color: variant === 'dark' ? 'var(--primary-aqua, #38bdf8)' : 'var(--primary-turquoise, #00b4d8)' }}>
              {lastPart}
            </span>
          )}
        </span>

        {showTagline && tagline && (
          <span
            style={{
              fontSize: dimensions.subSize,
              fontWeight: 600,
              color: variant === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'var(--primary-ocean)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              display: 'block',
              marginTop: '2px',
              whiteSpace: 'nowrap',
            }}
          >
            {tagline}
          </span>
        )}
      </div>
    </div>
  );
}
