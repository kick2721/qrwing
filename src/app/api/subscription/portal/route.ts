import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getFullSubscription } from "@/lib/plan";
import { getCustomerPortalUrl } from "@/lib/lemon-squeezy";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sub = await getFullSubscription(session.user.id);
  if (!sub?.lemon_squeezy_customer_id) {
    return NextResponse.json({ error: "No customer found" }, { status: 404 });
  }

  const url = await getCustomerPortalUrl(sub.lemon_squeezy_customer_id);
  if (!url) {
    return NextResponse.json({ error: "Failed to generate portal URL" }, { status: 500 });
  }

  return NextResponse.json({ url });
}
