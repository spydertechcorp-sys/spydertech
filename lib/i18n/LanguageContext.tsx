'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { dictionaries, Language, Dictionary } from './dictionaries';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('spydertech-lang') as Language;
    if (savedLang && ['es', 'en', 'it'].includes(savedLang)) {
      setLanguageState(savedLang);
    } else {
      // Default to Spanish (or could infer from navigator.language)
      setLanguageState('es');
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('spydertech-lang', lang);
    // Add document lang attribute for accessibility/SEO
    document.documentElement.lang = lang;
  };

  if (!mounted) {
    // Avoid hydration mismatch by rendering nothing or a default fallback until mounted
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: dictionaries[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
