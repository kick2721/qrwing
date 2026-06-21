"use client";

import QRGenerator from "@/components/QRGenerator";
import { useLang } from "@/context/LangContext";

export default function Home() {
  const { t } = useLang();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          {t("heroTitle")}
          <br />
          <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            {t("heroSubtitle")}
          </span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          {t("heroDesc")}
        </p>
      </section>

      <section className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-6 sm:p-10 mb-16">
        <QRGenerator />
      </section>

      <section className="grid sm:grid-cols-3 gap-6 text-center">
        {[
          { title: t("feat1Title"), desc: t("feat1Desc") },
          { title: t("feat2Title"), desc: t("feat2Desc") },
          { title: t("feat3Title"), desc: t("feat3Desc") },
        ].map((f) => (
          <div key={f.title} className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
            <p className="text-sm text-gray-500">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
