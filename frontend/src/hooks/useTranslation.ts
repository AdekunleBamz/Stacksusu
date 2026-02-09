import { useState, useCallback } from 'react';

export interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}

export interface TranslationOptions {
  /** Default translations */
  defaultTranslations?: TranslationDictionary;
  /** Fallback string when translation is missing */
  fallback?: string;
}

/**
 * Simple translation hook for internationalization
 */
export function useTranslation(
  options: TranslationOptions = {}
) {
  const { defaultTranslations = {}, fallback = '' } = options;
  const [translations, setTranslations] = useState<TranslationDictionary>(defaultTranslations);
  const [locale, setLocale] = useState('en');

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const keys = key.split('.');
      let value: unknown = translations;

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = (value as TranslationDictionary)[k];
        } else {
          return fallback || key;
        }
      }

      if (typeof value !== 'string') {
        return fallback || key;
      }

      // Replace parameters
      if (params) {
        return Object.entries(params).reduce(
          (str, [param, paramValue]) =>
            str.replace(new RegExp(`\\{\\{${param}\\}\\}`, 'g'), String(paramValue)),
          value
        );
      }

      return value;
    },
    [translations, fallback]
  );

  const setTranslationsForLocale = useCallback(
    (newTranslations: TranslationDictionary) => {
      setTranslations(newTranslations);
    },
    []
  );

  return {
    t,
    locale,
    setLocale,
    setTranslations: setTranslationsForLocale,
  };
}

export default useTranslation;
