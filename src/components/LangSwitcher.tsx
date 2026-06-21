"use client";

import { useLang } from "@/context/LangContext";
import { LANGUAGES } from "@/lib/i18n";

export default function LangSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value as typeof lang)}
      className="px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-medium outline-none cursor-pointer"
    >
      {LANGUAGES.map((l) => (
        <option key={l.code} value={l.code}>
          {l.flag} {l.name}
        </option>
      ))}
    </select>
  );
}
