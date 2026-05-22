import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return 'zh';
    return window.localStorage.getItem('supclaw-lang') || 'zh';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('supclaw-lang', lang);
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  }, [lang]);

  const value = useMemo(() => ({
    lang,
    setLang,
    toggleLang: () => setLang((current) => (current === 'zh' ? 'en' : 'zh')),
    t: (zh, en) => (lang === 'zh' ? zh : en),
  }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
