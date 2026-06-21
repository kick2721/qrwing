"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { LANGUAGES, getT, type Lang, type TranslationKey } from "@/lib/i18n";

type TFunc = (key: TranslationKey) => string;

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: TFunc;
}>({
  lang: "es",
  setLang: () => {},
  t: (() => "") as TFunc,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    const saved = localStorage.getItem("qrwing-lang") as Lang | null;
    if (saved && LANGUAGES.some((l) => l.code === saved)) {
      setLangState(saved);
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("qrwing-lang", l);
  };

  const t: TFunc = (key: TranslationKey) => getT(lang)[key] ?? key;

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
