"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useLang } from "@/context/LangContext";
import LangSwitcher from "./LangSwitcher";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useLang();

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg?v=2" alt="QRWing" width={184} height={52} className="h-9 w-auto" priority />
        </Link>

        <div className="hidden sm:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-purple-600 transition-colors">
            {t("navHome")}
          </Link>
          <Link href="/pricing" className="hover:text-purple-600 transition-colors">
            {t("navPricing")}
          </Link>
          <LangSwitcher />
        </div>

        <div className="sm:hidden flex items-center gap-2">
          <LangSwitcher />
          <button onClick={() => setOpen(!open)} className="p-2" aria-label="Menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="sm:hidden border-t border-gray-200 dark:border-gray-800 px-4 py-3 flex flex-col gap-3 text-sm font-medium">
          <Link href="/" onClick={() => setOpen(false)} className="hover:text-purple-600">
            {t("navHome")}
          </Link>
          <Link href="/pricing" onClick={() => setOpen(false)} className="hover:text-purple-600">
            {t("navPricing")}
          </Link>
        </div>
      )}
    </nav>
  );
}
