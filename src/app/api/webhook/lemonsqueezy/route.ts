import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import crypto from "crypto";

const WEBHOOK_SECRET = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || "";

function verifySignature(rawBody: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) return true;
  const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
  const digest = hmac.update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature") || "";

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventName = event.meta?.event_name;
  const attrs = event.data?.attributes;
  const customData = event.meta?.custom_data || {};

  if (!eventName || !attrs) {
    return NextResponse.json({ error: "Missing event data" }, { status: 400 });
  }

  const userId = customData.user_id;

  try {
    switch (eventName) {
      case "order_created": {
        const orderId = event.data?.id?.toString();
        const subId = attrs.first_subscription?.id?.toString();

        if (!userId) break;

        await query(
          `INSERT INTO subscriptions (user_id, plan, status, lemon_squeezy_order_id, lemon_squeezy_subscription_id)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (user_id) DO UPDATE SET
             plan = $2, status = $3, lemon_squeezy_order_id = $4,
             lemon_squeezy_subscription_id = COALESCE($5, lemon_squeezy_subscription_id),
             updated_at = NOW()`,
          [userId, "pro", "active", orderId, subId]
        );
        break;
      }

      case "subscription_created":
      case "subscription_updated": {
        const subId = event.data?.id;
        const status = attrs.status;
        const customerId = attrs.customer_id?.toString();
        const trialEndsAt = attrs.trial_ends_at;
        const expiresAt = attrs.renews_at || attrs.ends_at;

        if (!userId && !subId) break;

        if (userId) {
          await query(
            `INSERT INTO subscriptions (user_id, plan, status, lemon_squeezy_subscription_id, lemon_squeezy_customer_id, expires_at, trial_ends_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             ON CONFLICT (user_id) DO UPDATE SET
               plan = $2, status = $3, lemon_squeezy_subscription_id = $4,
               lemon_squeezy_customer_id = $5, expires_at = $6, trial_ends_at = $7,
               updated_at = NOW()`,
            [userId, "pro", status, subId, customerId, expiresAt, trialEndsAt]
          );
        } else if (subId) {
          await query(
            `UPDATE subscriptions SET status = $1, updated_at = NOW()
             WHERE lemon_squeezy_subscription_id = $2`,
            [status, subId]
          );
        }
        break;
      }

      case "subscription_cancelled": {
        const subId = event.data?.id;
        if (subId) {
          await query(
            `UPDATE subscriptions SET status = $1, updated_at = NOW()
             WHERE lemon_squeezy_subscription_id = $2`,
            ["cancelled", subId]
          );
        }
        break;
      }

      case "subscription_expired": {
        const subId = event.data?.id;
        if (subId) {
          await query(
            `UPDATE subscriptions SET status = $1, updated_at = NOW()
             WHERE lemon_squeezy_subscription_id = $2`,
            ["expired", subId]
          );
        }
        break;
      }
    }
  } catch (e) {
    console.error("Webhook handler error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
