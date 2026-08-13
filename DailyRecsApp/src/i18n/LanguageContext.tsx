import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, UIStrings, translations } from './translations';
import { getLanguage, setLanguage as persistLanguage } from '@/services/storage';

interface LanguageContextValue {
  language: Language;
  t: UIStrings;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'es',
  t: translations.es,
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es');

  useEffect(() => {
    getLanguage().then(setLanguageState);
  }, []);

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    persistLanguage(next);
  };

  return (
    <LanguageContext.Provider value={{ language, t: translations[language], setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
