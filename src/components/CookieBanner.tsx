"use client";

import { useState, useEffect } from "react";

const CONSENT_KEY = "qrwing-cookie-consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg p-4">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-3 text-sm">
        <p className="text-gray-600 dark:text-gray-400 text-center sm:text-left">
          Usamos cookies esenciales para el funcionamiento del sitio. Al continuar, aceptas nuestra{" "}
          <a href="/privacy" className="underline text-purple-600 hover:text-purple-700">política de privacidad</a>{" "}
          y{" "}
          <a href="/tos" className="underline text-purple-600 hover:text-purple-700">términos de servicio</a>.
        </p>
        <button
          onClick={accept}
          className="shrink-0 px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium transition"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
