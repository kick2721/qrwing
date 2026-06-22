"use client";

import { useLang } from "@/context/LangContext";
import Logo from "./Logo";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Logo />
        </div>
        <p>{t("footerDesc")}</p>
        <nav className="flex justify-center gap-4 mt-3 text-xs">
          <a href="/privacy" className="hover:text-purple-600 transition">Privacy</a>
          <a href="/tos" className="hover:text-purple-600 transition">Terms</a>
          <a href="/imprint" className="hover:text-purple-600 transition">Imprint</a>
        </nav>
        <p className="mt-2 text-xs">{t("footerLegal")}</p>
      </div>
    </footer>
  );
}
