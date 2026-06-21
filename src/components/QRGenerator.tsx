"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useLang } from "@/context/LangContext";
import Link from "next/link";

type QrType = "url" | "text" | "wifi" | "vcard" | "email" | "image";

const QR_TYPES: { value: QrType; key: TranslationKey; icon: string }[] = [
  { value: "url", key: "qrTypeUrl", icon: "🔗" },
  { value: "text", key: "qrTypeText", icon: "📝" },
  { value: "wifi", key: "qrTypeWifi", icon: "📶" },
  { value: "vcard", key: "qrTypeVcard", icon: "👤" },
  { value: "email", key: "qrTypeEmail", icon: "✉️" },
  { value: "image", key: "qrTypeImage", icon: "🖼️" },
];

import type { TranslationKey } from "@/lib/i18n";

export default function QRGenerator() {
  const { t } = useLang();
  const [qrType, setQrType] = useState<QrType>("url");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [wifiEnc, setWifiEnc] = useState<"WPA" | "WEP" | "nopass">("WPA");
  const [vcardName, setVcardName] = useState("");
  const [vcardPhone, setVcardPhone] = useState("");
  const [vcardEmail, setVcardEmail] = useState("");
  const [emailAddr, setEmailAddr] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [imageUploadedUrl, setImageUploadedUrl] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState("");
  const [trialEnd, setTrialEnd] = useState<number | null>(null);
  const [trialTimeLeft, setTrialTimeLeft] = useState("");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(256);
  const [logo, setLogo] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("qrwing-trial-end");
    if (stored) {
      const end = parseInt(stored, 10);
      if (Date.now() < end) {
        setTrialEnd(end);
      } else {
        localStorage.removeItem("qrwing-trial-end");
      }
    }
  }, []);

  useEffect(() => {
    if (!trialEnd) return;
    const update = () => {
      const left = trialEnd - Date.now();
      if (left <= 0) {
        setTrialTimeLeft("");
        setTrialEnd(null);
        localStorage.removeItem("qrwing-trial-end");
        return;
      }
      const h = Math.floor(left / 3600000);
      const m = Math.floor((left % 3600000) / 60000);
      setTrialTimeLeft(h > 0 ? `${h}h ${m}m` : `${m}min`);
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, [trialEnd]);

  const startTrial = () => {
    const end = Date.now() + 86400000;
    localStorage.setItem("qrwing-trial-end", String(end));
    setTrialEnd(end);
  };

  const qrValue = useCallback(() => {
    switch (qrType) {
      case "url":
        return url;
      case "text":
        return text;
      case "wifi":
        return wifiPass
          ? `WIFI:T:${wifiEnc};S:${wifiSsid};P:${wifiPass};;`
          : `WIFI:T:nopass;S:${wifiSsid};;`;
      case "vcard":
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardName}\nTEL:${vcardPhone}\nEMAIL:${vcardEmail}\nEND:VCARD`;
      case "email":
        return `https://qrwing.vercel.app/mail?to=${encodeURIComponent(emailAddr)}&subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case "image":
        return imageUploadedUrl;
      default:
        return "";
    }
  }, [qrType, url, text, wifiSsid, wifiPass, wifiEnc, vcardName, vcardPhone, vcardEmail, emailAddr, emailSubject, emailBody, imageUploadedUrl]);

  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const maxDim = 1200;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error("Compression failed"));
        }, "image/jpeg", 0.8);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = url;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    setImageError("");
    setImageUploadedUrl("");
    try {
      const compressed = await compressImage(file);
      const form = new FormData();
      form.append("file", compressed, "qr-image.jpg");
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      if (!data.url) throw new Error("No URL returned");
      setImageUploadedUrl(data.url);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "Error al subir");
    } finally {
      setImageUploading(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogo(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const downloadQR = (format: "png" | "svg") => {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;
    if (format === "png") {
      const link = document.createElement("a");
      link.download = `qrwing-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } else {
      const svg = canvasRef.current?.querySelector("svg");
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
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        downloadQR("png");
      }
    });
  };

  const val = qrValue();
  const canGenerate = val.length > 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {QR_TYPES.map((qt) => (
              <button
                key={qt.value}
                onClick={() => setQrType(qt.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  qrType === qt.value
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {qt.icon} {t(qt.key)}
              </button>
            ))}
          </div>

          {qrType === "url" && (
            <input
              type="url"
              placeholder={t("placeUrl")}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            />
          )}

          {qrType === "text" && (
            <textarea
              placeholder={t("placeText")}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none"
            />
          )}

          {qrType === "wifi" && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder={t("placeWifiSsid")}
                value={wifiSsid}
                onChange={(e) => setWifiSsid(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
              />
              <input
                type="text"
                placeholder={t("placeWifiPass")}
                value={wifiPass}
                onChange={(e) => setWifiPass(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
              />
              <div>
                <select
                  value={wifiEnc}
                  onChange={(e) => setWifiEnc(e.target.value as typeof wifiEnc)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                >
                  <option value="WPA">{t("wifiWpa")}</option>
                  <option value="WEP">{t("wifiWep")}</option>
                  <option value="nopass">{t("wifiNone")}</option>
                </select>
                <p className="text-xs text-gray-400 mt-1.5">{t("wifiHelp")}</p>
              </div>
            </div>
          )}

          {qrType === "vcard" && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder={t("placeVcardName")}
                value={vcardName}
                onChange={(e) => setVcardName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
              />
              <input
                type="tel"
                placeholder={t("placeVcardPhone")}
                value={vcardPhone}
                onChange={(e) => setVcardPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
              />
              <input
                type="email"
                placeholder={t("placeVcardEmail")}
                value={vcardEmail}
                onChange={(e) => setVcardEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
              />
            </div>
          )}

          {qrType === "email" && (
            <div className="space-y-3">
              <input
                type="email"
                placeholder={t("placeEmailAddr")}
                value={emailAddr}
                onChange={(e) => setEmailAddr(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
              />
              <input
                type="text"
                placeholder={t("placeEmailSubj")}
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
              />
              <textarea
                placeholder={t("placeEmailBody")}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none"
              />
            </div>
          )}

          {qrType === "image" && (
            <div className="space-y-3">
              {trialEnd ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-lg text-xs font-medium">
                  <span>🕐</span>
                  <span>Prueba gratis — quedan <strong>{trialTimeLeft}</strong></span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium">
                  <span>🎁</span>
                  <span>Prueba gratis de <strong>24 horas</strong>. Al subir tu primera imagen, comienza el plazo.</span>
                </div>
              )}

              {trialEnd === null ? (
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:border-purple-400 transition-colors bg-white dark:bg-gray-800"
                  onClick={(e) => { if (!trialEnd && trialEnd !== null) e.preventDefault(); }}
                >
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">{t("placeImageUrl")}</span>
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => { startTrial(); handleImageUpload(e); }} className="hidden" />
                </label>
              ) : (
                <>
                  {imageUploadedUrl ? (
                    <div className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-green-300 dark:border-green-700 rounded-xl bg-white dark:bg-gray-800">
                      <img src={imageUploadedUrl} alt="Uploaded preview" className="h-24 w-auto rounded-lg object-contain" />
                      <span className="text-xs text-green-600 font-medium mt-1">¡Imagen subida!</span>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:border-purple-400 transition-colors bg-white dark:bg-gray-800">
                      {imageUploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                          <span className="text-sm text-gray-500">Subiendo...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm">{t("placeImageUrl")}</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                  {imageError && <p className="text-xs text-red-500">{imageError}</p>}
                  {imageUploadedUrl && (
                    <button onClick={() => { setImageUploadedUrl(""); setImageError(""); }} className="text-xs text-red-500 hover:text-red-600">
                      Quitar imagen
                    </button>
                  )}
                </>
              )}

              {trialEnd === null && (
                <div className="text-center py-6 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                  <span className="text-2xl">🔒</span>
                  <p className="text-sm text-gray-500 mt-2 mb-3">Sube imágenes en QR por tiempo limitado</p>
                  <Link href="/pricing" className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                    Ver planes
                  </Link>
                </div>
              )}
            </div>
          )}

          <details className="text-sm">
            <summary className="cursor-pointer text-gray-500 hover:text-purple-600 font-medium">
              {t("customize")}
            </summary>
            <div className="mt-3 flex gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t("colorQr")}</label>
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t("colorBg")}</label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t("logo")}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="text-xs w-28"
                />
                {logo && (
                  <button
                    onClick={() => setLogo(null)}
                    className="block text-xs text-red-500 mt-1"
                  >
                    {t("removeLogo")}
                  </button>
                )}
              </div>
            </div>
          </details>

          <div className="flex gap-2">
            <label className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">{t("size")}</span>
              <select
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
              >
                <option value={128}>{t("sizeSmall")}</option>
                <option value={256}>{t("sizeMed")}</option>
                <option value={384}>{t("sizeLarge")}</option>
                <option value={512}>{t("sizeXl")}</option>
              </select>
            </label>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <div
            ref={canvasRef}
            className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200"
          >
            {canGenerate ? (
              <QRCodeCanvas
                value={val}
                size={size}
                fgColor={fgColor}
                bgColor={bgColor}
                level="H"
                includeMargin
                imageSettings={
                  logo
                    ? {
                        src: logo,
                        height: size * 0.25,
                        width: size * 0.25,
                        excavate: true,
                      }
                    : undefined
                }
              />
            ) : (
              <div
                className="flex items-center justify-center text-gray-400"
                style={{ width: size, height: size }}
              >
                <p className="text-sm text-center px-4">
                  {t("placeholderQr")}
                </p>
              </div>
            )}
          </div>

          {canGenerate && (
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => downloadQR("png")}
                className="px-5 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
              >
                {t("downloadPng")}
              </button>
              <button
                onClick={() => downloadQR("svg")}
                className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {t("downloadSvg")}
              </button>
              <button
                onClick={copyToClipboard}
                className="px-5 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {copied ? t("copied") : t("copy")}
              </button>
            </div>
          )}

          <p className="text-xs text-gray-400 text-center max-w-xs">
            {t("staticFree")}
          </p>
        </div>
      </div>
    </div>
  );
}
