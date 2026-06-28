"use client";

import { useState, useRef, useEffect } from "react";
import QRCodeStyling from "qr-code-styling";
import { useLang } from "@/context/LangContext";
import { useSession } from "next-auth/react";
import QRForm, { type QRFormData } from "./QRForm";
import { FREE_MAX_QR } from "@/lib/constants";
import { contrastRatio } from "@/lib/color";

const STORAGE_KEY = "generadorqr_last_qr";

export function buildQrOptions(data: QRFormData) {
  const size = data.config.size || 256;
  const fg = data.config.fgColor || "#000000";
  const bg = data.config.bgColor || "#ffffff";
  const dotsType = data.config.dotsType || "square";
  const cornersSquareType = data.config.cornersSquareType || "square";
  const cornersDotType = data.config.cornersDotType || "square";
  const gradientType = data.config.gradientType;
  const gradientColor1 = data.config.gradientColor1;
  const gradientColor2 = data.config.gradientColor2;

  const dotsOptions: any = { type: dotsType, color: fg };
  if (gradientType && gradientColor1 && gradientColor2) {
    dotsOptions.color = undefined;
    dotsOptions.gradient = {
      type: gradientType,
      rotation: 0,
      colorStops: [
        { offset: 0, color: gradientColor1 },
        { offset: 1, color: gradientColor2 },
      ],
    };
  }

  return {
    width: size,
    height: size,
    data: data.content,
    image: data.config.logo || undefined,
    dotsOptions,
    cornersSquareOptions: { type: cornersSquareType, color: fg },
    cornersDotOptions: { type: cornersDotType, color: fg },
    backgroundOptions: { color: bg },
    imageOptions: {
      imageSize: 0.25,
      hideBackgroundDots: true,
      crossOrigin: "anonymous",
    },
    qrOptions: { errorCorrectionLevel: "H" as const },
  };
}

