import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase";
import { badRequest, guard, serverError } from "@/lib/adminApi";
import type { MessageStatus } from "@/types";

type Params = { params: Promise<{ id: string }> };

const STATUSES: MessageStatus[] = ["new", "read", "replied"];

/** PATCH /api/admin/messages/[id] — ubah status pesan */
export async function PATCH(request: Request, { params }: Params) {
  const denied = await guard();
  if (denied) return denied;

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as { status?: string };
  if (!body.status || !STATUSES.includes(body.status as MessageStatus)) {
    return badRequest("Status tidak dikenal.");
  }

  const { data, error } = await adminClient()
    .from("messages")
    .update({ status: body.status })
    .eq("id", id)
    .select()
    .single();

  if (error) return serverError(error.message);
  return NextResponse.json({ message: data });
}

/** DELETE /api/admin/messages/[id] — hapus pesan */
export async function DELETE(_request: Request, { params }: Params) {
  const denied = await guard();
  if (denied) return denied;

  const { id } = await params;
  const { error } = await adminClient().from("messages").delete().eq("id", id);
  if (error) return serverError(error.message);
  return NextResponse.json({ ok: true });
}
