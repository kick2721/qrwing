"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import QRCode from "qrcode";
import { useLang } from "@/context/LangContext";
import { FREE_MAX_QR } from "@/lib/constants";
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

export default function Dashboard() {
  const { data: session, status } = useSession();
  const { t } = useLang();
  const router = useRouter();
  const [qrcodes, setQrcodes] = useState<QRCodeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQR, setSelectedQR] = useState<string | null>(null);
  const [stats, setStats] = useState<ScanStats | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [plan, setPlan] = useState("free");
  const [qrCount, setQrCount] = useState(0);
  const [qrLimit, setQrLimit] = useState(FREE_MAX_QR);
  const [statsBlocked, setStatsBlocked] = useState(false);
  const [editQR, setEditQR] = useState<QRCodeData | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);

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
    setSelectedQR(id);
    if (plan !== "pro") { setStatsBlocked(true); setStats(null); return; }
    setStatsBlocked(false);
    const r = await fetch(`/api/qrcodes/${id}/scans`);
    setStats(await r.json());
  }

  async function downloadQR(qr: QRCodeData, format: "png" | "svg") {
    if (format === "png") {
      const url = await QRCode.toDataURL(qr.content, {
        width: 512,
        margin: 2,
        color: { dark: qr.config?.fgColor || "#111827", light: qr.config?.bgColor || "#ffffff" },
      });
      const link = document.createElement("a");
      link.download = `qrwing-${qr.label || "qr"}.png`;
      link.href = url;
      link.click();
    } else {
      const svg = document.querySelector(`#svg-container-${qr.id} svg`) as SVGSVGElement;
      if (!svg) return;
      const clone = svg.cloneNode(true) as SVGSVGElement;
      clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      const blob = new Blob([clone.outerHTML], { type: "image/svg+xml" });
      const link = document.createElement("a");
      link.download = `qrwing-${qr.label || "qr"}.svg`;
      link.href = URL.createObjectURL(blob);
      link.click();
    }
  }

  async function cancelSub() {
    setCancelling(true);
    try {
      const r = await fetch("/api/subscription/cancel", { method: "POST" });
      if (r.ok) {
        setSubscription((prev: any) => ({ ...prev, status: "cancelled" }));
        setShowCancelConfirm(false);
      }
    } finally {
      setCancelling(false);
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
    const icons: Record<string, string> = { url: "🔗", text: "📝", wifi: "📶", vcard: "👤", email: "📧", image: "🖼️" };
    return icons[type] || "📄";
  }

  function typeLabel(type: string) {
    const labels: Record<string, string> = { url: "URL", text: "Texto", wifi: "WiFi", vcard: "vCard", email: "Email", image: "Imagen" };
    return labels[type] || type;
  }

  if (status === "loading" || loading) {
    return <div className="max-w-5xl mx-auto px-4 py-12"><div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-48" /><div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl" /><div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" /></div></div>;
  }

  const totalScans = qrcodes.reduce((a, b) => a + b.scan_count, 0);

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
              {(subscription.status === "active" || subscription.status === "on_trial") && (
                <button onClick={() => setShowCancelConfirm(true)} className="mt-2 px-3 py-1.5 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-xs font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition duration-75 active:scale-[0.95]">
                  {t("proCancel")}
                </button>
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

      {qrcodes.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
          <h2 className="text-xl font-semibold mb-2">{t("dashboardEmpty")}</h2>
          <p className="text-gray-500 mb-6">{t("dashboardEmptyDesc")}</p>
          <Link href="/" className="inline-block px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition duration-75 active:scale-[0.95]">{t("dashboardCreateFirst")}</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold">{t("dashboardMyQRs")}</h2>
            {qrcodes.map(qr => (
              <div key={qr.id} className={`bg-white dark:bg-gray-900 rounded-2xl border p-4 transition-colors cursor-pointer hover:border-purple-300 dark:hover:border-purple-700 ${selectedQR === qr.id ? "border-purple-500" : "border-gray-200 dark:border-gray-800"}`} onClick={() => viewStats(qr.id)}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 flex-shrink-0 bg-white rounded-xl p-1 border border-gray-100 dark:border-gray-700">
                    <div id={`svg-container-${qr.id}`} style={{ width: "100%", height: "100%" }}>
                      <QRCodeSVG value={qr.content} size={48} level="L" fgColor={qr.config?.fgColor || "#111827"} bgColor={qr.config?.bgColor || "#ffffff"} style={{ width: "100%", height: "100%" }} />
                    </div>
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
          ) : selectedQR && stats ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{t("dashboardStats")}</h3>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-purple-600">{stats.total}</p>
                <p className="text-sm text-gray-400">{t("dashboardTotalScans")}</p>
              </div>
              {stats.daily.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">{t("dashboardLast30")}</p>
                  <div className="flex items-end gap-1 h-20">
                    {stats.daily.slice(0, 14).reverse().map(d => {
                      const max = Math.max(...stats.daily.map(x => x.count), 1);
                      const h = Math.max(4, (d.count / max) * 64);
                      return (
                        <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-[10px] text-gray-400">{d.count}</span>
                          <div className="w-full bg-purple-200 dark:bg-purple-900/40 rounded-t" style={{ height: `${h}px` }} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {stats.recent.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">{t("dashboardRecent")}</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
                    {stats.recent.map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-gray-400 pb-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                        <span className="text-gray-600 dark:text-gray-300 w-16 flex-shrink-0">{new Date(s.scanned_at).toLocaleDateString()}</span>
                        <span className="truncate flex-1">{s.referrer ? new URL(s.referrer).hostname : t("dashboardDirect")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 flex items-center justify-center">
              <p className="text-gray-400 text-sm">{t("dashboardSelectQR")}</p>
            </div>
          )}
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
