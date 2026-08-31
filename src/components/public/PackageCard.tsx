'use client';

import React from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Clock, Calendar, CheckCircle2, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { formatIdr, formatUsd } from '@/lib/format';

export interface PackageData {
  id: number;
  slug: string;
  nameId: string;
  nameEn: string;
  tagId?: string | null;
  tagEn?: string | null;
  descriptionId: string;
  descriptionEn: string;
  price: number;
  priceUsd: number;
  priceUnit?: string | null;
  durationId?: string | null;
  durationEn?: string | null;
  scheduleId?: string | null;
  scheduleEn?: string | null;
  includesId?: string[] | null;
  includesEn?: string[] | null;
  spotsId?: string[] | null;
  spotsEn?: string[] | null;
  imageUrl: string;
  isFeatured?: boolean | null;
  isActive?: boolean | null;
  orderIndex?: number | null;
}

export default function PackageCard({ pkg }: { pkg: PackageData }) {
  const t = useTranslations('packages');

  const name = pkg.nameEn || pkg.nameId;
  const tag = pkg.tagEn || pkg.tagId;
  const description = pkg.descriptionEn || pkg.descriptionId;
  const duration = pkg.durationEn || pkg.durationId;
  const schedule = pkg.scheduleEn || pkg.scheduleId;
  const includes = (pkg.includesEn && pkg.includesEn.length > 0) ? pkg.includesEn : (pkg.includesId || []);
  const spots = (pkg.spotsEn && pkg.spotsEn.length > 0) ? pkg.spotsEn : (pkg.spotsId || []);

  const formatPrice = (amountUsd: number, amountIdr: number) => {
    return `$${amountUsd} USD`;
  };

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        border: pkg.isFeatured ? '2px solid var(--primary-turquoise)' : '1px solid var(--border-light)',
        position: 'relative',
      }}
    >
      {/* Image Thumbnail with Overlay Badges */}
      <div style={{ position: 'relative', height: '220px', width: '100%', overflow: 'hidden' }}>
        <img
          src={pkg.imageUrl}
          alt={name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to top, rgba(10, 37, 64, 0.7) 0%, transparent 60%)',
          }}
        />

        {/* Popular Tag */}
        {tag && (
          <div
            style={{
              position: 'absolute',
              top: '14px',
              left: '14px',
              background: pkg.isFeatured
                ? 'linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%)'
                : 'rgba(10, 37, 64, 0.85)',
              color: pkg.isFeatured ? '#0d2137' : '#ffffff',
              padding: '5px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            }}
          >
            <Sparkles size={13} />
            <span>{tag}</span>
          </div>
        )}

        {/* Price Tag in Thumbnail */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '14px',
            right: '14px',
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', color: '#90e0ef', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
              {t('priceStarts')}
            </span>
            <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
              {formatUsd(pkg.priceUsd)}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#caf0f8', marginLeft: '4px' }}>
              {(pkg.priceUnit === 'per_boat' || (!pkg.priceUnit && pkg.price > 500000)) ? t('perBoat') : t('perPerson')}
            </span>
            <span style={{ display: 'block', fontSize: '0.72rem', color: '#bde0fe', marginTop: '2px' }}>
              ~ {formatIdr(pkg.price)}
            </span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {/* Title */}
        <h3 style={{ fontSize: '1.25rem', marginBottom: '10px', color: 'var(--primary-deep)' }}>
          {name}
        </h3>

        {/* Description snippet */}
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.55 }}>
          {description}
        </p>

        {/* Key Info Badges */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '18px' }}>
          {duration && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--primary-surface)',
                color: 'var(--primary-ocean)',
                fontSize: '0.78rem',
                fontWeight: 600,
              }}
            >
              <Clock size={13} />
              <span>{duration}</span>
            </div>
          )}
          {schedule && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--primary-surface)',
                color: 'var(--primary-ocean)',
                fontSize: '0.78rem',
                fontWeight: 600,
              }}
            >
              <Calendar size={13} />
              <span>{schedule}</span>
            </div>
          )}
        </div>

        {/* Spot Highlights */}
        {spots.length > 0 && (
          <div style={{ marginBottom: '18px', borderTop: '1px dashed var(--border-light)', paddingTop: '14px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-navy)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              {t('highlights')}:
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {spots.slice(0, 3).map((spot, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.82rem', color: 'var(--text-main)' }}>
                  <MapPin size={14} color="var(--primary-turquoise)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{spot}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Includes Snippet */}
        {includes.length > 0 && (
          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {includes.slice(0, 3).map((inc, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <CheckCircle2 size={14} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{inc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ marginTop: 'auto', display: 'flex', gap: '10px', paddingTop: '10px' }}>
          <Link
            href={`/paket/${pkg.slug}`}
            className="btn btn-secondary btn-sm"
            style={{ flex: 1, padding: '10px 14px', fontSize: '0.85rem' }}
          >
            <span>{t('viewDetail')}</span>
            <ArrowRight size={14} />
          </Link>
          <Link
            href={`/booking?package=${pkg.slug}`}
            className="btn btn-primary btn-sm"
            style={{ flex: 1, padding: '10px 14px', fontSize: '0.85rem' }}
          >
            <Calendar size={14} />
            <span>{t('bookPackage')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
