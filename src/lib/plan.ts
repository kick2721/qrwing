import { auth } from "./auth";
import { query } from "./db";
import { FREE_MAX_QR } from "./constants";

export async function getUserPlan(): Promise<{ plan: string; qrCount: number; qrLimit: number }> {
  const session = await auth();
  if (!session?.user?.id) return { plan: "free", qrCount: 0, qrLimit: 0 };

  let plan = "free";
  try {
    const [user] = await query(`SELECT plan FROM public.users WHERE id = $1`, [session.user.id]);
    plan = user?.plan || "free";
  } catch {
    plan = "free";
  }

  const [count] = await query(`SELECT COUNT(*)::int AS count FROM public.qrcodes WHERE user_id = $1`, [session.user.id]);

  return {
    plan,
    qrCount: count?.count || 0,
    qrLimit: plan === "free" ? FREE_MAX_QR : Infinity,
  };
}
