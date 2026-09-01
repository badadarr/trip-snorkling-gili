'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton({ whatsappNumber }: { whatsappNumber?: string }) {
  const phone = whatsappNumber || '6287864551234';
  const defaultText = 'Hello Gili Trawangan Snorkeling Trip! I would like to inquire about tour packages & slot availability...';
  
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
      <span>WhatsApp Us</span>
    </a>
  );
}
