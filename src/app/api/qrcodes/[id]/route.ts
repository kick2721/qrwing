import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { getUserPlan } from "@/lib/plan";
import { NextResponse } from "next/server";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const rows = await query(
    `DELETE FROM public.qrcodes WHERE id = $1 AND user_id = $2 RETURNING id`,
    [id, session.user.id]
  );

  if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan } = await getUserPlan();
  if (plan !== "pro") return NextResponse.json({ error: "Pro plan required" }, { status: 402 });

  const { id } = await params;
  const { type, redirect_to, label, config } = await req.json();

  const rows = await query(
    `UPDATE public.qrcodes SET type = $1, redirect_to = $2, label = $3, config = $4 WHERE id = $5 AND user_id = $6 RETURNING *`,
    [type, redirect_to, label || "", JSON.stringify(config || {}), id, session.user.id]
  );

  if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}
