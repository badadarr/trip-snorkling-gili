'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton({ whatsappNumber }: { whatsappNumber?: string }) {
  const phone = whatsappNumber || '6287864551234';
  const defaultText = 'Halo Admin Trip Snorkeling Gili Trawangan! Saya ingin konsultasi / reservasi paket snorkeling...';
  
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
      <span>Chat WhatsApp</span>
    </a>
  );
}
