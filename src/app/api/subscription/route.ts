import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getFullSubscription } from "@/lib/plan";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sub = await getFullSubscription(session.user.id);
  if (!sub) return NextResponse.json({ plan: "free" });

  return NextResponse.json(sub);
}
