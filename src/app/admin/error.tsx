'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin panel error:', error);
  }, [error]);

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '40px',
        maxWidth: '560px',
        margin: '40px auto',
        textAlign: 'center',
        border: '1px solid #fee2e2',
        boxShadow: '0 10px 25px rgba(0,0,0,0.04)',
      }}
    >
      <div
        style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          backgroundColor: '#fee2e2',
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
        }}
      >
        <AlertCircle size={28} />
      </div>

      <h3 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '8px' }}>
        Admin Panel Error
      </h3>

      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.6 }}>
        Failed to load or process data. Please click the button below to retry.
      </p>

      {error?.message && (
        <div
          style={{
            padding: '10px 14px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            color: '#dc2626',
            fontSize: '0.8rem',
            fontFamily: 'monospace',
            marginBottom: '20px',
            textAlign: 'left',
          }}
        >
          {error.message}
        </div>
      )}

      <button
        type="button"
        onClick={() => reset()}
        className="btn btn-primary"
      >
        <RefreshCw size={16} />
        <span>Reload Component</span>
      </button>
    </div>
  );
}
