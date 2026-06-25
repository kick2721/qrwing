"use client";

import { useLang } from "@/context/LangContext";
import Link from "next/link";

export default function PricingSuccess() {
  const { t } = useLang();

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold mb-3">{t("pricingSuccessTitle")}</h1>
      <p className="text-gray-500 mb-8">{t("pricingSuccessDesc")}</p>
      <Link
        href="/dashboard"
        className="inline-block bg-purple-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-purple-700 transition"
      >
        {t("goToDashboard")}
      </Link>
    </div>
  );
}
