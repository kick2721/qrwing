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

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">Gratis vs Pro — ¿Qué necesitas?</h2>
        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Gratis</span>
            <h3 className="font-semibold text-lg mt-1 mb-3">{t("feat1Title")}</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                QR estáticos ilimitados
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Colores, logo y tamaños
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Sin registro — descarga al instante
              </li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl border border-purple-500/40 bg-purple-50/50 dark:bg-purple-950/20 relative">
            <span className="absolute -top-2.5 right-4 bg-purple-600 text-white text-xs px-3 py-0.5 rounded-full font-medium">Pro</span>
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">€7/mes</span>
            <h3 className="font-semibold text-lg mt-1 mb-3">QR Dinámicos + Estadísticas</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                QR dinámicos sin límite
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Estadísticas de escaneo
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Edita el destino sin reimprimir
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Panel de control con historial
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Soporte prioritario
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-8">
          <a
            href="/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition duration-75 active:scale-[0.97]"
          >
            Ver todos los planes
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </div>
      </section>
    </div>
  );
}
