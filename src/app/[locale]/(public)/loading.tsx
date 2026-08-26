'use client';

import React from 'react';
import { Waves } from 'lucide-react';

export default function Loading() {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary-ocean) 0%, var(--primary-turquoise) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(0, 180, 216, 0.35)',
          animation: 'pulse 1.8s infinite ease-in-out',
        }}
      >
        <Waves color="#ffffff" size={36} strokeWidth={2.4} />
      </div>

      <div style={{ textAlign: 'center' }}>
        <h3
          style={{
            fontSize: '1.25rem',
            color: 'var(--primary-deep)',
            marginBottom: '6px',
            fontFamily: 'var(--font-heading)',
          }}
        >
          Memuat Petualangan Bahari...
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Menyiapkan data trip snorkeling terbaik 3 Gili
        </p>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(0.92);
            box-shadow: 0 0 0 0 rgba(0, 180, 216, 0.5);
          }
          70% {
            transform: scale(1.05);
            box-shadow: 0 0 0 18px rgba(0, 180, 216, 0);
          }
          100% {
            transform: scale(0.92);
            box-shadow: 0 0 0 0 rgba(0, 180, 216, 0);
          }
        }
      `}</style>
    </div>
  );
}
