"use client";

import { useState } from "react";
import QRForm, { QRFormData } from "./QRForm";
import { useLang } from "@/context/LangContext";

interface QRCodeData {
  id: string;
  type: string;
  content: string;
  redirect_to: string;
  label: string;
  config: any;
  scan_count: number;
  created_at: string;
}

interface Props {
  qr: QRCodeData;
  onClose: () => void;
  onSaved: () => void;
}

function parseQRValues(qr: QRCodeData) {
  const config = typeof qr.config === "string" ? JSON.parse(qr.config) : (qr.config || {});
  const base: any = { fgColor: config.fgColor || "#000000", bgColor: config.bgColor || "#ffffff", size: config.size || 256, logo: config.logo || null, gradientType: config.gradientType || "", gradientColor1: config.gradientColor1 || "#667eea", gradientColor2: config.gradientColor2 || "#764ba2", dotsType: config.dotsType || "square", cornersSquareType: config.cornersSquareType || "square", cornersDotType: config.cornersDotType || "square" };
  const content = qr.redirect_to || qr.content;
  switch (qr.type) {
    case "url": return { ...base, type: "url" as const, url: content };
    case "text": return { ...base, type: "text" as const, text: content };
    case "wifi": {
      const ssid = content.match(/S:([^;]*)/)?.[1] || "";
      const pass = content.match(/P:([^;]*)/)?.[1] || "";
      const enc = content.includes("T:WPA") ? "WPA" as const : content.includes("T:WEP") ? "WEP" as const : "nopass" as const;
      return { ...base, type: "wifi" as const, wifiSsid: ssid, wifiPass: pass, wifiEnc: enc };
    }
    case "vcard": {
      const get = (k: string) => content.match(new RegExp(`${k}:(.+)`))?.[1]?.trim() || "";
      return { ...base, type: "vcard" as const, vcardName: get("FN"), vcardPhone: get("TEL"), vcardEmail: get("EMAIL") };
    }
    case "email": {
      try {
        const u = new URL(content);
        return { ...base, type: "email" as const, emailAddr: u.searchParams.get("to") || "", emailSubject: u.searchParams.get("subject") || "", emailBody: u.searchParams.get("body") || "" };
      } catch {
        return { ...base, type: "email" as const, emailAddr: content };
      }
    }
    case "image": return { ...base, type: "image" as const, imageUploadedUrl: content };
    case "whatsapp": {
      try {
        const u = new URL(content);
        const phone = u.pathname.replace("/", "");
        return { ...base, type: "whatsapp" as const, whatsappPhone: phone, whatsappMsg: u.searchParams.get("text") || "" };
      } catch { return { ...base, type: "whatsapp" as const, whatsappPhone: content }; }
    }
    case "phone": return { ...base, type: "phone" as const, phoneNumber: content.replace("tel:", "") };
    case "sms": {
      const m = content.match(/^smsto:(.+?):(.+)$/);
      return m ? { ...base, type: "sms" as const, smsPhone: m[1], smsMsg: m[2] } : { ...base, type: "sms" as const, smsPhone: content.replace("smsto:", "") };
    }
    case "location": return { ...base, type: "location" as const, locationQuery: decodeURIComponent(content.replace("https://maps.google.com/maps?q=", "")) };
    case "calendar": {
      const g = (k: string) => content.match(new RegExp(`${k}:(.+)`))?.[1]?.trim() || "";
      const dt = g("DTSTART").replace(/(\d{4})(\d{2})(\d{2})T?(\d{0,2})(\d{0,2})/, (_, y, m, d, h, min) => `${y}-${m}-${d}${h ? ` ${h}:${min || "00"}` : ""}`);
      return { ...base, type: "calendar" as const, calendarTitle: g("SUMMARY"), calendarDate: dt, calendarLocation: g("LOCATION"), calendarDesc: g("DESCRIPTION") };
    }
    case "youtube": return { ...base, type: "youtube" as const, youtubeUrl: content };
    case "appstore": return { ...base, type: "appstore" as const, appstoreUrl: content };
    case "telegram": {
      try {
        const u = new URL(content);
        return { ...base, type: "telegram" as const, telegramUser: u.pathname.replace("/", ""), telegramMsg: u.searchParams.get("text") || "" };
      } catch { return { ...base, type: "telegram" as const, telegramUser: content }; }
    }
    default: return { ...base, type: "url" as const, url: content };
  }
}

export default function EditModal({ qr, onClose, onSaved }: Props) {
  const { t } = useLang();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data: QRFormData) => {
    setSaving(true);
    setError("");
    try {
      const r = await fetch(`/api/qrcodes/${qr.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: data.type,
          redirect_to: data.redirect_to,
          label: data.label,
          config: data.config,
        }),
      });
      if (!r.ok) throw new Error("Failed to save");
      onSaved();
    } catch {
      setError("error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{t("editQR")}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <QRForm initialValues={parseQRValues(qr)} onSubmit={handleSubmit} submitLabel={t("save")} saving={saving} />
        {error && <p className="text-sm text-red-500 mt-3">{t("saveError")}</p>}
      </div>
    </div>
  );
}
