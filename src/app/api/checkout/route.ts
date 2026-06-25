import { auth } from "@/lib/auth";
import { createCheckoutUrl } from "@/lib/lemon-squeezy";
import { NextResponse } from "next/server";

const VARIANT_ID = "1833407";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const origin = request.headers.get("origin") || request.headers.get("referer") || "https://qrwing.vercel.app";

  try {
    const url = await createCheckoutUrl(VARIANT_ID, session.user.email, session.user.id, origin);
    return NextResponse.json({ url });
  } catch (e) {
    console.error("Checkout error:", e);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}
