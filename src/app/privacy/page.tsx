"use client";

import { useLang } from "@/context/LangContext";
import BackToHome from "@/components/BackToHome";

export default function PrivacyPage() {
  const { t } = useLang();
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-gray-700 dark:text-gray-300">
      <BackToHome />
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{t("privacyTitle")}</h1>
      <p className="text-sm text-gray-500 mb-2">{t("privacyUpdated")}</p>
      <p className="text-sm text-gray-500 mb-8">
        {t("privacyScope")} <strong>qrwing.vercel.app</strong> {t("privacyScopeSuffix")}
      </p>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t("privacySec1Title")}</h2>
          <p>{t("privacySec1Content")} <a href="mailto:qrwing.app@gmail.com" className="text-purple-600 hover:underline">qrwing.app@gmail.com</a>.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t("privacySec2Title")}</h2>

          <h3 className="font-semibold mt-4 mb-1 text-gray-800 dark:text-gray-200">{t("privacySec21Title")}</h3>
          <p>{t("privacySec21Content1")}</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>{t("privacySec21Content2")}</li>
            <li>{t("privacySec21Content3")}</li>
            <li>{t("privacySec21Content4")}</li>
          </ul>
          <p className="mt-1"><strong>{t("privacySec21PurposeLabel")}</strong> {t("privacySec21PurposeText")}</p>
          <p><strong>{t("privacySec21BasisLabel")}</strong> {t("privacySec21BasisText")}</p>

          <h3 className="font-semibold mt-4 mb-1 text-gray-800 dark:text-gray-200">{t("privacySec22Title")}</h3>
          <p>{t("privacySec22Content")}</p>
          <p><strong>{t("privacySec22PurposeLabel")}</strong> {t("privacySec22PurposeText")}</p>
          <p><strong>{t("privacySec22BasisLabel")}</strong> {t("privacySec22BasisText")}</p>

          <h3 className="font-semibold mt-4 mb-1 text-gray-800 dark:text-gray-200">{t("privacySec23Title")}</h3>
          <p>{t("privacySec23Content")}</p>
          <p><strong>{t("privacySec23PurposeLabel")}</strong> {t("privacySec23PurposeText")}</p>
          <p><strong>{t("privacySec23BasisLabel")}</strong> {t("privacySec23BasisText")}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t("privacySec3Title")}</h2>
          <p>{t("privacySec3Intro")} <strong>{t("privacySec3Essential")}</strong> {t("privacySec3IntroSuffix")}</p>
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                  <th className="text-left py-2 pr-4 font-medium">{t("privacyCookieCol")}</th>
                  <th className="text-left py-2 pr-4 font-medium">{t("privacyPurposeCol")}</th>
                  <th className="text-left py-2 pr-4 font-medium">{t("privacyDurationCol")}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <td className="py-2 pr-4 font-mono text-xs">next-auth.session-token</td>
                  <td className="py-2 pr-4">{t("privacyCookieSessAuth")}</td>
                  <td className="py-2 pr-4">{t("privacyCookieSessDur")}</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <td className="py-2 pr-4 font-mono text-xs">qrwing-lang</td>
                  <td className="py-2 pr-4">{t("privacyCookieLang")}</td>
                  <td className="py-2 pr-4">{t("privacyCookieLangDur")}</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <td className="py-2 pr-4 font-mono text-xs">qrwing-theme</td>
                  <td className="py-2 pr-4">{t("privacyCookieTheme")}</td>
                  <td className="py-2 pr-4">{t("privacyCookieThemeDur")}</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <td className="py-2 pr-4 font-mono text-xs">qrwing-cookie-consent</td>
                  <td className="py-2 pr-4">{t("privacyCookieConsent")}</td>
                  <td className="py-2 pr-4">{t("privacyCookieConsentDur")}</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <td className="py-2 pr-4 font-mono text-xs">__Secure-next-auth.callback-url</td>
                  <td className="py-2 pr-4">{t("privacyCookieCsrf")}</td>
                  <td className="py-2 pr-4">{t("privacyCookieCsrfDur")}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3">{t("privacySec3Footer")} <strong>{t("privacySec3Not")}</strong> {t("privacySec3FooterSuffix")}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t("privacySec4Title")}</h2>
          <p>{t("privacySec4Intro")} <strong>{t("privacySec4Not")}</strong> {t("privacySec4IntroSuffix")}</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Supabase</strong> {t("privacySec4Item1")}</li>
            <li><strong>Vercel Inc.</strong> {t("privacySec4Item2")}</li>
            <li><strong>Vercel Blob</strong> {t("privacySec4Item3")}</li>
            <li><strong>Google, GitHub, Discord</strong> {t("privacySec4Item4")}</li>
            <li><strong>ip-api.com</strong> {t("privacySec4Item5")}</li>
          </ul>
          <p className="mt-2">{t("privacySec4Outro")}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t("privacySec5Title")}</h2>
          <p>{t("privacySec5Content")}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t("privacySec6Title")}</h2>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>{t("privacySec6Item1Label")}</strong> {t("privacySec6Item1Text")}</li>
            <li><strong>{t("privacySec6Item2Label")}</strong> {t("privacySec6Item2Text")}</li>
            <li><strong>{t("privacySec6Item3Label")}</strong> {t("privacySec6Item3Text")}</li>
            <li><strong>{t("privacySec6Item4Label")}</strong> {t("privacySec6Item4Text")}</li>
            <li><strong>{t("privacySec6Item5Label")}</strong> {t("privacySec6Item5Text")}</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t("privacySec7Title")}</h2>
          <p>{t("privacySec7Intro")}</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>{t("privacySec7Item1Label")}</strong> {t("privacySec7Item1Text")}</li>
            <li><strong>{t("privacySec7Item2Label")}</strong> {t("privacySec7Item2Text")}</li>
            <li><strong>{t("privacySec7Item3Label")}</strong> {t("privacySec7Item3Text")}</li>
            <li><strong>{t("privacySec7Item4Label")}</strong> {t("privacySec7Item4Text")}</li>
            <li><strong>{t("privacySec7Item5Label")}</strong> {t("privacySec7Item5Text")}</li>
            <li><strong>{t("privacySec7Item6Label")}</strong> {t("privacySec7Item6Text")}</li>
          </ul>
          <p className="mt-2">{t("privacySec7Outro")} <a href="mailto:qrwing.app@gmail.com" className="text-purple-600 hover:underline">qrwing.app@gmail.com</a>{t("privacySec7OutroSuffix")}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t("privacySec8Title")}</h2>
          <p>{t("privacySec8Intro")}</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>{t("privacySec8Item1")}</li>
            <li>{t("privacySec8Item2")}</li>
            <li>{t("privacySec8Item3")}</li>
            <li>{t("privacySec8Item4")}</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t("privacySec9Title")}</h2>
          <p>{t("privacySec9Content")}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t("privacySec10Title")}</h2>
          <p>{t("privacySec10Content")}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t("privacySec11Title")}</h2>
          <p>{t("privacySec11Intro")}</p>
          <p className="mt-2">
            {t("privacySec11EmailLabel")} <a href="mailto:qrwing.app@gmail.com" className="text-purple-600 hover:underline">qrwing.app@gmail.com</a>
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t("privacySec12Title")}</h2>
          <p>{t("privacySec12Content")}</p>
        </div>
      </section>
    </main>
  );
}
