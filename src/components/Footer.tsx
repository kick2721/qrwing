"use client";

import Image from "next/image";
import { useLang } from "@/context/LangContext";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Image src="/logo.svg?v=3" alt="QRWing" width={218} height={64} className="h-9 w-auto" />
        </div>
        <p>{t("footerDesc")}</p>
        <p className="mt-3 text-xs">{t("footerLegal")}</p>
      </div>
    </footer>
  );
}
