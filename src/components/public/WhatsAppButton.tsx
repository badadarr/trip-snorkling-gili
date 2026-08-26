'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function WhatsAppButton({ whatsappNumber }: { whatsappNumber?: string }) {
  const { lang } = useLanguage();
  const phone = whatsappNumber || '6287864551234';
  const defaultText = lang === 'id'
    ? 'Halo Admin Trip Snorkeling Gili Trawangan! Saya ingin konsultasi / reservasi paket snorkeling...'
    : 'Hello Trip Snorkeling Gili Trawangan! I would like to inquire about snorkeling trip packages...';
  
  const waUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(defaultText)}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Chat with us on WhatsApp"
    >
      <div className="whatsapp-pulse" />
      <MessageCircle size={22} color="#ffffff" strokeWidth={2.3} />
      <span>{lang === 'id' ? 'Chat WhatsApp' : 'WhatsApp Us'}</span>
    </a>
  );
}