export default function QRGenerator() {
  const { t } = useLang();
  const { data: session } = useSession();
  const [saveError, setSaveError] = useState("");
  const [savedOk, setSavedOk] = useState(false);
  const [qrData, setQrData] = useState<QRFormData | null>(null);
  const [copied, setCopied] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [restoredForm, setRestoredForm] = useState<Record<string, any> | null>(null);
  const [plan, setPlan] = useState("free");
  const [showLogoProModal, setShowLogoProModal] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<any>(null);

  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/user/plan").then(r => r.json()).then(d => { if (d.plan) setPlan(d.plan); }).catch(() => {});
  }, [session]);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setQrData(parsed);
        setRestoredForm(parsed);
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!qrData?.hasValues || !canvasRef.current) {
      if (qrRef.current && canvasRef.current) {
        canvasRef.current.innerHTML = "";
        qrRef.current = null;
      }
      return;
    }

    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling(buildQrOptions(qrData));
      qrRef.current.append(canvasRef.current);
    } else {
      qrRef.current.update(buildQrOptions(qrData));
    }
  }, [qrData]);

  const hasLogo = qrData?.config?.logo != null;
  const isLogoBlocked = hasLogo && plan !== "pro";

  const withPro = (cb: () => void) => {
    if (isLogoBlocked) { setShowLogoProModal(true); }
    else { cb(); }
  };

  const withAuth = (cb: () => void) => {
    if (session?.user) { cb(); }
    else { setShowLoginPrompt(true); }
  };

  const handleSignIn = () => {
    try { if (qrData) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(qrData)); } catch {}
    window.location.href = "/auth/signin";
  };

  const saveToServer = async () => {
    if (!qrData?.hasValues) return null;
    setSaveError("");
    setSavedOk(false);
    try {
      const r = await fetch("/api/qrcodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: qrData.type,
          content: qrData.content,
          redirect_to: qrData.redirect_to,
          label: qrData.label,
          config: qrData.config,
        }),
      });
      if (r.status === 402) {
        const body = await r.json().catch(() => ({}));
        setSaveError(body?.error?.includes("Logo") ? "logo" : "limit");
        return null;
      }
      if (!r.ok) { setSaveError("error"); return null; }
      const result = await r.json();
      setQrData(prev => prev ? { ...prev, content: result.content } : null);
      setSavedOk(true);
      setTimeout(() => setSavedOk(false), 2000);
      return result.content as string;
    } catch { setSaveError("error"); return null; }
  };

  const downloadQR = async (format: "png" | "svg") => {
    if (!qrRef.current) return;
    if (format === "svg") {
      const blob = await qrRef.current.getRawData("svg");
      const link = document.createElement("a");
      link.download = `qrwing-${Date.now()}.svg`;
      link.href = URL.createObjectURL(blob);
      link.click();
    } else {
      qrRef.current.download({ name: `qrwing-${Date.now()}`, extension: "png" });
    }
  };

  const copyToClipboard = async () => {
    if (!qrRef.current) return;
    try {
      const blob = await qrRef.current.getRawData("png");
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      qrRef.current.download({ name: `qrwing-${Date.now()}`, extension: "png" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <QRForm key={restoredForm ? "restored" : "fresh"} plan={plan} initialValues={restoredForm ? (() => { const c = restoredForm.content; const cfg = restoredForm.config || {}; const t = restoredForm.type; const base = { fgColor: cfg.fgColor, bgColor: cfg.bgColor, size: cfg.size, logo: cfg.logo, gradientType: cfg.gradientType, gradientColor1: cfg.gradientColor1, gradientColor2: cfg.gradientColor2, dotsType: cfg.dotsType, cornersSquareType: cfg.cornersSquareType, cornersDotType: cfg.cornersDotType }; if (t === "url" || t === "youtube" || t === "appstore") return { ...base, type: t, ...(t === "url" ? { url: c } : t === "youtube" ? { youtubeUrl: c } : { appstoreUrl: c }) }; if (t === "text") return { ...base, type: t, text: c }; if (t === "whatsapp") { try { const u = new URL(c); return { ...base, type: t, whatsappPhone: u.pathname.replace("/", ""), whatsappMsg: u.searchParams.get("text") || "" }; } catch { return { ...base, type: t, whatsappPhone: c }; } } if (t === "phone") return { ...base, type: t, phoneNumber: c.replace("tel:", "") }; if (t === "sms") { const m = c.match(/^smsto:(.+?):(.+)$/); return { ...base, type: t, smsPhone: m ? m[1] : c.replace("smsto:", ""), smsMsg: m ? m[2] : "" }; } if (t === "location") return { ...base, type: t, locationQuery: decodeURIComponent(c.replace("https://maps.google.com/maps?q=", "")) }; if (t === "calendar") { const g = (k: string) => c.match(new RegExp(`${k}:(.+)`))?.[1]?.trim() || ""; const dt = g("DTSTART").replace(/(\d{4})(\d{2})(\d{2})T?(\d{0,2})(\d{0,2})/, (_m: string, y: string, mo: string, d: string, h: string, min: string) => `${y}-${mo}-${d}${h ? ` ${h}:${min || "00"}` : ""}`); return { ...base, type: t, calendarTitle: g("SUMMARY"), calendarDate: dt, calendarLocation: g("LOCATION"), calendarDesc: g("DESCRIPTION") }; } if (t === "telegram") { try { const u = new URL(c); return { ...base, type: t, telegramUser: u.pathname.replace("/", ""), telegramMsg: u.searchParams.get("text") || "" }; } catch { return { ...base, type: t, telegramUser: c }; } } return { ...base, type: t, text: c }; })() : undefined} onChange={setQrData} />
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <div ref={canvasRef} className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200" style={{ minWidth: 256, minHeight: 256 }}>
            {!qrData?.hasValues && (
              <div className="flex items-center justify-center text-gray-400" style={{ width: 256, height: 256 }}>
                <p className="text-sm text-center px-4">{t("placeholderQr")}</p>
              </div>
            )}
          </div>

          {qrData?.hasValues && (
            <>
              {(() => {
                const ratio = contrastRatio(qrData.config.fgColor, qrData.config.bgColor);
                if (ratio >= 3) return null;
                return (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 text-center">⚠️ {t("lowContrast").replace("{n}", ratio.toFixed(1))}</p>
                );
              })()}
              <div className="flex flex-wrap gap-2 justify-center">
              <button onClick={() => withAuth(() => withPro(async () => { await saveToServer(); downloadQR("png"); }))} className="px-5 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition duration-75 active:scale-[0.95]">{t("downloadPng")}</button>
              <button onClick={() => withAuth(() => withPro(async () => { await saveToServer(); downloadQR("svg"); }))} className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-75 active:scale-[0.95]">{t("downloadSvg")}</button>
              <button onClick={() => withAuth(() => withPro(async () => { await saveToServer(); copyToClipboard(); }))} className="px-5 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-75 active:scale-[0.95]">{copied ? t("copied") : t("copy")}</button>
              {savedOk && (
                <a href="/dashboard" className="text-xs text-green-600 font-medium hover:underline">
                  {t("saved")} — {t("viewDashboard")}
                </a>
              )}
              {saveError === "error" && <span className="text-xs text-red-500 font-medium">{t("saveError")}</span>}
              {saveError === "limit" && (
                <div className="w-full bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl p-4 text-center">
                  <p className="text-sm font-medium text-purple-800 dark:text-purple-200">{t("saveLimitTitle")} <strong>{FREE_MAX_QR} {t("saveLimitQr")}</strong></p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">{t("saveLimitDesc")}</p>
                  <a href="/pricing" className="inline-block mt-3 px-5 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors active:scale-[0.95]">{t("upgradeToPro")} →</a>
                </div>
              )}
              {saveError === "logo" && (
                <div className="w-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-center">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">{t("logoProOnly")}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">{t("logoHelp")}</p>
                  <a href="/pricing" className="inline-block mt-3 px-5 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors active:scale-[0.95]">{t("upgradeToPro")} →</a>
                </div>
              )}
            </div>
            </>
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

      {showLogoProModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⭐</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">{t("logoProOnly")}</h3>
            <p className="text-sm text-gray-500 mb-6">{t("logoHelp")}</p>
            <a href="/pricing" className="block w-full px-5 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors">{t("upgradeToPro")} →</a>
            <button onClick={() => setShowLogoProModal(false)} className="mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
