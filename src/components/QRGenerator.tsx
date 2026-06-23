"use client";

import { useState, useRef, useEffect } from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { useLang } from "@/context/LangContext";
import { useSession } from "next-auth/react";
import Link from "next/link";
import QRForm, { QRFormData } from "./QRForm";
import { FREE_MAX_QR } from "@/lib/constants";

const STORAGE_KEY = "qrwing_last_qr";

export default function QRGenerator() {
  const { t } = useLang();
  const { data: session } = useSession();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [qrData, setQrData] = useState<QRFormData | null>(null);
  const [copied, setCopied] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setQrData(parsed);
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
  }, []);

  const withAuth = (action: () => void) => {
    if (session?.user) {
      action();
    } else {
      setPendingAction(() => action);
      setShowLoginPrompt(true);
    }
  };

  const handleSignIn = async () => {
    try {
      if (qrData) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(qrData));
    } catch {}
    window.location.href = "/auth/signin";
  };

  const saveQR = async (data: QRFormData) => {
    if (!session?.user) { handleSignIn(); return; }
    if (!data.hasValues) return;
    setSaving(true);
    setSaveError("");
    try {
      const r = await fetch("/api/qrcodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: data.type,
          content: data.content,
          redirect_to: data.redirect_to,
          label: data.label,
          config: data.config,
        }),
      });
      if (r.status === 402) { setSaveError("limit"); return; }
      if (!r.ok) { setSaveError("error"); return; }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setSaveError("error");
    } finally {
      setSaving(false);
    }
  };

  const downloadQR = (format: "png" | "svg") => {
    if (format === "png") {
      const canvas = canvasRef.current?.querySelector("canvas");
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = `qrwing-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } else {
      const svg = document.querySelector("#qr-svg-download svg") as SVGSVGElement;
      if (!svg) return;
      const clone = svg.cloneNode(true) as SVGSVGElement;
      clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      const blob = new Blob([clone.outerHTML], { type: "image/svg+xml" });
      const link = document.createElement("a");
      link.download = `qrwing-${Date.now()}.svg`;
      link.href = URL.createObjectURL(blob);
      link.click();
    }
  };

  const copyToClipboard = async () => {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch { downloadQR("png"); }
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <QRForm onChange={setQrData} onSubmit={saveQR} submitLabel={t("save")} saving={saving} />
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <div ref={canvasRef} className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
            {qrData?.hasValues ? (
              <>
                <QRCodeCanvas value={qrData.content} size={qrData.config.size} fgColor={qrData.config.fgColor} bgColor={qrData.config.bgColor} level="H" includeMargin
                  imageSettings={qrData.config.logo ? { src: qrData.config.logo, height: qrData.config.size * 0.25, width: qrData.config.size * 0.25, excavate: true } : undefined} />
                <div id="qr-svg-download" style={{ display: "none" }}>
                  <QRCodeSVG value={qrData.content} size={qrData.config.size} fgColor={qrData.config.fgColor} bgColor={qrData.config.bgColor} level="H" includeMargin
                    imageSettings={qrData.config.logo ? { src: qrData.config.logo, height: qrData.config.size * 0.25, width: qrData.config.size * 0.25, excavate: true } : undefined} />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center text-gray-400" style={{ width: 256, height: 256 }}>
                <p className="text-sm text-center px-4">{t("placeholderQr")}</p>
              </div>
            )}
          </div>

          {qrData?.hasValues && (
            <div className="flex flex-wrap gap-2 justify-center">
              <button onClick={() => withAuth(() => downloadQR("png"))} className="px-5 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition duration-75 active:scale-[0.95]">{t("downloadPng")}</button>
              <button onClick={() => withAuth(() => downloadQR("svg"))} className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-75 active:scale-[0.95]">{t("downloadSvg")}</button>
              <button onClick={() => withAuth(copyToClipboard)} className="px-5 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-75 active:scale-[0.95]">{copied ? t("copied") : t("copy")}</button>
              {saveError === "limit" && (
                <div className="w-full bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl p-4 text-center">
                  <p className="text-sm font-medium text-purple-800 dark:text-purple-200">{t("saveLimitTitle")} <strong>{FREE_MAX_QR} {t("saveLimitQr")}</strong></p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">{t("saveLimitDesc")}</p>
                  <a href="/pricing" className="inline-block mt-3 px-5 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors active:scale-[0.95]">{t("upgradeToPro")} →</a>
                </div>
              )}
            </div>
          )}

          <p className="text-xs text-gray-400 text-center max-w-xs">{t("staticFree")}</p>
        </div>
      </div>

      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">{t("signInRequired")}</h3>
            <p className="text-sm text-gray-500 mb-6">{t("signInRequiredDesc")}</p>
            <button onClick={handleSignIn} className="w-full px-5 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors">{t("signInRequired")}</button>
            <button onClick={() => setShowLoginPrompt(false)} className="mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
