import { query } from "@/lib/db";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

async function getCountry(ip: string): Promise<string> {
  if (!ip || ip === "::1" || ip === "127.0.0.1" || ip.startsWith("10.") || ip.startsWith("192.168.") || ip.startsWith("172.16.")) return "";
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=country`, { signal: AbortSignal.timeout(1000) });
    if (res.ok) {
      const data = await res.json();
      return data.country || "";
    }
  } catch {}
  return "";
}

function parseVCard(text: string) {
  const get = (k: string) => {
    const m = text.match(new RegExp(`${k}:(.+)`));
    return m ? m[1].trim() : "";
  };
  return { name: get("FN"), phone: get("TEL"), email: get("EMAIL") };
}

function parseSms(text: string) {
  const m = text.match(/^smsto:(.+?):(.+)$/);
  return m ? { phone: m[1], message: m[2] } : { phone: text.replace("smsto:", ""), message: "" };
}

function parseVCalendar(text: string) {
  const get = (k: string) => {
    const m = text.match(new RegExp(`${k}:(.+)`));
    return m ? m[1].trim() : "";
  };
  const dtstart = get("DTSTART");
  const dateStr = dtstart ? dtstart.replace(/(\d{4})(\d{2})(\d{2})T?(\d{0,2})(\d{0,2})/, (_, y, m, d, h, min) => {
    return `${y}-${m}-${d}${h ? ` ${h}:${min || "00"}` : ""}`;
  }) : "";
  return { title: get("SUMMARY"), date: dateStr, location: get("LOCATION"), description: get("DESCRIPTION") };
}

async function getScanCount(id: string): Promise<number> {
  try {
    const rows = await query(`SELECT COUNT(*) AS cnt FROM public.scans WHERE qr_id = $1`, [id]);
    return rows[0]?.cnt || 0;
  } catch { return 0; }
}

function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center shadow-lg">
        <p className="text-sm font-semibold text-purple-600 mb-4 text-center">QRWing</p>
        {children}
      </div>
    </div>
  );
}

export default async function RedirectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await query(`SELECT redirect_to, type FROM public.qrcodes WHERE id = $1`, [id]);
  if (rows.length === 0) redirect("/");

  const qr = rows[0];
  const h = await headers();
  const ip = (h.get("x-forwarded-for") || "").split(",")[0]?.trim() || h.get("x-real-ip") || "";

  try {
    const countryPromise = getCountry(ip);
    const country = await countryPromise;
    await query(
      `INSERT INTO public.scans (qr_id, ip, user_agent, referrer, country) VALUES ($1, $2, $3, $4, $5)`,
      [
        id,
        ip,
        h.get("user-agent") || "",
        h.get("referer") || "",
        country,
      ]
    );
  } catch {}

  if (qr.type === "text") {
    return (
      <LandingLayout>
        <p className="text-lg text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{qr.redirect_to}</p>
      </LandingLayout>
    );
  }

  if (qr.type === "vcard") {
    const v = parseVCard(qr.redirect_to);
    return (
      <LandingLayout>
        <p className="text-sm font-semibold text-purple-600 mb-2">Contacto</p>
        <p className="text-xl font-bold mb-1">{v.name}</p>
        {v.phone && <p className="text-gray-500">📞 {v.phone}</p>}
        {v.email && <p className="text-gray-500">✉️ {v.email}</p>}
      </LandingLayout>
    );
  }

  if (qr.type === "wifi") {
    return (
      <LandingLayout>
        <p className="text-sm font-semibold text-purple-600 mb-2">WiFi</p>
        <p className="text-gray-500">Escanea este QR con la cámara de tu teléfono para conectarte a la red WiFi.</p>
      </LandingLayout>
    );
  }

  if (qr.type === "phone") {
    const number = qr.redirect_to.replace("tel:", "");
    const scanCount = await getScanCount(id);
    return (
      <LandingLayout>
        <p className="text-sm font-semibold text-purple-600 mb-2">Teléfono</p>
        <p className="text-2xl font-bold mb-4">{number}</p>
        <a href={qr.redirect_to} className="inline-block px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors mb-3">📞 Llamar</a>
        <p className="text-xs text-gray-400">{scanCount} escaneos</p>
      </LandingLayout>
    );
  }

  if (qr.type === "sms") {
    const s = parseSms(qr.redirect_to);
    const scanCount = await getScanCount(id);
    return (
      <LandingLayout>
        <p className="text-sm font-semibold text-purple-600 mb-2">SMS</p>
        <p className="text-xl font-bold mb-1">{s.phone}</p>
        {s.message && <p className="text-gray-500 text-sm mb-4">{s.message}</p>}
        <a href={qr.redirect_to} className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors mb-3">✉️ Enviar SMS</a>
        <p className="text-xs text-gray-400">{scanCount} escaneos</p>
      </LandingLayout>
    );
  }

  if (qr.type === "location") {
    const query = decodeURIComponent(qr.redirect_to.replace("https://maps.google.com/maps?q=", ""));
    const scanCount = await getScanCount(id);
    return (
      <LandingLayout>
        <p className="text-sm font-semibold text-purple-600 mb-2">Ubicación</p>
        <p className="text-gray-700 dark:text-gray-200 mb-4 break-words">{query}</p>
        <a href={qr.redirect_to} className="inline-block px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors mb-3">📍 Abrir en Maps</a>
        <p className="text-xs text-gray-400">{scanCount} escaneos</p>
      </LandingLayout>
    );
  }

  if (qr.type === "calendar") {
    const ev = parseVCalendar(qr.redirect_to);
    const scanCount = await getScanCount(id);
    return (
      <LandingLayout>
        <p className="text-sm font-semibold text-purple-600 mb-2">Evento</p>
        <p className="text-xl font-bold mb-1">{ev.title || "Evento"}</p>
        {ev.date && <p className="text-gray-500 text-sm">📅 {ev.date}</p>}
        {ev.location && <p className="text-gray-500 text-sm">📍 {ev.location}</p>}
        {ev.description && <p className="text-gray-400 text-xs mt-2">{ev.description}</p>}
        <p className="text-xs text-gray-400 mt-4">{scanCount} escaneos</p>
      </LandingLayout>
    );
  }

  const dest = qr.redirect_to;
  redirect(dest.startsWith("http") ? dest : `https://${dest}`);
}
