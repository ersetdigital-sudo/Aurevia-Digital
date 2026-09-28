import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase";
import { guard, serverError, str } from "@/lib/adminApi";
import type { OrderStatus } from "@/types";

const STATUSES: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "success",
  "failed",
  "refunded",
];

/** GET /api/admin/orders?status=&q=&limit= — daftar pesanan terbaru */
export async function GET(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const q = str(searchParams.get("q") ?? "", "", 60);
  const limit = Math.min(Number(searchParams.get("limit")) || 100, 500);

  let query = adminClient()
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (status && STATUSES.includes(status as OrderStatus)) query = query.eq("status", status);
  if (q) query = query.or(`ref.ilike.%${q}%,target.ilike.%${q}%,product.ilike.%${q}%`);

  const { data, error } = await query;
  if (error) return serverError(error.message);
  return NextResponse.json({ orders: data ?? [] });
}
