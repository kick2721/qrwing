"use client";

import { useLang } from "@/context/LangContext";
import Link from "next/link";

export default function PricingCancel() {
  const { t } = useLang();

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold mb-3">{t("pricingCancelTitle")}</h1>
      <p className="text-gray-500 mb-8">{t("pricingCancelDesc")}</p>
      <Link
        href="/pricing"
        className="inline-block bg-purple-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-purple-700 transition"
      >
        {t("ctaPro")}
      </Link>
    </div>
  );
}
