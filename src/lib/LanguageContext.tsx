'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { dictId } from '@/dictionaries/id';
import { dictEn } from '@/dictionaries/en';

type Language = 'id' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof dictId;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'id',
  setLang: () => {},
  t: dictId,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('id');

  useEffect(() => {
    const saved = localStorage.getItem('gili_snorkeling_lang') as Language;
    if (saved === 'id' || saved === 'en') {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('gili_snorkeling_lang', newLang);
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000`;
  };

  const t = lang === 'id' ? dictId : dictEn;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
