import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { DICTIONARY } from './dictionary';

export type Lang = 'es' | 'en';

const STORAGE_KEY = 'pasha-demo:v1:lang';

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  /** Traduce una clave con notación de puntos, ej. t('nav.home') */
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function lookup(key: string, lang: Lang): string {
  const parts = key.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let node: any = DICTIONARY;
  for (const part of parts) {
    if (node == null) break;
    node = node[part];
  }
  if (node == null) return key;
  if (typeof node === 'string') return node;
  if (typeof node === 'object' && (lang in node)) return node[lang];
  return key;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'en' || stored === 'es' ? stored : 'es';
    } catch {
      return 'es';
    }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* noop */ }
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggleLang = useCallback(() => setLangState((prev) => (prev === 'es' ? 'en' : 'es')), []);
  const t = useCallback((key: string) => lookup(key, lang), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage debe usarse dentro de <LanguageProvider>');
  return ctx;
}
