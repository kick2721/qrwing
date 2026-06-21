"use client";

import { useState, useRef, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useLang } from "@/context/LangContext";

type QrType = "url" | "text" | "wifi" | "vcard" | "email";

const QR_TYPES: { value: QrType; key: TranslationKey; icon: string }[] = [
  { value: "url", key: "qrTypeUrl", icon: "🔗" },
  { value: "text", key: "qrTypeText", icon: "📝" },
  { value: "wifi", key: "qrTypeWifi", icon: "📶" },
  { value: "vcard", key: "qrTypeVcard", icon: "👤" },
  { value: "email", key: "qrTypeEmail", icon: "✉️" },
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
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(256);
  const [logo, setLogo] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

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
        return `mailto:${emailAddr}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      default:
        return "";
    }
  }, [qrType, url, text, wifiSsid, wifiPass, wifiEnc, vcardName, vcardPhone, vcardEmail, emailAddr, emailSubject, emailBody]);

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
              <select
                value={wifiEnc}
                onChange={(e) => setWifiEnc(e.target.value as typeof wifiEnc)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
              >
                <option value="WPA">{t("wifiWpa")}</option>
                <option value="WEP">{t("wifiWep")}</option>
                <option value="nopass">{t("wifiNone")}</option>
              </select>
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
