"use client";

import { useState, useCallback, useEffect } from "react";
import { useLang } from "@/context/LangContext";

type QrType = "url" | "text" | "wifi" | "vcard" | "email" | "image";

interface QRFormInitialValues {
  type?: QrType;
  url?: string;
  text?: string;
  wifiSsid?: string;
  wifiPass?: string;
  wifiEnc?: "WPA" | "WEP" | "nopass";
  vcardName?: string;
  vcardPhone?: string;
  vcardEmail?: string;
  emailAddr?: string;
  emailSubject?: string;
  emailBody?: string;
  imageUploadedUrl?: string;
  fgColor?: string;
  bgColor?: string;
  size?: number;
  logo?: string | null;
}

export interface QRFormData {
  type: QrType;
  content: string;
  redirect_to: string;
  label: string;
  config: any;
  hasValues: boolean;
}

interface Props {
  initialValues?: QRFormInitialValues;
  onChange?: (data: QRFormData) => void;
  onSubmit?: (data: QRFormData) => Promise<void>;
  submitLabel?: string;
  saving?: boolean;
  plan?: string;
}

const QR_TYPES: { value: QrType; key: any; icon: string }[] = [
  { value: "url", key: "qrTypeUrl", icon: "🔗" },
  { value: "text", key: "qrTypeText", icon: "📝" },
  { value: "wifi", key: "qrTypeWifi", icon: "📶" },
  { value: "vcard", key: "qrTypeVcard", icon: "👤" },
  { value: "email", key: "qrTypeEmail", icon: "✉️" },
  { value: "image", key: "qrTypeImage", icon: "🖼️" },
];

