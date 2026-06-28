"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QRCodeStyling from "qr-code-styling";
import { useLang } from "@/context/LangContext";
import { FREE_MAX_QR } from "@/lib/constants";
import { parseUA } from "@/lib/ua";
import EditModal from "@/components/EditModal";

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

interface ScanStats {
  total: number;
  daily: { date: string; count: number }[];
  recent: { scanned_at: string; ip: string; country: string; referrer: string; user_agent: string }[];
}

function qrStylingOptions(qr: QRCodeData, size: number) {
  const fg = qr.config?.fgColor || "#111827";
  const bg = qr.config?.bgColor || "#ffffff";
  const opts: any = {
    width: size, height: size, data: qr.content,
    qrOptions: { errorCorrectionLevel: "L" as const },
    dotsOptions: { type: qr.config?.dotsType || "square", color: fg },
    cornersSquareOptions: { type: qr.config?.cornersSquareType || "square", color: fg },
    cornersDotOptions: { type: qr.config?.cornersDotType || "square", color: fg },
    backgroundOptions: { color: bg },
  };
  if (qr.config?.gradientType && qr.config?.gradientColor1 && qr.config?.gradientColor2) {
    opts.dotsOptions.gradient = {
      type: qr.config.gradientType, rotation: 0,
      colorStops: [{ offset: 0, color: qr.config.gradientColor1 }, { offset: 1, color: qr.config.gradientColor2 }],
    };
    opts.dotsOptions.color = undefined;
  }
  if (qr.config?.logo) opts.image = qr.config.logo;
  return opts;
}

