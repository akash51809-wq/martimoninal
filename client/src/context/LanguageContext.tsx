import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type SupportedLanguageCode = "en" | "hi" | "mr" | "gu" | "ta";

export interface LanguageOption {
  code: SupportedLanguageCode;
  label: string;
  nativeLabel: string;
  shortCode: string;
}

const DEFAULT_LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", nativeLabel: "English", shortCode: "EN" },
  { code: "hi", label: "Hindi", nativeLabel: "Hindi (HI)", shortCode: "HI" },
  { code: "mr", label: "Marathi", nativeLabel: "Marathi (MR)", shortCode: "MR" },
  { code: "gu", label: "Gujarati", nativeLabel: "Gujarati (GU)", shortCode: "GU" },
  { code: "ta", label: "Tamil", nativeLabel: "Tamil (TA)", shortCode: "TA" },
];

const STORAGE_KEY = "vivah_ui_lang";

interface LanguageContextValue {
  lang: SupportedLanguageCode;
  setLang: (code: SupportedLanguageCode) => void;
  languages: LanguageOption[];
  isLoadingLang: boolean;
  t: (key: string, fallback: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

const localeCache = new Map<SupportedLanguageCode, Record<string, string>>();

function isSupportedLang(val: string | null): val is SupportedLanguageCode {
  return (
    val === "en" ||
    val === "hi" ||
    val === "mr" ||
    val === "gu" ||
    val === "ta"
  );
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lang, setLangState] = useState<SupportedLanguageCode>(() => {
    if (typeof window === "undefined") return "en";
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return isSupportedLang(saved) ? saved : "en";
    } catch {
      return "en";
    }
  });

  const [languages, setLanguages] =
    useState<LanguageOption[]>(DEFAULT_LANGUAGES);
  const [dictionary, setDictionary] = useState<Record<string, string>>({});
  const [isLoadingLang, setIsLoadingLang] = useState(false);

  // Fetch native language names from static locale metadata JSON
  useEffect(() => {
    let active = true;
    fetch("/locales/languages.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && Array.isArray(data) && data.length > 0) {
          setLanguages(data);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Load selected locale dictionary with caching
  useEffect(() => {
    let active = true;
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }

    const cached = localeCache.get(lang);
    if (cached) {
      setDictionary(cached);
      return;
    }

    setIsLoadingLang(true);
    fetch(`/locales/${lang}.json`)
      .then((res) => (res.ok ? res.json() : {}))
      .then((data) => {
        if (!active) return;
        if (data && typeof data === "object") {
          localeCache.set(lang, data as Record<string, string>);
          setDictionary(data as Record<string, string>);
        }
      })
      .catch(() => {
        if (active) setDictionary({});
      })
      .finally(() => {
        if (active) setIsLoadingLang(false);
      });

    return () => {
      active = false;
    };
  }, [lang]);

  const setLang = useCallback((code: SupportedLanguageCode) => {
    if (!isSupportedLang(code)) return;
    setLangState(code);
    try {
      window.localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // Ignore storage quota errors in restricted browsers
    }
  }, []);

  const t = useCallback(
    (key: string, fallback: string) => {
      const val = dictionary[key];
      return typeof val === "string" && val.length > 0 ? val : fallback;
    },
    [dictionary]
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      languages,
      isLoadingLang,
      t,
    }),
    [lang, setLang, languages, isLoadingLang, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
