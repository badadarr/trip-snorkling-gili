'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export interface FaqItem {
  id: number;
  questionId: string;
  questionEn: string;
  answerId: string;
  answerEn: string;
  category?: string | null;
  orderIndex?: number | null;
  isActive?: boolean | null;
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const { lang, t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {items.map((item, index) => {
        const question = lang === 'id' ? item.questionId : item.questionEn;
        const answer = lang === 'id' ? item.answerId : item.answerEn;
        const isOpen = openIndex === index;

        return (
          <div
            key={item.id}
            className="glass-card"
            style={{
              overflow: 'hidden',
              border: isOpen ? '1.5px solid var(--primary-turquoise)' : '1px solid var(--border-light)',
              transition: 'all 0.25s ease',
            }}
          >
            <button
              type="button"
              onClick={() => toggleFaq(index)}
              style={{
                width: '100%',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                background: isOpen ? 'var(--primary-surface)' : '#ffffff',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'var(--font-heading)',
                fontSize: '1.05rem',
                fontWeight: 700,
                color: isOpen ? 'var(--primary-ocean)' : 'var(--primary-deep)',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: isOpen ? 'var(--primary-ocean)' : 'var(--bg-alt)',
                    color: isOpen ? '#ffffff' : 'var(--primary-ocean)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <HelpCircle size={18} />
                </div>
                <span>{question}</span>
              </div>
              <div style={{ color: isOpen ? 'var(--primary-ocean)' : 'var(--text-muted)' }}>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </button>

            {isOpen && (
              <div
                style={{
                  padding: '20px 24px 24px',
                  background: '#ffffff',
                  borderTop: '1px solid var(--border-light)',
                }}
              >
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  {answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
