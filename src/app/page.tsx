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

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">{t("vsTitle")}</h2>
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto items-start">
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{t("planFree")}</span>
            <h3 className="font-semibold text-lg mt-1 mb-3">{t("feat1Title")}</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {t("featFree1")}
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {t("featFree2")}
              </li>
            </ul>
          </div>

          <div className="relative p-6 rounded-2xl border border-purple-500/40 bg-purple-50/50 dark:bg-purple-950/30 shadow-lg">
            <span className="absolute -top-2.5 right-4 bg-purple-600 text-white text-xs px-3 py-0.5 rounded-full font-medium">{t("planPro")}</span>
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">{t("pricePro")}{t("perMonth")}</span>
            <h3 className="font-semibold text-lg mt-1 mb-3">{t("vsProTitle")}</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {t("featPro2")}
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {t("featPro3")}
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {t("featPro4")}
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {t("vsProDashboard")}
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {t("featPro5")}
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl border border-purple-500/40 bg-white dark:bg-gray-900 shadow-lg">
            <div className="text-center mb-4">
              <p className="text-3xl font-bold text-purple-600">248</p>
              <p className="text-xs text-gray-400">{t("dashboardTotalScans")}</p>
            </div>

            <div className="grid grid-cols-2 gap-1.5 mb-4">
              <div className="px-2 py-1.5 text-[11px] font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 text-center">
                <span className="block leading-tight">📈<br/>{t("analyticsTimeline")}</span>
              </div>
              <div className="px-2 py-1.5 text-[11px] font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 text-center">
                <span className="block leading-tight">🌍<br/>{t("analyticsCountries")}</span>
              </div>
              <div className="px-2 py-1.5 text-[11px] font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 text-center">
                <span className="block leading-tight">📱<br/>{t("analyticsDevices")}</span>
              </div>
              <div className="px-2 py-1.5 text-[11px] font-medium rounded-lg border border-purple-600 bg-purple-600 text-white text-center shadow-sm">
                <span className="block leading-tight">⏰<br/>{t("analyticsActivity")}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="text-center p-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <p className="text-sm font-bold text-purple-600">2:00 PM</p>
                <p className="text-[10px] text-gray-400">{t("analyticsPeakHour")}</p>
              </div>
              <div className="text-center p-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <p className="text-sm font-bold text-purple-600">8.3</p>
                <p className="text-[10px] text-gray-400">{t("analyticsAvgDaily")}</p>
              </div>
              <div className="text-center p-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <p className="text-sm font-bold text-purple-600 truncate">Mon 26 Jun</p>
                <p className="text-[10px] text-gray-400">{t("analyticsBestDay")}</p>
              </div>
              <div className="text-center p-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <p className="text-sm font-bold text-purple-600">2h ago</p>
                <p className="text-[10px] text-gray-400">{t("analyticsLastScan")}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">{t("analyticsHourDistribution")}</p>
              <div className="space-y-1">
                {[
                  { h: "2:00 PM", pct: 100, c: 12 },
                  { h: "3:00 PM", pct: 67, c: 8 },
                  { h: "1:00 PM", pct: 42, c: 5 },
                ].map(({ h, pct, c }) => (
                  <div key={h} className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500 w-14 text-right text-[10px]">{h}</span>
                    <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                      <div className="h-full bg-purple-500 rounded" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-gray-400 text-[10px] w-5 text-right">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
