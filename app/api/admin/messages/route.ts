import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase";
import { guard, serverError } from "@/lib/adminApi";
import type { MessageStatus } from "@/types";

const STATUSES: MessageStatus[] = ["new", "read", "replied"];

/** GET /api/admin/messages?status= — pesan masuk terbaru */
export async function GET(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let query = adminClient()
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (status && STATUSES.includes(status as MessageStatus)) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return serverError(error.message);
  return NextResponse.json({ messages: data ?? [] });
}
