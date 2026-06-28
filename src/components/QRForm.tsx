"use client";

import { useState, useCallback, useEffect } from "react";
import { useLang } from "@/context/LangContext";
import { contrastRatio } from "@/lib/color";

type QrType = "url" | "text" | "wifi" | "vcard" | "email" | "image" | "whatsapp" | "phone" | "sms" | "location" | "calendar" | "youtube" | "appstore" | "telegram";

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
  whatsappPhone?: string;
  whatsappMsg?: string;
  phoneNumber?: string;
  smsPhone?: string;
  smsMsg?: string;
  locationQuery?: string;
  calendarTitle?: string;
  calendarDate?: string;
  calendarLocation?: string;
  calendarDesc?: string;
  youtubeUrl?: string;
  appstoreUrl?: string;
  telegramUser?: string;
  telegramMsg?: string;
  fgColor?: string;
  bgColor?: string;
  size?: number;
  logo?: string | null;
  gradientType?: string;
  gradientColor1?: string;
  gradientColor2?: string;
  dotsType?: string;
  cornersSquareType?: string;
  cornersDotType?: string;
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
  { value: "whatsapp", key: "qrTypeWhatsapp", icon: "💬" },
  { value: "phone", key: "qrTypePhone", icon: "📞" },
  { value: "sms", key: "qrTypeSms", icon: "✉️" },
  { value: "location", key: "qrTypeLocation", icon: "📍" },
  { value: "calendar", key: "qrTypeCalendar", icon: "📅" },
  { value: "youtube", key: "qrTypeYoutube", icon: "▶️" },
  { value: "appstore", key: "qrTypeAppstore", icon: "📱" },
  { value: "telegram", key: "qrTypeTelegram", icon: "✈️" },
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
  const [whatsappPhone, setWhatsappPhone] = useState(initialValues?.whatsappPhone || "");
  const [whatsappMsg, setWhatsappMsg] = useState(initialValues?.whatsappMsg || "");
  const [phoneNumber, setPhoneNumber] = useState(initialValues?.phoneNumber || "");
  const [smsPhone, setSmsPhone] = useState(initialValues?.smsPhone || "");
  const [smsMsg, setSmsMsg] = useState(initialValues?.smsMsg || "");
  const [locationQuery, setLocationQuery] = useState(initialValues?.locationQuery || "");
  const [calendarTitle, setCalendarTitle] = useState(initialValues?.calendarTitle || "");
  const [calendarDate, setCalendarDate] = useState(initialValues?.calendarDate || "");
  const [calendarLocation, setCalendarLocation] = useState(initialValues?.calendarLocation || "");
  const [calendarDesc, setCalendarDesc] = useState(initialValues?.calendarDesc || "");
  const [youtubeUrl, setYoutubeUrl] = useState(initialValues?.youtubeUrl || "");
  const [appstoreUrl, setAppstoreUrl] = useState(initialValues?.appstoreUrl || "");
  const [telegramUser, setTelegramUser] = useState(initialValues?.telegramUser || "");
  const [telegramMsg, setTelegramMsg] = useState(initialValues?.telegramMsg || "");
  const [fgColor, setFgColor] = useState(initialValues?.fgColor || "#000000");
  const [bgColor, setBgColor] = useState(initialValues?.bgColor || "#ffffff");
  const [size, setSize] = useState(initialValues?.size || 256);
  const [logo, setLogo] = useState<string | null>(initialValues?.logo || null);
  const [gradientType, setGradientType] = useState<string>(initialValues?.gradientType || "");
  const [gradientColor1, setGradientColor1] = useState(initialValues?.gradientColor1 || "#667eea");
  const [gradientColor2, setGradientColor2] = useState(initialValues?.gradientColor2 || "#764ba2");
  const [dotsType, setDotsType] = useState(initialValues?.dotsType || "square");
  const [cornersSquareType, setCornersSquareType] = useState(initialValues?.cornersSquareType || "square");
  const [cornersDotType, setCornersDotType] = useState(initialValues?.cornersDotType || "square");

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
    if (initialValues.whatsappPhone !== undefined) setWhatsappPhone(initialValues.whatsappPhone);
    if (initialValues.whatsappMsg !== undefined) setWhatsappMsg(initialValues.whatsappMsg);
    if (initialValues.phoneNumber !== undefined) setPhoneNumber(initialValues.phoneNumber);
    if (initialValues.smsPhone !== undefined) setSmsPhone(initialValues.smsPhone);
    if (initialValues.smsMsg !== undefined) setSmsMsg(initialValues.smsMsg);
    if (initialValues.locationQuery !== undefined) setLocationQuery(initialValues.locationQuery);
    if (initialValues.calendarTitle !== undefined) setCalendarTitle(initialValues.calendarTitle);
    if (initialValues.calendarDate !== undefined) setCalendarDate(initialValues.calendarDate);
    if (initialValues.calendarLocation !== undefined) setCalendarLocation(initialValues.calendarLocation);
    if (initialValues.calendarDesc !== undefined) setCalendarDesc(initialValues.calendarDesc);
    if (initialValues.youtubeUrl !== undefined) setYoutubeUrl(initialValues.youtubeUrl);
    if (initialValues.appstoreUrl !== undefined) setAppstoreUrl(initialValues.appstoreUrl);
    if (initialValues.telegramUser !== undefined) setTelegramUser(initialValues.telegramUser);
    if (initialValues.telegramMsg !== undefined) setTelegramMsg(initialValues.telegramMsg);
    if (initialValues.fgColor) setFgColor(initialValues.fgColor);
    if (initialValues.bgColor) setBgColor(initialValues.bgColor);
    if (initialValues.size) setSize(initialValues.size);
    if (initialValues.logo !== undefined) setLogo(initialValues.logo);
    if (initialValues.gradientType !== undefined) setGradientType(initialValues.gradientType);
    if (initialValues.gradientColor1 !== undefined) setGradientColor1(initialValues.gradientColor1);
    if (initialValues.gradientColor2 !== undefined) setGradientColor2(initialValues.gradientColor2);
    if (initialValues.dotsType !== undefined) setDotsType(initialValues.dotsType);
    if (initialValues.cornersSquareType !== undefined) setCornersSquareType(initialValues.cornersSquareType);
    if (initialValues.cornersDotType !== undefined) setCornersDotType(initialValues.cornersDotType);
  }, [initialValues]);

  const qrValue = useCallback(() => {
    switch (qrType) {
      case "url": return url;
      case "text": return text;
      case "wifi": return wifiPass ? `WIFI:T:${wifiEnc};S:${wifiSsid};P:${wifiPass};;` : `WIFI:T:nopass;S:${wifiSsid};;`;
      case "vcard": return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardName}\nTEL:${vcardPhone}\nEMAIL:${vcardEmail}\nEND:VCARD`;
      case "email": return `https://generadorqrweb.vercel.app/mail?to=${encodeURIComponent(emailAddr)}&subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case "image": return imageUploadedUrl;
      case "whatsapp": return `https://wa.me/${whatsappPhone.replace(/[^0-9]/g, "")}${whatsappMsg ? "?text=" + encodeURIComponent(whatsappMsg) : ""}`;
      case "phone": return `tel:${phoneNumber}`;
      case "sms": return `smsto:${smsPhone}:${smsMsg}`;
      case "location": return `https://maps.google.com/maps?q=${encodeURIComponent(locationQuery)}`;
      case "calendar": return `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${calendarTitle}\nDTSTART:${calendarDate ? calendarDate.replace(/[\s:-]/g, "").padEnd(15, "0") : ""}\nLOCATION:${calendarLocation}\nDESCRIPTION:${calendarDesc}\nEND:VEVENT\nEND:VCALENDAR`;
      case "youtube": return youtubeUrl;
      case "appstore": return appstoreUrl;
      case "telegram": return `https://t.me/${telegramUser.replace(/^@/, "")}${telegramMsg ? "?text=" + encodeURIComponent(telegramMsg) : ""}`;
      default: return "";
    }
  }, [qrType, url, text, wifiSsid, wifiPass, wifiEnc, vcardName, vcardPhone, vcardEmail, emailAddr, emailSubject, emailBody, imageUploadedUrl, whatsappPhone, whatsappMsg, phoneNumber, smsPhone, smsMsg, locationQuery, calendarTitle, calendarDate, calendarLocation, calendarDesc, youtubeUrl, appstoreUrl, telegramUser, telegramMsg]);

  const getData = useCallback((): QRFormData => {
    const val = qrValue();
    return {
      type: qrType,
      content: val,
      redirect_to: val,
      label: val.slice(0, 60),
      config: { fgColor, bgColor, size, logo, gradientType, gradientColor1, gradientColor2, dotsType, cornersSquareType, cornersDotType },
      hasValues: val.length > 0,
    };
  }, [qrValue, qrType, fgColor, bgColor, size, logo, gradientType, gradientColor1, gradientColor2, dotsType, cornersSquareType, cornersDotType]);

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

      <p className="text-xs text-gray-400 -mt-2">{t(`type${qrType.charAt(0).toUpperCase() + qrType.slice(1)}Desc` as any)}</p>

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

      {qrType === "whatsapp" && (
        <div className="space-y-3">
          <input type="tel" placeholder={t("placeWhatsappPhone")} value={whatsappPhone} onChange={(e) => setWhatsappPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
          <input type="text" placeholder={t("placeWhatsappMsg")} value={whatsappMsg} onChange={(e) => setWhatsappMsg(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
        </div>
      )}

      {qrType === "phone" && (
        <input type="tel" placeholder={t("placePhone")} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
      )}

      {qrType === "sms" && (
        <div className="space-y-3">
          <input type="tel" placeholder={t("placeSmsPhone")} value={smsPhone} onChange={(e) => setSmsPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
          <textarea placeholder={t("placeSmsMsg")} value={smsMsg} onChange={(e) => setSmsMsg(e.target.value)} rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none" />
        </div>
      )}

      {qrType === "location" && (
        <input type="text" placeholder={t("placeLocation")} value={locationQuery} onChange={(e) => setLocationQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
      )}

      {qrType === "calendar" && (
        <div className="space-y-3">
          <input type="text" placeholder={t("placeCalendarTitle")} value={calendarTitle} onChange={(e) => setCalendarTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
          <input type="text" placeholder={t("placeCalendarDate")} value={calendarDate} onChange={(e) => setCalendarDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
          <input type="text" placeholder={t("placeCalendarLocation")} value={calendarLocation} onChange={(e) => setCalendarLocation(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
          <textarea placeholder={t("placeCalendarDesc")} value={calendarDesc} onChange={(e) => setCalendarDesc(e.target.value)} rows={2}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none" />
        </div>
      )}

      {qrType === "youtube" && (
        <input type="url" placeholder={t("placeYoutubeUrl")} value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
      )}

      {qrType === "appstore" && (
        <input type="url" placeholder={t("placeAppstoreIos")} value={appstoreUrl} onChange={(e) => setAppstoreUrl(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
      )}

      {qrType === "telegram" && (
        <div className="space-y-3">
          <input type="text" placeholder={t("placeTelegramUser")} value={telegramUser} onChange={(e) => setTelegramUser(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
          <input type="text" placeholder={t("placeTelegramMsg")} value={telegramMsg} onChange={(e) => setTelegramMsg(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
        </div>
      )}

      <details open className="text-sm">
        <summary className="cursor-pointer text-gray-500 hover:text-purple-600 font-medium">{t("customize")}</summary>
        <div className="mt-3 flex items-end gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t("colorQr")}</label>
            <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-12 h-10 rounded cursor-pointer" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t("colorBg")}</label>
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-12 h-10 rounded cursor-pointer" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t("logo")} {plan !== "pro" && <span className="text-purple-500 font-medium">Pro</span>}</label>
            <p className="text-[10px] text-gray-400 mb-1 leading-tight">{t("logoHelp")}</p>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-gray-600 dark:text-gray-300 rounded-lg cursor-pointer text-xs font-medium transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {t("selectImage")}
              <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = (ev) => setLogo(ev.target?.result as string); reader.readAsDataURL(file); }}} className="hidden" />
            </label>
            {logo && <button onClick={() => setLogo(null)} className="block text-xs text-red-500 mt-1">{t("removeLogo")}</button>}
            {logo && plan !== "pro" && (
              <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">🔒 {t("logoProOnly")}</p>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t("gradient")}</label>
            <select value={gradientType} onChange={(e) => setGradientType(e.target.value)}
              className="px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs w-24">
              <option value="">—</option>
              <option value="linear">{t("gradientLinear")}</option>
              <option value="radial">{t("gradientRadial")}</option>
            </select>
          </div>
          {gradientType && (
            <>
              <div>
                <label className="block text-xs text-gray-500 mb-1">#1</label>
                <input type="color" value={gradientColor1} onChange={(e) => setGradientColor1(e.target.value)} className="w-12 h-10 rounded cursor-pointer" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">#2</label>
                <input type="color" value={gradientColor2} onChange={(e) => setGradientColor2(e.target.value)} className="w-12 h-10 rounded cursor-pointer" />
              </div>
            </>
          )}
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t("dotStyle")}</label>
            <select value={dotsType} onChange={(e) => setDotsType(e.target.value)}
              className="px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs w-28">
              <option value="square">{t("dotSquare")}</option>
              <option value="dots">{t("dotDots")}</option>
              <option value="rounded">{t("dotRounded")}</option>
              <option value="extra-rounded">{t("dotExtraRounded")}</option>
              <option value="classy">{t("dotClassy")}</option>
              <option value="classy-rounded">{t("dotClassyRounded")}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t("cornerSquareStyle")}</label>
            <select value={cornersSquareType} onChange={(e) => setCornersSquareType(e.target.value)}
              className="px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs w-28">
              <option value="square">{t("dotSquare")}</option>
              <option value="dot">{t("cornerDot")}</option>
              <option value="extra-rounded">{t("dotExtraRounded")}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t("cornerDotStyle")}</label>
            <select value={cornersDotType} onChange={(e) => setCornersDotType(e.target.value)}
              className="px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs w-28">
              <option value="square">{t("dotSquare")}</option>
              <option value="dot">{t("cornerDot")}</option>
            </select>
          </div>
        </div>

        {(() => {
          const ratio = contrastRatio(fgColor, bgColor);
          if (ratio >= 3) return null;
          return (
            <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">⚠️ {t("lowContrast").replace("{n}", ratio.toFixed(1))}</p>
          );
        })()}
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
