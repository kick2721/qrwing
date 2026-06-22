"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import QRCode from "qrcode";
import { useLang } from "@/context/LangContext";

interface QRCodeData {
  id: string;
  type: string;
  content: string;
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

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
    if (status !== "authenticated") return;
    fetch("/api/qrcodes").then(r => r.json()).then(d => { setQrcodes(d); setLoading(false); });
  }, [status, router]);

  function confirmDelete(id: string) {
    setDeleteConfirm(id);
  }

  async function deleteQR() {
    if (!deleteConfirm) return;
    await fetch(`/api/qrcodes/${deleteConfirm}`, { method: "DELETE" });
    setQrcodes(prev => prev.filter(q => q.id !== deleteConfirm));
    if (selectedQR === deleteConfirm) { setSelectedQR(null); setStats(null); }
    setDeleteConfirm(null);
  }

  async function viewStats(id: string) {
    setSelectedQR(id);
    const r = await fetch(`/api/qrcodes/${id}/scans`);
    setStats(await r.json());
  }

  async function downloadQR(qr: QRCodeData, format: "png" | "svg") {
    if (format === "png") {
      const url = await QRCode.toDataURL(qr.content, {
        width: 512,
        margin: 2,
        color: { dark: "#111827", light: "#ffffff" },
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
        <Link href="/" className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-transform active:scale-[0.95]">{t("dashboardNewQR")}</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
          <p className="text-sm text-gray-400">{t("dashboardCreated")}</p>
          <p className="text-3xl font-bold mt-1">{qrcodes.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
          <p className="text-sm text-gray-400">{t("dashboardScans")}</p>
          <p className="text-3xl font-bold mt-1">{totalScans}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
          <p className="text-sm text-gray-400">{t("dashboardPlan")}</p>
          <p className="text-lg font-bold mt-1 text-purple-600">{t("dashboardFree")}</p>
        </div>
      </div>

      {qrcodes.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
          <p className="text-4xl mb-4">🪄</p>
          <h2 className="text-xl font-semibold mb-2">{t("dashboardEmpty")}</h2>
          <p className="text-gray-500 mb-6">{t("dashboardEmptyDesc")}</p>
          <Link href="/" className="inline-block px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-transform active:scale-[0.95]">{t("dashboardCreateFirst")}</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`${selectedQR ? "lg:col-span-2" : "lg:col-span-3"} space-y-4`}>
            <h2 className="text-lg font-semibold">{t("dashboardMyQRs")}</h2>
            {qrcodes.map(qr => (
              <div key={qr.id} className={`bg-white dark:bg-gray-900 rounded-2xl border p-4 transition-colors cursor-pointer hover:border-purple-300 dark:hover:border-purple-700 ${selectedQR === qr.id ? "border-purple-500" : "border-gray-200 dark:border-gray-800"}`} onClick={() => viewStats(qr.id)}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 flex-shrink-0 bg-white rounded-xl p-1 border border-gray-100 dark:border-gray-700">
                    <div id={`svg-container-${qr.id}`} style={{ width: "100%", height: "100%" }}>
                      <QRCodeSVG value={qr.content} size={48} level="L" fgColor="#111827" style={{ width: "100%", height: "100%" }} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{qr.label || qr.content}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                      <span>{typeIcon(qr.type)} {typeLabel(qr.type)}</span>
                      <span>👁 {qr.scan_count} {t("dashboardScansLabel")}</span>
                      <span>{new Date(qr.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {selectedQR === qr.id && (
                      <>
                        <button onClick={e => { e.stopPropagation(); downloadQR(qr, "png"); }} className="text-gray-400 hover:text-gray-600 text-xs px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-transform active:scale-[0.9]">📥 PNG</button>
                        <button onClick={e => { e.stopPropagation(); downloadQR(qr, "svg"); }} className="text-gray-400 hover:text-gray-600 text-xs px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-transform active:scale-[0.9]">📄 SVG</button>
                        <span className="text-gray-300 dark:text-gray-700">|</span>
                      </>
                    )}
                    <button onClick={e => { e.stopPropagation(); confirmDelete(qr.id); }} className="text-red-400 hover:text-red-600 text-sm px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-transform active:scale-[0.9]">{t("dashboardDelete")}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedQR && stats && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{t("dashboardStats")}</h3>
                <button onClick={() => { setSelectedQR(null); setStats(null); }} className="text-gray-400 hover:text-gray-600 text-sm transition-transform active:scale-[0.85]">✕</button>
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
          )}
        </div>
      )}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2">{t("dashboardConfirmTitle")}</h3>
            <p className="text-sm text-gray-500 mb-6">{t("dashboardConfirmDesc")}</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-transform active:scale-[0.95]">
                {t("dashboardCancel")}
              </button>
              <button onClick={deleteQR} className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-transform active:scale-[0.95]">
                {t("dashboardConfirmDelete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
