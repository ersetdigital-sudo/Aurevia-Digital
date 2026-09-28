import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase";
import { badRequest, guard, serverError, str } from "@/lib/adminApi";
import type { OrderStatus } from "@/types";

type Params = { params: Promise<{ id: string }> };

const STATUSES: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "success",
  "failed",
  "refunded",
];

/** PATCH /api/admin/orders/[id] — ubah status / catatan pesanan */
export async function PATCH(request: Request, { params }: Params) {
  const denied = await guard();
  if (denied) return denied;

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  const patch: Record<string, unknown> = {};
  if (typeof body.status === "string") {
    if (!STATUSES.includes(body.status as OrderStatus)) {
      return badRequest("Status tidak dikenal.");
    }
    patch.status = body.status;
  }
  if ("note" in body) patch.note = str(body.note as string, "", 500) || null;
  if (typeof body.invoice_no === "string") patch.invoice_no = str(body.invoice_no, "", 60) || null;

  if (Object.keys(patch).length === 0) return badRequest("Tidak ada perubahan.");

  const { data, error } = await adminClient()
    .from("orders")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) return serverError(error.message);
  return NextResponse.json({ order: data });
}

/** DELETE /api/admin/orders/[id] — hapus pesanan */
export async function DELETE(_request: Request, { params }: Params) {
  const denied = await guard();
  if (denied) return denied;

  const { id } = await params;
  const { error } = await adminClient().from("orders").delete().eq("id", id);
  if (error) return serverError(error.message);
  return NextResponse.json({ ok: true });
}
