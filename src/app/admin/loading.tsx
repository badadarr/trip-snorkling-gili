'use client';

import React from 'react';

export default function AdminLoading() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        gap: '12px',
        color: 'var(--primary-ocean)',
        fontSize: '1rem',
        fontWeight: 600,
      }}
    >
      <div
        style={{
          width: '28px',
          height: '28px',
          border: '3px solid rgba(0, 119, 182, 0.2)',
          borderTopColor: 'var(--primary-ocean)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <span>Loading dashboard data...</span>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
