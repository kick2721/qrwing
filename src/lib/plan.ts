import { auth } from "./auth";
import { query } from "./db";
import { FREE_MAX_QR } from "./constants";

const ACTIVE_STATUSES = ["active", "on_trial", "paused"];

export async function getUserPlan(): Promise<{ plan: string; qrCount: number; qrLimit: number }> {
  const session = await auth();
  if (!session?.user?.id) return { plan: "free", qrCount: 0, qrLimit: 0 };

  let plan = "free";
  try {
    const [sub] = await query(
      `SELECT plan, status, expires_at FROM public.subscriptions WHERE user_id = $1`,
      [session.user.id]
    );
    if (sub && ACTIVE_STATUSES.includes(sub.status)) {
      if (sub.expires_at && new Date(sub.expires_at) < new Date()) {
        plan = "free";
      } else {
        plan = sub.plan || "free";
      }
    }
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

export async function getFullSubscription(userId: string) {
  try {
    const [sub] = await query(
      `SELECT plan, status, lemon_squeezy_subscription_id, lemon_squeezy_customer_id, expires_at, trial_ends_at, created_at
       FROM public.subscriptions WHERE user_id = $1`,
      [userId]
    );
    return sub || null;
  } catch {
    return null;
  }
}
