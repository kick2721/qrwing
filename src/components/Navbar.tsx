"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { useLang } from "@/context/LangContext";
import { useTheme } from "./ThemeProvider";
import Logo from "./Logo";
import LangSwitcher from "./LangSwitcher";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const { data: session } = useSession();
  const { t } = useLang();
  const { theme, toggle } = useTheme();

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>

        <div className="hidden sm:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-purple-600 transition-colors">
            {t("navHome")}
          </Link>
          <Link href="/pricing" className="hover:text-purple-600 transition-colors">
            {t("navPricing")}
          </Link>
          {session?.user && (
            <Link href="/dashboard" className="hover:text-purple-600 transition-colors">
              {t("dashboardTitle")}
            </Link>
          )}
          <LangSwitcher />
          <button onClick={toggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-transform active:scale-[0.92] text-lg" aria-label="Toggle theme">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          {session?.user ? (
            <div className="relative">
              <button onClick={() => setUserMenu(!userMenu)} className="flex items-center gap-2 hover:opacity-80">
                {session.user.image ? (
                  <Image src={session.user.image} alt="" width={32} height={32} className="rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                    {session.user.name?.charAt(0) || "?"}
                  </div>
                )}
              </button>
              {userMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg py-2 text-sm">
                  <div className="px-4 py-2 text-gray-500 border-b border-gray-100 dark:border-gray-800 truncate">
                    {session.user.email}
                  </div>
                  <Link href="/dashboard" onClick={() => setUserMenu(false)} className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800">
                    {t("dashboardTitle")}
                  </Link>
                  <button onClick={() => signOut()} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-transform active:scale-[0.97] active:origin-left">
                    {t("signOut")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => signIn()} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-transform active:scale-[0.95]">
              {t("navLogin")}
            </button>
          )}
        </div>

        <div className="sm:hidden flex items-center gap-2">
          <LangSwitcher />
          <button onClick={() => setOpen(!open)} className="p-2 transition-transform active:scale-[0.92]" aria-label="Menu">
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
          <button onClick={toggle} className="text-left hover:text-purple-600 transition-transform active:scale-[0.97] active:origin-left">
            {theme === "dark" ? t("themeLight") : t("themeDark")}
          </button>
          {session?.user ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)} className="hover:text-purple-600">
                {t("dashboardTitle")}
              </Link>
              <button onClick={() => signOut()} className="text-left text-red-600 hover:text-red-700 transition-transform active:scale-[0.97] active:origin-left">
                {t("signOut")}
              </button>
            </>
          ) : (
            <button onClick={() => signIn()} className="text-left hover:text-purple-600 transition-transform active:scale-[0.97] active:origin-left">
              {t("navLogin")}
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
