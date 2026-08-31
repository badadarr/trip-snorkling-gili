'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Loader2, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
  aspectRatio?: string; // e.g. '16/9', '4/3', '1/1'
  helperText?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = 'Foto / Gambar',
  required = false,
  aspectRatio = '16/9',
  helperText = 'Format yang didukung: JPG, PNG, WebP (Maksimal 10MB)',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Format file tidak didukung. Harap upload gambar JPG, PNG, atau WebP.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Ukuran file terlalu besar. Maksimal 10MB.');
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading('Mengunggah gambar...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengunggah gambar');
      }

      onChange(data.url);
      toast.success('Foto berhasil diunggah!', { id: toastId });
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan saat upload', { id: toastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="form-group" style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <label className="form-label" style={{ margin: 0, fontWeight: 600 }}>
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
        
        {/* Toggle between Upload and URL */}
        <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '2px', borderRadius: '6px' }}>
          <button
            type="button"
            onClick={() => setMode('upload')}
            style={{
              padding: '2px 8px',
              fontSize: '0.72rem',
              fontWeight: mode === 'upload' ? 700 : 500,
              border: 'none',
              borderRadius: '4px',
              background: mode === 'upload' ? '#ffffff' : 'transparent',
              color: mode === 'upload' ? 'var(--primary-ocean)' : 'var(--text-muted)',
              cursor: 'pointer',
              boxShadow: mode === 'upload' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            style={{
              padding: '2px 8px',
              fontSize: '0.72rem',
              fontWeight: mode === 'url' ? 700 : 500,
              border: 'none',
              borderRadius: '4px',
              background: mode === 'url' ? '#ffffff' : 'transparent',
              color: mode === 'url' ? 'var(--primary-ocean)' : 'var(--text-muted)',
              cursor: 'pointer',
              boxShadow: mode === 'url' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            Input URL
          </button>
        </div>
      </div>

      {/* Mode 1: Direct File Upload */}
      {mode === 'upload' && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />

          {!value ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: dragActive ? '2px dashed var(--primary-ocean)' : '2px dashed var(--border-light)',
                background: dragActive ? 'var(--primary-surface)' : '#f8fafc',
                borderRadius: 'var(--radius-md)',
                padding: '28px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'var(--primary-surface)',
                  color: 'var(--primary-ocean)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px',
                }}
              >
                {isUploading ? (
                  <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <UploadCloud size={24} />
                )}
              </div>

              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-deep)', marginBottom: '4px' }}>
                {isUploading ? 'Sedang mengunggah...' : 'Klik atau Tarik Foto ke Sini'}
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                {helperText}
              </p>
            </div>
          ) : (
            <div
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '1px solid var(--border-light)',
                background: '#f8fafc',
              }}
            >
              <div style={{ height: '180px', width: '100%', position: 'relative' }}>
                <img
                  src={value}
                  alt="Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div
                style={{
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#ffffff',
                  borderTop: '1px solid var(--border-light)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--accent-green)', fontWeight: 600 }}>
                  <CheckCircle2 size={16} />
                  <span>Foto Terpasang</span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                  >
                    Ganti Foto
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange('')}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: 'none',
                      background: '#fee2e2',
                      color: '#b91c1c',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Direct URL Input */}
      {mode === 'url' && (
        <div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="url"
              className="form-control"
              placeholder="https://images.unsplash.com/photo-..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0 12px' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {value && (
            <div style={{ marginTop: '10px', height: '140px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
              <img src={value} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
