import { auth } from "@/lib/auth";
import { getUserPlan } from "@/lib/plan";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ plan: "free", qrCount: 0, qrLimit: 0 });

  const data = await getUserPlan();
  return NextResponse.json(data);
}
