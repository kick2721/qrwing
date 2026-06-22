import { query } from "@/lib/db";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function RedirectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await query(`SELECT redirect_to, type FROM public.qrcodes WHERE id = $1`, [id]);
  if (rows.length === 0) redirect("/");

  const qr = rows[0];
  const h = await headers();

  try {
    await query(
      `INSERT INTO public.scans (qr_id, ip, user_agent, referrer) VALUES ($1, $2, $3, $4)`,
      [
        id,
        h.get("x-forwarded-for") || h.get("x-real-ip") || "",
        h.get("user-agent") || "",
        h.get("referer") || "",
      ]
    );
  } catch {}

  const dest = qr.redirect_to;
  if (qr.type === "email") {
    redirect(`/mail?to=${encodeURIComponent(dest)}`);
  } else {
    redirect(dest.startsWith("http") ? dest : `https://${dest}`);
  }
}
