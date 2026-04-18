import { useEffect, useMemo } from 'react';
import useStore from '../store/useStore';
import en from '../i18n/en.json';
import ar from '../i18n/ar.json';

const translations = { en, ar };

const SCREEN_NAMES = {
  en: ['North Display', 'South Display', 'East Display', 'West Display'],
  ar: ['الشاشة الشمالية', 'الشاشة الجنوبية', 'الشاشة الشرقية', 'الشاشة الغربية']
};

export function useI18n() {
  const lang = useStore(state => state.lang);

  useEffect(() => {
    const html = document.documentElement;
    if (lang === 'ar') {
      html.setAttribute('dir', 'rtl');
      html.setAttribute('lang', 'ar');
      html.classList.add('rtl');
    } else {
      html.setAttribute('dir', 'ltr');
      html.setAttribute('lang', 'en');
      html.classList.remove('rtl');
    }
  }, [lang]);

  const t = useMemo(() => {
    return (key, fallback) => translations[lang]?.[key] ?? translations.en[key] ?? fallback ?? key;
  }, [lang]);

  const screenName = (index) => SCREEN_NAMES[lang]?.[index] ?? SCREEN_NAMES.en[index];

  return { t, lang, screenName };
}

export default useI18n;
