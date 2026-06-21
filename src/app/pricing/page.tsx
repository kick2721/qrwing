"use client";

import { useLang } from "@/context/LangContext";

export default function Pricing() {
  const { t } = useLang();

  const plans = [
    {
      name: t("planFree"),
      price: t("priceFree"),
      period: "",
      desc: t("planFreeDesc"),
      features: [t("featFree1"), t("featFree2"), t("featFree3"), t("featFree4")],
      cta: t("ctaFree"),
      featured: false,
    },
    {
      name: t("planPro"),
      price: t("pricePro"),
      period: t("perMonth"),
      desc: t("planProDesc"),
      features: [t("featPro1"), t("featPro2"), t("featPro3"), t("featPro4"), t("featPro5")],
      cta: t("ctaPro"),
      featured: true,
    },
    {
      name: t("planEnt"),
      price: t("priceEnt"),
      period: t("perMonth"),
      desc: t("planEntDesc"),
      features: [t("featEnt1"), t("featEnt2"), t("featEnt3"), t("featEnt4"), t("featEnt5")],
      cta: t("ctaEnt"),
      featured: false,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          {t("pricingTitle")}
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          {t("pricingDesc")}
        </p>
      </section>

      <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl p-6 border flex flex-col ${
              plan.featured
                ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30 shadow-lg"
                : "border-gray-200 dark:border-gray-800"
            }`}
          >
            <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{plan.desc}</p>
            <div className="mb-6">
              <span className="text-3xl font-bold">{plan.price}</span>
              {plan.period && (
                <span className="text-gray-500 text-sm">{plan.period}</span>
              )}
            </div>
            <ul className="space-y-2 mb-6 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-2.5 rounded-xl font-medium transition-colors ${
                plan.featured
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