function QRSmallPreview({ qr }: { qr: QRCodeData }) {
  const ref = useRef<HTMLDivElement>(null);
  const instRef = useRef<any>(null);
  useEffect(() => {
    if (!ref.current) return;
    if (!instRef.current) {
      instRef.current = new QRCodeStyling(qrStylingOptions(qr, 48));
      instRef.current.append(ref.current);
    } else {
      instRef.current.update(qrStylingOptions(qr, 48));
    }
  }, [qr]);
  return <div ref={ref} style={{ width: "100%", height: "100%" }} />;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const { t } = useLang();
  const router = useRouter();
  const [qrcodes, setQrcodes] = useState<QRCodeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQR, setSelectedQR] = useState<string | null>(null);
  const selectedRef = useRef<string | null>(null);
  const [stats, setStats] = useState<ScanStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const statsCache = useRef<Record<string, ScanStats>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [plan, setPlan] = useState("free");
  const [qrCount, setQrCount] = useState(0);
  const [qrLimit, setQrLimit] = useState(FREE_MAX_QR);
  const [statsBlocked, setStatsBlocked] = useState(false);
  const [editQR, setEditQR] = useState<QRCodeData | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "scans" | "alpha">("newest");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [analyticsTab, setAnalyticsTab] = useState<"timeline" | "countries" | "devices" | "activity">("timeline");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
    if (status !== "authenticated") return;
    fetch("/api/qrcodes").then(r => r.json()).then(d => {
      const codes = d.qrcodes || [];
      setQrcodes(codes);
      setPlan(d.plan || "free");
      setQrCount(d.qrCount || 0);
      setQrLimit(d.qrLimit || FREE_MAX_QR);
      if (codes.length > 0) { setSelectedQR(codes[0].id); if ((d.plan || "free") !== "pro") setStatsBlocked(true); }
    }).catch(() => {}).finally(() => setLoading(false));
    fetch("/api/subscription").then(r => r.json()).then(d => {
      if (d.plan !== "free") setSubscription(d);
    }).catch(() => {});
  }, [status, router]);

  function confirmDelete(id: string) {
    setDeleteConfirm(id);
  }

  async function deleteQR() {
    if (!deleteConfirm) return;
    await fetch(`/api/qrcodes/${deleteConfirm}`, { method: "DELETE" });
    setQrcodes(prev => prev.filter(q => q.id !== deleteConfirm));
    setQrCount(prev => Math.max(0, prev - 1));
    if (selectedQR === deleteConfirm) { setSelectedQR(null); setStats(null); }
    setDeleteConfirm(null);
  }

  async function viewStats(id: string) {
    selectedRef.current = id;
    setSelectedQR(id);
    if (plan !== "pro") { setStatsBlocked(true); setStats(null); return; }
    setStatsBlocked(false);
    setStats(null);
    if (statsCache.current[id]) { setStats(statsCache.current[id]); return; }
    setLoadingStats(true);
    const r = await fetch(`/api/qrcodes/${id}/scans`);
    if (selectedRef.current !== id) return;
    const data = await r.json();
    statsCache.current[id] = data;
    setStats(data);
    setLoadingStats(false);
  }

  async function downloadQR(qr: QRCodeData, format: "png" | "svg") {
    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.left = "-9999px";
    document.body.appendChild(div);
    const opts = qrStylingOptions(qr, 512);
    if (opts.qrOptions) opts.qrOptions.errorCorrectionLevel = "H";
    const instance = new QRCodeStyling(opts);
    instance.append(div);
    if (format === "svg") {
      const blob = await instance.getRawData("svg");
      const link = document.createElement("a");
      link.download = `qrwing-${qr.label || "qr"}.svg`;
      link.href = URL.createObjectURL(blob as Blob);
      link.click();
    } else {
      instance.download({ name: `qrwing-${qr.label || "qr"}`, extension: "png" });
    }
    document.body.removeChild(div);
  }

  async function cancelSub() {
    setCancelling(true);
    try {
      const r = await fetch("/api/subscription/cancel", { method: "POST" });
      if (r.ok) {
        setSubscription((prev: any) => ({ ...prev, status: "cancelled" }));
        setShowCancelConfirm(false);
      } else {
        const err = await r.json();
        alert(err.error || "Error cancelling subscription");
        setShowCancelConfirm(false);
      }
    } catch {
      alert("Network error");
      setShowCancelConfirm(false);
    } finally {
      setCancelling(false);
    }
  }

  async function openPortal() {
    setLoadingPortal(true);
    try {
      const r = await fetch("/api/subscription/portal");
      if (r.ok) {
        const { url } = await r.json();
        window.open(url, "_blank");
      } else {
        const err = await r.json();
        alert(err.error || "Error opening billing portal");
      }
    } catch {
      alert("Network error");
    } finally {
      setLoadingPortal(false);
    }
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString();
  }

  function daysRemaining(d: string) {
    const diff = new Date(d).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / 86400000));
  }

  function statusColor(s: string) {
    switch (s) {
      case "active": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "on_trial": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "cancelled": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "expired": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  }

  function typeIcon(type: string) {
    const icons: Record<string, string> = { url: "🔗", text: "📝", wifi: "📶", vcard: "👤", email: "📧", image: "🖼️", whatsapp: "💬", phone: "📞", sms: "💬", location: "📍", calendar: "📅", youtube: "▶️", appstore: "📱", telegram: "✈️" };
    return icons[type] || "📄";
  }

  function typeLabel(type: string) {
    const labels: Record<string, string> = { url: "URL", text: "Texto", wifi: "WiFi", vcard: "vCard", email: "Email", image: "Imagen", whatsapp: "WhatsApp", phone: "Teléfono", sms: "SMS", location: "Ubicación", calendar: "Evento", youtube: "YouTube", appstore: "App Store", telegram: "Telegram" };
    return labels[type] || type;
  }

  if (status === "loading" || loading) {
    return <div className="max-w-5xl mx-auto px-4 py-12"><div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-48" /><div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl" /><div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" /></div></div>;
  }

  const totalScans = qrcodes.reduce((a, b) => a + b.scan_count, 0);

  const filteredQrs = qrcodes
    .filter(qr => {
      if (typeFilter && qr.type !== typeFilter) return false;
      if (!search) return true;
      const s = search.toLowerCase();
      return (qr.label && qr.label.toLowerCase().includes(s)) ||
             (qr.redirect_to && qr.redirect_to.toLowerCase().includes(s)) ||
             (qr.content && qr.content.toLowerCase().includes(s));
    })
    .sort((a, b) => {
      const s = plan !== "pro" && sortBy === "scans" ? "newest" : sortBy;
      switch (s) {
        case "newest": return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest": return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "scans": return b.scan_count - a.scan_count;
        case "alpha": return (a.label || a.redirect_to || "").localeCompare(b.label || b.redirect_to || "");
        default: return 0;
      }
    });

  const types = [...new Set(qrcodes.map(q => q.type))];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("dashboardTitle")}</h1>
          <p className="text-gray-500 text-sm mt-1">{session?.user?.name} — {session?.user?.email}</p>
        </div>
        <Link href="/" className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition duration-75 active:scale-[0.95]">{t("dashboardNewQR")}</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
          <p className="text-sm text-gray-400">{t("dashboardCreated")}</p>
          <p className="text-3xl font-bold mt-1">{qrcodes.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
          <p className="text-sm text-gray-400">{t("dashboardScans")}</p>
          {plan === "pro" ? (
            <p className="text-3xl font-bold mt-1">{totalScans}</p>
          ) : (
            <a href="/pricing" className="group inline-block mt-1">
              <span className="text-3xl font-bold text-gray-300 dark:text-gray-700">—</span>
              <span className="ml-2 text-lg align-middle">🔒</span>
              <p className="text-xs text-gray-400 group-hover:text-purple-600 transition-colors mt-0.5">{t("statsPro")}</p>
            </a>
          )}
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
          <p className="text-sm text-gray-400">{t("dashboardPlan")}</p>
          <p className={`text-lg font-bold mt-1 ${plan === "pro" ? "text-purple-600" : "text-gray-600 dark:text-gray-300"}`}>
            {plan === "pro" ? t("planPro") : t("dashboardFree")}
          </p>
          {plan === "free" && (
            <p className="text-xs text-gray-400 mt-1">{t("qrUsed").replace("{count}", String(qrCount)).replace("{limit}", String(qrLimit))}</p>
          )}
        </div>
      </div>

      {subscription && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-lg">⭐</span>
              <div>
                <p className="font-semibold">{t("proSubscription")}</p>
                {subscription.status !== "cancelled" && subscription.status !== "expired" && subscription.status !== "paused" && (
                  <span className={`inline-block mt-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColor(subscription.status)}`}>
                    {t("planPro")}
                  </span>
          )}
          </div>
            </div>
            <div className="text-right text-sm text-gray-500">
              {subscription.status === "on_trial" && subscription.trial_ends_at && new Date(subscription.trial_ends_at) > new Date() && (
                <p>{t("proTrialEnds").replace("{n}", String(daysRemaining(subscription.trial_ends_at)))}</p>
              )}
              {subscription.status === "active" && subscription.expires_at && (
                <p>{t("proRenewOn").replace("{date}", formatDate(subscription.expires_at))}</p>
              )}
              {subscription.status === "cancelled" && (
                <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColor(subscription.status)}`}>
                  {t("proCancelled").replace("{date}", formatDate(subscription.expires_at))}
                </span>
              )}
              {(subscription.status === "active" || subscription.status === "on_trial" || subscription.status === "cancelled") && (
                <div className="flex gap-2 mt-2 justify-end">
                  <button onClick={openPortal} disabled={loadingPortal} className="px-3 py-1.5 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-xl text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-75 active:scale-[0.95] disabled:opacity-50">
                    {loadingPortal ? t("loading") : t("proManage")}
                  </button>
                  {subscription.status !== "cancelled" && (
                    <button onClick={() => setShowCancelConfirm(true)} className="px-3 py-1.5 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-xs font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition duration-75 active:scale-[0.95]">
                      {t("proCancel")}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {plan === "free" && (
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 p-5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
              {qrCount >= qrLimit
                ? t("qrLimitReached")
                : t("qrRemaining").replace("{n}", String(qrLimit - qrCount))}
            </p>
            <div className="mt-2 h-2 bg-purple-200 dark:bg-purple-800 rounded-full overflow-hidden max-w-xs">
              <div className="h-full bg-purple-600 rounded-full transition-all" style={{ width: `${Math.min(100, (qrCount / qrLimit) * 100)}%` }} />
            </div>
          </div>
          <a href="/pricing" className="shrink-0 px-5 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition duration-75 active:scale-[0.95]">
            {t("upgradeToPro")}
          </a>
        </div>
      )}

      {qrcodes.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <div className="relative flex-1 min-w-[180px] max-w-sm">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t("dashboardSearch")}
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-600 transition"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            >
              <option value="newest">{t("dashboardSortNewest")}</option>
              <option value="oldest">{t("dashboardSortOldest")}</option>
              {plan === "pro" && <option value="scans">{t("dashboardSortMostScans")}</option>}
              <option value="alpha">{t("dashboardSortAZ")}</option>
            </select>
            <button onClick={() => setShowFilters(!showFilters)} className={`px-3 py-2 text-sm rounded-xl border transition ${typeFilter ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'}`}>
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              {t("dashboardFilterAll")}{typeFilter ? `: ${typeLabel(typeFilter)}` : ""}
            </button>
          </div>
          {showFilters && (
            <div className="flex gap-2 mb-4 flex-wrap">
              <button onClick={() => setTypeFilter(null)} className={`px-3 py-1.5 text-xs rounded-full border transition ${!typeFilter ? 'bg-purple-600 text-white border-purple-600' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-purple-300'}`}>{t("dashboardFilterAll")}</button>
              {types.map(tp => (
                <button key={tp} onClick={() => setTypeFilter(typeFilter === tp ? null : tp)} className={`px-3 py-1.5 text-xs rounded-full border transition ${typeFilter === tp ? 'bg-purple-600 text-white border-purple-600' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-purple-300'}`}>
                  {typeIcon(tp)} {typeLabel(tp)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {qrcodes.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
          <h2 className="text-xl font-semibold mb-2">{t("dashboardEmpty")}</h2>
          <p className="text-gray-500 mb-6">{t("dashboardEmptyDesc")}</p>
          <Link href="/" className="inline-block px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition duration-75 active:scale-[0.95]">{t("dashboardCreateFirst")}</Link>
        </div>
      ) : filteredQrs.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
          <h2 className="text-xl font-semibold mb-2">{t("dashboardMyQRs")}</h2>
          <p className="text-gray-500">{t("dashboardSearch")} — 0 {t("dashboardCreated").toLowerCase()}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold">{t("dashboardMyQRs")}</h2>
            {filteredQrs.map(qr => (
              <div key={qr.id} className={`bg-white dark:bg-gray-900 rounded-2xl border p-4 transition-colors cursor-pointer hover:border-purple-300 dark:hover:border-purple-700 ${selectedQR === qr.id ? "border-purple-500" : "border-gray-200 dark:border-gray-800"}`} onClick={() => viewStats(qr.id)}>
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 flex-shrink-0 bg-white rounded-xl p-1 border border-gray-100 dark:border-gray-700">
                      <QRSmallPreview qr={qr} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{qr.label || qr.redirect_to || qr.content}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                      <span>{typeIcon(qr.type)} {typeLabel(qr.type)}</span>
                      <span>👁 {qr.scan_count} {t("dashboardScansLabel")}</span>
                      <span>{new Date(qr.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {selectedQR === qr.id && (
                      <>
                        <button onClick={e => { e.stopPropagation(); downloadQR(qr, "png"); }} className="text-gray-400 hover:text-gray-600 text-xs px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-75 active:scale-[0.9]">📥 PNG</button>
                        <button onClick={e => { e.stopPropagation(); downloadQR(qr, "svg"); }} className="text-gray-400 hover:text-gray-600 text-xs px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-75 active:scale-[0.9]">📄 SVG</button>
                        <span className="text-gray-300 dark:text-gray-700">|</span>
                      </>
                    )}
                    {plan === "pro" && <button onClick={e => { e.stopPropagation(); setEditQR(qr); }} className="text-blue-400 hover:text-blue-600 text-sm px-2 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition duration-75 active:scale-[0.9]">✏️ {t("editQR")}</button>}
                    <button onClick={e => { e.stopPropagation(); confirmDelete(qr.id); }} className="text-red-400 hover:text-red-600 text-sm px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition duration-75 active:scale-[0.9]">{t("dashboardDelete")}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-4 lg:self-start">
          {statsBlocked ? (
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-5 overflow-hidden">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{t("dashboardStats")}</h3>
              </div>
              <div className="text-center opacity-40">
                <p className="text-4xl font-bold text-purple-600">—</p>
                <p className="text-sm text-gray-400">{t("dashboardTotalScans")}</p>
              </div>
              <div className="opacity-40">
                <p className="text-sm font-medium mb-2">{t("dashboardLast30")}</p>
                <div className="flex items-end gap-1 h-20">
                  {[3,5,2,7,4,6,3,8,5,4,6,2,5,3].map((h,i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] text-gray-400">{h}</span>
                      <div className="w-full bg-purple-200 dark:bg-purple-900/40 rounded-t" style={{ height: `${(h/8)*64}px` }} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="opacity-40">
                <p className="text-sm font-medium mb-2">{t("dashboardRecent")}</p>
                <div className="space-y-2 text-xs">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex items-center gap-2 text-gray-400 pb-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <span className="text-gray-300 w-16 flex-shrink-0">—</span>
                      <span className="truncate flex-1">—</span>
                    </div>
                  ))}
                </div>
              </div>
              <a href="/pricing" className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-[2px] rounded-2xl cursor-pointer group">
                <span className="text-3xl mb-2">🔒</span>
                <p className="text-base font-semibold text-gray-800 dark:text-gray-200 group-hover:text-purple-600 transition-colors">{t("statsPro")}</p>
                <p className="text-sm text-gray-500 mt-1">{t("statsProDesc")}</p>
                <span className="mt-3 px-5 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium group-hover:bg-purple-700 transition-colors">{t("upgradeToPro")}</span>
              </a>
            </div>
          ) : selectedQR && loadingStats ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{t("dashboardStats")}</h3>
              </div>
              <div className="animate-pulse space-y-3">
                <div className="flex justify-center">
                  <div className="h-10 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {[1,2,3,4].map(i => <div key={i} className="h-14 bg-gray-200 dark:bg-gray-700 rounded-lg" />)}
                </div>
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              </div>
            </div>
          ) : selectedQR && stats ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{t("dashboardStats")}</h3>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-purple-600">{stats.total}</p>
                <p className="text-sm text-gray-400">{t("dashboardTotalScans")}</p>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {(["timeline","countries","devices","activity"] as const).map(tab => (
                  <button key={tab} onClick={() => setAnalyticsTab(tab)} className={`px-3 py-2 text-sm font-medium rounded-lg border transition active:scale-[0.95] ${analyticsTab === tab ? "bg-purple-600 text-white border-purple-600 shadow-sm" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-purple-300 dark:hover:border-purple-600 hover:text-purple-600 dark:hover:text-purple-400"}`}>
                    <span className="block leading-tight">{tab === "timeline" ? "📈" : tab === "countries" ? "🌍" : tab === "devices" ? "📱" : "⏰"}<br/>{tab === "activity" ? t("analyticsActivity") : t("analytics" + tab.charAt(0).toUpperCase() + tab.slice(1) as any)}</span>
                  </button>
                ))}
              </div>

              {analyticsTab === "timeline" && (
                <div>
                  {stats.daily.length > 0 ? (
                    <div>
                      <p className="text-sm font-medium mb-2">{t("dashboardLast30").replace("30", "7")}</p>
                      <div className="flex items-end gap-1 flex-wrap">
                        {stats.daily.slice(0, 7).reverse().map(d => {
                          const max = Math.max(...stats.daily.map(x => x.count), 1);
                          const h = Math.max(4, (d.count / max) * 64);
                          const date = new Date(d.date);
                          return (
                            <div key={d.date} className="flex flex-col items-center gap-0.5 w-10" title={date.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}>
                              <span className="text-[10px] text-gray-400">{d.count}</span>
                              <div className="w-full bg-purple-200 dark:bg-purple-900/40 rounded-t" style={{ height: `${h}px` }} />
                              <span className="text-[8px] text-gray-400 leading-tight text-center">{date.toLocaleDateString(undefined, { day: "numeric", month: "short" })}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-4">{t("analyticsNoData")}</p>
                  )}
                </div>
              )}

              {analyticsTab === "countries" && (
                <div>
                  {stats.recent.length > 0 ? (
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {(() => {
                        const countries = Object.entries(
                          stats.recent.reduce((acc: Record<string, number>, s: any) => {
                            if (!s.country) return acc;
                            acc[s.country] = (acc[s.country] || 0) + 1;
                            return acc;
                          }, {})
                        ).sort((a, b) => b[1] - a[1]);
                        return countries.length > 0 ? countries.map(([country, count]) => (
                          <div key={country} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-300 truncate">{country}</span>
                            <span className="text-gray-400 ml-2">{count}</span>
                          </div>
                        )) : <p className="text-sm text-gray-400 text-center py-4">{t("analyticsNoData")}</p>;
                      })()}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-4">{t("analyticsNoData")}</p>
                  )}
                </div>
              )}

              {analyticsTab === "devices" && (
                <div>
                  {stats.recent.length > 0 ? (
                    <div className="space-y-3">
                      {(["browser","os","device"] as const).map(cat => {
                        const items = stats.recent.reduce((acc: Record<string, number>, s: any) => {
                          const p = parseUA(s.user_agent || "");
                          const key = p[cat];
                          acc[key] = (acc[key] || 0) + 1;
                          return acc;
                        }, {});
                        const sorted = Object.entries(items).sort((a, b) => b[1] - a[1]);
                        return (
                          <div key={cat}>
                            <p className="text-xs font-medium text-gray-500 mb-1 uppercase">{cat === "browser" ? t("analyticsBrowser") : cat === "os" ? t("analyticsOS") : t("analyticsDevice")}</p>
                            <div className="space-y-0.5">
                              {sorted.map(([k, v]) => (
                                <div key={k} className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600 dark:text-gray-300">{k}</span>
                                  <span className="text-gray-400 text-xs">{v}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-4">{t("analyticsNoData")}</p>
                  )}
                </div>
              )}

              {analyticsTab === "activity" && (
                <div>
                  {(() => {
                    const hours = stats.recent.reduce((acc: number[], s: any) => {
                      if (s.scanned_at) {
                        try {
                          const h = new Date(s.scanned_at).getHours();
                          acc.push(h);
                        } catch {}
                      }
                      return acc;
                    }, []);
                    if (hours.length === 0) return <p className="text-sm text-gray-400 text-center py-4">{t("analyticsNoData")}</p>;
                    
                    const hourCounts: number[] = Array(24).fill(0);
                    hours.forEach(h => hourCounts[h]++);
                    const maxHour = Math.max(...hourCounts, 1);
                    const peakHour = hourCounts.indexOf(Math.max(...hourCounts));
                    const peakLabel = peakHour < 12 ? `${peakHour}:00 AM` : peakHour === 12 ? `12:00 PM` : `${peakHour-12}:00 PM`;
                    
                    const lastScan = new Date(stats.recent[0].scanned_at);
                    const now = new Date();
                    const diffMs = now.getTime() - lastScan.getTime();
                    const diffH = Math.floor(diffMs / 3600000);
                    const diffD = Math.floor(diffMs / 86400000);
                    const lastLabel = diffH < 1 ? `<1h` : diffH < 24 ? t("analyticsHoursAgo").replace("{n}", String(diffH)) : t("analyticsDaysAgo").replace("{n}", String(diffD));
                    
                    const days = stats.daily.length || 1;
                    const avg = (stats.total / days).toFixed(1);
                    
                    const bestDay = [...stats.daily].sort((a, b) => b.count - a.count)[0];
                    const bestDate = bestDay ? new Date(bestDay.date) : null;
                    const bestLabel = bestDate ? bestDate.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" }) : "—";

                    const topHours = hourCounts.map((c, h) => ({ hour: h, count: c })).sort((a, b) => b.count - a.count).slice(0, 5);
                    
                    return (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                            <p className="text-lg font-bold text-purple-600">{peakLabel}</p>
                            <p className="text-xs text-gray-400">{t("analyticsPeakHour")}</p>
                          </div>
                          <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                            <p className="text-lg font-bold text-purple-600">{avg}</p>
                            <p className="text-xs text-gray-400">{t("analyticsAvgDaily")}</p>
                          </div>
                          <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                            <p className="text-sm font-bold text-purple-600 truncate">{bestLabel}</p>
                            <p className="text-xs text-gray-400">{t("analyticsBestDay")}</p>
                          </div>
                          <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                            <p className="text-lg font-bold text-purple-600">{lastLabel}</p>
                            <p className="text-xs text-gray-400">{t("analyticsLastScan")}</p>
                          </div>
                        </div>
                        {topHours.length > 1 && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1.5">{t("analyticsHourDistribution")}</p>
                            <div className="space-y-1">
                              {topHours.map(({ hour, count }) => {
                                const hLabel = hour < 12 ? `${hour}:00 AM` : hour === 12 ? `12:00 PM` : `${hour-12}:00 PM`;
                                const pct = count / maxHour;
                                return (
                                  <div key={hour} className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-500 w-16 text-right text-xs">{hLabel}</span>
                                    <div className="flex-1 h-5 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                                      <div className="h-full bg-purple-500 rounded" style={{ width: `${pct * 100}%` }} />
                                    </div>
                                    <span className="text-gray-400 text-xs w-6 text-right">{count}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 flex items-center justify-center">
              <p className="text-gray-400 text-sm">{t("dashboardSelectQR")}</p>
            </div>
          )}
        </div>
      </div>
      )}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2">{t("dashboardConfirmTitle")}</h3>
            <p className="text-sm text-gray-500 mb-6">{t("dashboardConfirmDesc")}</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-75 active:scale-[0.95]">
                {t("dashboardCancel")}
              </button>
              <button onClick={deleteQR} className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition duration-75 active:scale-[0.95]">
                {t("dashboardConfirmDelete")}
              </button>
            </div>
          </div>
        </div>
      )}
      {editQR && <EditModal qr={editQR} onClose={() => setEditQR(null)} onSaved={() => { setEditQR(null); window.location.reload(); }} />}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowCancelConfirm(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2">{t("proCancel")}</h3>
            <p className="text-sm text-gray-500 mb-6">{t("proCancelConfirm")}</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowCancelConfirm(false)} className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-75 active:scale-[0.95]">
                {t("dashboardCancel")}
              </button>
              <button onClick={cancelSub} disabled={cancelling} className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition duration-75 active:scale-[0.95] disabled:opacity-50">
                {cancelling ? t("loading") : t("proCancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