export default function QRForm({ initialValues, onChange, onSubmit, submitLabel, saving, plan = "free" }: Props) {
  const { t } = useLang();
  const [qrType, setQrType] = useState<QrType>(initialValues?.type || "url");
  const [url, setUrl] = useState(initialValues?.url || "");
  const [text, setText] = useState(initialValues?.text || "");
  const [wifiSsid, setWifiSsid] = useState(initialValues?.wifiSsid || "");
  const [wifiPass, setWifiPass] = useState(initialValues?.wifiPass || "");
  const [wifiEnc, setWifiEnc] = useState<"WPA" | "WEP" | "nopass">(initialValues?.wifiEnc || "WPA");
  const [vcardName, setVcardName] = useState(initialValues?.vcardName || "");
  const [vcardPhone, setVcardPhone] = useState(initialValues?.vcardPhone || "");
  const [vcardEmail, setVcardEmail] = useState(initialValues?.vcardEmail || "");
  const [emailAddr, setEmailAddr] = useState(initialValues?.emailAddr || "");
  const [emailSubject, setEmailSubject] = useState(initialValues?.emailSubject || "");
  const [emailBody, setEmailBody] = useState(initialValues?.emailBody || "");
  const [imageUploadedUrl, setImageUploadedUrl] = useState(initialValues?.imageUploadedUrl || "");
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState("");
  const [fgColor, setFgColor] = useState(initialValues?.fgColor || "#000000");
  const [bgColor, setBgColor] = useState(initialValues?.bgColor || "#ffffff");
  const [size, setSize] = useState(initialValues?.size || 256);
  const [logo, setLogo] = useState<string | null>(initialValues?.logo || null);

  useEffect(() => {
    if (!initialValues) return;
    if (initialValues.type) setQrType(initialValues.type);
    if (initialValues.url !== undefined) setUrl(initialValues.url);
    if (initialValues.text !== undefined) setText(initialValues.text);
    if (initialValues.wifiSsid !== undefined) setWifiSsid(initialValues.wifiSsid);
    if (initialValues.wifiPass !== undefined) setWifiPass(initialValues.wifiPass);
    if (initialValues.wifiEnc) setWifiEnc(initialValues.wifiEnc);
    if (initialValues.vcardName !== undefined) setVcardName(initialValues.vcardName);
    if (initialValues.vcardPhone !== undefined) setVcardPhone(initialValues.vcardPhone);
    if (initialValues.vcardEmail !== undefined) setVcardEmail(initialValues.vcardEmail);
    if (initialValues.emailAddr !== undefined) setEmailAddr(initialValues.emailAddr);
    if (initialValues.emailSubject !== undefined) setEmailSubject(initialValues.emailSubject);
    if (initialValues.emailBody !== undefined) setEmailBody(initialValues.emailBody);
    if (initialValues.fgColor) setFgColor(initialValues.fgColor);
    if (initialValues.bgColor) setBgColor(initialValues.bgColor);
    if (initialValues.size) setSize(initialValues.size);
    if (initialValues.logo !== undefined) setLogo(initialValues.logo);
  }, [initialValues]);

  const qrValue = useCallback(() => {
    switch (qrType) {
      case "url": return url;
      case "text": return text;
      case "wifi": return wifiPass ? `WIFI:T:${wifiEnc};S:${wifiSsid};P:${wifiPass};;` : `WIFI:T:nopass;S:${wifiSsid};;`;
      case "vcard": return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardName}\nTEL:${vcardPhone}\nEMAIL:${vcardEmail}\nEND:VCARD`;
      case "email": return `https://qrwing.vercel.app/mail?to=${encodeURIComponent(emailAddr)}&subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case "image": return imageUploadedUrl;
      default: return "";
    }
  }, [qrType, url, text, wifiSsid, wifiPass, wifiEnc, vcardName, vcardPhone, vcardEmail, emailAddr, emailSubject, emailBody, imageUploadedUrl]);

  const getData = useCallback((): QRFormData => {
    const val = qrValue();
    return {
      type: qrType,
      content: val,
      redirect_to: val,
      label: val.slice(0, 60),
      config: { fgColor, bgColor, size, logo },
      hasValues: val.length > 0,
    };
  }, [qrValue, qrType, fgColor, bgColor, size, logo]);

  useEffect(() => {
    if (onChange) onChange(getData());
  }, [getData, onChange]);

  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        let { width, height } = img;
        const maxDim = 1200;
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
        canvas.toBlob((b) => { if (b) resolve(b); else reject(new Error("Compression failed")); }, "image/jpeg", 0.8);
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
      setImageError(err instanceof Error ? err.message : t("imageUploadError"));
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {QR_TYPES.map((qt) => (
          <button key={qt.value} onClick={() => setQrType(qt.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition duration-75 active:scale-[0.93] ${qrType === qt.value ? "bg-purple-600 text-white" : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
            {qt.icon} {t(qt.key)}
          </button>
        ))}
      </div>

      {qrType === "url" && (
        <input type="url" placeholder={t("placeUrl")} value={url} onChange={(e) => setUrl(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
      )}

      {qrType === "text" && (
        <textarea placeholder={t("placeText")} value={text} onChange={(e) => setText(e.target.value)} rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none" />
      )}

      {qrType === "wifi" && (
        <div className="space-y-3">
          <input type="text" placeholder={t("placeWifiSsid")} value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
          <input type="text" placeholder={t("placeWifiPass")} value={wifiPass} onChange={(e) => setWifiPass(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
          <div>
            <select value={wifiEnc} onChange={(e) => setWifiEnc(e.target.value as typeof wifiEnc)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none">
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
          <input type="text" placeholder={t("placeVcardName")} value={vcardName} onChange={(e) => setVcardName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
          <input type="tel" placeholder={t("placeVcardPhone")} value={vcardPhone} onChange={(e) => setVcardPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
          <input type="email" placeholder={t("placeVcardEmail")} value={vcardEmail} onChange={(e) => setVcardEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
        </div>
      )}

      {qrType === "email" && (
        <div className="space-y-3">
          <input type="email" placeholder={t("placeEmailAddr")} value={emailAddr} onChange={(e) => setEmailAddr(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
          <input type="text" placeholder={t("placeEmailSubj")} value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
          <textarea placeholder={t("placeEmailBody")} value={emailBody} onChange={(e) => setEmailBody(e.target.value)} rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none" />
        </div>
      )}

      {qrType === "image" && (
        <div className="space-y-3">
          {plan === "pro" ? (
            <>
              {imageUploadedUrl ? (
                <div className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-green-300 dark:border-green-700 rounded-xl bg-white dark:bg-gray-800">
                  <img src={imageUploadedUrl} alt="Uploaded preview" className="h-24 w-auto rounded-lg object-contain" />
                  <span className="text-xs text-green-600 font-medium mt-1">{t("imageUploaded")}</span>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:border-purple-400 transition-colors bg-white dark:bg-gray-800">
                  {imageUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-gray-500">{t("uploading")}</span>
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
                  {t("removeImage")}
                </button>
              )}
            </>
          ) : (
            <div className="text-center py-6 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
              <span className="text-2xl">🔒</span>
              <p className="text-sm text-gray-500 mt-2 mb-3">{t("imageTrialDesc")}</p>
              <a href="/pricing" className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">{t("viewPlans")}</a>
            </div>
          )}
        </div>
      )}

      <details open className="text-sm">
        <summary className="cursor-pointer text-gray-500 hover:text-purple-600 font-medium">{t("customize")}</summary>
        <div className="mt-3 flex gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t("colorQr")}</label>
            <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-12 h-10 rounded cursor-pointer" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t("colorBg")}</label>
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-12 h-10 rounded cursor-pointer" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t("logo")} <span className="text-purple-500 font-medium">Pro</span></label>
            {plan === "pro" ? (
              <>
                <p className="text-[10px] text-gray-400 mb-1 leading-tight">{t("logoHelp")}</p>
                <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = (ev) => setLogo(ev.target?.result as string); reader.readAsDataURL(file); }}} className="text-xs" />
                {logo && <button onClick={() => setLogo(null)} className="block text-xs text-red-500 mt-1">{t("removeLogo")}</button>}
              </>
            ) : (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <span>🔒</span>
                <span>{t("logoProOnly")}</span>
              </div>
            )}
          </div>
        </div>
      </details>

      <div className="flex gap-2">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">{t("size")}</span>
          <select value={size} onChange={(e) => setSize(Number(e.target.value))}
            className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm">
            <option value={128}>{t("sizeSmall")}</option>
            <option value={256}>{t("sizeMed")}</option>
            <option value={384}>{t("sizeLarge")}</option>
            <option value={512}>{t("sizeXl")}</option>
          </select>
        </label>
      </div>

      {onSubmit && (
        <button onClick={() => onSubmit(getData())} disabled={saving || !getData().hasValues}
          className="w-full px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition duration-75 active:scale-[0.95] disabled:opacity-50 disabled:active:scale-100">
          {saving ? t("saving") : submitLabel || t("save")}
        </button>
      )}
    </div>
  );
}
